<script>
  import {vehicles,brand,modelNote,safeCatalogReturn} from './data.js';
  import VehicleGrid from './VehicleGrid.svelte';
  const params=new URLSearchParams(location.search);
  const vehicle=vehicles.find(v=>v.id===params.get('id'));
  const returnTo=safeCatalogReturn(params.get('from'));
  let photo=$state(),photoTrigger=$state();
  const enquiry=vehicle?`/contact.html?topic=inspection&vehicle=${encodeURIComponent(vehicle.id)}`:'/contact.html';
</script>
{#if vehicle}
  <section class="container dn-detail">
    <a class="dn-back" href={returnTo}><i class="far fa-arrow-left" aria-hidden="true"></i> Към автомобилите</a>
    <div class="dn-detail-layout">
      <div class="dn-detail-gallery"><button bind:this={photoTrigger} onclick={()=>{photo.showModal();document.body.style.overflow='hidden';}} aria-label={`Увеличи снимката на ${vehicle.title}`}><img src={vehicle.image} alt={vehicle.title} width="1600" height="1067" fetchpriority="high" /><span><i class="far fa-expand" aria-hidden="true"></i> Увеличи</span></button><p>Илюстративна снимка на представения модел</p></div>
      <div class="dn-detail-summary"><span class="dn-eyebrow">{vehicle.make} · {vehicle.body}</span><h1>{vehicle.title}</h1><p class="dn-detail-price">{vehicle.priceLabel}</p><p>Обсъдете наличност, конфигурация и условия с екипа на {brand.shortName}.</p><dl><div><dt>Тип</dt><dd>{vehicle.body}</dd></div><div><dt>Двигател</dt><dd>{vehicle.fuel}</dd></div><div><dt>Скорости</dt><dd>{vehicle.transmission}</dd></div></dl><a class="theme-btn" href={brand.phoneHref}><i class="fal fa-phone" aria-hidden="true"></i> {brand.phone}</a><a class="dn-outline-button" href={enquiry}>Уговорете оглед <i class="far fa-arrow-up-right" aria-hidden="true"></i></a><a class="dn-text-link" href={`/contact.html?topic=leasing&vehicle=${encodeURIComponent(vehicle.id)}`}>Попитайте за собствен лизинг ↗</a></div>
    </div>
    <div class="dn-detail-description"><h2>Повече за модела</h2><p>{vehicle.description}</p><p>{modelNote}</p><a class="dn-text-link" href={brand.listingsUrl} target="_blank" rel="noreferrer">Актуалните обяви на Day & Night ↗</a></div>
    <div class="dn-section-heading"><div><span class="dn-eyebrow">Продължете избора</span><h2>Още автомобили</h2></div><a href={returnTo}>Към всички <i class="far fa-arrow-up-right" aria-hidden="true"></i></a></div>
    <VehicleGrid items={vehicles.filter(v=>v.id!==vehicle.id)} limit={3} {returnTo} />
  </section>
  <dialog bind:this={photo} class="dn-photo-dialog" onclose={()=>{document.body.style.overflow='';photoTrigger?.focus();}} aria-label={`Снимка: ${vehicle.title}`}><button class="dn-icon-button" onclick={()=>photo.close()} aria-label="Затвори снимката"><i class="far fa-times" aria-hidden="true"></i></button><img src={vehicle.image} alt={vehicle.title} /></dialog>
{:else}
  <section class="container dn-empty dn-not-found"><h1>Този модел не е в подбора.</h1><p>Разгледайте представените автомобили или ни разкажете какво търсите.</p><a class="theme-btn" href="/car.html">Към автомобилите</a></section>
{/if}
