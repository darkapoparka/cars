import fs from 'node:fs/promises';import {load} from 'cheerio';
const base='https://shop.creativemox.com/nusavo/';const assets=JSON.parse(await fs.readFile('reference/assets.json','utf8'));const routes=JSON.parse(await fs.readFile('reference/routes.json','utf8'));const unique=[...new Map(routes.map(r=>[r.slug,r])).values()].filter(r=>r.status===200);
await fs.mkdir('src/pages',{recursive:true});await fs.mkdir('public/styles',{recursive:true});
function asset(s,from=base){try{let u=new URL(s,from).href.replace(/^http:/,'https:');return assets[u]||s}catch{return s}}
function cssLocal(css,from=base){return css.replace(/url\((["']?)([^)'"\s]+)\1\)/g,(m,q,u)=>`url("${asset(u,from)}")`)}
for(const [url,local] of Object.entries(assets)){if(local.endsWith('.css')||url.includes('fonts.googleapis.com')){let css=await fs.readFile('public'+local,'utf8');await fs.writeFile('public'+local,cssLocal(css,url))}}
function href(s,label=''){if(!s)return '#preview-info';if(s.includes('add-to-cart=')){return '/cart/?add='+new URL(s).searchParams.get('add-to-cart')}if(s.includes('elementor_library=')){let q=new URL(s).searchParams.get('elementor_library');return {'nusavo-listing-car':'/car-listing/','nusavo-blog-archive':'/blog/','nusavo-error-404':'/404/','nusavo-purchase-summary':'/purchase-summary/'}[q]||'/car-listing/'}if(s.startsWith(base)||s==='https://shop.creativemox.com/nusavo'){s=s.replace(/https?:\/\/shop.creativemox.com\/nusavo\/?/,'/');if(s.includes('wp-content'))return asset(base+s.slice(1));if(s.includes('/brand/')||s.includes('/product-tag/'))return '/car-listing/';}if(s==='#'||s.endsWith('/#')){if(/book|find your car/i.test(label))return '/car-listing/';if(/15%|member/i.test(label))return '/my-account/';if(/article|insight/i.test(label))return '/blog/';if(/help center|requirement|guide|policy|terms|privacy|cookie/i.test(label))return '/faq/';if(/support|ticket|chat/i.test(label))return '/contact-us/';if(/learn more|rental|transfer|transport|assistance|chauffeur/i.test(label))return '/services/';return '#preview-info';}return s}
const voids=new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));const bools=new Set('disabled checked selected multiple required readonly autofocus open hidden controls autoplay loop muted playsinline novalidate formnovalidate download'.split(' '));
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/{/g,'&#123;').replace(/}/g,'&#125;');
function render(node){if(node.name==="native-cart")return "<Cart/>";if(node.name==="native-order")return "<OrderSummary/>";if(node.name==="native-confirmation")return "<OrderSummary confirmation/>";if(node.type==='text')return esc(node.data);if(node.type!=='tag')return '';let tag=node.name;if(['script','style','noscript','link'].includes(tag))return '';let attrs='';for(let [k,v] of Object.entries(node.attribs||{})){if(k.startsWith('on')||['data-settings','srcset','sizes','data-thumb-srcset','data-thumb-sizes'].includes(k))continue;if(k==='class')v=v.replace(/elementor-invisible|animated|fadeIn\w+/g,'').replace(/\bcurrent-menu-item\b|\bcurrent_page_item\b/g,'');if(k==='href')v=href(v,load(node).text().trim());if(['src','poster','data-src','data-large_image','data-thumb'].includes(k))v=asset(v);if(k==='style')v=cssLocal(v).replace(/opacity:\s*0[;]?/g,'opacity:1;');if(k==='tabindex'&&tag==='summary')v='0';if(k==='aria-expanded'&&tag==='summary')continue;if(k==='loading')v='eager';if(k==='action')continue;if(k==='for')k='for';if(bools.has(k)){attrs+=' '+k;continue;}attrs+=` ${k}="${esc(v).replace(/"/g,'&quot;')}"`;}
if((node.attribs?.class||'').split(' ').includes('swiper'))attrs+=' {@attach carousel}';if(tag==='img'&&!('alt' in node.attribs))attrs+=' alt=""';if(tag==='form')attrs+=' onsubmit={submitForm}';if(tag==='input'&&node.attribs.type==='hidden')return '';if(tag==='button'&&!node.attribs.type)attrs+=' type="button"';return `<${tag}${attrs}>`+(voids.has(tag)?'':(node.children||[]).map(render).join('')+`</${tag}>`)}
function prepare($,r){
 $('img[alt="Picture of Emily Quinn"]').attr('alt','Emily Quinn');
 $('.elementor-widget:has(.swiper)').each((i,e)=>$(e).attr('data-carousel',$(e).attr('data-settings')||'{}'));
 $('.number-percentage').each((i,e)=>{$(e).text($(e).attr('data-value'));$(e).closest('.skillbar-group').find('.skill-track').css('width',$(e).attr('data-value')+'%')});
 $('label.e-coupon-anchor-description').attr('for','coupon_code');
 $('.pswp,.woocommerce-notices-wrapper').remove();
 $('a:not([href])').attr('href','#');
 $('[tabindex]').each((i,e)=>{if(!['a','button','input','summary','select','textarea'].includes(e.name)&&!['button','tab'].includes($(e).attr('role')))$(e).removeAttr('tabindex')});
 $('.elementor-nav-menu .menu-item-has-children > a').append('<span class="sub-arrow"><svg aria-hidden="true" class="e-font-icon-svg e-fas-angle-down" viewBox="0 0 320 512"><path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0L160 256.2l96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.3 9.4-24.5 9.4-33.9 0z"/></svg></span>');
 $('.elementor-menu-toggle').attr('role','button').attr('tabindex','0').attr('aria-label','Open navigation');
 if(r.slug==='cart')$('.elementor-widget-woocommerce-cart .woocommerce').html('<native-cart></native-cart>');
 if(r.slug==='checkout'){
  $('.woocommerce-checkout-review-order-table').replaceWith('<native-order></native-order>');
  $('.validate-required input,.validate-required select').attr('required','');
  $('.shipping_address input,.shipping_address select').attr('disabled','');
  $('#ship-to-different-address-checkbox').removeAttr('checked');
  $('.shipping_address').css('display','none');
 }
 if(r.slug==='purchase-summary')$('.elementor-element-6983cd06 > .e-con-inner').html('<div class="woocommerce local-purchase-summary"><native-confirmation></native-confirmation></div>');
}
const carImages={};for(const slug of ['urbango-hatchback','evolve-electric-suv','prestige-executive','terrax-suv','grandis-mpv','veloce-sedan','voyager-minivan','trailmark-4x4']){const $=load(await fs.readFile(`reference/pages/${slug}.html`,'utf8'));carImages[slug]=asset($('.woocommerce-product-gallery img').first().attr('src'));}await fs.writeFile('src/car-images.json',JSON.stringify(carImages,null,2));
const pages={};
for(const r of unique){let $=load(await fs.readFile(`reference/pages/${r.slug}.html`,'utf8'));let styles=[];$('link[rel=stylesheet]').each((i,e)=>{let u=$(e).attr('href');let local=asset(u);if(local.startsWith('/assets/'))styles.push(`<link rel="stylesheet" href="${local}"${$(e).attr('media')?` media="${$(e).attr('media')}"`:''}/>`)});let inline=$('style').map((i,e)=>$(e).text()).get().join('\n');await fs.writeFile(`public/styles/${r.slug}.css`,cssLocal(inline));styles.push(`<link rel="stylesheet" href="/styles/${r.slug}.css"/>`);
$('body script,body style,body noscript,#wpadminbar,.skip-link,.widget_shopping_cart_content').remove();$('body > svg').remove();$('.elementor-counter-number').each((i,e)=>$(e).text($(e).attr('data-to-value')||$(e).text()));$('.single_add_to_cart_button').attr('data-book',r.slug);$('.woocommerce-product-gallery').css('opacity','1');
prepare($,r);const output=`<script>import { submitForm } from '../interactions.js';import {carousel} from '../carousel.js';import Cart from '../Cart.svelte';import OrderSummary from '../OrderSummary.svelte';</script>\n<svelte:head><title>${esc(r.title)}</title>${styles.join('\n')}</svelte:head>\n`+$('body').contents().toArray().map(render).join('');await fs.writeFile(`src/pages/${r.slug}.svelte`,output);pages[r.slug]={title:r.title,bodyClass:r.bodyClass,source:r.source};}
await fs.writeFile('src/pages.json',JSON.stringify(pages,null,2));console.log('Generated',Object.keys(pages).length,'native Svelte pages');





