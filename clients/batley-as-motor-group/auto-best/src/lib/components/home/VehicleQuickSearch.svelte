<script lang="ts">
  import { tick } from 'svelte';
  import { MediaQuery } from 'svelte/reactivity';
  import { trapDialogTab } from '$lib/ui/overlay';
  import { dialogViewport } from '$lib/ui/dialog-viewport';
  import { specificationLabel } from '$lib/i18n/presentation';

  import { getI18n } from '$lib/locale/context';

  const i18n = getI18n();

  import Icon from '$components/ui/Icon.svelte';
  import MobileActionIcon from '$components/layout/MobileActionIcon.svelte';
  import { resolve } from '$app/paths';
  import { featuredVehicles } from '$data/inventory';
  import { bodyLabel, filterListingVehicles, listingFilterOptions, listingModelsForMake, listingSelectionHas } from '$data/listing';
  import {
    cleanListingFormData,
    emptyListingDraft,
    formatListingNumber,
    listingDraftHasFilters,
    listingFiltersFromDraft,
    toggleListingIdentity,
    type ListingDraft
  } from '$data/listing-draft';
  import type { Attachment } from 'svelte/attachments';

  type MobileFilterView = 'main' | 'make' | 'model' | 'body' | 'price' | 'fuel' | 'mileage' | 'year';
  type MobileFilterOption = { value: string; label: string };

  const mobile = new MediaQuery('(max-width: 767px)', false);

  let dialog = $state<HTMLDialogElement>();
  let trigger = $state<HTMLButtonElement>();
  let searchInput = $state<HTMLInputElement>();
  let heading: HTMLHeadingElement;
  let query = $state('');
  let make = $state<string[]>([]);
  let model = $state<string[]>([]);
  let body = $state('');
  let priceMax = $state('');
  let fuel = $state('');
  let mileageMax = $state('');
  let yearMin = $state('');
  let searchOpen = $state(false);
  let mobileView = $state<MobileFilterView>('main');
  let modelOptions = $derived(listingModelsForMake(make));
  let quickDraft = $derived<ListingDraft>({
    ...emptyListingDraft(),
    q: query,
    make,
    model,
    body,
    priceMax,
    fuel,
    mileageMax,
    yearMin
  });
  let filteredVehicles = $derived(filterListingVehicles(featuredVehicles, listingFiltersFromDraft(quickDraft), i18n.locale));
  let hasFilters = $derived(listingDraftHasFilters(quickDraft));
  let makeModelSummary = $derived([...make, ...model].join(', ') || i18n.t("m_a52ace420f21"));
  let mobileMenuTitle = $derived.by(() => {
    if (mobileView === 'make') return i18n.t("m_ccdd25d4230f");
    if (mobileView === 'model') return i18n.t("m_5e2c614c23f0");
    if (mobileView === 'body') return i18n.t("m_191c24bf12d5");
    if (mobileView === 'price') return i18n.t("m_84e960d40ad5");
    if (mobileView === 'fuel') return i18n.t("m_a80f942f4112");
    if (mobileView === 'mileage') return i18n.t("m_ffe44a017911");
    if (mobileView === 'year') return i18n.t("m_89f6832560de");
    return i18n.t("m_546ebb8eb993");
  });
  const identityView = $derived(mobileView === 'make' || mobileView === 'model');
  const optionSelected = (value: string) => Array.isArray(mobileMenuValue)
    ? value ? listingSelectionHas(mobileMenuValue, value) : mobileMenuValue.length === 0
    : mobileMenuValue === value;
  let mobileMenuValue = $derived.by(() => {
    if (mobileView === 'make') return make;
    if (mobileView === 'model') return model;
    if (mobileView === 'body') return body;
    if (mobileView === 'price') return priceMax;
    if (mobileView === 'fuel') return fuel;
    if (mobileView === 'mileage') return mileageMax;
    if (mobileView === 'year') return yearMin;
    return '';
  });
  let mobileMenuOptions = $derived.by<MobileFilterOption[]>(() => {
    if (mobileView === 'make') return listingFilterOptions.makes.map(value => ({ value, label: value || i18n.t("m_28c0e12158d9") }));
    if (mobileView === 'model') return modelOptions.map(value => ({ value, label: value || i18n.t("m_4a7bb1458685") }));
    if (mobileView === 'body') return listingFilterOptions.bodies.map(value => ({ value, label: specificationLabel(bodyLabel(value), i18n.locale) || i18n.t("m_6c177524dfb8") }));
    if (mobileView === 'price') return listingFilterOptions.prices.map(value => ({ value, label: value ? i18n.t("m_a04d91558e9c", { p0: formatListingNumber(value, i18n.locale) }) : i18n.t("m_53d34bf6c934") }));
    if (mobileView === 'fuel') return listingFilterOptions.fuels.map(value => ({ value, label: specificationLabel(value, i18n.locale) || i18n.t("m_e8be76e05426") }));
    if (mobileView === 'mileage') return listingFilterOptions.mileages.map(value => ({ value, label: value ? i18n.t("m_243dcf897937", { p0: formatListingNumber(value, i18n.locale) }) : i18n.t("m_960884c7b030") }));
    if (mobileView === 'year') return listingFilterOptions.years.map(value => ({ value, label: value ? i18n.t("m_a8f4bf044ac3", { p0: value }) : i18n.t("m_562ec6e12633") }));
    return [];
  });

  const attachDialog: Attachment<HTMLDialogElement> = node => {
    dialog = node;
    return () => { if (dialog === node) dialog = undefined; };
  };
  const attachTrigger: Attachment<HTMLButtonElement> = node => {
    trigger = node;
    return () => { if (trigger === node) trigger = undefined; };
  };
  const attachSearchInput: Attachment<HTMLInputElement> = node => {
    searchInput = node;
    return () => { if (searchInput === node) searchInput = undefined; };
  };
  const attachHeading: Attachment<HTMLHeadingElement> = node => { heading = node; };
  const focusMobileView = async (view?: MobileFilterView) => {
    await tick();
    if (!dialog?.open) return;
    const row = view && dialog?.querySelector<HTMLButtonElement>(`button[data-view="${view}"]`);
    (row || heading)?.focus({ preventScroll: true });
  };

  const openSearch = () => {
    searchOpen = true;
    mobileView = 'main';
    dialog?.showModal();
    void tick().then(() => { if (dialog?.open) searchInput?.focus({ preventScroll: true }); });
  };
  const closeSearch = () => { if (dialog?.open) dialog.close(); };
  const resetSearch = () => {
    const cleared = emptyListingDraft();
    query = cleared.q;
    make = cleared.make;
    model = cleared.model;
    body = cleared.body;
    priceMax = cleared.priceMax;
    fuel = cleared.fuel;
    mileageMax = cleared.mileageMax;
    yearMin = cleared.yearMin;
    mobileView = 'main';
  };
  const openMobileMenu = (view: Exclude<MobileFilterView, 'main'>) => { mobileView = view; void focusMobileView(); };
  const returnToMobileOverview = () => {
    const previous = mobileView;
    mobileView = previous === 'model' ? 'make' : 'main';
    void focusMobileView(previous);
  };
  const selectMobileOption = (value: string) => {
    const previous = mobileView;
    if (mobileView === 'make' || mobileView === 'model') {
      const next = toggleListingIdentity(quickDraft, mobileView, value);
      make = next.make;
      model = next.model;
      return;
    }
    if (mobileView === 'body') body = value;
    if (mobileView === 'price') priceMax = value;
    if (mobileView === 'fuel') fuel = value;
    if (mobileView === 'mileage') mileageMax = value;
    if (mobileView === 'year') yearMin = value;
    mobileView = 'main';
    void focusMobileView(previous === 'model' ? 'make' : previous);
  };
  const handleDialogClick = (event: MouseEvent) => { if (event.target === event.currentTarget) closeSearch(); };
  const handleCancel = (event: Event) => {
    event.preventDefault();
    if (mobileView === 'main') closeSearch();
    else returnToMobileOverview();
  };
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      if (mobileView === 'main') closeSearch();
      else returnToMobileOverview();
    }
  };
  const restoreTriggerFocus = () => {
    searchOpen = false;
    mobileView = 'main';
    trigger?.focus();
  };
  const cleanFormData = (event: FormDataEvent) => cleanListingFormData(event.formData);
