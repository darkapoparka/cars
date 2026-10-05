<script lang="ts">
  import { Command, Dialog, Tabs } from 'bits-ui';
  import { tick, untrack } from 'svelte';
  import { resolve } from '$app/paths';
  import { getI18n } from '$lib/locale/context';
  import { currencySymbol } from '$lib/locale/core';
  import { filterListingVehicles, listingFilterOptions, listingHiddenFields, listingModelsForMake, listingVehicles, type ListingFilters } from '$data/listing';
  import { cleanListingFormData, emptyListingDraft, listingDraftFromFilters, listingFacetOptions, listingFacetOptionLabel, listingFacetSummary, listingFacetTitle, listingFiltersFromDraft, withListingMake, type ListingDraft, type ListingFacetField } from '$data/listing-draft';
  import type { VehicleEquipment } from '$data/inventory';
  import Icon from '$components/ui/Icon.svelte';

  type Field = Exclude<ListingFacetField, 'sort'>;
  type Choice = { field: Field; value: string; label: string; make: string };
  let { filters, open = $bindable(false), initialField, returnFocus }: {
    filters: ListingFilters; open: boolean; initialField?: string; returnFocus?: HTMLElement;
  } = $props();
  const i18n = getI18n();
  const fields: readonly Field[] = ['make', 'model', 'price', 'year', 'type', 'body', 'fuel', 'transmission', 'mileage_max', 'condition', 'version', 'equipment'];
  let draft = $state<ListingDraft>(emptyListingDraft());
  let field = $state<Field>();
  let search = $state('');
  let searchInput = $state<HTMLInputElement | null>(null);
  let rangeInput = $state<HTMLInputElement | null>(null);
  let commandValue = $state('');
  const range = $derived(field === 'price' || field === 'year' || field === 'mileage_max');
  const title = $derived(field ? listingFacetTitle(field, i18n.locale) : i18n.t('m_49c266baaaa7'));
  const sections = ['search', ...fields] as const;
  // Choice search only narrows suggestions; the keyword command explicitly applies q.
  const effectiveFilters = $derived(listingFiltersFromDraft(draft));
  const matching = $derived(filterListingVehicles(listingVehicles, effectiveFilters, i18n.locale).length);
  const hiddenFields = $derived(listingHiddenFields(effectiveFilters));
  const invalidRange = $derived(Boolean(
    draft.priceMin && draft.priceMax && Number(draft.priceMin) > Number(draft.priceMax) ||
    draft.yearMin && draft.yearMax && Number(draft.yearMin) > Number(draft.yearMax)
  ));
  const activeFields = $derived(fields.filter(item => item === 'price' ? draft.priceMin || draft.priceMax
    : item === 'year' ? draft.yearMin || draft.yearMax : item === 'mileage_max' ? draft.mileageMax
    : item === 'equipment' ? draft.equipment.length : draft[item]));
  const filteredFields = $derived(fields.filter(item => matches(listingFacetTitle(item, i18n.locale))));
  const choices = $derived(field && !range ? options(field, draft.make)
    .map(value => choice(field!, value)).filter(item => matches(item.label)) : []);
  const searchChoices = $derived(!field ? (search.trim() ? fields.flatMap(item =>
    options(item, item === 'model' ? '' : draft.make).map(value => choice(item, value))
      .filter(option => matches(option.label + ' ' + option.make))) : options('make', '').map(value => choice('make', value))).slice(0, 40) : []);

  $effect(() => {
    if (!open) return;
    untrack(() => {
      draft = listingDraftFromFilters(filters);
      const requested = initialField?.startsWith('price') ? 'price' : initialField?.startsWith('year') ? 'year' : initialField;
      field = fields.find(item => item === requested);
      search = '';
      commandValue = initialChoice();
    });
  });

  function matches(value: string) {
    const normalized = normalize(value);
    return search.trim().split(/\s+/).every(term => normalized.includes(normalize(term)));
  }
  function normalize(value: string) {
    return value.normalize('NFKD').replace(/\p{M}/gu, '').toLocaleLowerCase(i18n.locale).replace(/[\s\p{P}]+/gu, '');
  }
  function options(item: Field, make: string) {
    const values = listingFacetOptions(item, make).filter(Boolean);
    return item === 'make' || item === 'model' ? values.sort((a, b) => a.localeCompare(b, i18n.locale, { numeric: true })) : values;
  }
  function choice(item: Field, value: string): Choice {
    const makes = item === 'model' ? listingFilterOptions.makes.filter(make => make && listingModelsForMake(make).includes(value)) : [];
    return { field: item, value, label: listingFacetOptionLabel(item, value, i18n.locale),
      make: makes.length === 1 ? makes[0] : '' };
  }
  function candidate(item: Choice): ListingDraft {
    if (item.field === 'make') return withListingMake(draft, item.value);
    if (item.field === 'model') return { ...withListingMake(draft, item.make || draft.make), model: item.value };
    if (item.field === 'equipment') return { ...draft, equipment: draft.equipment.includes(item.value as VehicleEquipment)
      ? draft.equipment.filter(value => value !== item.value) : [...draft.equipment, item.value as VehicleEquipment] };
    return { ...draft, [item.field]: item.value };
  }
  function isSelected(item: Choice) {
    return item.field === 'equipment' ? draft.equipment.includes(item.value as VehicleEquipment)
      : item.field !== 'price' && item.field !== 'year' && item.field !== 'mileage_max' && draft[item.field] === item.value;
  }
  function choiceCount(item: Choice) {
    return filterListingVehicles(listingVehicles, listingFiltersFromDraft(candidate(item)), i18n.locale).length;
  }
  async function focusSearch() { await tick(); (range ? rangeInput : searchInput)?.focus({ preventScroll: true }); }
  function initialChoice() {
    if (field === 'model') return draft.model ? `model:${draft.model}` : 'clear-field';
    if (field === 'make') return draft.make ? `make:${draft.make}` : 'clear-field';
    return '';
  }
  function browse(item?: Field, focus = true) { field = item; search = ''; commandValue = initialChoice(); if (focus) void focusSearch(); }
  function select(item: Choice) {
    if (isSelected(item) && item.field !== 'equipment') {
      if (!field) search = '';
      clear(item.field);
      return;
    }
    draft = candidate(item);
    // Selecting a value keeps the dialog open, including equipment multi-selection.
    if (!field) { search = ''; commandValue = ''; }
    void focusSearch();
  }
  function clear(item: Field | 'q') {
    if (item === 'make') draft = withListingMake(draft, '');
    else if (item === 'price') draft = { ...draft, priceMin: '', priceMax: '' };
    else if (item === 'year') draft = { ...draft, yearMin: '', yearMax: '' };
    else if (item === 'mileage_max') draft = { ...draft, mileageMax: '' };
    else if (item === 'equipment') draft = { ...draft, equipment: [] };
    else draft = { ...draft, [item]: '' };
    commandValue = search ? '' : initialChoice();
    void focusSearch();
  }
  function clearAll() {
    draft = emptyListingDraft(filters.sort);
    search = '';
    commandValue = initialChoice();
    void focusSearch();
  }
  function apply(event: SubmitEvent) {
    if (invalidRange) { event.preventDefault(); return; }
    open = false;
  }
  function returnToPage(event: Event) {
    event.preventDefault();
    void tick().then(() => returnFocus?.focus({ preventScroll: true }));
  }
  function controlKeyboard(event: KeyboardEvent) {
    if (!(event.target instanceof Element)) return;
    const numeric = event.target.matches('input[type="number"]');
    if (numeric && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
      || event.key === 'Enter' && (numeric || event.target.closest('button'))) event.stopPropagation();
  }
