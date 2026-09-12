<script lang="ts">
  import './detail.css';
  import { vehicleContactHref } from '$data/journeys';
  import { bodyLabel } from '$data/listing';
  import { resolve } from '$app/paths';
  import { tick, onDestroy } from 'svelte';
  import { lockPageScroll, trapDialogTab } from '$lib/ui/overlay';
  import { imageStatus } from '$lib/ui/image';
  let failedImage = $state('');
  let releaseFinance: (() => void) | undefined;
  onDestroy(() => releaseFinance?.());
  import ShowroomMap from '$components/company/ShowroomMap.svelte';
  import Icon from '$components/ui/Icon.svelte';
  import VehicleFinanceCalculator from '$components/vehicles/VehicleFinanceCalculator.svelte';
  import PdpImportBanner from '$components/vehicles/PdpImportBanner.svelte';
  import { brand } from '$config/brand';
  import { formatVehiclePrice, type Vehicle } from '$data/inventory';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const phoneLinkAttributes = { href: brand.phoneHref } as const;

  const detailTabs = [
    { id: 'overview', label: 'Данни' },
    { id: 'description', label: 'Описание' },
    { id: 'equipment', label: 'Екстри' }
  ] as const;
  type DetailTab = (typeof detailTabs)[number]['id'];
  let activeTabsByVehicle = $state<Record<number, DetailTab>>({});
  let activeDetailTab = $derived(activeTabsByVehicle[data.vehicle.id] ?? 'overview');
  let shareCopied = $state(false);
  let financeDialog = $state<HTMLDialogElement>();

  const openFinance = () => {
    if (!financeDialog || financeDialog.open) return;
    releaseFinance = lockPageScroll();
    financeDialog.showModal();
  };
  const closeFinance = () => financeDialog?.close();

  async function shareVehicle() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: data.vehicle.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      shareCopied = true;
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) shareCopied = false;
    }
  }

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
    const tablist = (event.currentTarget as HTMLElement).closest('[role="tablist"]');
    selectDetailTab(nextTab);
    await tick();
    tablist?.querySelector<HTMLElement>(`#detail-tab-${nextTab}`)?.focus();
  }

  const conditionLabel = (condition: Vehicle['condition']) => condition === 'new' ? 'Нов' : 'Употребяван';

  const overview = $derived([
    { label: 'Марка', value: data.vehicle.make },
    { label: 'Категория', value: bodyLabel(data.vehicle.body) },
    { label: 'Състояние', value: conditionLabel(data.vehicle.condition) },
    { label: 'Година', value: data.vehicle.year },
    { label: 'Пробег', value: data.vehicle.mileage },
    { label: 'Гориво', value: data.vehicle.fuel },
    { label: 'Скоростна кутия', value: data.vehicle.transmission },
    { label: 'Локация', value: brand.city }
  ]);
</script>

