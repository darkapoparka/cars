<script lang="ts">
import { localeContract } from '$lib/locale/core';
  import { containDialogTab } from '$lib/locale/focus';
  import { getI18n } from '$lib/locale/context';
  import { templateMessage } from '$lib/i18n/presentation';
  const i18n = getI18n();

  import { preserveScrollOffset } from '$lib/ui/overlay';
  import { onDestroy, tick, type Snippet } from 'svelte';
  import { page } from '$app/state';
  import { resolve } from '$app/paths';
  import type { Attachment } from 'svelte/attachments';
  import { listingParams, type ListingFilters } from '$data/listing';
  import {
    cleanListingFormData,
    listingFacetOptionLabel,
    listingFacetTitle,
    listingFacetOptions,
    listingFiltersFromFormData,
    preservedListingFacetEntries,
    type ListingFacetField
  } from '$data/listing-draft';
  import Icon from '$components/ui/Icon.svelte';

  type BaseProps = {
    children: Snippet<[(event: MouseEvent, field: ListingFacetField, title: string) => void, boolean]>;
    fullScreen?: boolean;
    id?: string;
  };
  type Props = BaseProps & (
    | { mode: 'url'; filters?: never; onApply?: never }
    | { mode: 'draft'; filters: ListingFilters; onApply: (filters: ListingFilters) => void }
  );

  let props: Props = $props();
  const id = $derived(props.id ?? 'dn-quick-filter');
  const fullScreen = $derived(props.fullScreen ?? false);
  const params = $derived(props.mode === 'draft' ? listingParams(props.filters) : page.url.searchParams);
  let releaseOffset: ((restoreScroll?: boolean) => void) | undefined;
  onDestroy(() => releaseOffset?.(false));

  let dialog: HTMLDialogElement;
  let heading: HTMLHeadingElement;
  let searchInput: HTMLInputElement;
  let trigger: HTMLElement;
  let opened = $state(false);
  let field = $state<ListingFacetField>('make');
  let title = $state(i18n.t("m_ccdd25d4230f"));
  let selected = $state('');
  let minimum = $state('');
  let maximum = $state('');
  let equipment = $state<string[]>([]);
  let search = $state('');
  const attachDialog: Attachment<HTMLDialogElement> = node => { dialog = node; };
  const attachHeading: Attachment<HTMLHeadingElement> = node => { heading = node; };
  const attachSearch: Attachment<HTMLInputElement> = node => { searchInput = node; };
  const range = $derived(field === 'price' || field === 'year');
  const searchable = $derived(!range && field !== 'mileage_max' && field !== 'sort');
  const searchLabel = $derived(field === 'make' ? i18n.t("m_150bec5925bd") : field === 'model' ? i18n.t("m_269619120191") : i18n.t("m_f0549fa54b59", { p0: title.toLocaleLowerCase(i18n.locale) }));
  const optionLabel = (option: string) => listingFacetOptionLabel(field, option, i18n.locale);
  const matchesSearch = (option: string) => search.trim().toLocaleLowerCase(i18n.locale).split(/\s+/).every(term => optionLabel(option).toLocaleLowerCase(i18n.locale).includes(term));
  const invalid = $derived(range && minimum !== '' && maximum !== '' && Number(minimum) > Number(maximum));
  const choices = $derived(listingFacetOptions(field, params.get('make') ?? ''));
  const visibleChoices = $derived(choices.filter(matchesSearch));
  const preserved = $derived(preservedListingFacetEntries(params, field, selected));

  async function open(event: MouseEvent, nextField: ListingFacetField, nextTitle: string) {
    trigger = event.currentTarget as HTMLElement;
    field = nextField;
    title = listingFacetTitle(nextField, i18n.locale);
    search = '';
    selected = params.get(field) ?? '';
    minimum = params.get(`${field}_min`) ?? '';
    maximum = params.get(`${field}_max`) ?? '';
    equipment = params.getAll('equipment');
    if (props.mode === 'url') releaseOffset = preserveScrollOffset('--dn-quick-scroll');
    opened = true;
    await tick();
    dialog.showModal();
    heading.focus();
  }

  function restore() {
    opened = false;
    if (props.mode === 'url') releaseOffset?.();
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
  }
  function clear() { selected = ''; minimum = ''; maximum = ''; equipment = []; search = ''; }
  function submit(event: SubmitEvent) {
    if (props.mode === 'draft') {
      event.preventDefault();
      props.onApply(listingFiltersFromFormData(new FormData(event.currentTarget as HTMLFormElement)));
    }
    dialog.close();
  }
</script>

{@render props.children(open, opened)}

