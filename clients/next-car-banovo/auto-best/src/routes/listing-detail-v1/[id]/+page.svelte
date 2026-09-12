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

  const detailTabs = [
    { id: 'overview', label: 'Данни' },
    { id: 'description', label: 'Описание' },
    { id: 'equipment', label: 'Екстри' }
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

  const conditionLabel = (condition: Vehicle['condition']) => condition === 'new' ? 'Нов (по обява)' : condition === 'unknown' ? 'По запитване' : 'Употребяван (по обява)';

  const overview = $derived([
    { label: 'Марка', value: data.vehicle.make },
    { label: 'Категория', value: bodyLabel(data.vehicle.body) },
    { label: 'Състояние', value: conditionLabel(data.vehicle.condition) },
    { label: 'Година', value: data.vehicle.year },
    { label: 'Пробег', value: data.vehicle.mileage },
    { label: 'Гориво', value: data.vehicle.fuel },
    { label: 'Скоростна кутия', value: data.vehicle.transmission },
    { label: 'Локация за оглед', value: data.vehicle.sourceLocation },
    { label: 'Мощност', value: `${data.vehicle.powerHp} к.с.` },
    { label: 'Данъчни условия', value: data.vehicle.priceNote }
  ]);
</script>

<svelte:head>
  <title>{data.vehicle.title} — {brand.name}</title>
  <meta
    name="description"
    content={`${data.vehicle.title}, ${data.vehicle.year}, ${data.vehicle.mileage}. Публикувана обява от ${brand.name} в ${brand.city}.`}
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
                    {data.vehicle.description}
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
              <p class="dn-detail-summary__availability">{data.vehicle.priceNote} · Наличността се потвърждава по телефона.</p>
              <div class="dn-detail-summary__actions">
                <a class="dn-detail-button dn-detail-button--primary" {...phoneLinkAttributes}>Обадете се</a>
                <a class="dn-detail-button dn-detail-button--dark" href={resolve(vehicleContactHref(data.vehicle.id))}>Заявете оглед</a>
              </div>
            </section>

            <section class="dn-detail-card dn-detail-finance-card" aria-label="Калкулатор за финансиране">
              {#key data.vehicle.id}
                <VehicleFinanceCalculator priceEur={data.vehicle.priceEur} vehicleId={data.vehicle.id} />
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
                <a class="dn-detail-button dn-detail-button--dark" href={resolve(vehicleContactHref(data.vehicle.id))}>Обсъдете автомобила</a>
              </div>
            </section>

          </aside>
        </div>

        <section class="dn-detail-related" aria-labelledby="related-title">
          <div class="dn-detail-related__header">
            <div>
              <h2 id="related-title">Подбрани автомобили</h2>
              <p>Още обяви от датирания подбор</p>
            </div>
            <a class="dn-detail-related__all" href={resolve('/listing-grid')}>Вижте всички автомобили</a>
          </div>
          <div class="dn-detail-related__list">
            {#each data.recommendations as vehicle (vehicle.id)}
              <a class="dn-detail-related-card" href={resolve(vehicle.href as '/listing-detail-v1/1')}>
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
</div>
