import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import { switcherConfiguration } from './package-dealer.mjs';
import { addSignatureNavigationHead, signatureNavigationHead } from './publishing/signature-navigation.mjs';
import { PUBLIC_ROOTS } from './publishing/lead-branding.mjs';
import {loadPreparedDealerPack} from './prepare-dealer-pack-logo.mjs';
import {ROOT} from './lib/workflow.mjs';

const preparedFabPacks=new Map();
// These packs are artwork fixtures for the in-memory switcher harness. Their
// live deployment rows are separate from the hosting-collision contract tests.
for(const slug of ['za-motors','wadishee-used-cars','granada-auto-sales'])preparedFabPacks.set(slug,
  await loadPreparedDealerPack(ROOT,slug,{registryOverride:[],toolPackage:process.env.CARS_QA_RESOLVE_FROM??ROOT+'/runtime/dealer-pack-tools/package.json'}));

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
function render(input = config(), address = 'https://dealer.example/bg', documentLanguage = 'bg', viewport = { mobile: true }, localeDialogs, adminNavigation, navigationState) {
  let shadow;
  class Element {
    constructor(tag = 'div') { this.tagName = tag; this.children = []; this.dataset = {}; this.attributes = {}; this.listeners = {}; this.hidden = false; this.style = { setProperty() {} }; }
    append(...items) { this.children.push(...items); items.forEach(item => { item.parent = this; }); }
    setAttribute(key, value) { this.attributes[key] = value; }
    getAttribute(key) { return this.attributes[key] ?? null; }
    removeAttribute(key) { delete this.attributes[key]; }
    addEventListener(name, handler) { (this.listeners[name] ??= []).push(handler); }
    fire(name, event = {}) {
      event.target ??= this;
      event.composedPath ??= () => { const path = []; for (let node = event.target; node; node = node.parent) path.push(node); return path; };
      for (const fn of this.listeners[name] ?? []) fn(event);
      if (name === 'click') this.parent?.fire(name, event);
    }
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
      for (const name of ['fab', 'fab-artwork', 'sheet', 'backdrop', 'close', 'design-grid', 'heading', 'fab-label', 'count', 'admin', 'navigation', 'navigation-label', 'navigation-retry']) {
        const node = new Element(['fab', 'close'].includes(name) ? 'button' : ['admin','navigation-retry'].includes(name) ? 'a' : 'div');
        node.className = name; nodes.set('.' + name, node);
      }
      nodes.get('.sheet').hidden = true;
      nodes.get('.backdrop').hidden = true;
      nodes.get('.sheet').append(nodes.get('.close'), nodes.get('.design-grid'), nodes.get('.admin'));
      nodes.get('.admin').append(new Element('strong'));
      nodes.get('.admin').setAttribute('target', '_blank');
      nodes.get('.navigation').hidden = true;
      nodes.get('.navigation-retry').hidden = true;
      nodes.get('.navigation').append(nodes.get('.navigation-label'),nodes.get('.navigation-retry'));
      shadow.append(nodes.get('.fab'),nodes.get('.sheet'),nodes.get('.backdrop'),nodes.get('.navigation'));
      shadow.querySelector = selector => nodes.get(selector) ?? null;
      this.shadowRoot = shadow; return shadow;
    }
  }
  const document = new Element('document');
  document.documentElement = new Element('html');
  document.documentElement.lang = documentLanguage;
  document.documentElement.style.overflow = '';
  document.body = new Element('body'); document.head = new Element('head');
  document.createElement = tag => new Element(tag);
  document.querySelector = selector => document.body.children.find(node => selector.split(', ').includes(node.tagName)) ?? null;
  const current = new URL(address);
  const navigations = [];
  const location = { origin: current.origin, hostname: current.hostname, pathname: current.pathname, search: current.search, hash:current.hash,
    get href(){return new URL(this.pathname+this.search+this.hash,this.origin).href;},assign: value => navigations.push(value) };
  const timers = [];
  const windowEvents = {};
  const viewportChanges = [];
  const media = {get matches(){return viewport.mobile;}, addEventListener(event, listener){if(event === 'change') viewportChanges.push(listener);}};
  const context = vm.createContext({ document, location, URL, URLSearchParams,
    matchMedia: () => media, setTimeout: fn => { timers.push(fn); return timers.length; }, clearTimeout() {}, queueMicrotask: fn => fn(),
    addEventListener: (name, listener) => { windowEvents[name] = listener; },
  });
  if (adminNavigation) context.__CARS_ADMIN_NAVIGATION__ = adminNavigation;
  if (localeDialogs) {
    document.querySelectorAll = () => localeDialogs.dialogs;
    document.activeElement = localeDialogs.activeElement;
    context.MutationObserver = class {
      constructor(callback) { localeDialogs.changed = callback; }
      observe() {}
    };
  }
  if (navigationState) {
    const storage = navigationState.storage ?? new Map();
    context.sessionStorage = {getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)};
    context.MutationObserver = class {
      constructor(callback){this.callback=callback;}
      observe(target){if(target===document.body)navigationState.changed=this.callback;}
      disconnect(){navigationState.disconnected=true;}
    };
    document.body.dataset.karentoReady = navigationState.ready ? 'true' : undefined;
    document.fonts = {ready:navigationState.fonts ?? Promise.resolve()};
    if(navigationState.frames)context.requestAnimationFrame=callback=>navigationState.frames.push(callback);
    if(navigationState.head)vm.runInContext(signatureNavigationHead.match(/<script>([\s\S]*?)<\/script>/)[1],context);
  }
  const script = source.replace('__CARS_SWITCHER_CONFIG__', () => JSON.stringify(input).replaceAll('<', '\\u003c'));
  vm.runInContext(script, context, { timeout: 1000 });
  return { document, location, navigations, timers, script, context, windowEvents,
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

function reviewedDealerFab(slug = 'za-motors') {
  const prepared=preparedFabPacks.get(slug),manifest=structuredClone(prepared.manifest);
  // Retain the M1 adapter contract as a regression fixture; current packs use
  // the separate fleet-mark case below and never write regenerated files.
  manifest.pack.schemaVersion=1;
  const retained=JSON.parse(prepared.files.get('branding/logo-contract.json'));
  const asset = 'mark-on-light.webp';
  const mark = prepared.files.get('dealer-brand/'+asset);
  const digest = createHash('sha256').update(mark).digest('hex');
  assert.equal(digest, retained.supplemental[asset].sha256, 'fixture reproduces the reviewed dealer mark exactly');
  const publicBase = '/dealer-brand/v2-' + digest.slice(0, 16);
  const receipt = {schemaVersion: 1, dealer: slug, publicBase,
    reviewedAssets: [{name: asset, sha256: digest}],
    assets: Object.entries(PUBLIC_ROOTS).map(([key, root]) => ({key, path: root + publicBase.slice(1) + '/' + asset, sha256: digest}))};
  const files = new Map(homeSourceFiles);
  files.set('branding/' + asset, mark);
  for (const row of receipt.assets) files.set(row.path, Buffer.from(mark));
  files.set('.cars-branding.json', Buffer.from(JSON.stringify(receipt)));
  return {manifest, files, receipt, digest, mark};
}

test('M1 regression: all three reviewed dealer marks reach the actual FAB in each of six designs', () => {
  for (const slug of ['za-motors', 'wadishee-used-cars', 'granada-auto-sales']) {
    const {manifest, files, digest, mark} = reviewedDealerFab(slug);
    const before = [...files].map(([name, bytes]) => [name, Buffer.from(bytes)]);
    const input = switcherConfiguration(manifest, nativeMessages, files);
    assert.equal(input.dealerFabLogo.policy, 'dealer-pack-reviewed-mark-v1');
    assert.equal(input.dealerFabLogo.dealer, slug);
    assert.equal(input.dealerFabLogo.sha256, digest);
    assert.deepEqual(Buffer.from(input.dealerFabLogo.src.split(',')[1], 'base64'), mark);
    for (const variant of manifest.variants) {
      const address = 'https://dealer.example' + variant.base + '/?lang=en';
      const r = render(input, address, 'en');
      const legacy = render({...input, dealerFabLogo: undefined}, address, 'en');
      const actual = r.shadow.querySelector('.fab-artwork').querySelector('img');
      assert.equal(r.host.dataset.activeKey, variant.key);
      assert.equal(actual.src, input.dealerFabLogo.src);
      assert.equal(actual.alt, manifest.shareIdentity.name);
      assert.equal(actual.getAttribute('data-dealer-fab-logo'), digest);
      assert.equal(createHash('sha256').update(Buffer.from(actual.src.split(',')[1], 'base64')).digest('hex'), digest);
      assert.deepEqual(r.links.map(link => link.querySelector('.preview').querySelector('img').src),
        legacy.links.map(link => link.querySelector('.preview').querySelector('img').src), 'design illustrations remain the retained six template marks');
      assert.deepEqual(r.links.map(link => link.href), legacy.links.map(link => link.href));
      assert.equal(r.shadow.querySelector('.admin').href, legacy.shadow.querySelector('.admin').href);
      r.shadow.querySelector('.fab').fire('click');
      assert.equal(r.shadow.querySelector('.sheet').hidden, false);
      r.shadow.querySelector('.close').fire('click');
      assert.equal(r.shadow.querySelector('.sheet').hidden, true);
    }
    assert.deepEqual([...files], before, 'configuration does not rewrite any reviewed source bytes');
  }
});

test('M2 packs use the live fleet design marks while preserving cards, links and interactions',()=>{
 for(const slug of preparedFabPacks.keys()){
  const f=reviewedDealerFab(slug);f.manifest.pack.schemaVersion=2;
  const input=switcherConfiguration(f.manifest,nativeMessages,f.files);
  assert.equal(input.dealerFabLogo,undefined);
  const legacyManifest=structuredClone(f.manifest);delete legacyManifest.sourceFormat;
  const legacy=switcherConfiguration(legacyManifest,nativeMessages,f.files);
  for(const variant of f.manifest.variants){
   const address='https://dealer.example'+variant.entry;
   const actual=render(input,address,'en'),expected=render(legacy,address,'en');
   assert.equal(actual.shadow.querySelector('.fab-artwork').querySelector('img').src,expected.shadow.querySelector('.fab-artwork').querySelector('img').src);
   assert.deepEqual(actual.links.map(link=>link.href),expected.links.map(link=>link.href));
   assert.deepEqual(actual.links.map(link=>link.querySelector('.preview').querySelector('img').src),expected.links.map(link=>link.querySelector('.preview').querySelector('img').src));
   actual.shadow.querySelector('.fab').fire('click');assert.equal(actual.shadow.querySelector('.sheet').hidden,false);
  }
 }
});

test('dealer FAB source binding rejects foreign identities and incomplete reviewed roles', () => {
  const cases = [
    f => { f.manifest.repository = 'elsewhere/cars'; },
    f => { f.manifest.branding.required = false; },
    f => { f.manifest.shareIdentity.name = ''; },
    f => { f.manifest.variants.pop(); },
    f => { f.receipt.dealer = 'another-dealer'; },
    f => { f.receipt.publicBase = '/dealer-brand/../foreign'; },
    f => { f.receipt.reviewedAssets = []; },
    f => { f.receipt.reviewedAssets.push({...f.receipt.reviewedAssets[0]}); },
    f => { f.receipt.assets[0].sha256 = '0'.repeat(64); },
    f => { f.receipt.assets[0].path = 'auto-best/static/foreign/mark-on-light.webp'; },
    f => { f.receipt.assets.push({...f.receipt.assets[0]}); },
  ];
  for (const change of cases) {
    const f = reviewedDealerFab(); change(f);
    f.files.set('.cars-branding.json', Buffer.from(JSON.stringify(f.receipt)));
    assert.throws(() => switcherConfiguration(f.manifest, nativeMessages, f.files), /Dealer pack FAB logo:/);
  }
  const f = reviewedDealerFab();
  assert.throws(() => switcherConfiguration(f.manifest, nativeMessages), /requires exact source files/);
  f.files.delete('.cars-branding.json');
  assert.throws(() => switcherConfiguration(f.manifest, nativeMessages, f.files), /missing branding receipt/);
});

test('dealer FAB source binding authenticates every family copy and bounded raster bytes', () => {
  for (const key of Object.keys(PUBLIC_ROOTS)) {
    for (const remove of [false, true]) {
      const f = reviewedDealerFab();
      const row = f.receipt.assets.find(row => row.key === key);
      if (remove) f.files.delete(row.path);
      else {const changed = Buffer.from(f.mark); changed[changed.length - 1] ^= 1; f.files.set(row.path, changed);}
      assert.throws(() => switcherConfiguration(f.manifest, nativeMessages, f.files), new RegExp('reviewed family mark changed or missing: ' + key));
    }
  }
  for (const bytes of [Buffer.from('<svg/>'), Buffer.alloc(256 * 1024 + 1), Buffer.from('not a reviewed WebP image')]) {
    const f = reviewedDealerFab(); f.files.set('branding/mark-on-light.webp', bytes);
    assert.throws(() => switcherConfiguration(f.manifest, nativeMessages, f.files), /bounded reviewed WebP/);
  }
  const f = reviewedDealerFab();
  const changed = Buffer.from(f.mark); changed[changed.length - 1] ^= 1;
  f.files.set('branding/mark-on-light.webp', changed);
  assert.throws(() => switcherConfiguration(f.manifest, nativeMessages, f.files), /reviewed mark bytes changed/);
});

test('legacy switcher configuration retains template FAB defaults without pack inputs', () => {
  const f = reviewedDealerFab();
  delete f.manifest.sourceFormat;
  const input = switcherConfiguration(f.manifest, nativeMessages, homeSourceFiles);
  assert.equal(input.dealerFabLogo, undefined);
  const r = render(input, 'https://dealer.example/variant-5/?lang=en', 'en');
  assert.equal(r.shadow.querySelector('.fab-artwork').querySelector('img').src,
    r.links[4].querySelector('.preview').querySelector('img').src);
});

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
  // A source template may already render its own chevron. Compact mode must not
  // paint a second one on top of the shared select background icon.
  assert.ok(presentation.textContent.includes('dialog[data-locale-dialog] .cars-locale-select-arrow,dialog[data-locale-dialog] [data-locale-country-chevron]{display:none!important}'));
  assert.equal(r.timers.length, 0);
  vm.runInContext(r.script, r.context, { timeout: 1000 });
  assert.equal(r.document.head.children.length, 1);
  assert.equal(r.document.body.children.length, 1);
});

