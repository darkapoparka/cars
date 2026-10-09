<script lang="ts">
  import { containDialogTab } from '$lib/locale/focus';
  import { specificationLabel } from '$lib/i18n/presentation';

  import { getI18n } from '$lib/locale/context';
  import { templateMessage } from '$lib/i18n/presentation';
  const i18n = getI18n();

  import { preserveScrollOffset } from '$lib/ui/overlay';
  import { dialogViewport } from '$lib/ui/dialog-viewport';
  import { onDestroy, onMount, tick, type Snippet } from 'svelte';
  import { MediaQuery } from 'svelte/reactivity';
  import { resolve } from '$app/paths';
  import {
    filterListingVehicles,
    listingFilterOptions,
    listingVehicles,
    type ListingFilters
  } from '$data/listing';
  import {
    cleanListingFormData,
    emptyListingDraft,
    listingDraftFromFilters,
    listingDraftHasFilters,
    listingFilterGroups,
    listingFiltersFromDraft,
    type ListingDraft
  } from '$data/listing-draft';
  import Icon from '$components/ui/Icon.svelte';
  import MobileListingFilters from './MobileListingFilters.svelte';
  import ListingChoicePicker from './ListingChoicePicker.svelte';
  import DesktopFilterChoice from './DesktopFilterChoice.svelte';
  import DesktopVehicleSearch from './DesktopVehicleSearch.svelte';
  import FilterCloseButton from './FilterCloseButton.svelte';
  import type { Attachment } from 'svelte/attachments';

  let { filters, children, desktopPickers = false }: { filters: ListingFilters; desktopPickers?: boolean; children: Snippet<[(event: MouseEvent, field?: string) => void, boolean]> } = $props();
  let releaseOffset: ((restoreScroll?: boolean) => void) | undefined;
  let destroyed = false;
  onDestroy(() => { destroyed = true; releaseOffset?.(false); });

  let draft = $state<ListingDraft>(emptyListingDraft());
  let draftFilters = $derived(listingFiltersFromDraft(draft));
  let matchingVehicles = $derived(filterListingVehicles(listingVehicles, draftFilters, i18n.locale));
  let hasLiveFilters = $derived(listingDraftHasFilters(draft));
  let hasInvalidPriceRange = $derived(Boolean(draft.priceMin && draft.priceMax && Number(draft.priceMin) > Number(draft.priceMax)));
  let hasInvalidYearRange = $derived(Boolean(draft.yearMin && draft.yearMax && Number(draft.yearMin) > Number(draft.yearMax)));
  let hasInvalidRange = $derived(hasInvalidPriceRange || hasInvalidYearRange);
  let filterDialog = $state<HTMLDialogElement>();
  let dialogSearch = $state<HTMLInputElement>();
  let filtersOpen = $state(false);
  let desktopMatches = $state(false);
  let desktopInitialField = $state<string>();
  const desktopFacet = $derived(listingFilterGroups.flatMap(group => group.fields).find(field => field === desktopInitialField));
  const desktopMode = $derived(desktopPickers && desktopMatches && Boolean(desktopFacet));
  const dialogTitle = $derived(i18n.t(desktopPickers && !desktopInitialField ? 'm_546ebb8eb993' : 'm_32729e44de2d'));
  let returnFocus = $state<HTMLButtonElement>();
  let keyboardOpen = $state(false);
  const mobile = new MediaQuery('(max-width: 767px)', false);
  const desktopIcons = { close: 'x', search: 'search', arrow: 'arrow-right' } as const;

  onMount(() => {
    const media = window.matchMedia('(min-width: 992px)');
    const update = () => {
      if (desktopMatches !== media.matches && filtersOpen) closeFilters();
      desktopMatches = media.matches;
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  });

  const attachFilterDialog: Attachment<HTMLDialogElement> = (node) => {
    filterDialog = node;
    return () => { if (filterDialog === node) filterDialog = undefined; };
  };
  const attachDialogSearch: Attachment<HTMLInputElement> = (node) => {
    dialogSearch = node;
    return () => { if (dialogSearch === node) dialogSearch = undefined; };
  };

  const initializeDraft = (current: ListingFilters = filters) => {
    draft = listingDraftFromFilters(current);
  };

  const resetDraft = () => { draft = emptyListingDraft(filters.sort); };
  const toggleEquipment = (value: ListingDraft['equipment'][number]) => {
    draft.equipment = draft.equipment.includes(value)
      ? draft.equipment.filter(item => item !== value) : [...draft.equipment, value];
  };

  const openFilters = async (event: MouseEvent, field?: string) => {
    returnFocus = event.currentTarget as HTMLButtonElement;
    keyboardOpen = event.detail === 0;
    desktopInitialField = field;
    if (desktopMode || mobile.current) { filtersOpen = true; return; }
    initializeDraft();
    releaseOffset = preserveScrollOffset('--dn-dialog-scroll-offset');
    filtersOpen = true;
    // Home search and the listing overview share one full filter form.
    await tick();
    if (destroyed || !filtersOpen) return;
    filterDialog?.showModal();
    const target = field && field !== 'search'
      ? filterDialog?.querySelector<HTMLElement>(`[data-field="${field}"] button`)
      : desktopPickers && !field ? filterDialog?.querySelector<HTMLElement>('#dn-listing-filter-title') : dialogSearch;
    target?.focus({ preventScroll: true });
  };
  const closeFilters = () => { if (desktopMode) filtersOpen = false; else if (filterDialog?.open) filterDialog.close(); };
  const handleDialogClick = (event: MouseEvent) => { if (event.target === event.currentTarget) closeFilters(); };
  const handleCancel = (event: Event) => { event.preventDefault(); closeFilters(); };
  const handleSearchKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') { event.preventDefault(); closeFilters(); }
  };
  const handleDialogSubmit = () => { closeFilters(); };
  const handleClear = () => {
    resetDraft();
    void tick().then(() => {
      if (!destroyed && filterDialog?.open) filterDialog.querySelector<HTMLElement>('#dn-listing-filter-title')?.focus({ preventScroll: true });
    });
  };
  const restorePage = () => {
    filtersOpen = false;
    releaseOffset?.();
    releaseOffset = undefined;
    const target = returnFocus;
    void tick().then(() => { if (!destroyed && !filtersOpen && target?.isConnected) target.focus({ preventScroll: true }); });
  };
  const cleanFormData = (event: FormDataEvent) => { cleanListingFormData(event.formData); };
