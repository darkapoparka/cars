<script lang="ts">
  import { containDialogTab } from '$lib/locale/focus';
  import { specificationLabel } from '$lib/i18n/presentation';

  import { getI18n } from '$lib/locale/context';
  import { templateMessage } from '$lib/i18n/presentation';
  const i18n = getI18n();

  import { preserveScrollOffset } from '$lib/ui/overlay';
  import { onDestroy, tick, type Snippet } from 'svelte';
  import { formatPrice } from '$lib/locale/core';
  import { resolve } from '$app/paths';
  import {
    bodyLabel,
    filterListingVehicles,
    listingFilterOptions,
    listingTypeCount,
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
    listingFacetOptionLabel,
    listingFacetTitle,
    listingFiltersFromDraft,
    withListingMake,
    type ListingDraft,
    type ListingFacetField
  } from '$data/listing-draft';
  import Icon from '$components/ui/Icon.svelte';
  import QuickFilterSheet from './QuickFilterSheet.svelte';
  import DesktopFilterPicker from './DesktopFilterPicker.svelte';
  import type { Attachment } from 'svelte/attachments';

  let { filters, children, desktopPickers = false }: { filters: ListingFilters; desktopPickers?: boolean; children: Snippet<[(event: MouseEvent, field?: string) => void, boolean]> } = $props();
  let releaseOffset: ((restoreScroll?: boolean) => void) | undefined;
  onDestroy(() => releaseOffset?.(false));

  let draft = $state<ListingDraft>(emptyListingDraft());
  let draftFilters = $derived(listingFiltersFromDraft(draft));
  let matchingVehicles = $derived(filterListingVehicles(listingVehicles, draftFilters, i18n.locale));
  let hasLiveFilters = $derived(listingDraftHasFilters(draft));
  let hasInvalidPriceRange = $derived(Boolean(draft.priceMin && draft.priceMax && Number(draft.priceMin) > Number(draft.priceMax)));
  let hasInvalidYearRange = $derived(Boolean(draft.yearMin && draft.yearMax && Number(draft.yearMin) > Number(draft.yearMax)));
  let hasInvalidRange = $derived(hasInvalidPriceRange || hasInvalidYearRange);
  let modelOptions = $derived(listingModelsForMake(draft.make));
  let filterDialog = $state<HTMLDialogElement>();
  let dialogSearch = $state<HTMLInputElement>();
  let filtersOpen = $state(false);
  let activeChoice = $state<string>();
  type DesktopField = Exclude<ListingFacetField, 'sort'>;
  let desktopChoice = $state<DesktopField>();
  let desktopMatches = $state(false);
  const desktopMode = $derived(desktopPickers && desktopMatches);
  let pickerTrigger: HTMLButtonElement | undefined;
  let pickerFocusField = '';
  let returnFocus: HTMLButtonElement | undefined;

  const attachFilterDialog: Attachment<HTMLDialogElement> = (node) => {
    filterDialog = node;
    const media = window.matchMedia('(min-width: 992px)');
    const update = () => { desktopMatches = media.matches; if (!media.matches) desktopChoice = undefined; };
    update();
    media.addEventListener('change', update);
    return () => { media.removeEventListener('change', update); if (filterDialog === node) filterDialog = undefined; };
  };
  const attachDialogSearch: Attachment<HTMLInputElement> = (node) => {
    dialogSearch = node;
    return () => { if (dialogSearch === node) dialogSearch = undefined; };
  };

  const initializeDraft = (current: ListingFilters = filters) => {
    draft = listingDraftFromFilters(current);
  };

  const mobileFieldDefinitions = [
    { field: 'type', label: 'Vehicle type' },
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
  let mobileFields = $derived(mobileFieldDefinitions.map(item => {
    const active = item.field === 'price' ? Boolean(draft.priceMin || draft.priceMax)
      : item.field === 'year' ? Boolean(draft.yearMin || draft.yearMax)
      : item.field === 'mileage_max' ? Boolean(draft.mileageMax)
      : item.field === 'equipment' ? draft.equipment.length > 0
      : Boolean(draft[item.field]);
    const range = item.field === 'price' || item.field === 'year' || item.field === 'mileage_max';
    return {
      ...item,
      active,
      value: active || item.field === 'equipment' ? listingFacetSummary(item.field, draft, i18n.locale)
        : i18n.t(range ? 'inventory.range.unlimited' : 'm_a52ace420f21')
    };
  }));

  const resetDraft = () => { draft = emptyListingDraft(filters.sort); };

  const desktopFields = [
    { key: 'type', field: 'type', title: 'inventory.facet.type' },
    { key: 'make', field: 'make', title: 'm_ccdd25d4230f' },
    { key: 'model', field: 'model', title: 'm_5e2c614c23f0' },
    { key: 'body', field: 'body', title: 'm_191c24bf12d5' },
    { key: 'condition', field: 'condition', title: 'm_39b36d38d6eb' },
    { key: 'price_min', field: 'price', title: 'm_94470b41eead' },
    { key: 'price_max', field: 'price', title: 'm_363c4f34635c' },
    { key: 'year_min', field: 'year', title: 'm_349ee8568241' },
    { key: 'year_max', field: 'year', title: 'm_07339ff9faf8' },
    { key: 'mileage_max', field: 'mileage_max', title: 'm_5679c2543732' },
    { key: 'fuel', field: 'fuel', title: 'm_a80f942f4112' },
    { key: 'transmission', field: 'transmission', title: 'm_3e10134259ab' },
    { key: 'version', field: 'version', title: 'm_1f46b4649491' }
  ] as const;
  function desktopValue(key: string, field: DesktopField) {
    if (key === 'price_min') return draft.priceMin ? formatPrice(Number(draft.priceMin), i18n.locale) : i18n.t('inventory.range.unlimited');
    if (key === 'price_max') return draft.priceMax ? formatPrice(Number(draft.priceMax), i18n.locale) : i18n.t('inventory.range.unlimited');
    if (key === 'year_min') return draft.yearMin || i18n.t('inventory.range.unlimited');
    if (key === 'year_max') return draft.yearMax || i18n.t('inventory.range.unlimited');
    return listingFacetSummary(field, draft, i18n.locale);
  }
  function resolveDesktopField(field?: string): DesktopField | undefined {
    if (!field) return undefined;
    if (field.startsWith('price')) return 'price';
    if (field.startsWith('year')) return 'year';
    return desktopFields.find(item => item.field === field)?.field;
  }
  async function focusDesktopPicker() {
    await tick();
    const rangeInputs = filterDialog?.querySelectorAll<HTMLInputElement>('.picker .range input');
    const target = pickerFocusField.endsWith('_min') || pickerFocusField.endsWith('_max')
      ? rangeInputs?.[pickerFocusField.endsWith('_max') ? 1 : 0]
      : filterDialog?.querySelector<HTMLElement>('[data-picker-initial]');
    target?.focus({ preventScroll: true });
  }
  function selectDesktopField(field: DesktopField) {
    desktopChoice = field;
    pickerFocusField = '';
    const content = filterDialog?.querySelector<HTMLDivElement>('.dn-listing-filter__dialog-content');
    if (content) content.scrollTop = 0;
  }
  function openDesktopChoice(event: MouseEvent, field: DesktopField, key: string) {
    pickerTrigger = event.currentTarget as HTMLButtonElement;
    pickerFocusField = key;
    desktopChoice = field;
    void focusDesktopPicker();
  }
  async function backToDesktopFilters() {
    const field = desktopChoice;
    desktopChoice = undefined;
    await tick();
    const content = filterDialog?.querySelector<HTMLDivElement>('.dn-listing-filter__dialog-content');
    if (content) content.scrollTop = 0;
    const target = pickerTrigger?.isConnected ? pickerTrigger : filterDialog?.querySelector<HTMLButtonElement>(`[data-desktop-field="${field}"]`);
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: 'nearest' });
  }

  const openFilters = (event: MouseEvent, field?: string) => {
    returnFocus = event.currentTarget as HTMLButtonElement;
    initializeDraft();
    pickerTrigger = desktopMode && field ? filterDialog?.querySelector<HTMLButtonElement>(`[data-desktop-key="${field}"]`) ?? undefined : undefined;
    pickerFocusField = field ?? '';
    desktopChoice = desktopMode ? resolveDesktopField(field) : undefined;
    releaseOffset = preserveScrollOffset('--dn-dialog-scroll-offset');
    filtersOpen = true;
    filterDialog?.showModal();
    const content = filterDialog?.querySelector<HTMLDivElement>('.dn-listing-filter__dialog-content');
    if (desktopMode && content) content.scrollTop = 0;
    requestAnimationFrame(() => {
      if (desktopMode && desktopChoice) { void focusDesktopPicker(); return; }
      const compact = window.matchMedia('(max-width: 767px)').matches;
      const target = field
        ? filterDialog?.querySelector<HTMLSelectElement>(`select[name="${field}"]`)
        : compact
          ? filterDialog?.querySelector<HTMLElement>('#dn-listing-filter-title')
          : dialogSearch;
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
  const handleClear = (event: MouseEvent) => {
    if (desktopMode) { event.preventDefault(); resetDraft(); void tick().then(() => desktopChoice ? focusDesktopPicker() : dialogSearch?.focus()); }
    else { resetDraft(); closeFilters(); }
  };
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
  const cleanFormData = (event: FormDataEvent) => { event.formData.delete('dn-picker-choice'); cleanListingFormData(event.formData); };
</script>

{@render children(openFilters, filtersOpen)}

<QuickFilterSheet mode="draft" id="dn-dialog-choice" filters={draftFilters} onApply={initializeDraft} fullScreen>
{#snippet children(openChoice, choiceOpen)}
<dialog onkeydown={(event) => containDialogTab(event, event.currentTarget)}
  class="dn-listing-filter__dialog"
  class:dn-listing-filter__dialog--desktop={desktopMode}
  class:dn-listing-filter__dialog--picker={desktopMode && Boolean(desktopChoice)}
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
    action={i18n.href(resolve('/listing-grid'))}
    onsubmit={handleDialogSubmit}
    onformdata={cleanFormData}
  >
    <header class="dn-listing-filter__dialog-header dn-mobile-overlay-header">
      {#if desktopMode && desktopChoice}
        <button class="dn-listing-filter__back" type="button" aria-label={i18n.t('m_a779c56e526e')} onclick={backToDesktopFilters}><Icon name="arrow-left" size={18} />{i18n.t('m_76900f1bfd16')}</button>
      {/if}
      <h2 id="dn-listing-filter-title" tabindex="-1" data-picker-initial={desktopMode && desktopChoice && desktopChoice !== 'make' && desktopChoice !== 'model' ? true : undefined}><span class="dn-listing-filter__title-desktop">{desktopMode && desktopChoice ? listingFacetTitle(desktopChoice, i18n.locale) : i18n.t("m_32729e44de2d")}</span><span class="dn-listing-filter__title-mobile">{i18n.t("m_546ebb8eb993")}</span></h2>
      <button class="dn-listing-filter__close dn-icon-button dn-overlay-close" type="button" aria-label={i18n.t("m_2b3fff4a027c")} onclick={closeFilters}>
        <Icon name="x" />
      </button>
    </header>

    <div class="dn-listing-filter__dialog-content">
      <div class="dn-listing-filter__dialog-search dn-mobile-overlay-search" class:dn-listing-filter__dialog-search--hidden={desktopMode && Boolean(desktopChoice)} role="search">
        <label class="dn-sr-only" for="dn-listing-dialog-query">{i18n.t("m_0ae7a3ecbc83")}</label>
        <Icon name="search" size={18} />
        <input {@attach i18n.validation} id="dn-listing-dialog-query" {@attach attachDialogSearch} bind:value={draft.q} onkeydown={handleSearchKeydown} type="search" name="q" placeholder={i18n.t("m_cb8bed4ff8b8")} autocomplete="off" />
        <button
          class="dn-listing-filter__inline-submit"
          type="submit"
          disabled={matchingVehicles.length === 0 || hasInvalidRange}
          aria-label={matchingVehicles.length === 1 ? i18n.t("m_047e325f6562") : i18n.t("m_08d2ff28407e", { p0: matchingVehicles.length })}
        >
          {templateMessage(i18n, "Show {p0}", { p0: matchingVehicles.length })}
          <Icon name="arrow-right" size={18} strokeWidth={2} />
        </button>
      </div>

      <div class="dn-mobile-filter-fields">
        {#each mobileFields as item (item.field)}
          <button class="dn-mobile-overlay-row" type="button" aria-haspopup="dialog" aria-controls="dn-dialog-choice" aria-expanded={choiceOpen && activeChoice === item.field} onclick={event => { activeChoice = item.field; openChoice(event, item.field, item.label); }}><strong>{listingFacetTitle(item.field, i18n.locale)}</strong><span data-active={item.active}>{item.value}</span><Icon name="arrow-right" size={18} /></button>
        {/each}
      </div>
      {#if desktopMode && desktopChoice}
        <DesktopFilterPicker field={desktopChoice} bind:draft onFieldChange={selectDesktopField} />
      {/if}
      <div class="dn-listing-filter__filter-groups" class:dn-listing-filter__filter-groups--hidden={desktopMode && Boolean(desktopChoice)}>
        <div class="dn-listing-filter__core-grid">
          {#if desktopMode}
            {#each desktopFields as item (item.key)}
              <div class="dn-desktop-filter-field">
                <span class="dn-listing-filter__field-label" id={`dn-desktop-label-${item.key}`}>{i18n.t(item.title)}</span>
                <button class="dn-desktop-filter-choice" data-desktop-field={item.field} data-desktop-key={item.key} type="button" aria-labelledby={`dn-desktop-label-${item.key} dn-desktop-value-${item.key}`} onclick={event => openDesktopChoice(event, item.field, item.key)}><span id={`dn-desktop-value-${item.key}`}>{desktopValue(item.key, item.field)}</span><Icon name="arrow-right" size={16} /></button>
              </div>
            {/each}
          {:else}
          <label>
            <span class="dn-listing-filter__field-label">{i18n.t('inventory.facet.type')}</span>
            <select {@attach i18n.validation} name="type" aria-label={i18n.t('inventory.facet.type')} bind:value={draft.type}>
              {#each listingFilterOptions.types as option (option)}
                <option value={option}>{listingFacetOptionLabel('type', option, i18n.locale)} ({listingTypeCount(option)})</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">{i18n.t("m_ccdd25d4230f")}</span>
            <select {@attach i18n.validation} name="make" aria-label={i18n.t("m_ccdd25d4230f")} value={draft.make} onchange={(event) => { draft = withListingMake(draft, event.currentTarget.value); }}>
              {#each listingFilterOptions.makes as option (option)}
                <option value={option}>{option || i18n.t("m_ccdd25d4230f")}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">{i18n.t("m_5e2c614c23f0")}</span>
            <select {@attach i18n.validation} name="model" aria-label={i18n.t("m_5e2c614c23f0")} bind:value={draft.model}>
              {#each modelOptions as option (option)}
                <option value={option}>{option || i18n.t("m_5e2c614c23f0")}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">{i18n.t("m_191c24bf12d5")}</span>
            <select {@attach i18n.validation} name="body" aria-label={i18n.t("m_191c24bf12d5")} bind:value={draft.body}>
              {#each listingFilterOptions.bodies as option (option)}
                <option value={option}>{specificationLabel(bodyLabel(option), i18n.locale) || i18n.t("m_191c24bf12d5")}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">{i18n.t("m_39b36d38d6eb")}</span>
            <select {@attach i18n.validation} name="condition" aria-label={i18n.t("m_39b36d38d6eb")} bind:value={draft.condition}>
              <option value="">{i18n.t("m_39b36d38d6eb")}</option>
              <option value="new">{i18n.t("m_18fdd549b2ed")}</option>
              <option value="used">{i18n.t("m_2b705510e73a")}</option>
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">{i18n.t("m_94470b41eead")}</span>
            <select {@attach i18n.validation} name="price_min" aria-label={i18n.t("m_94470b41eead")} bind:value={draft.priceMin}>
              {#if draft.priceMin && !listingFilterOptions.prices.some(value => value === draft.priceMin)}<option value={draft.priceMin}>{draft.priceMin}</option>{/if}
              {#each listingFilterOptions.prices as option (option)}
                <option value={option}>{option ? i18n.t("m_d7f76d3f0f5a", { p0: new Intl.NumberFormat(i18n.locale).format(Number(option)) }) : i18n.t("m_94470b41eead")}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">{i18n.t("m_363c4f34635c")}</span>
            <select {@attach i18n.validation} name="price_max" aria-label={i18n.t("m_363c4f34635c")} bind:value={draft.priceMax}>
              {#if draft.priceMax && !listingFilterOptions.prices.some(value => value === draft.priceMax)}<option value={draft.priceMax}>{draft.priceMax}</option>{/if}
              {#each listingFilterOptions.prices as option (option)}
                <option value={option}>{option ? i18n.t("m_a04d91558e9c", { p0: new Intl.NumberFormat(i18n.locale).format(Number(option)) }) : i18n.t("m_363c4f34635c")}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">{i18n.t("m_349ee8568241")}</span>
            <select {@attach i18n.validation} name="year_min" aria-label={i18n.t("m_349ee8568241")} bind:value={draft.yearMin}>
              {#if draft.yearMin && !listingFilterOptions.years.some(value => value === draft.yearMin)}<option value={draft.yearMin}>{draft.yearMin}</option>{/if}
              {#each listingFilterOptions.years as option (option)}
                <option value={option}>{option || i18n.t("m_349ee8568241")}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">{i18n.t("m_07339ff9faf8")}</span>
            <select {@attach i18n.validation} name="year_max" aria-label={i18n.t("m_07339ff9faf8")} bind:value={draft.yearMax}>
              {#if draft.yearMax && !listingFilterOptions.years.some(value => value === draft.yearMax)}<option value={draft.yearMax}>{draft.yearMax}</option>{/if}
              {#each listingFilterOptions.years as option (option)}
                <option value={option}>{option || i18n.t("m_07339ff9faf8")}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">{i18n.t("m_5679c2543732")}</span>
            <select {@attach i18n.validation} name="mileage_max" aria-label={i18n.t("m_5679c2543732")} bind:value={draft.mileageMax}>
              {#if draft.mileageMax && !listingFilterOptions.mileages.some(value => value === draft.mileageMax)}<option value={draft.mileageMax}>{draft.mileageMax}</option>{/if}
              {#each listingFilterOptions.mileages as option (option)}
                <option value={option}>{option ? i18n.t("m_243dcf897937", { p0: new Intl.NumberFormat(i18n.locale).format(Number(option)) }) : i18n.t("m_5679c2543732")}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">{i18n.t("m_a80f942f4112")}</span>
            <select {@attach i18n.validation} name="fuel" aria-label={i18n.t("m_a80f942f4112")} bind:value={draft.fuel}>
              {#each listingFilterOptions.fuels as option (option)}
                <option value={option}>{specificationLabel(option, i18n.locale) || i18n.t("m_a80f942f4112")}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">{i18n.t("m_3e10134259ab")}</span>
            <select {@attach i18n.validation} name="transmission" aria-label={i18n.t("m_3e10134259ab")} bind:value={draft.transmission}>
              {#each listingFilterOptions.transmissions as option (option)}
                <option value={option}>{specificationLabel(option, i18n.locale) || i18n.t("m_3e10134259ab")}</option>
              {/each}
            </select>
          </label>
          <label>
            <span class="dn-listing-filter__field-label">{i18n.t("m_1f46b4649491")}</span>
            <select {@attach i18n.validation} name="version" aria-label={i18n.t("m_1f46b4649491")} bind:value={draft.version}>
              {#each listingFilterOptions.versions as option (option)}
                <option value={option}>{option || i18n.t("m_3f19fe84a2de")}</option>
              {/each}
            </select>
          </label>
          {/if}
        </div>

        <section class="dn-listing-filter__filter-group dn-listing-filter__filter-group--equipment" aria-labelledby="dn-listing-filter-equipment-title">
          <h3 id="dn-listing-filter-equipment-title">{i18n.t("m_5697d03daef4")}</h3>
          <div class="dn-listing-filter__equipment-grid">
            {#each listingFilterOptions.equipment as option (option)}
              <label class="dn-listing-filter__equipment-option">
                <input {@attach i18n.validation} type="checkbox" name="equipment" value={option} bind:group={draft.equipment} />
                <span>{specificationLabel(option, i18n.locale)}</span>
              </label>
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
      {#if hasLiveFilters}<a class="dn-listing-filter__clear dn-mobile-overlay-clear" href={i18n.href(resolve('/listing-grid'))} onclick={handleClear}>{i18n.t("action.clearShort")}</a>{/if}
      <button class="dn-listing-filter__dialog-submit dn-mobile-overlay-action" type="submit" disabled={matchingVehicles.length === 0 || hasInvalidRange} aria-live="polite" aria-label={matchingVehicles.length === 1 ? i18n.t("m_047e325f6562") : i18n.t("m_08d2ff28407e", { p0: matchingVehicles.length })}>
        <span class="dn-listing-filter__submit-full">{matchingVehicles.length === 1 ? i18n.t("m_047e325f6562") : i18n.t("m_08d2ff28407e", { p0: matchingVehicles.length })}</span>
        <span class="dn-listing-filter__submit-compact">{i18n.t("action.showCount", { count: matchingVehicles.length })}</span>
        <Icon name="search" size={18} />
      </button>
      {#if desktopMode}
        {#each desktopFields as item (item.key)}
          <input type="hidden" name={item.key} value={item.key === 'price_min' ? draft.priceMin : item.key === 'price_max' ? draft.priceMax : item.key === 'year_min' ? draft.yearMin : item.key === 'year_max' ? draft.yearMax : item.field === 'mileage_max' ? draft.mileageMax : draft[item.field as Exclude<DesktopField, 'price' | 'year' | 'mileage_max' | 'equipment'>]} />
        {/each}
      {/if}
      <input type="hidden" name="sort" value={filters.sort === 'default' ? '' : filters.sort} />
    </footer>
  </form>
</dialog>
{/snippet}
</QuickFilterSheet>

<style>
  .dn-desktop-filter-field { min-width: 0; }
  .dn-desktop-filter-choice { display: flex; width: 100%; min-height: var(--dn-control-height-default); align-items: center; justify-content: space-between; gap: var(--dn-space-2); padding: var(--dn-space-2) var(--dn-space-4); border: 1px solid #dfe2e6; border-radius: var(--dn-radius-control); background: #f5f6f7; color: var(--dn-ink); font: var(--dn-entry-font); text-align: left; cursor: pointer; }
  .dn-desktop-filter-choice span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dn-desktop-filter-choice :global(svg) { flex: 0 0 auto; color: var(--dn-muted); }
  .dn-desktop-filter-choice:hover { background: var(--dn-surface-hover); }
  .dn-desktop-filter-choice:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
  .dn-listing-filter__back { display: inline-flex; align-items: center; gap: var(--dn-space-2); min-height: var(--dn-control-height-default); padding: var(--dn-space-2) var(--dn-space-4); border: 0; border-radius: var(--dn-radius-control); background: var(--dn-surface-subtle); color: var(--dn-ink); font: var(--dn-control-font); cursor: pointer; }
  .dn-listing-filter__back:hover { background: var(--dn-surface-hover); }
  .dn-listing-filter__back:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
  .dn-listing-filter__dialog-content .dn-listing-filter__dialog-search--hidden,
  .dn-listing-filter__filter-groups--hidden { display: none !important; }
  .dn-listing-filter__submit-compact { display: none; }
  .dn-mobile-filter-fields { display: none; }
  label {
    display: block;
    min-width: 0;
  }
  input[type='search'], select {
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
  input:focus, select:focus {
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
  .dn-listing-filter__title-mobile { display: none; }

  .dn-listing-filter__close { margin-left: auto; border: 0; border-radius: var(--dn-radius-button); background: var(--dn-home-panel); color: #202329; }

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
    height: var(--dn-control-height-default);
    padding-inline: var(--dn-space-4);
    border-radius: var(--dn-radius-control);
    font: var(--dn-entry-font);
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
    display: flex !important;
    min-height: var(--dn-control-height-default);
    align-items: center;
    gap: var(--dn-overlay-gap);
    padding: 10px 14px;
    border-radius: var(--dn-radius-control);
    background: #fff;
    color: #353a42;
    font: var(--dn-overlay-option-font);
    cursor: pointer;
    transition: background-color 150ms ease-out, color 150ms ease-out;
  }

  .dn-listing-filter__equipment-option:hover {
    background: #e9ebee;
  }

  .dn-listing-filter__equipment-option:has(input:checked) {
    background: var(--dn-selection-surface);
    color: var(--dn-ink);
    box-shadow: inset 0 0 0 1px var(--dn-selection-line);
  }

  .dn-listing-filter__equipment-option:has(input:focus-visible) {
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
    .dn-listing-filter__dialog--desktop { height: min(720px, calc(100dvh - 64px)); max-height: calc(100dvh - 64px); }
    .dn-listing-filter__dialog--desktop .dn-listing-filter__dialog-panel { height: 100%; max-height: none; }
    .dn-listing-filter__dialog--desktop .dn-listing-filter__dialog-header { display: grid; grid-template-columns: 112px minmax(0, 1fr) 112px; grid-template-areas: 'back title close'; padding: var(--dn-space-6) var(--dn-space-8) var(--dn-space-4); }
    .dn-listing-filter__dialog--desktop .dn-listing-filter__dialog-header h2 { grid-area: title; text-align: center; }
    .dn-listing-filter__dialog--desktop .dn-listing-filter__back { grid-area: back; justify-self: start; }
    .dn-listing-filter__dialog--desktop .dn-listing-filter__close { grid-area: close; justify-self: end; margin-left: 0; }
    .dn-listing-filter__dialog--desktop .dn-listing-filter__dialog-content { flex: 1; scrollbar-gutter: stable; padding: var(--dn-space-4) var(--dn-space-8) var(--dn-space-6); }
    .dn-listing-filter__dialog--desktop .dn-listing-filter__dialog-footer { display: grid; flex: 0 0 92px; grid-template-columns: auto minmax(0, 1fr) auto; gap: var(--dn-space-6); padding: var(--dn-space-4) var(--dn-space-8) var(--dn-space-6); border-top: 1px solid var(--dn-line); }
    .dn-listing-filter__dialog--desktop .dn-listing-filter__clear { grid-column: 1; grid-row: 1; justify-self: start; }
    .dn-listing-filter__dialog--desktop .dn-listing-filter__range-error { grid-column: 2; grid-row: 1; }
    .dn-listing-filter__dialog--desktop .dn-listing-filter__dialog-submit { grid-column: 3; grid-row: 1; height: var(--dn-control-height-prominent); }
  }

  @media (max-width: 991px) {
    .dn-listing-filter__core-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .dn-listing-filter__equipment-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .dn-listing-filter__equipment-option:has(input:checked) {
      background: var(--dn-mobile-selection-surface);
      box-shadow: inset 0 0 0 1px var(--dn-mobile-selection-line);
    }

  }

  @media (max-width: 767px) {
    .dn-listing-filter__title-desktop { display: none; }
    .dn-listing-filter__title-mobile { display: inline; }
    .dn-listing-filter__inline-submit, .dn-listing-filter__filter-groups { display: none; }
    .dn-mobile-filter-fields { display: grid; gap: var(--dn-overlay-gap); }
    .dn-listing-filter__dialog-submit :global(svg),
    .dn-listing-filter__submit-full { display: none; }
    .dn-listing-filter__submit-compact { display: inline; }
    .dn-listing-filter__dialog-footer { flex: 0 0 auto; }
    .dn-listing-filter__clear { display: inline-flex; align-items: center; min-height: var(--dn-overlay-control-height); font: var(--dn-overlay-option-font); white-space: nowrap; }

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

    .dn-listing-filter__dialog-content {
      flex: 1;
      padding: 0 var(--dn-overlay-gutter) var(--dn-space-6);
    }

    .dn-listing-filter__dialog-search {
      height: var(--dn-overlay-control-height);
      flex-basis: var(--dn-overlay-control-height);
      margin-bottom: var(--dn-overlay-gap);
      padding: 0 var(--dn-space-4);
    }

    .dn-listing-filter__dialog-search input[type='search'] {
      font: var(--dn-overlay-field-font);
    }

    .dn-listing-filter__core-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--dn-overlay-gap);
    }

    .dn-listing-filter__core-grid select {
      height: var(--dn-control-height-default);
    }

    .dn-listing-filter__filter-group--equipment {
      margin-top: 16px;
      padding: 20px;
    }

    .dn-listing-filter__equipment-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .dn-listing-filter__dialog-footer {
      gap: var(--dn-space-4);
      padding: var(--dn-space-3) var(--dn-overlay-gutter) calc(var(--dn-space-4) + env(safe-area-inset-bottom));
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