<dialog onkeydown={(event) => containDialogTab(event, event.currentTarget)} {id} class={['dn-quick-sheet', { searchable, 'full-screen': fullScreen, standalone: props.mode === 'url' }]} aria-labelledby={`${id}-title`} {@attach attachDialog} onclose={restore} onclick={event => { if (event.target === event.currentTarget) dialog.close(); }}>
  <form method="GET" action={i18n.href(resolve('/listing-grid'))} onformdata={(event) => cleanListingFormData(event.formData)} onsubmit={submit}>
    <header class:dn-mobile-overlay-header={fullScreen}>
      <h2 id={`${id}-title`} tabindex="-1" {@attach attachHeading}>{title}</h2>
      <button type="button" class="close dn-icon-button dn-overlay-close" aria-label={i18n.t("m_84305a580997")} onclick={() => dialog.close()}><Icon name="x" /></button>
    </header>
    {#if searchable}
      <div class="search-wrap">
        <div class:dn-mobile-overlay-search={fullScreen} class="search-field">
          <Icon name="search" size={18} />
          <input {@attach i18n.validation} type="search" {@attach attachSearch} bind:value={search} aria-label={searchLabel} placeholder={`${searchLabel}…`} autocomplete="off" onkeydown={event => { if (event.key === 'Enter') event.preventDefault(); if (event.key === 'Escape') { event.preventDefault(); dialog.close(); } }} />
          {#if search}<button type="button" class="clear-search dn-icon-button" aria-label={i18n.t("m_c8191190a026")} onclick={() => { search = ''; searchInput.focus(); }}><Icon name="x" size={18} /></button>{/if}
        </div>
      </div>
    {/if}
    <div class="content">
      {#if range}
        <div class="range">
          <label>{templateMessage(i18n, "From{p0}", { p0: field === 'price' ? ' (' + localeContract.inventoryCurrency + ')' : '' })}<input {@attach i18n.validationFor(field)} type="number" inputmode="numeric" name={`${field}_min`} bind:value={minimum} min={field === 'year' ? 1900 : 0} max={field === 'year' ? new Date().getFullYear() + 1 : undefined} step="1" placeholder={i18n.t("m_8a702098f672")} /></label>
          <label>{templateMessage(i18n, "To{p0}", { p0: field === 'price' ? ' (' + localeContract.inventoryCurrency + ')' : '' })}<input {@attach i18n.validationFor(field)} type="number" inputmode="numeric" name={`${field}_max`} bind:value={maximum} min={field === 'year' ? 1900 : 0} max={field === 'year' ? new Date().getFullYear() + 1 : undefined} step="1" placeholder={i18n.t("m_585b0741c5fb")} /></label>
        </div>
        {#if invalid}<p role="alert">{i18n.t("m_8418439e87ac")}</p>{/if}
      {:else if field === 'mileage_max'}
        <label class="mileage">{i18n.t("m_ac9577848c3a")}<input {@attach i18n.validation} type="number" inputmode="numeric" name={field} bind:value={selected} min="0" step="1" placeholder={i18n.t("m_613e1f06e8da")} /></label>
      {:else}
        {#key field}
        <fieldset>
          <legend class="dn-sr-only">{title}</legend>
          {#each choices as option (option)}
            <label class="choice" hidden={!matchesSearch(option)}>
              <span>{optionLabel(option)}</span>
              {#if field === 'equipment'}<input {@attach i18n.validation} type="checkbox" name="equipment" value={option} bind:group={equipment} />
              {:else}<input {@attach i18n.validation} type="radio" name={field} value={option} checked={selected === option} onchange={() => selected = option} />{/if}
            </label>
          {/each}
        </fieldset>
        {/key}
        {#if visibleChoices.length === 0}
          <div class="empty" role="status"><strong>{i18n.t("m_255ca3bfe9fc")}</strong><p>{i18n.t("m_5c1608c4b6c0")}</p></div>
        {/if}
      {/if}
    </div>
    {#each preserved as [name, value], index (`${name}-${index}`)}<input type="hidden" {name} {value} />{/each}
    <footer>
      <button class="clear" type="button" onclick={clear}>{i18n.t("m_83b12c2216ef")}</button>
      <button class="apply" type="submit" disabled={invalid}>{i18n.t("m_31e392d1c037")}<Icon name="arrow-right" size={18} /></button>
    </footer>
  </form>
</dialog>

<style>
  :global(body:has(.dn-quick-sheet.standalone[open])) { position: fixed; top: var(--dn-quick-scroll, 0); width: 100%; overflow: hidden; }
  .dn-quick-sheet { width: min(480px, calc(100% - 32px)); max-width: none; max-height: calc(100dvh - 32px); margin: auto; padding: 0; overflow: hidden; border: 0; border-radius: 20px; background: #fff; color: var(--dn-ink); }
  .dn-quick-sheet::backdrop { background: rgb(8 10 14 / .6); }
  form { display: flex; flex-direction: column; max-height: calc(100dvh - 32px); margin: 0; }
  .searchable form { height: min(600px, calc(100dvh - 32px)); }
  header { display: flex; flex: 0 0 auto; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 20px 12px; }
  h2 { margin: 0; font-size: var(--dn-text-subheading); line-height: var(--dn-leading-heading); letter-spacing: var(--dn-tracking-heading); }
  h2:focus { outline: none; }
  button { font: inherit; cursor: pointer; }
  .close { border: 0; border-radius: 50%; background: var(--dn-home-panel); color: inherit; }
  .content { min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 0 16px 16px; }
  .searchable .content { flex: 1; }
  .search-wrap { flex: 0 0 auto; padding: 0 var(--dn-overlay-gutter) var(--dn-overlay-gap); }
  .search-field { display: flex; align-items: center; gap: var(--dn-overlay-gap); min-height: var(--dn-overlay-control-height); padding: 0 4px 0 16px; border-radius: var(--dn-pill); background: var(--dn-home-panel); color: #69717c; }
  .search-field:focus-within { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
  .search-field input { flex: 1; width: 100%; min-width: 0; height: var(--dn-overlay-control-height); padding: 0; border: 0; outline: none; background: transparent; color: #24272c; font: var(--dn-overlay-field-font); }
  .search-field input:focus, .search-field input:focus-visible { border: 0; outline: none; background: transparent; box-shadow: none; }
  .search-field input::-webkit-search-cancel-button { display: none; }
  .clear-search { border: 0; border-radius: var(--dn-pill); background: transparent; color: #24272c; }
  .clear-search:hover { background: #e4e7ea; }
  fieldset { display: grid; gap: var(--dn-overlay-gap); padding: 0; margin: 0; border: 0; }
  .choice { display: flex; box-sizing: border-box; min-height: var(--dn-overlay-control-height); padding: 0 var(--dn-space-4); gap: var(--dn-entry-action-gap); justify-content: space-between; align-items: center; border: 0; border-radius: var(--dn-overlay-row-radius); background: var(--dn-home-panel); color: #24272c; font: var(--dn-overlay-option-font); cursor: pointer; }
  .choice[hidden] { display: none; }
  .choice:hover { background: #e4e7ea; }
  .choice:has(:checked) { background: var(--dn-selection-surface); color: var(--dn-ink); box-shadow: inset 0 0 0 1px var(--dn-selection-line); }
  .choice:has(input:focus-visible) { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  .choice input { width: 20px; height: 20px; flex: 0 0 20px; margin: 0; accent-color: var(--dn-red); }

  .empty { padding: 24px 12px; color: #24272c; text-align: center; }
  .empty strong { font-size: var(--dn-text-body); }
  .empty p { margin: 8px 0 0; color: #656b74; font-size: var(--dn-text-body); line-height: var(--dn-leading-body); }
  .range { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; padding-top: 8px; }
  .range label, .mileage { display: block; min-width: 0; font-size: var(--dn-text-meta); font-weight: var(--dn-weight-semibold); }
  input[type=number] { display: block; width: 100%; min-width: 0; box-sizing: border-box; margin-top: 8px; padding: 0 var(--dn-space-3); height: var(--dn-overlay-control-height); border: 1px solid #d9dde2; border-radius: 12px; background: #fff; color: inherit; font: var(--dn-overlay-field-font); }
  input::placeholder { color: #69717c; }
  p[role=alert] { color: #a40000; font-size: var(--dn-text-body); margin: 12px 0 0; }
  footer { display: flex; flex: 0 0 auto; align-items: center; gap: var(--dn-space-4); padding: var(--dn-space-3) var(--dn-overlay-gutter) calc(var(--dn-space-4) + env(safe-area-inset-bottom)); }
  .clear { min-height: var(--dn-overlay-control-height); padding: 0; border: 0; background: transparent; color: inherit; text-decoration: underline; text-underline-offset: 4px; font: var(--dn-overlay-option-font); }
  .apply { display: flex; flex: 1; min-height: var(--dn-overlay-control-height); align-items: center; justify-content: center; gap: var(--dn-entry-action-gap); border: 0; border-radius: var(--dn-radius-button); background: var(--dn-red); color: #fff; font: var(--dn-overlay-action-font); }
  .apply:hover { background: var(--dn-red-hover); }
  .apply:disabled { opacity: .5; cursor: default; }
  @media (max-width: 767px) {
    .dn-quick-sheet { inset: auto 0 0; width: 100%; max-height: calc(100dvh - max(24px, env(safe-area-inset-top))); margin: 0; border-radius: 24px 24px 0 0; }
    form { max-height: calc(100dvh - max(24px, env(safe-area-inset-top))); }
  }
  @media (max-width: 767px) {
    .dn-quick-sheet.full-screen { inset: 0; height: 100dvh; max-height: 100dvh; border-radius: 0; }
    .full-screen form { height: 100%; max-height: 100%; }
    .full-screen .content { flex: 1; }
  }
  @media (prefers-reduced-motion: no-preference) {
    .dn-quick-sheet[open] { animation: sheet-enter 200ms cubic-bezier(.16, 1, .3, 1); }
    @keyframes sheet-enter { from { transform: translateY(28px); } to { transform: translateY(0); } }
  }
</style>
