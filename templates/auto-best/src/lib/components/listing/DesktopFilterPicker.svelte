<script lang="ts">
  import { tick, untrack } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import { getI18n } from '$lib/locale/context';
  import { currencySymbol } from '$lib/locale/core';
  import { templateMessage } from '$lib/i18n/presentation';
  import { filterListingVehicles, listingFilterOptions, listingModelsForMake, listingVehicles } from '$data/listing';
  import { listingFacetOptions, listingFacetOptionLabel, listingFacetSummary, listingFacetTitle, listingFiltersFromDraft, withListingMake, type ListingDraft, type ListingFacetField } from '$data/listing-draft';
  import Icon from '$components/ui/Icon.svelte';
  import type { VehicleEquipment } from '$data/inventory';

  type Field = Exclude<ListingFacetField, 'sort'>;
  let { field, draft = $bindable() }: { field: Field; draft: ListingDraft } = $props();
  const i18n = getI18n();
  const makeContext = untrack(() => draft.make);
  let pickerRoot: HTMLDivElement;
  const attachRoot: Attachment<HTMLDivElement> = node => { pickerRoot = node; };
  let search = $state('');
  $effect(() => { field; search = ''; });
  const vehicleIdentity = $derived(field === 'make' || field === 'model');
  const range = $derived(field === 'price' || field === 'year');
  const searchable = $derived(!range && field !== 'mileage_max');
  const title = $derived(listingFacetTitle(field, i18n.locale));
  const searchLabel = $derived(field === 'make' ? i18n.t('m_150bec5925bd') : field === 'model' ? i18n.t('m_269619120191') : i18n.t('m_49c266baaaa7') + ': ' + title);
  const options = $derived(listingFacetOptions(field, makeContext));
  const choices = $derived(options.filter(option => !search.trim() || Boolean(option) && search.trim().toLocaleLowerCase(i18n.locale).split(/\s+/).every(term => listingFacetOptionLabel(field, option, i18n.locale).toLocaleLowerCase(i18n.locale).includes(term))));
  const groups = $derived(field === 'model' && !makeContext
    ? listingFilterOptions.makes.filter(Boolean).map(make => ({ make, options: choices.filter(option => option && listingModelsForMake(make).includes(option)) })).filter(group => group.options.length)
    : [{ make: '', options: choices.filter(Boolean) }]);
  // Reserve only the space this field needs; typing never moves its footer.
  const listHeight = $derived(Math.min(320, options.length * 44 + (field === 'model' && !makeContext ? listingFilterOptions.makes.filter(Boolean).length * 28 : 0) + 16));
  const selected = (option: string) => field === 'equipment' ? draft.equipment.includes(option as VehicleEquipment) : field !== 'price' && field !== 'year' && field !== 'mileage_max' && draft[field] === option;
  const optionLabel = (option: string) => !option && vehicleIdentity ? listingFacetSummary(field, { ...draft, make: field === 'make' ? '' : draft.make, model: '' }, i18n.locale) : listingFacetOptionLabel(field, option, i18n.locale);
  function choiceCount(option: string) {
    let candidate = draft;
    if (field === 'make') candidate = withListingMake(draft, option);
    else if (field === 'model') {
      if (!makeContext) {
        const makes = listingFilterOptions.makes.filter(make => make && listingModelsForMake(make).includes(option));
        candidate = withListingMake(draft, makes.length === 1 ? makes[0] : '');
      }
      candidate = { ...candidate, model: option };
    } else if (field !== 'price' && field !== 'year' && field !== 'mileage_max' && field !== 'equipment') candidate = { ...draft, [field]: option };
    return filterListingVehicles(listingVehicles, listingFiltersFromDraft(candidate), i18n.locale).length;
  }
  async function clearSearch() {
    search = '';
    await tick();
    pickerRoot?.querySelector<HTMLInputElement>('input[type="search"]')?.focus({ preventScroll: true });
  }
  function searchKeydown(event: KeyboardEvent) {
    if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) return;
    event.preventDefault();
    const inputs = pickerRoot?.querySelectorAll<HTMLInputElement>('.choice input');
    if (!inputs?.length) return;
    const target = event.key === 'ArrowUp' ? inputs[inputs.length - 1] : inputs[0];
    target.focus({ preventScroll: true });
    if (event.key === 'Enter') choose(target.value);
  }
  const minimum = () => field === 'price' ? draft.priceMin : draft.yearMin;
  const maximum = () => field === 'price' ? draft.priceMax : draft.yearMax;
  function setMinimum(value: string) { if (field === 'price') draft.priceMin = value; else draft.yearMin = value; }
  function setMaximum(value: string) { if (field === 'price') draft.priceMax = value; else draft.yearMax = value; }
  function choose(option: string) {
    if (field === 'equipment') {
      draft = { ...draft, equipment: selected(option) ? draft.equipment.filter(value => value !== option) : [...draft.equipment, option as VehicleEquipment] };
      return;
    }
    if (field === 'make') { draft = withListingMake(draft, option); return; }
    if (field === 'model' && !makeContext) {
      const makes = listingFilterOptions.makes.filter(make => make && listingModelsForMake(make).includes(option));
      draft = withListingMake(draft, makes.length === 1 ? makes[0] : '');
    }
    if (field !== 'price' && field !== 'year' && field !== 'mileage_max') draft = { ...draft, [field]: option };
  }
  function clearRange() { setMinimum(''); setMaximum(''); }
