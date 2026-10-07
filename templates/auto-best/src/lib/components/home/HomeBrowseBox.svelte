<script lang="ts">
  import { Popover } from 'bits-ui';
  import { tick, type Snippet } from 'svelte';
  import { MediaQuery } from 'svelte/reactivity';
  import type { Attachment } from 'svelte/attachments';
  import { focusPopover } from '$lib/ui/focus';
  import { resolve } from '$app/paths';
  import { getI18n } from '$lib/locale/context';
  import { currencySymbol } from '$lib/locale/core';
  import { vehicleCount } from '$lib/locale/messages';
  import { filterListingVehicles, listingBudgetCaps, listingHiddenFields, listingVehicles } from '$data/listing';
  import {
    cleanListingFormData, emptyListingDraft, formatListingNumber,
    listingDraftFromFilters, listingFacetSummary, listingFacetTitle,
    listingFiltersFromDraft, withListingMake, withListingModel,
    type ListingDraft
  } from '$data/listing-draft';
  import ListingFacetEditor from '$components/listing/ListingFacetEditor.svelte';
  import FilterPopoverHeader, { type PickerNavigation } from '$components/listing/FilterPopoverHeader.svelte';
  import Icon from '$components/ui/Icon.svelte';

  type Field = 'make' | 'model' | 'body' | 'price';
  const fields: readonly Field[] = ['make', 'model', 'body', 'price'];
  const i18n = getI18n();
  const id = $props.id();
  const mobile = new MediaQuery('(max-width: 767px)', false);
  const desktop = new MediaQuery('(min-width: 992px)', false);
  const budgetPresets = listingBudgetCaps().map(String);
  let draft = $state<ListingDraft>(emptyListingDraft());
  let pending = $state<ListingDraft>(emptyListingDraft());
  let openField = $state<Field>();
  let keyboardOpen = false;
  let portalTarget = $state<HTMLElement>();
  let pickers = $state<Record<Field, HTMLDivElement | null>>({ make: null, model: null, body: null, price: null });
  let triggers = $state<Record<Field, HTMLButtonElement | null>>({ make: null, model: null, body: null, price: null });
  const hiddenFields = $derived(listingHiddenFields(listingFiltersFromDraft(draft)));
  const matching = $derived(filterListingVehicles(listingVehicles, listingFiltersFromDraft(pending), i18n.locale).length);
  const invalidRange = $derived(Boolean(pending.priceMin && pending.priceMax && Number(pending.priceMin) > Number(pending.priceMax)));
  const attachRoot: Attachment<HTMLFormElement> = node => { portalTarget = node.closest<HTMLElement>('.dn-app-shell') ?? undefined; };

  $effect(() => { if (mobile.current) openField = undefined; });

  const title = (field: Field) => field === 'body' ? i18n.t('m_191c24bf12d5') : listingFacetTitle(field, i18n.locale);

  function summary(field: Field) {
    if (field === 'make') return draft.make.join(', ') || i18n.t('inventory.search.allMakes');
    if (field === 'model') return draft.model.join(', ') || i18n.t('inventory.search.allModels');
    if (field === 'price' && draft.priceMax && !draft.priceMin) return i18n.t('inventory.search.upTo', {
      value: formatListingNumber(draft.priceMax, i18n.locale), currency: currencySymbol(i18n.locale)
    });
    return listingFacetSummary(field, draft, i18n.locale);
  }

  function setOpen(field: Field, open: boolean) {
    if (open) {
      // Each selector owns a temporary draft; only Save changes the Home bar.
      pending = listingDraftFromFilters(listingFiltersFromDraft(draft));
      openField = field;
    } else if (openField === field) openField = undefined;
  }

  function clear(field: Field) {
    if (field === 'make') pending = withListingMake(pending, '');
    else if (field === 'model') pending = withListingModel(pending, '');
    else if (field === 'body') pending = { ...pending, body: '' };
    else pending = { ...pending, priceMin: '', priceMax: '' };
  }

  function save() {
    const picker = openField ? pickers[openField] : null;
    if (invalidRange || !Array.from(picker?.querySelectorAll<HTMLInputElement>('input') ?? []).every(input => input.reportValidity())) return;
    draft = listingDraftFromFilters(listingFiltersFromDraft(pending));
    openField = undefined;
  }

  function restoreFocus(event: Event, field: Field) {
    event.preventDefault();
    const closingPicker = pickers[field];
    void tick().then(() => {
      if (openField || !triggers[field]?.isConnected) return;
      const active = document.activeElement;
      if (active !== document.body && active !== triggers[field] && !closingPicker?.contains(active)) return;
      triggers[field]?.focus({ preventScroll: true });
    });
  }
</script>

