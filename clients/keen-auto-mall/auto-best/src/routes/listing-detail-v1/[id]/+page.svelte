<script lang="ts">
  import './detail.css';
  import { vehicleContactHref } from '$data/journeys';
  import { bodyLabel } from '$data/listing';
  import { resolve } from '$app/paths';
  import { tick } from 'svelte';
  import ShowroomMap from '$components/company/ShowroomMap.svelte';
  import Icon from '$components/ui/Icon.svelte';
  import VehicleFinanceCalculator from '$components/vehicles/VehicleFinanceCalculator.svelte';
  import { brand } from '$config/brand';
  import { formatVehiclePrice, type Vehicle } from '$data/inventory';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const phoneLinkAttributes = { href: brand.phoneHref } as const;
  let photoByVehicle = $state<Record<number, number>>({});
  const gallery = $derived(data.vehicle.gallery.length ? data.vehicle.gallery : [data.vehicle.image]);
  const photoIndex = $derived(Math.min(photoByVehicle[data.vehicle.id] ?? 0, gallery.length - 1));
  function changePhoto(index: number) { photoByVehicle[data.vehicle.id] = (index + gallery.length) % gallery.length; }


  const detailTabs = [
    { id: 'overview', label: 'Specifications' },
    { id: 'description', label: 'Description' },
    { id: 'equipment', label: 'Features' }
  ] as const;
  type DetailTab = (typeof detailTabs)[number]['id'];
  let activeTabsByVehicle = $state<Record<number, DetailTab>>({});
  let activeDetailTab = $derived(activeTabsByVehicle[data.vehicle.id] ?? 'overview');

  const selectDetailTab = (tab: DetailTab) => {
    activeTabsByVehicle[data.vehicle.id] = tab;
  };

  async function handleDetailTabKeydown(event: KeyboardEvent, currentTab: DetailTab) {
    const currentIndex = detailTabs.findIndex((tab) => tab.id === currentTab);
    let nextTab: DetailTab | undefined;

    if (event.key === 'ArrowRight') nextTab = detailTabs[(currentIndex + 1) % detailTabs.length].id;
    if (event.key === 'ArrowLeft') nextTab = detailTabs[(currentIndex - 1 + detailTabs.length) % detailTabs.length].id;
    if (event.key === 'Home') nextTab = detailTabs[0].id;
    if (event.key === 'End') nextTab = detailTabs.at(-1)?.id;
    if (!nextTab) return;

    event.preventDefault();
    selectDetailTab(nextTab);
    await tick();
    document.getElementById(`detail-tab-${nextTab}`)?.focus();
  }

  const conditionLabel = (condition: Vehicle['condition']) => condition === 'new' ? 'New' : 'Used';

  const overview = $derived([
    { label: 'Make', value: data.vehicle.make },
    { label: 'Category', value: bodyLabel(data.vehicle.body) },
    { label: 'Condition', value: conditionLabel(data.vehicle.condition) },
    { label: 'Year', value: data.vehicle.year },
    { label: 'Mileage', value: data.vehicle.mileage },
    { label: 'Fuel', value: data.vehicle.fuel },
    { label: 'Transmission', value: data.vehicle.transmission },
    { label: 'Location', value: brand.city }
  ]);
</script>

<svelte:head>
  <title>{data.vehicle.title} — {brand.name}</title>
  <meta
    name="description"
    content={`${data.vehicle.title}, ${data.vehicle.year}, ${data.vehicle.mileage}. Dated advertised sample from ${brand.name}; confirm availability and location.`}
  />
</svelte:head>

