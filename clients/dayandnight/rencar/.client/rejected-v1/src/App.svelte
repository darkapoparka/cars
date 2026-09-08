<script>
  import Shell from './client/Shell.svelte';
  import Home from './client/Home.svelte';
  import Catalog from './client/Catalog.svelte';
  import VehicleDetail from './client/VehicleDetail.svelte';
  import Contact from './client/Contact.svelte';
  import About from './client/About.svelte';
  import Variants from './client/Variants.svelte';
  import {brand,vehicles} from './client/data.js';
  import './client/client.css';
  const route=location.pathname.replace(/\/$/,'').split('/').pop()||'';
  const homes={'':2,'index.html':1,'index-2.html':2,'index-3.html':3,'index-4.html':4,'index-5.html':5};
  const variant=homes[route]||2;
  const isHome=Object.hasOwn(homes,route);
  const catalogs=['car.html','car-2.html'];
  const enquiries=['contact.html','car-booking.html','car-checkout.html','mail-success.html'];
  const about=['about.html','service.html','service-2.html','service-single.html'];
  const page=isHome?'home':catalogs.includes(route)?'cars':route==='car-single.html'?'detail':enquiries.includes(route)?'contact':about.includes(route)?route==='about.html'?'about':'services':route==='variants.html'?'variants':'missing';
  const names={home:'Автомобили, внос и лизинг',cars:'Автомобили',detail:vehicles.find(v=>v.id===new URLSearchParams(location.search).get('id'))?.title||'Автомобил',contact:'Контакти',about:'За нас',services:'Внос и лизинг',variants:'Начални страници',missing:'Страницата не е намерена'};
  document.body.className=`dn-client ${isHome?(variant===5?'home-2':`home-${variant}`):'home-2'} dn-page-${page}`;
</script>
<svelte:head><title>{names[page]} | {brand.latinName}</title><meta name="description" content="Ден и Нощ Ауто Груп — автомобили, внос по заявка и собствен лизинг в София. Разгледайте моделите и уговорете разговор с екипа." /></svelte:head>
<Shell active={page==='detail'?'cars':page} {variant}>
  {#if page==='home'}<Home {variant} />
  {:else if page==='cars'}<Catalog />
  {:else if page==='detail'}<VehicleDetail />
  {:else if page==='contact'}<Contact />
  {:else if page==='about'||page==='services'}<About servicePage={page==='services'} />
  {:else if page==='variants'}<Variants />
  {:else}<section class="container dn-empty dn-not-found"><h1>Тази страница не е налична.</h1><p>Продължете към автомобилите или се свържете с екипа.</p><a class="theme-btn" href="/car.html">Към автомобилите</a><a href="/contact.html">Контакти</a></section>{/if}
</Shell>
