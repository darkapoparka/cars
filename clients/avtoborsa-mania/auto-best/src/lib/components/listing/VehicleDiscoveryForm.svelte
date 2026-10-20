<script lang="ts">
  import { listingFacetTitle, listingFacetSummary, listingDraftFromFilters, type ListingFacetField } from '$data/listing-draft';

  import { getI18n } from '$lib/locale/context';
  import { vehicleCount } from '$lib/locale/messages';

  const i18n = getI18n();

  import { resolve } from '$app/paths';
  import Icon from '$components/ui/Icon.svelte';
  import ListingChoicePicker from './ListingChoicePicker.svelte';
  import type { Attachment } from 'svelte/attachments';
  import {
    activeFilterCount,
    listingHiddenFields,
    type ListingFilters
  } from '$data/listing';
  import {
    cleanListingFormData,
    listingFiltersFromDraft,
  } from '$data/listing-draft';

  let { filters, resultCount, openFilters, filtersOpen, onDraftChange, showFilterAction = true, enableSticky = true, keywordPlaceholder = 'Марка, модел или ключова дума', modalFacets = false }: {
    resultCount?: number;
    modalFacets?: boolean;
    showFilterAction?: boolean;
    enableSticky?: boolean;
    keywordPlaceholder?: string;
    filters: ListingFilters;
    openFilters: (event: MouseEvent, field?: string) => void;
    filtersOpen: boolean;
    onDraftChange: (filters: ListingFilters) => void;
  } = $props();
  let pending = $derived(filters);
  let controlDraft = $derived(listingDraftFromFilters(filters));
  function updateControls(draft: typeof controlDraft) {
    pending = listingFiltersFromDraft(draft);
    onDraftChange(pending);
  }
  let pinned = $state(false);
  let modalReady = $state(false);
  let stickyBar = $state<HTMLDivElement>();
  const attachSticky: Attachment<HTMLDivElement> = node => { stickyBar = node; return () => { stickyBar = undefined; }; };
  const observePanel: Attachment<HTMLFormElement> = node => {
    modalReady = true;
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
    if (pinned && !filtersOpen) stickyBar.showPopover();
    else stickyBar.hidePopover();
  });
  let activeCount = $derived(activeFilterCount(pending));
  let summary = $derived([pending.q, ...pending.make, ...pending.model].filter(Boolean).join(' · ') || i18n.text(keywordPlaceholder));
  const resultLabel = $derived(resultCount === undefined ? '' : vehicleCount(i18n.locale, resultCount));
  let hiddenFields = $derived(listingHiddenFields(filters, ['type', 'make', 'model', 'body', 'price_max', 'year_min', 'mileage_max']));
  const facetFields = ['type', 'make', 'model', 'body', 'price', 'year', 'mileage_max'] satisfies readonly ListingFacetField[];
  const appliedDraft = $derived(listingDraftFromFilters(filters));
  function facetActive(field: ListingFacetField) {
    if (field === 'price') return filters.priceMin !== null || filters.priceMax !== null;
    if (field === 'year') return filters.yearMin !== null || filters.yearMax !== null;
    if (field === 'mileage_max') return filters.mileageMax !== null;
    if (field === 'make' || field === 'model') return filters[field].length > 0;
    return Boolean(filters[field as 'type' | 'body']);
  }
  function facetValue(field: ListingFacetField) {
    return facetActive(field) ? listingFacetSummary(field, appliedDraft, i18n.locale)
      : field === 'body' ? i18n.t('inventory.facet.bodyShort') : listingFacetTitle(field, i18n.locale);
  }

  const clean = (event: FormDataEvent) => cleanListingFormData(event.formData);
</script>

