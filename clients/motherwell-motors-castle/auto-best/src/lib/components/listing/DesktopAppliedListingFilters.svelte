<script lang="ts">
  import { Dialog } from 'bits-ui';
  import { tick } from 'svelte';
  import { MediaQuery } from 'svelte/reactivity';
  import type { Attachment } from 'svelte/attachments';
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { getI18n } from '$lib/locale/context';
  import { listingParams, removeListingFilter, type ListingFilters } from '$data/listing';
  import { listingAppliedFilterLabel, emptyListingDraft, listingFiltersFromDraft } from '$data/listing-draft';
  import Icon from '$components/ui/Icon.svelte';

  let { filters }: { filters: ListingFilters } = $props();
  const i18n = getI18n();
  const desktop = new MediaQuery('(min-width: 992px)', false);
  const spacious = new MediaQuery('(min-width: 1200px)', false);
  let reviewOpen = $state(false);
  let updating = $state(false);
  let summary: HTMLDivElement;
  let reviewList: HTMLDivElement;
  let reviewTrigger = $state<HTMLButtonElement | null>(null);
  let reviewTitle = $state<HTMLDivElement | null>(null);
  let portalTarget = $state<HTMLElement>();
  const attachSummary: Attachment<HTMLDivElement> = node => { summary = node; portalTarget = node.closest<HTMLElement>('.dn-app-shell') ?? undefined; };
  const attachReviewList: Attachment<HTMLDivElement> = node => { reviewList = node; };
  const chips = $derived([...listingParams(filters)].filter(([key]) => key !== 'sort').map(([key, value]) => {
    const search = removeListingFilter(filters, key, value).toString();
    const href: '/cars' | `/cars?${string}` = search ? `/cars?${search}` : '/cars';
    const label = key === 'q' ? `${i18n.t('m_49c266baaaa7')}: ${value}` : listingAppliedFilterLabel(filters, key, value, i18n.locale);
    return { id: `${key}:${value}`, label, href };
  }));
  const visibleChips = $derived(chips.slice(0, spacious.current ? 2 : 1));
  const hiddenCount = $derived(chips.length - visibleChips.length);
  const clearHref = $derived.by(() => {
    const search = listingParams(listingFiltersFromDraft(emptyListingDraft(filters.sort))).toString();
    const href: '/cars' | `/cars?${string}` = search ? `/cars?${search}` : '/cars';
    return href;
  });
  $effect(() => { if (!desktop.current) reviewOpen = false; });

  function restoreFocus(event: Event) {
    event.preventDefault();
    const target = reviewTrigger?.isConnected ? reviewTrigger
      : summary.closest('.dn-listing-results__tools')?.querySelector<HTMLButtonElement>('.dn-listing-results__filters');
    target?.focus({ preventScroll: true });
  }

  async function updateFilters(event: MouseEvent, href: typeof clearHref, index = 0) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (updating) return;
    updating = true;
    try {
      await goto(i18n.href(resolve(href)), { noScroll: true, keepFocus: true });
      await tick();
      if (reviewOpen) {
        const links = reviewList.querySelectorAll<HTMLAnchorElement>('.filter-chip');
        (links[index] ?? links[links.length - 1] ?? reviewTitle)?.focus({ preventScroll: true });
      }
    } finally { updating = false; }
  }
</script>

