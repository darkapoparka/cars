<script lang="ts">
  import { Command, Dialog } from 'bits-ui';
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
  const fields: readonly Field[] = ['make', 'model', 'type', 'body', 'price', 'year', 'fuel', 'transmission', 'mileage_max', 'condition', 'version', 'equipment'];
  let draft = $state<ListingDraft>(emptyListingDraft());
  let field = $state<Field>();
  let modelMake = $state('');
  let search = $state('');
  let searchInput = $state<HTMLInputElement | null>(null);
  let rangeInput = $state<HTMLInputElement | null>(null);
  let commandValue = $state('');
  const range = $derived(field === 'price' || field === 'year' || field === 'mileage_max');
  const title = $derived(field ? listingFacetTitle(field, i18n.locale) : i18n.t('m_3deeda2a1ebe'));
  const effectiveDraft = $derived({ ...draft, q: !field && search.trim() ? search.trim() : draft.q });
  const effectiveFilters = $derived(listingFiltersFromDraft(effectiveDraft));
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
  const choices = $derived(field && !range ? listingFacetOptions(field, field === 'model' ? modelMake : draft.make).filter(Boolean)
    .map(value => choice(field!, value)).filter(item => matches(`${item.label} ${item.make}`)) : []);
  const searchChoices = $derived(!field && search.trim() ? fields.flatMap(item =>
    listingFacetOptions(item, item === 'model' ? '' : draft.make).filter(Boolean).map(value => choice(item, value))
      .filter(option => matches(`${option.label} ${option.make}`))).slice(0, 40) : []);

  $effect(() => {
    if (!open) return;
    untrack(() => {
      draft = listingDraftFromFilters(filters);
      const requested = initialField?.startsWith('price') ? 'price' : initialField?.startsWith('year') ? 'year' : initialField;
      field = fields.find(item => item === requested);
      modelMake = draft.make;
      search = '';
      commandValue = '';
    });
  });

  function matches(value: string) {
    return search.trim().toLocaleLowerCase(i18n.locale).split(/\s+/).every(term => value.toLocaleLowerCase(i18n.locale).includes(term));
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
  function browse(item?: Field) { field = item; modelMake = draft.make; search = ''; commandValue = ''; void focusSearch(); }
  function select(item: Choice) {
    if (isSelected(item) && item.field !== 'equipment') clear(item.field);
    else draft = candidate(item);
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
  }
  function apply(event: SubmitEvent) {
    if (invalidRange) { event.preventDefault(); return; }
    open = false;
  }
  function returnToPage(event: Event) {
    event.preventDefault();
    void tick().then(() => returnFocus?.focus({ preventScroll: true }));
  }
  function keyboard(event: KeyboardEvent) {
    if (event.key === 'Backspace' && !search && field && event.target === searchInput) browse();
  }
  function controlKeyboard(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.target instanceof Element && (event.target.closest('button') || event.target.matches('input[type="number"]'))) event.stopPropagation();
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay class="dn-search-overlay" />
    <Dialog.Content id="dn-listing-filter-dialog" class="dn-search-dialog" style={`--dn-search-list-height: ${!field || field === 'model' || field === 'equipment' ? 320 : 224}px`} onOpenAutoFocus={event => { event.preventDefault(); void focusSearch(); }} onCloseAutoFocus={returnToPage}>
      <Dialog.Title class="dn-search-sr-only">{title}</Dialog.Title>
      <Dialog.Description class="dn-search-sr-only">{i18n.t('inventory.search.placeholder')}</Dialog.Description>
      <form method="GET" action={i18n.href(resolve('/listing-grid'))} onsubmit={apply} onformdata={event => cleanListingFormData(event.formData)}>
        <Command.Root class="dn-search-command" shouldFilter={false} columns={!field && !search ? 2 : 1} loop bind:value={commandValue} label={title}>
          <div class="dn-search-header" role="presentation" onkeydown={controlKeyboard}>
            {#if field}
              <button class="dn-search-back" type="button" aria-label={i18n.t('m_a779c56e526e')} title={i18n.t('m_3deeda2a1ebe')} onclick={() => browse()}><Icon name="arrow-left" size={18} /></button>
              <span class="dn-search-scope">{title}</span>
            {:else}<span class="dn-search-symbol"><Icon name="search" size={21} /></span>{/if}
            {#if !range}
              <Command.Input class="dn-search-input" bind:ref={searchInput} bind:value={search} aria-label={field ? title : i18n.t('inventory.search.placeholder')} placeholder={field ? i18n.t('inventory.search.within') : i18n.t('inventory.search.placeholder')} autocomplete="off" onkeydown={keyboard} />
            {:else}<span class="dn-search-range-space"></span>{/if}
            {#if search}<button class="dn-search-icon" type="button" aria-label={i18n.t('inventory.search.clearQuery')} onclick={() => { search = ''; void focusSearch(); }}><Icon name="x" size={16} /></button>{/if}
            <Dialog.Close class="dn-search-icon dn-search-close" type="button" aria-label={i18n.t('m_84305a580997')}><Icon name="x" size={19} /></Dialog.Close>
          </div>

          <div class="dn-search-tokens" role="toolbar" tabindex="-1" aria-label={i18n.t('m_3deeda2a1ebe')} onkeydown={controlKeyboard}>
            <button class="dn-search-add" type="button" onclick={() => browse()}><span aria-hidden="true">+</span>{i18n.t('inventory.search.addFilter')}</button>
            {#if draft.q}
              <div class="dn-search-token"><button type="button" onclick={() => { browse(); search = draft.q; }}>{draft.q}</button><button type="button" aria-label={`${i18n.t('action.clearShort')}: ${draft.q}`} onclick={() => clear('q')}><Icon name="x" size={12} /></button></div>
            {/if}
            {#each activeFields as item (item)}
              <div class="dn-search-token"><button type="button" onclick={() => browse(item)}><span>{listingFacetTitle(item, i18n.locale)}</span>{listingFacetSummary(item, draft, i18n.locale)}</button><button type="button" aria-label={`${i18n.t('action.clearShort')}: ${listingFacetTitle(item, i18n.locale)}`} onclick={() => clear(item)}><Icon name="x" size={12} /></button></div>
            {/each}
          </div>

          {#if range}
            <div class="dn-search-results dn-search-range" role="presentation" onkeydown={controlKeyboard}>
              {#if field === 'mileage_max'}
                <label><span>{listingFacetTitle('mileage_max', i18n.locale)} · {i18n.t('inventory.search.kilometres')}</span><input {@attach i18n.validation} type="number" min="0" step="1" bind:this={rangeInput} bind:value={() => draft.mileageMax, value => draft.mileageMax = value?.toString() ?? ''} /></label>
                <div class="dn-search-presets">{#each listingFilterOptions.mileages.filter(Boolean) as value (value)}<button type="button" data-active={draft.mileageMax === value} onclick={() => draft.mileageMax = value}>{new Intl.NumberFormat(i18n.locale).format(Number(value))} {i18n.t('inventory.search.kilometres')}</button>{/each}</div>
              {:else}
                <div class="dn-search-range-fields">
                  <label><span>{i18n.t(field === 'price' ? 'm_94470b41eead' : 'm_349ee8568241')}{field === 'price' ? ' · ' + currencySymbol(i18n.locale) : ''}</span><input {@attach i18n.validation} type="number" min="0" step="1" bind:this={rangeInput} bind:value={() => field === 'price' ? draft.priceMin : draft.yearMin, value => { if (field === 'price') draft.priceMin = value?.toString() ?? ''; else draft.yearMin = value?.toString() ?? ''; }} /></label>
                  <label><span>{i18n.t(field === 'price' ? 'm_363c4f34635c' : 'm_07339ff9faf8')}{field === 'price' ? ' · ' + currencySymbol(i18n.locale) : ''}</span><input {@attach i18n.validation} type="number" min="0" step="1" bind:value={() => field === 'price' ? draft.priceMax : draft.yearMax, value => { if (field === 'price') draft.priceMax = value?.toString() ?? ''; else draft.yearMax = value?.toString() ?? ''; }} /></label>
                </div>
                <div class="dn-search-presets">
                  {#each (field === 'price' ? ['30000', '50000', '70000', '100000'] : ['2020', '2021', '2022', '2023']) as value (value)}
                    <button type="button" data-active={(field === 'price' ? draft.priceMax : draft.yearMin) === value} onclick={() => { if (field === 'price') draft.priceMax = value; else draft.yearMin = value; }}>{field === 'price' ? i18n.t('inventory.search.upTo', { value: new Intl.NumberFormat(i18n.locale).format(Number(value)), currency: currencySymbol(i18n.locale) }) : i18n.t('inventory.search.fromYear', { year: value })}</button>
                  {/each}
                </div>
              {/if}
              <button class="dn-search-unlimited" type="button" onclick={() => field && clear(field)}>{i18n.t('inventory.range.unlimited')}</button>
              {#if invalidRange}<p class="dn-search-range-error" role="alert">{i18n.t(draft.priceMin && draft.priceMax && Number(draft.priceMin) > Number(draft.priceMax) ? 'm_2157bc34d38a' : 'm_e35acfc7ae2e')}</p>{/if}
            </div>
          {:else}
            <Command.List class="dn-search-results" aria-multiselectable={field === 'equipment'}>
              <Command.Viewport>
                {#if field}
                  {#if field !== 'equipment' && !search}
                    <Command.Item class="dn-search-row" value="clear-field" aria-checked={!activeFields.includes(field)} onSelect={() => field && clear(field)}>
                      <span>{i18n.t('inventory.search.any')}</span><span class="dn-search-check" data-checked={!activeFields.includes(field)}>✓</span>
                    </Command.Item>
                  {/if}
                  {#each choices as item (`${item.field}:${item.value}`)}
                    <Command.Item class="dn-search-row" value={`${item.field}:${item.value}`} aria-checked={isSelected(item)} onSelect={() => select(item)}>
                      <span class="dn-search-row-label">{item.label}{#if item.make && !modelMake}<small>{item.make}</small>{/if}</span>
                      <span class="dn-search-row-count">{choiceCount(item)}</span><span class="dn-search-check" data-checked={isSelected(item)}>✓</span>
                    </Command.Item>
                  {/each}
                  {#if !choices.length}<p class="dn-search-empty" role="status">{i18n.t('inventory.search.empty')}</p>{/if}
                {:else}
                  {#if searchChoices.length}
                    <Command.Group>
                      <Command.GroupHeading class="dn-search-group-title">{i18n.t('inventory.search.matches')}</Command.GroupHeading>
                      <Command.GroupItems>{#each searchChoices as item (`${item.field}:${item.value}`)}
                        <Command.Item class="dn-search-row" value={`${item.field}:${item.value}`} aria-checked={isSelected(item)} onSelect={() => select(item)}><span>{item.label}</span><small>{listingFacetTitle(item.field, i18n.locale)}{item.make ? ' · ' + item.make : ''}</small><span class="dn-search-check" data-checked={isSelected(item)}>✓</span></Command.Item>
                      {/each}</Command.GroupItems>
                    </Command.Group>
                  {/if}
                  {#if filteredFields.length}
                    <Command.Group>
                      <Command.GroupHeading class="dn-search-group-title">{i18n.t('m_546ebb8eb993')}</Command.GroupHeading>
                      <Command.GroupItems class="dn-search-field-grid" data-grid={!search}>{#each filteredFields as item (item)}
                        <Command.Item class="dn-search-row" value={`field:${item}`} data-field={item} onSelect={() => browse(item)}><span>{listingFacetTitle(item, i18n.locale)}</span>{#if activeFields.includes(item)}<small>{listingFacetSummary(item, draft, i18n.locale)}</small>{/if}<Icon name="arrow-right" size={16} /></Command.Item>
                      {/each}</Command.GroupItems>
                    </Command.Group>
                  {/if}
                  {#if search.trim()}
                    <Command.Item class="dn-search-row dn-search-keyword" value="keyword" onSelect={() => { draft.q = search.trim(); search = ''; commandValue = ''; }}><Icon name="search" size={17} /><span>{i18n.t('inventory.search.keyword', { query: search.trim() })}</span><small>{i18n.t('inventory.search.keywordLabel')}</small></Command.Item>
                  {/if}
                {/if}
              </Command.Viewport>
            </Command.List>
          {/if}
        </Command.Root>
        <footer class="dn-search-footer">
          <div class="dn-search-hints" aria-hidden="true">{#if !range}<span><kbd>↑</kbd><kbd>↓</kbd>{i18n.t('inventory.search.navigate')}</span><span><kbd>↵</kbd>{i18n.t('inventory.search.select')}</span>{/if}</div>
          {#if activeFields.length || draft.q}<button class="dn-search-reset" type="button" onclick={() => { draft = emptyListingDraft(filters.sort); search = ''; void focusSearch(); }}>{i18n.t('action.clearShort')}</button>{/if}
          <button class="dn-search-apply" type="submit" disabled={invalidRange} aria-live="polite">{matching === 1 ? i18n.t('m_047e325f6562') : i18n.t('m_08d2ff28407e', { p0: matching })}<Icon name="arrow-right" size={16} /></button>
        </footer>
        {#each hiddenFields as [name, value], index (`${name}-${value}-${index}`)}<input type="hidden" {name} {value} />{/each}
      </form>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  :global(.dn-search-sr-only) { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  :global(.dn-search-overlay) { position: fixed; inset: 0; z-index: 11000; background: rgb(18 20 25 / .32); backdrop-filter: blur(3px); }
  :global(.dn-search-dialog) { position: fixed; z-index: 11001; top: min(128px, 15dvh); left: 50%; width: min(680px, calc(100vw - 64px)); overflow: hidden; border: 1px solid rgb(0 0 0 / .08); border-radius: 16px; background: var(--dn-white); color: var(--dn-ink); box-shadow: 0 24px 80px rgb(0 0 0 / .2), 0 2px 8px rgb(0 0 0 / .06); transform: translateX(-50%); }
  form { margin: 0; }
  .dn-search-header { display: flex; align-items: center; gap: 12px; height: 72px; padding: 0 20px; border-bottom: 1px solid var(--dn-line); }
  .dn-search-symbol { color: var(--dn-muted); }
  .dn-search-scope { flex-shrink: 0; padding-right: 16px; border-right: 1px solid var(--dn-line); font-size: var(--dn-text-control-prominent); font-weight: var(--dn-weight-semibold); }
  :global(.dn-search-input) { width: 100%; min-width: 0; height: 100%; padding: 0; border: 0; outline: 0; background: transparent; color: var(--dn-ink); font: var(--dn-entry-font); font-size: var(--dn-text-control-prominent); box-shadow: none; }
  :global(.dn-search-input::placeholder) { color: var(--dn-muted); }
  .dn-search-range-space { flex: 1; }
  .dn-search-back, .dn-search-icon, :global(.dn-search-close) { display: grid; flex: 0 0 32px; place-items: center; width: 32px; height: 32px; padding: 0; border: 0; border-radius: 8px; background: transparent; color: var(--dn-muted); cursor: pointer; }
  .dn-search-back { background: var(--dn-surface-subtle); color: var(--dn-ink); }
  .dn-search-icon:hover, .dn-search-back:hover, :global(.dn-search-close:hover) { background: var(--dn-surface-hover); color: var(--dn-ink); }
  .dn-search-tokens { display: flex; align-items: center; gap: 8px; height: 56px; overflow-x: auto; padding: 0 20px; scrollbar-width: thin; }
  .dn-search-add { display: flex; flex: 0 0 auto; align-items: center; gap: 6px; height: 30px; padding: 0 8px; border: 1px dashed var(--dn-line); border-radius: 6px; background: transparent; color: var(--dn-muted); font: var(--dn-control-font); font-size: var(--dn-text-meta); cursor: pointer; }
  .dn-search-add > span { font-size: var(--dn-text-card); line-height: var(--dn-leading-control); }
  .dn-search-token { display: flex; flex: 0 0 auto; align-items: center; max-width: 330px; height: 30px; overflow: hidden; border: 1px solid var(--dn-line); border-radius: 6px; background: var(--dn-surface-subtle); }
  .dn-search-token button { display: flex; align-items: center; gap: 8px; min-width: 0; height: 100%; padding: 0 8px; border: 0; background: transparent; color: var(--dn-ink); font: var(--dn-control-font); font-size: var(--dn-text-meta); white-space: nowrap; cursor: pointer; }
  .dn-search-token button > span { color: var(--dn-muted); font-weight: var(--dn-weight-ui); }
  .dn-search-token button:hover, .dn-search-add:hover { background: var(--dn-surface-hover); }
  :global(.dn-search-results) { height: min(var(--dn-search-list-height, 320px), calc(100dvh - 310px)); min-height: 180px; overflow-y: auto; overscroll-behavior: contain; padding: 0 8px 8px; scrollbar-width: thin; }
  :global(.dn-search-group-title) { padding: 8px 12px; color: var(--dn-muted); font-size: var(--dn-text-caption); font-weight: var(--dn-weight-medium); }
  :global(.dn-search-field-grid[data-grid='true']) { display: grid; grid-template-columns: 1fr 1fr; column-gap: 16px; }
  :global(.dn-search-row) { display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 10px 12px; border-radius: 8px; outline: 0; color: var(--dn-ink); font: var(--dn-control-font); font-size: var(--dn-text-body); cursor: pointer; }
  :global(.dn-search-row[data-selected]) { background: var(--dn-surface-subtle); }
  :global(.dn-search-row > span:not(.dn-search-check):not(.dn-search-row-count)) { flex: 1; min-width: 0; }
  :global(.dn-search-row small) { overflow: hidden; color: var(--dn-muted); font-size: var(--dn-text-caption); font-weight: var(--dn-weight-ui); text-overflow: ellipsis; white-space: nowrap; }
  .dn-search-row-label { display: flex; align-items: center; gap: 12px; }
  .dn-search-row-count { color: var(--dn-muted); font-size: var(--dn-text-caption); font-variant-numeric: tabular-nums; }
  .dn-search-check { width: 16px; color: var(--dn-ink); visibility: hidden; }
  .dn-search-check[data-checked='true'] { visibility: visible; }
  .dn-search-empty { margin: 32px 12px; color: var(--dn-muted); text-align: center; font-size: var(--dn-text-meta); }
  .dn-search-range { padding: 20px; }
  .dn-search-range-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  label { display: grid; gap: 10px; font: var(--dn-control-font); font-size: var(--dn-text-meta); }
  label span { color: var(--dn-muted); }
  input[type='number'] { width: 100%; height: 48px; padding: 0 12px; border: 1px solid var(--dn-line); border-radius: 8px; background: var(--dn-white); color: var(--dn-ink); font: var(--dn-entry-font); font-size: var(--dn-text-control-prominent); }
  .dn-search-presets { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
  .dn-search-presets button { min-height: 34px; padding: 6px 10px; border: 1px solid var(--dn-line); border-radius: 6px; background: transparent; color: var(--dn-ink); font: var(--dn-control-font); font-size: var(--dn-text-meta); cursor: pointer; }
  .dn-search-presets button[data-active='true'] { border-color: var(--dn-ink); background: var(--dn-surface-subtle); }
  .dn-search-unlimited { margin-top: 20px; padding: 0; border: 0; background: transparent; color: var(--dn-muted); font: var(--dn-control-font); font-size: var(--dn-text-meta); cursor: pointer; }
  .dn-search-footer { display: flex; align-items: center; gap: 12px; min-height: 64px; padding: 12px 20px; border-top: 1px solid var(--dn-line); background: var(--dn-surface-subtle); }
  .dn-search-range-error { margin: 12px 0 0; color: var(--dn-red); font-size: var(--dn-text-meta); }
  .dn-search-hints { display: flex; flex: 1; align-items: center; gap: 14px; color: var(--dn-muted); font-size: var(--dn-text-caption); }
  .dn-search-hints > span { display: flex; align-items: center; gap: 4px; }
  kbd { display: grid; place-items: center; width: 18px; height: 18px; border: 1px solid var(--dn-line); border-radius: 4px; background: var(--dn-white); font: inherit; }
  .dn-search-reset { border: 0; background: transparent; color: var(--dn-muted); font: var(--dn-control-font); font-size: var(--dn-text-meta); cursor: pointer; }
  .dn-search-apply { display: flex; flex: 0 0 auto; align-items: center; gap: 12px; min-height: 36px; margin-left: auto; padding: 8px 14px; border: 0; border-radius: 7px; background: var(--dn-ink); color: var(--dn-white); font: var(--dn-control-font); font-size: var(--dn-text-meta); cursor: pointer; }
  .dn-search-apply:hover { background: var(--dn-ink-hover); }
  .dn-search-apply:disabled { opacity: .45; cursor: not-allowed; }
  button:focus-visible, input[type='number']:focus-visible, :global(.dn-search-close:focus-visible) { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
</style>