<form id="dn-desktop-discovery" class="dn-discovery" {@attach observePanel} method="GET" action={i18n.href(resolve('/cars'))} onformdata={clean}>
  <div class="dn-discovery__toolbar">
    <div class="dn-discovery__search">
      <button class="dn-discovery__keyword" type="button" aria-label={[filters.q || i18n.text(keywordPlaceholder), resultLabel].filter(Boolean).join(' · ')} aria-haspopup="dialog" aria-controls="dn-listing-filter-dialog" aria-expanded={filtersOpen} onclick={event => openFilters(event, modalFacets ? 'search' : undefined)}>
        <Icon name="search" size={20} />
        <span>{filters.q || i18n.text(keywordPlaceholder)}</span>
        {#if resultCount !== undefined}<span class="dn-discovery__result-count" aria-hidden="true">({resultCount})</span>{/if}
      </button>
      {#if showFilterAction}
        <button class="dn-discovery__filters" type="button" title={i18n.t("m_3deeda2a1ebe")} aria-label={activeCount ? i18n.t("m_8a61a4d5543e", { p0: activeCount }) : i18n.t("m_3deeda2a1ebe")} aria-haspopup="dialog" aria-controls="dn-listing-filter-dialog" aria-expanded={filtersOpen} onclick={openFilters}>
          <Icon name="adjustments" size={18} strokeWidth={1.8} /><span>{i18n.t("m_546ebb8eb993")}</span>
          {#if activeCount}<span class="dn-discovery__count" aria-hidden="true">{activeCount}</span>{/if}
        </button>
      {/if}
      <button class="dn-discovery__submit" type="submit" aria-label={i18n.t("m_49c266baaaa7")} title={i18n.t("m_49c266baaaa7")}><Icon name="search" size={21} /></button>
    </div>
  </div>
  {#if modalFacets && modalReady}
    <div class="dn-discovery__facet-buttons">
      {#each facetFields as field (field)}
        <button type="button" data-facet={field} data-active={facetActive(field)} aria-label={facetActive(field) ? `${listingFacetTitle(field, i18n.locale)}: ${facetValue(field)}` : listingFacetTitle(field, i18n.locale)} aria-haspopup="dialog" aria-controls="dn-listing-filter-dialog" onclick={event => openFilters(event, field)}><span>{facetValue(field)}</span><Icon name="chevron-down" size={16} /></button>
      {/each}
    </div>
  {/if}
  <div class="dn-discovery__facets" class:dn-discovery__facets--fallback={modalFacets && modalReady}>
    <ListingChoicePicker field="type" bind:draft={controlDraft} showLabel={false} compact onchange={updateControls} />
    <ListingChoicePicker field="make" bind:draft={controlDraft} showLabel={false} compact onchange={updateControls} />
    <ListingChoicePicker field="model" bind:draft={controlDraft} showLabel={false} compact onchange={updateControls} />
    <ListingChoicePicker field="body" bind:draft={controlDraft} showLabel={false} compact placeholder={i18n.t('inventory.facet.bodyShort')} onchange={updateControls} />
    <ListingChoicePicker field="price_max" bind:draft={controlDraft} showLabel={false} compact placeholder={i18n.t('inventory.facet.price')} onchange={updateControls} />
    <ListingChoicePicker field="year_min" bind:draft={controlDraft} showLabel={false} compact placeholder={i18n.t('inventory.facet.year')} onchange={updateControls} />
    <ListingChoicePicker field="mileage_max" bind:draft={controlDraft} showLabel={false} compact placeholder={i18n.t('inventory.facet.mileage_max')} onchange={updateControls} />
  </div>

  {#each hiddenFields as [name, value], index (`${name}-${value}-${index}`)}<input type="hidden" {name} {value} />{/each}
</form>

<div class="dn-discovery-sticky" popover="manual" {@attach attachSticky} role="region" aria-label={i18n.t("m_8451d82f9587")}>
  <button class="dn-discovery-sticky__keyword" type="button" aria-label={[i18n.t("m_a6403c514411"), resultLabel].filter(Boolean).join(' · ')} aria-haspopup="dialog" aria-controls="dn-listing-filter-dialog" aria-expanded={filtersOpen} onclick={event => openFilters(event, modalFacets ? 'search' : undefined)}>
    <Icon name="search" size={20} /><span>{summary}</span>
    {#if resultCount !== undefined}<span class="dn-discovery__result-count" aria-hidden="true">({resultCount})</span>{/if}
  </button>
  <button class="dn-discovery-sticky__filters" type="button" aria-haspopup="dialog" aria-controls="dn-listing-filter-dialog" aria-expanded={filtersOpen} onclick={openFilters}>
    <Icon name="adjustments" size={20} /><span>{i18n.t("m_546ebb8eb993")}</span>{#if activeCount}<span class="dn-discovery-sticky__count">{activeCount}</span>{/if}
  </button>
  <button class="dn-discovery-sticky__submit" type="submit" form="dn-desktop-discovery" aria-label={i18n.t("m_49c266baaaa7")} title={i18n.t("m_49c266baaaa7")}><Icon name="search" size={21} /></button>
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
  .dn-discovery__keyword .dn-discovery__result-count,
  .dn-discovery-sticky__keyword .dn-discovery__result-count { flex: none; color: var(--dn-muted); font-size: var(--dn-text-body); font-weight: var(--dn-weight-medium); }
  .dn-discovery__keyword:hover { color: var(--dn-ink); background: #eceef1; }
  .dn-discovery__submit { display: inline-flex; flex: 0 0 48px; align-items: center; justify-content: center; width: 48px; height: 48px; padding: 0; border: 0; border-radius: var(--dn-pill); background: var(--dn-red); color: white; cursor: pointer; }
  .dn-discovery__submit:hover { background: var(--dn-red-hover); }
  .dn-discovery__facets { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: var(--dn-space-2); }
  .dn-discovery__facets :global(.dn-identity-field) { --dn-identity-control-height: 64px; }
  .dn-discovery__facet-buttons { display: none; }
  .dn-discovery__facet-buttons button { position: relative; min-width: 0; border: 1px solid var(--dn-line); border-radius: var(--dn-radius-control); background: var(--dn-surface-subtle); }
  .dn-discovery__filters { position: relative; display: flex; flex: 0 0 auto; align-items: center; justify-content: center; gap: 8px; height: 48px; padding: 0 16px; border: 1px solid #202329; border-radius: var(--dn-pill); background: #202329; color: #fff; font: var(--dn-control-font); cursor: pointer; }
  .dn-discovery__filters:hover { background: #3a3e46; }
  .dn-discovery__count { position: absolute; top: -6px; right: -6px; display: grid; place-items: center; min-width: 20px; height: 20px; padding: 0 4px; border: 2px solid white; border-radius: var(--dn-pill); background: var(--dn-red); color: white; font-size: var(--dn-text-meta); }
  button:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 3px; }
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
  @media (min-width: 768px) and (max-width: 991px) { .dn-discovery__facets { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
  @media (max-width: 767px) { .dn-discovery { display: none; } }
  @media (min-width: 768px) {
    .dn-discovery__keyword :global(svg) { flex-shrink: 0; }
  }
  @media (min-width: 992px) {
    .dn-discovery__facets :global(.dn-identity-field) { --dn-identity-control-height: var(--dn-control-hit-height); }
    .dn-discovery__facets :global(.dn-identity-trigger) { font-size: var(--dn-text-control-prominent); }
    .dn-discovery__submit, .dn-discovery-sticky__submit { background: var(--dn-ink); }
    .dn-discovery__submit:hover, .dn-discovery-sticky__submit:hover { background: var(--dn-ink-hover); }
    .dn-discovery__facets--fallback { display: none; }
    .dn-discovery__facet-buttons { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: var(--dn-space-2); }
    .dn-discovery__facet-buttons button { display: flex; min-height: var(--dn-control-height-default); align-items: center; justify-content: space-between; gap: var(--dn-space-2); padding: var(--dn-space-2) var(--dn-space-3); color: var(--dn-ink); font: var(--dn-control-font); font-size: var(--dn-text-control-prominent); text-align: left; cursor: pointer; }
    .dn-discovery__facet-buttons span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dn-discovery__facet-buttons :global(svg) { flex: 0 0 16px; color: var(--dn-muted); }
    .dn-discovery__facet-buttons button[data-active='true'] { border-color: var(--dn-line-emphasis); }
    .dn-discovery__search:focus-within { border-color: var(--dn-focus); }
    .dn-discovery :is(.dn-discovery__keyword, .dn-discovery__submit) { transition: none; }
  }
</style>
