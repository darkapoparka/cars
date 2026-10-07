<script lang="ts">
  import { Popover } from 'bits-ui';
  import { tick } from 'svelte';
  import { MediaQuery } from 'svelte/reactivity';
  import type { Attachment } from 'svelte/attachments';
  import { focusPopover } from '$lib/ui/focus';
  import { getI18n } from '$lib/locale/context';
  import { listingSelectionHas, listingTypeCount } from '$data/listing';
  import { desktopMakeOptions } from '$data/desktop-makes';
  import { listingChoiceOptions, listingChoiceLabel, listingChoiceTitle, listingChoiceValue, withListingChoice, listingMakeForModel, listingOptionsWithCurrent, listingSuggestionMatcher, type ListingChoiceField, type ListingDraft } from '$data/listing-draft';
  import Icon from '$components/ui/Icon.svelte';
  import DesktopFilterChoice from './DesktopFilterChoice.svelte';
  import DesktopMakeChoice from './DesktopMakeChoice.svelte';
  import DesktopModelGroups from './DesktopModelGroups.svelte';
  import FilterPopoverHeader from './FilterPopoverHeader.svelte';

  let { field, draft = $bindable(), label, placeholder, displayValue, showCounts = false, showLabel = true, compact = false, submitValues = true, resetKey = 0, onchange, oncommit }: {
    field: ListingChoiceField; draft: ListingDraft; label?: string; placeholder?: string; displayValue?: string;
    showCounts?: boolean; showLabel?: boolean; compact?: boolean;
    submitValues?: boolean; resetKey?: number; onchange?: (draft: ListingDraft) => void; oncommit?: (draft: ListingDraft) => void;
  } = $props();
  const i18n = getI18n();
  const desktop = new MediaQuery('(min-width: 992px)', false);
  const id = $props.id();
  let open = $state(false);
  let search = $state('');
  let browsedValue = $state<string | null>(null);
  let searchInput = $state<HTMLInputElement | null>(null);
  let picker = $state<HTMLDivElement | null>(null);
  let optionsList = $state<HTMLDivElement | null>(null);
  let trigger = $state<HTMLButtonElement | null>(null);
  let focusOnClose: HTMLElement | null = null;
  let keyboardBrowsing = false;
  let keyboardOpen = false;
  let portalTarget = $state<HTMLElement>();
  // A native dialog's top layer must also own its nested picker and focus targets.
  const attachRoot: Attachment<HTMLDivElement> = node => { portalTarget = node.closest('dialog') ?? node.closest<HTMLElement>('.dn-app-shell') ?? undefined; };
  const title = $derived(label ?? listingChoiceTitle(field, i18n.locale));
  const multiple = $derived(field === 'make' || field === 'model');
  const searchable = $derived(multiple || field === 'version');
  const searchLabel = $derived(i18n.t(field === 'make' ? 'm_150bec5925bd' : field === 'model' ? 'm_269619120191' : 'inventory.search.within'));
  const allLabel = $derived(field === 'sort' ? listingChoiceLabel(field, '', i18n.locale) : i18n.t(field === 'make' ? 'inventory.search.allMakes' : field === 'model' ? 'inventory.search.allModels' : 'm_3cd085e8c069'));
  const selected = $derived(listingChoiceValue(draft, field));
  const checkedValue = $derived(browsedValue ?? selected);
  const optionLabel = (value: string) => (value ? listingChoiceLabel(field, value, i18n.locale) : allLabel) + (showCounts && field === 'type' ? ` (${listingTypeCount(value)})` : '');
  const summary = $derived(displayValue ?? ((Array.isArray(selected) ? selected.join(', ') : selected && optionLabel(selected)) || placeholder || (field === 'type' && showCounts ? optionLabel('') : showLabel ? allLabel : title)));
  const matches = $derived(listingSuggestionMatcher(search, i18n.locale));
  const availableOptions = $derived((field === 'make' && desktop.current ? desktopMakeOptions(selected, i18n.locale)
    : listingOptionsWithCurrent(listingChoiceOptions(field, draft.make), selected))
    .filter(value => value && matches(optionLabel(value) + (field === 'model' ? ' ' + listingMakeForModel(value) : ''))));
  const options = $derived(multiple && !(field === 'make' && desktop.current) ? availableOptions.toSorted((a, b) => a.localeCompare(b, i18n.locale, { numeric: true })) : availableOptions);
  $effect(() => { resetKey; search = ''; focusOnClose = null; open = false; });

  function choose(value: string) {
    if (!multiple && keyboardBrowsing) { browsedValue = value; return; }
    draft = withListingChoice(draft, field, value);
    onchange?.(draft);
    // Click, Space or Enter commits; radio arrows only browse until that choice.
    if (!multiple && !keyboardBrowsing) { open = false; oncommit?.(draft); }
  }
  function focusPicker(event: Event) {
    event.preventDefault();
    void tick().then(() => {
      if (!open) return;
      const target = searchable ? searchInput : picker?.querySelector<HTMLInputElement>('input:checked');
      const row = target?.closest('label');
      // Reveal the selected preset inside its list without moving the page or modal.
      if (!searchable && row && optionsList) {
        const option = row.getBoundingClientRect(), list = optionsList.getBoundingClientRect();
        if (option.top < list.top) optionsList.scrollTop -= list.top - option.top;
        else if (option.bottom > list.bottom) optionsList.scrollTop += option.bottom - list.bottom;
      }
      focusPopover(picker, target ?? null, keyboardOpen);
    });
  }
  function restoreFocus(event: Event) {
    event.preventDefault();
    const target = focusOnClose;
    const closingPicker = picker;
    // Wait for the picker focus trap to unmount before restoring the intended control.
    void tick().then(() => {
      if (open || !trigger?.isConnected || !target?.isConnected) return;
      if (portalTarget instanceof HTMLDialogElement && !portalTarget.open) return;
      // A newly opened picker or another control may already own focus after a pointer click.
      const active = target.ownerDocument.activeElement;
      if (target !== trigger && active !== target.ownerDocument.body && !closingPicker?.contains(active)) return;
      target.focus({ preventScroll: true });
    });
  }
  function interactOutside(event: PointerEvent) {
    const element = event.target;
    focusOnClose = element instanceof Element
      ? element.closest<HTMLElement>('button, input, select, textarea, a[href], [tabindex], [contenteditable="true"]')
        ?? element.closest('label')?.control ?? null
      : null;
  }
