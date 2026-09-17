<script lang="ts">
  import { resolve } from '$app/paths';
  import {
    activeFilterCount as countFilters,
    bodyLabel,
    listingParams,
    listingHiddenFields,
    removeListingFilter,
    listingFilterOptions,
    listingModelsForMake,
    parseListingFilters,
    type ListingFilters
  } from '$data/listing';
  import {
    cleanListingFormData,
    listingAppliedFilterLabel,
    listingFiltersFromFormData,
    listingModelAfterMakeChange,
    normalizeListingMakeTransition
  } from '$data/listing-draft';
  import Icon from '$components/ui/Icon.svelte';
  import MobileNavIcon from '$components/layout/MobileNavIcon.svelte';
  import QuickFilterSheet from './QuickFilterSheet.svelte';
  import VehicleDiscoveryForm from './VehicleDiscoveryForm.svelte';

  interface Props {
    filters: ListingFilters;
    openFilters: (event: MouseEvent, field?: string) => void;
    filtersOpen: boolean;
    onDraftChange: (filters: ListingFilters) => void;
  }

  let { filters, openFilters, filtersOpen, onDraftChange }: Props = $props();
  let activeFilterCount = $derived(countFilters(filters));
  let pending = $derived(filters);
  let query = $derived(filters.q);
  let make = $derived(filters.make);
  let model = $derived(filters.model);
  let body = $derived(filters.body);
  let fuel = $derived(filters.fuel);
  let modelOptions = $derived(listingModelsForMake(make));
  const quickFilters = [
    { label: 'Марка', field: 'make' },
    { label: 'Модел', field: 'model' },
    { label: 'Цена', field: 'price' },
    { label: 'Година', field: 'year' },
    { label: 'Купе', field: 'body' },
    { label: 'Гориво', field: 'fuel' },
    { label: 'Скорости', field: 'transmission' },
    { label: 'Пробег', field: 'mileage_max' },
    { label: 'Версия', field: 'version' },
    { label: 'Състояние', field: 'condition' },
    { label: 'Екстри', field: 'equipment' }
  ] as const;
  const activeChips = $derived(
    [...listingParams(filters).entries()]
      .filter(([key, value]) => value && key !== 'sort' && ['q', 'make', 'model', 'body', 'fuel', 'transmission', 'version', 'condition', 'price_min', 'price_max', 'year_min', 'year_max', 'mileage_max', 'equipment'].includes(key))
      .map(([key, value]) => {
        const params = removeListingFilter(filters, key, value);
        const search = params.toString();
        const href: '/listing-grid' | `/listing-grid?${string}` = search ? `/listing-grid?${search}` : '/listing-grid';
        return { key: `${key}-${value}`, label: listingAppliedFilterLabel(filters, key, value), href };
      })
  );

  const primaryHiddenFields = (current: ListingFilters) => listingHiddenFields(current, ['q', 'make', 'model', 'body', 'fuel', 'sort']);
  function updateDraft(event: Event) {
    pending = normalizeListingMakeTransition(pending, listingFiltersFromFormData(new FormData(event.currentTarget as HTMLFormElement)));
    onDraftChange(pending);
  }
  function changeMake(event: Event) {
    const nextMake = (event.currentTarget as HTMLSelectElement).value;
    model = listingModelAfterMakeChange(make, nextMake, model);
    make = nextMake;
  }
  const cleanFormData = (event: FormDataEvent) => cleanListingFormData(event.formData);
</script>

