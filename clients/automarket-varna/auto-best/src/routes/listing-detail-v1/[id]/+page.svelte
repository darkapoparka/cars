<script lang="ts">
  import { trapDialogTab } from '$lib/ui/overlay';
  import { specificationLabel, formatMileage } from '$lib/i18n/presentation';

  import { getI18n } from '$lib/locale/context';
  import { templateMessage } from '$lib/i18n/presentation';
  const i18n = getI18n();

  import './detail.css';
  import { vehicleContactHref } from '$data/journeys';
  import { bodyLabel } from '$data/listing';
  import { resolve } from '$app/paths';
  import { tick } from 'svelte';
  import ShowroomMap from '$components/company/ShowroomMap.svelte';
  import Icon from '$components/ui/Icon.svelte';
  import VehicleFinanceCalculator from '$components/vehicles/VehicleFinanceCalculator.svelte';
  import { brand } from '$config/brand';
  import { leadSite } from '$config/lead-site';
  import { formatVehiclePrice, type Vehicle } from '$data/inventory';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const phoneLinkAttributes = { href: brand.phoneHref } as const;

  const detailTabs = [
    { id: 'overview', label: 'Details', message: 'm_56bd72e87e53' },
    { id: 'description', label: 'Description', message: 'm_3ef61560aafe' },
    { id: 'equipment', label: 'Features', message: 'm_0c229ca25b6c' }
  ] as const;
  type DetailTab = (typeof detailTabs)[number]['id'];
  let activeTabsByVehicle = $state<Record<number, DetailTab>>({});
  let activeDetailTab = $derived(activeTabsByVehicle[data.vehicle.id] ?? 'overview');
  let shareCopied = $state(false);
  let financeDialog = $state<HTMLDialogElement>();

  const openFinance = () => financeDialog?.showModal();
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
    selectDetailTab(nextTab);
    await tick();
    document.getElementById(`detail-tab-${nextTab}`)?.focus();
  }

  const conditionLabel = (condition: Vehicle['condition']) => condition === 'new' ? i18n.t("m_18fdd549b2ed") : i18n.t("m_ae7d8dfac9ff");

  const overview = $derived([
    { label: i18n.t("m_ccdd25d4230f"), value: data.vehicle.make },
    { label: i18n.t("m_292c06f0045a"), value: specificationLabel(bodyLabel(data.vehicle.body), i18n.locale) },
    { label: i18n.t("m_39b36d38d6eb"), value: conditionLabel(data.vehicle.condition) },
    { label: i18n.t("m_89f6832560de"), value: data.vehicle.year },
    { label: i18n.t("m_ffe44a017911"), value: formatMileage(data.vehicle.mileageKm, i18n.locale) },
    { label: i18n.t("m_a80f942f4112"), value: specificationLabel(data.vehicle.fuel, i18n.locale) },
    { label: i18n.t("inventory.spec.transmission"), value: specificationLabel(data.vehicle.transmission, i18n.locale) },
    { label: i18n.t("m_15b61974b270"), value: i18n.dealer('city') }
  ]);
</script>

<svelte:head>
  <title>{data.vehicle.title} — {brand.name}</title>
  <meta
    name="description"
    content={i18n.t("m_14ac5499924c", { p0: data.vehicle.title, p1: data.vehicle.year, p2: formatMileage(data.vehicle.mileageKm, i18n.locale), p3: brand.name, p4: i18n.dealer('city') })}
  />
</svelte:head>

