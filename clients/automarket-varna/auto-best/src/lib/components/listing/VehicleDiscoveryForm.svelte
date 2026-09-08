<script lang="ts">
  import { resolve } from '$app/paths';
  import Icon from '$components/ui/Icon.svelte';
  import type { Attachment } from 'svelte/attachments';
  import { listingFilterOptions, listingModelsForMake, parseListingFilters, type ListingFilters } from '$data/listing';

  let { filters, openFilters, filtersOpen, onDraftChange, showFilterAction = true }: {
    showFilterAction?: boolean;
    filters: ListingFilters;
    openFilters: (event: MouseEvent, field?: string) => void;
    filtersOpen: boolean;
    onDraftChange: (filters: ListingFilters) => void;
  } = $props();
  let make = $derived(filters.make);
  let pending = $derived(filters);
  let pinned = $state(false);
  let stickyBar = $state<HTMLDivElement>();
  const attachSticky: Attachment<HTMLDivElement> = node => { stickyBar = node; return () => { stickyBar = undefined; }; };
  const observePanel: Attachment<HTMLFormElement> = node => {
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
  let model = $derived(filters.model);
  let models = $derived(listingModelsForMake(make));
  let activeCount = $derived(Object.entries(pending).filter(([key, value]) => !['q', 'sort', 'equipment'].includes(key) && Boolean(value)).length + pending.equipment.length);
  let summary = $derived([pending.q, pending.make, pending.model].filter(Boolean).join(' · ') || 'Марка, модел или ключова дума');
  const number = (value: string) => Number(value).toLocaleString('bg-BG');
  const withCurrent = (options: readonly string[], current: number | null) => {
    const value = current?.toString();
    return value && !options.includes(value) ? [...options, value] : options;
  };
  let prices = $derived(withCurrent(listingFilterOptions.prices, filters.priceMax));
  let years = $derived(withCurrent(listingFilterOptions.years, filters.yearMin));
  let mileages = $derived(withCurrent(listingFilterOptions.mileages, filters.mileageMax));
  let hiddenFields = $derived([
    ['q', filters.q], ['fuel', filters.fuel], ['transmission', filters.transmission],
    ['version', filters.version], ['condition', filters.condition],
    ['price_min', filters.priceMin?.toString() ?? ''], ['year_max', filters.yearMax?.toString() ?? ''],
    ['sort', filters.sort === 'default' ? '' : filters.sort]
  ].filter(([, value]) => value));

  function updateDraft(event: Event) {
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(event.currentTarget as HTMLFormElement)) {
      if (typeof value === 'string') params.append(key, value);
    }
    pending = parseListingFilters(params);
    onDraftChange(pending);
  }
  function clean(event: FormDataEvent) {
    for (const key of new Set(event.formData.keys())) {
      if (event.formData.getAll(key).every(value => value === '')) event.formData.delete(key);
    }
  }
</script>

