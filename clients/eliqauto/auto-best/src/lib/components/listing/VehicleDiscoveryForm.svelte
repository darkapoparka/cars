<script lang="ts">
  import { resolve } from '$app/paths';
  import Icon from '$components/ui/Icon.svelte';
  import type { Attachment } from 'svelte/attachments';
  import {
    activeFilterCount,
    bodyLabel,
    listingFilterOptions,
    listingHiddenFields,
    listingModelsForMake,
    type ListingFilters
  } from '$data/listing';
  import {
    cleanListingFormData,
    formatListingNumber,
    listingFiltersFromFormData,
    listingModelAfterMakeChange,
    listingOptionsWithCurrent,
    normalizeListingMakeTransition
  } from '$data/listing-draft';

  let { filters, openFilters, filtersOpen, onDraftChange, showFilterAction = true, enableSticky = true, keywordPlaceholder = 'Марка, модел или ключова дума' }: {
    showFilterAction?: boolean;
    enableSticky?: boolean;
    keywordPlaceholder?: string;
    filters: ListingFilters;
    openFilters: (event: MouseEvent, field?: string) => void;
    filtersOpen: boolean;
    onDraftChange: (filters: ListingFilters) => void;
  } = $props();
  let make = $derived(filters.make);
  let model = $derived(filters.model);
  let pending = $derived(filters);
  let pinned = $state(false);
  let stickyBar = $state<HTMLDivElement>();
  const attachSticky: Attachment<HTMLDivElement> = node => { stickyBar = node; return () => { stickyBar = undefined; }; };
  const observePanel: Attachment<HTMLFormElement> = node => {
    if (!enableSticky) { pinned = false; return; }
    const desktop = window.matchMedia('(min-width: 992px)');
    const update = () => {
      if (filtersOpen) return;
      pinned = desktop.matches && node.getBoundingClientRect().bottom < 12;
    };
    const observer = new IntersectionObserver(update, { rootMargin: '-12px 0px 0px', threshold: 0 });
    observer.observe(node);
    desktop.addEventListener('change', update);
    update();
    return () => { observer.disconnect(); desktop.removeEventListener('change', update); };
  };
  $effect(() => {
    if (!stickyBar) return;
    if (pinned) stickyBar.showPopover();
    else stickyBar.hidePopover();
  });
  let models = $derived(listingModelsForMake(make));
  let activeCount = $derived(activeFilterCount(pending));
  let summary = $derived([pending.q, pending.make, pending.model].filter(Boolean).join(' · ') || keywordPlaceholder);
  let prices = $derived(listingOptionsWithCurrent(listingFilterOptions.prices, filters.priceMax?.toString() ?? ''));
  let years = $derived(listingOptionsWithCurrent(listingFilterOptions.years, filters.yearMin?.toString() ?? ''));
  let mileages = $derived(listingOptionsWithCurrent(listingFilterOptions.mileages, filters.mileageMax?.toString() ?? ''));
  let hiddenFields = $derived(listingHiddenFields(filters, ['make', 'model', 'body', 'price_max', 'year_min', 'mileage_max']));

  function updateDraft(event: Event) {
    pending = normalizeListingMakeTransition(pending, listingFiltersFromFormData(new FormData(event.currentTarget as HTMLFormElement)));
    onDraftChange(pending);
  }
  function changeMake(event: Event) {
    const nextMake = (event.currentTarget as HTMLSelectElement).value;
    model = listingModelAfterMakeChange(make, nextMake, model);
    make = nextMake;
  }
  const clean = (event: FormDataEvent) => cleanListingFormData(event.formData);
</script>