test('welcome dialog initially focuses its title, preserves user focus, and resets on reopen', () => {
  let count = 0;
  const heading = {focus(options) { count++; assert.equal(options.preventScroll, true); }};
  const close = {};
  const dialog = {open: true, querySelector: () => heading, contains: element => element === close};
  const state = {dialogs: [dialog], activeElement: close};
  const r = render(sixHomesConfiguration(), undefined, undefined, undefined, state);
  assert.equal(count, 1);
  assert.equal(heading.tabIndex, -1);
  state.changed();
  assert.equal(count, 1, 'unrelated mutations must not steal focus');
  dialog.open = false;
  state.changed();
  dialog.open = true;
  state.changed();
  assert.equal(count, 2);
  dialog.open = false;
  state.changed();
  r.document.activeElement = {};
  dialog.open = true;
  state.changed();
  assert.equal(count, 2, 'do not override focus outside the dialog');
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
  assert.deepEqual(r.navigations, ['https://dealer.example/variant-6/2?lang=en']);
});

test('template selection paints a localized loading state before navigating and suppresses duplicate clicks', () => {
  const r = render();
  const frames = [];
  r.context.requestAnimationFrame = fn => frames.push(fn);
  const event = () => ({button:0,preventDefault(){}});
  r.shadow.querySelector('.fab').fire('click');
  r.links[1].fire('click',event());
  assert.equal(r.shadow.querySelector('.navigation').hidden,false);
  assert.equal(r.shadow.querySelector('.navigation-label').textContent,'Зарежда се Modern…');
  assert.equal(r.shadow.querySelector('.sheet').hidden,true);
  assert.equal(r.document.documentElement.style.overflow,'');
  assert.equal(r.links[1].getAttribute('aria-busy'),'true');
  assert.equal(r.navigations.length,0);
  r.links[1].fire('click',event());
  assert.equal(frames.length,1);
  frames.shift()(); frames.shift()();
  assert.deepEqual(r.navigations,['https://dealer.example/variant-2/bg/cars']);
  r.windowEvents.pageshow({persisted:true});
  assert.equal(r.shadow.querySelector('.navigation').hidden,true);
  assert.equal(r.links[1].getAttribute('aria-busy'),null);
});

