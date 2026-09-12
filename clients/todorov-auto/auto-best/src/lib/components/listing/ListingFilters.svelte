<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { activeFilterCount as countFilters, bodyLabel, listingParams, listingHiddenFields, removeListingFilter, listingFilterOptions, listingModelsForMake, parseListingFilters, type ListingFilters } from '$data/listing';
  import Icon from '$components/ui/Icon.svelte';
  import MobileNavIcon from '$components/layout/MobileNavIcon.svelte';
  import QuickFilterSheet from './QuickFilterSheet.svelte';
  import VehicleDiscoveryForm from './VehicleDiscoveryForm.svelte';

  interface Props {
    filters: ListingFilters;
    openFilters: (event: MouseEvent, field?: string) => void;
    filtersOpen: boolean;
    onDraftChange: (filters: ListingFilters) => void;
  }

  let { filters, openFilters, filtersOpen, onDraftChange }: Props = $props();

  let activeFilterCount = $derived(countFilters(filters));
  let query = $derived(filters.q);
  let make = $derived(filters.make);
  let model = $derived(filters.model);
  let body = $derived(filters.body);
  let fuel = $derived(filters.fuel);
  let modelOptions = $derived(listingModelsForMake(make));
  const quickFilters = [
    { label: 'Марка', field: 'make' },
    { label: 'Модел', field: 'model' },
    { label: 'Цена', field: 'price' },
    { label: 'Година', field: 'year' },
    { label: 'Купе', field: 'body' },
    { label: 'Гориво', field: 'fuel' },
    { label: 'Скорости', field: 'transmission' },
    { label: 'Пробег', field: 'mileage_max' },
    { label: 'Версия', field: 'version' },
    { label: 'Състояние', field: 'condition' },
    { label: 'Екстри', field: 'equipment' }
  ] as const;
  const activeChips = $derived.by(() => {
    const labels: Record<string, string> = {
      body: bodyLabel(filters.body),
      condition: filters.condition === 'new' ? 'Нови' : 'Употребявани',
      price_min: `От ${filters.priceMin?.toLocaleString('bg-BG')} €`,
      price_max: `До ${filters.priceMax?.toLocaleString('bg-BG')} €`,
      year_min: `От ${filters.yearMin} г.`,
      year_max: `До ${filters.yearMax} г.`,
      mileage_max: `До ${filters.mileageMax?.toLocaleString('bg-BG')} км`
    };
    return [...listingParams(filters).entries()]
      .filter(([key, value]) => value && key !== 'sort' && ['q', 'make', 'model', 'body', 'fuel', 'transmission', 'version', 'condition', 'price_min', 'price_max', 'year_min', 'year_max', 'mileage_max', 'equipment'].includes(key))
      .map(([key, value]) => {
        const params = removeListingFilter(filters, key, value);
        const search = params.toString();
        const href: '/listing-grid' | `/listing-grid?${string}` = search ? `/listing-grid?${search}` : '/listing-grid';
        return { key: `${key}-${value}`, label: labels[key] ?? value, href };
      });
  });

  const primaryHiddenFields = (current: ListingFilters) => listingHiddenFields(current, ['q', 'make', 'model', 'body', 'fuel', 'sort']);

  function updateDraft(event: Event) {
    const form = event.currentTarget as HTMLFormElement;
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(form)) if (typeof value === 'string') params.append(key, value);
    onDraftChange(parseListingFilters(params));
  }

  const cleanFormData = (event: FormDataEvent) => {
    for (const key of new Set(event.formData.keys())) {
      const values = event.formData.getAll(key);
      if (values.every((value) => typeof value === 'string' && !value.trim())) event.formData.delete(key);
    }
  };
</script>

