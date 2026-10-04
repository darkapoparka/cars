<script lang="ts">
  import { tick } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import { getI18n } from '$lib/locale/context';
  import { currencySymbol } from '$lib/locale/core';
  import { templateMessage } from '$lib/i18n/presentation';
  import { filterListingVehicles, listingFilterOptions, listingModelsForMake, listingTypeCount, listingVehicles } from '$data/listing';
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

  type Field = Exclude<ListingFacetField, 'sort' | 'equipment'>;
  let { field, draft = $bindable(), onBack, onFieldChange }: {
    field: Field;
    draft: ListingDraft;
    onBack: () => void;
    onFieldChange: (field: Field) => void;
  } = $props();
  const i18n = getI18n();
  let pickerRoot: HTMLDivElement;
  const attachRoot: Attachment<HTMLDivElement> = node => { pickerRoot = node; };
  let search = $state('');
  let advanceMake = false;
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
  const selected = (option: string) => field !== 'price' && field !== 'year' && field !== 'mileage_max' && draft[field] === option;
  const optionLabel = (option: string) => !option && vehicleIdentity ? listingFacetSummary(field, { ...draft, make: field === 'make' ? '' : draft.make, model: '' }, i18n.locale) : listingFacetOptionLabel(field, option, i18n.locale);
  function choiceCount(option: string) {
    const candidate = field === 'make' ? withListingMake(draft, option) : { ...draft, model: option };
    return filterListingVehicles(listingVehicles, listingFiltersFromDraft(candidate), i18n.locale).length;
  }
  const minimum = () => field === 'price' ? draft.priceMin : draft.yearMin;
  const maximum = () => field === 'price' ? draft.priceMax : draft.yearMax;
  function setMinimum(value: string) { if (field === 'price') draft.priceMin = value; else draft.yearMin = value; }
  function setMaximum(value: string) { if (field === 'price') draft.priceMax = value; else draft.yearMax = value; }
  async function choose(option: string) {
    if (field === 'make') {
      draft = withListingMake(draft, option);
      const advance = advanceMake;
      advanceMake = false;
      if (option && advance) onFieldChange('model');
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
    const next = event.key === 'Home' ? 'make' : event.key === 'End' ? 'model' : field === 'make' ? 'model' : 'make';
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
  <div class="toolbar">
    <button class="back" type="button" onclick={onBack}><Icon name="arrow-left" size={18} />{i18n.t('m_a779c56e526e')}</button>
    {#if vehicleIdentity}
      <div class="tabs" role="tablist" aria-label={i18n.t('m_0ae7a3ecbc83')}>
        {#each ['make', 'model'] as tab}
          <button class="tab" type="button" role="tab" id={`dn-picker-tab-${tab}`} data-picker-tab={tab} aria-selected={field === tab} aria-controls={`dn-picker-panel-${tab}`} tabindex={field === tab ? 0 : -1} onclick={() => onFieldChange(tab as Field)} onkeydown={tabKeydown}>{listingFacetTitle(tab as Field, i18n.locale)}</button>
        {/each}
      </div>
    {:else}
      <h3 id="dn-desktop-picker-title" tabindex="-1" data-picker-initial>{title}</h3>
    {/if}
    {#if field === 'model' && draft.make}<button class="make-context" type="button" aria-label={`${i18n.t('m_d73ca16bbc17')}: ${draft.make}`} onclick={() => onFieldChange('make')}>{draft.make}<Icon name="arrow-left" size={16} /></button>{/if}
  </div>

  {#snippet contents()}
    {#if vehicleIdentity}
      <div class="search">
        <Icon name="search" size={20} />
        <input id="dn-desktop-picker-search" data-picker-initial type="search" bind:value={search} aria-label={searchLabel} placeholder={searchLabel} autocomplete="off" onkeydown={event => { if (event.key === 'Enter') event.preventDefault(); }} />
        {#if search}<button type="button" class="clear-search dn-icon-button" aria-label={i18n.t('m_c8191190a026')} onclick={() => search = ''}><Icon name="x" size={18} /></button>{/if}
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
      <fieldset class="choices" class:identity={vehicleIdentity}><legend class="dn-sr-only">{title}</legend>
        {#if choices.includes('')}{@render choice('')}{/if}
        {#each groups as group (group.make)}
          {#if group.make}<h4 class="group-title">{group.make}</h4>{/if}
          {#each group.options as option (option)}{@render choice(option)}{/each}
        {/each}
      </fieldset>
      {#if search && !choices.some(Boolean)}<div class="empty" role="status"><strong>{i18n.t('m_255ca3bfe9fc')}</strong><p>{i18n.t('m_5c1608c4b6c0')}</p></div>{/if}
    {/if}
  {/snippet}

  {#if vehicleIdentity}
    {#each ['make', 'model'] as tab}
      <div id={`dn-picker-panel-${tab}`} role="tabpanel" aria-labelledby={`dn-picker-tab-${tab}`} hidden={field !== tab} tabindex="0">{#if field === tab}{@render contents()}{/if}</div>
    {/each}
  {:else}
    <div aria-labelledby="dn-desktop-picker-title">{@render contents()}</div>
  {/if}
</div>

{#snippet choice(option: string)}
  <label class="choice" class:selected={selected(option)} onpointerdown={() => advanceMake = true}>
    <input type="radio" name="dn-picker-choice" value={option} aria-label={optionLabel(option)} checked={selected(option)} onchange={() => choose(option)} onkeydown={() => advanceMake = false} onclick={event => { if (field === 'make' && option && selected(option) && event.detail > 0) onFieldChange('model'); }} />
    <span>{optionLabel(option)}</span>
    {#if field === 'type'}<span class="count" aria-hidden="true">{listingTypeCount(option)}</span>{:else if vehicleIdentity}<span class="count" aria-hidden="true">{choiceCount(option)}</span>{/if}
  </label>
{/snippet}

<style>
  .picker { min-width: 0; }
  .toolbar { display: flex; align-items: center; gap: var(--dn-space-7); margin-bottom: var(--dn-space-6); min-height: var(--dn-control-height-default); }
  button { font: var(--dn-control-font); cursor: pointer; }
  .back, .make-context { display: inline-flex; align-items: center; gap: var(--dn-space-2); min-height: var(--dn-control-height-default); padding: 0 var(--dn-space-3); border: 0; border-radius: var(--dn-pill); background: var(--dn-surface-panel); color: var(--dn-ink); }
  .back:hover, .make-context:hover { background: var(--dn-surface-hover); }
  .back { margin-inline-start: calc(-1 * var(--dn-space-3)); background: transparent; color: var(--dn-muted); }
  .make-context { margin-inline-start: auto; }
  .tabs { display: flex; align-self: stretch; gap: var(--dn-space-6); }
  .tab { position: relative; min-width: 80px; padding: var(--dn-space-2) 0; border: 0; background: transparent; color: var(--dn-muted); font-size: var(--dn-text-lead); }
  .tab[aria-selected='true'] { color: var(--dn-ink); font-weight: var(--dn-weight-semibold); }
  .tab[aria-selected='true']::after { position: absolute; inset: auto 0 0; height: 2px; border-radius: var(--dn-pill); background: var(--dn-ink); content: ''; }
  h3 { margin: 0; font-size: var(--dn-text-lead); font-weight: var(--dn-weight-semibold); }
  h3:focus { outline: none; }
  .search { display: flex; align-items: center; gap: var(--dn-space-3); min-height: var(--dn-control-height-prominent); margin-bottom: var(--dn-space-6); padding-inline: var(--dn-space-4) var(--dn-space-2); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-control); background: var(--dn-surface-subtle); color: var(--dn-muted); }
  .search input { flex: 1; min-width: 0; min-height: var(--dn-control-height-prominent); padding: 0; border: 0; background: transparent; color: var(--dn-ink); font: var(--dn-entry-font); outline: none; }
  .search:focus-within { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
  .clear-search { border: 0; background: transparent; color: var(--dn-muted); }
  .choices { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--dn-space-3); min-width: 0; margin: 0; padding: 0; border: 0; }
  .choices.identity { grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); }
  .choice { display: flex; align-items: center; gap: var(--dn-space-3); min-width: 0; min-height: 64px; padding: var(--dn-space-3) var(--dn-space-4); border: 1px solid transparent; border-radius: var(--dn-radius-control); background: var(--dn-surface-subtle); color: var(--dn-ink); font: var(--dn-entry-font); cursor: pointer; }
  .choice span { overflow-wrap: anywhere; }
  .choice:hover { background: var(--dn-surface-hover); }
  .choice.selected { border-color: var(--dn-selection-line); background: var(--dn-selection-surface); }
  .choice input { appearance: none; flex: 0 0 18px; width: 18px; height: 18px; margin: 0; border: 1px solid var(--dn-line-strong); border-radius: var(--dn-pill); background: var(--dn-white); }
  .choice input:checked { border: 5px solid var(--dn-red); }
  .choice:has(input:focus-visible) { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
  .count { margin-inline-start: auto; color: var(--dn-muted); font-size: var(--dn-text-meta); }
  .group-title { grid-column: 1 / -1; margin: var(--dn-space-3) 0 0; font-size: var(--dn-text-body); font-weight: var(--dn-weight-semibold); }
  .range { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--dn-space-5); max-width: 680px; }
  .range label { display: grid; gap: var(--dn-space-2); min-width: 0; font: var(--dn-control-font); }
  .range input { box-sizing: border-box; width: 100%; min-height: var(--dn-control-height-prominent); padding: var(--dn-space-3) var(--dn-space-4); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-control); background: var(--dn-surface-subtle); color: var(--dn-ink); font: var(--dn-entry-font); }
  .mileage { grid-template-columns: minmax(0, 1fr); max-width: 360px; }
  .no-limit, .presets button { min-height: var(--dn-control-height-default); margin-top: var(--dn-space-4); padding: var(--dn-space-2) var(--dn-space-4); border: 1px solid var(--dn-line); border-radius: var(--dn-pill); background: var(--dn-white); color: var(--dn-ink); }
  .presets { display: flex; flex-wrap: wrap; gap: var(--dn-space-2); }
  .presets button[aria-pressed='true'] { border-color: var(--dn-selection-line); background: var(--dn-selection-surface); }
  button:focus-visible, .range input:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
  .empty { margin-top: var(--dn-space-6); color: var(--dn-muted); font: var(--dn-body-font); }
  .empty p { margin: var(--dn-space-2) 0 0; }
  @media (forced-colors: active) { .choice input, .choice input:checked { appearance: auto; border: revert; background: revert; } }
</style>
