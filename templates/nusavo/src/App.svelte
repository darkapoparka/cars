<script>
 import pages from './pages.json';
 import {cars,addCar} from './interactions.js';
 const loaders=import.meta.glob('./pages/*.svelte');
 const pathname=window.location.pathname.replace(/^\/nusavo\/?/,'/');
 const query=new URLSearchParams(window.location.search);
 if(query.has('add')){addCar(query.get('add'));history.replaceState(null,'',pathname)}
 const alias={'nusavo-listing-car':'car-listing','nusavo-blog-archive':'blog','nusavo-error-404':'404','nusavo-purchase-summary':'purchase-summary','self-drive-or-chauffeur-rental-which-is-better':'single-post'};
 let slug=pathname.split('/').filter(Boolean).pop()||'home';slug=alias[query.get('elementor_library')]||alias[slug]||slug;if(pathname.startsWith('/2026/07/27'))slug='date-archive';if(!pages[slug])slug='404';
 document.body.className=pages[slug]?.bodyClass||'elementor-kit-16';
 const load=loaders[`./pages/${slug}.svelte`]().then(m=>m.default);
 let menuOpen=$state(false);let notice=$state('');let lightbox=$state('');let video=$state('');
 $effect(()=>{const open=menuOpen;document.querySelectorAll('.elementor-menu-toggle').forEach(el=>el.setAttribute('aria-expanded',String(open)));document.querySelectorAll('.elementor-nav-menu--dropdown.elementor-nav-menu__container').forEach(el=>el.setAttribute('aria-hidden',String(!open)))});
 function click(event){const target=event.target;if(!(target instanceof Element))return;
  if(target.closest('.elementor-menu-toggle')){event.preventDefault();menuOpen=!menuOpen;return;}
  const filter=target.closest('.e-filter-item');if(filter){const value=filter.getAttribute('data-filter');document.querySelectorAll('.e-filter-item').forEach(el=>el.setAttribute('aria-pressed',String(el===filter)));document.querySelectorAll('.elementor-widget-loop-grid .e-loop-item').forEach(el=>{el.hidden=value!=='__all'&&!el.classList.contains('product_cat-'+value)});return;}
  const book=target.closest('[data-book]');if(book){event.preventDefault();const car=cars.find(c=>c.slug===book.getAttribute('data-book'));if(car)location.href='/cart/?add='+car.id;return;}
  const a=target.closest('a');if(!a)return;
  if(a.classList.contains('ekit-video-popup')){event.preventDefault();video=a.href;return;}
  if(a.classList.contains('showcoupon')){event.preventDefault();const box=document.querySelector('.e-coupon-anchor');if(box)box.classList.toggle('coupon-visible');return;}
  if(a.closest('.woocommerce-product-gallery')&&a.getAttribute('href')?.startsWith('/assets/')){event.preventDefault();lightbox=a.getAttribute('href');return;}
  if(['#','#preview-info'].includes(a.getAttribute('href'))){event.preventDefault();if(a.parentElement.classList.contains('menu-item-has-children'))a.parentElement.classList.toggle('submenu-open');else notice='This demo link has no destination in the original template.';}
 }
 function key(event){if(event.key==='Escape'){if(menuOpen)document.querySelector('.elementor-menu-toggle')?.focus();menuOpen=false;notice='';lightbox='';video='';}if((event.key==='Enter'||event.key===' ')&&event.target instanceof Element&&event.target.closest('.elementor-menu-toggle')){event.preventDefault();menuOpen=!menuOpen;}}
 function change(event){const input=event.target;if(!(input instanceof HTMLInputElement))return;if(input.name==='payment_method'){document.querySelectorAll('.payment_box').forEach(el=>{el.style.display=el.classList.contains('payment_method_'+input.value)?'block':'none'})}if(input.id==='ship-to-different-address-checkbox'){const el=document.querySelector('.shipping_address');if(el){el.style.display=input.checked?'block':'none';el.querySelectorAll('input,select').forEach(field=>{field.disabled=!input.checked})}}}
</script>
<svelte:document onclick={click} onkeydown={key} onchange={change}/>
<svelte:window onnusavo-notice={(e)=>notice=e.detail}/>
<div class:menu-open={menuOpen}>
 {#await load}<div class="page-loading" aria-label="Loading page"></div>{:then Page}<Page/>{/await}
</div>
{#if notice}<div class="preview-notice" role="status">{notice}<button onclick={()=>notice=''} aria-label="Dismiss">×</button></div>{/if}
{#if lightbox}<div class="image-viewer" role="presentation" onclick={(e)=>{if(e.target===e.currentTarget)lightbox=''}}><button onclick={()=>lightbox=''} aria-label="Close image">×</button><img src={lightbox} alt="Vehicle detail"/></div>{/if}
{#if video}<div class="image-viewer" role="presentation"><button onclick={()=>video=''} aria-label="Close video">×</button><iframe title="Nusavo introduction video" src={video} allow="autoplay; fullscreen" style="width:min(960px,90vw);height:min(540px,70vh);border:0"></iframe></div>{/if}
