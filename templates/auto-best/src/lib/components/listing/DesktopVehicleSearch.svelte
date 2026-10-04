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
  let tokenList = $state<HTMLDivElement | null>(null);
  let tokenScrolled = $state(false);
  let revealField = $state<Field | 'q'>();
  let commandValue = $state('');
  const range = $derived(field === 'price' || field === 'year' || field === 'mileage_max');
  const title = $derived(field ? listingFacetTitle(field, i18n.locale) : i18n.t('m_3deeda2a1ebe'));
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
  const showAddFilter = $derived(Boolean(field || search || activeFields.length || draft.q));
  const choices = $derived(field && !range ? options(field, field === 'model' ? modelMake : draft.make)
    .map(value => choice(field!, value)).filter(item => matches(`${item.label} ${item.make}`)) : []);
  const searchChoices = $derived(!field && search.trim() ? fields.flatMap(item =>
    options(item, item === 'model' ? '' : draft.make).map(value => choice(item, value))
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
      revealField = field;
      tokenScrolled = false;
    });
  });

  $effect(() => {
    const target = revealField;
    if (!open || !tokenList || !target) return;
    // Follow the edited value without scrolling the fixed dialog or its actions.
    const value = target === 'q' ? draft.q : listingFacetSummary(target, draft, i18n.locale);
    if (!value) return;
    void tick().then(() => tokenList?.querySelector(`[data-token="${target}"]`)
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' }));
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
  function browse(item?: Field) { field = item; revealField = item; modelMake = draft.make; search = ''; commandValue = ''; void focusSearch(); }
  function select(item: Choice) {
    if (isSelected(item) && item.field !== 'equipment') clear(item.field);
    else draft = candidate(item);
    revealField = item.field;
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
    if (!(event.target instanceof Element)) return;
    const numeric = event.target.matches('input[type="number"]');
    if (numeric && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
      || event.key === 'Enter' && (numeric || event.target.closest('button'))) event.stopPropagation();
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay class="dn-search-overlay" />
    <Dialog.Content id="dn-listing-filter-dialog" class="dn-search-dialog" onOpenAutoFocus={event => { event.preventDefault(); void focusSearch(); }} onCloseAutoFocus={returnToPage}>
      <Dialog.Title class="dn-search-sr-only">{title}</Dialog.Title>
      <Dialog.Description class="dn-search-sr-only">{i18n.t('inventory.search.placeholder')}</Dialog.Description>
      <form method="GET" action={i18n.href(resolve('/listing-grid'))} onsubmit={apply} onformdata={event => cleanListingFormData(event.formData)}>
        <Command.Root class="dn-search-command" shouldFilter={false} columns={!field && !search ? 2 : 1} loop bind:value={commandValue} label={title}>
          <div class="dn-search-header" data-range={range} role="presentation" onkeydown={controlKeyboard}>
            {#if field}
              <button class="dn-search-back" type="button" aria-label={i18n.t('m_a779c56e526e')} title={i18n.t('m_3deeda2a1ebe')} onclick={() => browse()}><Icon name="arrow-left" size={18} /></button>
              <span class="dn-search-scope">{title}</span>
            {:else}<span class="dn-search-symbol"><Icon name="search" size={21} /></span>{/if}
            {#if !range}
              <Command.Input class="dn-search-input" bind:ref={searchInput} bind:value={search} aria-label={field ? title : i18n.t('inventory.search.placeholder')} placeholder={field ? i18n.t('inventory.search.within') : i18n.t('inventory.search.placeholder')} autocomplete="off" onkeydown={keyboard} />
            {:else}<span class="dn-search-range-space"></span>{/if}
            {#if search}<button class="dn-search-icon" type="button" aria-label={i18n.t('inventory.search.clearQuery')} title={i18n.t('inventory.search.clearQuery')} onclick={() => { search = ''; void focusSearch(); }}><Icon name="x" size={16} /></button>{/if}
            <Dialog.Close class="dn-search-icon dn-search-close" type="button" aria-label={i18n.t('m_84305a580997')} title={i18n.t('m_84305a580997')}><Icon name="x" size={19} /></Dialog.Close>
          </div>

          <div class="dn-search-tokens" role="toolbar" tabindex="-1" aria-label={i18n.t('m_3deeda2a1ebe')} onkeydown={controlKeyboard}>
            {#if showAddFilter}<button class="dn-search-add" type="button" onclick={() => browse()}><span aria-hidden="true">+</span>{i18n.t('inventory.search.addFilter')}</button>
            {:else}<span class="dn-search-section-title">{i18n.t('m_546ebb8eb993')}</span>{/if}
            <div class="dn-search-token-window" data-scrolled={tokenScrolled}>
              <div class="dn-search-token-list" bind:this={tokenList} onscroll={event => tokenScrolled = event.currentTarget.scrollLeft > 1}>
                {#if draft.q}
                  <div class="dn-search-token" data-token="q">
                    <button class="dn-search-token-edit" type="button" title={draft.q} onclick={() => { browse(); search = draft.q; }}>
                      <span class="dn-search-token-value">{draft.q}</span>
                    </button>
                    <button class="dn-search-token-remove" type="button" aria-label={`${i18n.t('action.clearShort')}: ${draft.q}`} onclick={() => clear('q')}><Icon name="x" size={14} /></button>
                  </div>
                {/if}
                {#each activeFields as item (item)}
                  <div class="dn-search-token" data-token={item}>
                    <button class="dn-search-token-edit" type="button" title={`${listingFacetTitle(item, i18n.locale)}: ${listingFacetSummary(item, draft, i18n.locale)}`} onclick={() => browse(item)}>
                      <span class="dn-search-token-label">{listingFacetTitle(item, i18n.locale)}</span>
                      <span class="dn-search-token-value">{listingFacetSummary(item, draft, i18n.locale)}</span>
                    </button>
                    <button class="dn-search-token-remove" type="button" aria-label={`${i18n.t('action.clearShort')}: ${listingFacetTitle(item, i18n.locale)}`} onclick={() => clear(item)}><Icon name="x" size={14} /></button>
                  </div>
                {/each}
              </div>
            </div>
            {#if field === 'make' && draft.make}
              <button class="dn-search-next" type="button" onclick={() => browse('model')}>{listingFacetTitle('model', i18n.locale)}<Icon name="arrow-right" size={16} /></button>
            {/if}
          </div>

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
              <button class="dn-search-unlimited" type="button" onclick={() => field && clear(field)}>{i18n.t('inventory.range.unlimited')}</button>
              {#if invalidRange}<p class="dn-search-range-error" role="alert">{i18n.t(draft.priceMin && draft.priceMax && Number(draft.priceMin) > Number(draft.priceMax) ? 'm_2157bc34d38a' : 'm_e35acfc7ae2e')}</p>{/if}
            </div>
          {:else}
            <Command.List class="dn-search-results" aria-multiselectable={field === 'equipment'}>
              <Command.Viewport>
                {#if field}
                  {#if field !== 'equipment' && !search}
                    <Command.Item class="dn-search-row" value="clear-field" aria-checked={!activeFields.includes(field)} onSelect={() => field && clear(field)}>
                      <span class="dn-search-row-label">{i18n.t('inventory.search.any')}</span><span class="dn-search-check" data-checked={!activeFields.includes(field)}>✓</span>
                    </Command.Item>
                  {/if}
                  {#each choices as item (`${item.field}:${item.value}`)}
                    <Command.Item class="dn-search-row dn-search-choice" value={`${item.field}:${item.value}`} aria-checked={isSelected(item)} onSelect={() => select(item)}>
                      <span class="dn-search-row-label">{item.label}{#if item.make && !modelMake}<small>{item.make}</small>{/if}</span>
                      <span class="dn-search-row-count">{choiceCount(item)}</span><span class="dn-search-check" data-checked={isSelected(item)}>✓</span>
                    </Command.Item>
                  {/each}
                  {#if !choices.length}
                    <div class="dn-search-empty">
                      <Icon name="search" size={24} /><p role="status">{i18n.t('inventory.search.empty')}</p>
                      {#if search}<button type="button" onkeydown={controlKeyboard} onclick={() => { search = ''; void focusSearch(); }}>{i18n.t('inventory.search.clearQuery')}</button>{/if}
                    </div>
                  {/if}
                {:else}
                  {#if searchChoices.length}
                    <Command.Group>
                      <Command.GroupHeading class="dn-search-group-title">{i18n.t('inventory.search.matches')}</Command.GroupHeading>
                      <Command.GroupItems>{#each searchChoices as item (`${item.field}:${item.value}`)}
                        <Command.Item class="dn-search-row dn-search-choice" value={`${item.field}:${item.value}`} aria-checked={isSelected(item)} onSelect={() => select(item)}><span class="dn-search-row-label">{item.label}</span><small>{listingFacetTitle(item.field, i18n.locale)}{item.make ? ' · ' + item.make : ''}</small><span class="dn-search-check" data-checked={isSelected(item)}>✓</span></Command.Item>
                      {/each}</Command.GroupItems>
                    </Command.Group>
                  {/if}
                  {#if filteredFields.length}
                    <Command.Group>
                      {#if search}<Command.GroupHeading class="dn-search-group-title">{i18n.t('m_546ebb8eb993')}</Command.GroupHeading>{/if}
                      <Command.GroupItems class="dn-search-field-grid" data-grid={!search}>{#each filteredFields as item (item)}
                        <Command.Item class="dn-search-row" value={`field:${item}`} data-field={item} onSelect={() => browse(item)}><span>{listingFacetTitle(item, i18n.locale)}</span>{#if activeFields.includes(item)}<small>{listingFacetSummary(item, draft, i18n.locale)}</small>{/if}<Icon name="arrow-right" size={16} /></Command.Item>
                      {/each}</Command.GroupItems>
                    </Command.Group>
                  {/if}
                  {#if search.trim()}
                    <Command.Item class="dn-search-row dn-search-keyword" value="keyword" onSelect={() => { draft.q = search.trim(); revealField = 'q'; search = ''; commandValue = ''; }}><Icon name="search" size={17} /><span>{i18n.t('inventory.search.keyword', { query: search.trim() })}</span><small>{i18n.t('inventory.search.keywordLabel')}</small></Command.Item>
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
  :global(.dn-search-overlay) { position: fixed; inset: 0; z-index: 11000; background: rgb(18 20 25 / .32); backdrop-filter: blur(2px); }
  :global(.dn-search-dialog) { --dn-search-top: min(128px, 15dvh); display: flex; position: fixed; z-index: 11001; top: var(--dn-search-top); left: 50%; width: min(680px, calc(100vw - 64px)); max-height: calc(100dvh - var(--dn-search-top) - 24px); overflow: hidden; border: 1px solid var(--dn-line); border-radius: var(--dn-radius-sheet); background: var(--dn-surface-raised); color: var(--dn-ink); box-shadow: var(--dn-shadow); transform: translateX(-50%); }
  form { display: flex; flex: 1; flex-direction: column; min-width: 0; min-height: 0; margin: 0; }
  :global(.dn-search-command) { display: flex; flex: 1; flex-direction: column; min-height: 0; }
  .dn-search-header { display: flex; flex-shrink: 0; align-items: center; gap: var(--dn-space-3); height: 72px; padding: 0 var(--dn-space-6); border-bottom: 1px solid var(--dn-line); }
  .dn-search-symbol { display: flex; color: var(--dn-muted); }
  .dn-search-scope { flex-shrink: 0; padding-right: var(--dn-space-4); border-right: 1px solid var(--dn-line); font-size: var(--dn-text-control-prominent); font-weight: var(--dn-weight-semibold); }
  .dn-search-header[data-range='true'] .dn-search-scope { padding-right: 0; border-right: 0; }
  :global(.dn-search-input) { width: 100%; min-width: 0; height: 100%; padding: 0; border: 0; outline: 0; background: transparent; color: var(--dn-ink); font: var(--dn-entry-font); font-size: var(--dn-text-control-prominent); box-shadow: none; }
  :global(.dn-search-input::placeholder) { color: var(--dn-muted); }
  .dn-search-range-space { flex: 1; }
  .dn-search-back, .dn-search-icon, :global(.dn-search-close) { display: grid; flex: 0 0 var(--dn-control-height-compact); place-items: center; width: var(--dn-control-height-compact); height: var(--dn-control-height-compact); padding: 0; border: 0; border-radius: var(--dn-radius-button); background: transparent; color: var(--dn-muted); cursor: pointer; }
  .dn-search-back { background: var(--dn-surface-subtle); color: var(--dn-ink); }
  .dn-search-icon:hover, .dn-search-back:hover, :global(.dn-search-close:hover) { background: var(--dn-surface-hover); color: var(--dn-ink); }
  .dn-search-tokens { display: flex; flex-shrink: 0; align-items: center; gap: var(--dn-space-2); height: 56px; padding: 0 var(--dn-space-6); }
  .dn-search-token-window { position: relative; flex: 1; min-width: 0; }
  .dn-search-token-window[data-scrolled='true']::before { content: ''; position: absolute; inset: 0 auto 0 0; z-index: 1; width: var(--dn-space-8); background: linear-gradient(to right, var(--dn-surface-raised) var(--dn-space-3), transparent); }
  .dn-search-token-window:has(button:focus-visible)::before { display: none; }
  .dn-search-token-list { display: flex; align-items: center; gap: var(--dn-space-2); min-width: 0; height: 56px; overflow-x: auto; overscroll-behavior-x: contain; scroll-padding-inline: var(--dn-space-1); padding-inline: var(--dn-space-1); scrollbar-width: none; }
  .dn-search-token-list::-webkit-scrollbar { display: none; }
  .dn-search-next { display: flex; flex: 0 0 auto; align-items: center; gap: var(--dn-space-2); height: var(--dn-control-height-compact); padding: 0 var(--dn-space-2); border: 0; border-radius: var(--dn-radius-button); background: transparent; color: var(--dn-ink); font: var(--dn-control-font); font-size: var(--dn-text-meta); cursor: pointer; }
  .dn-search-next:hover { background: var(--dn-surface-subtle); }
  .dn-search-section-title { color: var(--dn-muted); font: var(--dn-control-font); font-size: var(--dn-text-meta); }
  .dn-search-add { display: flex; flex: 0 0 auto; align-items: center; gap: var(--dn-space-2); height: var(--dn-control-height-compact); padding: 0 var(--dn-space-3); border: 1px solid transparent; border-radius: var(--dn-radius-button); background: var(--dn-surface-subtle); color: var(--dn-muted); font: var(--dn-control-font); font-size: var(--dn-text-meta); cursor: pointer; }
  .dn-search-add > span { font-size: var(--dn-text-card); line-height: var(--dn-leading-control); }
  .dn-search-token { display: flex; flex: 0 0 auto; align-items: center; max-width: 330px; height: var(--dn-control-height-compact); overflow: hidden; border: 1px solid var(--dn-line); border-radius: var(--dn-radius-button); background: var(--dn-surface-raised); }
  .dn-search-token button { display: flex; align-items: center; gap: var(--dn-space-2); min-width: 0; height: 100%; padding: 0 var(--dn-space-3); border: 0; background: transparent; color: var(--dn-ink); font: var(--dn-control-font); font-size: var(--dn-text-meta); white-space: nowrap; cursor: pointer; }
  .dn-search-token-edit { flex: 1; }
  .dn-search-token .dn-search-token-remove { flex: 0 0 var(--dn-control-height-compact); justify-content: center; padding: 0; }
  .dn-search-token-label { flex-shrink: 0; color: var(--dn-muted); font-weight: var(--dn-weight-ui); }
  .dn-search-token-value { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
  .dn-search-token button:hover, .dn-search-add:hover { background: var(--dn-surface-hover); }
  .dn-search-token:has(button:focus-visible) { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
  .dn-search-token button:focus-visible { outline: 0; background: var(--dn-surface-hover); }
  :global(.dn-search-results) { flex: 1 1 280px; height: 280px; min-height: 0; overflow-y: auto; overscroll-behavior: contain; scroll-padding-block: var(--dn-space-2); padding: var(--dn-space-2) var(--dn-space-4); scrollbar-width: thin; }
  :global(.dn-search-group-title) { padding: var(--dn-space-2); color: var(--dn-muted); font-size: var(--dn-text-meta); font-weight: var(--dn-weight-medium); }
  :global(.dn-search-field-grid[data-grid='true']) { display: grid; grid-template-columns: 1fr 1fr; column-gap: var(--dn-space-4); }
  :global(.dn-search-row) { display: flex; align-items: center; gap: var(--dn-space-3); min-height: var(--dn-control-height-default); padding: var(--dn-space-2); border-block: var(--dn-space-half) solid transparent; border-radius: var(--dn-radius-control); background-clip: padding-box; outline: 0; color: var(--dn-ink); font: var(--dn-control-font); font-size: var(--dn-text-body); cursor: pointer; }
  :global(.dn-search-row[data-selected]) { background-color: var(--dn-surface-subtle); }
  :global(.dn-search-row > span:not(.dn-search-check):not(.dn-search-row-count)) { flex: 1; min-width: 0; }
  :global(.dn-search-row[aria-checked='true'] > .dn-search-row-label) { font-weight: var(--dn-weight-semibold); }
  :global(.dn-search-row small) { overflow: hidden; color: var(--dn-muted); font-size: var(--dn-text-meta); font-weight: var(--dn-weight-ui); text-overflow: ellipsis; white-space: nowrap; }
  :global(.dn-search-row[data-field] > svg) { flex-shrink: 0; color: var(--dn-muted); }
  .dn-search-row-label { display: flex; align-items: center; gap: var(--dn-space-3); }
  .dn-search-row-count { color: var(--dn-muted); font-size: var(--dn-text-meta); font-variant-numeric: tabular-nums; }
  .dn-search-check { display: grid; flex: 0 0 20px; place-items: center; color: inherit; visibility: hidden; }
  .dn-search-check[data-checked='true'] { visibility: visible; }
  :global(.dn-search-choice[aria-checked='true']) { background-color: var(--dn-ink-strong); color: var(--dn-white); }
  :global(.dn-search-command:has(.dn-search-input:focus-visible) .dn-search-choice[aria-checked='true'][data-selected]) { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  :global(.dn-search-choice[aria-checked='true'] small), :global(.dn-search-choice[aria-checked='true'] .dn-search-row-count) { color: var(--dn-text-on-ink); }
  .dn-search-empty { display: grid; justify-items: center; gap: var(--dn-space-3); padding: var(--dn-space-8) var(--dn-space-3); color: var(--dn-muted); text-align: center; font-size: var(--dn-text-meta); }
  .dn-search-empty p { margin: 0; }
  .dn-search-empty button { min-height: var(--dn-control-height-compact); padding: var(--dn-space-2) var(--dn-space-4); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-button); background: var(--dn-surface-raised); color: var(--dn-ink); font: var(--dn-control-font); font-size: var(--dn-text-meta); cursor: pointer; }
  .dn-search-empty button:hover { background: var(--dn-surface-subtle); }
  .dn-search-range { padding: var(--dn-space-6); }
  .dn-search-range-fields { display: grid; grid-template-columns: 1fr 1fr; gap: var(--dn-space-4); }
  label { display: grid; gap: var(--dn-space-2); font: var(--dn-control-font); font-size: var(--dn-text-meta); }
  label > span { color: var(--dn-ink); }
  .dn-search-range-control { position: relative; display: block; }
  .dn-search-unit { position: absolute; top: 50%; right: var(--dn-space-3); color: var(--dn-muted); transform: translateY(-50%); pointer-events: none; }
  input[type='number'] { width: 100%; height: var(--dn-control-height-default); padding: 0 var(--dn-space-3); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-control); background: var(--dn-surface-raised); color: var(--dn-ink); font: var(--dn-entry-font); font-size: var(--dn-text-control-prominent); appearance: textfield; }
  input[type='number'][data-unit='true'] { padding-right: var(--dn-control-height-compact); }
  input[type='number']::placeholder { color: var(--dn-muted); font-size: var(--dn-text-meta); }
  input[type='number']::-webkit-inner-spin-button, input[type='number']::-webkit-outer-spin-button { margin: 0; appearance: none; }
  .dn-search-presets { display: flex; flex-wrap: wrap; gap: var(--dn-space-2); margin-top: var(--dn-space-5); }
  .dn-search-presets button { min-height: var(--dn-control-height-compact); padding: var(--dn-space-2) var(--dn-space-4); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-button); background: var(--dn-surface-raised); color: var(--dn-ink); font: var(--dn-control-font); font-size: var(--dn-text-meta); cursor: pointer; }
  .dn-search-presets button:hover { background: var(--dn-surface-subtle); }
  .dn-search-presets button[data-active='true'] { border-color: var(--dn-ink-strong); background: var(--dn-ink-strong); color: var(--dn-white); }
  .dn-search-unlimited { min-height: var(--dn-control-height-compact); margin-top: var(--dn-space-3); padding: var(--dn-space-2) 0; border: 0; background: transparent; color: var(--dn-muted); font: var(--dn-control-font); font-size: var(--dn-text-meta); cursor: pointer; }
  .dn-search-unlimited:hover { color: var(--dn-ink); text-decoration: underline; text-underline-offset: var(--dn-space-1); }
  .dn-search-footer { display: flex; flex-shrink: 0; align-items: center; gap: var(--dn-space-3); min-height: 72px; padding: var(--dn-space-3) var(--dn-space-6); border-top: 1px solid var(--dn-line); background: var(--dn-surface-raised); }
  .dn-search-range-error { margin: var(--dn-space-3) 0 0; color: var(--dn-red); font-size: var(--dn-text-meta); }
  .dn-search-hints { display: flex; flex: 1; align-items: center; gap: var(--dn-space-3); color: var(--dn-muted); font-size: var(--dn-text-meta); }
  .dn-search-hints > span { display: flex; align-items: center; gap: var(--dn-space-1); }
  kbd { display: grid; place-items: center; width: 20px; height: 20px; border: 1px solid var(--dn-line); border-radius: var(--dn-radius-xs); background: var(--dn-surface-subtle); font: inherit; }
  .dn-search-reset { min-height: var(--dn-control-height-compact); padding: var(--dn-space-2); border: 0; border-radius: var(--dn-radius-button); background: transparent; color: var(--dn-muted); font: var(--dn-control-font); font-size: var(--dn-text-meta); cursor: pointer; }
  .dn-search-reset:hover { background: var(--dn-surface-subtle); color: var(--dn-ink); }
  .dn-search-apply { display: flex; flex: 0 0 auto; align-items: center; justify-content: space-between; gap: var(--dn-space-3); min-width: 272px; min-height: var(--dn-control-height-default); margin-left: auto; padding: 10px var(--dn-space-4); border: 0; border-radius: var(--dn-radius-button); background: var(--dn-ink-strong); color: var(--dn-white); font: var(--dn-control-font); white-space: nowrap; cursor: pointer; }
  .dn-search-apply:hover { background: var(--dn-ink-hover); }
  .dn-search-apply:disabled { opacity: .45; cursor: not-allowed; }
  button:focus-visible, input[type='number']:focus-visible, :global(.dn-search-close:focus-visible) { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
</style>
