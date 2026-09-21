<script lang="ts">
  import { specificationLabel } from '$lib/i18n/presentation';


  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

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
    listingFacetTitle,
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
        return { key: `${key}-${value}`, label: listingAppliedFilterLabel(filters, key, value, i18n.locale), href };
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

<section class="dn-listing-filter-wrap" data-slot="listing-filters" aria-label={i18n.t("m_6f8428de4166")}>
  <div class="container">
    <div class="dn-listing-filter">
      <div class="dn-listing-desktop-discovery"><VehicleDiscoveryForm {filters} {openFilters} {filtersOpen} {onDraftChange} showFilterAction={false} keywordPlaceholder="Търси в налични" /></div>
      <QuickFilterSheet mode="url" id="dn-listing-sort-sheet">
      {#snippet children(openSort, sortOpen)}
      <form class="dn-listing-mobile-form" method="GET" action={i18n.href(resolve('/listing-grid'))} onformdata={cleanFormData} oninput={updateDraft} onchange={updateDraft}>
        <div class="dn-listing-filter__primary">
        <div class="dn-listing-filter__search-field">
          <MobileNavIcon name="search" size={18} />
          <input {@attach i18n.validation} class="dn-listing-filter__keyword" type="search" name="q" bind:value={query} aria-label={i18n.t("m_32729e44de2d")} placeholder={i18n.t("m_13fd09148700")} />
          <button class="dn-listing-filter__submit" type="submit"><Icon name="search" size={18} /><span>{i18n.t("m_49c266baaaa7")}</span></button>
        </div>
        <button
          class="dn-listing-filter__keyword dn-listing-filter__mobile-keyword"
          type="button"
          aria-haspopup="dialog"
          aria-controls="dn-listing-filter-dialog"
          aria-expanded={filtersOpen}
          aria-label={query ? i18n.t("m_645cee389418", { p0: query }) : i18n.t("m_a6403c514411")}
          onclick={(event) => openFilters(event)}
        >
          <MobileNavIcon name="search" size={18} />
          <span class={['dn-listing-filter__keyword-value', { 'dn-listing-filter__keyword-value--empty': !query }]}>{query || i18n.t("m_eb47f359cb25")}</span>
          <span class="dn-listing-filter__keyword-hint">{i18n.t("m_27194051d1f9")} <Icon name="arrow-right" size={18} /></span>
        </button>
        <button
          class="dn-listing-filter__toggle"
          type="button"
          aria-haspopup="dialog"
          aria-controls="dn-listing-filter-dialog"
          aria-expanded={filtersOpen}
          aria-label={activeFilterCount ? i18n.t("m_ea1098f8421e", { p0: activeFilterCount, p1: activeFilterCount === 1 ? i18n.t("m_c22462bc76a0") : i18n.t("m_91313b277ed8") }) : i18n.t("m_546ebb8eb993")}
          title={i18n.t("m_546ebb8eb993")}
          onclick={(event) => openFilters(event)}
        >
          <MobileNavIcon name="filters" size={18} />
          <span class="dn-listing-filter__toggle-label">{i18n.t("m_546ebb8eb993")}</span>
          {#if activeFilterCount > 0}<span class="dn-listing-filter__count" aria-hidden="true">{activeFilterCount}</span>{/if}
        </button>
        <button class="dn-listing-filter__mobile-sort" class:dn-listing-filter__mobile-sort--active={filters.sort !== 'default'} type="button" title={i18n.t("m_bec69036aa27")}
          aria-label={i18n.t("m_c3f09566c8eb", { p0: i18n.text(listingFilterOptions.sorts.find(([value]) => value === filters.sort)?.[1] ?? 'Recommended') })}
          aria-haspopup="dialog" aria-controls="dn-listing-sort-sheet" aria-expanded={sortOpen}
          onclick={(event) => openSort(event, 'sort', 'Сортиране')}>
          <MobileNavIcon name="sort" size={18} />
          {#if filters.sort !== 'default'}<span class="dn-listing-filter__sort-active" aria-hidden="true"></span>{/if}
        </button>
        <input type="hidden" name="sort" value={filters.sort === 'default' ? '' : filters.sort} />
        </div>

        <div class="dn-listing-filter__facets" aria-label={i18n.t("m_f6c8ed6a4374")}>
        <label>
          <span class="dn-listing-filter__label">{i18n.t("m_ccdd25d4230f")}</span>
          <select {@attach i18n.validation} name="make" aria-label={i18n.t("m_ccdd25d4230f")} value={make} onchange={changeMake}>
            {#each listingFilterOptions.makes as option (option)}
              <option value={option}>{specificationLabel(option, i18n.locale) || i18n.t("m_a52ace420f21")}</option>
            {/each}
          </select>
        </label>
        <label>
          <span class="dn-listing-filter__label">{i18n.t("m_5e2c614c23f0")}</span>
          <select {@attach i18n.validation} name="model" aria-label={i18n.t("m_5e2c614c23f0")} bind:value={model}>
            {#each modelOptions as option (option)}
              <option value={option}>{specificationLabel(option, i18n.locale) || i18n.t("m_a52ace420f21")}</option>
            {/each}
          </select>
        </label>
        <label>
          <span class="dn-listing-filter__label">{i18n.t("m_191c24bf12d5")}</span>
          <select {@attach i18n.validation} name="body" aria-label={i18n.t("m_191c24bf12d5")} bind:value={body}>
            {#each listingFilterOptions.bodies as option (option)}
              <option value={option}>{specificationLabel(bodyLabel(option), i18n.locale) || i18n.t("m_a52ace420f21")}</option>
            {/each}
          </select>
        </label>
        <label>
          <span class="dn-listing-filter__label">{i18n.t("m_a80f942f4112")}</span>
          <select {@attach i18n.validation} name="fuel" aria-label={i18n.t("m_a80f942f4112")} bind:value={fuel}>
            {#each listingFilterOptions.fuels as option (option)}
              <option value={option}>{specificationLabel(option, i18n.locale) || i18n.t("m_a52ace420f21")}</option>
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
      <nav class={['dn-listing-filter__quick', { 'dn-listing-filter__quick--active': activeChips.length > 0 }]} aria-label={i18n.t("m_dea1661dff21")}>
        {#each activeChips as chip (chip.key)}
          <a class="active" href={i18n.href(resolve(chip.href))} aria-label={i18n.t("m_ef5e8d630d53", { p0: chip.label })}>
            {chip.label}<Icon name="x" size={18} />
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
            {listingFacetTitle(item.field, i18n.locale)}<Icon name="chevron-down" size={18} />
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
    --dn-discovery-search-height: var(--dn-control-height-default);
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
    gap: var(--dn-entry-action-gap);
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
    height: var(--dn-control-height-default);
    min-width: 0;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--dn-entry-icon-gap);
    padding: 0 var(--dn-space-4);
    border: 1px solid #dfe2e6;
    border-radius: var(--dn-radius-control);
    background: #f5f6f7;
    color: #202329;
    font: var(--dn-entry-font);
    text-align: left;
    cursor: pointer;
    transition: border-color 150ms ease-out, background-color 150ms ease-out;
  }

  .dn-listing-filter__keyword > :global(.dn-icon) { color: #6d737d; }

  .dn-listing-filter select {
    width: 100%;
    height: var(--dn-control-height-default);
    padding: 0 40px 0 var(--dn-space-4);
    border: 1px solid #dfe2e6;
    border-radius: var(--dn-radius-control);
    outline: 0;
    background: #f5f6f7;
    color: #202329;
    font: var(--dn-entry-font);
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
    height: var(--dn-control-height-default);
    align-items: center;
    justify-content: center;
    gap: var(--dn-entry-action-gap);
    padding: 0 var(--dn-entry-action-padding-inline);
    border-radius: var(--dn-radius-button);
    font: var(--dn-compact-control-font);
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
      gap: var(--dn-entry-action-gap);
      min-height: var(--dn-control-height-default);
      padding: 0;
      border: 0;
      border-radius: var(--dn-pill);
      background: transparent;
      color: #6d737d;
    }
    .dn-listing-filter__search-field:focus-within { border-color: #777e88; box-shadow: 0 0 0 3px rgba(32,35,41,.12); }
    .dn-listing-filter__search-field .dn-listing-filter__keyword {
      display: block;
      flex: 1;
      width: 0;
      min-width: 0;
      height: var(--dn-control-height-default);
      padding: 0 var(--dn-space-4);
      border: 1px solid #dfe2e6;
      border-radius: var(--dn-pill);
      background: #f5f6f7;
      box-shadow: none;
      outline: none;
      cursor: text;
    }
    .dn-listing-filter__search-field .dn-listing-filter__submit {
      flex: 0 0 auto;
      height: var(--dn-control-height-default);
      padding-inline: var(--dn-entry-action-padding-inline);
      font: var(--dn-compact-control-font);
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
    .dn-listing-filter__quick--active { display: flex; gap: var(--dn-entry-action-gap); padding: 0 18px 14px; overflow-x: auto; }
    .dn-listing-filter__quick button { display: none; }
    .dn-listing-filter__quick a {
      display: inline-flex;
      min-height: var(--dn-control-height-default);
      flex: 0 0 auto;
      align-items: center;
      gap: var(--dn-entry-action-gap);
      padding: 0 var(--dn-space-4);
      border-radius: var(--dn-pill);
      background: var(--dn-surface);
      color: var(--dn-ink);
      font: var(--dn-compact-control-font);
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
      gap: var(--dn-entry-action-gap);
      padding: 2px 0 8px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .dn-listing-filter__quick::-webkit-scrollbar { display: none; }
    .dn-listing-filter__quick a,
    .dn-listing-filter__quick button {
      display: inline-flex;
      min-height: var(--dn-control-height-default);
      flex: 0 0 auto;
      align-items: center;
      gap: var(--dn-entry-action-gap);
      padding: 0 var(--dn-space-4);
      border: 0;
      border-radius: var(--dn-pill);
      background: #fff;
      color: #3f4650;
      font: var(--dn-compact-control-font);
      white-space: nowrap;
      cursor: pointer;
    }
    .dn-listing-filter__quick a:focus-visible,
    .dn-listing-filter__quick button:focus-visible { outline: 2px solid var(--dn-red); outline-offset: -2px; }
    .dn-listing-filter__quick a.active { background: #202329; color: #fff; }
    .dn-listing-filter__primary {
      grid-template-columns: minmax(0, 1fr) var(--dn-control-height-default) var(--dn-control-height-default);
      gap: var(--dn-entry-action-gap);
      padding: calc(12px + env(safe-area-inset-top)) 0 8px;
    }
    .dn-listing-filter__keyword {
      grid-column: auto;
      height: var(--dn-control-height-default);
      grid-template-columns: auto minmax(0, 1fr);
      gap: var(--dn-entry-icon-gap);
      padding-inline: var(--dn-space-4);
      border: 1px solid var(--dn-entry-line);
      border-radius: var(--dn-pill);
      background: var(--dn-entry-surface);
      font: var(--dn-entry-font);
      box-shadow: none;
    }
    .dn-listing-filter__keyword-hint { display: none; }
    .dn-listing-filter__toggle,
    .dn-listing-filter .dn-listing-filter__mobile-sort {
      position: relative;
      display: grid;
      width: var(--dn-control-height-default);
      height: var(--dn-control-height-default);
      place-items: center;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: var(--dn-mobile-surface);
    }
    .dn-listing-filter__toggle { background: #202329; color: #fff; }
    .dn-listing-filter__mobile-sort { background: var(--dn-mobile-surface); }
    .dn-listing-filter__toggle:focus-visible { background: #111318; }
    .dn-listing-filter__mobile-sort:focus-visible { outline: 2px solid #202329; outline-offset: 2px; }
    .dn-listing-filter__toggle-label { display: none; }
    .dn-listing-filter__mobile-sort { color: #202329; cursor: pointer; }
    @media (hover: hover) and (pointer: fine) {
      .dn-listing-filter__toggle:hover { background: #111318; }
      .dn-listing-filter__mobile-sort:hover { background: #e8eaed; }
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
