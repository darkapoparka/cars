<script lang="ts">
  import { Popover } from 'bits-ui';
  import { tick, untrack } from 'svelte';
  import { focusPopover } from '$lib/ui/focus';
  import { continuesIdentityPicker } from '$lib/ui/identity-picker';
  import { searchPickerAnchor, searchPickerSpacing } from '$lib/ui/search-picker';
  import { resolve } from '$app/paths';
  import { getI18n } from '$lib/locale/context';
  import { currencySymbol } from '$lib/locale/core';
  import { filterListingVehicles, listingBudgetCaps, listingFilterOptions, listingHiddenFields, listingSelectionHas, listingVehicles, type ListingFilters } from '$data/listing';
  import { cleanListingFormData, emptyListingDraft, listingDraftFacetActive, listingDraftFromFilters, listingFacetOptions, listingFacetOptionLabel, listingFacetTitle, listingFiltersFromDraft, listingMakeForModel, listingOptionsWithCurrent, listingSuggestionMatcher, toggleListingIdentity, withListingMake, withListingModel, type ListingDraft, type ListingFacetField } from '$data/listing-draft';
  import { desktopMakeOptions } from '$data/desktop-makes';
  import type { VehicleEquipment } from '$data/inventory';
  import Icon from '$components/ui/Icon.svelte';
  import DesktopFilterChoice from './DesktopFilterChoice.svelte';
  import DesktopMakeChoice from './DesktopMakeChoice.svelte';
  import DesktopModelGroups, { type ModelPicker } from './DesktopModelGroups.svelte';
  import FilterPopoverHeader from './FilterPopoverHeader.svelte';

  type Field = Exclude<ListingFacetField, 'sort'>;
  type Choice = { field: Field; value: string; label: string; make: string };
  let { filters, open = $bindable(false), initialField, returnFocus, keyboardOpen = false }: {
    filters: ListingFilters; open: boolean; initialField?: string; returnFocus?: HTMLElement; keyboardOpen?: boolean;
  } = $props();
  const i18n = getI18n();
  const fields: readonly Field[] = ['make', 'model', 'price', 'year', 'type', 'body', 'fuel', 'transmission', 'mileage_max', 'condition', 'version', 'equipment'];
  const initialFacet = $derived(fields.find(item => item === (initialField?.startsWith('price') ? 'price' : initialField?.startsWith('year') ? 'year' : initialField)));
  const compactMode = $derived(Boolean(initialFacet));
  const pricePresets = listingBudgetCaps().map(String);
  const yearPresets = listingFilterOptions.years.filter(Boolean).slice(-4);
  let draft = $state<ListingDraft>(emptyListingDraft());
  const field = $derived(initialFacet);
  let search = $state('');
  let wideModels = $state(false);
  const anchor = $derived(searchPickerAnchor(returnFocus, returnFocus?.closest<HTMLElement>('.dn-listing-filter'), field === 'make' || field === 'model' && wideModels));
  let modelPicker = $state<ModelPicker>();
  let searchInput = $state<HTMLInputElement | null>(null);
  let rangeInput = $state<HTMLInputElement | null>(null);
  let picker = $state<HTMLDivElement | null>(null);
  let restoreFocusOnClose = true;
  let editingFacet: Field | undefined;
  const matchesSearch = $derived(listingSuggestionMatcher(search, i18n.locale));
  const range = $derived(field === 'price' || field === 'year' || field === 'mileage_max');
  const searchable = $derived(field === 'make' || field === 'model' || field === 'version' || field === 'equipment');
  const title = $derived(field ? listingFacetTitle(field, i18n.locale) : i18n.t('m_49c266baaaa7'));
  const searchContext = $derived(field === 'model' ? modelPicker?.navigation()?.label : undefined);
  const searchPrompt = $derived(i18n.t('inventory.search.context', { context: searchContext ?? title.toLocaleLowerCase(i18n.locale) }));
  // Suggestion search never changes the applied vehicle keyword.
  const effectiveFilters = $derived(listingFiltersFromDraft(draft));
  const matching = $derived(filterListingVehicles(listingVehicles, effectiveFilters, i18n.locale).length);
  const hiddenFields = $derived(listingHiddenFields(effectiveFilters));
  const invalidRange = $derived(Boolean(
    draft.priceMin && draft.priceMax && Number(draft.priceMin) > Number(draft.priceMax) ||
    draft.yearMin && draft.yearMax && Number(draft.yearMin) > Number(draft.yearMax)
  ));
  const activeFields = $derived(fields.filter(item => listingDraftFacetActive(draft, item)));
  const choices = $derived(field && !range ? options(field, draft.make)
    .map(value => choice(field!, value)).filter(item => matchesSearch(item.label + ' ' + item.make)) : []);

  $effect(() => {
    if (!open) { editingFacet = undefined; return; }
    const next = initialFacet;
    returnFocus;
    untrack(() => {
      if (!continuesIdentityPicker(editingFacet, next)) draft = listingDraftFromFilters(filters);
      editingFacet = next;
      if (next === 'model') wideModels = draft.make.length !== 1;
      search = '';
      restoreFocusOnClose = true;
      if (compactMode) void focusOpening();
    });
  });

  $effect(() => {
    if (!open || !compactMode || !returnFocus) return;
    // An off-screen anchor must not leave an invisible menu trapping focus.
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => !entry.isIntersecting)) open = false;
    });
    observer.observe(returnFocus);
    return () => observer.disconnect();
  });

  function options(item: Field, make: string | readonly string[]) {
    if (item === 'make') return desktopMakeOptions(draft.make, i18n.locale).filter(Boolean);
    const current = item === 'equipment' || item === 'price' || item === 'year' || item === 'mileage_max' ? '' : draft[item];
    const values = [...listingOptionsWithCurrent(listingFacetOptions(item, make), current)].filter(Boolean);
    return item === 'model' ? values.sort((a, b) => a.localeCompare(b, i18n.locale, { numeric: true })) : values;
  }
  function choice(item: Field, value: string): Choice {
    return { field: item, value, label: listingFacetOptionLabel(item, value, i18n.locale),
      make: item === 'model' ? listingMakeForModel(value) : '' };
  }
  function candidate(item: Choice): ListingDraft {
    if (item.field === 'make' || item.field === 'model') return toggleListingIdentity(draft, item.field, item.value);
    if (item.field === 'equipment') return { ...draft, equipment: draft.equipment.includes(item.value as VehicleEquipment)
      ? draft.equipment.filter(value => value !== item.value) : [...draft.equipment, item.value as VehicleEquipment] };
    return { ...draft, [item.field]: item.value };
  }
  function isSelected(item: Choice) {
    return item.field === 'make' || item.field === 'model' ? listingSelectionHas(draft[item.field], item.value)
      : item.field === 'equipment' ? draft.equipment.includes(item.value as VehicleEquipment)
      : item.field !== 'price' && item.field !== 'year' && item.field !== 'mileage_max' && draft[item.field] === item.value;
  }
  async function focusSearch() {
    await tick();
    if (open) (range ? rangeInput : searchInput ?? picker)?.focus({ preventScroll: true });
  }
  async function focusOpening() {
    await tick();
    if (open) focusPopover(picker, range ? rangeInput : searchInput ?? picker?.querySelector<HTMLInputElement>('input:checked') ?? null, keyboardOpen);
  }
  function select(item: Choice) {
    if (isSelected(item) && item.field !== 'equipment' && item.field !== 'make' && item.field !== 'model') {
      return;
    }
    draft = candidate(item);
  }
  function clear(item: Field | 'q', focus = true) {
    if (item === 'make') draft = withListingMake(draft, '');
    else if (item === 'model') draft = withListingModel(draft, '');
    else if (item === 'price') draft = { ...draft, priceMin: '', priceMax: '' };
    else if (item === 'year') draft = { ...draft, yearMin: '', yearMax: '' };
    else if (item === 'mileage_max') draft = { ...draft, mileageMax: '' };
    else if (item === 'equipment') draft = { ...draft, equipment: [] };
    else draft = { ...draft, [item]: '' };
    if (focus) void focusSearch();
  }
  function apply(event: SubmitEvent) {
    if (invalidRange) { event.preventDefault(); return; }
    open = false;
  }
  function cleanForm(event: FormDataEvent) {
    // Hidden fields are the canonical draft, including selected options hidden by search.
    for (const item of fields) event.formData.delete('draft-' + item);
    cleanListingFormData(event.formData);
  }
  function returnToPage(event: Event) {
    event.preventDefault();
    if (compactMode && !restoreFocusOnClose) return;
    const target = returnFocus;
    void tick().then(() => {
      if (!open && target?.isConnected && returnFocus === target) target.focus({ preventScroll: true });
    });
  }
  function interactOutside(event: PointerEvent) {
    const target = event.target instanceof Element ? event.target : undefined;
    const next = target?.closest<HTMLElement>('[data-facet]')?.dataset.facet;
    // Outside-click delivery can follow the facet change; its new opener still belongs to this menu.
    if (target && returnFocus?.contains(target) || continuesIdentityPicker(field, next)) event.preventDefault();
    else restoreFocusOnClose = false;
  }
