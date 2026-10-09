<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

  import { page } from '$app/state';
  import { resolve } from '$app/paths';
  import VehicleCard from '$components/vehicles/VehicleCard.svelte';
  import Icon from '$components/ui/Icon.svelte';
  import { tick } from 'svelte';
  import { activeFilterCount, listingHiddenFields, type ListingFilters } from '$data/listing';
  import { cleanListingFormData, listingDraftFromFilters } from '$data/listing-draft';
  import ListingChoicePicker from './ListingChoicePicker.svelte';
  import DesktopAppliedListingFilters from './DesktopAppliedListingFilters.svelte';
  import type { Vehicle } from '$data/inventory';

  let { filters, vehicles, draftFilters, openFilters, filtersOpen }: {
    filters: ListingFilters;
    vehicles: Vehicle[];
    draftFilters: ListingFilters;
    openFilters: (event: MouseEvent, field?: string) => void;
    filtersOpen: boolean;
  } = $props();
  let activeCount = $derived(activeFilterCount(draftFilters));
  let sortDraft = $derived(listingDraftFromFilters(filters));
  let sortForm = $state<HTMLFormElement>();
  const compactSortLabels = {
    default: 'Препоръчани',
    newest: 'Най-нови',
    'price-asc': 'Най-ниска цена',
    'price-desc': 'Най-висока цена',
    'mileage-asc': 'Най-нисък пробег'
  } as const;

  const hiddenFields = (filters: ListingFilters) => listingHiddenFields(filters, ['sort']);

  // Browse with radio arrows; submit only after an explicit menu choice.
  const submitSort = async () => { await tick(); sortForm?.requestSubmit(); };
</script>

<section class="dn-listing-results" data-slot="listing-results" aria-labelledby="listing-results-title">
  <div class="container">
    <h1 id="listing-results-title" class="dn-sr-only dn-listing-results__mobile-title">{i18n.t("m_065a8285dddf")}</h1>
    <div class="dn-listing-results__heading">
      <div class="dn-listing-results__tools">
        <button class="dn-listing-results__filters" type="button" aria-haspopup="dialog" aria-controls="dn-listing-filter-dialog" aria-expanded={filtersOpen} onclick={openFilters}>
          <Icon name="adjustments" size={18} /><span>{i18n.t("m_546ebb8eb993")}</span>
          {#if activeCount}<span class="dn-listing-results__filter-count">{activeCount}</span>{/if}
        </button>
        <DesktopAppliedListingFilters {filters} />
      <form bind:this={sortForm} class="dn-listing-sort" method="GET" action={i18n.href(resolve('/cars'))} onformdata={event => cleanListingFormData(event.formData)}>
        {#each hiddenFields(filters) as [name, value], index (`${name}-${value}-${index}`)}
          <input type="hidden" {name} {value} />
        {/each}
        <span class="dn-listing-sort__icon" aria-hidden="true"></span>
        <ListingChoicePicker field="sort" bind:draft={sortDraft} label={i18n.t('m_c7d3914bb4d7')} displayValue={i18n.text(compactSortLabels[sortDraft.sort])} showLabel={false} compact oncommit={submitSort} />
        <button class="dn-sr-only" type="submit">{i18n.t("m_323ef154f92d")}</button>
      </form>
      </div>
    </div>

    {#if vehicles.length}
      <div class="dn-listing-results__grid">
        {#each vehicles as vehicle, index (vehicle.id)}
          <VehicleCard {vehicle} returnTo={`${page.url.pathname}${page.url.search}#vehicle-${vehicle.id}`} showPrice priority={index === 0} layout="listing" />
        {/each}
      </div>
    {:else}
      <div class="dn-listing-empty">
        <h3>{i18n.t("m_255ca3bfe9fc")}</h3>
        <p>{i18n.t("m_87a5974db52e")}</p>
        <a class="dn-button dn-button--dark" href={i18n.href(resolve('/cars'))}>{i18n.t("m_3294551fa1d9")}</a>
      </div>
    {/if}
  </div>
</section>

<style>
  @media (min-width: 768px) {
    .dn-listing-results__mobile-title { display: none; }
  }
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
    .dn-listing-results { padding-top: var(--dn-space-4); background: var(--dn-surface-canvas); }
  }

  .dn-listing-results__heading {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0 20px;
  }

  @media (min-width: 992px) {
    .dn-listing-results__heading { min-height: var(--dn-control-height-default); margin-bottom: var(--dn-space-4); }
    .dn-listing-results__tools { display: flex; width: 100%; min-width: 0; gap: var(--dn-space-2); padding: 0; border: 0; background: transparent; box-shadow: none; }
    .dn-listing-results__filters { flex: none; background: var(--dn-ink); }
    .dn-listing-results__filters:hover { background: var(--dn-ink-hover); }
    .dn-listing-results__tools .dn-listing-sort { margin-left: auto; border: 1px solid var(--dn-line); }
  }

  .dn-listing-sort {
    position: relative;
    display: inline-flex;
    width: max-content;
    min-width: 0;
    height: 44px;
    min-height: 44px;
    flex: 0 0 auto;
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

  .dn-listing-sort :global(.dn-identity-field.compact .dn-identity-trigger) { height: 44px; padding: 0 14px 0 38px; border: 0; border-radius: var(--dn-pill); background: transparent; }

  .dn-listing-results__grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
    align-items: stretch;
  }

  @media (min-width: 1360px) {
    .dn-listing-results__grid { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 16px; }
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

    .dn-listing-sort__icon {
      left: 12px;
    }





    .dn-listing-results__grid {
      grid-template-columns: minmax(0, 1fr);
      grid-auto-rows: 1fr;
      gap: var(--dn-space-3);
    }
  }
</style>