test('slow navigation offers a retry and preserves its destination name', () => {
  const r = render(config(), 'https://dealer.example/en', 'en');
  r.links[1].fire('click',{button:0,preventDefault(){}});
  r.timers.at(-1)();
  const retry = r.shadow.querySelector('.navigation-retry');
  assert.equal(retry.hidden,false);
  assert.equal(retry.href,'https://dealer.example/variant-2/en/cars');
  assert.equal(r.shadow.querySelector('.navigation-label').textContent,'Still loading Modern…');
  retry.fire('click',{button:0,preventDefault(){}});
  assert.equal(r.shadow.querySelector('.navigation-label').textContent,'Loading Modern…');
  assert.equal(r.navigations.length,2);
});

test('rapidly changing a selection dispatches only the latest navigation, even when returning to the same link', () => {
  const r = render(), frames = [];
  r.context.requestAnimationFrame = callback => frames.push(callback);
  for (const index of [1,2,1]) r.links[index].fire('click',{button:0,preventDefault(){}});
  while (frames.length) frames.shift()();
  assert.deepEqual(r.navigations,['https://dealer.example/variant-2/bg/cars']);
});

test('cancelled callbacks cannot navigate or change feedback after the same link is selected again', () => {
  const r = render(), frames = [];
  r.context.requestAnimationFrame = callback => frames.push(callback);
  r.links[1].fire('click',{button:0,preventDefault(){}});
  const cancelledTimer = r.timers.at(-1);
  r.document.fire('keydown',{key:'Escape'});
  r.links[1].fire('click',{button:0,preventDefault(){}});
  cancelledTimer();
  assert.equal(r.shadow.querySelector('.navigation-retry').hidden,true);
  assert.equal(r.shadow.querySelector('.navigation-label').textContent,'Зарежда се Modern…');
  while (frames.length) frames.shift()();
  assert.deepEqual(r.navigations,['https://dealer.example/variant-2/bg/cars']);
});