<div class="dn-detail-page">
    <section class="dn-detail-body" aria-labelledby="vehicle-title">
      <div class="dn-detail-container">
        <div class="dn-detail-layout">
          <div class="dn-detail-main">
            <header class="dn-detail-card dn-detail-title-card">
              <a href={data.returnTo}>
                <Icon name="arrow-left" size={18} strokeWidth={1.8} />
                Back
              </a>
              <h1 id="vehicle-title">{data.vehicle.title}</h1>
            </header>

            <div class="dn-detail-card dn-detail-media-card">
              <figure class="dn-detail-gallery">
                <a class="dn-detail-mobile-back" href={data.returnTo} aria-label="Back to vehicles">
                  <Icon name="arrow-left" size={20} strokeWidth={2} />
                </a>
                <img
                  src={gallery[photoIndex]}
                  alt={data.vehicle.title}
                  width="1245"
                  height="988"
                  fetchpriority="high"
                  decoding="async"
                />
              </figure><div class="dn-detail-gallery-controls" aria-label="Vehicle photographs"><button type="button" onclick={() => changePhoto(photoIndex-1)} disabled={gallery.length<2} aria-label="Previous photograph">Previous</button><span aria-live="polite">Photograph {photoIndex+1} of {gallery.length}</span><button type="button" onclick={() => changePhoto(photoIndex+1)} disabled={gallery.length<2} aria-label="Next photograph">Next</button></div><div class="dn-detail-gallery-thumbs">{#each gallery as photo,index (photo)}<button type="button" aria-label={`Show photograph ${index+1}`} aria-pressed={photoIndex===index} onclick={() => changePhoto(index)}><img src={photo} alt="" width="120" height="90" loading="lazy"/></button>{/each}</div>
            </div>

            <section class="dn-detail-card dn-detail-info-card" aria-label="Vehicle information">
              <div class="dn-detail-tabs" role="tablist" aria-label="Vehicle information">
                {#each detailTabs as tab (tab.id)}
                  <button
                    id={`detail-tab-${tab.id}`}
                    type="button"
                    role="tab"
                    aria-selected={activeDetailTab === tab.id}
                    aria-controls={`detail-panel-${tab.id}`}
                    tabindex={activeDetailTab === tab.id ? 0 : -1}
                    class={activeDetailTab === tab.id ? 'active' : undefined}
                    onclick={() => selectDetailTab(tab.id)}
                    onkeydown={(event) => handleDetailTabKeydown(event, tab.id)}
                  >{tab.label}</button>
                {/each}
              </div>

              {#if activeDetailTab === 'overview'}
                <div id="detail-panel-overview" role="tabpanel" aria-labelledby="detail-tab-overview">
                  <dl class="dn-detail-overview">
                    {#each overview as item (item.label)}
                      <div>
                        <dt>{item.label}</dt>
                        <dd>{item.value}</dd>
                      </div>
                    {/each}
                  </dl>
                </div>
              {:else if activeDetailTab === 'description'}
                <div
                  class="dn-detail-description"
                  id="detail-panel-description"
                  role="tabpanel"
                  aria-labelledby="detail-tab-description"
                >
                  <p>
                    {data.vehicle.title} is part of the current selection at {brand.name}. Contact
                    the team for confirmed details on its condition, availability and next steps.
                  </p>
                  <a class="dn-detail-inline-action" href={resolve(vehicleContactHref(data.vehicle.id))}>
                    <Icon name="message" size={22} strokeWidth={1.7} />
                    Request information
                  </a>
                </div>
              {:else}
                <div id="detail-panel-equipment" role="tabpanel" aria-labelledby="detail-tab-equipment">
                  <ul class="dn-detail-equipment">
                    {#each data.vehicle.equipment as feature (feature)}
                      <li><span aria-hidden="true"></span>{feature}</li>
                    {/each}
                  </ul>
                </div>
              {/if}
            </section>

            <section class="dn-detail-card dn-detail-location-card" id="location" aria-labelledby="location-title">
              <div class="dn-detail-location-card__header">
                <h2 id="location-title">Location</h2>
                <p><Icon name="map-pin" size={20} strokeWidth={1.7} />{brand.address}</p><p>{data.vehicle.viewingLocation}</p>
              </div>
              <ShowroomMap />
            </section>
          </div>

          <aside class="dn-detail-sidebar" aria-label="Vehicle information">
            <section class="dn-detail-card dn-detail-summary">
              <p class="dn-detail-summary__label">Price</p>
              <p class="dn-detail-summary__price">{formatVehiclePrice(data.vehicle.priceAmount)}</p>
              <p class="dn-detail-summary__availability">{brand.priceNotice} Dated listing sample. Confirm availability, condition and the final total directly.</p>
              <div class="dn-detail-summary__actions">
                <a class="dn-detail-button dn-detail-button--call" {...phoneLinkAttributes}>Call us</a>
                <a class="dn-detail-button dn-detail-button--enquiry" href={resolve(vehicleContactHref(data.vehicle.id))}>Request a vehicle viewing</a>
              </div>
            </section>

            <section class="dn-detail-card dn-detail-finance-card" aria-label="Finance calculator">
              {#key data.vehicle.id}
                {#if data.vehicle.priceAmount !== null}<VehicleFinanceCalculator priceAmount={data.vehicle.priceAmount} vehicleId={data.vehicle.id} />{:else}<p>Price on request. No estimate is available.</p>{/if}
              {/key}
            </section>

            <section class="dn-detail-card dn-detail-dealer" aria-labelledby="seller-title">
              <header class="dn-detail-dealer__header">
                <img src={brand.logo} alt="" width="132" height="44" loading="lazy" decoding="async" />
                <h2 id="seller-title">{brand.name}</h2>
              </header>

              <div class="dn-detail-dealer__details">
                <p><Icon name="map-pin" size={20} strokeWidth={1.7} /><span>{brand.address}</span></p>
                <a {...phoneLinkAttributes}><Icon name="phone" size={20} strokeWidth={1.7} /><span>{brand.phone}</span></a>
              </div>

              <div class="dn-detail-dealer__actions">
                <a class="dn-detail-button dn-detail-button--enquiry" href={resolve(vehicleContactHref(data.vehicle.id))}>Discuss the vehicle</a>
              </div>
            </section>

          </aside>
        </div>

        <section class="dn-detail-related" aria-labelledby="related-title">
          <div class="dn-detail-related__header">
            <div>
              <h2 id="related-title">Selected vehicles</h2>
              <p>More vehicles from the current selection</p>
            </div>
            <a class="dn-detail-related__all" href={resolve('/listing-grid')}>View all vehicles</a>
          </div>
          <div class="dn-detail-related__list">
            {#each data.recommendations as vehicle (vehicle.id)}
              <a class="dn-detail-related-card" href={resolve(vehicle.href as '/listing-detail-v1/1')}>
                <img src={vehicle.image} alt="" width="420" height="280" decoding="async" />
                <span>
                  <strong>{vehicle.title}</strong>
                  <b>{formatVehiclePrice(vehicle.priceAmount)}</b>
                </span>
              </a>
            {/each}
          </div>
        </section>
      </div>
    </section>
</div>
