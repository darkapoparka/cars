<script>
  import {vehicles,modelNote,brand} from './data.js';
  import VehicleGrid from './VehicleGrid.svelte';
  const params=new URLSearchParams(location.search);
  let q=$state(params.get('q')||''),make=$state(params.get('make')||''),body=$state(params.get('body')||''),fuel=$state(params.get('fuel')||''),sort=$state(params.get('sort')||'featured');
  let filters,filterTrigger;
  const makes=[...new Set(vehicles.map(v=>v.make))],bodies=[...new Set(vehicles.map(v=>v.body))];
  const fields=[{name:'make',label:'Марка',values:makes},{name:'body',label:'Тип автомобил',values:bodies},{name:'fuel',label:'Гориво',values:['Бензин','Дизел']}];
  const normalize=value=>value.toLocaleLowerCase('bg').replace(/\s+/g,'');
  let items=$derived.by(()=>{
    let found=vehicles.filter(v=>(!q||normalize(v.title).includes(normalize(q)))&&(!make||v.make===make)&&(!body||v.body===body)&&(!fuel||v.fuel===fuel));
    if(sort==='name')found=[...found].sort((a,b)=>a.title.localeCompare(b.title));
    return found;
  });
  let returnTo=$derived('/car.html?'+new URLSearchParams(Object.entries({q,make,body,fuel,sort}).filter(([,v])=>v&&v!=='featured')).toString());
  function updateUrl(){const p=new URLSearchParams(Object.entries({q,make,body,fuel,sort}).filter(([,v])=>v&&v!=='featured'));history.replaceState(null,'',`/car.html${p.size?'?'+p:''}`);}
  function select(name,value){if(name==='make')make=value;if(name==='body')body=value;if(name==='fuel')fuel=value;updateUrl();}
  function reset(){q='';make='';body='';fuel='';sort='featured';updateUrl();}
</script>
{#snippet filterFields(prefix)}
  {#each fields as field (field.name)}<label for={`${prefix}-${field.name}`}>{field.label}<select id={`${prefix}-${field.name}`} value={field.name==='make'?make:field.name==='body'?body:fuel} onchange={e=>select(field.name,e.currentTarget.value)}><option value="">Всички</option>{#each field.values as value (value)}<option {value}>{value}</option>{/each}</select></label>{/each}
  <button class="dn-reset" onclick={reset} type="button">Изчисти филтрите</button>
{/snippet}
<section class="dn-page-intro"><div class="container"><div class="dn-breadcrumb"><a href="/">Начало</a><span>Автомобили</span></div><h1>Намерете своя <span>автомобил.</span></h1><p>Разгледайте подбрани модели и обсъдете своя избор с екипа.</p></div></section>
<section class="container dn-catalog" aria-label="Каталог автомобили">
  <aside class="dn-catalog-sidebar"><h2>Вашите предпочитания</h2>{@render filterFields('desktop')}</aside>
  <div class="dn-catalog-results">
    <form class="dn-catalog-search" onsubmit={e=>{e.preventDefault();updateUrl();}}><label class="dn-sr-only" for="model-search">Търсене по модел</label><i class="far fa-search" aria-hidden="true"></i><input id="model-search" type="search" bind:value={q} oninput={()=>queueMicrotask(updateUrl)} placeholder="Търсете марка или модел" /><button type="submit" class="dn-icon-button" aria-label="Търси"><i class="far fa-arrow-right" aria-hidden="true"></i></button></form>
    <div class="dn-results-toolbar"><p aria-live="polite">{items.length} {items.length===1?'модел':'модела'}</p><div><button class="dn-mobile-filter" bind:this={filterTrigger} onclick={()=>{filters.showModal();document.body.style.overflow='hidden';}}><i class="far fa-sliders-h" aria-hidden="true"></i> Филтри</button><label class="dn-sort">Подреди<select bind:value={sort} onchange={()=>queueMicrotask(updateUrl)}><option value="featured">Подбрани</option><option value="name">По име</option></select></label></div></div>
    {#if items.length}<VehicleGrid {items} limit={items.length} {returnTo} />{:else}<div class="dn-empty"><i class="fal fa-car" aria-hidden="true"></i><h2>Няма модел с тези критерии.</h2><p>Опитайте с друга марка или ни разкажете какъв автомобил търсите.</p><button type="button" class="theme-btn" onclick={reset}>Покажи всички модели</button><a href="/contact.html?topic=import">Попитай за внос ↗</a></div>{/if}
    <p class="dn-model-note">{modelNote} <a href={brand.listingsUrl} target="_blank" rel="noreferrer">Вижте актуалните обяви ↗</a></p>
  </div>
</section>
<dialog bind:this={filters} class="dn-dialog dn-filter-dialog" onclose={()=>{document.body.style.overflow='';filterTrigger?.focus();}} aria-labelledby="filters-title"><div class="dn-dialog-head"><h2 id="filters-title">Филтри</h2><button class="dn-icon-button" onclick={()=>filters.close()} aria-label="Затвори филтрите"><i class="far fa-times" aria-hidden="true"></i></button></div>{@render filterFields('mobile')}<button class="theme-btn" onclick={()=>filters.close()}>Покажи {items.length} модела <i class="far fa-arrow-right" aria-hidden="true"></i></button></dialog>