</script>

<button
  class="dn-quick-search__trigger dn-entry-field dn-entry-field--prominent"
  type="button"
  {@attach attachTrigger}
  aria-haspopup="dialog"
  aria-controls="dn-quick-search-dialog"
  aria-expanded={searchOpen}
  aria-label={i18n.t("m_6d382243bfbe")}
  onclick={openSearch}
>
  <span class="dn-quick-search__search-desktop"><Icon name="search" size={18} strokeWidth={1.5} /></span>
  <span class="dn-quick-search__search-mobile"><MobileActionIcon name="search" size={22} /></span>
  <span class="dn-quick-search__label-full">{i18n.t("m_6d382243bfbe")}</span>
  <span class="dn-quick-search__label-mobile" aria-hidden="true">{i18n.t("m_cb8bed4ff8b8")}</span>
  <span class="dn-quick-search__hint" aria-hidden="true">{i18n.t("m_933643dcad14")}</span>
</button>

<dialog onkeydown={event => { trapDialogTab(event); handleKeydown(event); }}
  class="dn-quick-search__dialog"
  id="dn-quick-search-dialog"
  {@attach attachDialog}
  {@attach dialogViewport}
  aria-labelledby="quick-search-title"
  onclick={handleDialogClick}
  oncancel={handleCancel}
  onclose={restoreTriggerFocus}
