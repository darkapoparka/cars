<script lang="ts">
  import { preserveScrollOffset } from '$lib/ui/overlay';
  import { onDestroy } from 'svelte';
  let releaseOffset: ((restoreScroll?: boolean) => void) | undefined;
  onDestroy(() => releaseOffset?.(false));
  import { resolve } from '$app/paths';
  import { bodyLabel, filterListingVehicles, listingFilterOptions, listingModelsForMake, listingVehicles, type ListingFilters } from '$data/listing';
  import type { VehicleEquipment } from '$data/inventory';
  import Icon from '$components/ui/Icon.svelte';
  import QuickFilterSheet from './QuickFilterSheet.svelte';
  import type { Attachment } from 'svelte/attachments';
  import type { Snippet } from 'svelte';

  let { filters, children }: { filters: ListingFilters; children: Snippet<[(event: MouseEvent, field?: string) => void, boolean]> } = $props();
  let draftQuery = $state('');
  let draftMake = $state('');
  let draftModel = $state('');
  let draftBody = $state('');
  let draftCondition = $state<ListingFilters['condition']>('');
  let draftFuel = $state('');
  let draftTransmission = $state('');
  let draftVersion = $state('');
  let draftEquipment = $state<VehicleEquipment[]>([]);
  let draftYearMin = $state('');
  let draftYearMax = $state('');
  let draftPriceMin = $state('');
  let draftPriceMax = $state('');
  let draftMileageMax = $state('');
  let draftModelOptions = $derived(listingModelsForMake(draftMake));
  let hasInvalidPriceRange = $derived(Boolean(draftPriceMin && draftPriceMax && Number(draftPriceMin) > Number(draftPriceMax)));
  let hasInvalidYearRange = $derived(Boolean(draftYearMin && draftYearMax && Number(draftYearMin) > Number(draftYearMax)));
  let hasInvalidRange = $derived(hasInvalidPriceRange || hasInvalidYearRange);
  let draftFilters = $derived<ListingFilters>({
    q: draftQuery,
    make: draftMake,
    model: draftModel,
    body: draftBody,
    condition: draftCondition,
    fuel: draftFuel,
    transmission: draftTransmission,
    version: draftVersion,
    equipment: draftEquipment,
    yearMin: draftYearMin ? Number(draftYearMin) : null,
    yearMax: draftYearMax ? Number(draftYearMax) : null,
    priceMin: draftPriceMin ? Number(draftPriceMin) : null,
    priceMax: draftPriceMax ? Number(draftPriceMax) : null,
    mileageMax: draftMileageMax ? Number(draftMileageMax) : null,
    sort: filters.sort
  });
  let matchingVehicles = $derived(filterListingVehicles(listingVehicles, draftFilters));
  let hasLiveFilters = $derived(Boolean(
    draftQuery || draftMake || draftModel || draftBody || draftCondition || draftFuel || draftTransmission ||
    draftVersion || draftEquipment.length || draftYearMin || draftYearMax || draftPriceMin || draftPriceMax || draftMileageMax
  ));
  let filterDialog = $state<HTMLDialogElement>();
  let dialogSearch = $state<HTMLInputElement>();
  let filtersOpen = $state(false);

  let returnFocus: HTMLButtonElement | undefined;
  const attachFilterDialog: Attachment<HTMLDialogElement> = (node) => {
    filterDialog = node;
    return () => {
      if (filterDialog === node) filterDialog = undefined;
    };
  };

  const attachDialogSearch: Attachment<HTMLInputElement> = (node) => {
    dialogSearch = node;
    return () => {
      if (dialogSearch === node) dialogSearch = undefined;
    };
  };

  const initializeDraft = (current: ListingFilters = filters) => {
    draftQuery = current.q;
    draftMake = current.make;
    draftModel = current.model;
    draftBody = current.body;
    draftCondition = current.condition;
    draftFuel = current.fuel;
    draftTransmission = current.transmission;
    draftVersion = current.version;
    draftEquipment = [...current.equipment];
    draftYearMin = current.yearMin !== null ? String(current.yearMin) : '';
    draftYearMax = current.yearMax !== null ? String(current.yearMax) : '';
    draftPriceMin = current.priceMin !== null ? String(current.priceMin) : '';
    draftPriceMax = current.priceMax !== null ? String(current.priceMax) : '';
    draftMileageMax = current.mileageMax !== null ? String(current.mileageMax) : '';
  };

  const rangeSummary = (min: string, max: string, suffix: string) => min || max ? `${min || '—'} – ${max || '—'}${suffix}` : 'Без ограничение';
  const mobileFields = $derived([
    { field: 'make', label: 'Марка', value: draftMake || 'Всички марки' },
    { field: 'model', label: 'Модел', value: draftModel || 'Всички модели' },
    { field: 'body', label: 'Купе', value: bodyLabel(draftBody) || 'Всички купета' },
    { field: 'price', label: 'Бюджет', value: rangeSummary(draftPriceMin, draftPriceMax, ' €') },
    { field: 'year', label: 'Година', value: rangeSummary(draftYearMin, draftYearMax, '') },
    { field: 'fuel', label: 'Гориво', value: draftFuel || 'Всяко гориво' },
    { field: 'mileage_max', label: 'Пробег', value: draftMileageMax ? `До ${draftMileageMax} км` : 'Без ограничение' },
    { field: 'transmission', label: 'Скорости', value: draftTransmission || 'Всички' },
    { field: 'version', label: 'Версия', value: draftVersion || 'Всички' },
    { field: 'condition', label: 'Състояние', value: draftCondition === 'new' ? 'Нови' : draftCondition === 'used' ? 'Употребявани' : 'Всички' },
    { field: 'equipment', label: 'Екстри', value: draftEquipment.length ? `${draftEquipment.length} избрани` : 'Без предпочитания' }
  ]);

  const resetDraft = () => {
    draftQuery = '';
    draftMake = '';
    draftModel = '';
    draftBody = '';
    draftCondition = '';
    draftFuel = '';
    draftTransmission = '';
    draftVersion = '';
    draftEquipment = [];
    draftYearMin = '';
    draftYearMax = '';
    draftPriceMin = '';
    draftPriceMax = '';
    draftMileageMax = '';
  };

  const openFilters = (event: MouseEvent, field?: string) => {
    returnFocus = event.currentTarget as HTMLButtonElement;
    initializeDraft();
    releaseOffset = preserveScrollOffset('--dn-dialog-scroll-offset');
    filtersOpen = true;
    filterDialog?.showModal();
    requestAnimationFrame(() => {
      const target = field ? filterDialog?.querySelector<HTMLSelectElement>(`select[name="${field}"]`) : dialogSearch;
      target?.focus();
    });
  };

  const closeFilters = () => {
    if (filterDialog?.open) filterDialog.close();
  };

  const handleDialogClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) closeFilters();
  };

  const handleCancel = (event: Event) => {
    event.preventDefault();
    closeFilters();
  };

  const handleSearchKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeFilters();
    }
  };

  const handleDialogSubmit = () => {
    closeFilters();
  };

  const handleClear = () => {
    resetDraft();
    closeFilters();
  };

  const restorePage = () => {
    filtersOpen = false;
    releaseOffset?.();
    if (returnFocus?.isConnected) returnFocus.focus();
  };

  const cleanFormData = (event: FormDataEvent) => {
    for (const key of new Set(event.formData.keys())) {
      const values = event.formData.getAll(key);
      if (values.every((value) => typeof value === 'string' && !value.trim())) event.formData.delete(key);
    }
  };