test('initial pageshow does not cancel a selection made while the current page is still loading', () => {
  const r = render(), frames = [];
  r.context.requestAnimationFrame = callback => frames.push(callback);
  r.links[1].fire('click',{button:0,preventDefault(){}});
  r.windowEvents.pageshow({persisted:false});
  assert.equal(r.shadow.querySelector('.navigation').hidden,false);
  while (frames.length) frames.shift()();
  assert.deepEqual(r.navigations,['https://dealer.example/variant-2/bg/cars']);
});

test('a cancelled Signature font wait cannot clear a subsequent template selection', async () => {
  const target='https://dealer.example/variant-6/?lang=en';
  const storage=new Map([['cars-preview-navigation:v1',JSON.stringify({target,name:'Signature',startedAt:Date.now()})]]);
  let finishFonts;
  const state={storage,head:true,ready:true,frames:[],fonts:new Promise(resolve=>{finishFonts=resolve;})};
  const r=render(sixHomesConfiguration(),target,'en',undefined,undefined,undefined,state);
  r.links[1].fire('click',{button:0,preventDefault(){}});
  finishFonts();await new Promise(setImmediate);
  while (state.frames.length) state.frames.shift()();
  assert.equal(r.shadow.querySelector('.navigation').hidden,false);
  assert.equal(r.shadow.querySelector('.navigation-label').textContent,'Loading Modern…');
  assert.deepEqual(r.navigations,['https://dealer.example/variant-2/en/cars']);
});

