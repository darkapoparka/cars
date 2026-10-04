<script lang="ts">
  import { tick } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import { getI18n } from '$lib/locale/context';
  import { currencySymbol } from '$lib/locale/core';
  import { templateMessage } from '$lib/i18n/presentation';
  import { filterListingVehicles, listingFilterOptions, listingModelsForMake, listingVehicles } from '$data/listing';
  import {
    listingFacetOptions,
    listingFacetOptionLabel,
    listingFacetSummary,
    listingFacetTitle,
    listingFiltersFromDraft,
    withListingMake,
    type ListingDraft,
    type ListingFacetField
  } from '$data/listing-draft';
  import Icon from '$components/ui/Icon.svelte';
  import type { VehicleEquipment } from '$data/inventory';

  type Field = Exclude<ListingFacetField, 'sort'>;
  const fields: readonly Field[] = ['make', 'model', 'type', 'body', 'price', 'year', 'mileage_max', 'fuel', 'transmission', 'condition', 'version', 'equipment'];
  let { field, draft = $bindable(), onFieldChange }: {
    field: Field;
    draft: ListingDraft;
    onFieldChange: (field: Field) => void;
  } = $props();
  const i18n = getI18n();
  let pickerRoot: HTMLDivElement;
  const attachRoot: Attachment<HTMLDivElement> = node => { pickerRoot = node; };
  let search = $state('');
  $effect(() => { field; search = ''; });
  const vehicleIdentity = $derived(field === 'make' || field === 'model');
  const range = $derived(field === 'price' || field === 'year');
  const title = $derived(listingFacetTitle(field, i18n.locale));
  const searchLabel = $derived(field === 'make' ? i18n.t('m_150bec5925bd') : i18n.t('m_269619120191'));
  const options = $derived(listingFacetOptions(field, draft.make));
  const choices = $derived(options.filter(option => !option || !search.trim() || search.trim().toLocaleLowerCase(i18n.locale).split(/\s+/).every(term => listingFacetOptionLabel(field, option, i18n.locale).toLocaleLowerCase(i18n.locale).includes(term))));
  const groups = $derived(field === 'model' && !draft.make
    ? listingFilterOptions.makes.filter(Boolean).map(make => ({ make, options: choices.filter(option => option && listingModelsForMake(make).includes(option)) })).filter(group => group.options.length)
    : [{ make: '', options: choices.filter(Boolean) }]);
  const selected = (option: string) => field === 'equipment' ? draft.equipment.includes(option as VehicleEquipment) : field !== 'price' && field !== 'year' && field !== 'mileage_max' && draft[field] === option;
  const hasSelection = (tab: Field) => tab === 'price' ? Boolean(draft.priceMin || draft.priceMax)
    : tab === 'year' ? Boolean(draft.yearMin || draft.yearMax)
    : tab === 'mileage_max' ? Boolean(draft.mileageMax)
    : tab === 'equipment' ? draft.equipment.length > 0 : Boolean(draft[tab]);
  const optionLabel = (option: string) => !option && vehicleIdentity ? listingFacetSummary(field, { ...draft, make: field === 'make' ? '' : draft.make, model: '' }, i18n.locale) : listingFacetOptionLabel(field, option, i18n.locale);
  function choiceCount(option: string) {
    const candidate = field === 'type' ? { ...draft, type: option as ListingDraft['type'] } : field === 'make' ? withListingMake(draft, option) : { ...draft, model: option };
    return filterListingVehicles(listingVehicles, listingFiltersFromDraft(candidate), i18n.locale).length;
  }
  async function clearSearch() {
    search = '';
    await tick();
    pickerRoot?.querySelector<HTMLInputElement>('input[type="search"]')?.focus({ preventScroll: true });
  }
  const minimum = () => field === 'price' ? draft.priceMin : draft.yearMin;
  const maximum = () => field === 'price' ? draft.priceMax : draft.yearMax;
  function setMinimum(value: string) { if (field === 'price') draft.priceMin = value; else draft.yearMin = value; }
  function setMaximum(value: string) { if (field === 'price') draft.priceMax = value; else draft.yearMax = value; }
  async function choose(option: string) {
    if (field === 'equipment') {
      draft = { ...draft, equipment: selected(option) ? draft.equipment.filter(value => value !== option) : [...draft.equipment, option as VehicleEquipment] };
      return;
    }
    if (field === 'make') {
      draft = withListingMake(draft, option);
      return;
    }
    if (field === 'model' && option && !draft.make) {
      const makes = listingFilterOptions.makes.filter(make => make && listingModelsForMake(make).includes(option));
      if (makes.length === 1) draft = withListingMake(draft, makes[0]);
    }
    if (field !== 'price' && field !== 'year' && field !== 'mileage_max') draft = { ...draft, [field]: option };
    await tick();
    pickerRoot?.querySelector<HTMLInputElement>('input[type="radio"]:checked')?.focus({ preventScroll: true });
  }
  async function tabKeydown(event: KeyboardEvent) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const tabs = (event.currentTarget as HTMLElement).closest('[role="tablist"]');
    const index = fields.indexOf(field);
    const next = fields[event.key === 'Home' ? 0 : event.key === 'End' ? fields.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + fields.length) % fields.length];
    onFieldChange(next);
    await tick();
    tabs?.querySelector<HTMLButtonElement>(`[data-picker-tab="${next}"]`)?.focus();
  }
  function clearRange() {
    if (field === 'mileage_max') draft.mileageMax = '';
    else { setMinimum(''); setMaximum(''); }
  }
