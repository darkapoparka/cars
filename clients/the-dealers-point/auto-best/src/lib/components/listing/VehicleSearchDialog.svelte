<script lang="ts">
  import { preserveScrollOffset } from '$lib/ui/overlay';
  import { onDestroy, type Snippet } from 'svelte';
  import { resolve } from '$app/paths';
  import {
    bodyLabel,
    filterListingVehicles,
    listingFilterOptions,
    listingModelsForMake,
    listingVehicles,
    type ListingFilters
  } from '$data/listing';
  import {
    cleanListingFormData,
    emptyListingDraft,
    listingDraftFromFilters,
    listingDraftHasFilters,
    listingFacetSummary,
    listingFiltersFromDraft,
    withListingMake,
    type ListingDraft,
    type ListingFacetField
  } from '$data/listing-draft';
  import Icon from '$components/ui/Icon.svelte';
  import QuickFilterSheet from './QuickFilterSheet.svelte';
  import type { Attachment } from 'svelte/attachments';

  let { filters, children }: { filters: ListingFilters; children: Snippet<[(event: MouseEvent, field?: string) => void, boolean]> } = $props();
  let releaseOffset: ((restoreScroll?: boolean) => void) | undefined;
  onDestroy(() => releaseOffset?.(false));

  let draft = $state<ListingDraft>(emptyListingDraft());
  let draftFilters = $derived(listingFiltersFromDraft(draft));
  let matchingVehicles = $derived(filterListingVehicles(listingVehicles, draftFilters));
  let hasLiveFilters = $derived(listingDraftHasFilters(draft));
  let hasInvalidPriceRange = $derived(Boolean(draft.priceMin && draft.priceMax && Number(draft.priceMin) > Number(draft.priceMax)));
  let hasInvalidYearRange = $derived(Boolean(draft.yearMin && draft.yearMax && Number(draft.yearMin) > Number(draft.yearMax)));
  let hasInvalidRange = $derived(hasInvalidPriceRange || hasInvalidYearRange);
  let modelOptions = $derived(listingModelsForMake(draft.make));
  let filterDialog = $state<HTMLDialogElement>();
  let dialogSearch = $state<HTMLInputElement>();
  let filtersOpen = $state(false);
  let returnFocus: HTMLButtonElement | undefined;

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

  const mobileFieldDefinitions = [
    { field: 'make', label: 'Марка' },
    { field: 'model', label: 'Модел' },
    { field: 'body', label: 'Купе' },
    { field: 'price', label: 'Бюджет' },
    { field: 'year', label: 'Година' },
    { field: 'fuel', label: 'Гориво' },
    { field: 'mileage_max', label: 'Пробег' },
    { field: 'transmission', label: 'Скорости' },
    { field: 'version', label: 'Версия' },
    { field: 'condition', label: 'Състояние' },
    { field: 'equipment', label: 'Екстри' }
  ] satisfies readonly { field: ListingFacetField; label: string }[];
  let mobileFields = $derived(mobileFieldDefinitions.map(item => ({
    ...item,
    value: listingFacetSummary(item.field, draft)
  })));

  const resetDraft = () => { draft = emptyListingDraft(filters.sort); };

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
  const closeFilters = () => { if (filterDialog?.open) filterDialog.close(); };
  const handleDialogClick = (event: MouseEvent) => { if (event.target === event.currentTarget) closeFilters(); };
  const handleCancel = (event: Event) => { event.preventDefault(); closeFilters(); };
  const handleSearchKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') { event.preventDefault(); closeFilters(); }
  };
  const handleDialogSubmit = () => { closeFilters(); };
  const handleClear = () => { resetDraft(); closeFilters(); };
  const restorePage = () => {
    filtersOpen = false;
    releaseOffset?.();
    const target = returnFocus;
    let attempts = 0;
    const restoreFocus = () => {
      if (target?.isConnected) {
        target.focus({ preventScroll: true });
        if (target.matches(':focus')) return;
      }
      if (attempts++ < 60) requestAnimationFrame(restoreFocus);
    };
    setTimeout(() => requestAnimationFrame(restoreFocus), 0);
  };
  const cleanFormData = (event: FormDataEvent) => cleanListingFormData(event.formData);
</script>

{@render children(openFilters, filtersOpen)}

