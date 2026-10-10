<script lang="ts">
  import { MediaQuery } from 'svelte/reactivity';
  import type { Snippet } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import { currencySymbol } from '$lib/locale/core';
  import { getI18n } from '$lib/locale/context';
  import { templateMessage } from '$lib/i18n/presentation';
  import { listingBudgetCaps, listingFilterOptions, listingSelectionHas, listingTypeCount } from '$data/listing';
  import { desktopMakeOptions } from '$data/desktop-makes';
  import {
    listingFacetOptionLabel, listingFacetOptions, listingFacetTitle,
    listingOptionsWithCurrent, listingSuggestionMatcher, toggleListingIdentity,
    type ListingDraft, type ListingFacetField
  } from '$data/listing-draft';
  import MobileActionIcon from '$components/layout/MobileActionIcon.svelte';
  import Icon from '$components/ui/Icon.svelte';
  import DesktopFilterChoice from './DesktopFilterChoice.svelte';
  import DesktopMakeChoice from './DesktopMakeChoice.svelte';
  import DesktopModelGroups, { type ModelPicker } from './DesktopModelGroups.svelte';
  import type { PickerNavigation } from './FilterPopoverHeader.svelte';

  let { field, draft = $bindable(), desktopChoices = false, widePanel = false, filterPanel = false, modelMakes, onModelMake, header, onChoose, contentElement = $bindable() }: {
    field: ListingFacetField;
    draft: ListingDraft;
    desktopChoices?: boolean;
    widePanel?: boolean;
    filterPanel?: boolean;
    modelMakes?: string[];
    onModelMake?: (make: string) => void;
    header?: Snippet<[Snippet | undefined, PickerNavigation | undefined]>;
    onChoose?: () => void;
    contentElement?: HTMLDivElement;
  } = $props();
  const i18n = getI18n();
  const mobile = new MediaQuery('(max-width: 767px)', false);
  let search = $state('');
  let searchInput: HTMLInputElement;
  let modelPicker = $state<ModelPicker>();
  const attachSearch: Attachment<HTMLInputElement> = node => { searchInput = node; };
  const attachContent: Attachment<HTMLDivElement> = node => { contentElement = node; return () => { contentElement = undefined; }; };
  const title = $derived(listingFacetTitle(field, i18n.locale));
  const range = $derived(field === 'price' || field === 'year');
  const minimumKey = $derived(field === 'price' ? 'priceMin' : 'yearMin');
  const maximumKey = $derived(field === 'price' ? 'priceMax' : 'yearMax');
  const searchable = $derived(!range && field !== 'mileage_max' && field !== 'sort' && field !== 'type');
  const searchLabel = $derived(field === 'make' ? i18n.t('m_150bec5925bd') : field === 'model' ? i18n.t('m_269619120191') : i18n.t('m_f0549fa54b59', { p0: title.toLocaleLowerCase(i18n.locale) }));
  const searchContext = $derived(widePanel && field === 'model' ? modelPicker?.navigation()?.label : undefined);
  const searchPrompt = $derived(widePanel ? i18n.t('inventory.search.context', { context: searchContext ?? title.toLocaleLowerCase(i18n.locale) }) : `${searchLabel}…`);
  const selected = $derived(field === 'sort' ? (draft.sort === 'default' ? '' : draft.sort)
    : field === 'price' || field === 'year' || field === 'equipment' || field === 'mileage_max' ? '' : draft[field]);
  const choices = $derived(field === 'make' && desktopChoices && widePanel ? desktopMakeOptions(selected, i18n.locale)
    : field === 'equipment' ? listingFacetOptions(field)
    : listingOptionsWithCurrent(listingFacetOptions(field, draft.make), selected));
  const matches = $derived(listingSuggestionMatcher(search, i18n.locale));
  const optionLabel = (option: string) => widePanel && !option && (field === 'make' || field === 'model')
    ? i18n.t(field === 'make' ? 'inventory.search.allMakes' : 'inventory.search.allModels') : listingFacetOptionLabel(field, option, i18n.locale);
  const invalid = $derived(range && draft[minimumKey] !== '' && draft[maximumKey] !== '' && Number(draft[minimumKey]) > Number(draft[maximumKey]));
  const budgetPresets = listingBudgetCaps().map(String);
  const yearPresets = listingFilterOptions.years.filter(Boolean).slice(-4);

  function isSelected(value: string) {
    if (field === 'equipment') return draft.equipment.includes(value as ListingDraft['equipment'][number]);
    if (Array.isArray(selected)) return value ? listingSelectionHas(selected, value) : selected.length === 0;
    return selected === value;
  }

  function choosePreset(value: string) {
    if (field === 'price') draft.priceMax = value;
    else if (field === 'year') draft.yearMin = value;
    else if (field === 'mileage_max') draft.mileageMax = value;
  }

  function choose(value: string) {
    if (field === 'equipment') {
      const equipment = value as ListingDraft['equipment'][number];
      draft.equipment = draft.equipment.includes(equipment) ? draft.equipment.filter(item => item !== equipment) : [...draft.equipment, equipment];
      return;
    }
    if (field === 'make' || field === 'model') {
      draft = toggleListingIdentity(draft, field, value);
      return;
    }
    if (field === 'type') draft.type = value as ListingDraft['type'];
    else if (field === 'condition') draft.condition = value as ListingDraft['condition'];
    else if (field === 'sort') draft.sort = (value || 'default') as ListingDraft['sort'];
    else if (field !== 'price' && field !== 'year' && field !== 'mileage_max') draft[field] = value;
    onChoose?.();
  }