{#snippet filterLink(chip: typeof chips[number], index?: number)}
  <a class="filter-chip" href={i18n.href(resolve(chip.href))} title={chip.label} aria-label={i18n.t('m_ef5e8d630d53', { p0: chip.label })} aria-disabled={index !== undefined && updating || undefined} onclick={index === undefined ? undefined : event => updateFilters(event, chip.href, index)}><span>{chip.label}</span><Icon name="x" size={14} /></a>
{/snippet}

<div class="filter-summary" {@attach attachSummary}>
  <Dialog.Root bind:open={reviewOpen}>
  {#if chips.length}
    <nav class="filter-summary__filters" aria-label={i18n.t('inventory.modal.applied')}>
      <div class="filter-rail">{#each visibleChips as chip (chip.id)}{@render filterLink(chip)}{/each}</div>
      {#if hiddenCount}
        <Dialog.Trigger bind:ref={reviewTrigger} class="dn-applied-review" aria-label={`${i18n.t('inventory.applied.more', { count: hiddenCount })} · ${i18n.t('inventory.modal.applied')}: ${chips.length}`}>{i18n.t('inventory.applied.more', { count: hiddenCount })}</Dialog.Trigger>
      {/if}
      <a class="clear-filters" href={i18n.href(resolve(clearHref))}>{i18n.t('action.clearShort')}</a>
    </nav>
  {/if}
  <Dialog.Portal to={portalTarget}>
    <Dialog.Overlay class="dn-applied-backdrop" />
    <Dialog.Content class="dn-applied-dialog" onCloseAutoFocus={restoreFocus} onOpenAutoFocus={event => { event.preventDefault(); reviewTitle?.focus({ preventScroll: true }); }}>
      <header class="review-heading">
        <Dialog.Title bind:ref={reviewTitle} class="dn-applied-title" tabindex={-1}>{i18n.t('inventory.modal.applied')} <small>{chips.length}</small></Dialog.Title>
        <Dialog.Close class="dn-applied-close" aria-label={i18n.t('m_84305a580997')}><Icon name="x" size={20} /></Dialog.Close>
      </header>
      <Dialog.Description class="dn-sr-only">{i18n.t('inventory.applied.reviewHint')}</Dialog.Description>
      <div class="review-links" {@attach attachReviewList} aria-busy={updating || undefined}>
        {#each chips as chip, index (chip.id)}{@render filterLink(chip, index)}{:else}<p class="review-empty" role="status">{i18n.t('inventory.applied.empty')}</p>{/each}
      </div>
      <footer class="review-footer">
        <a class="review-clear" href={i18n.href(resolve(clearHref))} aria-disabled={!chips.length || updating || undefined} onclick={event => { if (!chips.length) event.preventDefault(); else void updateFilters(event, clearHref); }}>{i18n.t('inventory.search.clearAll')}</a>
        <Dialog.Close class="dn-applied-done">{i18n.t('action.done')}</Dialog.Close>
      </footer>
    </Dialog.Content>
  </Dialog.Portal>
  </Dialog.Root>
</div>

<style>
  .filter-summary { display: none; flex: 0 1 auto; min-width: 0; }
  @media (min-width: 992px) { .filter-summary { display: flex; align-items: center; } }
  .filter-summary__filters { display: flex; align-items: center; gap: var(--dn-space-2); min-width: 0; }
  .filter-rail { display: flex; align-items: center; gap: var(--dn-space-2); min-width: 0; padding-block: var(--dn-space-half); }
  .filter-chip { display: inline-flex; flex: 0 1 auto; align-items: center; gap: var(--dn-space-2); min-width: 0; min-height: var(--dn-control-height-compact); max-width: 180px; padding: 0 var(--dn-space-3); border: 1px solid var(--dn-line); border-radius: var(--dn-pill); background: var(--dn-white); color: var(--dn-ink); font: var(--dn-control-font); text-decoration: none; white-space: nowrap; }
  .filter-chip span { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
  .filter-chip:hover { background: var(--dn-surface-subtle); border-color: var(--dn-line-strong); }
  .filter-chip :global(svg) { flex: none; }
  .clear-filters, .review-clear { flex: none; display: inline-flex; align-items: center; min-height: var(--dn-control-height-default); padding-inline: var(--dn-space-2); border-radius: var(--dn-radius-sm); color: var(--dn-muted); font: var(--dn-control-font); text-decoration: underline; text-underline-offset: 3px; }
  .clear-filters:hover, .review-clear:hover { color: var(--dn-ink); }
  a:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  :global(.dn-applied-review) { display: inline-flex; flex: none; align-items: center; justify-content: center; min-height: var(--dn-control-height-default); padding: 0 var(--dn-space-3); border: 1px solid var(--dn-line); border-radius: var(--dn-pill); background: var(--dn-white); color: var(--dn-ink); font: var(--dn-control-font); cursor: pointer; white-space: nowrap; }
  :global(.dn-applied-review:hover) { background: var(--dn-surface-subtle); }
  :global(.dn-applied-review:focus-visible) { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  :global(.dn-applied-backdrop) { position: fixed; inset: 0; z-index: 11010; background: rgb(0 0 0 / 40%); }
  :global(.dn-applied-dialog) { position: fixed; top: 50%; left: 50%; z-index: 11011; display: flex; flex-direction: column; width: min(560px, calc(100vw - 64px)); max-height: calc(100dvh - 64px); transform: translate(-50%, -50%); overflow: hidden; border: 1px solid var(--dn-line); border-radius: var(--dn-radius-lg); background: var(--dn-white); color: var(--dn-ink); box-shadow: var(--dn-shadow); }
  .review-heading { display: flex; flex: none; align-items: center; justify-content: space-between; gap: var(--dn-space-3); padding: var(--dn-space-4) var(--dn-space-5); }
  :global(.dn-applied-title) { display: flex; align-items: center; gap: var(--dn-space-2); margin: 0; font-size: var(--dn-text-card); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-control); outline: none; }
  :global(.dn-applied-title) small { display: grid; place-items: center; min-width: 24px; height: 24px; padding-inline: var(--dn-space-1); border-radius: var(--dn-pill); background: var(--dn-surface-subtle); color: var(--dn-muted); font-size: var(--dn-text-meta); font-weight: var(--dn-weight-medium); font-variant-numeric: tabular-nums; }
  :global(.dn-applied-close) { display: grid; flex: none; place-items: center; width: var(--dn-control-height-default); height: var(--dn-control-height-default); padding: 0; border: 1px solid var(--dn-line); border-radius: var(--dn-pill); background: var(--dn-white); color: var(--dn-ink); cursor: pointer; }
  :global(.dn-applied-close:hover) { background: var(--dn-surface-subtle); }
  :global(.dn-applied-close:focus-visible), :global(.dn-applied-done:focus-visible) { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  .review-links { display: flex; flex-wrap: wrap; align-content: start; gap: var(--dn-space-2); min-height: 0; padding: 0 var(--dn-space-5) var(--dn-space-5); overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; }
  .review-links .filter-chip { flex: none; min-height: var(--dn-control-height-default); max-width: 100%; white-space: normal; }
  .review-links .filter-chip span { overflow: visible; overflow-wrap: anywhere; }
  .review-links [aria-disabled=true] { pointer-events: none; }
  .review-empty { margin: 0; color: var(--dn-muted); font: var(--dn-body-font); }
  .review-footer { display: flex; flex: none; align-items: center; justify-content: space-between; gap: var(--dn-space-3); padding: var(--dn-space-3) var(--dn-space-5); border-top: 1px solid var(--dn-line); }
  .review-clear[aria-disabled=true] { opacity: .5; cursor: default; }
  :global(.dn-applied-done) { min-height: var(--dn-control-height-default); padding: 0 var(--dn-space-5); border: 0; border-radius: var(--dn-pill); background: var(--dn-ink); color: var(--dn-white); font: var(--dn-control-font); cursor: pointer; }
  :global(.dn-applied-done:hover) { background: var(--dn-ink-hover); }
</style>
