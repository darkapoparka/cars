import {mkdir, mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

export const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
export async function createBrowser(output = 'reference/2026-09-26-continuation/verification') {
  const root = path.resolve(process.env.QA_REPORT_DIR ?? output), base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4173';
  await mkdir(root, {recursive: true});
  const profile = await mkdtemp(path.join(os.tmpdir(), 'cars24-continuation-qa-'));
  const child = spawn(process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--disable-extensions', '--disable-background-networking', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], {stdio: 'ignore', windowsHide: true});
  let socket, sequence = 1, route = '';
  const pending = new Map(), checks = [], captures = [], errors = [];
  async function close() {
    if (socket?.readyState === WebSocket.OPEN) socket.close();
    child.kill();
    for (const item of pending.values()) {clearTimeout(item.timer); item.reject(Error('Browser closed'));}
    pending.clear();
    await sleep(400);
    await rm(profile, {recursive: true, force: true, maxRetries: 3, retryDelay: 250}).catch(() => {});
  }
  try {
    let port;
    for (let attempt = 0; attempt < 120; attempt++) {
      try {port = (await readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split(/\r?\n/)[0]; break;} catch {await sleep(100);}
    }
    if (!port) throw Error('Isolated Chrome did not start');
    const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, {method: 'PUT'});
    if (!response.ok) throw Error(`Chrome target HTTP ${response.status}`);
    const target = await response.json();
    socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {socket.addEventListener('open', resolve, {once: true}); socket.addEventListener('error', reject, {once: true});});
    socket.addEventListener('message', event => {
      const value = JSON.parse(String(event.data));
      if (value.method === 'Runtime.exceptionThrown') errors.push({route, type: 'exception', ...value.params.exceptionDetails});
      if (value.method === 'Runtime.consoleAPICalled' && value.params.type === 'error') errors.push({route, type: 'console', message: value.params.args.map(arg => arg.value ?? arg.description).join(' ')});
      if (value.method === 'Network.responseReceived' && value.params.response.status >= 400) errors.push({route, type: 'http', status: value.params.response.status, url: value.params.response.url});
      const item = pending.get(value.id); if (!item) return;
      clearTimeout(item.timer); pending.delete(value.id);
      if (value.error) item.reject(Error(`${item.method}: ${value.error.message}`)); else item.resolve(value.result);
    });
    function send(method, params = {}) {
      const id = sequence++;
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {pending.delete(id); reject(Error(`CDP timeout: ${method}`));}, 45000);
        pending.set(id, {method, resolve, reject, timer}); socket.send(JSON.stringify({id, method, params}));
      });
    }
    async function evaluate(expression) {
      const value = await send('Runtime.evaluate', {expression, awaitPromise: true, returnByValue: true});
      if (value.exceptionDetails) throw Error(value.exceptionDetails.exception?.description ?? value.exceptionDetails.text);
      return value.result?.value;
    }
    async function waitFor(expression, description = expression) {
      for (let attempt = 0; attempt < 100; attempt++) {try {if (await evaluate(expression)) return;} catch {} await sleep(100);}
      throw Error(`Timed out: ${description}`);
    }
    async function viewport(width = 427, height = 952) {await send('Emulation.setDeviceMetricsOverride', {width, height, deviceScaleFactor: 1, mobile: width < 768, screenWidth: width, screenHeight: height});}
    async function navigate(next) {
      route = next;
      await send('Page.navigate', {url: new URL(next, base).href});
      await waitFor(`document.readyState === 'complete' && location.pathname === ${JSON.stringify(next.split('?')[0])} && !!document.querySelector('main,section')`, 'navigation complete');
      await waitFor(`!![...document.querySelectorAll('button,a')].find(element => Object.keys(element).some(key => key.startsWith('__reactProps$')))`, 'React hydration');
      await evaluate('document.fonts.ready.then(() => true)'); await sleep(200);
    }
    async function click(expression) {
      await evaluate(`(() => {const element = ${expression}; if (!element) throw Error('Missing click target: ' + ${JSON.stringify(expression)}); if (element.disabled) throw Error('Click target is disabled'); element.click();})()`);
      await sleep(300);
    }
    async function clickText(text, tag = 'button') {return click(`[...document.querySelectorAll(${JSON.stringify(tag)})].find(element => element.textContent.trim() === ${JSON.stringify(text)})`);}
    async function input(selector, text) {
      await evaluate(`(() => {const element = document.querySelector(${JSON.stringify(selector)}); if (!element) throw Error('Missing input ${selector.replaceAll("'", '')}'); const prototype = element.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(prototype, 'value').set.call(element, ${JSON.stringify(String(text))}); element.dispatchEvent(new Event(element.tagName === 'SELECT' ? 'change' : 'input', {bubbles: true}));})()`);
      await sleep(200);
    }
    async function key(key, keyCode) {for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', {type, key, code: key, windowsVirtualKeyCode: keyCode}); await sleep(250);}
    async function back() {await evaluate('history.back()'); await sleep(500);}
    async function scroll(top) {await evaluate(`window.scrollTo({top:${top},behavior:'instant'})`); await sleep(350);}
    function check(name, passed, details) {checks.push({name, passed: Boolean(passed), ...(details === undefined ? {} : {details})}); console.log(`${passed ? 'PASS' : 'FAIL'} ${name}${passed || details === undefined ? '' : ` ${JSON.stringify(details)}`}`);}
    async function capture(name) {
      await evaluate('document.fonts.ready.then(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))');
      await sleep(650);
      const metrics = await evaluate(`({path: location.pathname, query: location.search, width: innerWidth, height: innerHeight, scrollY, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, dialogs: [...document.querySelectorAll('[role=dialog]')].map(element => ({name: element.getAttribute('aria-label') || element.getAttribute('aria-labelledby'), rect: element.getBoundingClientRect().toJSON()})), headings: [...document.querySelectorAll('h1,h2')].slice(0,20).map(element => ({text: element.textContent, rect: element.getBoundingClientRect().toJSON(), font: getComputedStyle(element).font})), brokenImages: [...document.images].filter(image => image.complete && !image.naturalWidth).map(image => image.getAttribute('src')), navigation: [...document.querySelectorAll('[aria-current=page]')].filter(element => element.getClientRects().length).map(element => element.textContent.trim())})`);
      const image = await send('Page.captureScreenshot', {format: 'png', captureBeyondViewport: false});
      await writeFile(path.join(root, `${name}.png`), Buffer.from(image.data, 'base64'));
      captures.push({name, ...metrics});
      check(`${name}: no horizontal overflow`, metrics.scrollWidth <= metrics.width, metrics);
      check(`${name}: no broken images`, !metrics.brokenImages.length, metrics.brokenImages);
      return metrics;
    }
    async function report() {
      const report = {createdAt: new Date().toISOString(), base, checks, captures, errors};
      await writeFile(path.join(root, 'results.json'), JSON.stringify(report, null, 2));
      const summary = {passed: checks.filter(item => item.passed).length, failed: checks.filter(item => !item.passed).length, screenshots: captures.length, browserErrors: errors.length, root};
      console.log(JSON.stringify(summary));
      return summary;
    }
    await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable'); await viewport();
    return {root, base, errors, checks, captures, send, evaluate, waitFor, viewport, navigate, click, clickText, input, key, back, scroll, check, capture, report, close};
  } catch (error) {await close(); throw error;}
}
