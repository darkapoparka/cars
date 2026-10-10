import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { switcherConfiguration } from './package-dealer.mjs';

const source = readFileSync(new URL('./publishing/preview-switcher.js', import.meta.url), 'utf8');
const variants = [
  { key: 'auto-best', base: '', entry: '/' },
  { key: 'modern', base: '/variant-2', entry: '/variant-2/cars' },
  { key: 'import', base: '/variant-3', entry: '/variant-3/' },
  { key: 'app', base: '/variant-4', entry: '/variant-4/' },
  { key: 'mobile', base: '/variant-5', entry: '/variant-5/' },
];
function config(overrides = {}) {
  return { language: 'bg', variants: structuredClone(variants), localization: {
    defaultLocale: 'bg', enabledLocales: ['en', 'bg'], messages: {
      en: { design: 'Design', choose: 'Choose', title: 'Choose a design' },
      bg: { design: 'Дизайн', choose: 'Избор', title: 'Избор на дизайн' },
    },
  }, ...overrides };
}

// In-memory DOM contract harness. No servers, network, browser profiles or files
// are created. This checks executable routing/focus logic, not visual acceptance.
function render(input = config(), address = 'https://dealer.example/bg', documentLanguage = 'bg', viewport = { mobile: true }) {
  let shadow;
  class Element {
    constructor(tag = 'div') { this.tagName = tag; this.children = []; this.dataset = {}; this.attributes = {}; this.listeners = {}; this.hidden = false; this.style = { setProperty() {} }; }
    append(...items) { this.children.push(...items); }
    setAttribute(key, value) { this.attributes[key] = value; }
    getAttribute(key) { return this.attributes[key] ?? null; }
    removeAttribute(key) { delete this.attributes[key]; }
    addEventListener(name, handler) { (this.listeners[name] ??= []).push(handler); }
    fire(name, event = {}) { for (const fn of this.listeners[name] ?? []) fn(event); }
    focus() { shadow.activeElement = this; }
    querySelectorAll(selector) {
      const matches = node => selector.split(',').some(part => part.startsWith('.')
        ? node.className?.split(' ').includes(part.slice(1))
        : part === '[aria-current="page"]' ? node.attributes['aria-current'] === 'page' : node.tagName === part);
      const found = [];
      const walk = node => { for (const child of node.children) { if (matches(child)) found.push(child); walk(child); } };
      walk(this); return found;
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] ?? null; }
    attachShadow() {
      shadow = new Element('shadow');
      const nodes = new Map();
      for (const name of ['fab', 'fab-artwork', 'sheet', 'backdrop', 'close', 'design-grid', 'heading', 'fab-label', 'count', 'admin']) {
        const node = new Element(['fab', 'close'].includes(name) ? 'button' : name === 'admin' ? 'a' : 'div');
        node.className = name; nodes.set('.' + name, node);
      }
      nodes.get('.sheet').hidden = true;
      nodes.get('.backdrop').hidden = true;
      nodes.get('.sheet').append(nodes.get('.close'), nodes.get('.design-grid'), nodes.get('.admin'));
      nodes.get('.admin').append(new Element('strong'));
      shadow.querySelector = selector => nodes.get(selector) ?? null;
      this.shadowRoot = shadow; return shadow;
    }
  }
  const document = new Element('document');
  document.documentElement = { lang: documentLanguage, style: { overflow: '' } };
  document.body = new Element('body'); document.head = new Element('head');
  document.createElement = tag => new Element(tag);
  document.querySelector = selector => document.body.children.find(node => selector.split(', ').includes(node.tagName)) ?? null;
  const current = new URL(address);
  const navigations = [];
  const location = { origin: current.origin, hostname: current.hostname, pathname: current.pathname, search: current.search, assign: value => navigations.push(value) };
  const timers = [];
  const viewportChanges = [];
  const media = {get matches(){return viewport.mobile;}, addEventListener(event, listener){if(event === 'change') viewportChanges.push(listener);}};
  const context = vm.createContext({ document, location, URL, URLSearchParams,
    matchMedia: () => media, setTimeout: fn => { timers.push(fn); return timers.length; }, clearTimeout() {}, queueMicrotask: fn => fn(),
  });
  const script = source.replace('__CARS_SWITCHER_CONFIG__', () => JSON.stringify(input).replaceAll('<', '\\u003c'));
  vm.runInContext(script, context, { timeout: 1000 });
  return { document, location, navigations, timers, script, context,
    resize(mobile){viewport.mobile = mobile; viewportChanges.forEach(listener => listener());},
    get host() { return document.body.children[0]; },
    get links() { return shadow.querySelector('.design-grid').querySelectorAll('.design'); },
    get homeLinks() { return shadow.querySelector('.design-grid').querySelectorAll('.home-choice'); },
    get shadow() { return shadow; },
  };
}