</script>

{#snippet actionIcon(name: keyof typeof desktopIcons, size = 20)}
  <Icon name={desktopIcons[name]} {size} />
{/snippet}

{@render children(openFilters, filtersOpen)}
{#if desktopMode}
  <DesktopVehicleSearch {filters} bind:open={filtersOpen} initialField={desktopFacet} {returnFocus} {keyboardOpen} />
{:else if mobile.current}
  <MobileListingFilters {filters} bind:open={filtersOpen} {returnFocus} focusSearch={desktopInitialField === 'search'} />
{:else}
<dialog onkeydown={(event) => containDialogTab(event, event.currentTarget)}
  class="dn-listing-filter__dialog"
  id="dn-listing-filter-dialog"
  aria-labelledby="dn-listing-filter-title"
  {@attach attachFilterDialog}
  {@attach dialogViewport}
  onclick={handleDialogClick}
  oncancel={handleCancel}
  onclose={restorePage}
>
  <form
    class="dn-listing-filter__dialog-panel"
    method="GET"
    action={i18n.href(resolve('/cars'))}
    onsubmit={handleDialogSubmit}
    onformdata={cleanFormData}
  >
    <header class="dn-listing-filter__dialog-header dn-mobile-overlay-header">
      <h2 id="dn-listing-filter-title" tabindex="-1">{dialogTitle}</h2>
      {#if desktopMatches}
        <FilterCloseButton class="dn-listing-filter__close" aria-label={i18n.t('m_2b3fff4a027c')} onclick={closeFilters} />
      {:else}
        <button class="dn-listing-filter__close dn-listing-filter__close--legacy dn-icon-button dn-overlay-close" type="button" aria-label={i18n.t('m_2b3fff4a027c')} onclick={closeFilters}>
          {@render actionIcon('close')}
        </button>
      {/if}
    </header>

    <div class="dn-listing-filter__dialog-content">
      <div class="dn-listing-filter__dialog-search dn-mobile-overlay-search" role="search">
        <label class="dn-sr-only" for="dn-listing-dialog-query">{i18n.t("m_0ae7a3ecbc83")}</label>
        {@render actionIcon('search', 18)}
        <input {@attach i18n.validation} id="dn-listing-dialog-query" {@attach attachDialogSearch} bind:value={draft.q} onkeydown={handleSearchKeydown} type="search" name="q" placeholder={i18n.t("m_cb8bed4ff8b8")} autocomplete="off" />
        <button
          class="dn-listing-filter__inline-submit"
          type="submit"
          disabled={hasInvalidRange}
          aria-label={matchingVehicles.length === 1 ? i18n.t("m_047e325f6562") : i18n.t("m_08d2ff28407e", { p0: matchingVehicles.length })}
        >
          {templateMessage(i18n, "Show {p0}", { p0: matchingVehicles.length })}
          <Icon name="arrow-right" size={18} strokeWidth={2} />
        </button>
      </div>

      <div class="dn-listing-filter__filter-groups">
        <div class="dn-listing-filter__core-grid">
          <ListingChoicePicker field="type" bind:draft showCounts />
          <ListingChoicePicker field="make" bind:draft />
          <ListingChoicePicker field="model" bind:draft />
          <ListingChoicePicker field="body" bind:draft label={i18n.t('m_191c24bf12d5')} placeholder={i18n.t('m_191c24bf12d5')} />
          <ListingChoicePicker field="condition" bind:draft label={i18n.t('m_39b36d38d6eb')} placeholder={i18n.t('m_39b36d38d6eb')} />
          <ListingChoicePicker field="price_min" bind:draft placeholder={i18n.t('m_94470b41eead')} />
          <ListingChoicePicker field="price_max" bind:draft placeholder={i18n.t('m_363c4f34635c')} />
          <ListingChoicePicker field="year_min" bind:draft placeholder={i18n.t('m_349ee8568241')} />
          <ListingChoicePicker field="year_max" bind:draft placeholder={i18n.t('m_07339ff9faf8')} />
          <ListingChoicePicker field="mileage_max" bind:draft placeholder={i18n.t('m_5679c2543732')} />
          <ListingChoicePicker field="fuel" bind:draft label={i18n.t('m_a80f942f4112')} placeholder={i18n.t('m_a80f942f4112')} />
          <ListingChoicePicker field="transmission" bind:draft label={i18n.t('m_3e10134259ab')} placeholder={i18n.t('m_3e10134259ab')} />
          <ListingChoicePicker field="version" bind:draft label={i18n.t('m_1f46b4649491')} placeholder={i18n.t('m_3f19fe84a2de')} />
        </div>

        <section class="dn-listing-filter__filter-group dn-listing-filter__filter-group--equipment" aria-labelledby="dn-listing-filter-equipment-title">
          <h3 id="dn-listing-filter-equipment-title">{i18n.t("m_5697d03daef4")}</h3>
          <div class="dn-listing-filter__equipment-grid">
            {#each listingFilterOptions.equipment as option (option)}
              <div class="dn-listing-filter__equipment-option">
                <DesktopFilterChoice value={option} label={specificationLabel(option, i18n.locale)}
                  checked={draft.equipment.includes(option)} multiple name="equipment" onchange={() => toggleEquipment(option)} />
              </div>
            {/each}
          </div>
        </section>
      </div>
    </div>

    <footer class="dn-listing-filter__dialog-footer dn-mobile-overlay-footer">
      {#if hasInvalidRange}
        <p class="dn-listing-filter__range-error" role="alert">
          {hasInvalidPriceRange ? i18n.t("m_2157bc34d38a") : i18n.t("m_e35acfc7ae2e")}
        </p>
      {/if}
      {#if hasLiveFilters}<button class="dn-listing-filter__clear dn-mobile-overlay-clear" type="button" onclick={handleClear}>{i18n.t("action.clearShort")}</button>{/if}
      <button class="dn-listing-filter__dialog-submit dn-mobile-overlay-action" type="submit" disabled={hasInvalidRange} aria-live="polite" aria-label={matchingVehicles.length === 1 ? i18n.t("m_047e325f6562") : i18n.t("m_08d2ff28407e", { p0: matchingVehicles.length })}>
        <span class="dn-listing-filter__submit-full">{i18n.t('action.showCount', { count: matchingVehicles.length })}</span>
        <Icon name="search" size={18} />
      </button>
      <input type="hidden" name="sort" value={filters.sort === 'default' ? '' : filters.sort} />
    </footer>
  </form>
</dialog>
{/if}

<style>
  label {
    display: block;
    min-width: 0;
  }
  input[type='search'] {
    width: 100%;
    height: var(--dn-control-height-default);
    padding: 0 var(--dn-space-4);
    border: 1px solid #dfe2e6;
    border-radius: var(--dn-radius-control);
    outline: 0;
    background: #f5f6f7;
    color: #202329;
    font: var(--dn-entry-font);
  }
  input::placeholder {
    color: #737984;
    opacity: 1;
  }
  input:focus {
    border-color: #777e88;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(32, 35, 41, 0.12);
  }

  @media (min-width: 768px) {
    :global(html:has(.dn-listing-filter__dialog[open])) { overflow-y: scroll; }
  }

  :global(body:has(.dn-listing-filter__dialog[open])) {
    position: fixed;
    top: var(--dn-dialog-scroll-offset, 0);
    right: 0;
    left: 0;
    overflow: hidden;
  }

  .dn-listing-filter__dialog {
    width: min(1200px, calc(100vw - 48px));
    max-width: none;
    max-height: calc(100dvh - 48px);
    margin: auto;
    padding: 0;
    overflow: hidden;
    border: 0;
    border-radius: 20px;
    background: #fff;
    color: #202329;
    box-shadow: 0 34px 100px rgba(0, 0, 0, 0.34);
  }

  .dn-listing-filter__dialog::backdrop {
    background: rgb(8 10 14 / .35);
  }

  .dn-listing-filter__dialog-panel {
    display: flex;
    max-height: calc(100dvh - 48px);
    flex-direction: column;
  }

  .dn-listing-filter__dialog-header {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    gap: var(--dn-space-3);
    padding: 24px 28px 10px;
    background: #fff;
  }

  .dn-listing-filter__dialog-header h2 {
    margin: 0;
    font-size: var(--dn-text-subheading);
    font-weight: var(--dn-weight-semibold);
    line-height: var(--dn-leading-heading);
    letter-spacing: var(--dn-tracking-heading);
  }

  .dn-listing-filter__dialog-header h2:focus { outline: none; }

  .dn-listing-filter__close--legacy { margin-left: auto; border: 0; border-radius: var(--dn-radius-button); background: var(--dn-home-panel); color: #202329; }

  .dn-listing-filter__close--legacy:hover,
  .dn-listing-filter__close--legacy:focus-visible {
    border-color: #202329;
    background: #e7e9ec;
  }

  .dn-listing-filter__clear {
    min-height: var(--dn-control-height-default);
    padding: 0;
    border: 0;
    background: transparent;
    color: #555c66;
    font-size: var(--dn-text-body);
    font-weight: var(--dn-weight-semibold);
    cursor: pointer;
  }

  .dn-listing-filter__clear:hover,
  .dn-listing-filter__clear:focus-visible {
    color: var(--dn-red);
  }

  .dn-listing-filter__dialog-content {
    display: flex;
    min-height: 0;
    flex-direction: column;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 16px 28px 24px;
  }

  .dn-listing-filter__dialog-search {
    position: relative;
    display: flex !important;
    flex: 0 0 var(--dn-control-height-default);
    align-items: center;
    gap: var(--dn-entry-icon-gap);
    height: var(--dn-control-height-default);
    margin-bottom: 22px;
    padding: 0 var(--dn-space-4);
    border: 1px solid #d8dce2;
    border-radius: var(--dn-pill);
    background: #f5f6f7;
    color: #6d737d;
  }

  .dn-listing-filter__dialog-search:focus-within {
    border-color: #777e88;
    box-shadow: 0 0 0 3px rgba(32, 35, 41, 0.12);
  }

  .dn-listing-filter__dialog-search input[type='search'] {
    flex: 1;
    height: 100%;
    min-width: 0;
    padding: 0;
    border: 0;
    outline: 0;
    background: transparent;
    box-shadow: none;
    font: var(--dn-overlay-field-font);
  }

  .dn-listing-filter__inline-submit {
    display: inline-flex;
    height: var(--dn-control-height-default);
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    gap: var(--dn-entry-action-gap);
    padding: 0 var(--dn-space-6);
    border: 0;
    border-radius: var(--dn-radius-button);
    background: #202329;
    color: #fff;
    font: var(--dn-compact-control-font);
    cursor: pointer;
    transition: background-color 150ms ease-out;
  }

  .dn-listing-filter__inline-submit:hover,
  .dn-listing-filter__inline-submit:focus-visible {
    background: #111318;
  }

  .dn-listing-filter__inline-submit:focus-visible {
    outline: 3px solid rgba(32, 35, 41, 0.24);
    outline-offset: 2px;
  }

  .dn-listing-filter__inline-submit:disabled {
    background: #d7dae0;
    color: #6f7580;
    cursor: not-allowed;
  }

  @media (min-width: 992px) {
    .dn-listing-filter__dialog-header { justify-content: space-between; }
    .dn-listing-filter__dialog-search {
      flex: 0 0 auto;
      height: auto;
      min-height: var(--dn-control-height-prominent);
      padding: var(--dn-space-1) var(--dn-space-1) var(--dn-space-1) var(--dn-space-4);
    }

    .dn-listing-filter__inline-submit {
      height: auto;
      min-height: var(--dn-control-height-compact);
      padding: var(--dn-space-1) var(--dn-space-4);
    }
  }

  .dn-listing-filter__filter-groups {
    min-width: 0;
  }

  .dn-listing-filter__core-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    min-width: 0;
  }

  .dn-listing-filter__core-grid :global(.dn-identity-trigger) {
    height: var(--dn-control-height-default);
    min-height: var(--dn-control-height-default);
    font: var(--dn-entry-font);
  }

  .dn-listing-filter__core-grid :global(.dn-field-label) {
    margin: 0 0 6px 2px;
  }

  .dn-listing-filter__filter-group--equipment {
    min-width: 0;
    margin-top: 18px;
    padding: 22px;
    border-radius: var(--dn-overlay-row-radius);
    background: #f5f6f7;
  }

  .dn-listing-filter__filter-group h3 {
    margin: 0;
    color: #202329;
    font-size: var(--dn-text-lead);
    font-weight: var(--dn-weight-semibold);
    line-height: var(--dn-leading-control);
  }

  .dn-listing-filter__equipment-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--dn-overlay-gap);
    margin-top: 16px;
  }

  .dn-listing-filter__equipment-option {
    border-radius: var(--dn-radius-control);
    background: #fff;
  }

  .dn-listing-filter__equipment-option:has(:global(input:checked)) {
    background: var(--dn-selection-surface);
    color: var(--dn-ink);
    box-shadow: inset 0 0 0 1px var(--dn-selection-line);
  }

  .dn-listing-filter__dialog-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 24px;
    padding: 0 28px 26px;
    background: #fff;
  }

  .dn-listing-filter__range-error {
    flex: 1 1 100%;
    margin: 0;
    color: #a20d1a;
    font-size: var(--dn-text-meta);
    font-weight: var(--dn-weight-semibold);
    line-height: var(--dn-leading-meta);
  }

  .dn-listing-filter__dialog-submit {
    display: inline-flex;
    min-width: 230px;
    height: var(--dn-overlay-control-height);
    align-items: center;
    justify-content: center;
    gap: var(--dn-overlay-gap);
    padding: 0 28px;
    border: 0;
    border-radius: var(--dn-radius-button);
    background: var(--dn-red);
    color: #fff;
    cursor: pointer;
    font: var(--dn-cta-font);
  }

  .dn-listing-filter__dialog-submit:hover,
  .dn-listing-filter__dialog-submit:focus-visible {
    background: var(--dn-red-hover);
  }

  .dn-listing-filter__dialog-submit:disabled {
    background: #c9cdd3;
    color: #6f7580;
    cursor: not-allowed;
  }

  @media (min-width: 992px) {
    .dn-listing-filter__dialog-submit { --dn-primary-action-surface: var(--dn-ink); --dn-primary-action-surface-hover: var(--dn-ink-hover); background: var(--dn-ink); }
    .dn-listing-filter__dialog-submit:hover, .dn-listing-filter__dialog-submit:focus-visible { background: var(--dn-ink-hover); }
    .dn-listing-filter__dialog-submit:disabled { background: var(--dn-line-strong); color: var(--dn-muted); }
    .dn-listing-filter__equipment-option:has(:global(input:checked)) { background: var(--dn-home-panel); color: var(--dn-ink); box-shadow: inset 0 0 0 1px var(--dn-line-strong); }
  }

  @media (max-width: 991px) {
    .dn-listing-filter__core-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .dn-listing-filter__equipment-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .dn-listing-filter__equipment-option:has(:global(input:checked)) {
      background: var(--dn-mobile-selection-surface);
      box-shadow: inset 0 0 0 1px var(--dn-mobile-selection-line);
    }

  }

</style>