<form id="dn-desktop-discovery" class="dn-discovery" {@attach observePanel} method="GET" action={resolve('/listing-grid')} oninput={updateDraft} onchange={updateDraft} onformdata={clean}>
  <div class="dn-discovery__toolbar">
    <div class="dn-discovery__search">
      <button class="dn-discovery__keyword" type="button" aria-label={keywordPlaceholder} aria-haspopup="dialog" aria-controls="dn-listing-filter-dialog" aria-expanded={filtersOpen} onclick={openFilters}>
        <Icon name="search" size={20} />
        <span>{filters.q || keywordPlaceholder}</span>
      </button>
      {#if showFilterAction}
        <button class="dn-discovery__filters" type="button" title="Всички филтри" aria-label={activeCount ? `Всички филтри: ${activeCount} активни` : 'Всички филтри'} aria-haspopup="dialog" aria-controls="dn-listing-filter-dialog" aria-expanded={filtersOpen} onclick={openFilters}>
          <Icon name="adjustments" size={18} strokeWidth={1.8} /><span>Филтри</span>
          {#if activeCount}<span class="dn-discovery__count" aria-hidden="true">{activeCount}</span>{/if}
        </button>
      {/if}
      <button class="dn-discovery__submit" type="submit" aria-label="Търси" title="Търси"><Icon name="search" size={21} /></button>
    </div>
  </div>
  <div class="dn-discovery__facets">
    <label><span>Марка</span><select name="make" value={make} onchange={changeMake}>{#each listingFilterOptions.makes as value (value)}<option {value}>{value || 'Всички'}</option>{/each}</select></label>
    <label><span>Модел</span><select name="model" bind:value={model}>{#each models as value (value)}<option {value}>{value || 'Всички'}</option>{/each}</select></label>
    <label><span>Купе</span><select name="body" value={filters.body}>{#each listingFilterOptions.bodies as value (value)}<option {value}>{bodyLabel(value) || 'Всички'}</option>{/each}</select></label>
    <label><span>Цена до</span><select name="price_max" value={filters.priceMax?.toString() ?? ''}>{#each prices as value (value)}<option {value}>{value ? `${formatListingNumber(value)} €` : 'Без лимит'}</option>{/each}</select></label>
    <label><span>Година от</span><select name="year_min" value={filters.yearMin?.toString() ?? ''}>{#each years as value (value)}<option {value}>{value || 'Всички'}</option>{/each}</select></label>
    <label><span>Пробег до</span><select name="mileage_max" value={filters.mileageMax?.toString() ?? ''}>{#each mileages as value (value)}<option {value}>{value ? `${formatListingNumber(value)} км` : 'Без лимит'}</option>{/each}</select></label>
  </div>

  {#each hiddenFields as [name, value], index (`${name}-${value}-${index}`)}<input type="hidden" {name} {value} />{/each}
</form>

<div class="dn-discovery-sticky" popover="manual" {@attach attachSticky} role="region" aria-label="Бързо търсене на автомобили">
  <button class="dn-discovery-sticky__keyword" type="button" aria-label="Отвори търсенето на автомобили" aria-haspopup="dialog" aria-controls="dn-listing-filter-dialog" aria-expanded={filtersOpen} onclick={openFilters}>
    <Icon name="search" size={20} /><span>{summary}</span>
  </button>
  <button class="dn-discovery-sticky__filters" type="button" aria-haspopup="dialog" aria-controls="dn-listing-filter-dialog" aria-expanded={filtersOpen} onclick={openFilters}>
    <Icon name="adjustments" size={20} /><span>Филтри</span>{#if activeCount}<span class="dn-discovery-sticky__count">{activeCount}</span>{/if}
  </button>
  <button class="dn-discovery-sticky__submit" type="submit" form="dn-desktop-discovery" aria-label="Търси" title="Търси"><Icon name="search" size={21} /></button>
</div>

<style>
  .dn-discovery {
    --dn-discovery-gap: 14px;
    --dn-discovery-search-height: 60px;
    display: grid;
    gap: var(--dn-discovery-gap);
  }
  .dn-discovery__toolbar { display: flex; align-items: center; gap: 14px; min-width: 0; }
  .dn-discovery__search { display: flex; flex: 1; align-items: center; gap: 8px; min-width: 0; height: var(--dn-discovery-search-height, 60px); padding: 5px; border: 1px solid #dfe2e6; border-radius: var(--dn-pill); background: #f5f6f7; }
  .dn-discovery__keyword { display: flex; flex: 1; align-items: center; gap: 12px; min-width: 0; height: 48px; padding: 0 12px; border: 0; border-radius: var(--dn-pill); background: transparent; color: #68717d; text-align: left; font-size: var(--dn-text-lead); font-weight: var(--dn-weight-regular); line-height: var(--dn-leading-control); cursor: pointer; }
  .dn-discovery__keyword span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dn-discovery__keyword:hover { color: var(--dn-ink); background: #eceef1; }
  .dn-discovery__submit { display: inline-flex; flex: 0 0 48px; align-items: center; justify-content: center; width: 48px; height: 48px; padding: 0; border: 0; border-radius: var(--dn-pill); background: var(--dn-red); color: white; cursor: pointer; }
  .dn-discovery__submit:hover { background: var(--dn-red-hover); }
  .dn-discovery__facets { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); align-items: end; gap: var(--dn-discovery-gap, 14px); }
  .dn-discovery__facets label { display: grid; min-width: 0; }
  .dn-discovery__facets label > span { margin: 0 0 6px 2px; color: var(--dn-muted); font-size: var(--dn-text-meta); font-weight: var(--dn-weight-medium); line-height: var(--dn-leading-meta); }
  .dn-discovery__facets select { width: 100%; min-width: 0; height: 52px; padding: 0 36px 0 14px; border: 1px solid #dfe2e6; border-radius: var(--dn-radius-control); background-color: #f5f6f7; color: var(--dn-ink); font: var(--dn-body-font); font-size: var(--dn-text-control-prominent); font-weight: var(--dn-weight-ui); }
  .dn-discovery__filters { position: relative; display: flex; flex: 0 0 auto; align-items: center; justify-content: center; gap: 8px; height: 48px; padding: 0 16px; border: 1px solid #202329; border-radius: var(--dn-pill); background: #202329; color: #fff; font: var(--dn-control-font); cursor: pointer; }
  .dn-discovery__filters:hover { background: #3a3e46; }
  .dn-discovery__count { position: absolute; top: -6px; right: -6px; display: grid; place-items: center; min-width: 20px; height: 20px; padding: 0 4px; border: 2px solid white; border-radius: var(--dn-pill); background: var(--dn-red); color: white; font-size: var(--dn-text-meta); }
  button:focus-visible, select:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 3px; }
  .dn-discovery-sticky { position: fixed; inset: 12px auto auto 50%; width: min(800px, calc(100% - 48px)); box-sizing: border-box; margin: 0; padding: 8px; border: 0; border-radius: var(--dn-pill); background: #fff; color: var(--dn-ink); box-shadow: 0 8px 32px rgb(18 25 38 / .2); transform: translateX(-50%); }
  .dn-discovery-sticky:popover-open { display: flex; align-items: center; gap: 8px; }
  .dn-discovery-sticky__keyword { display: flex; flex: 1; align-items: center; gap: 12px; min-width: 0; height: 48px; padding: 0 16px; border: 0; border-radius: var(--dn-pill); background: #f5f6f7; color: #596370; font: var(--dn-body-font); text-align: left; cursor: pointer; }
  .dn-discovery-sticky__keyword span { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  .dn-discovery-sticky__keyword :global(svg) { flex: 0 0 20px; }
  .dn-discovery-sticky__filters { display: flex; flex: 0 0 auto; align-items: center; justify-content: center; gap: 8px; height: 48px; padding: 0 16px; border: 0; border-radius: var(--dn-pill); background: #202329; color: #fff; font: var(--dn-control-font); cursor: pointer; }
  .dn-discovery-sticky__filters:hover { background: #3a3e46; }
  .dn-discovery-sticky__count { display: grid; place-items: center; min-width: 20px; height: 20px; padding: 0 4px; border-radius: var(--dn-pill); background: #353c47; color: #fff; font-size: var(--dn-text-meta); }
  .dn-discovery-sticky__submit { display: grid; place-items: center; flex: 0 0 48px; width: 48px; height: 48px; padding: 0; border: 0; border-radius: var(--dn-pill); background: var(--dn-red); color: #fff; cursor: pointer; }
  .dn-discovery-sticky__submit:hover { background: var(--dn-red-hover); }
  @media (max-width: 991px) { .dn-discovery-sticky:popover-open { display: none; } }
  @media (min-width: 768px) and (max-width: 991px) { .dn-discovery__facets { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
  @media (min-width: 992px) and (max-width: 1199px) { .dn-discovery__facets { gap: 10px; } .dn-discovery__facets select { font-size: var(--dn-text-control-prominent); padding-left: 10px; } }
  @media (min-width: 1440px) and (max-width: 1599px) { .dn-discovery .dn-discovery__facets select { padding-inline: 10px 28px; font-size: var(--dn-control-size); } }
  @media (max-width: 767px) { .dn-discovery { display: none; } }
</style>
