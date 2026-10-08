import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

const [url = 'http://127.0.0.1:4173/', output = 'reference/runtime/cdp.png', widthArg = '427', heightArg = '952'] = process.argv.slice(2);
const width = Number(widthArg);
const height = Number(heightArg);
const chrome = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const profile = await mkdtemp(path.join(os.tmpdir(), 'drive24-cdp-'));
const absoluteOutput = path.resolve(output);
await mkdir(path.dirname(absoluteOutput), { recursive: true });

const child = spawn(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--disable-extensions',
  '--disable-background-networking',
  '--hide-scrollbars',
  '--no-first-run',
  '--no-default-browser-check',
  '--remote-debugging-port=0',
  `--user-data-dir=${profile}`,
  'about:blank',
], { stdio: ['ignore', 'ignore', 'ignore'], windowsHide: true });

async function waitForPort() {
  const file = path.join(profile, 'DevToolsActivePort');
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      const [port] = (await readFile(file, 'utf8')).trim().split(/\r?\n/);
      if (port) return port;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Chrome DevTools port did not become ready.');
}

let socket;
try {
  const port = await waitForPort();
  const targetResponse = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent('about:blank')}`, { method: 'PUT' });
  if (!targetResponse.ok) throw new Error(`Could not create Chrome target: ${targetResponse.status}`);
  const target = await targetResponse.json();

  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  let nextId = 1;
  const pending = new Map();
  socket.addEventListener('message', (event) => {
    const payload = JSON.parse(String(event.data));
    if (!payload.id) return;
    const entry = pending.get(payload.id);
    if (!entry) return;
    pending.delete(payload.id);
    if (payload.error) entry.reject(new Error(`${entry.method}: ${payload.error.message}`));
    else entry.resolve(payload.result);
  });

  function send(method, params = {}) {
    const id = nextId++;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject, method });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 768,
    screenWidth: width,
    screenHeight: height,
    positionX: 0,
    positionY: 0,
    dontSetVisibleSize: false,
  });
  await send('Emulation.setTouchEmulationEnabled', { enabled: width < 768, maxTouchPoints: 5 });
  if (width < 768) await send('Emulation.setUserAgentOverride', {
    userAgent: 'Mozilla/5.0 (Linux; Android 16; Pixel 9 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
    platform: 'Android',
  });
  await send('Page.navigate', { url });

  await send('Runtime.evaluate', {
    expression: `new Promise((resolve) => {
      const finish = async () => {
        try {
          await document.fonts.ready;
          await Promise.all([...document.images].map((img) => img.complete ? null : new Promise((done) => {
            img.addEventListener('load', done, { once: true });
            img.addEventListener('error', done, { once: true });
          })));
        } finally {
          setTimeout(resolve, 1600);
        }
      };
      if (document.readyState === 'complete') finish();
      else addEventListener('load', finish, { once: true });
      setTimeout(resolve, 7000);
    })`,
    awaitPromise: true,
    returnByValue: true,
  });

  const metrics = await send('Runtime.evaluate', {
    expression: `({
      innerWidth,
      innerHeight,
      devicePixelRatio,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      bodyWidth: document.body.getBoundingClientRect().width
    })`,
    returnByValue: true,
  });
  const capture = await send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: false,
  });
  await writeFile(absoluteOutput, Buffer.from(capture.data, 'base64'));
  console.log(JSON.stringify({ url, output: absoluteOutput, width, height, metrics: metrics.result.value }));
} finally {
  if (socket?.readyState === WebSocket.OPEN) socket.close();
  child.kill();
  await new Promise((resolve) => setTimeout(resolve, 500));
  await rm(profile, { recursive: true, force: true, maxRetries: 4, retryDelay: 250 }).catch(() => {});
}
