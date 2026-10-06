<script lang="ts">
  import { Popover } from 'bits-ui';
  import { tick } from 'svelte';
  import { MediaQuery } from 'svelte/reactivity';
  import type { Attachment } from 'svelte/attachments';
  import { resolve } from '$app/paths';
  import { getI18n } from '$lib/locale/context';
  import { currencySymbol } from '$lib/locale/core';
  import { listingBudgetCaps, listingHiddenFields } from '$data/listing';
  import {
    cleanListingFormData, emptyListingDraft, formatListingNumber,
    listingDraftFromFilters, listingFacetSummary, listingFacetTitle,
    listingFiltersFromDraft, withListingMake, withListingModel,
    type ListingDraft
  } from '$data/listing-draft';
  import ListingFacetEditor from '$components/listing/ListingFacetEditor.svelte';
  import Icon from '$components/ui/Icon.svelte';

  type Field = 'make' | 'model' | 'price';
  const fields: readonly Field[] = ['make', 'model', 'price'];
  const i18n = getI18n();
  const id = $props.id();
  const mobile = new MediaQuery('(max-width: 767px)', false);
  const budgetPresets = listingBudgetCaps().map(String);
  let draft = $state<ListingDraft>(emptyListingDraft());
  let pending = $state<ListingDraft>(emptyListingDraft());
  let openField = $state<Field>();
  let portalTarget = $state<HTMLElement>();
  let pickers = $state<Record<Field, HTMLDivElement | null>>({ make: null, model: null, price: null });
  let triggers = $state<Record<Field, HTMLButtonElement | null>>({ make: null, model: null, price: null });
  const hiddenFields = $derived(listingHiddenFields(listingFiltersFromDraft(draft)));
  const invalidRange = $derived(Boolean(pending.priceMin && pending.priceMax && Number(pending.priceMin) > Number(pending.priceMax)));
  const attachRoot: Attachment<HTMLFormElement> = node => { portalTarget = node.closest<HTMLElement>('.dn-app-shell') ?? undefined; };

  $effect(() => { if (mobile.current) openField = undefined; });

  function summary(field: Field) {
    if (field === 'make') return draft.make.join(', ') || i18n.t('inventory.search.allMakes');
    if (field === 'model') return draft.model.join(', ') || i18n.t('inventory.search.allModels');
    if (draft.priceMax && !draft.priceMin) return i18n.t('inventory.search.upTo', {
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
    <Popover.Root open={openField === field} onOpenChange={open => setOpen(field, open)}>
      <Popover.Trigger bind:ref={triggers[field]} type="button" class="dn-home-browse__field" data-field={field}
        aria-labelledby={`${id}-${field}-label ${id}-${field}-value`} title={summary(field)}>
        <span class="dn-home-browse__copy">
          <span class="dn-home-browse__label" id={`${id}-${field}-label`}>{listingFacetTitle(field, i18n.locale)}</span>
          <span class="dn-home-browse__value" id={`${id}-${field}-value`}>{summary(field)}</span>
        </span>
        <Icon name="chevron-down" size={18} />
      </Popover.Trigger>
      <Popover.Portal to={portalTarget}>
        <Popover.Content bind:ref={pickers[field]} class="dn-home-browse-picker" role="dialog" aria-labelledby={`${id}-${field}-title`}
          sideOffset={8} align="start" collisionPadding={16}
          onOpenAutoFocus={event => { event.preventDefault(); void tick().then(() => pickers[field]?.querySelector<HTMLInputElement>('input[type=search], input[type=number]')?.focus({ preventScroll: true })); }}
          onCloseAutoFocus={event => restoreFocus(event, field)}
          onkeydown={event => { if (event.key === 'Enter' && event.target instanceof HTMLInputElement && event.target.type === 'number') { event.preventDefault(); save(); } }}>
          <header class="dn-home-browse-picker__header">
            <h2 id={`${id}-${field}-title`}>{listingFacetTitle(field, i18n.locale)}</h2>
            <Popover.Close type="button" class="dn-home-browse-picker__close" aria-label={i18n.t('m_84305a580997')}><Icon name="x" size={20} /></Popover.Close>
          </header>
          <div class="dn-home-browse-picker__editor" class:dn-home-browse-picker__editor--price={field === 'price'}>
            <ListingFacetEditor {field} bind:draft={pending} />
            {#if field === 'price'}
              <div class="dn-home-browse-picker__presets">
                {#each budgetPresets as value (value)}
                  <button type="button" aria-pressed={pending.priceMax === value} onclick={() => pending.priceMax = value}>{i18n.t('inventory.search.upTo', { value: formatListingNumber(value, i18n.locale), currency: currencySymbol(i18n.locale) })}</button>
                {/each}
              </div>
            {/if}
          </div>
          <footer class="dn-home-browse-picker__footer">
            <button class="dn-home-browse-picker__clear" type="button" onclick={() => clear(field)}>{i18n.t('action.clearShort')}</button>
            <button class="dn-home-browse-picker__save" type="button" disabled={invalidRange} onclick={save}>{i18n.t('m_1509f561f241')}</button>
          </footer>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  {/each}
  {#each hiddenFields as [name, value], index (`${name}-${index}`)}<input type="hidden" {name} {value} />{/each}
  <button class="dn-home-browse__search" type="submit" aria-label={i18n.t('m_49c266baaaa7')} title={i18n.t('m_49c266baaaa7')}><Icon name="search" size={22} /></button>
</form>

<style>
  .dn-home-browse { --dn-home-browse-field-height: calc(var(--dn-control-height-default) + var(--dn-space-3)); display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)) auto; gap: var(--dn-space-1); align-items: stretch; min-width: 0; padding: var(--dn-space-2); border-radius: var(--dn-pill); background: var(--dn-white); box-shadow: var(--dn-card-shadow); }
  :global(.dn-home-browse__field) { display: flex; gap: var(--dn-space-3); align-items: center; justify-content: space-between; min-width: 0; min-height: var(--dn-home-browse-field-height); margin: 0; padding: var(--dn-space-2) var(--dn-space-5); border: 0; border-radius: var(--dn-pill); background: var(--dn-surface-subtle); color: var(--dn-ink); cursor: pointer; transition: background-color 160ms ease; }
  .dn-home-browse__copy { display: grid; gap: var(--dn-space-half); min-width: 0; text-align: left; }
  .dn-home-browse__label { color: var(--dn-muted); font-size: var(--dn-text-caption); font-weight: var(--dn-weight-ui); line-height: var(--dn-leading-meta); }
  .dn-home-browse__value { overflow: hidden; color: var(--dn-ink); font: var(--dn-control-font); font-size: var(--dn-text-control-prominent); text-overflow: ellipsis; white-space: nowrap; }
  :global(.dn-home-browse__field > svg) { flex-shrink: 0; color: var(--dn-muted); }
  :global(.dn-home-browse__field:hover), :global(.dn-home-browse__field[data-state=open]) { background: var(--dn-surface-hover); }
  :global(.dn-home-browse__field:focus-visible), .dn-home-browse__search:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  .dn-home-browse__search { display: grid; place-items: center; align-self: center; flex-shrink: 0; width: var(--dn-home-browse-field-height); height: var(--dn-home-browse-field-height); padding: 0; border: 0; border-radius: var(--dn-pill); background: var(--dn-ink-deep); color: var(--dn-white); cursor: pointer; transition: background-color 160ms ease; }
  .dn-home-browse__search:hover { background: var(--dn-ink-hover); }
  :global(.dn-home-browse-picker) { display: flex; flex-direction: column; width: min(380px, calc(100vw - 32px)); max-height: min(520px, var(--bits-popover-content-available-height, 520px)); padding: 0; border: 1px solid var(--dn-line); border-radius: var(--dn-radius-lg); background: var(--dn-white); color: var(--dn-ink); box-shadow: var(--dn-shadow); outline: none; z-index: 11002; }
  .dn-home-browse-picker__header { display: flex; flex-shrink: 0; align-items: center; justify-content: space-between; gap: var(--dn-space-3); padding: var(--dn-space-3) var(--dn-space-4); }
  .dn-home-browse-picker__header h2 { margin: 0; font-size: var(--dn-text-body); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-heading); }
  :global(.dn-home-browse-picker__close) { display: grid; place-items: center; width: var(--dn-control-height-default); height: var(--dn-control-height-default); padding: 0; border: 0; border-radius: var(--dn-pill); background: var(--dn-surface-subtle); color: var(--dn-ink); cursor: pointer; }
  .dn-home-browse-picker__editor { display: flex; flex: 1; flex-direction: column; min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
  .dn-home-browse-picker__editor--price :global(.dn-facet-editor) { flex: 0 0 auto; }
  .dn-home-browse-picker__editor--price :global(.content) { overflow: visible; }
  .dn-home-browse-picker__presets { display: flex; flex: 0 0 auto; flex-wrap: wrap; gap: var(--dn-space-2); padding: 0 var(--dn-space-4) var(--dn-space-4); }
  .dn-home-browse-picker__presets button { min-height: var(--dn-control-height-default); padding: var(--dn-space-2) var(--dn-space-3); border: 1px solid var(--dn-line); border-radius: var(--dn-pill); background: var(--dn-white); color: var(--dn-ink); font: var(--dn-control-font); font-size: var(--dn-text-meta); cursor: pointer; }
  .dn-home-browse-picker__presets button[aria-pressed=true] { border-color: var(--dn-line-emphasis); background: var(--dn-home-panel); }
  .dn-home-browse-picker__footer { display: flex; flex-shrink: 0; justify-content: space-between; gap: var(--dn-space-3); padding: var(--dn-space-3) var(--dn-space-4); border-top: 1px solid var(--dn-line); }
  .dn-home-browse-picker__footer button { min-height: var(--dn-control-height-default); padding: var(--dn-space-2) var(--dn-space-5); border: 0; border-radius: var(--dn-pill); font: var(--dn-control-font); cursor: pointer; }
  .dn-home-browse-picker__clear { background: var(--dn-surface-subtle); color: var(--dn-ink); }
  .dn-home-browse-picker__save { background: var(--dn-ink-deep); color: var(--dn-white); }
  .dn-home-browse-picker__save:disabled { opacity: 0.45; cursor: default; }
  .dn-home-browse-picker__clear:hover, .dn-home-browse-picker__presets button:hover, :global(.dn-home-browse-picker__close:hover) { background: var(--dn-surface-hover); }
  .dn-home-browse-picker__save:enabled:hover { background: var(--dn-ink-hover); }
  .dn-home-browse-picker__footer button:focus-visible, .dn-home-browse-picker__presets button:focus-visible, :global(.dn-home-browse-picker__close:focus-visible) { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
  @media (min-width: 768px) and (max-width: 991px) { :global(.dn-home-browse__field) { padding-inline: var(--dn-space-4); } }
  @media (prefers-reduced-motion: reduce) { :global(.dn-home-browse__field), .dn-home-browse__search { transition: none; } }
</style>
