<script lang="ts">
  import { onDestroy, tick, untrack, type Snippet } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import { resolve } from '$app/paths';
  import { getI18n } from '$lib/locale/context';
  import { templateMessage } from '$lib/i18n/presentation';
  import { vehicleCount } from '$lib/locale/messages';
  import { containDialogTab } from '$lib/locale/focus';
  import { lockPageScroll } from '$lib/ui/overlay';
  import {
    filterListingVehicles, listingParams, listingVehicles, parseListingFilters,
    removeListingFilter, type ListingFilters
  } from '$data/listing';
  import {
    emptyListingDraft, listingAppliedFilterLabel, listingDraftFacetActive,
    listingDraftFromFilters, listingDraftHasFilters, listingFacetTitle,
    listingFiltersFromDraft, withListingMake, withListingModel,
    type ListingDraft, type ListingFacetField
  } from '$data/listing-draft';
  import Icon from '$components/ui/Icon.svelte';
  import FilterCloseButton from './FilterCloseButton.svelte';
  import ListingFacetEditor from './ListingFacetEditor.svelte';
  import type { PickerNavigation } from './FilterPopoverHeader.svelte';

  let { filters, open = $bindable(false), returnFocus, focusSearch = false }: {
    filters: ListingFilters; open?: boolean; returnFocus?: HTMLButtonElement; focusSearch?: boolean;
  } = $props();
  const i18n = getI18n();
  // Same frame and grouped navigation as App, with Auto Best's supported facets.
  const groups = [
    { label: 'inventory.modal.vehicle', fields: ['make', 'model', 'body', 'year', 'mileage_max'] },
    { label: 'inventory.modal.price', fields: ['price'] },
    { label: 'inventory.modal.details', fields: ['type', 'fuel', 'transmission', 'condition', 'version', 'equipment'] }
  ] as const;
  let dialog: HTMLDialogElement;
  let heading: HTMLHeadingElement;
  let queryInput: HTMLInputElement;
  let navigation: HTMLElement;
  let draft = $state<ListingDraft>(emptyListingDraft());
  let active = $state<ListingFacetField | 'search'>('make');
  let modelMakes = $state<string[]>();
  let revision = $state(0);
  let releaseScroll: (() => void) | undefined;
  let destroyed = false;
  const attachDialog: Attachment<HTMLDialogElement> = node => { dialog = node; };
  const attachHeading: Attachment<HTMLHeadingElement> = node => { heading = node; };
  const attachQuery: Attachment<HTMLInputElement> = node => { queryInput = node; };
  const attachNavigation: Attachment<HTMLElement> = node => { navigation = node; };
  const draftFilters = $derived(listingFiltersFromDraft(draft));
  const count = $derived(filterListingVehicles(listingVehicles, draftFilters, i18n.locale).length);
  const hasFilters = $derived(listingDraftHasFilters(draft));
  const title = $derived(active === 'search' ? i18n.t('m_49c266baaaa7') : listingFacetTitle(active, i18n.locale));
  const selections = (field: ListingFacetField) => field === 'make' || field === 'model' || field === 'equipment'
    ? draft[field].length : Number(listingDraftFacetActive(draft, field));
  const activeCount = $derived(active === 'search' ? Number(Boolean(draft.q)) : selections(active));
  const invalidRange = $derived(Boolean(
    draft.priceMin && draft.priceMax && Number(draft.priceMin) > Number(draft.priceMax)
    || draft.yearMin && draft.yearMax && Number(draft.yearMin) > Number(draft.yearMax)
  ));
  const invalidNumbers = $derived([
    [draft.priceMin, 0, Infinity], [draft.priceMax, 0, Infinity],
    [draft.yearMin, 1900, new Date().getFullYear() + 1], [draft.yearMax, 1900, new Date().getFullYear() + 1],
    [draft.mileageMax, 0, Infinity]
  ].some(([value, minimum, maximum]) => value !== '' && (!Number.isSafeInteger(Number(value)) || Number(value) < Number(minimum) || Number(value) > Number(maximum))));
  const invalid = $derived(invalidRange || invalidNumbers);
  const chips = $derived([...listingParams(draftFilters)].filter(([key]) => key !== 'sort').map(([key, value]) => ({
    key, value, id: `${key}:${value}`, label: key === 'q' ? `${i18n.t('m_49c266baaaa7')}: ${value}` : listingAppliedFilterLabel(draftFilters, key, value, i18n.locale)
  })));

  $effect(() => {
    if (open) untrack(() => {
      draft = listingDraftFromFilters(filters);
      active = focusSearch ? 'search' : 'make';
      modelMakes = undefined;
      revision += 1;
      releaseScroll = lockPageScroll();
      dialog.showModal();
      navigation.scrollTop = 0;
      void tick().then(() => {
        if (!destroyed && dialog.open) (focusSearch ? queryInput : heading)?.focus({ preventScroll: true });
      });
    });
    else if (dialog?.open) dialog.close();
  });
  onDestroy(() => { destroyed = true; releaseScroll?.(); });

  function close() {
    open = false;
    dialog.close();
    releaseScroll?.();
    releaseScroll = undefined;
  }
  function restore() {
    if (dialog.open) return;
    open = false;
    releaseScroll?.();
    releaseScroll = undefined;
    void tick().then(() => { if (!destroyed && !open && returnFocus?.isConnected) returnFocus.focus({ preventScroll: true }); });
  }
  function select(field: typeof active, makes?: string[]) {
    active = field;
    modelMakes = makes;
    void tick().then(() => { if (!destroyed && dialog.open && field === 'search') queryInput?.focus({ preventScroll: true }); });
  }
  function clearActive() {
    if (active === 'search') draft.q = '';
    else if (active === 'make') draft = withListingMake(draft, []);
    else if (active === 'model') draft = withListingModel(draft, []);
    else if (active === 'price') { draft.priceMin = ''; draft.priceMax = ''; }
    else if (active === 'year') { draft.yearMin = ''; draft.yearMax = ''; }
    else if (active === 'mileage_max') draft.mileageMax = '';
    else if (active === 'equipment') draft.equipment = [];
    else if (active === 'sort') draft.sort = 'default';
    else draft[active] = '';
    revision += 1;
  }
  function reset() {
    draft = emptyListingDraft(filters.sort);
    modelMakes = undefined;
    revision += 1;
    heading.focus({ preventScroll: true });
  }
  function removeChip(event: MouseEvent, key: string, value: string) {
    const button = event.currentTarget as HTMLButtonElement;
    const sibling = button.nextElementSibling ?? button.previousElementSibling;
    draft = listingDraftFromFilters(parseListingFilters(removeListingFilter(draftFilters, key, value)));
    void tick().then(() => { if (!destroyed && dialog.open) (sibling instanceof HTMLElement && sibling.isConnected ? sibling : heading).focus({ preventScroll: true }); });
  }
  function submit(event: SubmitEvent) {
    if (invalid) { event.preventDefault(); return; }
    close();
  }
  function formData(event: FormDataEvent) {
    // The complete draft owns GET data even when only one editor is mounted.
    for (const key of [...event.formData.keys()]) event.formData.delete(key);
    for (const [key, value] of listingParams(draftFilters)) event.formData.append(key, value);
  }
