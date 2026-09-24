<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

  import { page } from '$app/state';
  import { resolve } from '$app/paths';
  import VehicleCard from '$components/vehicles/VehicleCard.svelte';
  import Icon from '$components/ui/Icon.svelte';
  import { activeFilterCount, listingHiddenFields, listingFilterOptions, type ListingFilters } from '$data/listing';
  import type { Vehicle } from '$data/inventory';

  let { filters, vehicles, draftFilters, openFilters, filtersOpen }: {
    filters: ListingFilters;
    vehicles: Vehicle[];
    draftFilters: ListingFilters;
    openFilters: (event: MouseEvent, field?: string) => void;
    filtersOpen: boolean;
  } = $props();
  let activeCount = $derived(activeFilterCount(draftFilters));
  const compactSortLabels = {
    default: 'Препоръчани',
    newest: 'Най-нови',
    'price-asc': 'Най-ниска цена',
    'price-desc': 'Най-висока цена',
    'mileage-asc': 'Най-нисък пробег'
  } as const;

  const hiddenFields = (filters: ListingFilters) => listingHiddenFields(filters, ['sort']);

  const submitSort = (event: Event) => {
    const select = event.currentTarget as HTMLSelectElement;
    select.form?.requestSubmit();
  };
</script>

<section class="dn-listing-results" data-slot="listing-results" aria-labelledby="listing-results-title">
  <div class="container">
    <h1 id="listing-results-title" class="dn-sr-only dn-listing-results__title">{i18n.t("m_065a8285dddf")}</h1>
    <div class="dn-listing-results__heading">
      <div class="dn-listing-results__tools">
        <button class="dn-listing-results__filters" type="button" aria-haspopup="dialog" aria-controls="dn-listing-filter-dialog" aria-expanded={filtersOpen} onclick={openFilters}>
          <Icon name="adjustments" size={18} /><span>{i18n.t("m_546ebb8eb993")}</span>
          {#if activeCount}<span class="dn-listing-results__filter-count">{activeCount}</span>{/if}
        </button>
      <form class="dn-listing-sort" method="GET" action={i18n.href(resolve('/listing-grid'))}>
        {#each hiddenFields(filters) as [name, value], index (`${name}-${value}-${index}`)}
          <input type="hidden" {name} {value} />
        {/each}
        <label class="dn-sr-only" for="listing-sort">{i18n.t("m_bec69036aa27")}</label>
        <span class="dn-listing-sort__icon" aria-hidden="true"></span>
        <select {@attach i18n.validation} id="listing-sort" name="sort" onchange={submitSort} aria-label={i18n.t("m_c7d3914bb4d7")}>
          {#each listingFilterOptions.sorts as [value, label] (value)}
            <option value={value === 'default' ? '' : value} selected={filters.sort === value}>{i18n.text(label)}</option>
          {/each}
        </select>
        <span class="dn-listing-sort__value" aria-hidden="true">{i18n.text(compactSortLabels[filters.sort])}</span>
        <button class="dn-sr-only" type="submit">{i18n.t("m_323ef154f92d")}</button>
      </form>
      </div>
    </div>

    {#if vehicles.length}
      <div class="dn-listing-results__grid">
        {#each vehicles as vehicle, index (vehicle.id)}
          <VehicleCard {vehicle} returnTo={`${page.url.pathname}${page.url.search}#vehicle-${vehicle.id}`} showPrice priority={index < 4} layout="listing" />
        {/each}
      </div>
    {:else}
      <div class="dn-listing-empty">
        <h3>{i18n.t("m_255ca3bfe9fc")}</h3>
        <p>{i18n.t("m_87a5974db52e")}</p>
        <a class="dn-button dn-button--dark" href={i18n.href(resolve('/listing-grid'))}>{i18n.t("m_3294551fa1d9")}</a>
      </div>
    {/if}
  </div>
</section>

<style>
  /* The desktop hero owns the page heading; mobile omits that hero. */
  .dn-listing-results__title { display: none; }
  .dn-listing-results__tools {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px;
    border: 1px solid #dfe2e6;
    border-radius: var(--dn-pill);
    background: #fff;
    box-shadow: 0 6px 18px rgba(18, 25, 38, .07);
  }
  .dn-listing-results__filters { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 44px; padding: 0 16px; border: 0; border-radius: var(--dn-pill); background: #202329; color: #fff; font: var(--dn-control-font); cursor: pointer; }
  .dn-listing-results__filters:hover { background: #343941; }
  .dn-listing-results__filters:focus-visible { outline: 2px solid var(--dn-red); outline-offset: 2px; }
  .dn-listing-results__filter-count { display: grid; place-items: center; min-width: 20px; height: 20px; padding: 0 4px; border-radius: var(--dn-pill); background: #fff; color: #202329; font-size: var(--dn-control-size); }

  .dn-listing-results {
    padding: 20px 0 72px;
    background: #f4f5f7;
  }

  @media (min-width: 992px) {
    .dn-listing-results { background: var(--dn-surface-canvas); }
  }

  .dn-listing-results__heading {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0 20px;
  }

  .dn-listing-sort__value {
    position: absolute;
    z-index: 2;
    right: 36px;
    left: 42px;
    overflow: hidden;
    color: #202329;
    font-size: var(--dn-text-meta);
    font-weight: var(--dn-weight-medium);
    line-height: var(--dn-leading-meta);
    text-overflow: ellipsis;
    white-space: nowrap;
    pointer-events: none;
  }

  .dn-listing-sort {
    position: relative;
    display: inline-flex;
    width: 208px;
    min-width: 208px;
    height: 44px;
    min-height: 44px;
    flex: 0 0 208px;
    align-items: center;
    padding: 0;
    border: 0;
    border-radius: var(--dn-pill);
    background: #fff;
    color: #4d5562;
    cursor: pointer;
  }

  .dn-listing-sort:hover,
  .dn-listing-sort:focus-within {
    background: var(--dn-surface-subtle);
  }

  .dn-listing-sort::after {
    position: absolute;
    top: 50%;
    right: 16px;
    z-index: 2;
    width: 7px;
    height: 7px;
    border-right: 1.5px solid #4d5562;
    border-bottom: 1.5px solid #4d5562;
    content: '';
    pointer-events: none;
    transform: translateY(-70%) rotate(45deg);
  }

  .dn-listing-sort__icon {
    position: absolute;
    left: 14px;
    z-index: 2;
    display: block;
    width: 16px;
    height: 14px;
    background:
      linear-gradient(currentColor, currentColor) 0 0 / 16px 1.5px no-repeat,
      linear-gradient(currentColor, currentColor) 0 6px / 12px 1.5px no-repeat,
      linear-gradient(currentColor, currentColor) 0 12px / 8px 1.5px no-repeat;
    pointer-events: none;
  }

  .dn-listing-sort select {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 44px;
    padding: 0 38px 0 42px;
    border: 0;
    border-radius: inherit;
    outline: 0;
    background: transparent;
    color: transparent;
    overflow: hidden;
    font-size: var(--dn-text-meta);
    font-weight: var(--dn-weight-medium);
    text-overflow: ellipsis;
    white-space: nowrap;
    appearance: none;
    cursor: pointer;
  }

  .dn-listing-sort select:focus-visible {
    outline: 2px solid var(--dn-red);
    outline-offset: 2px;
  }

  .dn-listing-sort select option { color: #202329; }

  .dn-listing-results__grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
    align-items: stretch;
  }

  .dn-listing-empty {
    display: grid;
    min-height: 300px;
    place-items: center;
    align-content: center;
    gap: 10px;
    padding: 44px;
    border-radius: 20px;
    background: #fff;
    text-align: center;
  }
  .dn-listing-empty h3,
  .dn-listing-empty p { margin: 0; }
  .dn-listing-empty h3 { font-size: var(--dn-text-heading); font-weight: var(--dn-weight-semibold); }
  .dn-listing-empty p { color: #707680; }
  .dn-listing-empty .dn-button { margin-top: 12px; }

  @media (min-width: 992px) and (max-width: 1279px) {
    .dn-listing-results__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
    }
  }

  @media (min-width: 768px) and (max-width: 991px) {
    .dn-listing-results__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }
  }

  @media (max-width: 767px) {
    .dn-listing-results__title { display: block; }
    .dn-listing-results {
      padding: 0 0 var(--dn-mobile-page-end);
    }

    .dn-listing-results__heading {
      display: none;
    }

    .dn-listing-results__heading .dn-listing-sort { display: none; }

    .dn-listing-sort {
      width: 190px;
      min-width: 190px;
      height: 44px;
      min-height: 44px;
      flex: 0 0 190px;
      border-color: transparent;
      border-radius: var(--dn-pill);
    }

    .dn-listing-sort::after {
      right: 13px;
    }

    .dn-listing-sort__icon {
      left: 12px;
    }

    .dn-listing-sort select {
      height: 44px;
      padding: 0 30px 0 36px;
      font-size: var(--dn-control-size);
      color: transparent;
    }

    .dn-listing-sort select option {
      color: #202329;
    }

    .dn-listing-sort__value {
      right: 28px;
      left: 36px;
    }

    .dn-listing-results__grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 8px;
    }
  }
</style>