<section class="dn-listing-filter-wrap" data-slot="listing-filters" aria-label="Филтри за автомобили">
  <div class="container">
    <div class="dn-listing-filter">
      <div class="dn-listing-desktop-discovery"><VehicleDiscoveryForm {filters} {openFilters} {filtersOpen} {onDraftChange} showFilterAction={false} keywordPlaceholder="Търси в налични" /></div>
      <QuickFilterSheet mode="url" id="dn-listing-sort-sheet">
      {#snippet children(openSort, sortOpen)}
      <form class="dn-listing-mobile-form" method="GET" action={resolve('/listing-grid')} onformdata={cleanFormData} oninput={updateDraft} onchange={updateDraft}>
        <div class="dn-listing-filter__primary">
        <div class="dn-listing-filter__search-field">
          <MobileNavIcon name="search" size={20} />
          <input class="dn-listing-filter__keyword" type="search" name="q" bind:value={query} aria-label="Търсене на автомобили" placeholder="Марка, модел или ключова дума" />
          <button class="dn-listing-filter__submit" type="submit"><Icon name="search" size={18} /><span>Търсене</span></button>
        </div>
        <button
          class="dn-listing-filter__keyword dn-listing-filter__mobile-keyword"
          type="button"
          aria-haspopup="dialog"
          aria-controls="dn-listing-filter-dialog"
          aria-expanded={filtersOpen}
          aria-label={query ? `Търсене: ${query}. Отворете търсенето на автомобили` : 'Отворете търсенето на автомобили'}
          onclick={(event) => openFilters(event)}
        >
          <MobileNavIcon name="search" size={20} />
          <span class={['dn-listing-filter__keyword-value', { 'dn-listing-filter__keyword-value--empty': !query }]}>{query || 'Търси в налични'}</span>
          <span class="dn-listing-filter__keyword-hint">Търсене по ключова дума <Icon name="arrow-right" size={16} /></span>
        </button>
        <button
          class="dn-listing-filter__toggle"
          type="button"
          aria-haspopup="dialog"
          aria-controls="dn-listing-filter-dialog"
          aria-expanded={filtersOpen}
          aria-label={activeFilterCount ? `Филтри: ${activeFilterCount} ${activeFilterCount === 1 ? 'активен' : 'активни'}` : 'Филтри'}
          title="Филтри"
          onclick={(event) => openFilters(event)}
        >
          <MobileNavIcon name="filters" size={20} />
          <span class="dn-listing-filter__toggle-label">Филтри</span>
          {#if activeFilterCount > 0}<span class="dn-listing-filter__count" aria-hidden="true">{activeFilterCount}</span>{/if}
        </button>
        <button class="dn-listing-filter__mobile-sort" class:dn-listing-filter__mobile-sort--active={filters.sort !== 'default'} type="button" title="Сортиране"
          aria-label={`Сортиране: ${listingFilterOptions.sorts.find(([value]) => value === filters.sort)?.[1]}`}
          aria-haspopup="dialog" aria-controls="dn-listing-sort-sheet" aria-expanded={sortOpen}
          onclick={(event) => openSort(event, 'sort', 'Сортиране')}>
          <MobileNavIcon name="sort" size={20} />
          {#if filters.sort !== 'default'}<span class="dn-listing-filter__sort-active" aria-hidden="true"></span>{/if}
        </button>
        <input type="hidden" name="sort" value={filters.sort === 'default' ? '' : filters.sort} />
        </div>

        <div class="dn-listing-filter__facets" aria-label="Основни филтри">
        <label>
          <span class="dn-listing-filter__label">Марка</span>
          <select name="make" aria-label="Марка" value={make} onchange={changeMake}>
            {#each listingFilterOptions.makes as option (option)}
              <option value={option}>{option || 'Всички'}</option>
            {/each}
          </select>
        </label>
        <label>
          <span class="dn-listing-filter__label">Модел</span>
          <select name="model" aria-label="Модел" bind:value={model}>
            {#each modelOptions as option (option)}
              <option value={option}>{option || 'Всички'}</option>
            {/each}
          </select>
        </label>
        <label>
          <span class="dn-listing-filter__label">Купе</span>
          <select name="body" aria-label="Купе" bind:value={body}>
            {#each listingFilterOptions.bodies as option (option)}
              <option value={option}>{bodyLabel(option) || 'Всички'}</option>
            {/each}
          </select>
        </label>
        <label>
          <span class="dn-listing-filter__label">Гориво</span>
          <select name="fuel" aria-label="Гориво" bind:value={fuel}>
            {#each listingFilterOptions.fuels as option (option)}
              <option value={option}>{option || 'Всички'}</option>
            {/each}
          </select>
        </label>
        </div>
        {#each primaryHiddenFields(filters) as [name, value], index (`${name}-${value}-${index}`)}
          <input type="hidden" {name} {value} />
        {/each}
      </form>
      {/snippet}
      </QuickFilterSheet>

      <div class="dn-listing-filter__quick-row">
      <QuickFilterSheet mode="url">
      {#snippet children(openQuick, quickOpen)}
      <nav class={['dn-listing-filter__quick', { 'dn-listing-filter__quick--active': activeChips.length > 0 }]} aria-label="Бързи филтри">
        {#each activeChips as chip (chip.key)}
          <a class="active" href={resolve(chip.href)} aria-label={`Премахни ${chip.label}`}>
            {chip.label}<Icon name="x" size={14} />
          </a>
        {/each}
        {#each quickFilters as item (item.field)}
          <button
            type="button"
            aria-haspopup="dialog"
            aria-controls="dn-quick-filter"
            aria-expanded={quickOpen}
            onclick={(event) => openQuick(event, item.field, item.label)}
          >
            {item.label}<Icon name="chevron-down" size={14} />
          </button>
        {/each}
      </nav>
      {/snippet}
      </QuickFilterSheet>
      </div>

    </div>
  </div>
</section>

<style>
  .dn-listing-filter-wrap {
    --dn-discovery-width: min(var(--dn-content), calc(100% - 48px));
    --dn-discovery-padding: 18px;
    --dn-discovery-gap: 14px;
    --dn-discovery-search-height: 60px;
    --dn-discovery-radius: 16px;
    position: absolute;
    z-index: 4;
    top: var(--dn-route-hero-control-top);
    right: 0;
    bottom: auto;
    left: 0;
  }

  .dn-listing-filter {
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 18px 44px rgba(18, 25, 38, 0.18);
  }

  .dn-listing-filter__primary {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 12px;
    padding: 14px 14px 12px;
  }

  .dn-listing-filter__facets {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
    padding: 0 14px 14px;
  }

  .dn-listing-filter__quick { display: none; }
  .dn-listing-filter label { display: block; min-width: 0; }
  .dn-listing-filter .dn-listing-filter__mobile-sort { display: none; }
  .dn-listing-filter__quick-row { display: contents; }

  .dn-listing-filter__keyword {
    position: relative;
    display: grid;
    width: 100%;
    height: 56px;
    min-width: 0;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    padding: 0 18px;
    border: 1px solid #dfe2e6;
    border-radius: var(--dn-radius-control);
    background: #f5f6f7;
    color: #202329;
    font: var(--dn-body-font);
    text-align: left;
    cursor: pointer;
    transition: border-color 150ms ease-out, background-color 150ms ease-out;
  }

  .dn-listing-filter__keyword > :global(.dn-icon) { color: #6d737d; }

  .dn-listing-filter select {
    width: 100%;
    height: 52px;
    padding: 0 15px;
    border: 1px solid #dfe2e6;
    border-radius: var(--dn-radius-control);
    outline: 0;
    background: #f5f6f7;
    color: #202329;
    font: var(--dn-body-font);
  }

  .dn-listing-filter__keyword:hover { border-color: #b8bec7; background: #fff; }
  .dn-listing-filter__keyword:focus-visible {
    border-color: #777e88;
    outline: 0;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(32, 35, 41, 0.12);
  }

  .dn-listing-filter__keyword-value { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dn-listing-filter__keyword-value--empty { color: #737984; }
  .dn-listing-filter__keyword-hint { color: #555c66; font-size: var(--dn-text-meta); font-weight: var(--dn-weight-semibold); }
  .dn-listing-filter input::placeholder { color: #737984; opacity: 1; }
  .dn-listing-filter input:focus,
  .dn-listing-filter select:focus {
    border-color: #777e88;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(32, 35, 41, 0.12);
  }

  .dn-listing-filter__toggle,
  .dn-listing-filter__submit {
    display: inline-flex;
    height: 56px;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 0 26px;
    border-radius: var(--dn-radius-button);
    font: var(--dn-control-font);
    cursor: pointer;
  }

  .dn-listing-filter__toggle { border: 1px solid #202329; background: #202329; color: #fff; }
  .dn-listing-filter__toggle:focus-visible { border-color: #111318; background: #111318; }
  @media (hover: hover) and (pointer: fine) {
    .dn-listing-filter__toggle:hover { border-color: #111318; background: #111318; }
  }

  .dn-listing-filter__count {
    display: inline-grid;
    min-width: 22px;
    height: 22px;
    place-items: center;
    padding: 0 6px;
    border-radius: var(--dn-pill);
    background: #fff;
    color: #202329;
    font-size: var(--dn-text-meta);
  }

  .dn-listing-filter__submit { border: 0; background: var(--dn-red); color: #fff; }
  .dn-listing-filter__submit:hover,
  .dn-listing-filter__submit:focus-visible { background: var(--dn-red-hover); }
  .dn-listing-filter__search-field { display: none; }
  .dn-listing-desktop-discovery { padding: var(--dn-discovery-padding); }

  @media (max-width: 991px) {
    .dn-listing-filter__primary {
      grid-template-columns: minmax(0, 1fr) auto auto;
      padding-top: 14px;
    }
    .dn-listing-filter__facets { display: none; }
  }

  @media (min-width: 768px) {
    .dn-listing-filter > .dn-listing-mobile-form { display: none; }
    .dn-listing-filter__primary { display: block; padding: 0; }
    .dn-listing-filter__mobile-keyword,
    .dn-listing-filter__toggle { display: none; }
    .dn-listing-filter__search-field {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 60px;
      padding: 5px 5px 5px 18px;
      border: 1px solid #dfe2e6;
      border-radius: 14px;
      background: #f5f6f7;
      color: #6d737d;
    }
    .dn-listing-filter__search-field:focus-within { border-color: #777e88; box-shadow: 0 0 0 3px rgba(32,35,41,.12); }
    .dn-listing-filter__search-field .dn-listing-filter__keyword {
      display: block;
      flex: 1;
      width: 0;
      min-width: 0;
      height: 46px;
      padding: 0;
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
      outline: none;
      cursor: text;
    }
    .dn-listing-filter__search-field .dn-listing-filter__submit {
      flex: 0 0 auto;
      height: 48px;
      padding-inline: 24px;
      font-size: var(--dn-cta-size);
    }
    .dn-listing-filter__facets { padding: 0; gap: 14px; }
    .dn-listing-filter__label {
      display: block;
      margin: 0 0 6px 2px;
      color: var(--dn-muted);
      font-size: var(--dn-text-meta);
      font-weight: var(--dn-weight-semibold);
      line-height: var(--dn-leading-meta);
    }
    .dn-listing-filter__quick--active { display: flex; gap: 8px; padding: 0 18px 14px; overflow-x: auto; }
    .dn-listing-filter__quick button { display: none; }
    .dn-listing-filter__quick a {
      display: inline-flex;
      min-height: 44px;
      flex: 0 0 auto;
      align-items: center;
      gap: 8px;
      padding: 0 12px;
      border-radius: var(--dn-pill);
      background: var(--dn-surface);
      color: var(--dn-ink);
      font-size: var(--dn-text-meta);
      font-weight: var(--dn-weight-semibold);
    }
    .dn-listing-filter__quick a:hover { background: #e7e8eb; }
  }

  @media (min-width: 992px) {
    .dn-listing-filter-wrap { top: 320px; margin-top: 0; }
    .dn-listing-filter-wrap > .container { width: var(--dn-discovery-width); }
    .dn-listing-filter { border-radius: var(--dn-discovery-radius); box-shadow: 0 12px 32px rgb(32 35 41 / 6%); }
    .dn-listing-filter__search-field { min-height: var(--dn-discovery-search-height); }
    .dn-listing-filter__facets { gap: var(--dn-discovery-gap); }
  }

  @media (min-width: 1440px) {
    .dn-listing-filter-wrap { --dn-discovery-width: min(1040px, calc(100vw - 560px)); }
  }

  @media (max-width: 767px) {
    .dn-listing-filter-wrap {
      position: relative;
      top: auto;
      margin-top: 0;
    }
    .dn-listing-filter-wrap > .container { width: calc(100% - 24px); }
    .dn-listing-filter { overflow: visible; border-radius: 0; background: transparent; box-shadow: none; }
    .dn-listing-desktop-discovery { display: none; }
    .dn-listing-filter__quick {
      display: flex;
      gap: 8px;
      padding: 2px 0 8px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .dn-listing-filter__quick::-webkit-scrollbar { display: none; }
    .dn-listing-filter__quick a,
    .dn-listing-filter__quick button {
      display: inline-flex;
      min-height: 44px;
      flex: 0 0 auto;
      align-items: center;
      gap: 8px;
      padding: 0 15px;
      border: 0;
      border-radius: var(--dn-pill);
      background: #fff;
      color: #3f4650;
      font-family: inherit;
      font-size: var(--dn-control-size);
      font-weight: var(--dn-control-weight);
      white-space: nowrap;
      cursor: pointer;
    }
    .dn-listing-filter__quick a:focus-visible,
    .dn-listing-filter__quick button:focus-visible { outline: 2px solid var(--dn-red); outline-offset: -2px; }
    .dn-listing-filter__quick a.active { background: #202329; color: #fff; }
    .dn-listing-filter__primary {
      grid-template-columns: minmax(0, 1fr) 44px 44px;
      gap: 8px;
      padding: calc(12px + env(safe-area-inset-top)) 0 8px;
    }
    .dn-listing-filter__keyword {
      grid-column: auto;
      height: 44px;
      grid-template-columns: auto minmax(0, 1fr);
      padding-inline: 15px 12px;
      border: 0;
      border-radius: var(--dn-pill);
      background: transparent;
      font-size: var(--dn-text-body);
      box-shadow: none;
      isolation: isolate;
    }
    .dn-listing-filter__keyword::before {
      position: absolute;
      inset: 1px;
      z-index: -1;
      border-radius: inherit;
      background: #fff;
      content: '';
    }
    .dn-listing-filter__keyword-hint { display: none; }
    .dn-listing-filter__toggle,
    .dn-listing-filter .dn-listing-filter__mobile-sort {
      position: relative;
      display: grid;
      width: 44px;
      height: 44px;
      place-items: center;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: transparent;
      isolation: isolate;
    }
    .dn-listing-filter__toggle::before,
    .dn-listing-filter__mobile-sort::before {
      position: absolute;
      inset: 1px;
      z-index: -1;
      border-radius: 50%;
      content: '';
    }
    .dn-listing-filter__toggle::before { background: #202329; }
    .dn-listing-filter__mobile-sort::before { background: #fff; }
    .dn-listing-filter__toggle:focus-visible::before { background: #111318; }
    .dn-listing-filter__mobile-sort:focus-visible { outline: 2px solid #202329; outline-offset: 2px; }
    .dn-listing-filter__toggle-label { display: none; }
    .dn-listing-filter__mobile-sort { color: #202329; cursor: pointer; }
    @media (hover: hover) and (pointer: fine) {
      .dn-listing-filter__toggle:hover::before { background: #111318; }
      .dn-listing-filter__mobile-sort:hover::before { background: #e8eaed; }
    }
    .dn-listing-filter__mobile-sort--active { color: var(--dn-red); }
    .dn-listing-filter__sort-active { display: none; }
    .dn-listing-filter__quick-row {
      display: flex;
      min-width: 0;
      align-items: center;
      gap: 12px;
      padding-bottom: 8px;
    }
    .dn-listing-filter__quick-row .dn-listing-filter__quick { min-width: 0; flex: 1; padding-block: 0; }
    .dn-listing-filter__count { display: none; }
    .dn-listing-filter__submit { display: none; }
  }
</style>