test('new five-design packages boot locally without remote JS or timeout', () => {
  const r = render();
  assert.equal(r.document.head.children.length, 0);
  assert.equal(r.timers.length, 0);
  assert.deepEqual(r.links.map(link => link.dataset.designKey), ['auto-best', 'modern', 'import', 'app', 'mobile']);
  assert.equal(r.shadow.querySelector('.count').textContent, '1/5');
  assert.equal(r.links[4].attributes['aria-label'], 'Отвори Мобилен');
  assert.equal(r.links[4].querySelector('.view-pill').textContent, 'Виж');
  assert.match(r.links[4].querySelector('.preview').querySelector('img').src, /^data:image\/webp;base64,/);
});

test('Mobile uses query locale rather than nonexistent /bg and /en paths', () => {
  const r = render();
  assert.deepEqual(r.links.map(link => link.href), ['/bg', '/variant-2/bg/cars', '/variant-3/bg', '/variant-4/bg', '/variant-5/?lang=bg']);
});

test('Mobile query language controls all five destination links', () => {
  const r = render(config(), 'https://dealer.example/variant-5/vehicle/example?lang=en', 'bg');
  assert.equal(r.host.dataset.activeKey, 'mobile');
  assert.equal(r.shadow.querySelector('.count').textContent, '5/5');
  assert.equal(r.links[4].href, '/variant-5/?lang=en');
  assert.equal(r.links[1].href, '/variant-2/en/cars');
  assert.equal(r.links[4].attributes['aria-label'], 'Open Mobile');
  assert.equal(r.links[4].querySelector('.view-pill').textContent, 'View');
});

test('language changes while Mobile is open update menu labels and destinations on open', () => {
  const r = render(config(), 'https://dealer.example/variant-5/?lang=bg');
  r.location.search = '?lang=en';
  r.document.documentElement.lang = 'en';
  r.shadow.querySelector('.fab').fire('click');
  assert.equal(r.links[4].href, '/variant-5/?lang=en');
  assert.equal(r.links[2].href, '/variant-3/en');
  assert.equal(r.links[4].attributes['aria-label'], 'Open Mobile');
  assert.equal(r.links[4].querySelector('.view-pill').textContent, 'View');
  assert.equal(r.host.lang, 'en');
});

test('existing Import slot is preserved and Modern may occupy the old Carwow slot', () => {
  const changed = structuredClone(variants);
  changed[1] = { key: 'import', base: '/variant-2', entry: '/variant-2/' };
  changed[2] = { key: 'modern', base: '/variant-3', entry: '/variant-3/cars' };
  const r = render(config({ variants: changed }));
  assert.equal(r.links[1].href, '/variant-2/bg');
  assert.equal(r.links[2].href, '/variant-3/bg/cars');
  assert.equal(new Set(r.links.map(link => link.dataset.designKey)).size, 5);
});

test('unknown language falls back to the current document locale', () => {
  const r = render(config(), 'https://dealer.example/variant-5/?lang=unknown', 'en');
  assert.equal(r.links[4].href, '/variant-5/?lang=en');
});

test('legacy explicit shared runtime cannot override a Mobile release', () => {
  const r = render(config({ sharedRuntime: 'legacy-v2' }));
  assert.equal(r.document.head.children.length, 0);
  assert.equal(r.links.length, 5);
});

