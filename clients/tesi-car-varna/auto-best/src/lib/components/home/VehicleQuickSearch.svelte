<script lang="ts">
  import Icon from '$components/ui/Icon.svelte';
  import MobileNavIcon from '$components/layout/MobileNavIcon.svelte';
  import { resolve } from '$app/paths';
  import { featuredVehicles } from '$data/inventory';
  import { bodyLabel, filterListingVehicles, listingFilterOptions, listingModelsForMake } from '$data/listing';
  import type { Attachment } from 'svelte/attachments';


  type MobileFilterView = 'main' | 'make' | 'model' | 'body' | 'price' | 'fuel' | 'mileage' | 'year';
  type MobileFilterOption = { value: string; label: string };

  let dialog = $state<HTMLDialogElement>();
  let trigger = $state<HTMLButtonElement>();
  let searchInput = $state<HTMLInputElement>();
  let query = $state('');
  let make = $state('');
  let model = $state('');
  let body = $state('');
  let priceMax = $state('');
  let fuel = $state('');
  let mileageMax = $state('');
  let yearMin = $state('');
  let searchOpen = $state(false);
  let mobileView = $state<MobileFilterView>('main');
  let modelOptions = $derived(listingModelsForMake(make));
  let filteredVehicles = $derived(filterListingVehicles(featuredVehicles, {
    q: query,
    make,
    model,
    body,
    fuel,
    transmission: '',
    version: '',
    equipment: [],
    condition: '',
    yearMin: yearMin ? Number(yearMin) : null,
    yearMax: null,
    priceMin: null,
    priceMax: priceMax ? Number(priceMax) : null,
    mileageMax: mileageMax ? Number(mileageMax) : null,
    sort: 'default'
  }));
  let hasFilters = $derived(Boolean(query || make || model || body || priceMax || fuel || mileageMax || yearMin));
  const formatNumber = (value: string) => new Intl.NumberFormat('bg-BG').format(Number(value));
  let makeModelSummary = $derived([make, model].filter(Boolean).join(' ') || 'Всички марки');
  let mobileMenuTitle = $derived.by(() => {
    if (mobileView === 'make') return 'Марка';
    if (mobileView === 'model') return make || 'Модел';
    if (mobileView === 'body') return 'Купе';
    if (mobileView === 'price') return 'Бюджет';
    if (mobileView === 'fuel') return 'Гориво';
    if (mobileView === 'mileage') return 'Пробег';
    if (mobileView === 'year') return 'Година';
    return 'Филтри';
  });
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
    if (mobileView === 'make') return listingFilterOptions.makes.map((value) => ({ value, label: value || 'Всички марки' }));
    if (mobileView === 'model') return modelOptions.map((value) => ({ value, label: value || 'Всички модели' }));
    if (mobileView === 'body') return listingFilterOptions.bodies.map((value) => ({ value, label: bodyLabel(value) || 'Всички купета' }));
    if (mobileView === 'price') return listingFilterOptions.prices.map((value) => ({ value, label: value ? `До ${formatNumber(value)} €` : 'Всеки бюджет' }));
    if (mobileView === 'fuel') return listingFilterOptions.fuels.map((value) => ({ value, label: value || 'Всяко гориво' }));
    if (mobileView === 'mileage') return listingFilterOptions.mileages.map((value) => ({ value, label: value ? `До ${formatNumber(value)} км` : 'Всеки пробег' }));
    if (mobileView === 'year') return listingFilterOptions.years.map((value) => ({ value, label: value ? `От ${value}` : 'Всяка година' }));
    return [];
  });
  const attachDialog: Attachment<HTMLDialogElement> = (node) => {
    dialog = node;
    return () => {
      if (dialog === node) dialog = undefined;
    };
  };

  const attachTrigger: Attachment<HTMLButtonElement> = (node) => {
    trigger = node;
    return () => {
      if (trigger === node) trigger = undefined;
    };
  };

  const attachSearchInput: Attachment<HTMLInputElement> = (node) => {
    searchInput = node;
    return () => {
      if (searchInput === node) searchInput = undefined;
    };
  };

  const openSearch = () => {
    searchOpen = true;
    mobileView = 'main';
    dialog?.showModal();
    if (window.matchMedia('(min-width: 768px)').matches) requestAnimationFrame(() => searchInput?.focus());
  };

  const closeSearch = () => {
    if (dialog?.open) dialog.close();
  };

  const resetSearch = () => {
    query = '';
    make = '';
    model = '';
    body = '';
    priceMax = '';
    fuel = '';
    mileageMax = '';
    yearMin = '';
    mobileView = 'main';
  };

  const openMobileMenu = (view: Exclude<MobileFilterView, 'main'>) => {
    mobileView = view;
  };

  const returnToMobileOverview = () => {
    mobileView = mobileView === 'model' ? 'make' : 'main';
  };

  const selectMobileOption = (value: string) => {
    if (mobileView === 'make') {
      make = value;
      model = '';
      mobileView = value ? 'model' : 'main';
      return;
    }
    if (mobileView === 'model') model = value;
    if (mobileView === 'body') body = value;
    if (mobileView === 'price') priceMax = value;
    if (mobileView === 'fuel') fuel = value;
    if (mobileView === 'mileage') mileageMax = value;
    if (mobileView === 'year') yearMin = value;
    mobileView = 'main';
  };

  const handleDialogClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) closeSearch();
  };

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

  const cleanFormData = (event: FormDataEvent) => {
    for (const key of new Set(event.formData.keys())) {
      const values = event.formData.getAll(key);
      if (values.every((value) => typeof value === 'string' && !value.trim())) event.formData.delete(key);
    }
  };