test('new-tab, modified and already-current links do not leave a loading indicator', () => {
  const r = render();
  for (const modifier of ['ctrlKey','metaKey','shiftKey','altKey']) {
    r.links[1].fire('click',{button:0,[modifier]:true,preventDefault(){assert.fail('modified click intercepted');}});
  }
  r.links[1].fire('click',{button:1,preventDefault(){assert.fail('middle click intercepted');}});
  r.shadow.querySelector('.admin').fire('click',{button:0,preventDefault(){assert.fail('new tab intercepted');}});
  r.links[0].fire('click',{button:0,preventDefault(){}});
  assert.equal(r.shadow.querySelector('.navigation').hidden,true);
  assert.equal(r.navigations.length,0);
});

test('Escape and pagehide clear pending navigation, including a scheduled paint', () => {
  for (const action of ['Escape','pagehide']) {
    const r = render(), frames = [];
    r.context.requestAnimationFrame = fn => frames.push(fn);
    r.links[1].fire('click',{button:0,preventDefault(){}});
    if (action === 'Escape') r.document.fire('keydown',{key:'Escape'});
    else r.windowEvents.pagehide();
    frames.shift()(); frames.shift()();
    assert.equal(r.shadow.querySelector('.navigation').hidden,true);
    assert.equal(r.navigations.length,0);
  }
});