</script>

<div class="dn-identity-field" class:compact data-field={field} {@attach attachRoot}>
  <span class:dn-sr-only={!showLabel} class="dn-field-label" id={id + '-label'}>{title}</span>
  <Popover.Root bind:open onOpenChange={value => { if (value) { search = ''; browsedValue = null; keyboardBrowsing = false; focusOnClose = trigger; } }}>
    <Popover.Trigger bind:ref={trigger} type="button" class="dn-identity-trigger" aria-labelledby={id + '-label' + (selected.length ? ' ' + id + '-value' : '')}
      onclick={event => { keyboardOpen = event.detail === 0; }} onkeydowncapture={event => { if (event.key === 'Enter' || event.key === ' ') keyboardOpen = true; }}>
      <span id={id + '-value'}>{summary}</span><Icon name="chevron-down" size={18} />
    </Popover.Trigger>
    <Popover.Portal to={portalTarget}>
      <Popover.Content bind:ref={picker} class="dn-filter-picker" role="dialog" aria-labelledby={id + '-title'} sideOffset={8} align="start" collisionPadding={16}
        onOpenAutoFocus={focusPicker}
        onCloseAutoFocus={restoreFocus} onInteractOutside={interactOutside}
        onkeydowncapture={event => { keyboardBrowsing = event.key.startsWith('Arrow'); }} onpointerdowncapture={() => { keyboardBrowsing = false; }}>
        <FilterPopoverHeader id={id + '-title'} {title} />
        {#if searchable}<label class="dn-picker-search"><Icon name="search" size={18} /><input bind:this={searchInput} type="search" bind:value={search} aria-label={searchLabel} placeholder={searchLabel} onkeydown={event => { if (event.key === 'Enter') event.preventDefault(); }} /></label>{/if}
        <div bind:this={optionsList} class="dn-picker-options" role="group" aria-label={title}>
          {#if field === 'model' && desktop.current}
            <DesktopModelGroups makes={draft.make} selected={draft.model} {search} compact name={id + '-choice'} onchange={choose} />
          {:else}
          {#if field === 'make' && desktop.current}
            <DesktopMakeChoice value="" label={optionLabel('')} checked={!checkedValue.length} portrait={false} name={id + '-choice'} onchange={choose} />
          {:else}
            <DesktopFilterChoice value="" label={optionLabel('')} checked={!checkedValue.length} {multiple} name={id + '-choice'} onchange={choose} />
          {/if}
          {#each options as value (value)}
            {#if field === 'make' && desktop.current}
              <DesktopMakeChoice {value} label={optionLabel(value)} checked={listingSelectionHas(draft.make, value)} portrait={false} name={id + '-choice'} onchange={choose} />
            {:else}
              <DesktopFilterChoice {value} label={optionLabel(value)}
              description={field === 'model' && !draft.make.length ? listingMakeForModel(value) : ''}
              checked={Array.isArray(checkedValue) ? listingSelectionHas(checkedValue, value) : checkedValue === value}
                {multiple} name={id + '-choice'} onchange={choose} />
            {/if}
          {/each}
          {#if !options.length}<p class="dn-empty" role="status">{i18n.t('inventory.search.empty')}</p>{/if}
          {/if}
        </div>
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
  {#if submitValues}{#each Array.isArray(selected) ? selected : selected ? [selected] : [] as value (value)}<input type="hidden" name={field} {value} />{/each}{/if}
</div>

<style>
  .dn-identity-field { display: flex; flex-direction: column; min-width: 0; }
  .dn-field-label { display: block; margin-bottom: var(--dn-space-2); color: var(--dn-muted); font: var(--dn-field-label-font); }
  .dn-sr-only { margin: 0; }
  :global(.dn-identity-trigger) { display: flex; align-items: center; justify-content: space-between; gap: var(--dn-space-2); width: 100%; min-width: 0; min-height: var(--dn-control-height-prominent); padding: var(--dn-space-2) var(--dn-space-4); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-control); background: var(--dn-home-panel); color: var(--dn-ink); font: var(--dn-field-font); text-align: left; cursor: pointer; }
  :global(.dn-identity-trigger > span) { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  :global(.dn-identity-trigger > svg) { flex-shrink: 0; color: var(--dn-muted); }
  :global(.dn-identity-trigger:hover) { border-color: var(--dn-line-strong); }
  :global(.dn-identity-trigger:focus-visible) { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  .compact :global(.dn-identity-trigger) { min-height: var(--dn-identity-control-height, var(--dn-control-hit-height)); background: var(--dn-surface-subtle); padding-inline: var(--dn-space-3); }
  :global(.dn-filter-picker) { z-index: 11002; width: min(380px, calc(100vw - 32px)); max-height: min(480px, var(--bits-popover-content-available-height, 480px)); padding: 0; border: 1px solid var(--dn-line); border-radius: var(--dn-radius); background: var(--dn-white); color: var(--dn-ink); box-shadow: var(--dn-shadow); display: flex; flex-direction: column; outline: none; }
  .dn-picker-search { display: flex; flex: none; align-items: center; gap: var(--dn-space-2); min-height: var(--dn-control-hit-height); margin: 0 var(--dn-space-4) var(--dn-space-2); padding-inline: var(--dn-space-3); border: 1px solid var(--dn-line); border-radius: var(--dn-pill); background: var(--dn-white); color: var(--dn-muted); }
  .dn-picker-search input { width: 0; flex: 1; min-width: 0; padding: var(--dn-space-2) 0; border: 0; background: transparent; color: var(--dn-ink); font: var(--dn-field-font); outline: none; }
  .dn-picker-search:has(input:focus-visible) { outline: 1px solid var(--dn-focus); outline-offset: -1px; }
  .dn-picker-options { min-height: 0; margin: 0 var(--dn-space-4) var(--dn-space-4); overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; }
  .dn-empty { padding: var(--dn-space-3); color: var(--dn-muted); font-size: var(--dn-text-meta); }
</style>