</script>

{#snippet optionRow(item: Choice)}
  <Command.Item class="dn-search-row dn-search-choice" value={item.field + ':' + item.value} aria-checked={isSelected(item)} onSelect={() => select(item)}>
    <span class="dn-search-row-label">{item.label}{#if item.make && !draft.make}<small>{item.make}</small>{/if}</span>
    <span class="dn-search-row-count">{choiceCount(item)}</span>
    <span class="dn-search-check" data-checked={isSelected(item)} data-multiple={item.field === 'equipment'} aria-hidden="true">✓</span>
  </Command.Item>
{/snippet}

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay class="dn-search-overlay" />
    <Dialog.Content id="dn-listing-filter-dialog" class="dn-search-dialog" onOpenAutoFocus={event => { event.preventDefault(); void focusSearch(); }} onCloseAutoFocus={returnToPage}>
      <Dialog.Description class="dn-search-sr-only">{i18n.t('inventory.search.placeholder')}</Dialog.Description>
      <form method="GET" action={i18n.href(resolve('/listing-grid'))} onsubmit={apply} onformdata={event => cleanListingFormData(event.formData)}>
        <header class="dn-filter-header">
          <Dialog.Title class="dn-filter-title">{i18n.t('m_546ebb8eb993')}</Dialog.Title>
          {#if activeFields.length || draft.q}<span class="dn-filter-count" aria-label={String(activeFields.length + (draft.q ? 1 : 0)) + ' ' + i18n.t('m_546ebb8eb993')}>{activeFields.length + (draft.q ? 1 : 0)}</span>{/if}
          <Dialog.Close class="dn-search-close" type="button" aria-label={i18n.t('m_84305a580997')}><Icon name="x" size={20} /></Dialog.Close>
        </header>
        <Tabs.Root class="dn-filter-workspace" value={field ?? 'search'} orientation="vertical" onValueChange={value => browse(fields.find(item => item === value), false)}>
          <Tabs.List class="dn-filter-nav" aria-label={i18n.t('m_3deeda2a1ebe')}>
            {#each sections as item (item)}
              {@const filled = item === 'search' ? Boolean(draft.q) : activeFields.includes(item)}
              {@const label = item === 'search' ? i18n.t('m_49c266baaaa7') : listingFacetTitle(item, i18n.locale)}
              {@const summary = filled ? item === 'search' ? draft.q : listingFacetSummary(item, draft, i18n.locale) : ''}
              <Tabs.Trigger class="dn-filter-tab" value={item} type="button" data-field={item} data-filled={filled} title={summary ? label + ': ' + summary : label}>
                <span class="dn-filter-tab-text"><span>{label}</span>{#if summary}<small>{summary}</small>{/if}</span>
                {#if filled}<span class="dn-filter-dot" aria-hidden="true"></span>{/if}
              </Tabs.Trigger>
            {/each}
          </Tabs.List>
          {#each sections as item (item)}
            <Tabs.Content class="dn-filter-panel" value={item} tabindex={-1}>
              {#if item === (field ?? 'search')}
                <!-- Initialize Command for the newly visible editor and its model scope. -->
                {#key item + ':' + (field === 'model' ? draft.make : '')}
                  <Command.Root class="dn-search-command" shouldFilter={false} loop bind:value={commandValue} label={title}>
                    <div class="dn-filter-panel-heading" role="presentation" onkeydown={controlKeyboard}>
                      <h3>{title}</h3>
                      {#if field && activeFields.includes(field) || !field && draft.q}
                        <button class="dn-search-clear-field" type="button" aria-label={i18n.t('inventory.search.clearFilter') + ': ' + title} onclick={() => clear(field ?? 'q')}>{i18n.t('inventory.search.clearFilter')}</button>
                      {/if}
                    </div>
                    {#if !range}
                      <div class="dn-search-query" role="presentation" onkeydown={controlKeyboard}>
                        <Icon name="search" size={18} />
                        <Command.Input class="dn-search-input" bind:ref={searchInput} bind:value={search} aria-label={title} placeholder={field ? i18n.t('inventory.search.within') : i18n.t('inventory.search.placeholder')} autocomplete="off" />
                        {#if search}<button class="dn-search-icon" type="button" aria-label={i18n.t('inventory.search.clearQuery')} onclick={() => { search = ''; void focusSearch(); }}><Icon name="x" size={16} /></button>{/if}
                      </div>
                    {/if}
                    {#if range}
                      <div class="dn-search-results dn-search-range" role="presentation" onkeydown={controlKeyboard}>
                        {#if field === 'mileage_max'}
                          <label>
                            <span>{listingFacetTitle('mileage_max', i18n.locale)}</span>
                            <span class="dn-search-range-control">
                              <input {@attach i18n.validation} type="number" min="0" step="1"
                                aria-label={`${listingFacetTitle('mileage_max', i18n.locale)} · ${i18n.t('inventory.search.kilometres')}`}
                                placeholder={i18n.t('inventory.range.unlimited')} data-unit="true" bind:this={rangeInput}
                                bind:value={() => draft.mileageMax, value => draft.mileageMax = value?.toString() ?? ''} />
                              <span class="dn-search-unit" aria-hidden="true">{i18n.t('inventory.search.kilometres')}</span>
                            </span>
                          </label>
                          <div class="dn-search-presets">{#each listingFilterOptions.mileages.filter(Boolean) as value (value)}<button type="button" data-active={draft.mileageMax === value} onclick={() => draft.mileageMax = value}>{new Intl.NumberFormat(i18n.locale).format(Number(value))} {i18n.t('inventory.search.kilometres')}</button>{/each}</div>
                        {:else}
                          <div class="dn-search-range-fields">
                            <label>
                              <span>{i18n.t(field === 'price' ? 'm_94470b41eead' : 'm_349ee8568241')}</span>
                              <span class="dn-search-range-control">
                                <input {@attach i18n.validation} type="number" min="0" step="1"
                                  aria-label={`${i18n.t(field === 'price' ? 'm_94470b41eead' : 'm_349ee8568241')}${field === 'price' ? ' · ' + currencySymbol(i18n.locale) : ''}`}
                                  placeholder={i18n.t('inventory.range.unlimited')} data-unit={field === 'price'} bind:this={rangeInput}
                                  bind:value={() => field === 'price' ? draft.priceMin : draft.yearMin, value => {
                                    if (field === 'price') draft.priceMin = value?.toString() ?? '';
                                    else draft.yearMin = value?.toString() ?? '';
                                  }} />
                                {#if field === 'price'}<span class="dn-search-unit" aria-hidden="true">{currencySymbol(i18n.locale)}</span>{/if}
                              </span>
                            </label>
                            <label>
                              <span>{i18n.t(field === 'price' ? 'm_363c4f34635c' : 'm_07339ff9faf8')}</span>
                              <span class="dn-search-range-control">
                                <input {@attach i18n.validation} type="number" min="0" step="1"
                                  aria-label={`${i18n.t(field === 'price' ? 'm_363c4f34635c' : 'm_07339ff9faf8')}${field === 'price' ? ' · ' + currencySymbol(i18n.locale) : ''}`}
                                  placeholder={i18n.t('inventory.range.unlimited')} data-unit={field === 'price'}
                                  bind:value={() => field === 'price' ? draft.priceMax : draft.yearMax, value => {
                                    if (field === 'price') draft.priceMax = value?.toString() ?? '';
                                    else draft.yearMax = value?.toString() ?? '';
                                  }} />
                                {#if field === 'price'}<span class="dn-search-unit" aria-hidden="true">{currencySymbol(i18n.locale)}</span>{/if}
                              </span>
                            </label>
                          </div>
                          <div class="dn-search-presets">
                            {#each (field === 'price' ? ['30000', '50000', '70000', '100000'] : ['2020', '2021', '2022', '2023']) as value (value)}
                              <button type="button" data-active={(field === 'price' ? draft.priceMax : draft.yearMin) === value} onclick={() => { if (field === 'price') draft.priceMax = value; else draft.yearMin = value; }}>{field === 'price' ? i18n.t('inventory.search.upTo', { value: new Intl.NumberFormat(i18n.locale).format(Number(value)), currency: currencySymbol(i18n.locale) }) : i18n.t('inventory.search.fromYear', { year: value })}</button>
                            {/each}
                          </div>
                        {/if}
                        {#if invalidRange}<p class="dn-search-range-error" role="alert">{i18n.t(draft.priceMin && draft.priceMax && Number(draft.priceMin) > Number(draft.priceMax) ? 'm_2157bc34d38a' : 'm_e35acfc7ae2e')}</p>{/if}
                      </div>
                    {:else}
                      <Command.List class="dn-search-results" aria-label={title} aria-multiselectable={field === 'equipment'}>
                        <Command.Viewport>
                          {#if field}
                            {#if field !== 'equipment' && !search}
                              <Command.Item class="dn-search-row" value="clear-field" aria-checked={!activeFields.includes(field)} onSelect={() => field && clear(field)}>
                                <span class="dn-search-row-label">{i18n.t(field === 'make' ? 'inventory.search.allMakes' : field === 'model' ? 'inventory.search.allModels' : 'inventory.search.any')}</span>
                                <span class="dn-search-check" data-checked={!activeFields.includes(field)} aria-hidden="true">✓</span>
                              </Command.Item>
                            {/if}
                            {#each choices as choice (choice.value)}{@render optionRow(choice)}{/each}
                            {#if !choices.length}
                              <div class="dn-search-empty"><p role="status">{i18n.t('inventory.search.empty')}</p>{#if search}<button type="button" onclick={() => { search = ''; void focusSearch(); }}>{i18n.t('inventory.search.clearQuery')}</button>{/if}</div>
                            {/if}
                          {:else}
                            {#if searchChoices.length}
                              <Command.Group>
                                <Command.GroupHeading class="dn-search-group-title">{search ? i18n.t('inventory.search.matches') : listingFacetTitle('make', i18n.locale)}</Command.GroupHeading>
                                <Command.GroupItems>{#each searchChoices as choice (choice.field + ':' + choice.value)}{@render optionRow(choice)}{/each}</Command.GroupItems>
                              </Command.Group>
                            {/if}
                            {#if search.trim()}
                              {#each filteredFields as item (item)}<Command.Item class="dn-search-row" value={'field:' + item} onSelect={() => browse(item)}><span>{listingFacetTitle(item, i18n.locale)}</span><Icon name="arrow-right" size={16} /></Command.Item>{/each}
                              <Command.Item class="dn-search-row dn-search-keyword" value="keyword" onSelect={() => { draft.q = search.trim(); search = ''; commandValue = ''; }}><Icon name="search" size={17} /><span>{i18n.t('inventory.search.keyword', { query: search.trim() })}</span><small>{i18n.t('inventory.search.keywordLabel')}</small></Command.Item>
                            {/if}
                          {/if}
                        </Command.Viewport>
                      </Command.List>
                    {/if}
                  </Command.Root>
                {/key}
              {/if}
            </Tabs.Content>
          {/each}
        </Tabs.Root>
        <footer class="dn-search-footer">
          <button class="dn-search-reset" type="button" disabled={!activeFields.length && !draft.q} onclick={clearAll}>{i18n.t('inventory.search.clearAll')}</button>
          <button class="dn-search-apply" type="submit" disabled={invalidRange} aria-live="polite">{matching === 1 ? i18n.t('m_047e325f6562') : i18n.t('m_08d2ff28407e', { p0: matching })}<Icon name="arrow-right" size={16} /></button>
        </footer>
        {#each hiddenFields as [name, value], index (name + '-' + value + '-' + index)}<input type="hidden" {name} {value} />{/each}
      </form>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  :global(.dn-search-sr-only) { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  :global(.dn-search-overlay) { position: fixed; inset: 0; z-index: 11000; background: rgb(18 20 25 / .32); backdrop-filter: blur(2px); }
  :global(.dn-search-dialog) { position: fixed; z-index: 11001; top: 50%; left: 50%; width: min(860px, calc(100vw - 64px)); height: min(704px, calc(100dvh - 64px)); overflow: hidden; border: 1px solid var(--dn-line); border-radius: var(--dn-radius); background: var(--dn-surface-raised); color: var(--dn-ink); box-shadow: var(--dn-shadow); transform: translate(-50%, -50%); }
  form { display: flex; flex-direction: column; height: 100%; min-width: 0; min-height: 0; margin: 0; }
  .dn-filter-header { display: flex; flex-shrink: 0; align-items: center; gap: var(--dn-space-3); height: 64px; padding: 0 var(--dn-space-6); }
  :global(.dn-filter-title) { margin: 0; font-size: var(--dn-text-card); font-weight: var(--dn-weight-semibold); }
  .dn-filter-count { display: grid; place-items: center; min-width: var(--dn-space-6); height: var(--dn-space-6); padding-inline: var(--dn-space-1); border-radius: var(--dn-radius-xs); background: var(--dn-surface-subtle); color: var(--dn-muted); font-size: var(--dn-text-meta); }
  :global(.dn-search-close), .dn-search-icon { display: grid; flex: 0 0 var(--dn-control-height-compact); place-items: center; width: var(--dn-control-height-compact); height: var(--dn-control-height-compact); padding: 0; border: 0; border-radius: var(--dn-radius-sm); background: transparent; color: var(--dn-muted); cursor: pointer; }
  :global(.dn-search-close) { margin-left: auto; }
  :global(.dn-search-close:hover), .dn-search-icon:hover { background: var(--dn-surface-subtle); color: var(--dn-ink); }
  :global(.dn-filter-workspace) { display: grid; flex: 1; grid-template-columns: 204px minmax(0, 1fr); min-width: 0; min-height: 0; }
  :global(.dn-filter-nav) { display: flex; grid-column: 1; grid-row: 1; flex-direction: column; gap: var(--dn-space-half); min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: var(--dn-space-2); background: var(--dn-surface-subtle); scrollbar-width: thin; }
  :global(.dn-filter-tab) { display: flex; flex: 0 0 var(--dn-control-height-compact); align-items: center; gap: var(--dn-space-2); width: 100%; height: var(--dn-control-height-compact); padding: 0 var(--dn-space-3); border: 0; border-radius: var(--dn-radius-xs); background: transparent; color: var(--dn-muted); font: var(--dn-control-font); font-size: var(--dn-text-body); text-align: left; cursor: pointer; }
  :global(.dn-filter-tab:hover) { color: var(--dn-ink); }
  :global(.dn-filter-tab[data-state='active']) { background: var(--dn-surface-raised); color: var(--dn-ink); font-weight: var(--dn-weight-semibold); }
  .dn-filter-tab-text { display: flex; flex: 1; flex-direction: column; min-width: 0; }
  .dn-filter-tab-text > span, .dn-filter-tab-text > small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dn-filter-tab-text > small { color: var(--dn-muted); font-size: var(--dn-text-meta); font-weight: var(--dn-weight-ui); line-height: var(--dn-leading-control); }
  .dn-filter-dot { flex: 0 0 var(--dn-space-half); width: var(--dn-space-half); height: var(--dn-space-2); border-radius: var(--dn-radius-xs); background: var(--dn-red); }
  :global(.dn-filter-panel) { display: flex; grid-column: 2; grid-row: 1; min-width: 0; min-height: 0; padding: var(--dn-space-4) var(--dn-space-7); }
  :global(.dn-filter-panel[hidden]) { display: none; }
  :global(.dn-search-command) { display: flex; flex: 1; flex-direction: column; min-width: 0; min-height: 0; }
  .dn-filter-panel-heading { display: flex; flex-shrink: 0; align-items: center; justify-content: space-between; gap: var(--dn-space-3); height: var(--dn-control-height-default); margin-bottom: var(--dn-space-4); }
  h3 { margin: 0; font-size: var(--dn-text-card); font-weight: var(--dn-weight-semibold); }
  .dn-search-query { display: flex; flex-shrink: 0; align-items: center; gap: var(--dn-space-3); height: var(--dn-control-height-default); margin-bottom: var(--dn-space-3); padding-inline: var(--dn-space-3); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-sm); color: var(--dn-muted); }
  .dn-search-query:has(:global(.dn-search-input:focus-visible)) { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
  :global(.dn-search-input) { width: 100%; min-width: 0; height: 100%; padding: 0; border: 0; outline: 0; background: transparent; color: var(--dn-ink); font: var(--dn-entry-font); font-size: var(--dn-text-body); box-shadow: none; }
  :global(.dn-search-input::placeholder) { color: var(--dn-muted); }
  :global(.dn-search-results) { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; scroll-padding-block: var(--dn-space-2); scrollbar-width: thin; }
  :global(.dn-search-group-title) { padding: var(--dn-space-2) var(--dn-space-3); color: var(--dn-muted); font-size: var(--dn-text-meta); font-weight: var(--dn-weight-medium); }
  :global(.dn-search-row) { display: flex; align-items: center; gap: var(--dn-space-3); min-height: var(--dn-control-height-default); padding: var(--dn-space-2) var(--dn-space-3); border-radius: var(--dn-radius-xs); outline: 0; color: var(--dn-ink); font: var(--dn-control-font); font-size: var(--dn-text-body); cursor: pointer; }
  :global(.dn-search-row[data-selected]), :global(.dn-search-choice[aria-checked='true']) { background: var(--dn-surface-subtle); }
  :global(.dn-search-row[aria-checked='true'] > .dn-search-row-label) { font-weight: var(--dn-weight-semibold); }
  :global(.dn-search-row > span:not(.dn-search-check):not(.dn-search-row-count)) { flex: 1; min-width: 0; }
  :global(.dn-search-row small), .dn-search-row-count { color: var(--dn-muted); font-size: var(--dn-text-meta); font-weight: var(--dn-weight-ui); }
  :global(.dn-search-row small) { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dn-search-row-label { display: flex; align-items: center; gap: var(--dn-space-3); }
  .dn-search-row-count { font-variant-numeric: tabular-nums; }
  .dn-search-check { display: grid; flex: 0 0 var(--dn-space-4); place-items: center; width: var(--dn-space-4); height: var(--dn-space-4); color: transparent; font-size: var(--dn-text-body); line-height: var(--dn-leading-control); }
  .dn-search-check[data-checked='true'] { color: var(--dn-ink); }
  .dn-search-check[data-multiple='true'] { border: 1px solid var(--dn-line-strong); border-radius: var(--dn-space-1); font-size: var(--dn-text-meta); }
  .dn-search-check[data-multiple='true'][data-checked='true'] { border-color: var(--dn-ink); background: var(--dn-ink); color: var(--dn-white); }
  .dn-search-empty { padding: var(--dn-space-8) var(--dn-space-3); color: var(--dn-muted); text-align: center; font-size: var(--dn-text-meta); }
  .dn-search-empty p { margin: 0 0 var(--dn-space-3); }
  .dn-search-empty button, .dn-search-clear-field, .dn-search-reset { min-height: var(--dn-control-height-compact); padding: var(--dn-space-2); border: 0; border-radius: var(--dn-radius-xs); background: transparent; color: var(--dn-muted); font: var(--dn-control-font); font-size: var(--dn-text-meta); cursor: pointer; }
  .dn-search-empty button:hover, .dn-search-clear-field:hover, .dn-search-reset:hover { color: var(--dn-ink); text-decoration: underline; }
  .dn-search-reset:disabled { opacity: .45; cursor: default; text-decoration: none; }
  .dn-search-range-fields { display: grid; grid-template-columns: 1fr 1fr; gap: var(--dn-space-4); }
  label { display: grid; gap: var(--dn-space-2); font: var(--dn-control-font); font-size: var(--dn-text-meta); }
  .dn-search-range-control { position: relative; display: block; }
  .dn-search-unit { position: absolute; top: 50%; right: var(--dn-space-3); color: var(--dn-muted); transform: translateY(-50%); pointer-events: none; }
  input[type='number'] { width: 100%; height: var(--dn-control-height-default); padding: 0 var(--dn-space-3); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-sm); background: var(--dn-surface-raised); color: var(--dn-ink); font: var(--dn-entry-font); font-size: var(--dn-text-body); appearance: textfield; }
  input[type='number'][data-unit='true'] { padding-right: var(--dn-control-height-compact); }
  input[type='number']::placeholder { color: var(--dn-muted); font-size: var(--dn-text-meta); }
  input[type='number']::-webkit-inner-spin-button, input[type='number']::-webkit-outer-spin-button { margin: 0; appearance: none; }
  .dn-search-presets { display: flex; flex-wrap: wrap; gap: var(--dn-space-2); margin-top: var(--dn-space-5); }
  .dn-search-presets button { min-height: var(--dn-control-height-compact); padding: var(--dn-space-2) var(--dn-space-4); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-sm); background: var(--dn-surface-raised); color: var(--dn-ink); font: var(--dn-control-font); font-size: var(--dn-text-meta); cursor: pointer; }
  .dn-search-presets button:hover { background: var(--dn-surface-subtle); }
  .dn-search-presets button[data-active='true'] { border-color: var(--dn-ink); background: var(--dn-ink); color: var(--dn-white); }
  .dn-search-range-error { margin: var(--dn-space-3) 0 0; color: var(--dn-red); font-size: var(--dn-text-meta); }
  .dn-search-footer { display: flex; flex-shrink: 0; align-items: center; justify-content: space-between; gap: var(--dn-space-4); height: 72px; padding: 0 var(--dn-space-6); border-top: 1px solid var(--dn-line); }
  .dn-search-apply { display: flex; flex-shrink: 0; align-items: center; justify-content: space-between; gap: var(--dn-space-5); width: 280px; min-height: var(--dn-control-height-default); padding: var(--dn-space-2) var(--dn-space-4); border: 0; border-radius: var(--dn-radius-button); background: var(--dn-red); color: var(--dn-white); font: var(--dn-control-font); white-space: nowrap; cursor: pointer; }
  .dn-search-apply:hover { background: var(--dn-red-hover); }
  .dn-search-apply:disabled { opacity: .45; cursor: not-allowed; }
  button:focus-visible, input[type='number']:focus-visible, :global(.dn-search-close:focus-visible), :global(.dn-filter-tab:focus-visible) { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
</style>
