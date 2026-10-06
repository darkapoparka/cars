<script lang="ts">
  import { containDialogTab } from '$lib/locale/focus';
  import { getI18n } from '$lib/locale/context';
  import { MediaQuery } from 'svelte/reactivity';
  import { preserveScrollOffset } from '$lib/ui/overlay';
  import { dialogViewport } from '$lib/ui/dialog-viewport';
  import { overlayContentHeight } from '$lib/ui/overlay-content';
  import { onDestroy, tick, type Snippet } from 'svelte';
  import { page } from '$app/state';
  import { resolve } from '$app/paths';
  import type { Attachment } from 'svelte/attachments';
  import { listingParams, parseListingFilters, type ListingFilters } from '$data/listing';
  import {
    cleanListingFormData, emptyListingDraft, listingDraftFromFilters, listingFacetTitle,
    listingFiltersFromDraft, listingFiltersFromFormData, preservedListingFacetEntries,
    withListingMake, withListingModel, type ListingDraft, type ListingFacetField
  } from '$data/listing-draft';
  import Icon from '$components/ui/Icon.svelte';
  import MobileActionIcon from '$components/layout/MobileActionIcon.svelte';
  import ListingFacetEditor from './ListingFacetEditor.svelte';

  const i18n = getI18n();
  const mobile = new MediaQuery('(max-width: 767px)', false);
  const desktopIcons = { close: 'x', arrow: 'arrow-right' } as const;
  type BaseProps = { children: Snippet<[(event: MouseEvent, field: ListingFacetField) => void, boolean]>; id?: string; };
  type Props = BaseProps & (
    | { mode: 'url'; filters?: never; onApply?: never }
    | { mode: 'draft'; filters: ListingFilters; onApply: (filters: ListingFilters) => void }
  );
  let props: Props = $props();
  const id = $derived(props.id ?? 'dn-quick-filter');
  const params = $derived(props.mode === 'draft' ? listingParams(props.filters) : page.url.searchParams);
  let releaseOffset: ((restoreScroll?: boolean) => void) | undefined;
  onDestroy(() => releaseOffset?.(false));
  let dialog: HTMLDialogElement;
  let heading: HTMLHeadingElement;
  let content = $state<HTMLDivElement>();
  let trigger: HTMLElement;
  let opened = $state(false);
  let field = $state<ListingFacetField>('make');
  let draft = $state<ListingDraft>(emptyListingDraft());
  let revision = $state(0);
  const attachDialog: Attachment<HTMLDialogElement> = node => { dialog = node; };
  const attachHeading: Attachment<HTMLHeadingElement> = node => { heading = node; };
  const title = $derived(listingFacetTitle(field, i18n.locale));
  const range = $derived(field === 'price' || field === 'year');
  const searchable = $derived(!range && field !== 'mileage_max' && field !== 'sort' && field !== 'type');
  const invalid = $derived(field === 'price' ? Boolean(draft.priceMin && draft.priceMax && Number(draft.priceMin) > Number(draft.priceMax))
    : field === 'year' && Boolean(draft.yearMin && draft.yearMax && Number(draft.yearMin) > Number(draft.yearMax)));
  const draftParams = $derived(listingParams(listingFiltersFromDraft(draft)));
  const preserved = $derived(preservedListingFacetEntries(draftParams, field, draftParams.getAll(field)));

  async function open(event: MouseEvent, nextField: ListingFacetField) {
    trigger = event.currentTarget as HTMLElement;
    field = nextField;
    draft = listingDraftFromFilters(parseListingFilters(params));
    revision += 1;
    dialog.style.removeProperty('--dn-picker-content-height');
    if (props.mode === 'url') releaseOffset = preserveScrollOffset('--dn-quick-scroll');
    opened = true;
    await tick();
    if (!opened || !dialog?.isConnected) return;
    dialog.showModal();
    if (content) {
      dialog.style.setProperty('--dn-picker-content-height', `${overlayContentHeight(content)}px`);
      // Fit again at the width available after the opening scrollbar is released.
      dialog.style.setProperty('--dn-picker-content-height', `${overlayContentHeight(content)}px`);
    }
    if (content) content.scrollTop = 0;
    heading.focus({ preventScroll: true });
  }
  function restore() { opened = false; releaseOffset?.(); releaseOffset = undefined; if (trigger?.isConnected) trigger.focus({ preventScroll: true }); }
  function clear() {
    if (field === 'make') draft = withListingMake(draft, '');
    else if (field === 'model') draft = withListingModel(draft, '');
    else if (field === 'price') { draft.priceMin = ''; draft.priceMax = ''; }
    else if (field === 'year') { draft.yearMin = ''; draft.yearMax = ''; }
    else if (field === 'mileage_max') draft.mileageMax = '';
    else if (field === 'equipment') draft.equipment = [];
    else if (field === 'sort') draft.sort = 'default';
    else draft[field] = '';
    revision += 1;
  }
  function submit(event: SubmitEvent) {
    if (props.mode === 'draft') { event.preventDefault(); props.onApply(listingFiltersFromFormData(new FormData(event.currentTarget as HTMLFormElement))); }
    dialog.close();
  }
  function keydown(event: KeyboardEvent) {
    containDialogTab(event, event.currentTarget as HTMLDialogElement);
    if (event.key === 'Escape') { event.preventDefault(); dialog.close(); }
  }
</script>