</script>

{#snippet editorHeader(search: Snippet | undefined, navigation: PickerNavigation | undefined)}
  {#if navigation || modelMakes}
    <div class="model-navigation">
      {#if navigation?.back || modelMakes}
        <button type="button" onclick={navigation?.back ?? (() => select('make'))} {@attach navigation?.attachBack} aria-label={`${i18n.t('m_76900f1bfd16')}: ${navigation?.label ?? modelMakes?.[0]}`}><Icon name="arrow-left" size={16} /><span>{navigation?.label ?? modelMakes?.[0]}</span></button>
      {:else}<span>{navigation?.label}</span>{/if}
    </div>
  {/if}
  {#if search}<div class="editor-search">{@render search()}</div>{/if}
{/snippet}

<dialog id="dn-listing-filter-dialog" class="dn-desktop-filter-dialog" {@attach attachDialog}
  aria-labelledby="dn-listing-filter-title" onclose={restore}
  oncancel={event => { event.preventDefault(); close(); }}
  onkeydown={event => containDialogTab(event, event.currentTarget)}
  onclick={event => { if (event.target === event.currentTarget) close(); }}>
  <form method="GET" action={i18n.href(resolve('/cars'))} onsubmit={submit} onformdata={formData}>
    <h2 class="dn-sr-only" id="dn-listing-filter-title">{i18n.t('m_546ebb8eb993')}</h2>
    <div class="search-navigation">
      <button type="button" aria-pressed={active === 'search'} aria-controls="dn-desktop-filter-pane" onclick={() => select('search')}><Icon name="search" size={16} /><span>{i18n.t('m_49c266baaaa7')}</span>{#if draft.q}<small>1</small>{/if}</button>
    </div>
    <nav class="filter-navigation" {@attach attachNavigation} aria-label={i18n.t('m_6f8428de4166')}>
      {#each groups as group (group.label)}
        <section aria-label={i18n.t(group.label)}>
          <h3>{i18n.t(group.label)}<span aria-hidden="true"></span></h3>
          <div class="navigation-group">
            {#each group.fields as field (field)}
              <button type="button" data-filter-category={field} aria-pressed={active === field} aria-controls="dn-desktop-filter-pane" onclick={() => select(field)}><span>{listingFacetTitle(field, i18n.locale)}</span>{#if selections(field)}<small aria-label={i18n.t('inventory.modal.selected', { count: selections(field) })}>{selections(field)}</small>{/if}</button>
            {/each}
          </div>
        </section>
      {/each}
    </nav>
    <section id="dn-desktop-filter-pane" class="filter-pane" aria-labelledby="dn-desktop-filter-pane-title">
      <header class="pane-heading">
        <div><h3 id="dn-desktop-filter-pane-title" tabindex="-1" {@attach attachHeading}>{title}{#if activeCount}<small>{i18n.t('inventory.modal.selected', { count: activeCount })}</small>{/if}</h3>{#if active === 'make'}<p>{i18n.t('inventory.modal.makeHelp')}</p>{/if}</div>
        {#if activeCount}<button class="section-clear" type="button" onclick={clearActive}>{i18n.t('inventory.modal.clear')}</button>{/if}
      </header>
      <div class="close-control"><FilterCloseButton aria-label={i18n.t('m_2b3fff4a027c')} onclick={close} /></div>
      {#if active === 'search'}
        <div class="keyword-search"><Icon name="search" size={20} /><input {@attach attachQuery} {@attach i18n.validation} type="search" bind:value={draft.q} aria-label={i18n.t('m_0ae7a3ecbc83')} placeholder={i18n.t('m_cb8bed4ff8b8')} autocomplete="off" />{#if draft.q}<button type="button" aria-label={i18n.t('inventory.search.clearQuery')} onclick={() => { draft.q = ''; queryInput.focus(); }}><Icon name="x" size={16} /></button>{/if}</div>
      {:else}
        {#key `${active}:${revision}`}
          <ListingFacetEditor field={active} bind:draft desktopChoices widePanel filterPanel {modelMakes} header={editorHeader} onModelMake={make => select('model', [make])} />
        {/key}
      {/if}
    </section>
    {#if chips.length}
    <section class="filter-selections" aria-label={i18n.t('inventory.modal.applied')}>
      <h3>{i18n.t('inventory.modal.applied')} <small>{chips.length}</small></h3>
      <div class="applied-filters">
        {#each chips as chip (chip.id)}<button type="button" title={chip.label} aria-label={`${i18n.t('inventory.search.clearFilter')}: ${chip.label}`} onclick={event => removeChip(event, chip.key, chip.value)}><span>{chip.label}</span><Icon name="x" size={14} /></button>{/each}
      </div>
    </section>
    {/if}
    <footer class="filter-footer">
      <button class="clear-all" type="button" disabled={!hasFilters} onclick={reset}>{i18n.t('inventory.search.clearAll')}</button>
      <span class="live-count dn-sr-only" role="status" aria-live="polite" aria-atomic="true">{vehicleCount(i18n.locale, count)}</span>
      <button class="show-results" type="submit" disabled={invalid} aria-label={count === 1 ? i18n.t('m_047e325f6562') : i18n.t('m_08d2ff28407e', { p0: count })}>{templateMessage(i18n, 'Show {p0}', { p0: vehicleCount(i18n.locale, count) })}</button>
      {#if invalid}<p class="range-error" role="alert">{i18n.t(invalidRange ? 'm_8418439e87ac' : 'inventory.modal.invalidNumber')}</p>{/if}
    </footer>
  </form>
</dialog>

<style>
  .dn-desktop-filter-dialog { width: calc(100% - 64px); max-width: 1040px; height: min(780px, calc(100dvh - 64px)); max-height: none; padding: 0; margin: auto; border: 0; border-radius: var(--dn-radius-lg); overflow: hidden; background: var(--dn-surface-subtle); color: var(--dn-ink); box-shadow: 0 24px 80px rgb(0 0 0 / 24%); }
  .dn-desktop-filter-dialog::backdrop { background: rgb(0 0 0 / 40%); }
  form { display: grid; grid-template-columns: 252px minmax(0, 1fr); grid-template-rows: 68px minmax(0, 1fr) auto 72px; height: 100%; }
  button { font-family: var(--dn-font); cursor: pointer; }
  button:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  .search-navigation { display: flex; align-items: center; padding: 0 var(--dn-space-3) 0 var(--dn-space-6); }
  .search-navigation button { display: flex; align-items: center; gap: var(--dn-space-2); width: 100%; min-height: var(--dn-control-height-default); padding: 0 14px; border: 1px solid var(--dn-line); border-radius: var(--dn-radius-sm); background: var(--dn-white); color: var(--dn-ink); font-size: var(--dn-text-meta); text-align: left; }
  .search-navigation button[aria-pressed=true] { background: var(--dn-ink); color: var(--dn-white); }
  .search-navigation small { margin-left: auto; }
  .filter-navigation { grid-column: 1; grid-row: 2; min-height: 0; margin: 0 0 var(--dn-space-3) var(--dn-space-3); padding: var(--dn-space-2) var(--dn-space-3); overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; }
  .filter-navigation h3 { display: flex; align-items: center; gap: var(--dn-space-2); margin: var(--dn-space-2) 10px var(--dn-space-1); color: var(--dn-muted); font-size: var(--dn-text-caption); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-control); letter-spacing: var(--dn-tracking-label); text-transform: uppercase; white-space: nowrap; }
  .filter-navigation h3 span { flex: 1; height: 1px; background: var(--dn-line-strong); }
  .navigation-group { padding: var(--dn-space-1); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-sm); background: var(--dn-white); }
  .navigation-group button { display: flex; align-items: center; justify-content: space-between; gap: var(--dn-space-2); width: 100%; min-height: var(--dn-control-height-compact); padding: var(--dn-space-2) 10px; border: 0; border-radius: var(--dn-radius-xs); background: transparent; color: var(--dn-ink); font-size: var(--dn-text-meta); font-weight: var(--dn-weight-medium); line-height: var(--dn-leading-meta); text-align: left; }
  .navigation-group button:hover { background: var(--dn-surface-hover); }
  .navigation-group button[aria-pressed=true] { background: var(--dn-ink); color: var(--dn-white); font-weight: var(--dn-weight-medium); }
  .navigation-group small, .search-navigation small { display: grid; flex: none; place-items: center; min-width: 18px; height: 18px; padding: 0 var(--dn-space-1); border-radius: calc(var(--dn-radius-xs) - 1px); background: var(--dn-surface-subtle); color: var(--dn-ink); font-size: var(--dn-text-caption); font-variant-numeric: tabular-nums; }
  .filter-pane { position: relative; display: flex; flex-direction: column; grid-column: 2; grid-row: 1 / 3; min-width: 0; min-height: 0; margin: var(--dn-space-3) var(--dn-space-3) var(--dn-space-3) 0; padding: var(--dn-space-5) var(--dn-space-6) 0; border-radius: var(--dn-radius-compact); background: var(--dn-white); }
  .pane-heading { flex: none; display: flex; align-items: start; justify-content: space-between; gap: var(--dn-space-3); min-height: var(--dn-control-height-default); padding-right: 48px; margin-bottom: var(--dn-space-4); }
  .pane-heading h3 { display: flex; align-items: center; flex-wrap: wrap; gap: var(--dn-space-2); margin: 0; font-size: var(--dn-text-subheading); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-control); }
  .pane-heading h3 small { padding: var(--dn-space-1) var(--dn-space-2); border-radius: var(--dn-radius-xs); background: var(--dn-surface-subtle); font-size: var(--dn-text-caption); font-weight: var(--dn-weight-medium); }
  .pane-heading p { margin: var(--dn-space-2) 0 0; color: var(--dn-muted); font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); }
  .section-clear { flex: none; min-height: var(--dn-control-height-default); padding: 0 var(--dn-space-2); border: 0; border-radius: var(--dn-pill); background: transparent; color: var(--dn-muted); font-size: var(--dn-text-meta); font-weight: var(--dn-weight-medium); }
  .close-control { position: absolute; top: var(--dn-space-3); right: var(--dn-space-3); }
  .editor-search { flex: none; margin-bottom: var(--dn-space-5); }
  .model-navigation { display: flex; flex: none; align-items: center; min-height: var(--dn-control-height-default); margin-bottom: var(--dn-space-2); font: var(--dn-control-font); }
  .model-navigation button { display: flex; align-items: center; gap: var(--dn-space-2); max-width: 100%; min-height: var(--dn-control-height-default); padding: 0 var(--dn-space-2); border: 0; border-radius: var(--dn-radius-sm); background: var(--dn-surface-subtle); color: var(--dn-ink); font: inherit; }
  .model-navigation span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .keyword-search { display: flex; align-items: center; gap: var(--dn-space-3); min-height: var(--dn-control-height-default); padding: 0 var(--dn-space-4); border: 1px solid var(--dn-line); border-radius: var(--dn-pill); color: var(--dn-muted); }
  .keyword-search:focus-within { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  .keyword-search input { flex: 1; min-width: 0; height: var(--dn-control-height-default); padding: 0; border: 0; outline: none; background: transparent; color: var(--dn-ink); font: var(--dn-field-font); }
  .keyword-search button { display: grid; flex: none; place-items: center; width: var(--dn-control-height-default); height: var(--dn-control-height-default); padding: 0; border: 0; border-radius: var(--dn-pill); background: transparent; color: var(--dn-ink); }
  .filter-footer { position: relative; display: grid; grid-column: 1 / -1; grid-row: 4; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: var(--dn-space-3); padding: var(--dn-space-3) var(--dn-space-6); }
  .clear-all, .show-results { min-height: var(--dn-control-height-default); padding: 0 14px; border: 0; border-radius: var(--dn-pill); font-size: var(--dn-text-meta); font-weight: var(--dn-weight-medium); white-space: nowrap; }
  .clear-all { justify-self: start; background: var(--dn-white); color: var(--dn-ink); }
  .clear-all:hover { background: var(--dn-surface-hover); }
  .show-results { background: var(--dn-ink); color: var(--dn-white); font-weight: var(--dn-weight-semibold); }
  .show-results:hover { background: var(--dn-ink-hover); }
  .show-results:disabled { background: var(--dn-line-strong); color: var(--dn-muted); cursor: default; }
  .filter-selections { grid-column: 1 / -1; grid-row: 3; min-width: 0; padding: 0 var(--dn-space-6); }
  .filter-selections h3 { display: flex; align-items: center; gap: var(--dn-space-2); margin: 0 0 var(--dn-space-2); color: var(--dn-muted); font-size: var(--dn-text-meta); font-weight: var(--dn-weight-medium); line-height: var(--dn-leading-control); }
  .filter-selections h3 small { color: var(--dn-ink); font-size: inherit; font-variant-numeric: tabular-nums; }
  .applied-filters { display: flex; align-items: center; flex-wrap: wrap; gap: var(--dn-space-2); min-width: 0; max-height: calc(var(--dn-control-height-compact) * 2 + var(--dn-space-2) + var(--dn-space-1)); padding-block: var(--dn-space-half); overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; }
  .applied-filters button { display: flex; flex: none; align-items: center; gap: var(--dn-space-2); min-height: var(--dn-control-height-compact); max-width: min(100%, 280px); padding: 0 var(--dn-space-3); border: 1px solid var(--dn-line); border-radius: var(--dn-pill); background: var(--dn-white); color: var(--dn-ink); font-size: var(--dn-text-meta); }
  .applied-filters button:hover { background: var(--dn-surface-hover); }
  .applied-filters span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .range-error { position: absolute; right: var(--dn-space-6); bottom: 100%; margin: 0; padding: var(--dn-space-2) var(--dn-space-3); border-radius: var(--dn-radius-sm); background: var(--dn-white); color: var(--dn-red); font-size: var(--dn-text-meta); }
</style>