test('legacy four-design fallback remains available by explicit opt-in', () => {
  const r = render(config({ sharedRuntime: 'legacy-v2', variants: variants.slice(0, 4) }));
  assert.equal(r.document.head.children[0].src, 'https://cars-admin-blue.vercel.app/dealer-switcher/v2.js');
  assert.equal(r.document.body.children.length, 0);
  r.timers[0]();
  assert.equal(r.links.length, 4);
});

test('Escape closes the panel, restores page scrolling and returns focus', () => {
  const r = render();
  const fab = r.shadow.querySelector('.fab');
  fab.fire('click');
  assert.equal(r.shadow.querySelector('.sheet').hidden, false);
  assert.equal(r.document.documentElement.style.overflow, 'hidden');
  r.document.fire('keydown', { key: 'Escape', preventDefault() {}, stopImmediatePropagation() {} });
  assert.equal(r.shadow.querySelector('.sheet').hidden, true);
  assert.equal(r.document.documentElement.style.overflow, '');
  assert.equal(r.shadow.activeElement, fab);
});

test('duplicate injection does not append a second FAB', () => {
  const r = render();
  vm.runInContext(r.script, r.context, { timeout: 1000 });
  assert.equal(r.document.body.children.length, 1);
});

test('admin remains a separate link and is not counted as a sixth design', () => {
  const r = render();
  assert.equal(r.links.length, 5);
  assert.equal(new URL(r.shadow.querySelector('.admin').href).hostname, 'cars-admin-blue.vercel.app');
  assert.match(r.shadow.innerHTML, /target="_blank" rel="noopener noreferrer"/);
});

test('six-family selector displays Signature at the Karento source entry and keeps Admin separate', () => {
  const r = render(config({ variants: [...structuredClone(variants), { key: 'karento-best', base: '/variant-6', entry: '/variant-6/' }] }));
  assert.equal(r.links.length, 6);
  assert.equal(r.shadow.querySelector('.count').textContent, '1/6');
  assert.equal(r.links[5].href, '/variant-6/?lang=bg');
  assert.match(r.links[5].attributes['aria-label'], /Signature$/);
  assert.match(r.links[5].querySelector('.preview').querySelector('img').src, /^data:image\/webp;base64,/);
  assert.equal(new URL(r.shadow.querySelector('.admin').href).hostname, 'cars-admin-blue.vercel.app');
});

test('Signature deep links show the sixth choice and switch back to the document locale', () => {
  const r = render(config({ variants: [...structuredClone(variants), { key: 'karento-best', base: '/variant-6', entry: '/variant-6/' }] }), 'https://dealer.example/variant-6/vehicles', 'en');
  assert.equal(r.host.dataset.activeKey, 'karento-best');
  assert.equal(r.shadow.querySelector('.count').textContent, '6/6');
  assert.equal(r.links[5].attributes['aria-current'], 'page');
  assert.equal(r.links[5].href, '/variant-6/?lang=en');
  assert.equal(r.links[0].href, '/en');
  assert.equal(r.links[4].href, '/variant-5/?lang=en');
  r.document.documentElement.lang = 'bg';
  r.shadow.querySelector('.fab').fire('click');
  assert.equal(r.links[5].href, '/variant-6/?lang=bg');
  assert.equal(r.links[0].href, '/bg');
});

test('Signature query locale overrides the document and preserves destination identity', () => {
  const six = [...structuredClone(variants), { key: 'karento-best', base: '/variant-6', entry: '/variant-6/vehicle?id=stock-42&lang=bg#photos' }];
  const r = render(config({ variants: six }), 'https://dealer.example/variant-6/vehicle?id=stock-42&lang=en', 'bg');
  assert.equal(r.host.dataset.activeKey, 'karento-best');
  assert.equal(r.links[5].href, '/variant-6/vehicle?id=stock-42&lang=en#photos');
  assert.equal(r.links[1].href, '/variant-2/en/cars');
  assert.equal(r.links[4].href, '/variant-5/?lang=en');
  assert.equal(r.host.lang, 'en');

  r.location.search = '?id=stock-42&lang=bg';
  r.shadow.querySelector('.fab').fire('click');
  assert.equal(r.links[5].href, '/variant-6/vehicle?id=stock-42&lang=bg#photos');
  assert.equal(r.links[0].href, '/bg');
  assert.equal(r.links[4].href, '/variant-5/?lang=bg');
  assert.equal(r.host.lang, 'bg');
});

