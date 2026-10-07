<script lang="ts">
  import { onDestroy, tick, untrack } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import { resolve } from '$app/paths';
  import { getI18n } from '$lib/locale/context';
  import { containDialogTab } from '$lib/locale/focus';
  import { preserveScrollOffset } from '$lib/ui/overlay';
  import { dialogViewport } from '$lib/ui/dialog-viewport';
  import { overlayContentHeight } from '$lib/ui/overlay-content';
  import { filterListingVehicles, listingParams, listingVehicles, type ListingFilters } from '$data/listing';
  import {
    cleanListingFormData, emptyListingDraft, listingDraftFromFilters, listingDraftHasFilters,
    listingDraftFacetActive, listingFilterGroups, listingFacetSummary, listingFacetTitle,
    listingFiltersFromDraft, withListingMake, withListingModel, type ListingDraft, type ListingFacetField
  } from '$data/listing-draft';
  import MobileActionIcon from '$components/layout/MobileActionIcon.svelte';
  import ListingFacetEditor from './ListingFacetEditor.svelte';

  let { filters, open = $bindable(false), returnFocus, focusSearch = false }: {
    filters: ListingFilters; open?: boolean; returnFocus?: HTMLButtonElement; focusSearch?: boolean;
  } = $props();
  const i18n = getI18n();
  let dialog: HTMLDialogElement;
  let heading: HTMLHeadingElement;
  let overview: HTMLDivElement;
  let queryInput: HTMLInputElement;
  let choiceContent = $state<HTMLDivElement>();
  let choiceHeight = $state<number>();
  let releaseOffset: ((restoreScroll?: boolean) => void) | undefined;
  let draft = $state<ListingDraft>(emptyListingDraft());
  let choiceDraft = $state<ListingDraft>(emptyListingDraft());
  let activeField = $state<ListingFacetField>();
  let overviewScroll = 0;
  const attachDialog: Attachment<HTMLDialogElement> = node => { dialog = node; };
  const attachHeading: Attachment<HTMLHeadingElement> = node => { heading = node; };
  const attachOverview: Attachment<HTMLDivElement> = node => { overview = node; };
  const attachQuery: Attachment<HTMLInputElement> = node => { queryInput = node; };
  const draftFilters = $derived(listingFiltersFromDraft(draft));
  const count = $derived(filterListingVehicles(listingVehicles, draftFilters, i18n.locale).length);
  const entries = $derived([...listingParams(draftFilters)].filter(([key]) => key !== 'q'));
  const hasFilters = $derived(listingDraftHasFilters(draft));
  const title = $derived(activeField ? listingFacetTitle(activeField, i18n.locale) : i18n.t('m_546ebb8eb993'));
  const needsSave = $derived(activeField === 'make' || activeField === 'model' || activeField === 'price' || activeField === 'year' || activeField === 'mileage_max' || activeField === 'equipment');
  const fields = $derived(listingFilterGroups.flatMap(group => group.fields).map(field => {
    const active = listingDraftFacetActive(draft, field);
    const range = field === 'price' || field === 'year' || field === 'mileage_max';
    return { field, active, value: active || field === 'equipment' ? listingFacetSummary(field, draft, i18n.locale)
      : i18n.t(range ? 'inventory.range.unlimited' : 'm_a52ace420f21') };
  }));
  const invalidChoice = $derived(activeField === 'price'
    ? Boolean(choiceDraft.priceMin && choiceDraft.priceMax && Number(choiceDraft.priceMin) > Number(choiceDraft.priceMax))
    : activeField === 'year' && Boolean(choiceDraft.yearMin && choiceDraft.yearMax && Number(choiceDraft.yearMin) > Number(choiceDraft.yearMax)));

  $effect(() => {
    if (!dialog) return;
    if (open && !dialog.open) {
      draft = listingDraftFromFilters(untrack(() => filters));
      activeField = undefined;
      releaseOffset = preserveScrollOffset('--dn-dialog-scroll-offset');
      dialog.showModal();
      (focusSearch ? queryInput : heading).focus({ preventScroll: true });
    } else if (!open && dialog.open) dialog.close();
  });
  onDestroy(() => { releaseOffset?.(false); open = false; });

  async function chooseField(field: ListingFacetField) {
    overviewScroll = overview.scrollTop;
    choiceDraft = { ...draft, make: [...draft.make], model: [...draft.model], equipment: [...draft.equipment] };
    choiceHeight = undefined;
    activeField = field;
    await tick();
    if (!dialog?.open || activeField !== field) return;
    if (choiceContent) {
      choiceHeight = overlayContentHeight(choiceContent);
      await tick();
      if (!dialog?.open || activeField !== field) return;
      // Removing an opening scrollbar can give wrapped controls more room.
      choiceHeight = choiceContent ? overlayContentHeight(choiceContent) : undefined;
    }
    heading.focus({ preventScroll: true });
  }
  async function back() {
    const field = activeField;
    activeField = undefined;
    await tick();
    if (!dialog?.open || activeField || !overview?.isConnected) return;
    overview.scrollTop = overviewScroll;
    overview.querySelector<HTMLButtonElement>(`button[data-field="${field}"]`)?.focus({ preventScroll: true });
  }
  function saveChoice() {
    if (invalidChoice || !dialog.querySelector('form')?.reportValidity()) return;
    draft = choiceDraft;
    void back();
  }
  function close() { dialog.close(); }
  function resetFilters() {
    draft = emptyListingDraft(filters.sort);
    heading.focus({ preventScroll: true });
  }
  function restore() { open = false; releaseOffset?.(); releaseOffset = undefined; returnFocus?.focus({ preventScroll: true }); }
  function cancel(event: Event) { event.preventDefault(); if (activeField) void back(); else close(); }
  function keydown(event: KeyboardEvent) {
    containDialogTab(event, event.currentTarget as HTMLDialogElement);
    if (event.key === 'Escape') { event.preventDefault(); if (activeField) void back(); else close(); }
  }
  function submit(event: SubmitEvent) {
    if (activeField) { event.preventDefault(); saveChoice(); }
    else close();
  }
  function clearChoice() {
    const empty = emptyListingDraft();
    if (activeField === 'price') { choiceDraft.priceMin = ''; choiceDraft.priceMax = ''; }
    else if (activeField === 'year') { choiceDraft.yearMin = ''; choiceDraft.yearMax = ''; }
    else if (activeField === 'mileage_max') choiceDraft.mileageMax = '';
    else if (activeField === 'equipment') choiceDraft.equipment = empty.equipment;
    else if (activeField === 'make') choiceDraft = withListingMake(choiceDraft, []);
    else if (activeField === 'model') choiceDraft = withListingModel(choiceDraft, []);
  }
