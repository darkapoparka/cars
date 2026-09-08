import { mount, unmount } from 'svelte';
import Calculator from './Calculator.svelte';
import Compare from './Compare.svelte';
import vendors from './generated/vendor.json';
import { getCatalog, readIds, type Vehicle } from './catalog';
type UI = { notify: (message: string) => void; showModal: (title: string, html: string) => void };
declare global { interface Window { jQuery: any; } }
const escape = (s: string) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));

export async function initialize(root: HTMLElement, ui: UI, path: string) {
  const controller = new AbortController(), {signal} = controller;
  const components: ReturnType<typeof mount>[] = [];
  const catalog = getCatalog();
  for (const src of [...vendors,'/assets/sliding-menu.min.js']) await new Promise<void>((resolve,reject) => { const s = document.createElement('script'); s.src=src; s.onload=()=>resolve();s.onerror=()=>reject(new Error('Unable to load '+src));document.head.appendChild(s); });
  const $=window.jQuery;
  root.querySelectorAll('.elementor-invisible').forEach(e=>e.classList.remove('elementor-invisible'));
  root.querySelectorAll<HTMLElement>('.elementor-counter-number').forEach(e=>e.textContent=Number(e.dataset.toValue || 0).toLocaleString('en-US'));
  for (const wrapper of root.querySelectorAll<HTMLElement>('.apus-mortgage-calculator')) {
    const target=wrapper.parentElement!, compact=path!=='/calculator/'; wrapper.remove();
    components.push(mount(Calculator,{target,props:{compact}}));
  }
  if(path==='/compare/') {const target=root.querySelector<HTMLElement>('#main');if(target){target.replaceChildren();components.push(mount(Compare,{target,props:{vehicles:catalog}}));}}
  function initCarousels(scope: HTMLElement) {
    $(scope).find('.slick-carousel:not(.slick-initialized)').each(function(this:HTMLElement){
      const el=$(this), d=el.data(), items=d.items||4;
      el.slick({infinite:!!d.infinite,arrows:!!d.nav,dots:!!d.pagination,slidesToShow:items,slidesToScroll:d.slidestoscroll||items,autoplay:false,centerMode:!!d.centermode,centerPadding:d.centerpadding||'0px',rows:0,adaptiveHeight:false,
        prevArrow:'<button type="button" aria-label="Previous slide" class="slick-arrow slick-prev"><i class="flaticon-arrowhead-thin-outline-to-the-left"></i><span class="textnav">Previous</span></button>',
        nextArrow:'<button type="button" aria-label="Next slide" class="slick-arrow slick-next"><span class="textnav">Next</span><i class="flaticon-arrow-point-to-right"></i></button>',
        responsive:[[1400,'smalldesktop',items],[1200,'large',4],[992,'medium',3],[768,'small',2],[576,'smallest',2]].map(([breakpoint,key,fallback])=>({breakpoint,settings:{slidesToShow:d[key]||fallback,slidesToScroll:d['slidestoscroll_'+key]||d[key]||fallback}}))});
    });
  }
  initCarousels(root);
  $('select').each(function(this:HTMLSelectElement){ const el=$(this);el.select2({width:el.hasClass('orderby')?'auto':'100%',minimumResultsForSearch:10,allowClear:!!el.attr('data-placeholder'),placeholder:el.attr('data-placeholder'),theme:el.closest('.filter-listing-form.horizontal').length?'default customizer-search':'default'}); });
  $('.nav-tabs a, .nav-pills a').on('shown.bs.tab',()=>$('.slick-initialized').slick('setPosition'));
  root.querySelectorAll<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>('input:not([type=hidden]),select,textarea').forEach((el,i)=>{
    if(el.getAttribute('aria-required')==='true')el.required=true;
    if(!el.id)el.id='boxcar-field-'+i;
    const label=el.parentElement?.querySelector('label');if(label)label.htmlFor=el.id;
    if(!el.labels?.length&&!el.getAttribute('aria-label'))el.setAttribute('aria-label',el.getAttribute('placeholder')||el.name.replace(/[-_]/g,' ')||'Value');
  });
  root.querySelectorAll<HTMLFormElement>('form.wpcf7-form').forEach(form=>form.noValidate=false);
  root.querySelectorAll<HTMLElement>('.btn-showmenu,.heading-filter-price').forEach(el=>{el.setAttribute('role','button');el.tabIndex=0;el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}},{signal});});
  const mobileMenu=root.querySelector<HTMLElement>('#apus-mobile-menu');
  if(mobileMenu) {mobileMenu.setAttribute('aria-label','Mobile navigation');mobileMenu.inert=true;}
  function toggleMenu(open: boolean) {
    if(!mobileMenu)return;mobileMenu.classList.toggle('active',open);mobileMenu.inert=!open;
    if(open)$('#mobile-menu-container').slidingMenu({backLabel:'Back'});
    root.querySelector('#apus-header-mobile .btn-showmenu')?.setAttribute('aria-expanded',String(open));document.body.classList.toggle('local-menu-open',open);
    if(open)mobileMenu.querySelector<HTMLElement>('a,button')?.focus();else root.querySelector<HTMLElement>('#apus-header-mobile .btn-showmenu')?.focus();
  }
  function updateSaved() {for(const el of root.querySelectorAll<HTMLElement>('.btn-add-listing-favorite,.btn-add-listing-compare')){const compare=el.matches('.btn-add-listing-compare'),active=readIds(compare?'boxcar-compare':'boxcar-favorites').includes(el.dataset.listing_id||'');el.classList.toggle('local-selected',active);el.setAttribute('aria-pressed',String(active));el.setAttribute('aria-label',`${compare?'Compare':'Save'} ${catalog.find(c=>c.id===el.dataset.listing_id)?.title||'vehicle'}`);}}
  updateSaved();
  const params=new URLSearchParams(location.search);
  for(const [name,value] of params){const field=root.querySelector<HTMLInputElement|HTMLSelectElement>(`[name="${CSS.escape(name)}"]`);if(field&&field.type!=='radio'){field.value=value;$(field).trigger('change.select2');}}
  const listingRow=root.querySelector('article.listing-grid')?.parentElement?.parentElement;
  const isListings=path.startsWith('/listings/');
  let activeParams=new URLSearchParams(params);
  function renderListings(query: URLSearchParams, push=false) {
    if(!isListings||!listingRow)return;
    let cars=catalog.filter(c=>{
      for(const [name,value] of query){if(!name.startsWith('filter-')||!value||value==='0'||name==='filter-orderby')continue;
        const key=name.slice(7);
        if(key==='price-from'){if(c.price<Number(value))return false;}
        else if(key==='price-to'){if(c.price>Number(value))return false;}
        else if(key==='title'){if(!c.title.toLowerCase().includes(value.toLowerCase()))return false;}
        else if(key.endsWith('-from')||key.endsWith('-to')){const label=key.startsWith('year')?'Year':'Mileage',v=Number((c.specs[label]||'0').replace(/[^\d.]/g,''));if(key.endsWith('-from')&&v<Number(value)||key.endsWith('-to')&&v>Number(value))return false;}
        else if(key==='cylinder'){if(c.specs.Cylinder!==value)return false;}
        else if(!c.classes.includes('listing_'+key+'-'+value))return false;
      } return true;
    });
    const order=query.get('filter-orderby');if(order==='price-lowest')cars.sort((a,b)=>a.price-b.price);if(order==='price-highest')cars.sort((a,b)=>b.price-a.price);if(order==='newest')cars.sort((a,b)=>Number(b.id)-Number(a.id));if(order==='oldest')cars.sort((a,b)=>Number(a.id)-Number(b.id));if(order==='random')cars.sort(()=>Math.random()-.5);
    const currentPage=Number(query.get('page')||1),offset=(currentPage-1)*12,shown=cars.slice(offset,offset+12);
    listingRow.innerHTML=shown.length?shown.map(c=>`<div class="col-12 col-md-6 col-lg-4 col-xl-3">${c.html}</div>`).join(''):'<div class="col-12"><p class="alert alert-warning">No listings found. Try changing your filters.</p><a class="btn btn-theme" href="/listings/">Reset filters</a></div>';
    const count=root.querySelector('.results-count');if(count)count.textContent=cars.length?`Showing ${offset+1} – ${Math.min(offset+12,cars.length)} of ${cars.length} results`:'Showing 0 results';
    const pagination=root.querySelector('.pagination');if(pagination)pagination.innerHTML=Array.from({length:Math.ceil(cars.length/12)},(_,i)=>`<li>${i+1===currentPage?`<span class="page-numbers current">${i+1}</span>`:`<a class="page-numbers" href="/listings/?${new URLSearchParams({...Object.fromEntries(query),page:String(i+1)})}">${i+1}</a>`}</li>`).join('');
    activeParams=query;if(push)history.pushState(null,'','/listings/?'+query.toString());updateSaved();
  }
  if(isListings&&[...params].some(([k,v])=>v&&v!=='0'&&k!=='style'))renderListings(params);
  $('.listings-ordering select').on('change',function(this:HTMLSelectElement){activeParams.set('filter-orderby',this.value);activeParams.delete('page');renderListings(activeParams,true);});
  $('[name="filter-make"]').on('change',function(this:HTMLSelectElement){const model=$(this.form).find('[name="filter-model"]');model.find('option').each((i:number,opt:HTMLOptionElement)=>{opt.disabled=!!this.value&&!!opt.value&&!opt.classList.contains('condition-'+this.value);});model.val('').trigger('change.select2');});
  const formHtml = '<form class="local-contact-form"><label>Name<input class="form-control" name="name" autocomplete="name" required></label><label>Email<input class="form-control" name="email" type="email" autocomplete="email" required></label><label>Phone<input class="form-control" name="phone" type="tel" autocomplete="tel"></label><label>Message<textarea class="form-control" name="message" rows="4" required></textarea></label><button class="btn btn-theme" type="submit">Submit request ↗</button></form>';
  function click(event: MouseEvent) {
    const target=event.target as Element, el=target.closest<HTMLElement>('a,button,.btn-showmenu,.heading-label,.price-filter li,.elementor-tab-title');if(!el)return;
    const href=el.getAttribute('href')||'',text=el.textContent?.trim()||'';
    if(el.matches('.btn-showmenu')){event.preventDefault();toggleMenu(!mobileMenu?.classList.contains('active'));return;}
    if(el.matches('.close-menu,.close-offcanvas,.close')){toggleMenu(false);}
    if(el.matches('.sliding-menu__nav'))return;
    if(el.matches('.btn-add-listing-favorite,.btn-add-listing-compare')){event.preventDefault();const compare=el.matches('.btn-add-listing-compare'),key=compare?'boxcar-compare':'boxcar-favorites',id=el.dataset.listing_id||'';let ids=readIds(key);const exists=ids.includes(id);if(compare&&!exists&&ids.length>=4){ui.notify('You can compare up to four vehicles. Remove one on the Compare page.');return;}ids=exists?ids.filter(x=>x!==id):[...ids,id];localStorage.setItem(key,JSON.stringify(ids));updateSaved();ui.notify(exists?'Vehicle removed.':compare?'Vehicle added. Open Pages → Compare to compare your cars.':'Vehicle saved on this device.');return;}
    if(el.matches('.advance-search-btn')){event.preventDefault();const panel=$(el).closest('.search-form-inner').find('.advance-search-wrapper-fields');panel.slideToggle(150);el.setAttribute('aria-expanded',String(panel.is(':visible')));return;}
    if(el.matches('.heading-label')){event.preventDefault();el.closest('.wrapper-action')?.classList.toggle('active');return;}
    if(el.matches('.price-filter li')){event.preventDefault();const form=el.closest('form')!,min=form.querySelector<HTMLInputElement>('[name="filter-price-from"]'),max=form.querySelector<HTMLInputElement>('[name="filter-price-to"]');if(min)min.value=el.dataset.min||'';if(max)max.value=el.dataset.max||'';const wrapper=el.closest('.wrapper-action');const label=wrapper?.querySelector('.heading-label .inner-label');if(label)label.textContent=el.textContent;wrapper?.classList.remove('active');return;}
    if(el.matches('.elementor-tab-title')){const content=el.nextElementSibling;const active=el.classList.toggle('elementor-active');el.setAttribute('aria-expanded',String(active));if(content instanceof HTMLElement){content.style.display=active?'block':'none';content.classList.toggle('elementor-active',active);}return;}
    if(el.matches('.btn-show-popup')||/Schedule Test Drive|Make An Offer|Message Dealer/.test(text)){event.preventDefault();ui.showModal(text||'Contact dealer',formHtml);return;}
    if(el.matches('.action-share')||text==='Share'){event.preventDefault();navigator.clipboard?.writeText(location.href).then(()=>ui.notify('Listing link copied.')).catch(()=>ui.showModal('Share this listing',`<input class="form-control" readonly value="${escape(location.href)}">`));return;}
    if(el.matches('[data-elementor-lightbox-slideshow],.listing-detail-gallery a[href$=".jpg"]')||el.closest('.listing-detail-gallery')&&/\.(jpg|png|webp)$/.test(href)){event.preventDefault();ui.showModal('Vehicle gallery',`<img class="local-lightbox-image" src="${escape(href)}" alt="Vehicle photo">`);return;}
    if(el.matches('.popup-video')){event.preventDefault();const id=href.match(/(?:v=|youtu.be\/)([\w-]+)/)?.[1];if(id)ui.showModal('Video',`<iframe title="Vehicle video" src="https://www.youtube.com/embed/${id}" allow="fullscreen" class="local-video"></iframe>`);return;}
    if(/Brochure|Vin Report|VIN Report/.test(text)){event.preventDefault();ui.notify('The demo does not provide this document locally.');return;}
    if(href==='/login/'||href==='/register/'||href.includes('add-listing')){event.preventDefault();ui.showModal(text||'Sign in','<p>Account and listing submission services are not connected in this local demo.</p><a class="btn btn-theme" href="/contact-us/">Contact us ↗</a>');return;}
    if(el.matches('.page-numbers')&&isListings){event.preventDefault();const url=new URL(href,location.href);let q=new URLSearchParams(url.search);if(href.includes('/page/2'))q.set('page','2');renderListings(q,true);root.querySelector('.results-count')?.scrollIntoView({block:'center'});return;}
    if(href==='#'&&!el.matches('[data-bs-toggle],[data-toggle],.leaflet-control-zoom-in,.leaflet-control-zoom-out')){event.preventDefault();if(/Top/i.test(text)||el.matches('.back-to-top'))window.scrollTo({top:0,behavior:'smooth'});else ui.showModal(text||'Boxcar','<p>This demo link has no destination configured.</p><a class="btn btn-theme" href="/contact-us/">Get in touch ↗</a>');return;}
    if(href.startsWith('/category/')||href.startsWith('/tag/')||href.startsWith('/author/')){event.preventDefault();location.href='/blog/?style=full';}
  }
  root.addEventListener('click',click,{signal});
  root.addEventListener('submit',event=>{
    const form=event.target as HTMLFormElement;if(form.closest('.apus-mortgage-calculator'))return;event.preventDefault();
    if(form.matches('.filter-listing-form')){const query=new URLSearchParams();new FormData(form).forEach((v,k)=>{if(typeof v==='string'&&v&&v!=='0')query.append(k,v);});if(isListings)renderListings(query,true);else location.href='/listings/?'+query;}
    else if(!form.matches('.listings-ordering'))ui.notify('This form is ready for a backend connection. No message was sent.');
  },{signal});
  window.addEventListener('popstate',()=>{if(isListings)renderListings(new URLSearchParams(location.search));},{signal});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){toggleMenu(false);root.querySelectorAll('.wrapper-action.active').forEach(x=>x.classList.remove('active'));}if(e.key==='Tab'&&mobileMenu?.classList.contains('active')){const focusable=[...mobileMenu.querySelectorAll<HTMLElement>('a,button,[tabindex="0"]')].filter(el=>el.getClientRects().length);const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}},{signal});
  const maps: {remove:()=>void}[]=[];
  if(root.querySelector('.single-listing-map')){
    const L=await import('leaflet');
    root.querySelectorAll<HTMLElement>('.single-listing-map').forEach(el=>{
      const lat=Number(el.dataset.latitude),lng=Number(el.dataset.longitude);
      const map=L.map(el,{scrollWheelZoom:false}).setView([lat,lng],15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}).addTo(map);
      L.marker([lat,lng],{icon:L.divIcon({className:'',html:'<div class="map-popup"><div class="icon-wrapper has-img"><i class="flaticon-pin"></i></div></div>',iconSize:[0,0]})}).addTo(map);
      maps.push(map);
    });
  }
  document.documentElement.dataset.boxcarReady='true';
  return ()=>{controller.abort();maps.forEach(map=>map.remove());components.forEach(component=>unmount(component));$('.slick-initialized').slick('unslick');$('.select2-hidden-accessible').select2('destroy');};
}
