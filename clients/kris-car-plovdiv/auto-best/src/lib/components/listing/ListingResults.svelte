<script lang="ts">
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
  const mobileSortLabels = {
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

<section class="dn-listing-results" aria-labelledby="listing-results-title">
  <div class="container">
    <div class="dn-listing-results__heading">
      <h2 id="listing-results-title">
        <span class="dn-listing-results__title-full">Демонстрационна селекция</span>
        <span class="dn-listing-results__title-mobile" aria-live="polite">{vehicles.length} {vehicles.length === 1 ? 'кола' : 'коли'}</span>
        <span class="dn-listing-results__count" aria-live="polite">{vehicles.length}</span>
      </h2>

      <div class="dn-listing-results__tools">
      <button class="dn-listing-results__filters" type="button" aria-haspopup="dialog" aria-controls="dn-listing-filter-dialog" aria-expanded={filtersOpen} onclick={openFilters}>
        <Icon name="adjustments" size={18} /><span>Филтри</span>
        {#if activeCount}<span class="dn-listing-results__filter-count">{activeCount}</span>{/if}
      </button>
      <form class="dn-listing-sort" method="GET" action={resolve('/listing-grid')}>
        {#each hiddenFields(filters) as [name, value], index (`${name}-${value}-${index}`)}
          <input type="hidden" {name} {value} />
        {/each}
        <label class="dn-sr-only" for="listing-sort">Сортиране</label>
        <span class="dn-listing-sort__icon" aria-hidden="true"></span>
        <select id="listing-sort" name="sort" onchange={submitSort} aria-label="Сортиране на автомобилите">
          {#each listingFilterOptions.sorts as [value, label] (value)}
            <option value={value === 'default' ? '' : value} selected={filters.sort === value}>{label}</option>
          {/each}
        </select>
        <span class="dn-listing-sort__mobile-value" aria-hidden="true">{mobileSortLabels[filters.sort]}</span>
        <button class="dn-sr-only" type="submit">Приложи сортирането</button>
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
        <h3>Няма съвпадения</h3>
        <p>Променете някой от филтрите или разгледайте цялата селекция.</p>
        <a class="dn-button dn-button--dark" href={resolve('/listing-grid')}>Изчистете филтрите</a>
      </div>
    {/if}
  </div>
</section>

<style>
  .dn-listing-results__tools { display: flex; align-items: center; gap: 10px; }
  .dn-listing-results__filters { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 46px; padding: 0 16px; border: 1px solid #202329; border-radius: var(--dn-radius-control); background: #202329; color: #fff; font: 600 14px var(--dn-font); cursor: pointer; }
  .dn-listing-results__filters:hover { background: #3a3e46; border-color: #3a3e46; }
  .dn-listing-results__filters:focus-visible { outline: 3px solid #0b57d0; outline-offset: 3px; }
  .dn-listing-results__filter-count { display: grid; place-items: center; min-width: 20px; height: 20px; padding: 0 4px; border-radius: var(--dn-pill); background: #fff; color: #202329; font-size: 12px; }
  @media (max-width: 767px) { .dn-listing-results__filters { display: none; } }

  .dn-listing-results {
    padding: 48px 0 72px;
    background: #f4f5f7;
  }

  .dn-listing-results__heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px 24px;
    margin-bottom: 24px;
    text-align: left;
  }

  .dn-listing-results__heading h2 {
    width: auto;
    min-width: 0;
    margin: 0;
    color: #202329;
    font-size: var(--dn-text-heading);
    font-weight: 600;
    line-height: 38px;
    letter-spacing: -0.025em;
    text-align: left;
  }

  .dn-listing-results__count {
    margin-left: 6px;
    color: #6b7280;
    font-size: var(--dn-text-card);
    font-weight: 500;
    letter-spacing: 0;
    white-space: nowrap;
  }

  .dn-listing-results__title-mobile {
    display: none;
  }

  .dn-listing-sort__mobile-value {
    display: none;
  }

  .dn-listing-sort {
    position: relative;
    display: inline-flex;
    width: 190px;
    min-width: 190px;
    height: 46px;
    min-height: 46px;
    flex: 0 0 190px;
    align-items: center;
    padding: 0;
    border: 1px solid #d7dbe2;
    border-radius: var(--dn-radius-control);
    background: #fff;
    color: #4d5562;
    cursor: pointer;
    transition: border-color 160ms ease-out;
  }

  .dn-listing-sort:hover,
  .dn-listing-sort:focus-within {
    border-color: #aeb4bd;
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
    padding: 0 40px 0 44px;
    border: 0;
    border-radius: inherit;
    outline: 0;
    background: transparent;
    color: #202329;
    font-size: 16px;
    font-weight: 500;
    appearance: none;
    cursor: pointer;
  }

  .dn-listing-sort select:focus-visible {
    outline: 2px solid #c40101;
    outline-offset: 2px;
  }

  .dn-listing-results__grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
    align-items: stretch;
  }

  .dn-listing-results__grid :global(.dn-vehicle-card) {
    width: 100%;
    min-width: 0;
    height: 100%;
  }

  @media (max-width: 1199px) {
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
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      margin: -1px;
    }

    .dn-listing-results__heading .dn-listing-sort { display: none; }

    .dn-listing-results__heading h2 {
      flex: 1;
      font-size: 15px;
      line-height: 1.2;
    }

    .dn-listing-results__title-full,
    .dn-listing-results__count {
      display: none;
    }

    .dn-listing-results__title-mobile {
      display: inline;
    }

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
      height: 42px;
      padding: 0 30px 0 36px;
      font-size: 14px;
      color: transparent;
    }

    .dn-listing-sort select option {
      color: #202329;
    }

    .dn-listing-sort__mobile-value {
      position: absolute;
      z-index: 2;
      right: 28px;
      left: 36px;
      display: block;
      color: #202329;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      white-space: nowrap;
      pointer-events: none;
    }

    .dn-listing-results__grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 8px;
    }
  }
</style>