<svelte:head>
  <title>{data.vehicle.title} — {brand.name}</title>
  <meta
    name="description"
    content={`${data.vehicle.title}, ${data.vehicle.year}, ${data.vehicle.mileage}. Наличен автомобил от ${brand.name} в ${brand.city}.`}
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
                Назад
              </a>
              <h1 id="vehicle-title">{data.vehicle.title}</h1>
            </header>

            <div class="dn-detail-card dn-detail-media-card">
              <figure class="dn-detail-gallery">
                <a class="dn-detail-mobile-back" href={data.returnTo} aria-label="Назад към автомобилите">
                  <Icon name="arrow-left" size={20} strokeWidth={2} />
                </a>
                <div class="dn-detail-mobile-actions">
                  <a {...phoneLinkAttributes} aria-label={`Обадете се на ${brand.phone}`}><Icon name="phone" size={20} strokeWidth={1.9} /></a>
                  <button type="button" onclick={shareVehicle} aria-label={shareCopied ? 'Линкът е копиран' : 'Споделете автомобила'}>
                    <Icon name="share" size={20} strokeWidth={1.9} />
                  </button>
                </div>
                <img
                  src={data.vehicle.image}
                  {@attach imageStatus(failed => failedImage = failed ? data.vehicle.image : '')}
                  style:visibility={failedImage === data.vehicle.image ? 'hidden' : undefined}
                  alt={data.vehicle.title}
                  width="1245"
                  height="988"
                  fetchpriority="high"
                  decoding="async"
                />
                {#if failedImage === data.vehicle.image}<span class="dn-vehicle-image-fallback" role="img" aria-label={`Снимката на ${data.vehicle.title} не е налична`}>Снимката не е налична</span>{/if}
              </figure>
            </div>

            <section class="dn-detail-card dn-detail-info-card" aria-label="Информация за автомобила">
              <div class="dn-detail-tabs" role="tablist" aria-label="Информация за автомобила">
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
                    {data.vehicle.title} е част от актуалната селекция на {brand.name}. Свържете се с
                    екипа за потвърдени данни за състоянието, наличността и следващите стъпки.
                  </p>
                  <a class="dn-detail-inline-action" href={resolve(vehicleContactHref(data.vehicle.id))}>
                    <Icon name="message" size={22} strokeWidth={1.7} />
                    Поискайте информация
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
                <h2 id="location-title">Локация</h2>
                <p><Icon name="map-pin" size={20} strokeWidth={1.7} />{brand.address}</p>
              </div>
              <ShowroomMap />
            </section>
          </div>

          <aside class="dn-detail-sidebar" aria-label="Информация за автомобила">
            <section class="dn-detail-card dn-detail-summary">
              <p class="dn-detail-summary__label">Цена</p>
              <p class="dn-detail-summary__price">{formatVehiclePrice(data.vehicle.priceEur)}</p>
              <p class="dn-detail-summary__availability">Наличността и условията се потвърждават от екипа.</p>
              <div class="dn-detail-summary__actions">
                <a class="dn-detail-button dn-detail-button--call" {...phoneLinkAttributes}>Обадете се</a>
                <a class="dn-detail-button dn-detail-button--enquiry" href={resolve(vehicleContactHref(data.vehicle.id))}>Заявете оглед</a>
              </div>
            </section>

            <section class="dn-detail-card dn-detail-finance-card" aria-label="Финансиране">
              <button class="dn-detail-finance-trigger" type="button" onclick={openFinance} aria-haspopup="dialog" aria-controls="dn-detail-finance-dialog" aria-label="Отворете финансирането за този автомобил">
                <img class="dn-detail-finance-banner" src="/assets/images/lead/pdp-finance-clean-mobile.webp" alt="Финансиране за този автомобил" width="450" height="150" loading="lazy" decoding="async" />
              </button>
              <div class="dn-detail-finance-inline">
                {#key data.vehicle.id}
                  <VehicleFinanceCalculator priceEur={data.vehicle.priceEur} vehicleId={data.vehicle.id} initialSelection={data.financeSelection} />
                {/key}
              </div>
            </section>

            <PdpImportBanner />

            <section class="dn-detail-card dn-detail-dealer" aria-label="Auto Best">
              <a class="dn-detail-dealer-banner" href={resolve(vehicleContactHref(data.vehicle.id))}>
                <img src="/assets/images/lead/pdp-seller-clean-mobile.webp" alt="Auto Best — доверен дилър. Обсъдете автомобила." width="360" height="270" loading="lazy" decoding="async" />
              </a>
            </section>

          </aside>
        </div>

        <section class="dn-detail-related" aria-labelledby="related-title">
          <div class="dn-detail-related__header">
            <div>
              <h2 id="related-title">Подбрани автомобили</h2>
              <p>Още предложения от актуалната селекция</p>
            </div>
            <a class="dn-detail-related__all" href={resolve('/listing-grid')}>Вижте всички автомобили</a>
          </div>
          <div class="dn-detail-related__list">
            {#each data.recommendations as vehicle (vehicle.id)}
              <a class="dn-detail-related-card" href={resolve('/listing-detail-v1/[id]', { id: String(vehicle.id) })}>
                <img src={vehicle.image} alt="" width="420" height="280" decoding="async" />
                <span>
                  <strong>{vehicle.title}</strong>
                  <b>{formatVehiclePrice(vehicle.priceEur)}</b>
                </span>
              </a>
            {/each}
          </div>
        </section>
      </div>
    </section>

  <dialog
    class="dn-detail-finance-dialog"
    id="dn-detail-finance-dialog"
    bind:this={financeDialog}
    onclose={() => releaseFinance?.()}
    onkeydown={trapDialogTab}
    aria-labelledby="dn-detail-finance-dialog-title"
    onclick={(event) => { if (event.target === event.currentTarget) closeFinance(); }}
  >
    <div class="dn-detail-finance-sheet">
      <header class="dn-detail-finance-sheet__header">
        <div>
          <span>За {data.vehicle.title}</span>
          <h2 id="dn-detail-finance-dialog-title">Финансиране</h2>
        </div>
        <button type="button" onclick={closeFinance} aria-label="Затворете калкулатора">
          <Icon name="x" size={20} strokeWidth={1.8} />
        </button>
      </header>
      {#key data.vehicle.id}
        <VehicleFinanceCalculator priceEur={data.vehicle.priceEur} vehicleId={data.vehicle.id} initialSelection={data.financeSelection} />
      {/key}
    </div>
  </dialog>
</div>

<style>
  .dn-vehicle-image-fallback { position: absolute; inset: 0; display: grid; place-items: center; padding: 16px; color: #626974; background: #eceff2; text-align: center; }
</style>