test('dashboard selectors use the dealer return origin and locale before any observer runs', () => {
  const r=render(sixHomesConfiguration(),'https://admin.example/dashboard-2','en',undefined,undefined,{previewUrl:'https://dealer.example/variant-6/2?lang=bg'});
  assert.equal(r.links[1].href,'https://dealer.example/variant-2/bg/cars');
  assert.equal(r.homeLinks[3].href,'https://dealer.example/variant-6/2?lang=bg');
  r.shadow.querySelector('.fab').fire('click');
  assert.equal(r.links[1].href,'https://dealer.example/variant-2/bg/cars');
  r.links[1].fire('click',{button:0,preventDefault(){}});
  assert.equal(r.shadow.querySelector('.navigation-label').textContent,'Зарежда се Modern…');
  assert.deepEqual(r.navigations,['https://dealer.example/variant-2/bg/cars']);
});

test('Signature navigation carries its actual destination across the document handoff', () => {
  const storage = new Map(), state = {storage};
  const r=render(sixHomesConfiguration(),'https://dealer.example/variant-4/en','en',undefined,undefined,undefined,state);
  r.links[5].fire('click',{button:0,preventDefault(){}});
  const pending=JSON.parse(storage.get('cars-preview-navigation:v1'));
  assert.equal(pending.target,'https://dealer.example/variant-6/?lang=en');
  assert.equal(pending.name,'Signature');
  assert.deepEqual(r.navigations,[pending.target]);
  r.windowEvents.pagehide();
  assert.equal(storage.has('cars-preview-navigation:v1'),true,'leaving the source page must retain the destination intent');
  r.windowEvents.pageshow({persisted:true});
  assert.equal(storage.size,0,'Back must not resurrect a pending transition');
});

test('Signature waits for hydration, fonts and a settled paint before revealing the destination', async () => {
  const target='https://dealer.example/variant-6/?lang=en';
  const storage=new Map([['cars-preview-navigation:v1',JSON.stringify({target,name:'Signature',startedAt:Date.now()})]]);
  let finishFonts;
  const state={storage,head:true,frames:[],fonts:new Promise(resolve=>{finishFonts=resolve;})};
  const r=render(sixHomesConfiguration(),target,'en',undefined,undefined,undefined,state);
  assert.equal(r.document.documentElement.getAttribute('data-cars-preview-pending'),'signature');
  assert.equal(r.shadow.querySelector('.navigation-label').textContent,'Loading Signature…');
  r.windowEvents.pageshow({persisted:false});
  assert.equal(r.shadow.querySelector('.navigation').hidden,false,'initial pageshow is not proof of application readiness');
  r.document.body.dataset.karentoReady='true';state.changed();
  assert.equal(state.frames.length,0,'fonts are still pending');
  finishFonts();await new Promise(setImmediate);
  assert.equal(state.frames.length,1);
  state.frames.shift()();
  assert.equal(r.shadow.querySelector('.navigation').hidden,false);
  state.frames.shift()();
  assert.equal(r.document.documentElement.getAttribute('data-cars-preview-pending'),null);
  assert.equal(r.shadow.querySelector('.navigation').hidden,true);
  assert.equal(storage.size,0);
  assert.equal(state.disconnected,true);
  assert.equal(r.navigations.length,0,'finishing startup must not reload the page');
});

