<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  import { resolve } from '$app/paths';
  import { activeFilterCount, listingParams, listingFilterOptions, removeListingFilter, type ListingFilters, type ListingSort } from '$data/listing';
  import { listingAppliedFilterLabel } from '$data/listing-draft';
  import Icon from '$components/ui/Icon.svelte';
  const i18n = getI18n();
  let { filters, count, openFilters, filtersOpen }: { filters: ListingFilters; count: number; openFilters: (event: MouseEvent, field?: string) => void; filtersOpen: boolean } = $props();
  let sortMenu: HTMLDetailsElement | undefined = $state();
  let sortTrigger: HTMLElement | undefined = $state();
  const activeCount = $derived(activeFilterCount(filters));
  const sortLabel = $derived(i18n.text(listingFilterOptions.sorts.find(([value]) => value === filters.sort)?.[1] ?? 'Препоръчани'));
  const href = (params: URLSearchParams) => {
    const search = params.toString();
    const route: '/listing-grid' | `/listing-grid?${string}` = search ? `/listing-grid?${search}` : '/listing-grid';
    return i18n.href(resolve(route));
  };
  const sortHref = (sort: ListingSort) => href(listingParams({ ...filters, sort }));
  const chips = $derived([...listingParams(filters)].filter(([key, value]) => value && key !== 'sort').map(([key, value]) => ({ key, value, label: listingAppliedFilterLabel(filters, key, value, i18n.locale), href: href(removeListingFilter(filters, key, value)) })));
  function outside(event: MouseEvent) {
    if (sortMenu?.open && event.target instanceof Node && !sortMenu.contains(event.target)) sortMenu.open = false;
  }
  function keydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && sortMenu?.open) { event.preventDefault(); sortMenu.open = false; sortTrigger?.focus(); }
  }
</script>

