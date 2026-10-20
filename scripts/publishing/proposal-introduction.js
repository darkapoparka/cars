/* Shared controls for six-design dealership previews. */
(() => {
  const proposal = __CARS_PROPOSAL_INTRO__;
  const featureImages = __CARS_FEATURE_IMAGES__;
  if (!proposal?.enabled || document.querySelector('style[data-cars-proposal-controls="compact-info"]')) return;
  const adminNavigation = globalThis.__CARS_ADMIN_NAVIGATION__;
  const dockStyle = document.createElement('style');
  dockStyle.dataset.carsProposalControls = 'compact-info';
  dockStyle.textContent = '@media(max-width:991px){dealer-design-switcher,excellent-design-switcher{bottom:var(--cars-proposal-dock-bottom,calc(16px + env(safe-area-inset-bottom,0px)))}}';
  document.head.append(dockStyle);
  let selectorRoot, controls;
  const hiddenStates = new WeakMap();
  const selector = () => document.querySelector('dealer-design-switcher, excellent-design-switcher');
  const language = () => {
    if (adminNavigation?.previewUrl) {
      const preview = new URL(adminNavigation.previewUrl);
      return preview.pathname.split('/').includes('bg') || preview.searchParams.get('lang') === 'bg' ? 'bg' : 'en';
    }
    const query = new URLSearchParams(location.search).get('lang');
    const route = location.pathname.split('/').find(part => part === 'bg' || part === 'en');
    return query === 'bg' || query === 'en' ? query : route || (document.documentElement.lang.startsWith('bg') ? 'bg' : 'en');
  };
  const copyByLanguage = {
    bg: {designs:'Визии',info:'Функции',tabs:'Визии и управление',designTitle:'Изберете дизайн',infoTitle:'Функции',menu:'Визии и функции',dashboard:'Админ',dashboardLabel:'Отвори администрацията на сайта',note:'Можем да добавим към всяка визия:',optional:'По избор',items:[['Автомобили','Снимки, цени и наличност.'],['Запитвания','Заявки и контакт с клиенти.'],['Огледи','Огледи и тестово шофиране.'],['Управление на сайта','Текстове, снимки и контакти.'],['Статистика','Посещения и интерес към колите.'],['AI помощник','Чернови на обяви и отговори.',true]]},
    en: {designs:'Designs',info:'Features',tabs:'Designs and management',designTitle:'Choose a design',infoTitle:'Features',menu:'Designs and features',dashboard:'Admin',dashboardLabel:'Open the website admin',note:'We can add these to any design:',optional:'Optional',items:[['Vehicles','Photos, prices and stock status.'],['Enquiries','Manage requests and follow-ups.'],['Viewings','Schedule viewings and test drives.'],['Website editing','Update text, images and contacts.'],['Analytics','Track visits and vehicle interest.'],['AI assistant','Draft listings and customer replies.',true]]},
  };
  const dashboardCopyByLanguage = {
    bg: {dashboards:'Панел',dashboardTitle:'Изберете админ панел',dashboardNote:'Две визии с примерни данни.',dashboardNames:['Панел 1','Панел 2'],dashboardDescriptions:['Наличности, запитвания и огледи.','Алтернативна визия за управление на автокъщата.'],demo:'Демо',open:'Отвори'},
    en: {dashboards:'Dashboard',dashboardTitle:'Choose a dashboard',dashboardNote:'Two styles with sample data.',dashboardNames:['Dashboard 1','Dashboard 2'],dashboardDescriptions:['Inventory, enquiries and viewings.','An alternative style for managing your dealership.'],demo:'Demo',open:'Open'},
  };
  const hidePanel = (panel, hidden) => {
    panel.hidden = hidden;
    // The existing chooser's focus trap checks the individual hidden flags.
    for (const element of panel.querySelectorAll('a,button')) {
      if (!hiddenStates.has(element)) hiddenStates.set(element, element.hidden);
      element.hidden = hidden || hiddenStates.get(element);
    }
  };
  const selectTab = (name, focus = false) => {
    if (!controls) return;
    controls.selected = name;
    const lang = language(), copy = {...copyByLanguage[lang],...dashboardCopyByLanguage[lang]}; controls.lang = lang;
    controls.tablist.setAttribute('aria-label', copy.tabs);
    controls.heading.textContent = name === 'designs' ? copy.designTitle : name === 'info' ? copy.infoTitle : copy.dashboardTitle;
    controls.note.textContent = copy.note;
    controls.dashboardNote.textContent = copy.dashboardNote;
    controls.dashboardLinks.forEach((link,index) => {
      link.querySelector('strong').textContent = copy.dashboardNames[index];
      link.querySelector('small').textContent = copy.dashboardDescriptions[index];
      link.querySelector('.proposal-demo').textContent = copy.demo;
      link.setAttribute('aria-label',`${copy.open} ${copy.dashboardNames[index]}`);
    });
    for (const [key, tab] of Object.entries(controls.tabs)) {
      tab.textContent = copy[key]; tab.setAttribute('aria-selected', String(key === name)); tab.tabIndex = key === name ? 0 : -1;
    }
    controls.features.forEach((feature, index) => {
      feature.querySelector('strong').textContent = copy.items[index][0];
      feature.querySelector('.proposal-feature-description').textContent = copy.items[index][1];
      const optional = feature.querySelector('.proposal-optional'); optional.textContent = copy.optional; optional.hidden = !copy.items[index][2];
    });
    const count = adminNavigation ? selectorRoot.querySelectorAll('.design').length : selectorRoot.querySelector('.count')?.textContent || '';
    const label = `${copy.menu} ${count}`.trim();
    controls.fab.setAttribute('aria-label', label); controls.fab.title = label;
    hidePanel(controls.grid, name !== 'designs'); hidePanel(controls.info, name !== 'info'); hidePanel(controls.dashboards, name !== 'dashboards');
    controls.sheet.scrollTop = 0;
    if (focus) controls.tabs[name].focus();
  };
  const decorate = root => {
    const sheet = root.querySelector('.sheet'), grid = root.querySelector('.design-grid');
    if (!sheet || !grid) return;
    const style = document.createElement('style');
    style.dataset.carsProposalControls = 'compact-info';
    style.textContent = `
      .fab{padding:4px}.fab-label{display:none}.fab-artwork{width:100%;height:100%}.fab-artwork img{width:46px;height:34px}
      .proposal-controls{position:sticky;top:48px;z-index:2;isolation:isolate;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));width:100%;height:44px;gap:0;margin:0 0 10px;padding:0;border:0;background:transparent}.proposal-controls::before{content:'';position:absolute;inset:4px 0;z-index:-1;border-radius:10px;background:#f2f4f6}
      .proposal-tabs{display:contents}
      .proposal-tab{position:relative;isolation:isolate;display:flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;padding:6px 4px;border:0;border-radius:9px;background:transparent;color:#626b76;font-size:15px;line-height:20px;font-weight:650;cursor:pointer;white-space:nowrap;text-decoration:none}.proposal-tab::before{content:'';position:absolute;inset:6px 3px;z-index:-1;border-radius:8px;background:transparent}.proposal-tab[aria-selected="true"]{color:#202126}.proposal-tab[aria-selected="true"]::before{background:#fff;box-shadow:0 1px 3px #00000012}
      .proposal-tab:hover{color:#202126}.proposal-tab:hover::before,.proposal-dashboard:hover{background:#fff;color:#202126}
      .proposal-feature-list{display:grid;gap:8px;margin:0;padding:0;list-style:none}.proposal-feature{display:grid;grid-template-columns:28px minmax(0,1fr);align-items:start;gap:6px;padding:10px 12px;border:1px solid #e7eaee;border-radius:12px;background:#fafbfc}.proposal-feature>img{width:28px;height:28px;margin:-4px 0 0;justify-self:center;object-fit:contain}.proposal-feature-heading{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.proposal-feature strong{font-size:14px;line-height:20px;font-weight:650;color:#252a32}.proposal-feature-description{display:block;margin-top:3px;color:#686e78;font-size:12px;line-height:18px}.proposal-optional{color:#737b87;font-size:10px;line-height:16px}.proposal-optional[hidden]{display:none}.proposal-note{margin:0 0 4px;color:#68717d;font-size:12px;line-height:18px}.proposal-info>.proposal-note{margin-bottom:10px}
      .proposal-tab:focus-visible,.proposal-dashboard:focus-visible{outline:3px solid #5b8def;outline-offset:2px}
      .proposal-dashboard-list{display:grid;gap:10px}.proposal-dashboard{display:flex;align-items:center;gap:12px;min-height:88px;padding:14px;border:1px solid #dfe3e7;border-radius:14px;background:#fafbfc;color:#252a32;text-decoration:none}.proposal-dashboard>span:first-child{flex:1;min-width:0}.proposal-dashboard strong{display:block;font-size:14px;line-height:20px}.proposal-dashboard small{display:block;margin-top:4px;color:#686e78;font-size:12px;line-height:18px}.proposal-demo{flex:none;padding:3px 7px;border-radius:6px;background:#edf0f3;color:#626b76;font-size:10px}.proposal-dashboard[aria-current="page"]{border-color:#303030;background:#f4f5f6;box-shadow:0 0 0 1px #303030}
    `;
    root.append(style);
    const toolbar = document.createElement('div'); toolbar.className = 'proposal-controls';
    const tablist = document.createElement('div'); tablist.className = 'proposal-tabs'; tablist.setAttribute('role','tablist');
    const tabs = {};
    for (const name of ['designs','info','dashboards']) {
      const tab = document.createElement('button'); tab.type = 'button'; tab.className = 'proposal-tab'; tab.id = `proposal-${name}-tab`;
      tab.setAttribute('role','tab'); tab.setAttribute('aria-controls',`proposal-${name}-panel`);
      tab.addEventListener('click',() => selectTab(name,true)); tabs[name] = tab; tablist.append(tab);
    }
    grid.id = 'proposal-designs-panel'; grid.setAttribute('role','tabpanel'); grid.setAttribute('aria-labelledby',tabs.designs.id);
    const info = document.createElement('section'); info.className = 'proposal-info'; info.id = 'proposal-info-panel';
    info.setAttribute('role','tabpanel'); info.setAttribute('aria-labelledby',tabs.info.id);
    const list = document.createElement('ul'); list.className = 'proposal-feature-list';
    const dashboardUrl = path => {
      const url = new URL(path,adminNavigation?.adminOrigin || proposal.adminOrigin || 'https://cars-admin-blue.vercel.app/'); url.searchParams.set('dealer',adminNavigation?.dealerId || proposal.dealerId);
      const preview = new URL(adminNavigation?.previewUrl || location.pathname,location.origin);
      const langQuery = new URLSearchParams(location.search).get('lang');
      if (langQuery === 'bg' || langQuery === 'en') preview.searchParams.set('lang',langQuery);
      url.searchParams.set('preview',preview.href);
      return url.href;
    };
    const dashboards = document.createElement('section'); dashboards.className = 'proposal-dashboards'; dashboards.id = 'proposal-dashboards-panel';
    dashboards.setAttribute('role','tabpanel'); dashboards.setAttribute('aria-labelledby',tabs.dashboards.id);
    const dashboardNote = document.createElement('p'); dashboardNote.className = 'proposal-note';
    const dashboardList = document.createElement('div'); dashboardList.className = 'proposal-dashboard-list';
    const dashboardLinks = ['/','/dashboard-2'].map(path => {
      const link = document.createElement('a'); link.className = 'proposal-dashboard'; link.href = dashboardUrl(path);
      link.innerHTML = '<span><strong></strong><small></small></span><span class="proposal-demo"></span>';
      if (adminNavigation && new URL(link.href).origin === location.origin && location.pathname.replace(/\/$/,'') === path.replace(/\/$/,'')) link.setAttribute('aria-current','page');
      dashboardList.append(link); return link;
    });
    dashboards.append(dashboardNote,dashboardList);
    toolbar.append(tablist);
    const features = featureImages.map(image => {
      const feature = document.createElement('li'); feature.className = 'proposal-feature';
      const artwork = `<img src="${image}" width="28" height="28" alt="" aria-hidden="true" decoding="async">`;
      feature.innerHTML = `${artwork}<div><div class="proposal-feature-heading"><strong></strong><small class="proposal-optional"></small></div><small class="proposal-feature-description"></small></div>`;
      list.append(feature); return feature;
    });
    const note = document.createElement('p'); note.className = 'proposal-note'; info.append(note,list);
    const admin = sheet.querySelector(':scope > a.admin'); if (admin) admin.hidden = true;
    grid.before(toolbar); grid.after(info,dashboards);
    controls = {sheet,grid,info,features,note,tablist,tabs,dashboards,dashboardNote,dashboardLinks,selected:'designs',fab:root.querySelector('.fab'),heading:root.querySelector('.heading'),close:root.querySelector('.close')};
    controls.fab.addEventListener('click',() => { if (!sheet.hidden) selectTab(controls.selected,true); });
    tablist.addEventListener('keydown',event => {
      const names = ['designs','info','dashboards']; let index = names.indexOf(controls.selected);
      if (event.key === 'ArrowRight') index = (index+1)%names.length;
      else if (event.key === 'ArrowLeft') index = (index+names.length-1)%names.length;
      else if (event.key === 'Home') index = 0;
      else if (event.key === 'End') index = names.length-1;
      else return;
      event.preventDefault(); selectTab(names[index],true);
    });
    selectTab('designs');
  };
  const position = () => {
    const element = selector();
    if (!element || innerWidth >= 992) return;
    let offset = 0;
    for (const nav of document.querySelectorAll('nav,[role="navigation"]')) {
      for (let container = nav; container && container !== document.body; container = container.parentElement) {
        if (getComputedStyle(container).position !== 'fixed') continue;
        const rect = container.getBoundingClientRect();
        if (rect.height > 0 && rect.height <= 120 && rect.width > 0 && rect.top >= innerHeight / 2 && rect.bottom <= innerHeight + 1) {
          offset = Math.max(offset, innerHeight - rect.top + 12);
        }
        break;
      }
    }
    element.style.setProperty('--cars-proposal-dock-bottom', offset ? `${offset}px` : 'calc(16px + env(safe-area-inset-bottom,0px))');
  };
  const sync = () => {
    const root = selector()?.shadowRoot;
    if (root && root !== selectorRoot) {
      selectorRoot = root;
      decorate(root);
      observer.observe(root, {subtree:true,attributes:true,attributeFilter:['hidden']});
    }
    if (controls && controls.lang !== language()) selectTab(controls.selected);
    position();
  };
  const observer = new MutationObserver(sync);
  observer.observe(document.body, {childList:true,subtree:true,attributes:true,attributeFilter:['open','hidden','aria-modal','lang']});
  sync();
  addEventListener('resize', () => requestAnimationFrame(position), {passive:true});
  addEventListener('load', () => requestAnimationFrame(sync), {once:true});
  document.addEventListener('load', event => {
    if (event.target.matches?.('link[rel~="stylesheet"]')) requestAnimationFrame(position);
  }, true);
  document.addEventListener('DOMContentLoaded', sync, {once:true});
  setTimeout(sync, 900);
})();