</script>

<div class="picker" {@attach attachRoot}>
  <div class="tabs" role="tablist" aria-label={i18n.t('m_546ebb8eb993')}>
    {#each fields as tab (tab)}
      <button class="tab" type="button" role="tab" id={`dn-picker-tab-${tab}`} data-picker-tab={tab} aria-selected={field === tab} aria-controls={`dn-picker-panel-${tab}`} tabindex={field === tab ? 0 : -1} title={listingFacetSummary(tab, draft, i18n.locale)} onclick={() => onFieldChange(tab)} onkeydown={tabKeydown}>
        {listingFacetTitle(tab, i18n.locale)}
        <span class="selection-indicator" data-active={hasSelection(tab)} aria-hidden="true"></span>
      </button>
    {/each}
  </div>

  {#snippet contents()}
    {#if vehicleIdentity}
      <div class="search">
        <Icon name="search" size={20} />
        <input id="dn-desktop-picker-search" data-picker-initial type="search" bind:value={search} aria-label={searchLabel} placeholder={searchLabel} autocomplete="off" onkeydown={event => { if (event.key === 'Enter') event.preventDefault(); }} />
        {#if field === 'model' && draft.make}<span class="make-context">{draft.make}</span>{/if}
        {#if search}<button type="button" class="clear-search dn-icon-button" aria-label={i18n.t('m_c8191190a026')} onclick={clearSearch}><Icon name="x" size={18} /></button>{/if}
      </div>
    {/if}
    {#if range}
      <div class="range">
        <label><span>{templateMessage(i18n, 'From{p0}', { p0: field === 'price' ? ' (' + currencySymbol(i18n.locale) + ')' : '' })}</span><input {@attach i18n.validationFor(field)} type="number" inputmode="numeric" value={minimum()} oninput={event => setMinimum(event.currentTarget.value)} min={field === 'year' ? 1900 : 0} max={field === 'year' ? new Date().getFullYear() + 1 : undefined} step="1" placeholder={i18n.t('m_8a702098f672')} /></label>
        <label><span>{templateMessage(i18n, 'To{p0}', { p0: field === 'price' ? ' (' + currencySymbol(i18n.locale) + ')' : '' })}</span><input {@attach i18n.validationFor(field)} type="number" inputmode="numeric" value={maximum()} oninput={event => setMaximum(event.currentTarget.value)} min={field === 'year' ? 1900 : 0} max={field === 'year' ? new Date().getFullYear() + 1 : undefined} step="1" placeholder={i18n.t('m_585b0741c5fb')} /></label>
      </div>
      <button class="no-limit" type="button" onclick={clearRange}>{i18n.t('inventory.range.unlimited')}</button>
    {:else if field === 'mileage_max'}
      <div class="range mileage"><label><span>{i18n.t('m_ac9577848c3a')}</span><input {@attach i18n.validation} type="number" inputmode="numeric" value={draft.mileageMax} oninput={event => draft.mileageMax = event.currentTarget.value} min="0" step="1" placeholder={i18n.t('m_613e1f06e8da')} /></label></div>
      <div class="presets">{#each listingFilterOptions.mileages as value (value)}<button type="button" aria-pressed={draft.mileageMax === value} onclick={() => draft.mileageMax = value}>{value ? listingFacetSummary('mileage_max', { ...draft, mileageMax: value }, i18n.locale) : i18n.t('inventory.range.unlimited')}</button>{/each}</div>
    {:else}
      <fieldset class="choices"><legend class="dn-sr-only">{title}</legend>
        {#if choices.includes('')}{@render choice('')}{/if}
        {#each groups as group (group.make)}
          {#if group.make}<h3 class="group-title">{group.make}</h3>{/if}
          {#each group.options as option (option)}{@render choice(option)}{/each}
        {/each}
      </fieldset>
      {#if search && !choices.some(Boolean)}<div class="empty" role="status"><strong>{i18n.t('m_255ca3bfe9fc')}</strong><p>{i18n.t('m_5c1608c4b6c0')}</p></div>{/if}
    {/if}
  {/snippet}

  {#each fields as tab (tab)}
    <div id={`dn-picker-panel-${tab}`} role="tabpanel" aria-labelledby={`dn-picker-tab-${tab}`} hidden={field !== tab} tabindex="0">{#if field === tab}{@render contents()}{/if}</div>
  {/each}
</div>

{#snippet choice(option: string)}
  <label class="choice" class:selected={selected(option)}>
    <input type={field === 'equipment' ? 'checkbox' : 'radio'} name="dn-picker-choice" value={option} aria-label={optionLabel(option)} checked={selected(option)} onchange={() => choose(option)} />
    <span>{optionLabel(option)}</span>
    {#if field === 'type' || vehicleIdentity}<span class="count" aria-hidden="true">{choiceCount(option)}</span>{/if}
  </label>
{/snippet}

<style>
  .picker { min-width: 0; }
  button { font: var(--dn-control-font); cursor: pointer; }
  .make-context { flex: 0 0 auto; margin-inline: var(--dn-space-2); color: var(--dn-muted); font: var(--dn-control-font); }
  .tabs { position: sticky; top: 0; z-index: 1; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 0 var(--dn-space-3); max-width: 100%; margin-bottom: var(--dn-space-8); background: var(--dn-white); }
  .tab { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: var(--dn-space-2); min-width: 0; min-height: var(--dn-control-height-prominent); padding: var(--dn-space-3) var(--dn-space-1); border: 0; border-bottom: 1px solid var(--dn-line); background: transparent; color: var(--dn-muted); font-size: var(--dn-text-control-prominent); white-space: nowrap; }
  .tab[aria-selected='true'] { color: var(--dn-ink); font-weight: var(--dn-weight-semibold); }
  .tab[aria-selected='true']::after { position: absolute; inset: auto 0 0; height: 2px; border-radius: var(--dn-pill); background: var(--dn-ink); content: ''; }
  .selection-indicator { flex: 0 0 4px; width: 4px; height: 4px; border-radius: var(--dn-pill); background: var(--dn-red); }
  .selection-indicator[data-active='false'] { visibility: hidden; }
  .tab:focus-visible { outline-offset: -3px; }
  .search { display: flex; align-items: center; gap: var(--dn-space-3); min-height: var(--dn-control-height-prominent); margin-bottom: var(--dn-space-6); padding-inline: var(--dn-space-4) var(--dn-space-2); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-control); background: var(--dn-surface-subtle); color: var(--dn-muted); }
  .search input { flex: 1; min-width: 0; min-height: var(--dn-control-height-prominent); padding: 0; border: 0; background: transparent; color: var(--dn-ink); font: var(--dn-entry-font); outline: none; }
  .search:focus-within { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
  .clear-search { border: 0; background: transparent; color: var(--dn-muted); }
  .choices { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--dn-space-3); min-width: 0; margin: 0; padding: 0; border: 0; }
  .choice { display: flex; align-items: center; gap: var(--dn-space-3); min-width: 0; min-height: 64px; padding: var(--dn-space-3) var(--dn-space-4); border: 1px solid transparent; border-radius: var(--dn-radius-control); background: var(--dn-surface-subtle); color: var(--dn-ink); font: var(--dn-entry-font); cursor: pointer; }
  .choice span { overflow-wrap: anywhere; }
  .choice:hover { background: var(--dn-surface-hover); }
  .choice.selected { border-color: var(--dn-selection-line); background: var(--dn-selection-surface); }
  .choice input { appearance: none; flex: 0 0 18px; width: 18px; height: 18px; margin: 0; border: 1px solid var(--dn-line-strong); border-radius: var(--dn-pill); background: var(--dn-white); }
  .choice input:checked { border: 5px solid var(--dn-red); }
  .choice input[type='checkbox'] { appearance: auto; border: revert; border-radius: 0; accent-color: var(--dn-red); }
  .choice:has(input:focus-visible) { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
  .count { margin-inline-start: auto; color: var(--dn-muted); font-size: var(--dn-text-meta); }
  .group-title { grid-column: 1 / -1; margin: var(--dn-space-3) 0 0; font-size: var(--dn-text-body); font-weight: var(--dn-weight-semibold); }
  .range { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--dn-space-3); }
  .range label { display: grid; gap: var(--dn-space-2); min-width: 0; font: var(--dn-control-font); }
  .range input { box-sizing: border-box; width: 100%; min-height: var(--dn-control-height-prominent); padding: var(--dn-space-3) var(--dn-space-4); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-control); background: var(--dn-surface-subtle); color: var(--dn-ink); font: var(--dn-entry-font); }
  .mileage { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .no-limit, .presets button { min-height: var(--dn-control-height-default); margin-top: var(--dn-space-4); padding: var(--dn-space-2) var(--dn-space-4); border: 1px solid var(--dn-line); border-radius: var(--dn-pill); background: var(--dn-white); color: var(--dn-ink); }
  .presets { display: flex; flex-wrap: wrap; gap: var(--dn-space-2); }
  .presets button[aria-pressed='true'] { border-color: var(--dn-selection-line); background: var(--dn-selection-surface); }
  button:focus-visible, .range input:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
  .empty { margin-top: var(--dn-space-6); color: var(--dn-muted); font: var(--dn-body-font); }
  .empty p { margin: var(--dn-space-2) 0 0; }
  @media (forced-colors: active) { .choice input, .choice input:checked { appearance: auto; border: revert; background: revert; } }
</style>
