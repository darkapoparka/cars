<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  import { listingDraftFromFilters, listingFacetSummary, listingFacetTitle, type ListingFacetField } from '$data/listing-draft';
  import type { ListingFilters } from '$data/listing';
  import Icon from '$components/ui/Icon.svelte';
  const i18n = getI18n();
  let { filters, openFilters, filtersOpen }: { filters: ListingFilters; openFilters: (event: MouseEvent, field?: string) => void; filtersOpen: boolean } = $props();
  const fields = ['type', 'make', 'model', 'body', 'price', 'year', 'mileage_max'] satisfies ListingFacetField[];
  const draft = $derived(listingDraftFromFilters(filters));
  const hasValue = (field: ListingFacetField) => field === 'price' ? Boolean(filters.priceMin || filters.priceMax) : field === 'year' ? Boolean(filters.yearMin || filters.yearMax) : field === 'mileage_max' ? filters.mileageMax !== null : Boolean(filters[field as 'type' | 'make' | 'model' | 'body']);
  const label = (field: ListingFacetField) => listingFacetTitle(field, i18n.locale);
</script>

<div class="dn-desktop-listing-search">
  <div class="dn-desktop-listing-search__keyword">
    <button type="button" class="dn-desktop-listing-search__query" aria-haspopup="dialog" aria-controls="dn-listing-filter-dialog" aria-expanded={filtersOpen} onclick={event => openFilters(event, 'q')}>
      <Icon name="search" size={20} /><span>{filters.q || i18n.t('m_13fd09148700')}</span>
    </button>
    <button type="button" class="dn-desktop-listing-search__action" aria-label={i18n.t('m_49c266baaaa7')} aria-haspopup="dialog" aria-controls="dn-listing-filter-dialog" aria-expanded={filtersOpen} onclick={event => openFilters(event, 'q')}><Icon name="search" size={21} /></button>
  </div>
  <div class="dn-desktop-listing-search__facets">
    {#each fields as field (field)}
      <button type="button" class:dn-desktop-listing-search__selected={hasValue(field)} aria-label={hasValue(field) ? `${label(field)}: ${listingFacetSummary(field, draft, i18n.locale)}` : label(field)} aria-haspopup="dialog" aria-controls="dn-listing-filter-dialog" aria-expanded={filtersOpen} onclick={event => openFilters(event, field)}>
        <span>{hasValue(field) ? listingFacetSummary(field, draft, i18n.locale) : label(field)}</span><Icon name="chevron-down" size={14} />
      </button>
    {/each}
  </div>
</div>

<style>
  .dn-desktop-listing-search { display: none; }
  @media (min-width: 992px) {
    .dn-desktop-listing-search { display: grid; gap: 14px; }
    .dn-desktop-listing-search__keyword { display: flex; align-items: center; gap: var(--dn-space-2); height: 60px; padding: 5px; border: 1px solid var(--dn-line); border-radius: var(--dn-pill); background: var(--dn-surface-subtle); }
    .dn-desktop-listing-search__query { display: flex; flex: 1; min-width: 0; align-items: center; gap: var(--dn-space-3); height: 48px; padding: 0 var(--dn-space-3); border: 0; border-radius: var(--dn-pill); background: transparent; color: var(--dn-muted); font: var(--dn-entry-font); text-align: left; cursor: pointer; }
    .dn-desktop-listing-search__query span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dn-desktop-listing-search__query :global(svg) { flex-shrink: 0; }
    .dn-desktop-listing-search__action { display: grid; place-items: center; flex: 0 0 48px; height: 48px; padding: 0; border: 0; border-radius: var(--dn-pill); background: var(--dn-red); color: var(--dn-white); cursor: pointer; }
    .dn-desktop-listing-search__facets { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: var(--dn-space-2); }
    .dn-desktop-listing-search__facets button { display: flex; align-items: center; justify-content: space-between; gap: var(--dn-space-2); min-width: 0; min-height: var(--dn-control-height-default); padding: var(--dn-space-2) var(--dn-space-3); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-control); background: var(--dn-surface-subtle); color: var(--dn-ink); font: var(--dn-control-font); cursor: pointer; }
    .dn-desktop-listing-search__facets button > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dn-desktop-listing-search__facets :global(svg) { flex-shrink: 0; color: var(--dn-muted); }
    .dn-desktop-listing-search__facets button.dn-desktop-listing-search__selected { border-color: var(--dn-ink); background: var(--dn-white); }
    .dn-desktop-listing-search__query:hover, .dn-desktop-listing-search__facets button:hover { background: var(--dn-surface-hover); }
    .dn-desktop-listing-search__action:hover { background: var(--dn-red-hover); }
    button:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: 3px; }
  }
</style>