test('Signature keeps legacy declared entries when localization is unavailable', () => {
  const six = [...structuredClone(variants), { key: 'karento-best', base: '/variant-6', entry: '/variant-6/vehicle?id=stock-42#photos' }];
  const r = render(config({ variants: six, localization: undefined }), 'https://dealer.example/variant-6/vehicle?id=stock-42&lang=en', 'bg');
  assert.equal(r.links[5].href, '/variant-6/vehicle?id=stock-42#photos');
});

test('Karento cannot be replaced by the legacy remote selector', () => {
  const r = render(config({ sharedRuntime: 'legacy-v2', variants: [...variants.slice(0, 4), { key: 'karento-best', base: '/variant-6', entry: '/variant-6/' }] }));
  assert.equal(r.document.head.children.length, 0);
  assert.equal(r.links.at(-1).dataset.designKey, 'karento-best');
});

test('all six styles use valid bundled WebP logos and the active FAB uses its own logo', () => {
  const six = [...structuredClone(variants), { key: 'karento-best', base: '/variant-6', entry: '/variant-6/' }];
  const r = render(config({ variants: six }), 'https://dealer.example/variant-6/vehicles', 'en');
  const images = r.links.map(link => link.querySelector('.preview').querySelector('img'));
  assert.equal(images.length, 6);
  for (const image of images) {
    assert.equal(image.alt, '');
    assert.match(image.src, /^data:image\/webp;base64,/);
    const bytes = Buffer.from(image.src.split(',')[1], 'base64');
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
  }
  assert.equal(new Set(images.map(image => image.src)).size, 6);
  assert.equal(r.shadow.querySelector('.fab').attributes['data-has-logo'], 'true');
  assert.equal(r.shadow.querySelector('.fab-artwork').querySelector('img').src, images[5].src);
  assert.equal(r.shadow.querySelector('.count').textContent, '6/6');
});

const nativeMessages = JSON.parse(readFileSync(new URL('./publishing/switcher-messages.json', import.meta.url), 'utf8'));
const homeSourceFiles = new Map([['app/app/[locale]/2/page.tsx', Buffer.from('// native App route')], ['karento-best/src/routes/2/+page.svelte', Buffer.from('<!-- native Signature route -->')]]);
function sixHomesConfiguration(sourceFiles = homeSourceFiles) {
  return switcherConfiguration({ packaging: { version: '5' }, localization: { defaultLocale: 'bg', enabledLocales: ['en', 'bg'] },
    variants: [...structuredClone(variants), { key: 'karento-best', base: '/variant-6', entry: '/variant-6/' }],
  }, nativeMessages, sourceFiles);
}

test('six-design packaging adds two homes within App and Signature without changing family entries', () => {
  const configuration = sixHomesConfiguration();
  assert.equal(configuration.variants.length, 6);
  assert.equal(configuration.variants[3].entry, '/variant-4/');
  assert.equal(configuration.variants[5].entry, '/variant-6/');
  assert.deepEqual(configuration.variants[3].homes, [{ id: '1', entry: '/variant-4/' }, { id: '2', entry: '/variant-4/2' }]);
  assert.deepEqual(configuration.variants[5].homes, [{ id: '1', entry: '/variant-6/' }, { id: '2', entry: '/variant-6/2' }]);
  assert.equal(configuration.variants.filter(choice => choice.homes).length, 2);
  const legacy = switcherConfiguration({ packaging: { version: '1' }, language: 'bg', variants: variants.slice(0,4) });
  assert.equal(legacy.variants.some(choice => choice.homes), false);
  assert.equal(configuration.localePresentation, 'compact-v1');
  assert.equal(legacy.localePresentation, undefined);
  const unrefreshed = sixHomesConfiguration(new Map([['karento-best/src/routes/2/+page.svelte', Buffer.from('<!-- native Signature route -->')]]));
  assert.equal(unrefreshed.variants[3].homes, undefined, 'older App source has no alternate-home link');
  assert.equal(unrefreshed.variants[5].homes.length, 2);
  assert.equal(sixHomesConfiguration(new Map()).variants.some(choice => choice.homes), false);
  const incompleteMessages = structuredClone(nativeMessages);
  delete incompleteMessages.bg.home;
  assert.throws(() => switcherConfiguration({packaging:{version:'5'},localization:{defaultLocale:'bg',enabledLocales:['en','bg']},variants:[]}, incompleteMessages), /messages must be complete in EN\/BG/);
});