</script>

<dialog id="dn-listing-filter-dialog" class="dn-listing-filter__dialog dn-mobile-listing-filters" {@attach attachDialog} {@attach dialogViewport}
  aria-labelledby="dn-listing-filter-title" onkeydown={keydown} oncancel={cancel} onclose={restore}
  onclick={event => { if (event.target === event.currentTarget) close(); }}>
  <form class="dn-listing-filter__dialog-panel" method="GET" action={i18n.href(resolve('/listing-grid'))} onsubmit={submit} onformdata={event => cleanListingFormData(event.formData)}>
    <header class="dn-listing-filter__dialog-header dn-mobile-overlay-header dn-mobile-filter-header" class:editing={Boolean(activeField)}>
      {#if activeField}
        <button class="back dn-icon-button" type="button" aria-label={i18n.t('m_a779c56e526e')} onclick={back}><MobileActionIcon name="back" size={20} /></button>
      {:else}
        <button class="reset dn-listing-filter__clear dn-icon-button" type="button" aria-label={i18n.t('action.clearShort')} title={i18n.t('action.clearShort')} disabled={!hasFilters} onclick={resetFilters}><MobileActionIcon name="reset" size={22} /></button>
      {/if}
      <h2 id="dn-listing-filter-title" tabindex="-1" {@attach attachHeading}>{title}</h2>
      <button class="dn-listing-filter__close dn-icon-button dn-overlay-close" type="button" aria-label={i18n.t('m_2b3fff4a027c')} onclick={close}><MobileActionIcon name="close" size={20} /></button>
    </header>
    {#if activeField}
      <div class="dn-mobile-filter-editor" data-field={activeField} style:--dn-picker-content-height={choiceHeight ? `${choiceHeight}px` : undefined}>
        {#key activeField}<ListingFacetEditor field={activeField} bind:draft={choiceDraft} bind:contentElement={choiceContent} onChoose={saveChoice} />{/key}
      </div>
      {#if needsSave}
        <footer class="dn-mobile-overlay-footer dn-mobile-filter-editor-footer">
          <button class="clear" type="button" onclick={clearChoice}>{i18n.t('action.clearShort')}</button>
          <button class="dn-mobile-overlay-action" type="submit" disabled={invalidChoice}>{i18n.t('m_1509f561f241')}</button>
        </footer>
      {/if}
    {:else}
      <div class="overview" {@attach attachOverview}>
        <div class="search-field dn-mobile-overlay-search" role="search">
          <MobileActionIcon name="search" size={18} />
          <label class="dn-sr-only" for="dn-listing-dialog-query">{i18n.t('m_0ae7a3ecbc83')}</label>
          <input id="dn-listing-dialog-query" {@attach attachQuery} {@attach i18n.validation} type="search" name="q" bind:value={draft.q} placeholder={i18n.t('m_cb8bed4ff8b8')} autocomplete="off" />
          {#if draft.q}<button class="clear-search dn-icon-button" type="button" aria-label={i18n.t('m_c8191190a026')} onclick={() => { draft.q = ''; queryInput.focus(); }}><MobileActionIcon name="close" size={18} /></button>{/if}
        </div>
        <div class="dn-mobile-filter-fields">
          {#each fields as item (item.field)}
            <button class="field-row dn-mobile-overlay-row" data-field={item.field} data-active={item.active} type="button" onclick={() => chooseField(item.field)}>
              <strong>{listingFacetTitle(item.field, i18n.locale)}</strong><span data-active={item.active}>{item.value}</span><MobileActionIcon name="arrow" size={18} />
            </button>
          {/each}
        </div>
      </div>
      <footer class="dn-listing-filter__dialog-footer dn-mobile-overlay-footer">
        <button class="dn-listing-filter__dialog-submit dn-mobile-overlay-action" type="submit" disabled={count === 0} aria-live="polite" aria-label={count === 1 ? i18n.t('m_047e325f6562') : i18n.t('m_08d2ff28407e', { p0: count })}><span class="dn-listing-filter__submit-compact">{count === 1 ? i18n.t('m_047e325f6562') : i18n.t('m_08d2ff28407e', { p0: count })}</span></button>
      </footer>
    {/if}
    {#each entries as [name, value], index (`${name}-${index}`)}<input type="hidden" {name} {value} />{/each}
  </form>
</dialog>

<style>
  :global(body:has(.dn-mobile-listing-filters[open])) { position: fixed; top: var(--dn-dialog-scroll-offset, 0); right: 0; left: 0; overflow: hidden; }
  .dn-mobile-listing-filters { --dn-primary-action-surface: var(--dn-ink); --dn-primary-action-surface-hover: var(--dn-ink-hover); position: fixed; inset: var(--dn-dialog-viewport-top, 0px) 0 auto; width: 100%; max-width: none; height: var(--dn-dialog-viewport-height, 100dvh); max-height: var(--dn-dialog-viewport-height, 100dvh); margin: 0; padding: 0; border: 0; background: transparent; color: var(--dn-ink); overflow: hidden; }
  .dn-mobile-listing-filters[open] { display: flex; flex-direction: column; justify-content: flex-end; }
  .dn-mobile-listing-filters::backdrop { background: rgb(8 10 14 / .35); }
  form { display: flex; flex-direction: column; min-height: 0; max-height: calc(var(--dn-dialog-viewport-height, 100dvh) - max(var(--dn-space-6), env(safe-area-inset-top, 0px))); margin: 0; overflow: hidden; border-radius: var(--dn-radius-sheet) var(--dn-radius-sheet) 0 0; background: var(--dn-white); }
  h2:focus { outline: none; }
  .dn-listing-filter__close { background: var(--dn-home-panel); }
  .back, .reset { border: 0; border-radius: var(--dn-pill); background: var(--dn-home-panel); color: var(--dn-ink); cursor: pointer; }
  .reset:disabled { opacity: .5; cursor: default; }
  .overview { min-height: 0; padding: 0 var(--dn-overlay-gutter) var(--dn-space-1); overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; }
  .search-field { margin-bottom: var(--dn-space-2); }
  .search-field input::-webkit-search-cancel-button { display: none; }
  .clear-search { border: 0; border-radius: var(--dn-pill); background: transparent; color: var(--dn-ink); }
  .dn-mobile-filter-fields { display: grid; gap: var(--dn-mobile-filter-control-gap); }
  .field-row strong { min-width: 0; max-width: 45%; font: inherit; overflow-wrap: anywhere; }
  .field-row > span { flex: 1; min-width: 0; color: var(--dn-muted); text-align: right; overflow-wrap: anywhere; }
  .field-row > span[data-active=true] { color: var(--dn-ink); }
  .field-row :global(svg) { flex: none; color: var(--dn-muted); }
  .dn-mobile-filter-editor { display: flex; flex-direction: column; min-height: 0; padding-bottom: max(var(--dn-space-3), env(safe-area-inset-bottom, 0px)); }
  .dn-mobile-filter-editor:has(+ footer) { padding-bottom: 0; }
  footer { border-top: 1px solid var(--dn-line); }
  .clear { display: inline-flex; min-height: var(--dn-control-hit-height); flex: 0 0 auto; align-items: center; justify-content: center; padding: 0 var(--dn-space-2); border: 0; background: transparent; color: var(--dn-ink); font: var(--dn-overlay-option-font); cursor: pointer; }
  .clear:disabled { color: var(--dn-muted); cursor: default; }
  .back:active, .clear:enabled:active { background: var(--dn-surface-hover); }
  button:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  @media (hover: hover) and (pointer: fine) { .field-row:hover, .clear:enabled:hover, .back:hover { background: var(--dn-surface-hover); } }
  @media (prefers-reduced-motion: no-preference) {
    .dn-mobile-listing-filters[open] form { animation: sheet-enter 180ms cubic-bezier(.16, 1, .3, 1); }
    @keyframes sheet-enter { from { transform: translateY(24px); } to { transform: translateY(0); } }
  }
</style>