<form id="dn-desktop-discovery" class="dn-discovery" {@attach observePanel} method="GET" action={resolve('/listing-grid')} oninput={updateDraft} onchange={updateDraft} onformdata={clean}>
  <div class="dn-discovery__toolbar">
    <div class="dn-discovery__search">
      <button class="dn-discovery__keyword" type="button" aria-label="Търсете марка, модел или ключова дума" aria-haspopup="dialog" aria-controls="dn-listing-filter-dialog" aria-expanded={filtersOpen} onclick={openFilters}>
        <Icon name="search" size={20} />
        <span>{filters.q || 'Марка, модел или ключова дума'}</span>
      </button>
      <button class="dn-discovery__submit" type="submit" aria-label="Търси" title="Търси"><Icon name="search" size={21} /></button>
    </div>

  </div>
  <div class="dn-discovery__facets">
    <label><span>Марка</span><select name="make" bind:value={make} onchange={() => model = ''}>{#each listingFilterOptions.makes as value (value)}<option {value}>{value || 'Всички'}</option>{/each}</select></label>
    <label><span>Модел</span><select name="model" bind:value={model}>{#each models as value (value)}<option {value}>{value || 'Всички'}</option>{/each}</select></label>
    <label><span>Купе</span><select name="body" value={filters.body}>{#each listingFilterOptions.bodies as value (value)}<option {value}>{value || 'Всички'}</option>{/each}</select></label>
    <label><span>Цена до</span><select name="price_max" value={filters.priceMax?.toString() ?? ''}>{#each prices as value (value)}<option {value}>{value ? `${number(value)} €` : 'Без лимит'}</option>{/each}</select></label>
    <label><span>Година от</span><select name="year_min" value={filters.yearMin?.toString() ?? ''}>{#each years as value (value)}<option {value}>{value || 'Всички'}</option>{/each}</select></label>
    <label><span>Пробег до</span><select name="mileage_max" value={filters.mileageMax?.toString() ?? ''}>{#each mileages as value (value)}<option {value}>{value ? `${number(value)} км` : 'Без лимит'}</option>{/each}</select></label>
  </div>
  {#if showFilterAction}<div class="dn-discovery__actions">
    <button class="dn-discovery__filters" type="button" title="Всички филтри" aria-label={activeCount ? `Всички филтри: ${activeCount} активни` : 'Всички филтри'} aria-haspopup="dialog" aria-controls="dn-listing-filter-dialog" aria-expanded={filtersOpen} onclick={openFilters}>
      <Icon name="adjustments" size={20} strokeWidth={1.8} /><span>Всички филтри</span>
      {#if activeCount}<span class="dn-discovery__count" aria-hidden="true">{activeCount}</span>{/if}
    </button>
  </div>{/if}
  {#each hiddenFields as [name, value] (name)}<input type="hidden" {name} {value} />{/each}
  {#each filters.equipment as value (value)}<input type="hidden" name="equipment" {value} />{/each}
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
  .dn-discovery { display: grid; gap: var(--dn-discovery-gap, 14px); }
  .dn-discovery__toolbar { display: flex; align-items: center; gap: 14px; min-width: 0; }
  .dn-discovery__search { display: flex; flex: 1; align-items: center; gap: 8px; min-width: 0; height: var(--dn-discovery-search-height, 60px); padding: 5px; border: 1px solid #dfe2e6; border-radius: var(--dn-pill); background: #f5f6f7; }
  .dn-discovery__keyword { display: flex; flex: 1; align-items: center; gap: 12px; min-width: 0; height: 48px; padding: 0 12px; border: 0; border-radius: var(--dn-pill); background: transparent; color: #68717d; text-align: left; font-size: 16px; cursor: pointer; }
  .dn-discovery__keyword span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dn-discovery__keyword:hover { color: var(--dn-ink); background: #eceef1; }
  .dn-discovery__submit { display: inline-flex; flex: 0 0 48px; align-items: center; justify-content: center; width: 48px; height: 48px; padding: 0; border: 0; border-radius: var(--dn-pill); background: var(--dn-red); color: white; cursor: pointer; }
  .dn-discovery__submit:hover { background: var(--dn-red-hover); }
  .dn-discovery__facets { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); align-items: end; gap: var(--dn-discovery-gap, 14px); }
  .dn-discovery__facets label { display: grid; min-width: 0; }
  .dn-discovery__facets label > span { margin: 0 0 6px 2px; color: var(--dn-muted); font-size: 12px; font-weight: 600; line-height: 18px; }
  .dn-discovery__facets select { width: 100%; min-width: 0; height: 52px; padding: 0 36px 0 14px; border: 1px solid #dfe2e6; border-radius: var(--dn-radius-control); background-color: #f5f6f7; color: var(--dn-ink); font: 500 16px/24px var(--dn-font); }
  .dn-discovery__actions { display: flex; justify-content: flex-end; }
  .dn-discovery__filters { position: relative; display: flex; align-items: center; justify-content: center; gap: 8px; height: 46px; padding: 0 16px; border: 1px solid #202329; border-radius: var(--dn-radius-control); background: #202329; color: #fff; font: 600 14px var(--dn-font); cursor: pointer; }
  .dn-discovery__filters:hover { background: #3a3e46; }
  .dn-discovery__count { position: absolute; top: -6px; right: -6px; display: grid; place-items: center; min-width: 20px; height: 20px; padding: 0 4px; border: 2px solid white; border-radius: var(--dn-pill); background: var(--dn-red); color: white; font-size: 11px; }
  button:focus-visible, select:focus-visible { outline: 3px solid #0b57d0; outline-offset: 3px; }
  .dn-discovery-sticky { position: fixed; inset: 12px auto auto 50%; width: min(800px, calc(100% - 48px)); box-sizing: border-box; margin: 0; padding: 8px; border: 0; border-radius: var(--dn-pill); background: #fff; color: var(--dn-ink); box-shadow: 0 8px 32px rgb(18 25 38 / .2); transform: translateX(-50%); }
  .dn-discovery-sticky:popover-open { display: flex; align-items: center; gap: 8px; }
  .dn-discovery-sticky__keyword { display: flex; flex: 1; align-items: center; gap: 12px; min-width: 0; height: 48px; padding: 0 16px; border: 0; border-radius: var(--dn-pill); background: #f5f6f7; color: #596370; font: 400 16px var(--dn-font); text-align: left; cursor: pointer; }
  .dn-discovery-sticky__keyword span { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  .dn-discovery-sticky__keyword :global(svg) { flex: 0 0 20px; }
  .dn-discovery-sticky__filters { display: flex; flex: 0 0 auto; align-items: center; justify-content: center; gap: 8px; height: 48px; padding: 0 16px; border: 0; border-radius: var(--dn-pill); background: #202329; color: #fff; font: 600 14px var(--dn-font); cursor: pointer; }
  .dn-discovery-sticky__filters:hover { background: #3a3e46; }
  .dn-discovery-sticky__count { display: grid; place-items: center; min-width: 20px; height: 20px; padding: 0 4px; border-radius: var(--dn-pill); background: #353c47; color: #fff; font-size: 12px; }
  .dn-discovery-sticky__submit { display: grid; place-items: center; flex: 0 0 48px; width: 48px; height: 48px; padding: 0; border: 0; border-radius: var(--dn-pill); background: var(--dn-red); color: #fff; cursor: pointer; }
  .dn-discovery-sticky__submit:hover { background: var(--dn-red-hover); }
  @media (max-width: 991px) { .dn-discovery-sticky:popover-open { display: none; } }
  @media (min-width: 768px) and (max-width: 991px) { .dn-discovery__facets { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
  @media (min-width: 992px) and (max-width: 1199px) { .dn-discovery__facets { gap: 10px; } .dn-discovery__facets select { font-size: 14px; padding-left: 10px; } }
  @media (max-width: 767px) { .dn-discovery { display: none; } }
</style>