<QuickFilterSheet mode="draft" id="dn-dialog-choice" filters={draftFilters} onApply={initializeDraft} fullScreen>
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
        <input id="dn-listing-dialog-query" {@attach attachDialogSearch} bind:value={draft.q} onkeydown={handleSearchKeydown} type="search" name="q" placeholder="Марка или модел" autocomplete="off" />
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
            <select name="make" aria-label="Марка" value={draft.make} onchange={(event) => { draft = withListingMake(draft, event.currentTarget.value); }}>
              {#each listingFilterOptions.makes as option (option)}
                <option value={option}>{option || 'Марка'}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">Модел</span>
            <select name="model" aria-label="Модел" bind:value={draft.model}>
              {#each modelOptions as option (option)}
                <option value={option}>{option || 'Модел'}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">Купе</span>
            <select name="body" aria-label="Купе" bind:value={draft.body}>
              {#each listingFilterOptions.bodies as option (option)}
                <option value={option}>{bodyLabel(option) || 'Купе'}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">Състояние</span>
            <select name="condition" aria-label="Състояние" bind:value={draft.condition}>
              <option value="">Състояние</option>
              <option value="new">Нови</option>
              <option value="used">Употребявани</option>
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">Цена от</span>
            <select name="price_min" aria-label="Цена от" bind:value={draft.priceMin}>
              {#if draft.priceMin && !listingFilterOptions.prices.some(value => value === draft.priceMin)}<option value={draft.priceMin}>{draft.priceMin}</option>{/if}
              {#each listingFilterOptions.prices as option (option)}
                <option value={option}>{option ? `От ${new Intl.NumberFormat('bg-BG').format(Number(option))} €` : 'Цена от'}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">Цена до</span>
            <select name="price_max" aria-label="Цена до" bind:value={draft.priceMax}>
              {#if draft.priceMax && !listingFilterOptions.prices.some(value => value === draft.priceMax)}<option value={draft.priceMax}>{draft.priceMax}</option>{/if}
              {#each listingFilterOptions.prices as option (option)}
                <option value={option}>{option ? `До ${new Intl.NumberFormat('bg-BG').format(Number(option))} €` : 'Цена до'}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">Година от</span>
            <select name="year_min" aria-label="Година от" bind:value={draft.yearMin}>
              {#if draft.yearMin && !listingFilterOptions.years.some(value => value === draft.yearMin)}<option value={draft.yearMin}>{draft.yearMin}</option>{/if}
              {#each listingFilterOptions.years as option (option)}
                <option value={option}>{option || 'Година от'}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">Година до</span>
            <select name="year_max" aria-label="Година до" bind:value={draft.yearMax}>
              {#if draft.yearMax && !listingFilterOptions.years.some(value => value === draft.yearMax)}<option value={draft.yearMax}>{draft.yearMax}</option>{/if}
              {#each listingFilterOptions.years as option (option)}
                <option value={option}>{option || 'Година до'}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">Пробег до</span>
            <select name="mileage_max" aria-label="Пробег до" bind:value={draft.mileageMax}>
              {#if draft.mileageMax && !listingFilterOptions.mileages.some(value => value === draft.mileageMax)}<option value={draft.mileageMax}>{draft.mileageMax}</option>{/if}
              {#each listingFilterOptions.mileages as option (option)}
                <option value={option}>{option ? `До ${new Intl.NumberFormat('bg-BG').format(Number(option))} км` : 'Пробег до'}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">Гориво</span>
            <select name="fuel" aria-label="Гориво" bind:value={draft.fuel}>
              {#each listingFilterOptions.fuels as option (option)}
                <option value={option}>{option || 'Гориво'}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">Скоростна кутия</span>
            <select name="transmission" aria-label="Скоростна кутия" bind:value={draft.transmission}>
              {#each listingFilterOptions.transmissions as option (option)}
                <option value={option}>{option || 'Скорости'}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">Пакет или версия</span>
            <select name="version" aria-label="Пакет или версия" bind:value={draft.version}>
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
                <input type="checkbox" name="equipment" value={option} bind:group={draft.equipment} />
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
    font: var(--dn-body-font);
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
    font-size: var(--dn-text-subheading);
    font-weight: var(--dn-weight-semibold);
    line-height: var(--dn-leading-heading);
    letter-spacing: var(--dn-tracking-heading);
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
    font-weight: var(--dn-weight-semibold);
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
    font-size: var(--dn-control-size);
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
    font: var(--dn-control-font);
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
      font-size: var(--dn-text-meta);
      font-weight: var(--dn-weight-semibold);
      line-height: var(--dn-leading-meta);
    }


  }

  .dn-listing-filter__core-grid select {
    height: 58px;
    padding-inline: 16px;
    border-radius: var(--dn-radius-control);
    font-size: var(--dn-control-size);
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
    font-size: var(--dn-text-lead);
    font-weight: var(--dn-weight-semibold);
    line-height: var(--dn-leading-control);
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
    font-size: var(--dn-text-meta);
    font-weight: var(--dn-weight-semibold);
    line-height: var(--dn-leading-heading);
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
    font-size: var(--dn-text-meta);
    font-weight: var(--dn-weight-semibold);
    line-height: var(--dn-leading-meta);
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
    .dn-mobile-filter-fields button { display: flex; align-items: center; gap: 12px; width: 100%; min-height: 52px; padding: 12px 16px; border: 0; border-radius: 14px; background: #f1f2f4; color: #24272c; text-align: left; font: var(--dn-control-font); cursor: pointer; }
    .dn-mobile-filter-fields strong { flex: 0 0 auto; font-weight: var(--dn-weight-semibold); }
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
      font-size: var(--dn-control-size);
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
      min-width: 0;
      flex: 1;
      padding-inline: 16px;
      font: var(--dn-cta-font);
    }

  }
</style>
