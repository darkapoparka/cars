<script lang="ts">
  import { Popover } from 'bits-ui';
  import type { Attachment } from 'svelte/attachments';
  import { resolve } from '$app/paths';
  import { getI18n } from '$lib/locale/context';
  import { listingParams, removeListingFilter, type ListingFilters } from '$data/listing';
  import { listingAppliedFilterLabel, emptyListingDraft, listingFiltersFromDraft } from '$data/listing-draft';
  import Icon from '$components/ui/Icon.svelte';

  let { filters }: { filters: ListingFilters } = $props();
  const i18n = getI18n();
  let overflowing = $state(false);
  let reviewOpen = $state(false);
  const chips = $derived([...listingParams(filters)].filter(([key]) => key !== 'sort').map(([key, value]) => {
    const search = removeListingFilter(filters, key, value).toString();
    const href: '/cars' | `/cars?${string}` = search ? `/cars?${search}` : '/cars';
    const label = key === 'q' ? `${i18n.t('m_49c266baaaa7')}: ${value}` : listingAppliedFilterLabel(filters, key, value, i18n.locale);
    return { id: `${key}:${value}`, label, href };
  }));
  const clearHref = $derived.by(() => {
    const search = listingParams(listingFiltersFromDraft(emptyListingDraft(filters.sort))).toString();
    const href: '/cars' | `/cars?${string}` = search ? `/cars?${search}` : '/cars';
    return href;
  });
  const observeRail: Attachment<HTMLDivElement> = node => {
    const measure = () => { overflowing = node.scrollWidth > node.clientWidth + 1; };
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    const content = node.firstElementChild;
    if (content) observer.observe(content);
    return () => observer.disconnect();
  };
</script>

{#snippet filterLink(chip: typeof chips[number])}
  <a class="filter-chip" href={i18n.href(resolve(chip.href))} title={chip.label} aria-label={i18n.t('m_ef5e8d630d53', { p0: chip.label })} onclick={() => reviewOpen = false}><span>{chip.label}</span><Icon name="x" size={14} /></a>
{/snippet}

<div class="filter-summary">
  {#if chips.length}
    <nav class="filter-summary__filters" aria-label={i18n.t('inventory.modal.applied')}>
      <div class="filter-rail" {@attach observeRail}><div class="filter-rail__content">{#each chips as chip (chip.id)}{@render filterLink(chip)}{/each}</div></div>
      {#if overflowing}
        <Popover.Root bind:open={reviewOpen}>
          <Popover.Trigger class="dn-applied-review" aria-label={`${i18n.t('inventory.modal.applied')}: ${chips.length}`}>{i18n.t('inventory.applied.all', { count: chips.length })}<Icon name="chevron-down" size={14} /></Popover.Trigger>
          <Popover.Portal>
            <Popover.Content class="dn-applied-popover" role="dialog" aria-label={i18n.t('inventory.modal.applied')} sideOffset={8} align="start" collisionPadding={16}>
              <h2>{i18n.t('inventory.modal.applied')} <small>{chips.length}</small></h2>
              <div class="review-links">{#each chips as chip (chip.id)}{@render filterLink(chip)}{/each}</div>
              <a class="review-clear" href={i18n.href(resolve(clearHref))} onclick={() => reviewOpen = false}>{i18n.t('inventory.search.clearAll')}</a>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      {/if}
      <a class="clear-filters" href={i18n.href(resolve(clearHref))}>{i18n.t('action.clearShort')}</a>
    </nav>
  {/if}
</div>

<style>
  .filter-summary { display: none; min-width: 0; }
  @media (min-width: 992px) { .filter-summary { display: flex; align-items: center; } }
  .filter-summary__filters { display: flex; align-items: center; gap: var(--dn-space-2); width: 100%; min-width: 0; }
  .filter-rail { flex: 0 1 auto; min-width: 0; padding-block: var(--dn-space-half); overflow-x: auto; scrollbar-width: none; }
  .filter-rail__content { display: flex; gap: var(--dn-space-2); width: max-content; }
  .filter-chip { display: inline-flex; flex: none; align-items: center; gap: var(--dn-space-2); min-height: var(--dn-control-height-compact); max-width: 240px; padding: 0 var(--dn-space-3); border: 1px solid var(--dn-line); border-radius: var(--dn-pill); background: var(--dn-white); color: var(--dn-ink); font: var(--dn-control-font); text-decoration: none; white-space: nowrap; }
  .filter-chip span { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
  .filter-chip:hover { background: var(--dn-surface-subtle); border-color: var(--dn-line-strong); }
  .filter-chip :global(svg) { flex: none; }
  .clear-filters, .review-clear { flex: none; display: inline-flex; align-items: center; min-height: var(--dn-control-height-default); padding-inline: var(--dn-space-2); border-radius: var(--dn-radius-sm); color: var(--dn-muted); font: var(--dn-control-font); text-decoration: underline; text-underline-offset: 3px; }
  .clear-filters:hover, .review-clear:hover { color: var(--dn-ink); }
  a:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  :global(.dn-applied-review) { display: inline-flex; flex: none; align-items: center; gap: var(--dn-space-1); min-height: var(--dn-control-height-default); padding: 0 var(--dn-space-3); border: 1px solid var(--dn-line); border-radius: var(--dn-pill); background: var(--dn-white); color: var(--dn-ink); font: var(--dn-control-font); cursor: pointer; white-space: nowrap; }
  :global(.dn-applied-review:hover) { background: var(--dn-surface-subtle); }
  :global(.dn-applied-review:focus-visible) { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  :global(.dn-applied-popover) { z-index: 80; width: min(560px, calc(100vw - 32px)); max-height: min(360px, calc(100dvh - 48px)); padding: var(--dn-space-5); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-lg); background: var(--dn-white); color: var(--dn-ink); box-shadow: 0 12px 36px rgb(0 0 0 / 12%); overflow-y: auto; overscroll-behavior: contain; }
  h2 { display: flex; align-items: center; gap: var(--dn-space-2); margin: 0 0 var(--dn-space-4); font-size: var(--dn-text-body); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-control); }
  h2 small { color: var(--dn-muted); font-size: var(--dn-text-meta); font-weight: var(--dn-weight-medium); }
  .review-links { display: flex; flex-wrap: wrap; gap: var(--dn-space-2); }
  .review-links .filter-chip { max-width: 100%; white-space: normal; }
  .review-links .filter-chip span { overflow: visible; overflow-wrap: anywhere; }
  .review-clear { margin-top: var(--dn-space-3); }
</style>