</script>

{#snippet searchControl()}
  <div class="dn-search-query">
    <Icon name="search" size={18} />
    <input class="dn-search-input" type="text" role="searchbox" bind:this={searchInput} bind:value={search} aria-label={searchContext ? `${title}: ${searchContext}` : title} placeholder={searchPrompt} autocomplete="off" onkeydown={event => { if (event.key === 'Enter') event.preventDefault(); }} />
    {#if search}<button class="dn-search-icon" type="button" aria-label={i18n.t('inventory.search.clearQuery')} onclick={() => { search = ''; void focusSearch(); }}><Icon name="x" size={16} /></button>{/if}
  </div>
{/snippet}

{#snippet editor()}
  {#if range}
    <div class="dn-search-results dn-search-range">
      {#if field === 'mileage_max'}
        <label>
          <span class="dn-filter-field-label">{listingFacetTitle('mileage_max', i18n.locale)}</span>
          <span class="dn-search-range-control">
            <input {@attach i18n.validation} type="number" min="0" max={Number.MAX_SAFE_INTEGER} step="1"
              aria-label={`${listingFacetTitle('mileage_max', i18n.locale)} · ${i18n.t('inventory.search.kilometres')}`}
              placeholder={i18n.t('inventory.range.unlimited')} data-unit="true" bind:this={rangeInput}
              bind:value={() => draft.mileageMax, value => draft.mileageMax = value?.toString() ?? ''} />
            <span class="dn-search-unit" aria-hidden="true">{i18n.t('inventory.search.kilometres')}</span>
          </span>
        </label>
        <div class="dn-search-presets">{#each listingFilterOptions.mileages.filter(Boolean) as value (value)}<button type="button" data-active={draft.mileageMax === value} aria-pressed={draft.mileageMax === value} onclick={() => draft.mileageMax = value}>{new Intl.NumberFormat(i18n.locale).format(Number(value))} {i18n.t('inventory.search.kilometres')}</button>{/each}</div>
      {:else}
        <div class="dn-search-range-fields">
          <label>
            <span class="dn-filter-field-label">{i18n.t(field === 'price' ? 'm_94470b41eead' : 'm_349ee8568241')}</span>
            <span class="dn-search-range-control">
              <input {@attach i18n.validation} type="number" min="0" max={Number.MAX_SAFE_INTEGER} step="1"
                aria-label={`${i18n.t(field === 'price' ? 'm_94470b41eead' : 'm_349ee8568241')}${field === 'price' ? ' · ' + currencySymbol(i18n.locale) : ''}`}
                placeholder={i18n.t('m_8a702098f672')} data-unit={field === 'price'} bind:this={rangeInput}
                bind:value={() => field === 'price' ? draft.priceMin : draft.yearMin, value => {
                  if (field === 'price') draft.priceMin = value?.toString() ?? '';
                  else draft.yearMin = value?.toString() ?? '';
                }} />
              {#if field === 'price'}<span class="dn-search-unit" aria-hidden="true">{currencySymbol(i18n.locale)}</span>{/if}
            </span>
          </label>
          <label>
            <span class="dn-filter-field-label">{i18n.t(field === 'price' ? 'm_363c4f34635c' : 'm_07339ff9faf8')}</span>
            <span class="dn-search-range-control">
              <input {@attach i18n.validation} type="number" min="0" max={Number.MAX_SAFE_INTEGER} step="1"
                aria-label={`${i18n.t(field === 'price' ? 'm_363c4f34635c' : 'm_07339ff9faf8')}${field === 'price' ? ' · ' + currencySymbol(i18n.locale) : ''}`}
                placeholder={i18n.t('m_585b0741c5fb')} data-unit={field === 'price'}
                bind:value={() => field === 'price' ? draft.priceMax : draft.yearMax, value => {
                  if (field === 'price') draft.priceMax = value?.toString() ?? '';
                  else draft.yearMax = value?.toString() ?? '';
                }} />
              {#if field === 'price'}<span class="dn-search-unit" aria-hidden="true">{currencySymbol(i18n.locale)}</span>{/if}
            </span>
          </label>
        </div>
        <div class="dn-search-presets" class:dn-search-presets--price={field === 'price'}>
          {#each (field === 'price' ? pricePresets : yearPresets) as value (value)}
            <button type="button" data-active={(field === 'price' ? draft.priceMax : draft.yearMin) === value} aria-pressed={(field === 'price' ? draft.priceMax : draft.yearMin) === value} onclick={() => { if (field === 'price') draft.priceMax = value; else draft.yearMin = value; }}>{field === 'price' ? i18n.t('inventory.search.upTo', { value: new Intl.NumberFormat(i18n.locale).format(Number(value)), currency: currencySymbol(i18n.locale) }) : i18n.t('inventory.search.fromYear', { year: value })}</button>
          {/each}
        </div>
      {/if}
      {#if invalidRange}<p class="dn-search-range-error" role="alert">{i18n.t(draft.priceMin && draft.priceMax && Number(draft.priceMin) > Number(draft.priceMax) ? 'm_2157bc34d38a' : 'm_e35acfc7ae2e')}</p>{/if}
    </div>
  {:else if field === 'model'}
    <div class="dn-facet-options"><div class="dn-search-results"><DesktopModelGroups bind:this={modelPicker} makes={draft.make} selected={draft.model} {search} name="draft-model" onchange={value => draft = toggleListingIdentity(draft, 'model', value)} /></div></div>
  {:else if field}
    <div class="dn-facet-options">
      <div class="dn-search-results dn-search-results--choices" class:dn-search-results--makes={field === 'make'} role="group" aria-label={title}>
        {#if field !== 'equipment' && !search}
          {#if field === 'make'}
            <DesktopMakeChoice value="" label={i18n.t('inventory.search.allMakes')} name="draft-make" checked={!activeFields.includes('make')} onchange={() => clear('make', false)} />
          {:else}
          <DesktopFilterChoice value="" label={i18n.t('m_3cd085e8c069')}
            tile name={'draft-' + field} checked={!activeFields.includes(field)} onchange={() => field && clear(field, false)} />
          {/if}
        {/if}
        {#each choices as choice (choice.value)}
          {#if field === 'make'}
            <DesktopMakeChoice value={choice.value} label={choice.label} name="draft-make" checked={isSelected(choice)} onchange={() => select(choice)} />
          {:else}
          <DesktopFilterChoice value={choice.value} label={choice.label} description={choice.make && !draft.make.length ? choice.make : ''}
            multiple={choice.field === 'equipment' || choice.field === 'make' || choice.field === 'model'} tile name={'draft-' + choice.field}
            checked={isSelected(choice)} onchange={() => select(choice)} />
          {/if}
        {/each}
        {#if !choices.length}
          <div class="dn-search-empty"><p role="status">{i18n.t('inventory.search.empty')}</p>{#if search}<button type="button" onclick={() => { search = ''; void focusSearch(); }}>{i18n.t('inventory.search.clearQuery')}</button>{/if}</div>
        {/if}
      </div>
    </div>
  {/if}
{/snippet}

{#snippet filterForm()}
  <form method="GET" action={i18n.href(resolve('/listing-grid'))} onsubmit={apply} onformdata={cleanForm}>
    <FilterPopoverHeader id="dn-facet-title" {title} search={searchable ? searchControl : undefined} navigation={field === 'model' ? modelPicker?.navigation() : undefined} />
    <div class="dn-filter-workspace">
      <section class="dn-filter-panel" aria-label={title}>{@render editor()}</section>
    </div>
    <footer class="dn-search-footer dn-overlay-footer">
      <button class="dn-search-reset dn-overlay-secondary" type="button" disabled={!field || !activeFields.includes(field)} onclick={() => field && clear(field)}>{i18n.t('action.clearShort')}</button>
      <button class="dn-search-apply dn-overlay-primary" type="submit" disabled={invalidRange} aria-live="polite" aria-label={matching === 1 ? i18n.t('m_047e325f6562') : i18n.t('m_08d2ff28407e', { p0: matching })}>{i18n.t('action.showCount', { count: matching })}</button>
    </footer>
    {#each hiddenFields as [name, value], index (name + '-' + value + '-' + index)}<input type="hidden" {name} {value} />{/each}
  </form>
{/snippet}

{#if compactMode}
  <Popover.Root bind:open>
    <Popover.Portal to=".dn-app-shell">
      <Popover.Content bind:ref={picker} id="dn-listing-filter-dialog" class="dn-search-dialog dn-search-popover" data-compact="true"
        data-desktop-panel="true" data-wide-choices={searchable} data-make-grid={field === 'make' || field === 'model' && wideModels} role="dialog" aria-labelledby="dn-facet-title" customAnchor={anchor} side="bottom" align={range ? 'end' : 'start'} {...searchPickerSpacing}
        strategy="fixed" hideWhenDetached trapFocus={false}
        onOpenAutoFocus={event => event.preventDefault()}
        onInteractOutside={interactOutside} onCloseAutoFocus={returnToPage}>
        {@render filterForm()}
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
{/if}

<style>
  :global(.dn-search-dialog) { z-index: 11001; overflow: hidden; border: 1px solid var(--dn-line); background: var(--dn-surface-raised); color: var(--dn-ink); }
  :global(.dn-search-popover) { position: relative; top: auto; left: auto; width: min(380px, calc(100vw - 32px)); height: auto; max-height: min(560px, var(--bits-popover-content-available-height, calc(100dvh - 32px))); border-radius: var(--dn-radius); transform: none; box-shadow: var(--dn-shadow); }
  /* Keep anchored menus static, including inherited effects. */
  :global(.dn-search-dialog) { transition: none !important; scroll-behavior: auto !important; }
  :global(.dn-search-dialog *), :global(.dn-search-dialog *::before), :global(.dn-search-dialog *::after) { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
  form { display: flex; flex-direction: column; height: 100%; min-width: 0; min-height: 0; margin: 0; }
  :global(.dn-search-popover) form { height: auto; max-height: min(558px, calc(var(--bits-popover-content-available-height, calc(100dvh - 32px)) - 2px)); }
  :global(.dn-search-popover) .dn-filter-panel { padding: 0 var(--dn-space-4) var(--dn-space-4); }
  :global(.dn-search-popover) .dn-search-query { height: var(--dn-control-height-default); border: 1px solid var(--dn-line); border-radius: var(--dn-pill); margin-bottom: var(--dn-space-2); background: var(--dn-white); }
  :global(.dn-search-popover) .dn-search-footer { height: 72px; gap: var(--dn-space-2); padding-inline: var(--dn-space-4); }
  :global(.dn-search-popover) .dn-search-reset { padding-inline: var(--dn-space-3); border: 1px solid var(--dn-line); border-radius: var(--dn-pill); background: var(--dn-white); text-decoration: none; }
  :global(.dn-search-popover) .dn-search-apply { min-height: var(--dn-control-height-default); padding-inline: var(--dn-space-4); }
  .dn-search-icon { display: grid; flex: 0 0 var(--dn-control-height-compact); place-items: center; width: var(--dn-control-height-compact); height: var(--dn-control-height-compact); padding: 0; border: 0; border-radius: var(--dn-radius-sm); background: transparent; color: var(--dn-muted); cursor: pointer; }
  .dn-search-icon:hover { background: var(--dn-surface-subtle); color: var(--dn-ink); }
  .dn-filter-workspace { display: flex; flex: 1; min-width: 0; min-height: 0; }
  .dn-filter-field-label { color: var(--dn-muted); font: var(--dn-field-label-font); }
  .dn-filter-panel { display: flex; flex: 1; flex-direction: column; min-width: 0; min-height: 0; padding: var(--dn-space-2) var(--dn-space-6) var(--dn-space-6); }
  .dn-facet-options { display: flex; flex: 1; flex-direction: column; min-width: 0; min-height: 0; }
  .dn-search-query { display: flex; flex-shrink: 0; align-items: center; gap: var(--dn-space-3); height: var(--dn-control-height-prominent); margin-bottom: var(--dn-space-4); padding-inline: var(--dn-space-4); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-control); background: var(--dn-home-panel); color: var(--dn-muted); }
  .dn-search-query:has(:global(.dn-search-input:focus-visible)) { outline: 1px solid var(--dn-focus); outline-offset: -1px; }
  :global(.dn-search-input) { flex: 1; width: 100%; min-width: 0; height: 100%; padding: 0; border: 0; outline: 0; background: transparent; color: var(--dn-ink); font: var(--dn-entry-font); font-size: var(--dn-text-body); box-shadow: none; }
  :global(.dn-search-dialog .dn-search-input:focus-visible) { outline: none; }
  .dn-search-query .dn-search-icon { flex-basis: var(--dn-space-7); width: var(--dn-space-7); height: var(--dn-space-7); border-radius: var(--dn-radius-xs); }
  :global(.dn-search-input::placeholder) { color: var(--dn-muted); }
  :global(.dn-search-results) { display: grid; flex: 1; min-height: 0; padding: 0; overflow-y: auto; overscroll-behavior: contain; scroll-padding-block: var(--dn-space-2); scrollbar-width: thin; }
  :global(.dn-search-dialog[data-compact='true'] .dn-search-results) { flex: 0 1 auto; min-height: var(--dn-control-height-prominent); max-height: 360px; }
  .dn-search-range { display: block; }
  .dn-search-empty { padding: var(--dn-space-8) var(--dn-space-3); color: var(--dn-muted); text-align: center; font-size: var(--dn-text-meta); }
  .dn-search-empty p { margin: 0 0 var(--dn-space-3); }
  .dn-search-empty button, .dn-search-reset { min-height: var(--dn-control-height-compact); padding: var(--dn-space-2); border: 0; border-radius: var(--dn-radius-xs); background: transparent; color: var(--dn-muted); font: var(--dn-control-font); cursor: pointer; }
  .dn-search-empty button:hover, .dn-search-reset:hover { background: var(--dn-surface-subtle); color: var(--dn-ink); }
  .dn-search-reset:disabled { opacity: .45; cursor: default; text-decoration: none; }
  .dn-search-range-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--dn-space-4); }
  .dn-search-range label { position: relative; display: grid; gap: var(--dn-space-2); min-width: 0; color: var(--dn-muted); font: var(--dn-field-label-font); }
  .dn-search-range-control { position: relative; display: block; }
  .dn-search-unit { position: absolute; top: 50%; right: var(--dn-space-3); color: var(--dn-muted); font-size: var(--dn-text-meta); transform: translateY(-50%); pointer-events: none; }
  input[type='number'] { width: 100%; height: var(--dn-control-height-compact); padding: 0 var(--dn-space-3); border: 1px solid var(--dn-line-strong); border-radius: var(--dn-radius-xs); background: var(--dn-surface-raised); color: var(--dn-ink); font: var(--dn-field-font); appearance: textfield; }
  input[type='number'][data-unit='true'] { padding-right: calc(var(--dn-space-3) + var(--dn-space-4)); }
  input[type='number']::placeholder { color: var(--dn-muted); }
  input[type='number'], .dn-search-presets button { font-variant-numeric: tabular-nums; }
  input[type='number']:hover, .dn-search-query:hover { border-color: var(--dn-line-emphasis); }
  input[type='number']::-webkit-inner-spin-button, input[type='number']::-webkit-outer-spin-button { margin: 0; appearance: none; }
  .dn-search-presets { display: flex; flex-wrap: wrap; gap: var(--dn-space-2); margin-top: var(--dn-space-5); }
  .dn-search-presets button { min-width: 0; min-height: var(--dn-control-height-default); padding: var(--dn-space-2) var(--dn-space-4); border: 1px solid var(--dn-line); border-radius: var(--dn-pill); background: var(--dn-surface-raised); color: var(--dn-ink); font: var(--dn-control-font); cursor: pointer; }
  .dn-search-presets button:hover { background: var(--dn-surface-hover); }
  .dn-search-presets button[data-active='true'] { border-color: var(--dn-line-emphasis); background: var(--dn-home-panel); }
  .dn-search-range-error { margin: var(--dn-space-3) 0 0; color: var(--dn-red); font-size: var(--dn-text-meta); }
  .dn-search-footer { display: flex; flex-shrink: 0; align-items: center; gap: var(--dn-space-4); height: 88px; padding: 0 var(--dn-space-6); border-top: 1px solid var(--dn-line); }
  .dn-search-reset { min-width: 0; min-height: var(--dn-control-height-default); padding-inline: 0; color: var(--dn-ink); text-decoration: underline; text-underline-offset: var(--dn-space-1); }
  .dn-search-reset:disabled { text-decoration: none; }
  .dn-search-apply { display: flex; flex: 0 1 auto; align-items: center; justify-content: center; min-width: 0; min-height: var(--dn-control-height-entry-mobile); margin-left: auto; padding: var(--dn-space-2) var(--dn-space-6); border: 0; border-radius: var(--dn-pill); background: var(--dn-ink); color: var(--dn-white); font: var(--dn-control-font); font-size: var(--dn-text-body); white-space: nowrap; cursor: pointer; }
  :global(.dn-search-popover) input[type='number'] { height: var(--dn-control-height-default); border-color: var(--dn-line); border-radius: var(--dn-radius-control); background: var(--dn-white); }
  .dn-search-apply:hover { background: var(--dn-ink-hover); }
  .dn-search-apply { --dn-primary-action-surface: var(--dn-ink); --dn-primary-action-surface-hover: var(--dn-ink-hover); }
  .dn-search-apply:disabled { opacity: .45; cursor: not-allowed; }
  /* Inset focus stays intact inside scroll areas and never crowds adjacent controls. */
  button:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: -3px; }
  input[type='number']:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  .dn-search-apply:focus-visible { outline-color: var(--dn-white); }
  @media (min-width: 992px) {
    :global(.dn-search-popover[data-desktop-panel='true']) { width: min(480px, calc(100vw - 32px)); }
    :global(.dn-search-popover[data-desktop-panel='true'][data-wide-choices='true']) { width: min(640px, calc(100vw - 32px)); }
    :global(.dn-search-popover[data-desktop-panel='true'][data-make-grid='true']) { width: min(var(--bits-popover-anchor-width, 840px), calc(100vw - 32px)); }
    :global(.dn-search-popover[data-desktop-panel='true']) .dn-search-query { width: 100%; margin: 0; }
    .dn-search-results--choices { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--dn-space-2); }
    .dn-search-results--makes { grid-template-columns: repeat(auto-fill, minmax(min(100%, calc(var(--dn-control-height-default) * 3 + var(--dn-space-1))), 1fr)); }
    .dn-search-empty { grid-column: 1 / -1; }
    .dn-search-range-fields, .dn-search-range > label { width: min(100%, 488px); margin-inline: auto; }
    .dn-search-presets { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .dn-search-presets--price { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .dn-search-presets button { padding-inline: var(--dn-space-3); border: 0; border-radius: var(--dn-radius-control); background: var(--dn-surface-subtle); text-align: left; }
    .dn-search-presets--price button { padding-inline: var(--dn-space-2); }
    .dn-search-presets button[data-active='true'] { background: var(--dn-surface-hover); box-shadow: inset 0 0 0 1px var(--dn-line-emphasis); }
  }
  @media (forced-colors: active) {
    input[type='number'], .dn-search-query { border: 1px solid CanvasText; }
    .dn-search-presets button[data-active='true'] { outline: 1px solid Highlight; outline-offset: -1px; }
  }
</style>
