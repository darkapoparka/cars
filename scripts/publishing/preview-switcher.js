/* Cars packaging v1. Configuration is embedded by package-dealer.mjs. */
(() => {
  if (document.querySelector('dealer-design-switcher, excellent-design-switcher')) return;
  const config = __CARS_SWITCHER_CONFIG__;
  const mount = config.variants.find(({ base }) => base && (location.pathname === base || location.pathname.startsWith(`${base}/`)))?.base || '';
  if (config.localization) {
    const requested = location.pathname.slice(mount.length).split('/')[1];
    const documentLanguage = document.documentElement.lang;
    const enabled = config.localization.enabledLocales;
    config.language = enabled.includes(requested) ? requested : enabled.includes(documentLanguage) ? documentLanguage : config.localization.defaultLocale;
    config.labels = config.localization.messages[config.language];
  }
  const choices = config.variants.map(choice => {
    if (!config.localization) return choice;
    const tail = choice.entry.slice(choice.base.length);
    return { ...choice, entry: `${choice.base}/${config.language}${tail === '/' ? '' : tail}` };
  });
  const index = choices.findIndex(({ base }) => base && (location.pathname === base || location.pathname.startsWith(`${base}/`)));
  const active = index < 0 ? 0 : index;
  const host = document.createElement('dealer-design-switcher');
  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `<style>
    :host{position:fixed;right:16px;bottom:calc(156px + env(safe-area-inset-bottom,0px));z-index:9999;font:14px/1.4 Arial,sans-serif;color:#172019}
    button,a{box-sizing:border-box;font:inherit}button{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;width:64px;height:64px;padding:6px;border:2px solid #fff;border-radius:50%;background:var(--dealer-switcher-accent,#172019);color:#fff;box-shadow:0 4px 16px #0003;cursor:pointer;font-weight:700}button:hover{filter:brightness(1.15)}button svg{width:28px;height:28px}button .label{font-size:11px;line-height:14px}button .count{position:absolute;right:-5px;top:-4px;padding:2px 5px;border-radius:8px;background:#172019;color:white;font-size:11px;line-height:16px}
    nav{position:absolute;bottom:76px;right:0;width:218px;padding:8px;background:white;border:1px solid #dce2dc;border-radius:16px;box-shadow:0 8px 30px #0003}nav[hidden]{display:none}
    p{margin:6px 10px 8px;font-size:12px;color:#556358}a{display:flex;align-items:center;justify-content:space-between;min-height:44px;padding:10px;border-radius:10px;text-decoration:none;color:inherit}a:hover,a:focus-visible{background:#f0f2f4}a[aria-current=page]{background:#eef1f4;font-weight:700}button:focus-visible,a:focus-visible{outline:2px solid #172019;outline-offset:3px}
    @media(min-width:992px){:host{right:24px;bottom:100px}}
  </style><nav id="choices" hidden><p></p></nav><button type="button" aria-expanded="false" aria-controls="choices"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M10 9v12"/></svg><span class="label" aria-hidden="true"></span><span class="count" aria-hidden="true"></span></button>`;
  host.lang = config.language;
  if (config.localization) { host.dataset.adminLabel = config.labels.adminLabel; host.dataset.adminText = config.labels.admin; }
  if (config.accent) host.style.setProperty('--dealer-switcher-accent', config.accent);
  const button = shadow.querySelector('button');
  const panel = shadow.querySelector('nav');
  panel.setAttribute('aria-label', config.labels.choose);
  panel.querySelector('p').textContent = config.labels.title;
  button.setAttribute('aria-label', `${config.labels.design} ${active + 1} / ${choices.length}`);
  button.querySelector('.label').textContent = config.labels.design;
  button.querySelector('.count').textContent = `${active + 1}/${choices.length}`;
  for (const [number, choice] of choices.entries()) {
    const link = document.createElement('a');
    link.href = choice.entry;
    link.append(document.createTextNode(`${config.labels.design} ${number + 1}`));
    if (number === active) link.setAttribute('aria-current', 'page');
    const marker = document.createElement('span');
    marker.setAttribute('aria-hidden', 'true');
    marker.textContent = number === active ? '✓' : '→';
    link.append(marker);
    panel.append(link);
  }
  const close = (focus = false) => {
    panel.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    if (focus) button.focus();
  };
  button.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    button.setAttribute('aria-expanded', String(!panel.hidden));
    if (!panel.hidden) panel.querySelector('a').focus();
  });
  document.addEventListener('pointerdown', (event) => {
    if (!event.composedPath().includes(host)) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) {
      event.preventDefault();
      event.stopImmediatePropagation();
      close(true);
    }
  }, true);
  shadow.querySelectorAll('a').forEach((link) => link.addEventListener('click', (event) => {
    if (event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      location.assign(link.href);
    }
  }));
  document.body.append(host);
})();

/* Cars client-admin demo link v1. Keep the three design routes unchanged. */
(() => {
  const host = document.querySelector('dealer-design-switcher, excellent-design-switcher');
  const root = host?.shadowRoot;
  const panel = root?.querySelector('nav');
  if (!panel || root.querySelector('[data-cars-admin]')) return;
  const url = new URL('https://cars-admin-blue.vercel.app/');
  const dealer = location.hostname.split('.')[0];
  if (/^[a-z0-9-]{1,64}$/.test(dealer)) url.searchParams.set('dealer', dealer);
  const link = document.createElement('a');
  link.dataset.carsAdmin = 'v1';
  link.href = url.href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', host.dataset.adminLabel || 'Admin dashboard — demo, opens in a new tab');
  link.append(document.createTextNode(host.dataset.adminText || 'Admin dashboard'));
  const arrow = document.createElement('span');
  arrow.textContent = '↗';
  arrow.setAttribute('aria-hidden', 'true');
  link.append(arrow);
  link.style.cssText = 'border-top:1px solid #e5e7eb;border-radius:0 0 10px 10px;margin-top:6px;padding-top:14px;color:#2563eb;font-weight:600';
  panel.append(link);
  panel.style.maxHeight = 'max(120px, calc(100dvh - 260px))';
  panel.style.overflowY = 'auto';
})();