</script>

{#snippet actionIcon(name: 'search' | 'close', size = 18)}
  {#if mobile.current}<MobileActionIcon {name} {size} />{:else}<Icon name={name === 'close' ? 'x' : 'search'} {size} />{/if}
{/snippet}

{#snippet searchControl()}
  <div class="search-field dn-mobile-search-field">
        {@render actionIcon('search')}
        <input {@attach i18n.validation} {@attach attachSearch} type="search" bind:value={search} aria-label={searchContext ? `${searchLabel}: ${searchContext}` : searchLabel} placeholder={searchPrompt} autocomplete="off" onkeydown={event => { if (event.key === 'Enter') event.preventDefault(); }} />
        {#if search}<button type="button" class="clear-search dn-icon-button" aria-label={i18n.t('m_c8191190a026')} onclick={() => { search = ''; searchInput.focus(); }}>{@render actionIcon('close')}</button>{/if}
  </div>
{/snippet}

<div class="dn-facet-editor" class:searchable class:desktop-choices={desktopChoices} class:wide-panel={widePanel} class:make-grid={widePanel && field === 'make'} class:filter-panel={filterPanel}>
  {#if header}{@render header(widePanel && searchable ? searchControl : undefined, modelPicker?.navigation())}{/if}
  {#if searchable && !(header && widePanel)}
    <div class="search-wrap">{@render searchControl()}</div>
  {/if}
  <div class="content" {@attach attachContent}>
    {#if range}
      <div class="range">
        <label>{filterPanel && field === 'year' ? i18n.t('inventory.modal.yearFrom') : templateMessage(i18n, 'From{p0}', { p0: field === 'price' ? ' (' + currencySymbol(i18n.locale) + ')' : '' })}<input {@attach i18n.validationFor(field)} type="number" inputmode="numeric" name={`${field}_min`} value={draft[minimumKey]} oninput={event => draft[minimumKey] = event.currentTarget.value} min={field === 'year' ? 1900 : 0} max={field === 'year' ? new Date().getFullYear() + 1 : undefined} step="1" placeholder={i18n.t(filterPanel ? 'inventory.range.unlimited' : 'm_8a702098f672')} aria-invalid={invalid || undefined} /></label>
        <label>{filterPanel && field === 'year' ? i18n.t('inventory.modal.yearTo') : templateMessage(i18n, 'To{p0}', { p0: field === 'price' ? ' (' + currencySymbol(i18n.locale) + ')' : '' })}<input {@attach i18n.validationFor(field)} type="number" inputmode="numeric" name={`${field}_max`} value={draft[maximumKey]} oninput={event => draft[maximumKey] = event.currentTarget.value} min={field === 'year' ? 1900 : 0} max={field === 'year' ? new Date().getFullYear() + 1 : undefined} step="1" placeholder={i18n.t(filterPanel ? 'inventory.range.unlimited' : 'm_585b0741c5fb')} aria-invalid={invalid || undefined} /></label>
      </div>
      {#if invalid}<p role="alert">{i18n.t('m_8418439e87ac')}</p>{/if}
      {#if mobile.current || widePanel}
        <div class="presets" class:price-presets={field === 'price'}>
          {#each (field === 'price' ? budgetPresets : yearPresets) as value (value)}
            <button type="button" aria-pressed={(field === 'price' ? draft.priceMax : draft.yearMin) === value} onclick={() => choosePreset(value)}>{field === 'price' ? i18n.t('inventory.search.upTo', { value: new Intl.NumberFormat(i18n.locale).format(Number(value)), currency: currencySymbol(i18n.locale) }) : i18n.t('inventory.search.fromYear', { year: value })}</button>
          {/each}
        </div>
      {/if}
    {:else if field === 'mileage_max'}
      <label class="mileage">{i18n.t('m_ac9577848c3a')}<input {@attach i18n.validation} type="number" inputmode="numeric" name={field} value={draft.mileageMax} oninput={event => draft.mileageMax = event.currentTarget.value} min="0" step="1" placeholder={i18n.t('m_613e1f06e8da')} /></label>
      {#if mobile.current}
        <div class="presets">
          {#each listingFilterOptions.mileages.filter(Boolean) as value (value)}
            <button type="button" aria-pressed={draft.mileageMax === value} onclick={() => choosePreset(value)}>{i18n.t('m_243dcf897937', { p0: new Intl.NumberFormat(i18n.locale).format(Number(value)) })}</button>
          {/each}
        </div>
      {/if}
    {:else if field === 'model' && desktopChoices && widePanel}
      <DesktopModelGroups bind:this={modelPicker} makes={modelMakes ?? draft.make} selected={draft.model} {search} onchange={choose} />
    {:else}
      <fieldset>
        <legend class="dn-sr-only">{title}</legend>
        {#each choices as option (option)}
          {#if desktopChoices && matches(optionLabel(option))}
            {#if widePanel && field === 'make'}
              {#if filterPanel}
                <div class="make-card">
                  <DesktopMakeChoice value={option} label={optionLabel(option)} name={field} checked={isSelected(option)} onchange={choose} portrait={false} compact />
                  {#if option && onModelMake}<button class="make-models" type="button" aria-label={i18n.t('inventory.modal.modelsFor', { make: option })} onclick={() => onModelMake?.(option)}><Icon name="chevron-down" size={16} /></button>{/if}
                </div>
              {:else}
                <DesktopMakeChoice value={option} label={optionLabel(option)} name={field} checked={isSelected(option)} onchange={choose} />
              {/if}
            {:else}
              <DesktopFilterChoice value={option} label={optionLabel(option)} name={field}
                multiple={field === 'make' || field === 'model' || field === 'equipment'} tile={widePanel}
                checked={isSelected(option)} onchange={choose} />
            {/if}
          {:else if !desktopChoices}
            <label class="choice dn-mobile-filter-choice" hidden={!matches(optionLabel(option))}>
              {#if field === 'equipment' || field === 'make' || field === 'model'}
                <span class="dn-mobile-filter-checkbox">
                  {#if field === 'equipment'}<input {@attach i18n.validation} class="dn-mobile-filter-check" type="checkbox" name="equipment" value={option} bind:group={draft.equipment} />
                  {:else}<input {@attach i18n.validation} class="dn-mobile-filter-check" type="checkbox" name={option ? field : undefined} value={option} checked={isSelected(option)} onchange={() => choose(option)} />{/if}
                  {#if mobile.current}<MobileActionIcon name="check" size={18} />{/if}
                </span>
              {:else}<input {@attach i18n.validation} type="radio" name={field} value={option} checked={isSelected(option)} onclick={() => { if (selected === option) onChoose?.(); }} onchange={() => choose(option)} />{/if}
              <span class="choice-label">{optionLabel(option)}{#if field === 'type'} <span class="choice-count">{listingTypeCount(option)}</span>{/if}</span>
            </label>
          {/if}
        {/each}
      </fieldset>
      {#if !choices.some(option => matches(optionLabel(option)))}
        <div class="empty" role="status"><strong>{i18n.t('m_255ca3bfe9fc')}</strong><p>{i18n.t('m_5c1608c4b6c0')}</p></div>
      {/if}
    {/if}
  </div>
</div>

<style>
  .dn-facet-editor { display: flex; flex: 1 1 auto; flex-direction: column; min-height: 0; }
  .search-wrap { flex: 0 0 auto; padding: 0 var(--dn-overlay-gutter) var(--dn-overlay-gap); }
  .search-field { display: flex; align-items: center; gap: var(--dn-overlay-gap); min-height: var(--dn-overlay-control-height); padding: 0 var(--dn-space-1) 0 var(--dn-space-4); border-radius: var(--dn-radius-control); background: var(--dn-home-panel); color: var(--dn-muted); }
  .search-field:focus-within { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  .search-field input { flex: 1; width: 100%; min-width: 0; height: var(--dn-overlay-control-height); padding: 0; border: 0; outline: none; background: transparent; box-shadow: none; color: var(--dn-ink); font: var(--dn-overlay-field-font); }
  .search-field input:focus-visible { outline: none; box-shadow: none; }
  .search-field input::-webkit-search-cancel-button { display: none; }
  .clear-search { border: 0; border-radius: var(--dn-pill); background: transparent; color: var(--dn-ink); }
  .content { min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 0 var(--dn-overlay-gutter) var(--dn-space-4); }
  .searchable .content { flex: 1; }
  fieldset { display: grid; gap: var(--dn-overlay-gap); padding: 0; margin: 0; border: 0; }
  .desktop-choices fieldset { gap: 0; }
  .desktop-choices .search-field { border: 1px solid var(--dn-line); border-radius: var(--dn-pill); background: var(--dn-white); }
  @media (min-width: 992px) {
    .wide-panel .content { flex: 1; }
    .wide-panel fieldset { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--dn-space-2); }
    .make-grid fieldset { grid-template-columns: repeat(auto-fill, minmax(min(100%, calc(var(--dn-control-height-default) * 3 + var(--dn-space-1))), 1fr)); }
    .wide-panel .range { width: min(100%, 488px); margin-inline: auto; }
    .wide-panel .presets { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--dn-space-2); margin-top: var(--dn-space-4); }
    .wide-panel .price-presets { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .wide-panel .presets button { min-width: 0; min-height: var(--dn-control-height-default); padding: var(--dn-space-2) var(--dn-space-3); border: 0; border-radius: var(--dn-radius-control); background: var(--dn-surface-subtle); color: var(--dn-ink); font: var(--dn-control-font); text-align: left; cursor: pointer; }
    .wide-panel .price-presets button { padding-inline: var(--dn-space-2); }
    .wide-panel .presets button:hover { background: var(--dn-surface-hover); }
    .wide-panel .presets button[aria-pressed=true] { background: var(--dn-surface-hover); box-shadow: inset 0 0 0 1px var(--dn-line-emphasis); }
    .wide-panel .presets button:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
    .filter-panel .content { padding-inline: 0; }
    .filter-panel .range { width: 100%; margin-inline: 0; padding-top: 0; gap: var(--dn-space-4); }
    .filter-panel .range label, .filter-panel .mileage { color: var(--dn-ink); font-weight: var(--dn-weight-medium); }
    .filter-panel input[type=number] { height: var(--dn-control-height-entry-mobile); border-color: var(--dn-line); font-variant-numeric: tabular-nums; }
    .filter-panel input[type=number]:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
    .filter-panel .mileage { max-width: 360px; }
    .filter-panel .presets { display: flex; flex-wrap: wrap; gap: var(--dn-space-2); margin-top: var(--dn-space-5); }
    .filter-panel .presets button { min-height: var(--dn-control-height-compact); padding-inline: var(--dn-space-4); border: 1px solid var(--dn-line); border-radius: var(--dn-pill); background: var(--dn-white); font-size: var(--dn-text-meta); }
    .filter-panel .presets button[aria-pressed=true] { border-color: var(--dn-ink); background: var(--dn-ink); color: var(--dn-white); box-shadow: none; }
    .filter-panel.make-grid fieldset { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .make-card { display: flex; align-items: center; min-width: 0; min-height: 60px; border: 1px solid var(--dn-line); border-radius: var(--dn-radius-sm); background: var(--dn-white); }
    .make-card:has(:global(input:checked)) { background: var(--dn-surface-subtle); border-color: var(--dn-line-strong); }
    .make-card :global(.dn-desktop-choice) { flex: 1; min-width: 0; gap: var(--dn-space-2); padding-inline: var(--dn-space-2); font-size: var(--dn-text-meta); }
    .make-card :global(.dn-desktop-choice-media) { flex-basis: var(--dn-space-7); width: var(--dn-space-7); height: var(--dn-space-7); }
    .make-card :global(.dn-desktop-choice-label) { overflow-wrap: normal; }
    .make-card :global(small) { font-size: var(--dn-text-caption); }
    .make-models { display: grid; flex: 0 0 32px; place-items: center; align-self: stretch; padding: 0; border: 0; border-radius: var(--dn-radius-sm); background: transparent; color: var(--dn-ink); cursor: pointer; }
    .make-models:hover { background: var(--dn-surface-subtle); }
    .make-models:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  }
  @media (min-width: 992px) and (max-width: 1099px) { .filter-panel.make-grid fieldset { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  .choice { display: flex; min-height: var(--dn-overlay-control-height); padding: var(--dn-space-2) var(--dn-space-4); gap: var(--dn-entry-action-gap); justify-content: space-between; align-items: center; border-radius: var(--dn-overlay-row-radius); background: var(--dn-home-panel); color: var(--dn-ink); font: var(--dn-field-font); cursor: pointer; }
  .choice[hidden] { display: none; }
  .choice > span { min-width: 0; overflow-wrap: anywhere; }
  .choice-label { flex: 1; }
  .choice-count { margin-inline-start: var(--dn-space-2); color: var(--dn-muted); font-size: var(--dn-text-meta); }
  .choice:has(:checked) { background: var(--dn-selection-surface); color: var(--dn-ink); box-shadow: inset 0 0 0 1px var(--dn-selection-line); }
  .choice:has(input:focus-visible) { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  .choice input { width: 20px; height: 20px; flex: 0 0 20px; margin: 0; accent-color: var(--dn-ink); }
  .empty { padding: var(--dn-space-6) var(--dn-space-3); color: var(--dn-ink); text-align: center; }
  .empty strong, .empty p { font-size: var(--dn-text-body); }
  .empty p { margin: var(--dn-space-2) 0 0; color: var(--dn-muted); line-height: var(--dn-leading-body); }
  .range { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--dn-space-3); padding-top: var(--dn-space-2); }
  .range label, .mileage { display: block; min-width: 0; color: var(--dn-muted); font: var(--dn-field-label-font); }
  input[type=number] { display: block; width: 100%; min-width: 0; margin-top: var(--dn-space-2); padding: 0 var(--dn-space-3); height: var(--dn-overlay-control-height); border: 1px solid var(--dn-line-strong); border-radius: var(--dn-radius-control); background: var(--dn-white); color: var(--dn-ink); font: var(--dn-field-font); }
  input::placeholder { color: var(--dn-muted); }
  p[role=alert] { color: var(--dn-red); font-size: var(--dn-text-body); margin: var(--dn-space-3) 0 0; }
  @media (max-width: 767px) {
    .dn-facet-editor .content { flex: 0 1 var(--dn-picker-content-height, auto); }
    fieldset { gap: var(--dn-mobile-filter-control-gap); }
    .choice { padding: var(--dn-space-3); }
    .choice:has(:checked) { box-shadow: none; }
    input[type=number] { min-height: var(--dn-control-height-entry-mobile); background: var(--dn-entry-surface); border: 0; font-variant-numeric: tabular-nums; }
    .presets { display: flex; flex-wrap: wrap; gap: var(--dn-space-2); margin-top: var(--dn-space-4); }
    .presets button { min-height: var(--dn-control-hit-height); padding: var(--dn-space-2) var(--dn-space-3); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-button); background: var(--dn-white); color: var(--dn-ink); font: var(--dn-control-font); cursor: pointer; }
    .presets button[aria-pressed=true] { border-color: var(--dn-line-emphasis); background: var(--dn-home-panel); color: var(--dn-ink); }
    .presets button:active { background: var(--dn-surface-hover); }
    .presets button:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
    .choice input[type=radio] { display: grid; place-content: center; box-sizing: border-box; padding: 0; appearance: none; border: 1px solid var(--dn-line-strong); border-radius: var(--dn-radius-circle); background: var(--dn-white); cursor: pointer; }
    .choice input[type=radio]::before { width: 8px; height: 8px; border-radius: var(--dn-radius-circle); background: var(--dn-ink); opacity: 0; content: ''; }
    .choice input[type=radio]:checked { border-color: var(--dn-ink); }
    .choice input[type=radio]:checked::before { opacity: 1; }
    .choice input:focus-visible { outline: none; }
  }
  @media (hover: hover) and (pointer: fine) { .choice:hover, .clear-search:hover { background: var(--dn-surface-hover); } }
  @media (max-width: 767px) and (forced-colors: active) {
    .choice input[type=radio], .choice input[type=radio]:checked { appearance: auto; border: revert; background: revert; }
    .choice input[type=radio]::before { content: none; }
    .choice input:focus-visible { outline: 2px solid Highlight; outline-offset: 2px; }
  }
</style>