test('six-design packages inject the native locale presentation once without another runtime', () => {
  const r = render(sixHomesConfiguration());
  assert.equal(r.document.head.children.length, 1);
  const presentation = r.document.head.children[0];
  assert.equal(presentation.tagName, 'style');
  assert.equal(presentation.dataset.carsLocalePresentation, 'compact-v1');
  assert.match(presentation.textContent, /dialog\[data-locale-dialog\]\[open\]/);
  assert.match(presentation.textContent, /max-height:calc\(100dvh/);
  assert.equal(r.timers.length, 0);
  vm.runInContext(r.script, r.context, { timeout: 1000 });
  assert.equal(r.document.head.children.length, 1);
  assert.equal(r.document.body.children.length, 1);
});

test('home controls are sibling links inside six cards and preserve each native locale scheme', () => {
  const r = render(sixHomesConfiguration(), 'https://dealer.example/variant-6/2?lang=en&q=BMW&car=stock-42#results', 'bg');
  assert.equal(r.links.length, 6);
  assert.equal(r.shadow.querySelector('.design-grid').children.length, 6);
  assert.equal(r.shadow.querySelector('.count').textContent, '6/6');
  assert.equal(r.homeLinks.length, 4);
  assert.equal(r.links.filter(link => link.querySelector('.view-pill')).length, 4);
  assert.equal(r.links[3].querySelector('.view-pill'), null);
  assert.equal(r.links[5].querySelector('.view-pill'), null);
  assert.deepEqual(r.homeLinks.map(link => link.href), ['/variant-4/en', '/variant-4/en/2', '/variant-6/?lang=en', '/variant-6/2?lang=en']);
  assert.equal(r.homeLinks.filter(link => link.attributes['aria-current'] === 'page')[0].dataset.homeId, '2');
  assert.ok(r.links.every(link => link.querySelectorAll('a').length === 0), 'links must not contain other links');
  assert.equal(r.homeLinks[3].attributes['aria-label'], 'Open Signature, Home 2');
  const event = {button:0,preventDefault(){this.prevented=true;}};
  r.homeLinks[3].fire('click', event);
  assert.equal(event.prevented, true);
  assert.deepEqual(r.navigations, ['/variant-6/2?lang=en']);
});

test('App /locale/2 marks only its second home and updates all homepage links after a language change', () => {
  const r = render(sixHomesConfiguration(), 'https://dealer.example/variant-4/bg/2', 'en');
  assert.equal(r.host.dataset.activeKey, 'app');
  assert.equal(r.homeLinks[1].attributes['aria-current'], 'page');
  assert.equal(r.homeLinks[3].attributes['aria-current'], undefined);
  assert.equal(r.homeLinks[1].textContent, '2');
  assert.equal(r.homeLinks[1].attributes['aria-label'], 'Отвори Приложение, Начало 2');
  r.location.pathname = '/variant-4/en/2';
  r.shadow.querySelector('.fab').fire('click');
  assert.equal(r.homeLinks[1].href, '/variant-4/en/2');
  assert.equal(r.homeLinks[1].textContent, '2');
  assert.equal(r.homeLinks[1].attributes['aria-label'], 'Open App, Home 2');
  assert.equal(r.homeLinks[3].href, '/variant-6/2?lang=en');
  assert.equal(r.homeLinks[1].attributes['aria-current'], 'page');
  assert.equal(r.links[1].href, '/variant-2/en/cars');
});

test('opening on another App route clears homepage state even when the language stays unchanged', () => {
  const r = render(sixHomesConfiguration(), 'https://dealer.example/variant-4/bg/2');
  r.location.pathname = '/variant-4/bg/cars/2';
  r.shadow.querySelector('.fab').fire('click');
  assert.equal(r.homeLinks.some(link => link.attributes['aria-current'] === 'page'), false);
  assert.equal(r.links[3].attributes['aria-current'], 'page');
});

test('mobile modal starts at the top and traps keyboard focus across the homepage controls', () => {
  const r = render(sixHomesConfiguration(), 'https://dealer.example/variant-6/2?lang=bg');
  const panel = r.shadow.querySelector('.sheet');
  const close = r.shadow.querySelector('.close');
  const admin = r.shadow.querySelector('.admin');
  panel.scrollTop = 200;
  r.shadow.querySelector('.fab').fire('click');
  assert.equal(panel.scrollTop, 0);
  assert.equal(panel.attributes['aria-modal'], 'true');
  assert.equal(r.shadow.activeElement, close);
  let prevented = false;
  r.document.fire('keydown', {key:'Tab',shiftKey:true,preventDefault(){prevented=true;}});
  assert.equal(prevented, true);
  assert.equal(r.shadow.activeElement, admin);
  r.document.fire('keydown', {key:'Tab',preventDefault(){}});
  assert.equal(r.shadow.activeElement, close);
});

test('desktop popover focuses the selected second home and does not lock the page', () => {
  const r = render(sixHomesConfiguration(), 'https://dealer.example/variant-4/en/2', 'en', {mobile:false});
  r.shadow.querySelector('.fab').fire('click');
  assert.equal(r.shadow.querySelector('.sheet').attributes['aria-modal'], 'false');
  assert.equal(r.shadow.activeElement, r.homeLinks[1]);
  assert.equal(r.document.documentElement.style.overflow, '');
  r.shadow.querySelector('.close').focus();
  let trapped = false;
  r.document.fire('keydown', {key:'Tab',shiftKey:true,preventDefault(){trapped = true;}});
  assert.equal(trapped, false, 'desktop popover does not trap Tab');
});

test('closing after a mobile-to-desktop resize restores the original page scrolling', () => {
  const viewport = {mobile:true};
  const r = render(sixHomesConfiguration(), 'https://dealer.example/variant-6/2?lang=bg', 'bg', viewport);
  r.document.documentElement.style.overflow = 'auto';
  r.shadow.querySelector('.fab').fire('click');
  r.resize(false);
  assert.equal(r.shadow.querySelector('.sheet').attributes['aria-modal'], 'false');
  assert.equal(r.document.documentElement.style.overflow, 'auto');
  r.resize(true);
  assert.equal(r.shadow.querySelector('.sheet').attributes['aria-modal'], 'true');
  assert.equal(r.document.documentElement.style.overflow, 'hidden');
  r.resize(false);
  r.shadow.querySelector('.close').fire('click');
  assert.equal(r.document.documentElement.style.overflow, 'auto');
});

for (const name of ['deploy-autobest-release', 'fix-autobest-contact-localization', 'reconcile-canonical-fleet-once']) {
  test(name + ' does not publish on an ordinary source push', () => {
    const workflow = readFileSync(new URL('../.github/workflows/' + name + '.yml', import.meta.url), 'utf8');
    const trigger = workflow.slice(workflow.indexOf('\non:'), workflow.indexOf('\npermissions:'));
    assert.match(trigger, /workflow_dispatch:/);
    assert.doesNotMatch(trigger, /\b(?:push|pull_request|schedule):/);
    if (name === 'deploy-autobest-release') assert.doesNotMatch(workflow, /deploy --prod --force/);
  });
}