test('failed Signature startup reveals the server content and offers a real same-page retry', () => {
  const target='https://dealer.example/variant-6/2?lang=bg';
  const storage=new Map([['cars-preview-navigation:v1',JSON.stringify({target,name:'Signature',startedAt:Date.now()})]]);
  const r=render(sixHomesConfiguration(),target,'bg',undefined,undefined,undefined,{storage,head:true});
  r.timers.at(-1)();
  assert.equal(r.document.documentElement.getAttribute('data-cars-preview-pending'),null);
  const retry=r.shadow.querySelector('.navigation-retry');
  assert.equal(retry.hidden,false);
  retry.fire('click',{button:0,preventDefault(){}});
  assert.deepEqual(r.navigations,[target]);
});

test('early Signature guard is idempotent, scoped to fresh matching intent and fails open', () => {
  const html='<html><head>%sveltekit.head%</head><body>server-rendered content</body></html>';
  const guarded=addSignatureNavigationHead(html);
  assert.equal(addSignatureNavigationHead(guarded),guarded);
  assert.ok(guarded.indexOf('data-cars-preview-pending')<guarded.indexOf('%sveltekit.head%'));
  const code=signatureNavigationHead.match(/<script>([\s\S]*?)<\/script>/)[1];
  const target='https://dealer.example/variant-6/?lang=en';
  const run=value=>{
    const attrs=new Map(),timers=[];
    vm.runInNewContext(code,{sessionStorage:{getItem:()=>value},location:{href:target},document:{documentElement:{setAttribute:(k,v)=>attrs.set(k,v),removeAttribute:k=>attrs.delete(k)}},setTimeout:callback=>timers.push(callback),Date});
    return {attrs,timers};
  };
  for(const pending of [null,'invalid',JSON.stringify({target:target+'/wrong',startedAt:Date.now()}),JSON.stringify({target,startedAt:Date.now()-31000})])assert.equal(run(pending).attrs.size,0);
  const pending=run(JSON.stringify({target,startedAt:Date.now()}));
  assert.equal(pending.attrs.get('data-cars-preview-pending'),'signature');
  pending.timers[0]();assert.equal(pending.attrs.size,0,'missing shared JS must never permanently hide the page');
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

test('Import direct-child locale fields receive compact gutters without changing the single-arrow owner', () => {
  const r = render(sixHomesConfiguration());
  const presentation = r.document.head.children.find(node => node.dataset?.carsLocalePresentation === 'compact-v1');
  assert(presentation, 'Native compact styling must be bundled once');
  const css = presentation.textContent;
  // Import renders its intro, labels and form directly in <dialog>. The
  // Auto Best and Modern wrappers already own their padding; avoid applying
  // competing global form spacing or modifying the native controls.
  assert.match(css, /dialog\[data-locale-dialog\] > \.cars-locale-eyebrow\{box-sizing:border-box!important/);
  assert.match(css, /dialog\[data-locale-dialog\] > #cars-locale-title\{box-sizing:border-box!important/);
  assert.match(css, /dialog\[data-locale-dialog\] > :is\(#cars-locale-description,\.cars-locale-suggestion\)\{box-sizing:border-box!important/);
  assert.ok(css.includes('dialog[data-locale-dialog] > form{box-sizing:border-box!important;padding:0 24px 24px!important}'));
  assert.ok(css.includes('dialog[data-locale-dialog] > form{padding-inline:16px!important}'));
  assert.equal((css.match(/dialog\[data-locale-dialog\] \.cars-locale-select-arrow,dialog\[data-locale-dialog\] \[data-locale-country-chevron\]\{display:none!important\}/g) ?? []).length, 1,
    'Keep the one CSS-background arrow; native SVG remains hidden even if its markup exists');
  assert.match(css, /dialog\[data-locale-dialog\] select\{appearance:none!important;padding-right:40px!important;background-image:url/);
});