</script>

{@render children(openFilters, filtersOpen)}

<QuickFilterSheet id="dn-dialog-choice" filters={draftFilters} onApply={initializeDraft} fullScreen>
{#snippet children(openChoice, choiceOpen)}
<dialog
  class="dn-listing-filter__dialog"
  id="dn-listing-filter-dialog"
  aria-labelledby="dn-listing-filter-title"
  {@attach attachFilterDialog}
  onclick={handleDialogClick}
  oncancel={handleCancel}
  onclose={restorePage}
>
  <form
    class="dn-listing-filter__dialog-panel"
    method="GET"
    action={resolve('/listing-grid')}
    onsubmit={handleDialogSubmit}
    onformdata={cleanFormData}
  >
    <header class="dn-listing-filter__dialog-header">
      <h2 id="dn-listing-filter-title">Търсене на автомобили</h2>
      <button class="dn-listing-filter__close" type="button" aria-label="Затвори филтрите" onclick={closeFilters}>
        <Icon name="x" size={22} />
      </button>
    </header>

    <div class="dn-listing-filter__dialog-content">
      <div class="dn-listing-filter__dialog-search" role="search">
        <label class="dn-sr-only" for="dn-listing-dialog-query">Търсене на автомобил</label>
        <Icon name="search" size={20} />
        <input id="dn-listing-dialog-query" {@attach attachDialogSearch} bind:value={draftQuery} onkeydown={handleSearchKeydown} type="search" name="q" placeholder="Марка или модел" autocomplete="off" />
        <button
          class="dn-listing-filter__inline-submit"
          type="submit"
          disabled={matchingVehicles.length === 0 || hasInvalidRange}
          aria-label={matchingVehicles.length === 1 ? 'Покажи 1 автомобил' : `Покажи ${matchingVehicles.length} автомобила`}
        >
          Покажи {matchingVehicles.length}
          <Icon name="arrow-right" size={17} strokeWidth={2} />
        </button>
      </div>

      <div class="dn-mobile-filter-fields">
        {#each mobileFields as item (item.field)}
          <button type="button" aria-haspopup="dialog" aria-controls="dn-dialog-choice" aria-expanded={choiceOpen} onclick={event => openChoice(event, item.field, item.label)}><strong>{item.label}</strong><span>{item.value}</span><Icon name="arrow-right" size={17} /></button>
        {/each}
      </div>
      <div class="dn-listing-filter__filter-groups">
        <div class="dn-listing-filter__core-grid">
          <label>
            <span class="dn-listing-filter__field-label">Марка</span>
            <select name="make" aria-label="Марка" bind:value={draftMake} onchange={() => { draftModel = ''; }}>
              {#each listingFilterOptions.makes as option (option)}
                <option value={option}>{option || 'Марка'}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">Модел</span>
            <select name="model" aria-label="Модел" bind:value={draftModel}>
              {#each draftModelOptions as option (option)}
                <option value={option}>{option || 'Модел'}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">Купе</span>
            <select name="body" aria-label="Купе" bind:value={draftBody}>
              {#each listingFilterOptions.bodies as option (option)}
                <option value={option}>{bodyLabel(option) || 'Купе'}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">Състояние</span>
            <select name="condition" aria-label="Състояние" bind:value={draftCondition}>
              <option value="">Състояние</option>
              <option value="new">Нови</option>
              <option value="used">Употребявани</option>
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">Цена от</span>
            <select name="price_min" aria-label="Цена от" bind:value={draftPriceMin}>
              {#if draftPriceMin && !listingFilterOptions.prices.some(value => value === draftPriceMin)}<option value={draftPriceMin}>{draftPriceMin}</option>{/if}
              {#each listingFilterOptions.prices as option (option)}
                <option value={option}>{option ? `От ${new Intl.NumberFormat('bg-BG').format(Number(option))} €` : 'Цена от'}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">Цена до</span>
            <select name="price_max" aria-label="Цена до" bind:value={draftPriceMax}>
              {#if draftPriceMax && !listingFilterOptions.prices.some(value => value === draftPriceMax)}<option value={draftPriceMax}>{draftPriceMax}</option>{/if}
              {#each listingFilterOptions.prices as option (option)}
                <option value={option}>{option ? `До ${new Intl.NumberFormat('bg-BG').format(Number(option))} €` : 'Цена до'}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">Година от</span>
            <select name="year_min" aria-label="Година от" bind:value={draftYearMin}>
              {#if draftYearMin && !listingFilterOptions.years.some(value => value === draftYearMin)}<option value={draftYearMin}>{draftYearMin}</option>{/if}
              {#each listingFilterOptions.years as option (option)}
                <option value={option}>{option || 'Година от'}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">Година до</span>
            <select name="year_max" aria-label="Година до" bind:value={draftYearMax}>
              {#if draftYearMax && !listingFilterOptions.years.some(value => value === draftYearMax)}<option value={draftYearMax}>{draftYearMax}</option>{/if}
              {#each listingFilterOptions.years as option (option)}
                <option value={option}>{option || 'Година до'}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">Пробег до</span>
            <select name="mileage_max" aria-label="Пробег до" bind:value={draftMileageMax}>
              {#if draftMileageMax && !listingFilterOptions.mileages.some(value => value === draftMileageMax)}<option value={draftMileageMax}>{draftMileageMax}</option>{/if}
              {#each listingFilterOptions.mileages as option (option)}
                <option value={option}>{option ? `До ${new Intl.NumberFormat('bg-BG').format(Number(option))} км` : 'Пробег до'}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">Гориво</span>
            <select name="fuel" aria-label="Гориво" bind:value={draftFuel}>
              {#each listingFilterOptions.fuels as option (option)}
                <option value={option}>{option || 'Гориво'}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">Скоростна кутия</span>
            <select name="transmission" aria-label="Скоростна кутия" bind:value={draftTransmission}>
              {#each listingFilterOptions.transmissions as option (option)}
                <option value={option}>{option || 'Скорости'}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">Пакет или версия</span>
            <select name="version" aria-label="Пакет или версия" bind:value={draftVersion}>
              {#each listingFilterOptions.versions as option (option)}
                <option value={option}>{option || 'Версия'}</option>
              {/each}
            </select>
          </label>
        </div>

        <section class="dn-listing-filter__filter-group dn-listing-filter__filter-group--equipment" aria-labelledby="dn-listing-filter-equipment-title">
          <h3 id="dn-listing-filter-equipment-title">Екстри</h3>
          <div class="dn-listing-filter__equipment-grid">
            {#each listingFilterOptions.equipment as option (option)}
              <label class="dn-listing-filter__equipment-option">
                <input type="checkbox" name="equipment" value={option} bind:group={draftEquipment} />
                <span>{option}</span>
              </label>
            {/each}
          </div>
        </section>
      </div>
    </div>

    <footer class="dn-listing-filter__dialog-footer">
      {#if hasInvalidRange}
        <p class="dn-listing-filter__range-error" role="alert">
          {hasInvalidPriceRange ? 'Минималната цена трябва да е по-ниска от максималната.' : 'Началната година трябва да е преди крайната.'}
        </p>
      {/if}
      {#if hasLiveFilters}<a class="dn-listing-filter__clear" href={resolve('/listing-grid')} onclick={handleClear}>Изчисти</a>{/if}
      <button class="dn-listing-filter__dialog-submit" type="submit" disabled={matchingVehicles.length === 0 || hasInvalidRange} aria-live="polite">
        <span>{matchingVehicles.length === 1 ? 'Покажи 1 автомобил' : `Покажи ${matchingVehicles.length} автомобила`}</span>
        <Icon name="search" size={18} />
      </button>
      <input type="hidden" name="sort" value={filters.sort === 'default' ? '' : filters.sort} />
    </footer>
  </form>
</dialog>
{/snippet}
</QuickFilterSheet>

<style>
  .dn-mobile-filter-fields { display: none; }
  label {
    display: block;
    min-width: 0;
  }
  input[type='search'], select {
    width: 100%;
    height: 52px;
    padding: 0 15px;
    border: 1px solid #dfe2e6;
    border-radius: var(--dn-radius-control);
    outline: 0;
    background: #f5f6f7;
    color: #202329;
    font: 500 16px/24px var(--dn-font);
  }
  input::placeholder {
    color: #737984;
    opacity: 1;
  }
  input:focus, select:focus {
    border-color: #777e88;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(32, 35, 41, 0.12);
  }

  :global(html:has(.dn-listing-filter__dialog[open])) {
    overflow-y: scroll;
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
    background: rgba(8, 10, 14, 0.72);
    backdrop-filter: blur(4px);
  }

  .dn-listing-filter__dialog-panel {
    display: flex;
    max-height: calc(100dvh - 48px);
    flex-direction: column;
  }

  .dn-listing-filter__dialog-header {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 24px 28px 10px;
    background: #fff;
  }

  .dn-listing-filter__dialog-header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 650;
    line-height: 1.2;
    letter-spacing: -0.025em;
  }

  .dn-listing-filter__close {
    display: inline-grid;
    width: 44px;
    height: 44px;
    flex: 0 0 auto;
    margin-left: auto;
    place-items: center;
    padding: 0;
    border: 1px solid #dfe2e6;
    border-radius: var(--dn-radius-button);
    background: #f1f2f4;
    color: #202329;
    cursor: pointer;
  }

  .dn-listing-filter__close:hover,
  .dn-listing-filter__close:focus-visible {
    border-color: #202329;
    background: #e7e9ec;
  }

  .dn-listing-filter__clear {
    color: #555c66;
    font-size: var(--dn-text-body);
    font-weight: 650;
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
    flex: 0 0 60px;
    align-items: center;
    gap: 13px;
    height: 60px;
    margin-bottom: 22px;
    padding: 5px 5px 5px 18px;
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
    font-size: 16px;
  }

  .dn-listing-filter__inline-submit {
    display: inline-flex;
    height: 48px;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 0 24px;
    border: 0;
    border-radius: var(--dn-radius-button);
    background: #202329;
    color: #fff;
    font: 650 14px/20px var(--dn-font);
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

  .dn-listing-filter__filter-groups {
    min-width: 0;
  }

  .dn-listing-filter__core-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    min-width: 0;
  }

  .dn-listing-filter__field-label {
    display: none;
  }

  @media (min-width: 768px) {
    .dn-listing-filter__field-label {
      display: block;
      margin: 0 0 6px 2px;
      color: var(--dn-muted);
      font-size: 12px;
      font-weight: 600;
      line-height: 18px;
    }


  }

  .dn-listing-filter__core-grid select {
    height: 58px;
    padding-inline: 16px;
    border-radius: var(--dn-radius-control);
    font-size: 16px;
  }

  @media (min-width: 768px) {
    .dn-listing-filter__core-grid select { height: 48px; }
  }

  .dn-listing-filter__filter-group--equipment {
    min-width: 0;
    margin-top: 18px;
    padding: 22px;
    border-radius: 14px;
    background: #f5f6f7;
  }

  .dn-listing-filter__filter-group h3 {
    margin: 0;
    color: #202329;
    font-size: 18px;
    font-weight: 650;
    line-height: 1.3;
  }

  .dn-listing-filter__equipment-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
    margin-top: 16px;
  }

  .dn-listing-filter__equipment-option {
    display: flex !important;
    min-height: 48px;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: var(--dn-radius-control);
    background: #fff;
    color: #353a42;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.25;
    cursor: pointer;
    transition: background-color 150ms ease-out, color 150ms ease-out;
  }

  .dn-listing-filter__equipment-option:hover {
    background: #e9ebee;
  }

  .dn-listing-filter__equipment-option:has(input:checked) {
    background: #202329;
    color: #fff;
  }

  .dn-listing-filter__equipment-option:focus-within {
    outline: 3px solid rgba(32, 35, 41, 0.24);
    outline-offset: 2px;
  }

  .dn-listing-filter__equipment-option input {
    width: 18px;
    height: 18px;
    flex: 0 0 auto;
    margin: 0;
    accent-color: var(--dn-red);
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
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
  }

  .dn-listing-filter__dialog-submit {
    display: inline-flex;
    min-width: 230px;
    height: 54px;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 0 28px;
    border: 0;
    border-radius: var(--dn-radius-button);
    background: var(--dn-red);
    color: #fff;
    font: 650 18px/24px var(--dn-font);
    cursor: pointer;
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

  @media (max-width: 991px) {
    .dn-listing-filter__core-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .dn-listing-filter__equipment-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

  }

  @media (max-width: 767px) {
    :global(html:has(.dn-listing-filter__dialog[open])) { overflow: hidden; }
    .dn-listing-filter__inline-submit, .dn-listing-filter__filter-groups { display: none; }
    .dn-mobile-filter-fields { display: grid; gap: 8px; }
    .dn-mobile-filter-fields button { display: flex; align-items: center; gap: 12px; width: 100%; min-height: 52px; padding: 12px 16px; border: 0; border-radius: 14px; background: #f1f2f4; color: #24272c; text-align: left; font: 400 14px/1.4 var(--dn-font); cursor: pointer; }
    .dn-mobile-filter-fields strong { flex: 0 0 auto; font-weight: 650; }
    .dn-mobile-filter-fields span { flex: 1; min-width: 0; text-align: right; color: #656b74; overflow-wrap: anywhere; }
    .dn-mobile-filter-fields :global(svg) { flex: 0 0 17px; color: #656b74; }
    .dn-listing-filter__dialog-submit :global(svg) { display: none; }
    .dn-listing-filter__dialog-footer { flex: 0 0 auto; }
    .dn-listing-filter__clear { white-space: nowrap; }

    .dn-listing-filter__dialog {
      width: 100%;
      height: 100dvh;
      max-height: 100dvh;
      inset: 0;
      margin: 0;
      border-radius: 0;
    }

    .dn-listing-filter__dialog-panel {
      height: 100%;
      max-height: none;
    }

    .dn-listing-filter__dialog-header {
      position: relative;
      align-items: center;
      padding: max(12px, env(safe-area-inset-top)) 16px 10px;
    }

    .dn-listing-filter__dialog-header h2 {
      font-size: var(--dn-text-card);
    }

    .dn-listing-filter__dialog-content {
      flex: 1;
      padding: 18px 16px 24px;
    }

    .dn-listing-filter__dialog-search {
      height: 58px;
      flex-basis: 58px;
      margin-bottom: 16px;
      padding-inline: 16px;
    }

    .dn-listing-filter__dialog-search input[type='search'] {
      font-size: 16px;
    }

    .dn-listing-filter__core-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .dn-listing-filter__core-grid select {
      height: 56px;
    }

    .dn-listing-filter__filter-group--equipment {
      margin-top: 16px;
      padding: 20px;
    }

    .dn-listing-filter__equipment-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .dn-listing-filter__dialog-footer {
      min-height: 84px;
      gap: 16px;
      padding: 14px 16px calc(14px + env(safe-area-inset-bottom));
    }

    .dn-listing-filter__dialog-footer .dn-listing-filter__clear {
      flex: 0 0 auto;
    }

    .dn-listing-filter__dialog-submit {
      white-space: nowrap;
      font-size: 15px;
      min-width: 0;
      flex: 1;
      padding-inline: 16px;
    }

  }
</style>
