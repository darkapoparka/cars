<script>
  import { brand, assets, homeVariants } from './data.js';
  let {children,active='home',variant=2}=$props();
  let menu,search,menuTrigger,searchTrigger;
  const navigation=[['home','Начало','/'],['cars','Автомобили','/car.html'],['services','Внос и лизинг','/service.html'],['about','За нас','/about.html'],['contact','Контакти','/contact.html']];
  function openDialog(dialog){dialog.showModal();document.body.style.overflow='hidden';}
  function closeDialog(dialog){dialog.close();}
  function restore(trigger){document.body.style.overflow='';trigger?.focus();}
</script>
<a class="dn-skip" href="#main">Към съдържанието</a>
<header class="header dn-header" class:dn-header-dark={variant===1||variant===4}>
  <div class="dn-topline"><div class="container"><span><i class="fal fa-map-marker-alt" aria-hidden="true"></i> София · Студентски град</span><a href={brand.phoneHref}>Разговор с екипа: {brand.phone}</a></div></div>
  <div class="container dn-nav-row">
    <a class="navbar-brand" href="/" aria-label={`${brand.name} — начало`}><img src={assets.logo} alt={brand.name} width="196" height="72" /></a>
    <nav class="dn-desktop-nav" aria-label="Основна навигация">
      {#each navigation as [key,label,href] (key)}<a {href} aria-current={active===key?'page':undefined}>{label}</a>{/each}
    </nav>
    <div class="dn-nav-actions">
      <button class="dn-icon-button" type="button" bind:this={searchTrigger} onclick={()=>openDialog(search)} aria-label="Отвори търсенето"><i class="far fa-search" aria-hidden="true"></i></button>
      <a class="theme-btn dn-visit" href="/contact.html?topic=inspection">Запази оглед <i class="far fa-arrow-up-right" aria-hidden="true"></i></a>
      <button class="dn-icon-button dn-menu-button" type="button" bind:this={menuTrigger} onclick={()=>openDialog(menu)} aria-label="Отвори менюто"><i class="far fa-bars" aria-hidden="true"></i></button>
    </div>
  </div>
</header>
<dialog bind:this={menu} class="dn-dialog dn-menu-dialog" onclose={()=>restore(menuTrigger)} aria-labelledby="menu-title">
  <div class="dn-dialog-head"><h2 id="menu-title">Меню</h2><button class="dn-icon-button" onclick={()=>closeDialog(menu)} aria-label="Затвори менюто"><i class="far fa-times" aria-hidden="true"></i></button></div>
  <nav aria-label="Мобилна навигация">{#each navigation as [key,label,href] (key)}<a {href} aria-current={active===key?'page':undefined}>{label}<i class="far fa-arrow-up-right" aria-hidden="true"></i></a>{/each}</nav>
  <a class="theme-btn" href={brand.phoneHref}><i class="fal fa-phone" aria-hidden="true"></i>{brand.phone}</a>
  <p>{brand.address}</p>
  <a class="dn-text-link" href="/variants.html">Всички 5 начални страници</a>
</dialog>
<dialog bind:this={search} class="dn-dialog dn-search-dialog" onkeydown={e=>{if(e.key==='Escape'){e.preventDefault();search.close();}}} onclose={()=>restore(searchTrigger)} aria-labelledby="search-title">
  <div class="dn-dialog-head"><h2 id="search-title">Какъв автомобил търсите?</h2><button class="dn-icon-button" onclick={()=>closeDialog(search)} aria-label="Затвори търсенето"><i class="far fa-times" aria-hidden="true"></i></button></div>
  <form action="/car.html" method="get"><label for="global-search">Марка или модел</label><input id="global-search" type="search" name="q" placeholder="Напр. Audi, GLE или X6" /><button type="submit" class="theme-btn">Покажи автомобилите <i class="far fa-arrow-up-right" aria-hidden="true"></i></button></form>
</dialog>
<main id="main" tabindex="-1">{@render children()}</main>
<footer class="footer-area dn-footer">
  <div class="container dn-footer-grid">
    <div><a href="/" class="dn-footer-logo"><img src={assets.logo} alt={brand.name} width="208" height="76" loading="lazy" /></a><p>Вашият следващ автомобил.<br />Вашият начин да продължите.</p><div class="dn-socials"><a href={brand.instagramUrl} target="_blank" rel="noreferrer" aria-label="Day & Night в Instagram"><i class="fab fa-instagram" aria-hidden="true"></i></a><a href={brand.facebookUrl} target="_blank" rel="noreferrer" aria-label="Day & Night във Facebook"><i class="fab fa-facebook-f" aria-hidden="true"></i></a></div></div>
    <div><h2>Разгледайте</h2><a href="/car.html">Автомобили</a><a href="/contact.html?topic=import">Внос по заявка</a><a href="/contact.html?topic=leasing">Собствен лизинг</a><a href="/about.html">За нас</a></div>
    <div><h2>Да поговорим</h2><a class="dn-footer-phone" href={brand.phoneHref}>{brand.phone}</a><a href={brand.mapsUrl} target="_blank" rel="noreferrer">{brand.address}</a><span>Оглед с предварителна уговорка</span><a href={brand.listingsUrl} target="_blank" rel="noreferrer">Актуални обяви в Mobile.bg ↗</a></div>
  </div>
  <div class="container dn-footer-bottom"><span>© {new Date().getFullYear()} {brand.latinName}</span><details class="dn-variant-links"><summary>Начални страници</summary><div>{#each homeVariants as home (home.id)}<a href={home.route}>Вариант {home.id} · {home.title}</a>{/each}<a href="/variants.html">Сравни всички варианти</a></div></details></div>
</footer>