>
  <div class="dn-quick-search__panel">
    <header class="dn-mobile-overlay-heading dn-quick-search__header dn-mobile-overlay-header dn-mobile-filter-header">
      {#if mobileView === 'main'}
        <button class="dn-quick-search__reset dn-icon-button dn-overlay-clear" type="button" disabled={!hasFilters} onclick={resetSearch}>{i18n.t('action.clearShort')}</button>
      {:else}
        <button
          class="dn-quick-search__back dn-icon-button"
          type="button"
          aria-label={mobileView === 'model' ? i18n.t("m_d73ca16bbc17") : i18n.t("m_a779c56e526e")}
          onclick={returnToMobileOverview}
        >
          <MobileActionIcon name="back" size={20} />
        </button>
      {/if}
      <h2 id="quick-search-title" tabindex="-1" {@attach attachHeading}>
        <span class="dn-quick-search__title-desktop">{i18n.t("m_0ae7a3ecbc83")}</span>
        <span class="dn-quick-search__title-mobile">{mobileView === 'main' ? i18n.t("m_0ae7a3ecbc83") : mobileMenuTitle}</span>
      </h2>
      <button class="dn-quick-search__close dn-icon-button" type="button" aria-label={i18n.t("m_fab9fcfc48bf")} onclick={closeSearch}>
        {#if mobile.current}<MobileActionIcon name="close" size={20} />{:else}<Icon name="x" size={22} strokeWidth={1.8} />{/if}
      </button>
    </header>

    <form
      class={['dn-quick-search__form', { 'dn-quick-search__form--mobile-hidden': mobileView !== 'main' }]}
      method="GET"
      action={i18n.href(resolve('/cars'))}
      onsubmit={closeSearch}
      onformdata={cleanFormData}
    >
      <label class="dn-sr-only" for="quick-search-input">{i18n.t("m_13fd09148700")}</label>
      <div class="dn-quick-search__input-wrap dn-entry-field dn-mobile-overlay-search">
        {#if mobile.current}<MobileActionIcon name="search" size={18} />{:else}<Icon name="search" size={18} strokeWidth={1.8} />{/if}
        <input {@attach i18n.validation}
          id="quick-search-input"
          class="dn-entry-field__input"
          {@attach attachSearchInput}
          bind:value={query}
          type="search"
          name="q"
          placeholder={i18n.t(mobile.current ? 'm_cb8bed4ff8b8' : 'm_08c6b6889e71')}
          autocomplete="off"
          aria-describedby="quick-search-status"
        />
      </div>
      {#each make as value (value)}<input type="hidden" name="make" {value} />{/each}
      {#each model as value (value)}<input type="hidden" name="model" {value} />{/each}
      {#if body}<input type="hidden" name="body" value={body} />{/if}
      {#if priceMax}<input type="hidden" name="price_max" value={priceMax} />{/if}
      {#if fuel}<input type="hidden" name="fuel" value={fuel} />{/if}
      {#if mileageMax}<input type="hidden" name="mileage_max" value={mileageMax} />{/if}
      {#if yearMin}<input type="hidden" name="year_min" value={yearMin} />{/if}
    </form>

    <form class="dn-quick-search__mobile-filters" method="GET" action={i18n.href(resolve('/cars'))} onsubmit={closeSearch} onformdata={cleanFormData}>
      {#if query.trim()}<input type="hidden" name="q" value={query.trim()} />{/if}
      {#each make as value (value)}<input type="hidden" name="make" {value} />{/each}
      {#each model as value (value)}<input type="hidden" name="model" {value} />{/each}
      {#if body}<input type="hidden" name="body" value={body} />{/if}
      {#if priceMax}<input type="hidden" name="price_max" value={priceMax} />{/if}
      {#if fuel}<input type="hidden" name="fuel" value={fuel} />{/if}
      {#if mileageMax}<input type="hidden" name="mileage_max" value={mileageMax} />{/if}
      {#if yearMin}<input type="hidden" name="year_min" value={yearMin} />{/if}

      {#if mobileView === 'main'}
        <div class="dn-quick-search__filter-rows">
          <button class="dn-quick-search__filter-row dn-mobile-overlay-row" data-view="make" data-active={Boolean(make.length || model.length)} type="button" onclick={() => openMobileMenu('make')}>
            <strong>{i18n.t("m_ffd178a2d771")}</strong>
            <span data-active={Boolean(make.length || model.length)}>{makeModelSummary}</span>
            <MobileActionIcon name="arrow" size={18} />
          </button>

          <button class="dn-quick-search__filter-row dn-mobile-overlay-row" data-view="body" data-active={Boolean(body)} type="button" onclick={() => openMobileMenu('body')}>
            <strong>{i18n.t("m_191c24bf12d5")}</strong>
            <span data-active={Boolean(body)}>{body ? specificationLabel(bodyLabel(body), i18n.locale) : i18n.t("m_a52ace420f21")}</span>
            <MobileActionIcon name="arrow" size={18} />
          </button>

          <button class="dn-quick-search__filter-row dn-mobile-overlay-row" data-view="price" data-active={Boolean(priceMax)} type="button" onclick={() => openMobileMenu('price')}>
            <strong>{i18n.t("m_84e960d40ad5")}</strong>
            <span data-active={Boolean(priceMax)}>{priceMax ? i18n.t("m_a04d91558e9c", { p0: formatListingNumber(priceMax, i18n.locale) }) : i18n.t("m_53d34bf6c934")}</span>
            <MobileActionIcon name="arrow" size={18} />
          </button>

          <button class="dn-quick-search__filter-row dn-mobile-overlay-row" data-view="fuel" data-active={Boolean(fuel)} type="button" onclick={() => openMobileMenu('fuel')}>
            <strong>{i18n.t("m_a80f942f4112")}</strong>
            <span data-active={Boolean(fuel)}>{fuel ? specificationLabel(fuel, i18n.locale) : i18n.t("m_a52ace420f21")}</span>
            <MobileActionIcon name="arrow" size={18} />
          </button>

          <button class="dn-quick-search__filter-row dn-mobile-overlay-row" data-view="mileage" data-active={Boolean(mileageMax)} type="button" onclick={() => openMobileMenu('mileage')}>
            <strong>{i18n.t("m_ffe44a017911")}</strong>
            <span data-active={Boolean(mileageMax)}>{mileageMax ? i18n.t("m_243dcf897937", { p0: formatListingNumber(mileageMax, i18n.locale) }) : i18n.t("m_960884c7b030")}</span>
            <MobileActionIcon name="arrow" size={18} />
          </button>

          <button class="dn-quick-search__filter-row dn-mobile-overlay-row" data-view="year" data-active={Boolean(yearMin)} type="button" onclick={() => openMobileMenu('year')}>
            <strong>{i18n.t("m_89f6832560de")}</strong>
            <span data-active={Boolean(yearMin)}>{yearMin ? i18n.t("m_a8f4bf044ac3", { p0: yearMin }) : i18n.t("m_562ec6e12633")}</span>
            <MobileActionIcon name="arrow" size={18} />
          </button>
        </div>
      {:else}
        <div class="dn-quick-search__option-menu" aria-label={mobileMenuTitle}>
          <div class="dn-quick-search__option-grid" class:identity={identityView}>
            {#each mobileMenuOptions as option (option.value)}
              <button
                class="dn-quick-search__option dn-mobile-overlay-option"
                type="button"
                aria-pressed={optionSelected(option.value)}
                onclick={() => selectMobileOption(option.value)}
              >
                <span class="option-label">{option.label}</span>{#if identityView}<span class="identity-check dn-mobile-filter-check" data-checked={optionSelected(option.value)} aria-hidden="true">{#if optionSelected(option.value)}<MobileActionIcon name="check" size={18} />{/if}</span>{/if}
              </button>
            {/each}
          </div>
        </div>
      {/if}

      <footer class="dn-quick-search__mobile-footer dn-mobile-overlay-footer">
        {#if mobileView === 'main'}<button class="dn-quick-search__clear dn-mobile-overlay-clear" type="button" disabled={!hasFilters} onclick={resetSearch}>{i18n.t('action.clearShort')}</button>{/if}
        {#if mobileView === 'make'}
          <button class="dn-mobile-overlay-action" type="button" onclick={() => openMobileMenu('model')}>{i18n.t('m_5e2c614c23f0')}<MobileActionIcon name="arrow" size={20} /></button>
        {:else if mobileView === 'model'}
          <button class="dn-mobile-overlay-action" type="button" onclick={() => { mobileView = 'main'; void focusMobileView('make'); }}>{i18n.t('m_1509f561f241')}</button>
        {:else}<button class="dn-mobile-overlay-action" type="submit" disabled={filteredVehicles.length === 0} aria-live="polite" aria-label={filteredVehicles.length === 1 ? i18n.t('m_047e325f6562') : i18n.t('m_08d2ff28407e', { p0: filteredVehicles.length })}>
          {i18n.t('action.showCount', { count: filteredVehicles.length })}
        </button>{/if}
      </footer>
    </form>

    <span class="dn-sr-only" id="quick-search-status" role="status" aria-live="polite">
      {query.trim()
        ? filteredVehicles.length === 1
          ? i18n.t("m_8e7d9c401501")
          : i18n.t("m_127d0c5730b9", { p0: filteredVehicles.length })
        : i18n.t("m_9be515240808")}
    </span>

  </div>
</dialog>

<style>
  .dn-quick-search__trigger {
    display: grid;
    width: 100%;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 11px;
    margin: 0;
    padding: 0 16px;
    text-align: left;
    cursor: pointer;
    transition: border-color 160ms ease-out, background-color 160ms ease-out;
  }

  @media (min-width: 992px) {
    .dn-quick-search__trigger {
      padding-inline: 18px;
    }
  }

  @media (hover: hover) and (pointer: fine) {
    .dn-quick-search__trigger:hover {
      border-color: var(--dn-entry-hover-line, #b8bec7);
      background: var(--dn-entry-hover-surface, #f3f4f6);
    }
  }

  .dn-quick-search__hint {
    color: #2d3036;
    font-size: var(--dn-text-meta);
    font-weight: var(--dn-weight-semibold);
  }

  .dn-quick-search__label-mobile,
  .dn-quick-search__search-mobile {
    display: none;
  }

  .dn-quick-search__dialog {
    width: min(1120px, calc(100vw - 48px));
    height: min(820px, calc(100dvh - 64px));
    max-width: none;
    max-height: none;
    margin: 32px auto auto;
    padding: 0;
    overflow: hidden;
    border: 0;
    border-radius: 20px;
    background: #f6f7f8;
    color: #191c22;
    box-shadow: 0 32px 100px rgba(0, 0, 0, 0.32);
  }

  .dn-quick-search__dialog::backdrop {
    background: rgba(10, 13, 18, 0.72);
    backdrop-filter: blur(4px);
  }

  .dn-quick-search__panel {
    display: flex;
    height: 100%;
    flex-direction: column;
  }

  .dn-quick-search__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 24px 28px 12px;
  }

  .dn-quick-search__header h2 {
    margin: 0;
    font-size: var(--dn-text-subheading);
    font-weight: var(--dn-weight-semibold);
    line-height: var(--dn-leading-heading);
    letter-spacing: var(--dn-tracking-heading);
  }
  .dn-quick-search__header h2:focus { outline: none; }

  .dn-quick-search__reset,
  .dn-quick-search__back,
  .dn-quick-search__title-mobile,
  .dn-quick-search__mobile-filters {
    display: none;
  }

  .dn-quick-search__close {
    border: 0;
    border-radius: var(--dn-radius-button);
    background: #e9ecef;
    color: #24272c;
  }

  .dn-quick-search__close:hover,
  .dn-quick-search__close:focus-visible {
    background: #dfe3e7;
  }

  .dn-quick-search__close:focus-visible {
    outline: 3px solid rgb(var(--dn-theme-accent-rgb) / 20%);
    outline-offset: -3px;
  }

  .dn-quick-search__form {
    display: block;
    padding: 8px 28px 20px;
  }

  .dn-quick-search__input-wrap {
    display: flex;
    align-items: center;
    gap: var(--dn-space-3);
    padding: 0 var(--dn-space-4);
    border: 0;
  }

  @media (max-width: 767px) {
    .dn-quick-search__trigger { grid-template-columns: auto minmax(0, 1fr); gap: var(--dn-space-2); padding-inline: var(--dn-space-3); }
    .dn-quick-search__search-desktop { display: none; }
    .dn-quick-search__search-mobile { display: grid; place-items: center; }
    .dn-quick-search__label-full {
      display: none;
    }

    .dn-quick-search__label-mobile {
      display: inline;
      min-width: 0;
      overflow: hidden;
      color: var(--dn-entry-prominent-muted);
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dn-quick-search__trigger :global(.dn-icon) {
      color: var(--dn-entry-prominent-muted);
    }

    .dn-quick-search__hint {
      display: none;
    }

    .dn-quick-search__dialog {
      --dn-primary-action-surface: var(--dn-ink);
      --dn-primary-action-surface-hover: var(--dn-ink-hover);
      position: fixed;
      inset: var(--dn-dialog-viewport-top, 0px) 0 auto;
      width: 100%;
      height: var(--dn-dialog-viewport-height, 100dvh);
      max-height: var(--dn-dialog-viewport-height, 100dvh);
      margin: 0;
      border-radius: 0;
      background: var(--dn-white);
      box-shadow: none;
    }
    .dn-quick-search__dialog[open] { display: flex; flex-direction: column; }
    .dn-quick-search__dialog::backdrop { background: rgb(8 10 14 / .35); backdrop-filter: none; }

    .dn-quick-search__panel {
      min-height: 0;
      height: 100%;
      max-height: 100%;
      overflow: hidden;
      border-radius: 0;
      background: var(--dn-white);
    }

    .dn-quick-search__header {
      display: grid;
      min-height: 64px;
      grid-template-columns: minmax(0, 1fr) minmax(0, 2fr) minmax(0, 1fr);
      gap: var(--dn-space-3);
      padding: var(--dn-space-3) var(--dn-overlay-gutter);
      background: #fff;
    }

    .dn-quick-search__header h2 {
      min-width: 0;
      text-align: center;
      font-size: var(--dn-text-card);
      letter-spacing: var(--dn-tracking-heading);
      overflow-wrap: anywhere;
    }

    .dn-quick-search__reset { display: inline-grid; justify-self: start; border: 0; border-radius: var(--dn-radius-button); background: var(--dn-home-panel); color: var(--dn-ink); cursor: pointer; }
    .dn-quick-search__reset:disabled { color: var(--dn-muted); cursor: default; }
    .dn-quick-search__reset:enabled:hover { background: var(--dn-surface-hover); }
    .dn-quick-search__reset:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: -2px; }

    .dn-quick-search__back {
      display: inline-flex;
      justify-self: start;
      padding: var(--dn-compact-control-inset);
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: var(--dn-pill);
      background: var(--dn-home-panel);
      color: var(--dn-ink);
      font: var(--dn-overlay-option-font);
      cursor: pointer;
      transition: background-color 140ms ease-out;
    }

    .dn-quick-search__back:hover,
    .dn-quick-search__back:focus-visible {
      background: var(--dn-surface-hover);
    }

    .dn-quick-search__back:focus-visible {
      outline: 2px solid var(--dn-focus);
      outline-offset: -2px;
    }

    .dn-quick-search__option:has(.identity-check) { display: flex; align-items: center; justify-content: flex-start; gap: var(--dn-space-3); }
    .identity-check { order: -1; }
    .option-label { min-width: 0; overflow-wrap: anywhere; }

    .dn-quick-search__title-desktop {
      display: none;
    }

    .dn-quick-search__title-mobile {
      display: inline;
    }

    .dn-quick-search__close {
      justify-self: end;
    }

    .dn-quick-search__form {
      padding: 0 var(--dn-overlay-gutter) var(--dn-overlay-gap);
    }

    .dn-quick-search__form--mobile-hidden {
      display: none;
    }

    .dn-quick-search__mobile-filters {
      display: flex;
      min-height: 0;
      flex: 1 1 auto;
      flex-direction: column;
    }

    .dn-quick-search__filter-rows {
      display: grid;
      flex: 1 1 auto;
      min-height: 0;
      grid-auto-rows: max-content;
      align-content: start;
      gap: var(--dn-mobile-filter-control-gap);
      padding: var(--dn-space-2) var(--dn-overlay-gutter) var(--dn-overlay-gap);
      overflow-y: auto;
      overscroll-behavior: contain;
    }

    .dn-quick-search__option-menu {
      min-height: 0;
      flex: 1 1 auto;
      padding: 0 var(--dn-overlay-gutter) var(--dn-overlay-gap);
      overflow-y: auto;
      overscroll-behavior: contain;
    }

    .dn-quick-search__option-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--dn-mobile-filter-control-gap);
      column-gap: var(--dn-overlay-gap);
    }

    .dn-quick-search__option-grid.identity { grid-template-columns: minmax(0, 1fr); gap: var(--dn-mobile-filter-control-gap); }
    .identity .dn-quick-search__option { min-height: var(--dn-overlay-row-height); padding-inline: var(--dn-space-3); }
    .dn-quick-search__mobile-footer { border-top: 1px solid var(--dn-line); }
  }

  @media (prefers-reduced-motion: reduce) {
    .dn-quick-search__trigger,
    .dn-quick-search__filter-row,
    .dn-quick-search__option,
    .dn-quick-search__back {
      transition: none;
    }


  }
</style>