<svelte:window onclick={outside} onkeydown={keydown} />
<div class="dn-desktop-listing-tools">
  <span class="dn-desktop-listing-summary__count" aria-live="polite">{i18n.t(count === 1 ? 'inventory.count.one' : 'inventory.count.other', { count })}</span>
  <div class="dn-desktop-listing-tools__pill">
    <button class="dn-desktop-listing-tools__filter" type="button" aria-haspopup="dialog" aria-controls="dn-listing-filter-dialog" aria-expanded={filtersOpen} onclick={openFilters}>
      <Icon name="adjustments" size={18} />{i18n.t('m_546ebb8eb993')}{#if activeCount}<span class="dn-desktop-listing-tools__count">{activeCount}</span>{/if}
    </button>
    <details bind:this={sortMenu}>
      <summary bind:this={sortTrigger} aria-label={i18n.t('m_c3f09566c8eb', { p0: sortLabel })}><span class="dn-desktop-listing-tools__sort-icon" aria-hidden="true"></span><span>{sortLabel}</span><Icon name="chevron-down" size={14} /></summary>
      <nav aria-label={i18n.t('m_bec69036aa27')}>
        {#each listingFilterOptions.sorts as [value, label] (value)}
          <a href={sortHref(value)} aria-current={filters.sort === value ? 'true' : undefined} onclick={() => { if (sortMenu) sortMenu.open = false; }}>{i18n.text(label)}<span aria-hidden="true">{filters.sort === value ? '✓' : ''}</span></a>
        {/each}
      </nav>
    </details>
  </div>
</div>
{#if chips.length}
<div class="dn-desktop-listing-summary">
  {#each chips as chip (`${chip.key}-${chip.value}`)}
    <a href={chip.href} aria-label={i18n.t('m_ef5e8d630d53', { p0: chip.label })}>{chip.label}<Icon name="x" size={14} /></a>
  {/each}
  {#if chips.length}
    <a class="dn-desktop-listing-summary__clear" href={href(listingParams({ ...filters, q: '', type: '', make: '', model: '', body: '', fuel: '', transmission: '', version: '', condition: '', equipment: [], priceMin: null, priceMax: null, yearMin: null, yearMax: null, mileageMax: null }))}>{i18n.t('action.clearShort')}</a>
  {/if}
</div>
{/if}

<style>
  .dn-desktop-listing-tools, .dn-desktop-listing-summary { display: none; }
  @media (min-width: 992px) {
    .dn-desktop-listing-tools { position: sticky; top: 12px; z-index: 20; display: flex; align-items: center; justify-content: center; margin-bottom: var(--dn-space-4); pointer-events: none; }
    .dn-desktop-listing-tools__pill { display: inline-flex; align-items: center; gap: var(--dn-space-1); max-width: 100%; padding: var(--dn-space-1); border: 1px solid var(--dn-line); border-radius: var(--dn-pill); background: var(--dn-white); box-shadow: 0 6px 18px rgb(18 25 38 / 7%); pointer-events: auto; }
    .dn-desktop-listing-tools__filter, summary { display: flex; align-items: center; gap: var(--dn-space-2); min-height: var(--dn-control-height-default); padding: 0 var(--dn-space-4); border: 0; border-radius: var(--dn-pill); font: var(--dn-control-font); cursor: pointer; }
    .dn-desktop-listing-tools__filter { background: var(--dn-ink); color: var(--dn-white); }
    .dn-desktop-listing-tools__count { display: grid; place-items: center; min-width: 20px; height: 20px; border-radius: var(--dn-pill); background: var(--dn-white); color: var(--dn-ink); font-size: var(--dn-text-meta); }
    details { position: relative; min-width: 0; }
    summary { color: var(--dn-ink); list-style: none; }
    summary::-webkit-details-marker { display: none; }
    summary:hover, details[open] summary { background: var(--dn-surface-subtle); }
    summary > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dn-desktop-listing-tools__sort-icon { flex: 0 0 16px; height: 14px; color: var(--dn-muted); background: linear-gradient(currentColor,currentColor) 0 0 / 16px 1.5px no-repeat, linear-gradient(currentColor,currentColor) 0 6px / 12px 1.5px no-repeat, linear-gradient(currentColor,currentColor) 0 12px / 8px 1.5px no-repeat; }
    nav { position: absolute; top: calc(100% + 12px); right: 0; display: grid; gap: var(--dn-space-1); width: 280px; padding: var(--dn-space-2); border: 1px solid var(--dn-line); border-radius: 16px; background: var(--dn-white); box-shadow: 0 12px 32px rgb(18 25 38 / 12%); }
    nav a { display: flex; justify-content: space-between; gap: var(--dn-space-3); min-height: var(--dn-control-height-default); align-items: center; padding: var(--dn-space-2) var(--dn-space-3); border-radius: var(--dn-radius-control); color: var(--dn-ink); font: var(--dn-control-font); }
    nav a:hover, nav a[aria-current='true'] { background: var(--dn-surface-subtle); }
    nav a[aria-current='true'] { font-weight: var(--dn-weight-semibold); }
    .dn-desktop-listing-summary { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: var(--dn-space-2); min-height: 44px; margin: 0 0 var(--dn-space-4); color: var(--dn-muted); font: var(--dn-control-font); }
    .dn-desktop-listing-summary__count { position: absolute; left: 0; padding: var(--dn-space-2) var(--dn-space-3); border-radius: var(--dn-pill); background: var(--dn-surface-canvas); color: var(--dn-muted); font: var(--dn-control-font); }
    .dn-desktop-listing-summary a { display: inline-flex; align-items: center; gap: var(--dn-space-2); min-height: 36px; padding: var(--dn-space-2) var(--dn-space-3); border-radius: var(--dn-pill); background: var(--dn-white); color: var(--dn-ink); }
    .dn-desktop-listing-summary a.dn-desktop-listing-summary__clear { background: transparent; color: var(--dn-muted); }
    button:focus-visible, summary:focus-visible, a:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: 3px; }
  }
</style>