<form class="dn-home-browse" aria-label={i18n.t('m_0ae7a3ecbc83')} method="GET" action={i18n.href(resolve('/listing-grid'))}
  {@attach attachRoot} onformdata={event => cleanListingFormData(event.formData)}>
  {#each fields as field (field)}
    {#snippet facetHeader(search: Snippet | undefined, navigation: PickerNavigation | undefined)}
      <FilterPopoverHeader id={`${id}-${field}-title`} title={title(field)} {search} {navigation} />
    {/snippet}
    <Popover.Root open={openField === field} onOpenChange={open => setOpen(field, open)}>
      <Popover.Trigger bind:ref={triggers[field]} type="button" class="dn-home-browse__field" data-field={field}
        aria-labelledby={`${id}-${field}-label ${id}-${field}-value`} title={summary(field)}
        onclick={event => { keyboardOpen = event.detail === 0; }} onkeydowncapture={event => { if (event.key === 'Enter' || event.key === ' ') keyboardOpen = true; }}>
        <span class="dn-home-browse__copy">
          <span class="dn-home-browse__label" id={`${id}-${field}-label`}>{title(field)}</span>
          <span class="dn-home-browse__value" id={`${id}-${field}-value`}>{summary(field)}</span>
        </span>
        <Icon name="chevron-down" size={18} />
      </Popover.Trigger>
      <Popover.Portal to={portalTarget}>
        <Popover.Content bind:ref={pickers[field]} class="dn-home-browse-picker" role="dialog" aria-labelledby={`${id}-${field}-title`}
          data-desktop-panel={desktop.current} data-wide-choices={field === 'make' || field === 'model'} data-make-grid={field === 'make'}
          sideOffset={desktop.current ? 16 : 8} align={desktop.current && field === 'price' ? 'end' : 'start'} collisionPadding={16}
          onOpenAutoFocus={event => { event.preventDefault(); void tick().then(() => { if (openField === field) focusPopover(pickers[field], pickers[field]?.querySelector<HTMLInputElement>('input[type=search], input[type=number], input:checked') ?? null, keyboardOpen); }); }}
          onCloseAutoFocus={event => restoreFocus(event, field)}
          onkeydown={event => { if (event.key === 'Enter' && event.target instanceof HTMLInputElement && event.target.type === 'number') { event.preventDefault(); save(); } }}>
          {#if !desktop.current}<FilterPopoverHeader id={`${id}-${field}-title`} title={title(field)} />{/if}
          <div class="dn-home-browse-picker__editor" class:dn-home-browse-picker__editor--price={field === 'price'}>
            <ListingFacetEditor {field} bind:draft={pending} desktopChoices widePanel={desktop.current} header={desktop.current ? facetHeader : undefined} />
            {#if field === 'price' && !desktop.current}
              <div class="dn-home-browse-picker__presets">
                {#each budgetPresets as value (value)}
                  <button type="button" aria-pressed={pending.priceMax === value} onclick={() => pending.priceMax = value}>{i18n.t('inventory.search.upTo', { value: formatListingNumber(value, i18n.locale), currency: currencySymbol(i18n.locale) })}</button>
                {/each}
              </div>
            {/if}
          </div>
          <footer class="dn-home-browse-picker__footer">
            <button class="dn-home-browse-picker__clear" type="button" onclick={() => clear(field)}>{i18n.t('action.clearShort')}</button>
            <button class="dn-home-browse-picker__save" type="button" disabled={invalidRange} onclick={save} aria-live={desktop.current ? 'polite' : undefined}>{i18n.t('m_1509f561f241')}{#if desktop.current} <span class="dn-home-browse-picker__count">· {vehicleCount(i18n.locale, matching)}</span>{/if}</button>
          </footer>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  {/each}
  {#each hiddenFields as [name, value], index (`${name}-${index}`)}<input type="hidden" {name} {value} />{/each}
  <button class="dn-home-browse__search" type="submit" aria-label={i18n.t('m_49c266baaaa7')} title={i18n.t('m_49c266baaaa7')}><Icon name="search" size={22} /></button>
</form>

<style>
  .dn-home-browse { --dn-home-browse-field-height: calc(var(--dn-control-height-default) + var(--dn-space-3)); display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)) auto; gap: var(--dn-space-1); align-items: stretch; min-width: 0; padding: var(--dn-space-2); border-radius: var(--dn-pill); background: var(--dn-white); box-shadow: var(--dn-card-shadow); }
  :global(.dn-home-browse__field) { position: relative; display: flex; gap: var(--dn-space-3); align-items: center; justify-content: space-between; min-width: 0; min-height: var(--dn-home-browse-field-height); margin: 0; padding: var(--dn-space-2) var(--dn-space-4); border: 0; border-radius: var(--dn-pill); background: transparent; color: var(--dn-ink); cursor: pointer; transition: background-color 160ms ease; }
  :global(.dn-home-browse__field:not([data-field=price])::after) { content: ''; position: absolute; top: 50%; inset-inline-end: calc(var(--dn-space-half) * -1); width: 1px; height: var(--dn-space-8); transform: translateY(-50%); background: var(--dn-line); pointer-events: none; }
  .dn-home-browse__copy { display: grid; gap: var(--dn-space-half); min-width: 0; text-align: left; }
  .dn-home-browse__label { color: var(--dn-muted); font: var(--dn-field-label-font); }
  .dn-home-browse__value { overflow: hidden; color: var(--dn-ink); font: var(--dn-field-font); font-size: var(--dn-text-control-prominent); text-overflow: ellipsis; white-space: nowrap; }
  :global(.dn-home-browse__field > svg) { flex-shrink: 0; color: var(--dn-muted); }
  :global(.dn-home-browse__field:is(:hover, :focus-visible, [data-state=open])) { background: var(--dn-surface-subtle); }
  :global(.dn-home-browse__field:is(:hover, :focus-visible, [data-state=open])::after), :global(.dn-home-browse__field:has(+ .dn-home-browse__field:is(:hover, :focus-visible, [data-state=open]))::after) { opacity: 0; }
  :global(.dn-home-browse__field:focus-visible), .dn-home-browse__search:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  .dn-home-browse__search { display: grid; place-items: center; align-self: center; flex-shrink: 0; width: var(--dn-home-browse-field-height); height: var(--dn-home-browse-field-height); padding: 0; border: 0; border-radius: var(--dn-pill); background: var(--dn-ink-deep); color: var(--dn-white); cursor: pointer; transition: background-color 160ms ease; }
  .dn-home-browse__search:hover { background: var(--dn-ink-hover); }
  :global(.dn-home-browse-picker) { display: flex; flex-direction: column; width: min(380px, calc(100vw - 32px)); max-height: min(520px, var(--bits-popover-content-available-height, 520px)); padding: 0; border: 1px solid var(--dn-line); border-radius: var(--dn-radius-lg); background: var(--dn-white); color: var(--dn-ink); box-shadow: var(--dn-shadow); outline: none; z-index: 11002; }
  .dn-home-browse-picker__editor { display: flex; flex: 1; flex-direction: column; min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
  .dn-home-browse-picker__editor--price :global(.dn-facet-editor) { flex: 0 0 auto; }
  .dn-home-browse-picker__editor--price :global(.content) { overflow: visible; }
  .dn-home-browse-picker__presets { display: flex; flex: 0 0 auto; flex-wrap: wrap; gap: var(--dn-space-2); padding: 0 var(--dn-space-4) var(--dn-space-4); }
  .dn-home-browse-picker__presets button { min-height: var(--dn-control-height-default); padding: var(--dn-space-2) var(--dn-space-3); border: 1px solid var(--dn-line); border-radius: var(--dn-pill); background: var(--dn-white); color: var(--dn-ink); font: var(--dn-control-font); cursor: pointer; }
  .dn-home-browse-picker__presets button[aria-pressed=true] { border-color: var(--dn-line-emphasis); background: var(--dn-home-panel); }
  .dn-home-browse-picker__footer { display: flex; flex-shrink: 0; justify-content: space-between; gap: var(--dn-space-3); padding: var(--dn-space-3) var(--dn-space-4); border-top: 1px solid var(--dn-line); }
  .dn-home-browse-picker__footer button { min-height: var(--dn-control-height-default); padding: var(--dn-space-2) var(--dn-space-5); border: 0; border-radius: var(--dn-pill); font: var(--dn-control-font); cursor: pointer; }
  .dn-home-browse-picker__clear { background: var(--dn-surface-subtle); color: var(--dn-ink); }
  .dn-home-browse-picker__save { background: var(--dn-ink-deep); color: var(--dn-white); }
  .dn-home-browse-picker__save:disabled { opacity: 0.45; cursor: default; }
  .dn-home-browse-picker__clear:hover, .dn-home-browse-picker__presets button:hover { background: var(--dn-surface-hover); }
  .dn-home-browse-picker__save:enabled:hover { background: var(--dn-ink-hover); }
  .dn-home-browse-picker__footer button:focus-visible, .dn-home-browse-picker__presets button:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
  @media (min-width: 992px) {
    :global(.dn-home-browse-picker[data-desktop-panel='true']) { width: min(480px, calc(100vw - 32px)); }
    :global(.dn-home-browse-picker[data-desktop-panel='true'][data-wide-choices='true']) { width: min(640px, calc(100vw - 32px)); }
    :global(.dn-home-browse-picker[data-desktop-panel='true'][data-make-grid='true']) { width: min(840px, calc(100vw - 32px)); }
    .dn-home-browse-picker__editor { overflow: hidden; }
    .dn-home-browse-picker__editor--price :global(.dn-facet-editor) { flex: 1; }
    .dn-home-browse-picker__save:has(.dn-home-browse-picker__count) { display: flex; align-items: center; gap: var(--dn-space-2); }
    .dn-home-browse-picker__count { white-space: nowrap; }
  }
  @media (min-width: 768px) and (max-width: 991px) { :global(.dn-home-browse__field) { gap: var(--dn-space-2); padding-inline: var(--dn-space-3); } }
  @media (prefers-reduced-motion: reduce) { :global(.dn-home-browse__field), .dn-home-browse__search { transition: none; } }
</style>