</script>

<button
  class="dn-quick-search__trigger"
  type="button"
  {@attach attachTrigger}
  aria-haspopup="dialog"
  aria-controls="dn-quick-search-dialog"
  aria-expanded={searchOpen}
  aria-label="Търсете марка, модел или ключова дума"
  onclick={openSearch}
>
  <MobileNavIcon name="search" size={20} />
  <span class="dn-quick-search__label-full">Търсете марка, модел или ключова дума</span>
  <span class="dn-quick-search__label-mobile" aria-hidden="true">Марка или модел</span>
  <span class="dn-quick-search__hint" aria-hidden="true">Бързо търсене</span>
  <span class="dn-quick-search__mobile-filter" aria-hidden="true"><MobileNavIcon name="filters" size={20} /></span>
</button>

<dialog
  class="dn-quick-search__dialog"
  id="dn-quick-search-dialog"
  {@attach attachDialog}
  aria-labelledby="quick-search-title"
  onclick={handleDialogClick}
  oncancel={handleCancel}
  onclose={restoreTriggerFocus}
>
  <div class="dn-quick-search__panel">
    <header class="dn-quick-search__header">
      {#if mobileView === 'main'}
        <button class="dn-quick-search__reset" type="button" disabled={!hasFilters} onclick={resetSearch}>Нулирай</button>
      {:else}
        <button
          class="dn-quick-search__back"
          type="button"
          aria-label={mobileView === 'model' ? 'Назад към марките' : 'Назад към филтрите'}
          onclick={returnToMobileOverview}
        >
          <Icon name="arrow-left" size={21} strokeWidth={1.8} />
        </button>
      {/if}
      <h2 id="quick-search-title">
        <span class="dn-quick-search__title-desktop">Търсене на автомобил</span>
        <span class="dn-quick-search__title-mobile">{mobileMenuTitle}</span>
      </h2>
      <button class="dn-quick-search__close" type="button" aria-label="Затворете търсенето" onclick={closeSearch}>
        <Icon name="x" size={22} strokeWidth={1.8} />
      </button>
    </header>

    <form
      class={['dn-quick-search__form', { 'dn-quick-search__form--mobile-hidden': mobileView !== 'main' }]}
      method="GET"
      action={resolve('/listing-grid')}
      onsubmit={closeSearch}
      onformdata={cleanFormData}
    >
      <label class="dn-sr-only" for="quick-search-input">Марка, модел или ключова дума</label>
      <div class="dn-quick-search__input-wrap">
        <Icon name="search" size={21} strokeWidth={1.8} />
        <input
          id="quick-search-input"
          {@attach attachSearchInput}
          bind:value={query}
          type="search"
          name="q"
          placeholder="Например Audi, BMW или SUV"
          autocomplete="off"
          aria-describedby="quick-search-status"
          onkeydown={handleKeydown}
        />
      </div>
      {#if make}<input type="hidden" name="make" value={make} />{/if}
      {#if model}<input type="hidden" name="model" value={model} />{/if}
      {#if body}<input type="hidden" name="body" value={body} />{/if}
      {#if priceMax}<input type="hidden" name="price_max" value={priceMax} />{/if}
      {#if fuel}<input type="hidden" name="fuel" value={fuel} />{/if}
      {#if mileageMax}<input type="hidden" name="mileage_max" value={mileageMax} />{/if}
      {#if yearMin}<input type="hidden" name="year_min" value={yearMin} />{/if}
    </form>

    <form class="dn-quick-search__mobile-filters" method="GET" action={resolve('/listing-grid')} onsubmit={closeSearch} onformdata={cleanFormData}>
      {#if query.trim()}<input type="hidden" name="q" value={query.trim()} />{/if}
      {#if make}<input type="hidden" name="make" value={make} />{/if}
      {#if model}<input type="hidden" name="model" value={model} />{/if}
      {#if body}<input type="hidden" name="body" value={body} />{/if}
      {#if priceMax}<input type="hidden" name="price_max" value={priceMax} />{/if}
      {#if fuel}<input type="hidden" name="fuel" value={fuel} />{/if}
      {#if mileageMax}<input type="hidden" name="mileage_max" value={mileageMax} />{/if}
      {#if yearMin}<input type="hidden" name="year_min" value={yearMin} />{/if}

      {#if mobileView === 'main'}
        <div class="dn-quick-search__filter-rows">
          <button class="dn-quick-search__filter-row" type="button" onclick={() => openMobileMenu('make')}>
            <strong>Марка и модел</strong>
            <span>{makeModelSummary}</span>
            <Icon name="arrow-right" size={17} strokeWidth={1.8} />
          </button>

          <button class="dn-quick-search__filter-row" type="button" onclick={() => openMobileMenu('body')}>
            <strong>Купе</strong>
            <span>{bodyLabel(body) || 'Всички купета'}</span>
            <Icon name="arrow-right" size={17} strokeWidth={1.8} />
          </button>

          <button class="dn-quick-search__filter-row" type="button" onclick={() => openMobileMenu('price')}>
            <strong>Бюджет</strong>
            <span>{priceMax ? `До ${formatNumber(priceMax)} €` : 'Всеки бюджет'}</span>
            <Icon name="arrow-right" size={17} strokeWidth={1.8} />
          </button>

          <button class="dn-quick-search__filter-row" type="button" onclick={() => openMobileMenu('fuel')}>
            <strong>Гориво</strong>
            <span>{fuel || 'Всяко гориво'}</span>
            <Icon name="arrow-right" size={17} strokeWidth={1.8} />
          </button>

          <button class="dn-quick-search__filter-row" type="button" onclick={() => openMobileMenu('mileage')}>
            <strong>Пробег</strong>
            <span>{mileageMax ? `До ${formatNumber(mileageMax)} км` : 'Всеки пробег'}</span>
            <Icon name="arrow-right" size={17} strokeWidth={1.8} />
          </button>

          <button class="dn-quick-search__filter-row" type="button" onclick={() => openMobileMenu('year')}>
            <strong>Година</strong>
            <span>{yearMin ? `От ${yearMin}` : 'Всяка година'}</span>
            <Icon name="arrow-right" size={17} strokeWidth={1.8} />
          </button>
        </div>
      {:else}
        <div class="dn-quick-search__option-menu" aria-label={mobileMenuTitle}>
          <div class="dn-quick-search__option-grid">
            {#each mobileMenuOptions as option (option.value)}
              <button
                class={['dn-quick-search__option', { 'dn-quick-search__option--selected': mobileMenuValue === option.value }]}
                type="button"
                aria-pressed={mobileMenuValue === option.value}
                onclick={() => selectMobileOption(option.value)}
              >
                {option.label}
              </button>
            {/each}
          </div>
        </div>
      {/if}

      <footer class="dn-quick-search__mobile-footer">
        <button type="submit" disabled={filteredVehicles.length === 0} aria-live="polite">
          {filteredVehicles.length === 1 ? 'Покажи 1 автомобил' : `Покажи ${filteredVehicles.length} автомобила`}
        </button>
      </footer>
    </form>

    <span class="dn-sr-only" id="quick-search-status" role="status" aria-live="polite">
      {query.trim()
        ? filteredVehicles.length === 1
          ? '1 съвпадение'
          : `${filteredVehicles.length} съвпадения`
        : 'Въведете марка, модел или ключова дума.'}
    </span>

  </div>
</dialog>

<style>
  .dn-quick-search__trigger {
    display: grid;
    width: 100%;
    min-height: 48px;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 11px;
    margin: 0 0 12px;
    padding: 0 16px;
    border: 1px solid #dfe2e6;
    border-radius: var(--dn-radius-button);
    background: #f8f9fa;
    color: #686d75;
    font: inherit;
    font-size: 16px;
    text-align: left;
    cursor: pointer;
    transition: border-color 160ms ease-out, background-color 160ms ease-out;
  }

  @media (min-width: 992px) {
    .dn-quick-search__trigger {
      min-height: var(--dn-discovery-search-height);
      margin-bottom: var(--dn-discovery-gap);
      padding-inline: 18px;
      border-radius: 14px;
      background: #f5f6f7;
    }
  }

  .dn-quick-search__trigger:hover {
    border-color: #b8bec7;
    background: #f3f4f6;
  }

  .dn-quick-search__trigger:focus-visible {
    outline: 3px solid rgba(196, 1, 1, 0.2);
    outline-offset: 2px;
  }

  .dn-quick-search__hint {
    color: #2d3036;
    font-size: 14px;
    font-weight: 600;
  }

  .dn-quick-search__label-mobile,
  .dn-quick-search__mobile-filter {
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
    font-weight: 650;
    line-height: 1.25;
    letter-spacing: -0.02em;
  }

  .dn-quick-search__reset,
  .dn-quick-search__back,
  .dn-quick-search__title-mobile,
  .dn-quick-search__mobile-filters {
    display: none;
  }

  .dn-quick-search__close {
    display: inline-flex;
    width: 46px;
    height: 46px;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: var(--dn-radius-button);
    background: #e9ecef;
    color: #24272c;
    cursor: pointer;
  }

  .dn-quick-search__close:hover,
  .dn-quick-search__close:focus-visible {
    background: #dfe3e7;
  }

  .dn-quick-search__close:focus-visible {
    outline: 3px solid rgba(196, 1, 1, 0.2);
    outline-offset: -3px;
  }

  .dn-quick-search__form {
    display: block;
    padding: 8px 28px 20px;
  }

  .dn-quick-search__input-wrap {
    display: flex;
    height: 64px;
    align-items: center;
    gap: 12px;
    padding: 0 20px;
    border: 1px solid transparent;
    border-radius: var(--dn-radius-control);
    background: #e9ecef;
    color: #727780;
  }

  .dn-quick-search__input-wrap:focus-within {
    border-color: #c40101;
    background: #fff;
  }

  .dn-quick-search__input-wrap input {
    width: 100%;
    min-width: 0;
    height: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: #191c22;
    font: inherit;
    font-size: var(--dn-text-lead);
    line-height: var(--dn-leading-lead);
  }

  .dn-quick-search__input-wrap input::placeholder {
    color: #777c84;
    opacity: 1;
  }

  @media (max-width: 767px) {
    .dn-quick-search__label-full {
      display: none;
    }

    .dn-quick-search__label-mobile {
      display: inline;
    }

    .dn-quick-search__mobile-filter {
      display: grid;
      place-items: center;
      color: #30363f;
    }

    .dn-quick-search__hint {
      display: none;
    }

    .dn-quick-search__dialog {
      width: 100%;
      height: 100dvh;
      max-height: none;
      margin: 0;
      border-radius: 0;
      background: #fff;
    }

    .dn-quick-search__panel {
      height: 100%;
      max-height: none;
    }

    .dn-quick-search__header {
      display: grid;
      min-height: 64px;
      grid-template-columns: 64px minmax(0, 1fr) 64px;
      gap: 0;
      padding: 6px 12px;
      background: #fff;
    }

    .dn-quick-search__header h2 {
      text-align: center;
      font-size: 18px;
      letter-spacing: -0.01em;
    }

    .dn-quick-search__reset {
      display: inline-flex;
      min-height: 44px;
      align-items: center;
      justify-content: flex-start;
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--dn-red);
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      font-weight: 650;
    }

    .dn-quick-search__back {
      display: inline-flex;
      width: 46px;
      height: 46px;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: 0;
      border-radius: var(--dn-radius-button);
      background: #e9ecef;
      color: #24272c;
      cursor: pointer;
      transition: background-color 140ms ease-out;
    }

    .dn-quick-search__back:hover,
    .dn-quick-search__back:focus-visible {
      background: #dfe3e7;
    }

    .dn-quick-search__back:focus-visible {
      outline: 3px solid rgba(196, 1, 1, 0.18);
      outline-offset: -3px;
    }

    .dn-quick-search__reset:disabled {
      color: #9aa0a8;
      cursor: default;
    }

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
      padding: 4px 16px 10px;
    }

    .dn-quick-search__form--mobile-hidden {
      display: none;
    }

    .dn-quick-search__input-wrap {
      height: 48px;
      padding-inline: 16px;
      border-color: transparent;
      border-radius: var(--dn-pill);
      background: #f1f2f4;
    }

    .dn-quick-search__input-wrap:focus-within {
      border-color: var(--dn-red);
      background: #f1f2f4;
    }

    .dn-quick-search__input-wrap input {
      font-size: var(--dn-text-body);
    }

    .dn-quick-search__mobile-filters {
      display: flex;
      min-height: 0;
      flex: 1;
      flex-direction: column;
    }

    .dn-quick-search__filter-rows {
      display: grid;
      min-height: 0;
      gap: 8px;
      padding: 0 16px 10px;
      overflow-y: auto;
      overscroll-behavior: contain;
    }

    .dn-quick-search__filter-row {
      display: grid;
      min-height: 52px;
      width: 100%;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
      padding: 0 14px;
      border: 1px solid transparent;
      border-radius: 14px;
      background: #f1f2f4;
      color: #191c22;
      cursor: pointer;
      font: inherit;
      text-align: left;
      transition: background-color 140ms ease-out, border-color 140ms ease-out;
    }

    .dn-quick-search__filter-row strong {
      font-size: 15px;
      font-weight: 650;
    }

    .dn-quick-search__filter-row > span {
      overflow: hidden;
      color: #626975;
      font-size: 14px;
      text-align: right;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dn-quick-search__filter-row :global(.dn-icon) {
      color: #626975;
    }

    .dn-quick-search__filter-row:hover {
      background: #e9ebee;
    }

    .dn-quick-search__filter-row:focus-visible {
      border-color: var(--dn-red);
      outline: 3px solid rgba(196, 1, 1, 0.18);
      outline-offset: -3px;
    }

    .dn-quick-search__option-menu {
      min-height: 0;
      flex: 1;
      padding: 2px 16px 16px;
      overflow-y: auto;
      overscroll-behavior: contain;
    }

    .dn-quick-search__option-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .dn-quick-search__option {
      min-height: 52px;
      padding: 8px 12px;
      border: 1px solid transparent;
      border-radius: 14px;
      background: #f1f2f4;
      color: #24272c;
      cursor: pointer;
      font: inherit;
      font-size: 14px;
      font-weight: 650;
      line-height: 1.25;
      transition: background-color 140ms ease-out, color 140ms ease-out;
    }

    .dn-quick-search__option:hover {
      background: #e4e7ea;
    }

    .dn-quick-search__option:focus-visible {
      outline: 3px solid rgba(196, 1, 1, 0.2);
      outline-offset: -3px;
    }

    .dn-quick-search__option--selected {
      background: #171a20;
      color: #fff;
    }

    .dn-quick-search__mobile-footer {
      margin-top: auto;
      flex: 0 0 auto;
      padding: 12px 16px calc(14px + env(safe-area-inset-bottom));
      background: #fff;
    }

    .dn-quick-search__mobile-footer button {
      width: 100%;
      min-height: 50px;
      border: 0;
      border-radius: var(--dn-radius-button);
      background: var(--dn-red);
      color: #fff;
      cursor: pointer;
      font: inherit;
      font-size: 15px;
      font-weight: 700;
    }

    .dn-quick-search__mobile-footer button:disabled {
      background: #c7cbd1;
      cursor: not-allowed;
    }


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
