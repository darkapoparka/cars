/* Cars shared dealer selector v2. Reads page-scoped public configuration. */
(() => {
  if (document.querySelector('dealer-design-switcher, excellent-design-switcher')) return;
  const config = globalThis.__CARS_SWITCHER_CONFIG__;
  if (!config) return;
  const mount = config.variants.find(({base}) => base && (location.pathname === base || location.pathname.startsWith(`${base}/`)))?.base || '';
  if (config.localization) {
    const requested = location.pathname.slice(mount.length).split('/')[1];
    const enabled = config.localization.enabledLocales;
    const documentLanguage = document.documentElement.lang;
    config.language = enabled.includes(requested) ? requested : enabled.includes(documentLanguage) ? documentLanguage : config.localization.defaultLocale;
    config.labels = config.localization.messages[config.language];
  }
  const language = String(config.language || 'en').toLowerCase().startsWith('bg') ? 'bg' : 'en';
  const copy = language === 'bg' ? {
    design: 'Дизайн', title: 'Изберете визия за сайта', subtitle: 'Разгледайте различен стил, без да напускате този адрес.',
    current: 'Текущ', open: 'Отвори', close: 'Затворете избора на дизайн',
    admin: 'Админ панел', adminDescription: 'Преглед на наличности, запитвания и съдържание.',
    adminLabel: 'Админ панел — демо, отваря се в нов раздел'
  } : {
    design: 'Design', title: 'Choose a website style', subtitle: 'Preview another experience without leaving this address.',
    current: 'Current', open: 'Open', close: 'Close design selector',
    admin: 'Admin dashboard', adminDescription: 'Preview inventory, enquiries and content tools.',
    adminLabel: 'Admin dashboard — demo, opens in a new tab'
  };
  const designCopy = {
    en: {
      'auto-best': ['Classic', 'Editorial dealer site'], modern: ['Marketplace', 'Rich catalog experience'],
      import: ['Import specialist', 'Import-focused journey'], carwow: ['Premium', 'Modern showroom layout'],
      app: ['App', 'Mobile-first buying journey']
    },
    bg: {
      'auto-best': ['Класически', 'Дилърски сайт с редакционна визия'], modern: ['Автопортал', 'Богато каталожно изживяване'],
      import: ['Автомобилен внос', 'Визия, фокусирана върху вноса'], carwow: ['Премиум', 'Модерен шоурум'],
      app: ['Приложение', 'Мобилно изживяване за покупка']
    }
  }[language];
  const choices = config.variants.map(choice => {
    if (!config.localization) return choice;
    const tail = choice.entry.slice(choice.base.length);
    return {...choice, entry: `${choice.base}/${config.language}${tail === '/' ? '' : tail}`};
  });
  const index = choices.findIndex(({base}) => base && (location.pathname === base || location.pathname.startsWith(`${base}/`)));
  const active = index < 0 ? 0 : index;
  const host = document.createElement('dealer-design-switcher');
  host.lang = config.language || language;
  host.dataset.activeKey = choices[active]?.key || 'auto-best';
  if (config.accent) host.style.setProperty('--dealer-switcher-accent', config.accent);
  const shadow = host.attachShadow({mode: 'open'});
  shadow.innerHTML = `<style>
    :host{position:fixed;right:14px;bottom:calc(156px + env(safe-area-inset-bottom,0px));z-index:9999;font:14px/1.35 Inter,Arial,sans-serif;color:#17191c;pointer-events:none;--accent:var(--dealer-switcher-accent,#191b1f)}
    :host([data-active-key="app"]){bottom:calc(74px + env(safe-area-inset-bottom,0px))}
    *{box-sizing:border-box}[hidden]{display:none!important}button,a{font:inherit}.fab,.sheet,.backdrop{pointer-events:auto}
    .fab{position:relative;display:grid;place-items:center;width:58px;height:58px;padding:6px;border:2px solid #fff;border-radius:50%;background:var(--accent);color:#fff;box-shadow:0 8px 24px #0004;cursor:pointer;font-weight:750;transition:transform .18s ease,filter .18s ease}
    .fab:hover{filter:brightness(1.08);transform:translateY(-1px)}.fab svg{width:25px;height:25px}.fab-label{font-size:10px;line-height:11px}
    .count{position:absolute;right:-4px;top:-5px;min-width:26px;padding:2px 5px;border:2px solid #fff;border-radius:999px;background:#17191c;color:#fff;font-size:10px;line-height:15px;text-align:center}
    .backdrop{position:fixed;inset:0;background:rgba(10,12,16,.42);backdrop-filter:blur(2px)}
    .sheet{position:fixed;left:0;right:0;bottom:0;width:100%;max-height:min(82dvh,680px);overflow:auto;padding:8px 16px calc(18px + env(safe-area-inset-bottom,0px));border:1px solid #e2e5e9;border-bottom:0;border-radius:26px 26px 0 0;background:#fff;box-shadow:0 -18px 55px rgba(0,0,0,.24)}
    .handle{width:44px;height:4px;margin:2px auto 12px;border-radius:999px;background:#d8dce1}
    .header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}.heading{margin:0;font-size:20px;line-height:25px;letter-spacing:-.3px}.subtitle{margin:4px 0 0;color:#697078;font-size:12px;line-height:17px}
    .close{display:grid;place-items:center;flex:none;width:42px;height:42px;padding:0;border:0;border-radius:50%;background:#f1f3f5;color:#25282c;cursor:pointer}.close svg{width:20px;height:20px}
    .design-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
    .design{position:relative;display:flex;min-width:0;min-height:100px;flex-direction:column;align-items:flex-start;justify-content:space-between;gap:10px;padding:12px;border:1px solid #dfe3e7;border-radius:16px;background:#fafbfc;color:inherit;text-decoration:none;transition:border-color .15s ease,background .15s ease,transform .15s ease}
    .design:hover{transform:translateY(-1px);border-color:#aeb5bd;background:#fff}
    .design[aria-current="page"]{border:2px solid var(--accent);padding:11px;background:#f4f5f6}
    .preview{display:flex;align-items:center;justify-content:center;width:36px;height:30px;border-radius:9px;background:#fff;border:1px solid #dfe3e7;color:var(--accent)}
    .preview svg{width:22px;height:22px}.design-name{display:block;font-size:14px;font-weight:750;line-height:18px}
    .design-description{display:block;margin-top:2px;color:#707780;font-size:10px;line-height:14px}
    .state{position:absolute;right:9px;top:9px;padding:2px 6px;border-radius:999px;background:#e9ecef;color:#4d535a;font-size:9px;font-weight:700}
    .design[aria-current="page"] .state{background:var(--accent);color:#fff}
    .admin{display:grid;grid-template-columns:42px minmax(0,1fr) 22px;align-items:center;gap:10px;min-height:68px;margin-top:12px;padding:10px 12px;border:1px solid #dfe3e7;border-radius:16px;background:#fff;color:#17191c;text-decoration:none}
    .admin:hover{background:#f7f8fa}.admin-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:12px;background:#eef2ff;color:#3157d8}
    .admin-icon svg{width:21px;height:21px}.admin strong{display:block;font-size:14px}
    .admin small{display:block;margin-top:2px;color:#697078;font-size:10px;line-height:14px}.arrow{font-size:17px;color:#3157d8}
    .fab:focus-visible,.close:focus-visible,.design:focus-visible,.admin:focus-visible{outline:3px solid #5b8def;outline-offset:3px}
    @media(min-width:992px){:host,:host([data-active-key="app"]){right:24px;bottom:96px}.backdrop{display:none}.sheet{position:absolute;left:auto;right:0;bottom:70px;width:374px;max-height:calc(100dvh - 130px);padding:16px;border:1px solid #e2e5e9;border-radius:20px;box-shadow:0 18px 56px rgba(0,0,0,.22)}.handle{display:none}.header{margin-bottom:12px}}
  </style>
  <div class="backdrop" hidden></div>
  <button class="fab" type="button" aria-expanded="false" aria-controls="choices">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M10 9v12"/></svg>
    <span class="fab-label" aria-hidden="true"></span><span class="count" aria-hidden="true"></span>
  </button>
  <section class="sheet" id="choices" role="dialog" aria-modal="true" aria-labelledby="selector-title" hidden>
    <div class="handle" aria-hidden="true"></div>
    <header class="header"><div><h2 class="heading" id="selector-title"></h2><p class="subtitle"></p></div>
    <button class="close" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></header>
    <nav class="design-grid" aria-label=""></nav><a class="admin" data-cars-admin="v2" target="_blank" rel="noopener noreferrer">
      <span class="admin-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 9v12M13 13h4M13 17h4"/></svg></span>
      <span><strong></strong><small></small></span><span class="arrow" aria-hidden="true">↗</span></a>
  </section>`;
  const icons = {
    'auto-best': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 5h16v14H4zM4 10h16M9 10v9"/></svg>',
    modern: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 9v11M12 13h6M12 17h4"/></svg>',
    import: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 18h16M6 18V8h12v10M9 8V5h6v3M9 12h6"/><path d="M12 10v5m0 0-2-2m2 2 2-2"/></svg>',
    carwow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 17h18l-2-7H5l-2 7Z"/><path d="M7 10l2-4h6l2 4M6 17v2M18 17v2"/></svg>',
    app: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10 5h4M11 18.5h2"/></svg>'
  };
  const button = shadow.querySelector('.fab');
  const panel = shadow.querySelector('.sheet');
  const backdrop = shadow.querySelector('.backdrop');
  const closeButton = shadow.querySelector('.close');
  const grid = shadow.querySelector('.design-grid');
  shadow.querySelector('.heading').textContent = config.labels?.title || copy.title;
  shadow.querySelector('.subtitle').textContent = copy.subtitle;
  shadow.querySelector('.fab-label').textContent = config.labels?.design || copy.design;
  shadow.querySelector('.count').textContent = `${active + 1}/${choices.length}`;
  button.setAttribute('aria-label', `${config.labels?.design || copy.design} ${active + 1} / ${choices.length}`);
  closeButton.setAttribute('aria-label', copy.close);
  grid.setAttribute('aria-label', config.labels?.choose || copy.title);
  for (const [number, choice] of choices.entries()) {
    const link = document.createElement('a');
    const [name, description] = designCopy[choice.key] || [`${copy.design} ${number + 1}`, ''];
    link.className = 'design';
    link.href = choice.entry;
    link.dataset.designKey = choice.key;
    link.setAttribute('aria-label', `${copy.open} ${name}`);
    if (number === active) link.setAttribute('aria-current', 'page');
    const preview = document.createElement('span'); preview.className = 'preview'; preview.innerHTML = icons[choice.key] || icons['auto-best'];
    const label = document.createElement('span');
    const title = document.createElement('span'); title.className = 'design-name'; title.textContent = name;
    const note = document.createElement('span'); note.className = 'design-description'; note.textContent = description;
    label.append(title, note);
    const state = document.createElement('span'); state.className = 'state'; state.textContent = number === active ? copy.current : `${number + 1}`;
    link.append(preview, label, state);
    grid.append(link);
  }
  const admin = shadow.querySelector('.admin');
  const adminUrl = new URL('https://cars-admin-blue.vercel.app/');
  const dealer = location.hostname.split('.')[0];
  if (/^[a-z0-9-]{1,64}$/.test(dealer)) adminUrl.searchParams.set('dealer', dealer);
  admin.href = adminUrl.href;
  admin.setAttribute('aria-label', copy.adminLabel);
  admin.querySelector('strong').textContent = copy.admin;
  admin.querySelector('small').textContent = copy.adminDescription;
  let previousOverflow = '';
  const mobile = () => matchMedia('(max-width: 991px)').matches;
  const focusable = () => [...panel.querySelectorAll('a,button')].filter(element => !element.hidden);
  const close = (returnFocus = false) => {
    panel.hidden = true; backdrop.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    if (mobile()) document.documentElement.style.overflow = previousOverflow;
    if (returnFocus) button.focus();
  };
  const open = () => {
    panel.hidden = false; backdrop.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    if (mobile()) { previousOverflow = document.documentElement.style.overflow; document.documentElement.style.overflow = 'hidden'; }
    (panel.querySelector('[aria-current="page"]') || panel.querySelector('a')).focus();
  };
  button.addEventListener('click', () => panel.hidden ? open() : close(true));
  closeButton.addEventListener('click', () => close(true));
  backdrop.addEventListener('click', () => close(true));
  document.addEventListener('pointerdown', event => {
    if (!mobile() && !panel.hidden && !event.composedPath().includes(host)) close();
  });
  document.addEventListener('keydown', event => {
    if (panel.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); close(true); return; }
    if (event.key !== 'Tab') return;
    const items = focusable(); if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && shadow.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && shadow.activeElement === last) { event.preventDefault(); first.focus(); }
  }, true);
  grid.querySelectorAll('a').forEach(link => link.addEventListener('click', event => {
    if (event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      location.assign(link.href);
    }
  }));
  document.body.append(host);
})();