<section class="dn-listing-filter-wrap" aria-label="Филтри за автомобили">
  <div class="container">
    <div class="dn-listing-filter">
      <div class="dn-listing-desktop-discovery"><VehicleDiscoveryForm {filters} {openFilters} {filtersOpen} {onDraftChange} showFilterAction={false} /></div>
      <QuickFilterSheet id="dn-listing-sort-sheet">
      {#snippet children(openSort, sortOpen)}
      <form class="dn-listing-mobile-form" method="GET" action={resolve('/listing-grid')} onformdata={cleanFormData} oninput={updateDraft} onchange={updateDraft}>
        <div class="dn-listing-filter__primary">
        <div class="dn-listing-filter__search-field">
          <MobileNavIcon name="search" size={20} />
          <input class="dn-listing-filter__keyword" type="search" name="q" bind:value={query} aria-label="Търсене на автомобили" placeholder="Марка, модел или ключова дума" />
          <button class="dn-listing-filter__submit" type="submit"><Icon name="search" size={18} /><span>Търсене</span></button>
        </div>
        <button
          class="dn-listing-filter__keyword dn-listing-filter__mobile-keyword"
          type="button"
          aria-haspopup="dialog"
          aria-controls="dn-listing-filter-dialog"
          aria-expanded={filtersOpen}
          aria-label={query ? `Търсене: ${query}. Отворете търсенето на автомобили` : 'Отворете търсенето на автомобили'}
          onclick={(event) => openFilters(event)}
        >
          <MobileNavIcon name="search" size={20} />
          <span class={['dn-listing-filter__keyword-value', { 'dn-listing-filter__keyword-value--empty': !query }]}>{query || 'Марка или модел'}</span>
          <span class="dn-listing-filter__keyword-hint">Търсене по ключова дума <Icon name="arrow-right" size={16} /></span>
        </button>
        <button
          class="dn-listing-filter__toggle"
          type="button"
          aria-haspopup="dialog"
          aria-controls="dn-listing-filter-dialog"
          aria-expanded={filtersOpen}
          aria-label={activeFilterCount ? `Филтри: ${activeFilterCount} ${activeFilterCount === 1 ? 'активен' : 'активни'}` : 'Филтри'}
          title="Филтри"
          onclick={(event) => openFilters(event)}
        >
          <MobileNavIcon name="filters" size={20} />
          <span class="dn-listing-filter__toggle-label">Филтри</span>
          {#if activeFilterCount > 0}<span class="dn-listing-filter__count" aria-hidden="true">{activeFilterCount}</span>{/if}
        </button>
        <button class="dn-listing-filter__mobile-sort" type="button" title="Сортиране"
          aria-label={`Сортиране: ${listingFilterOptions.sorts.find(([value]) => value === filters.sort)?.[1]}`}
          aria-haspopup="dialog" aria-controls="dn-listing-sort-sheet" aria-expanded={sortOpen}
          onclick={(event) => openSort(event, 'sort', 'Сортиране')}>
          <MobileNavIcon name="sort" size={20} />
          {#if filters.sort !== 'default'}<span class="dn-listing-filter__sort-active" aria-hidden="true"></span>{/if}
        </button>
        <input type="hidden" name="sort" value={filters.sort === 'default' ? '' : filters.sort} />
        </div>

        <div class="dn-listing-filter__facets" aria-label="Основни филтри">
        <label>
          <span class="dn-listing-filter__label">Марка</span>
          <select name="make" aria-label="Марка" bind:value={make} onchange={() => { model = ''; }}>
            {#each listingFilterOptions.makes as option (option)}
              <option value={option}>{option || 'Всички'}</option>
            {/each}
          </select>
        </label>
        <label>
          <span class="dn-listing-filter__label">Модел</span>
          <select name="model" aria-label="Модел" bind:value={model}>
            {#each modelOptions as option (option)}
              <option value={option}>{option || 'Всички'}</option>
            {/each}
          </select>
        </label>
        <label>
          <span class="dn-listing-filter__label">Купе</span>
          <select name="body" aria-label="Купе" bind:value={body}>
            {#each listingFilterOptions.bodies as option (option)}
              <option value={option}>{bodyLabel(option) || 'Всички'}</option>
            {/each}
          </select>
        </label>
        <label>
          <span class="dn-listing-filter__label">Гориво</span>
          <select name="fuel" aria-label="Гориво" bind:value={fuel}>
            {#each listingFilterOptions.fuels as option (option)}
              <option value={option}>{option || 'Всички'}</option>
            {/each}
          </select>
        </label>
        </div>
        {#each primaryHiddenFields(filters) as [name, value], index (`${name}-${value}-${index}`)}
          <input type="hidden" {name} {value} />
        {/each}
      </form>
      {/snippet}
      </QuickFilterSheet>

      <div class="dn-listing-filter__quick-row">
      <QuickFilterSheet>
      {#snippet children(openQuick, quickOpen)}
      <nav class={['dn-listing-filter__quick', { 'dn-listing-filter__quick--active': activeChips.length > 0 }]} aria-label="Бързи филтри">
        {#each activeChips as chip (chip.key)}
          <a class="active" href={resolve(chip.href)} aria-label={`Премахни ${chip.label}`}>
            {chip.label}<Icon name="x" size={14} />
          </a>
        {/each}
        {#each quickFilters as item (item.field)}
          <button type="button" aria-haspopup="dialog" aria-controls="dn-quick-filter" aria-expanded={quickOpen} onclick={(event) => openQuick(event, item.field, item.label)}>
            {item.label}<Icon name="chevron-down" size={14} />
          </button>
        {/each}
      </nav>
      {/snippet}
      </QuickFilterSheet>
      </div>

    </div>
  </div>
</section>