<div class="dn-detail-page">
    <section class="dn-detail-body" aria-labelledby="vehicle-title">
      <div class="dn-detail-container">
        <div class="dn-detail-layout">
          <div class="dn-detail-main">
            <header class="dn-detail-card dn-detail-title-card">
              <a href={i18n.href(data.returnTo)}>
                <Icon name="arrow-left" size={18} strokeWidth={1.8} />
                {i18n.t("m_76900f1bfd16")}
              </a>
              <h1 id="vehicle-title">{data.vehicle.title}</h1>
            </header>

            <div class="dn-detail-card dn-detail-media-card">
              <figure class="dn-detail-gallery">
                <a class="dn-detail-mobile-back" href={i18n.href(data.returnTo)} aria-label={i18n.t("m_82331f7533ac")}>
                  <Icon name="arrow-left" size={20} strokeWidth={2} />
                </a>
                <div class="dn-detail-mobile-actions">
                  <a {...phoneLinkAttributes} aria-label={i18n.t("m_772c70f449af", { p0: brand.phone })}><Icon name="phone" size={20} strokeWidth={1.9} /></a>
                  <button type="button" onclick={shareVehicle} aria-label={shareCopied ? i18n.t("m_bd845e0879a3") : i18n.t("m_d8977651889f")}>
                    <Icon name="share" size={20} strokeWidth={1.9} />
                  </button>
                </div>
                <img
                  src={data.vehicle.image}
                  alt={data.vehicle.title}
                  width="1245"
                  height="988"
                  fetchpriority="high"
                  decoding="async"
                />
              </figure>
            </div>

            <section class="dn-detail-card dn-detail-info-card" aria-label={i18n.t("m_ba3e721d1725")}>
              <div class="dn-detail-tabs" role="tablist" aria-label={i18n.t("m_ba3e721d1725")}>
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
                  >{i18n.t(tab.message)}</button>
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
                    {templateMessage(i18n, "{p0} is an illustrative demo vehicle on this {p1} website concept. Contact the showroom to confirm current availability, condition and details.", { p0: data.vehicle.title, p1: brand.name })}
                  </p>
                  <a class="dn-detail-inline-action" href={i18n.href(resolve(vehicleContactHref(data.vehicle.id)))}>
                    <Icon name="message" size={22} strokeWidth={1.7} />
                    {i18n.t("m_aaff7e78a8ea")}
                  </a>
                </div>
              {:else}
                <div id="detail-panel-equipment" role="tabpanel" aria-labelledby="detail-tab-equipment">
                  <ul class="dn-detail-equipment">
                    {#each data.vehicle.equipment as feature (feature)}
                      <li><span aria-hidden="true"></span>{specificationLabel(feature, i18n.locale)}</li>
                    {/each}
                  </ul>
                </div>
              {/if}
            </section>

            <section class="dn-detail-card dn-detail-location-card" id="location" aria-labelledby="location-title">
              <div class="dn-detail-location-card__header">
                <h2 id="location-title">{i18n.t("m_15b61974b270")}</h2>
                <p><Icon name="map-pin" size={20} strokeWidth={1.7} />{i18n.dealer('address')}</p>
              </div>
              <ShowroomMap />
            </section>
          </div>

          <aside class="dn-detail-sidebar" aria-label={i18n.t("m_ba3e721d1725")}>
            <section class="dn-detail-card dn-detail-summary">
              <p class="dn-detail-summary__label">{i18n.t("m_93c91c851e7a")}</p>
              <p class="dn-detail-summary__price">{formatVehiclePrice(data.vehicle.priceEur, i18n.locale)}</p>
              <p class="dn-detail-summary__availability">{i18n.t("m_663f512d0d8e")}</p>
              <div class="dn-detail-summary__actions">
                <a class="dn-detail-button dn-detail-button--call" {...phoneLinkAttributes}>{i18n.t("m_5c9190347136")}</a>
                <a class="dn-detail-button dn-detail-button--enquiry" href={i18n.href(resolve(vehicleContactHref(data.vehicle.id)))}>{i18n.t("m_be4b2e6f02d6")}</a>
              </div>
            </section>

            <section class="dn-detail-card dn-detail-finance-card" aria-label={i18n.t("m_b444d04a5c5c")}>
              <button class="dn-detail-finance-trigger" type="button" onclick={openFinance} aria-haspopup="dialog" aria-controls="dn-detail-finance-dialog" aria-label={i18n.t("m_e5ac520d079e")}>
                <img class="dn-detail-finance-banner" src={leadSite.artwork.pdp.finance} alt={i18n.t("m_cab8c52c9be4")} width="450" height="150" loading="lazy" decoding="async" />
              </button>
              <div class="dn-detail-finance-inline">
                {#key data.vehicle.id}
                  <VehicleFinanceCalculator priceEur={data.vehicle.priceEur} vehicleId={data.vehicle.id} idPrefix="finance-inline" />
                {/key}
              </div>
            </section>

            <section class="dn-detail-card dn-detail-dealer" aria-label={brand.name}>
              <a class="dn-detail-dealer-banner" href={i18n.href(resolve(vehicleContactHref(data.vehicle.id)))}>
                <img src={leadSite.artwork.pdp.seller} alt={templateMessage(i18n, "{p0} — contact the showroom to confirm vehicle details.", { p0: brand.name })} width="360" height="270" loading="lazy" decoding="async" />
              </a>
            </section>

          </aside>
        </div>

        <section class="dn-detail-related" aria-labelledby="related-title">
          <div class="dn-detail-related__header">
            <div>
              <h2 id="related-title">{i18n.t("m_0122bd9951a2")}</h2>
              <p>{i18n.t("m_70f001dd6767")}</p>
            </div>
            <a class="dn-detail-related__all" href={i18n.href(resolve('/listing-grid'))}>{i18n.t("m_7d6647b063a2")}</a>
          </div>
          <div class="dn-detail-related__list">
            {#each data.recommendations as vehicle (vehicle.id)}
              <a class="dn-detail-related-card" href={i18n.href(resolve(vehicle.href as '/listing-detail-v1/1'))}>
                <img src={vehicle.image} alt="" width="420" height="280" decoding="async" />
                <span>
                  <strong>{vehicle.title}</strong>
                  <b>{formatVehiclePrice(vehicle.priceEur, i18n.locale)}</b>
                </span>
              </a>
            {/each}
          </div>
        </section>
      </div>
    </section>

  <dialog onkeydown={trapDialogTab}
    class="dn-detail-finance-dialog"
    id="dn-detail-finance-dialog"
    bind:this={financeDialog}
    aria-labelledby="dn-detail-finance-dialog-title"
    onclick={(event) => { if (event.target === event.currentTarget) closeFinance(); }}
  >
    <div class="dn-detail-finance-sheet">
      <header class="dn-detail-finance-sheet__header">
        <div>
          <span>{i18n.t("m_76e1b210c1a4", { p0: data.vehicle.title })}</span>
          <h2 id="dn-detail-finance-dialog-title">{i18n.t("m_b444d04a5c5c")}</h2>
        </div>
        <button class="dn-icon-button" type="button" onclick={closeFinance} aria-label={i18n.t("m_aafd23be5f4a")}>
          <Icon name="x" size={18} strokeWidth={1.8} />
        </button>
      </header>
      {#key data.vehicle.id}
        <VehicleFinanceCalculator priceEur={data.vehicle.priceEur} vehicleId={data.vehicle.id} idPrefix="finance-dialog" />
      {/key}
    </div>
  </dialog>
</div>