</script>

<div class="picker" {@attach attachRoot}>
  {#if searchable}
    <div class="search">
      <Icon name="search" size={18} />
      <input id="dn-desktop-picker-search" data-picker-initial type="search" bind:value={search} aria-label={searchLabel} placeholder={searchLabel} autocomplete="off" onkeydown={searchKeydown} />
      <button type="button" class="clear-search dn-icon-button" class:invisible={!search} disabled={!search} aria-label={i18n.t('m_c8191190a026')} onclick={clearSearch}><Icon name="x" size={16} /></button>
    </div>
    {#if field === 'model' && makeContext}<div class="make-context">{makeContext}</div>{/if}
  {/if}
  {#if range}
    <div class="range">
      <label><span>{templateMessage(i18n, 'From{p0}', { p0: field === 'price' ? ' (' + currencySymbol(i18n.locale) + ')' : '' })}</span><input data-picker-min data-picker-initial {@attach i18n.validationFor(field)} type="number" inputmode="numeric" value={minimum()} oninput={event => setMinimum(event.currentTarget.value)} min={field === 'year' ? 1900 : 0} max={field === 'year' ? new Date().getFullYear() + 1 : undefined} step="1" placeholder={i18n.t('m_8a702098f672')} /></label>
      <label><span>{templateMessage(i18n, 'To{p0}', { p0: field === 'price' ? ' (' + currencySymbol(i18n.locale) + ')' : '' })}</span><input data-picker-max {@attach i18n.validationFor(field)} type="number" inputmode="numeric" value={maximum()} oninput={event => setMaximum(event.currentTarget.value)} min={field === 'year' ? 1900 : 0} max={field === 'year' ? new Date().getFullYear() + 1 : undefined} step="1" placeholder={i18n.t('m_585b0741c5fb')} /></label>
    </div>
    <button class="no-limit" type="button" onclick={clearRange}>{i18n.t('inventory.range.unlimited')}</button>
  {:else if field === 'mileage_max'}
    <div class="range mileage"><label><span>{i18n.t('m_ac9577848c3a')}</span><input data-picker-initial {@attach i18n.validation} type="number" inputmode="numeric" value={draft.mileageMax} oninput={event => draft.mileageMax = event.currentTarget.value} min="0" step="1" placeholder={i18n.t('m_613e1f06e8da')} /></label></div>
    <div class="presets">{#each listingFilterOptions.mileages as value (value)}<button type="button" aria-pressed={draft.mileageMax === value} onclick={() => draft.mileageMax = value}>{value ? listingFacetSummary('mileage_max', { ...draft, mileageMax: value }, i18n.locale) : i18n.t('inventory.range.unlimited')}</button>{/each}</div>
  {:else}
    <div class="choice-list" style:--picker-list-height={listHeight + 'px'}>
      <fieldset class="choices"><legend class="dn-sr-only">{title}</legend>
        {#if choices.includes('')}{@render choice('')}{/if}
        {#each groups as group (group.make)}
          {#if group.make}<h3 class="group-title">{group.make}</h3>{/if}
          {#each group.options as option (option)}{@render choice(option)}{/each}
        {/each}
      </fieldset>
      {#if !choices.length}<div class="empty" role="status"><strong>{i18n.t('m_255ca3bfe9fc')}</strong><p>{i18n.t('m_5c1608c4b6c0')}</p></div>{/if}
    </div>
  {/if}
</div>

{#snippet choice(option: string)}
  <label class="choice" class:selected={selected(option)}>
    <input type={field === 'equipment' ? 'checkbox' : 'radio'} name="dn-picker-choice" value={option} aria-label={optionLabel(option)} checked={selected(option)} onchange={() => choose(option)} />
    <span class="choice-label">{optionLabel(option)}</span>
    <span class="choice-meta">{#if field === 'type' || vehicleIdentity}<span class="count" aria-hidden="true">{choiceCount(option)}</span>{/if}<span class="check" aria-hidden="true">✓</span></span>
  </label>
{/snippet}

<style>
  .picker { min-width: 0; }
  button { font: var(--dn-control-font); cursor: pointer; }
  .search { display: flex; align-items: center; gap: var(--dn-space-2); min-height: var(--dn-control-height-default); margin: 0 var(--dn-space-4) var(--dn-space-2); padding-inline: var(--dn-space-3) var(--dn-space-1); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-control); background: var(--dn-surface-subtle); color: var(--dn-muted); }
  .search input { flex: 1; min-width: 0; min-height: calc(var(--dn-control-height-default) - 2px); padding: 0; border: 0; background: transparent; color: var(--dn-ink); font: var(--dn-control-font); outline: none; }
  .search input::-webkit-search-cancel-button { appearance: none; }
  .search:focus-within { border-color: var(--dn-line-strong); }
  .search:has(input:focus-visible) { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
  .clear-search { border: 0; background: transparent; color: var(--dn-muted); }
  .clear-search.invisible { visibility: hidden; }
  .make-context { margin: var(--dn-space-3) var(--dn-space-6) var(--dn-space-1); color: var(--dn-muted); font-size: var(--dn-text-meta); }
  .choice-list { height: min(var(--picker-list-height), max(88px, calc(100dvh - 340px))); overflow-y: auto; overscroll-behavior: contain; scrollbar-gutter: stable; padding: var(--dn-space-1) var(--dn-space-2) var(--dn-space-3) var(--dn-space-4); }
  .choices { display: grid; min-width: 0; margin: 0; padding: 0; border: 0; }
  .choice { position: relative; display: flex; align-items: center; gap: var(--dn-space-3); min-width: 0; min-height: var(--dn-control-height-default); padding: var(--dn-space-2) var(--dn-space-3); border-radius: var(--dn-radius-control); background: transparent; color: var(--dn-ink); font: var(--dn-control-font); cursor: pointer; }
  .choice-label { overflow-wrap: anywhere; }
  .choice:hover { background: var(--dn-surface-hover); }
  .choice.selected { background: var(--dn-surface-subtle); }
  .choice input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; }
  .choice:has(input:focus-visible) { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  .choice-meta { display: inline-flex; flex: 0 0 auto; align-items: center; gap: var(--dn-space-3); margin-inline-start: auto; }
  .count { color: var(--dn-muted); font-size: var(--dn-text-meta); font-variant-numeric: tabular-nums; }
  .check { width: 16px; color: var(--dn-ink); visibility: hidden; }
  .selected .check { visibility: visible; }
  .group-title { margin: var(--dn-space-2) var(--dn-space-3) var(--dn-space-1); color: var(--dn-muted); font-size: var(--dn-text-meta); font-weight: var(--dn-weight-medium); }
  .range { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--dn-space-3); padding: var(--dn-space-2) var(--dn-space-6); }
  .range label { display: grid; gap: var(--dn-space-2); min-width: 0; font: var(--dn-control-font); }
  .range input { box-sizing: border-box; width: 100%; min-height: var(--dn-control-height-default); padding: var(--dn-space-2) var(--dn-space-3); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-control); background: var(--dn-surface-subtle); color: var(--dn-ink); font: var(--dn-control-font); }
  .mileage { grid-template-columns: minmax(0, 1fr); }
  .no-limit, .presets button { min-height: var(--dn-control-height-default); padding: var(--dn-space-2) var(--dn-space-3); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-control); background: var(--dn-white); color: var(--dn-ink); }
  .no-limit { margin: var(--dn-space-2) var(--dn-space-6) var(--dn-space-6); }
  .presets { display: flex; flex-wrap: wrap; gap: var(--dn-space-2); padding: var(--dn-space-3) var(--dn-space-6) var(--dn-space-6); }
  .presets button[aria-pressed='true'] { border-color: var(--dn-line-strong); background: var(--dn-surface-subtle); }
  button:focus-visible, .range input:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
  .empty { padding: var(--dn-space-6) var(--dn-space-3); color: var(--dn-muted); font: var(--dn-control-font); }
  .empty strong { color: var(--dn-ink); font-weight: var(--dn-weight-medium); }
  .empty p { margin: var(--dn-space-2) 0 0; }
  @media (forced-colors: active) { .choice.selected { outline: 1px solid Highlight; } }
</style>