{#snippet actionIcon(name: keyof typeof desktopIcons, size = 20)}
  {#if mobile.current}<MobileActionIcon {name} {size} />{:else}<Icon name={desktopIcons[name]} {size} />{/if}
{/snippet}
{@render props.children(open, opened)}
<dialog onkeydown={keydown} {id} class={['dn-quick-sheet', { searchable, standalone: props.mode === 'url' }]} aria-labelledby={`${id}-title`} {@attach attachDialog} {@attach dialogViewport} onclose={restore} onclick={event => { if (event.target === event.currentTarget) dialog.close(); }}>
  <form method="GET" action={i18n.href(resolve('/listing-grid'))} onformdata={event => cleanListingFormData(event.formData)} onsubmit={submit}>
    <header class="dn-mobile-overlay-header dn-mobile-filter-header">
      <h2 id={`${id}-title`} tabindex="-1" {@attach attachHeading}>{title}</h2>
      <button type="button" class="close dn-icon-button dn-overlay-close" aria-label={i18n.t('m_84305a580997')} onclick={() => dialog.close()}>{@render actionIcon('close')}</button>
    </header>
    {#key `${field}-${revision}`}<ListingFacetEditor {field} bind:draft bind:contentElement={content} />{/key}
    {#each preserved as [name, value], index (`${name}-${index}`)}<input type="hidden" {name} {value} />{/each}
    <footer class="dn-mobile-overlay-footer">
      <button class="clear dn-mobile-overlay-clear" type="button" onclick={clear}>{i18n.t('m_83b12c2216ef')}</button>
      <button class="apply dn-mobile-overlay-action" type="submit" disabled={invalid}>{i18n.t('m_31e392d1c037')}{@render actionIcon('arrow', 18)}</button>
    </footer>
  </form>
</dialog>

<style>
  :global(body:has(.dn-quick-sheet.standalone[open])) { position: fixed; top: var(--dn-quick-scroll, 0); width: 100%; overflow: hidden; }
  .dn-quick-sheet { width: min(480px, calc(100% - 32px)); max-width: none; max-height: calc(100dvh - 32px); margin: auto; padding: 0; overflow: hidden; border: 0; border-radius: 20px; background: var(--dn-white); color: var(--dn-ink); }
  .dn-quick-sheet::backdrop { background: rgb(8 10 14 / .35); }
  form { display: flex; flex-direction: column; max-height: calc(100dvh - 32px); margin: 0; }
  .searchable form { height: min(600px, calc(100dvh - 32px)); }
  header { display: flex; flex: 0 0 auto; align-items: center; justify-content: space-between; gap: var(--dn-space-4); padding: 20px 20px 12px; }
  h2 { margin: 0; font-size: var(--dn-text-subheading); line-height: var(--dn-leading-heading); letter-spacing: var(--dn-tracking-heading); }
  h2:focus { outline: none; }
  button { font: inherit; cursor: pointer; }
  .close { border: 0; border-radius: var(--dn-pill); background: var(--dn-home-panel); color: inherit; }
  footer { display: flex; flex: 0 0 auto; flex-wrap: wrap; align-items: center; gap: var(--dn-space-4); padding: var(--dn-space-3) var(--dn-overlay-gutter) calc(var(--dn-space-4) + env(safe-area-inset-bottom)); }
  .clear { min-width: 0; max-width: 100%; min-height: var(--dn-overlay-control-height); padding: 0; border: 0; background: transparent; color: inherit; text-decoration: underline; text-underline-offset: 4px; font: var(--dn-overlay-option-font); overflow-wrap: anywhere; }
  .apply { display: flex; flex: 1 1 8rem; min-width: 0; min-height: var(--dn-overlay-control-height); align-items: center; justify-content: center; gap: var(--dn-entry-action-gap); padding: var(--dn-space-2); border: 0; border-radius: var(--dn-radius-button); background: var(--dn-red); color: var(--dn-white); font: var(--dn-overlay-action-font); overflow-wrap: anywhere; }
  .apply:hover { background: var(--dn-red-hover); }
  .apply:disabled { opacity: .5; cursor: default; }
  @media (max-width: 767px) {
    .dn-quick-sheet { --dn-primary-action-surface: var(--dn-ink); --dn-primary-action-surface-hover: var(--dn-ink-hover); position: fixed; inset: var(--dn-dialog-viewport-top, 0px) 0 auto; width: 100%; height: var(--dn-dialog-viewport-height, 100dvh); max-height: var(--dn-dialog-viewport-height, 100dvh); margin: 0; border-radius: 0; background: transparent; }
    .dn-quick-sheet[open] { display: flex; flex-direction: column; justify-content: flex-end; }
    form { min-height: 0; max-height: calc(var(--dn-dialog-viewport-height, 100dvh) - max(var(--dn-space-6), env(safe-area-inset-top, 0px))); overflow: hidden; border-radius: var(--dn-radius-sheet) var(--dn-radius-sheet) 0 0; background: var(--dn-white); }
    .searchable form { height: auto; }
    footer { border-top: 1px solid var(--dn-line); }
  }
  @media (prefers-reduced-motion: no-preference) {
    .dn-quick-sheet[open] { animation: sheet-enter 200ms cubic-bezier(.16, 1, .3, 1); }
    @media (max-width: 767px) { .dn-quick-sheet[open] { animation: none; } .dn-quick-sheet[open] form { animation: sheet-enter 200ms cubic-bezier(.16, 1, .3, 1); } }
    @keyframes sheet-enter { from { transform: translateY(28px); } to { transform: translateY(0); } }
  }
</style>
