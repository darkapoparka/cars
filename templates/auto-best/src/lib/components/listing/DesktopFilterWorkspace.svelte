<script lang="ts">
  import { tick } from 'svelte';
  import { getI18n } from '$lib/locale/context';
  import { specificationLabel } from '$lib/i18n/presentation';
  import { listingFilterOptions, listingModelsForMake, listingParams, removeListingFilter, parseListingFilters } from '$data/listing';
  import { listingFacetTitle, listingFacetOptionLabel, listingAppliedFilterLabel, listingFiltersFromDraft, listingDraftFromFilters, withListingMake, type ListingDraft, type ListingFacetField } from '$data/listing-draft';
  import Icon from '$components/ui/Icon.svelte';
  const i18n = getI18n();
  let { draft = $bindable(), active = $bindable('make') }: { draft: ListingDraft; active?: string } = $props();
  const fields: ListingFacetField[] = ['make', 'model', 'type', 'body', 'price', 'year', 'mileage_max', 'fuel', 'transmission', 'condition', 'version', 'equipment'];
  type Choice = 'type' | 'make' | 'model' | 'body' | 'fuel' | 'transmission' | 'condition' | 'version';
  let panel: HTMLDivElement;
  const models = $derived(listingModelsForMake(draft.make));
  const makes = [...listingFilterOptions.makes].sort((a, b) => a.localeCompare(b, i18n.locale));
  const filters = $derived(listingFiltersFromDraft(draft));
  const chips = $derived([...listingParams(filters)].filter(([key, value]) => value && key !== 'sort').map(([key, value]) => ({ key, value, label: listingAppliedFilterLabel(filters, key, value, i18n.locale) })));
  const options = (field: string): readonly string[] => field === 'type' ? listingFilterOptions.types
    : field === 'make' ? makes : field === 'model' ? models
    : field === 'body' ? listingFilterOptions.bodies : field === 'fuel' ? listingFilterOptions.fuels
    : field === 'transmission' ? listingFilterOptions.transmissions : field === 'condition' ? ['', 'new', 'used'] : listingFilterOptions.versions;
  const selected = (field: ListingFacetField) => field === 'price' ? Boolean(draft.priceMin || draft.priceMax)
    : field === 'year' ? Boolean(draft.yearMin || draft.yearMax) : field === 'mileage_max' ? Boolean(draft.mileageMax)
    : field === 'equipment' ? Boolean(draft.equipment.length) : Boolean(draft[field as Choice]);
  function pick(field: Choice, value: string) { draft = field === 'make' ? withListingMake(draft, value) : { ...draft, [field]: value }; }
  async function browse(field: string) { active = field; await tick(); panel?.scrollTo({ top: 0 }); }
  function navigate(event: KeyboardEvent, index: number) {
    const delta = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    if (!delta && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? fields.length - 1 : (index + delta + fields.length) % fields.length;
    void browse(fields[next]);
    (event.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }
  const ranges = {
    price: [{ field: 'priceMin', label: 'm_94470b41eead' }, { field: 'priceMax', label: 'm_363c4f34635c' }],
    year: [{ field: 'yearMin', label: 'm_349ee8568241' }, { field: 'yearMax', label: 'm_07339ff9faf8' }],
    mileage_max: [{ field: 'mileageMax', label: 'm_5679c2543732' }]
  } as const;
</script>

<div class="dn-desktop-filter-workspace">
  <div class="dn-desktop-filter-workspace__categories" role="tablist" aria-orientation="vertical" aria-label={i18n.t('m_546ebb8eb993')}>
    {#each fields as field, index (field)}
      <button type="button" role="tab" id={'dn-desktop-category-' + field} aria-controls="dn-desktop-filter-panel" aria-selected={active === field} tabindex={active === field ? 0 : -1} onclick={() => browse(field)} onkeydown={event => navigate(event, index)}>
        <span>{listingFacetTitle(field, i18n.locale)}</span>
        {#if selected(field)}<small aria-hidden="true">✓</small>{/if}
      </button>
    {/each}
  </div>
  <div bind:this={panel} class="dn-desktop-filter-workspace__panel" role="tabpanel" id="dn-desktop-filter-panel" aria-labelledby={'dn-desktop-category-' + active} tabindex="0">
    <div class="dn-desktop-filter-workspace__heading">
      <h3>{listingFacetTitle(active as ListingFacetField, i18n.locale)}</h3>
      {#if active === 'model' && draft.make}<span>{draft.make}</span>{/if}
    </div>
    {#if active === 'price' || active === 'year' || active === 'mileage_max'}
      <div class="dn-desktop-filter-workspace__ranges">
        {#each ranges[active] as range (range.field)}
          <label><span>{i18n.t(range.label)}{#if active === 'price'} (€){/if}</span>
            <input type="number" min="0" step="1" inputmode="numeric" placeholder={i18n.t('inventory.range.unlimited')} value={draft[range.field]} oninput={event => draft = { ...draft, [range.field]: event.currentTarget.value }} />
          </label>
        {/each}
      </div>
    {:else if active === 'equipment'}
      <div class="dn-desktop-filter-workspace__options">
        {#each listingFilterOptions.equipment as option (option)}
          <button type="button" aria-pressed={draft.equipment.includes(option)} onclick={() => draft = { ...draft, equipment: draft.equipment.includes(option) ? draft.equipment.filter(value => value !== option) : [...draft.equipment, option] }}>
            <span>{specificationLabel(option, i18n.locale)}</span><span class="dn-desktop-filter-workspace__check" aria-hidden="true">{draft.equipment.includes(option) ? '✓' : '+'}</span>
          </button>
        {/each}
      </div>
    {:else}
      <div class="dn-desktop-filter-workspace__options">
        {#each options(active) as option (option)}
          <button type="button" aria-pressed={draft[active as Choice] === option} onclick={() => pick(active as Choice, option)}>
            <span>{option ? listingFacetOptionLabel(active as Choice, option, i18n.locale) : i18n.t('m_a52ace420f21')}</span><span class="dn-desktop-filter-workspace__check" aria-hidden="true">{draft[active as Choice] === option ? '✓' : ''}</span>
          </button>
        {/each}
      </div>
      {#if active === 'make' && draft.make}
        <button class="dn-desktop-filter-workspace__next" type="button" onclick={() => browse('model')}>{listingFacetTitle('model', i18n.locale)} · {draft.make}<Icon name="arrow-right" size={18} /></button>
      {/if}
    {/if}
  </div>
  <div class="dn-desktop-filter-workspace__selection" aria-label={i18n.t('m_546ebb8eb993')}>
    {#each chips as chip (`${chip.key}-${chip.value}`)}
      <button type="button" aria-label={i18n.t('m_ef5e8d630d53', { p0: chip.label })} onclick={() => draft = listingDraftFromFilters(parseListingFilters(removeListingFilter(filters, chip.key, chip.value)))}>{chip.label}<Icon name="x" size={14} /></button>
    {/each}
  </div>
</div>

<style>
  .dn-desktop-filter-workspace { display: none; }
  @media (min-width: 992px) {
    .dn-desktop-filter-workspace { display: grid; grid-template-columns: 196px minmax(0,1fr); grid-template-rows: minmax(0,1fr) auto; flex: 1; min-height: 0; border-top: 1px solid var(--dn-line); }
    .dn-desktop-filter-workspace__categories { display: flex; flex-direction: column; min-height: 0; padding: var(--dn-space-2) var(--dn-space-3) var(--dn-space-2) 0; overflow-y: auto; border-right: 1px solid var(--dn-line); }
    .dn-desktop-filter-workspace__categories button { display: flex; align-items: center; justify-content: space-between; gap: var(--dn-space-2); flex-shrink: 0; min-height: 36px; padding: var(--dn-space-2) var(--dn-space-3); border: 0; border-radius: var(--dn-radius-control); background: transparent; color: var(--dn-muted); font: var(--dn-control-font); text-align: left; cursor: pointer; }
    .dn-desktop-filter-workspace__categories button:hover { background: var(--dn-surface-subtle); color: var(--dn-ink); }
    .dn-desktop-filter-workspace__categories button[aria-selected='true'] { background: var(--dn-ink); color: var(--dn-white); }
    .dn-desktop-filter-workspace__categories small { flex-shrink: 0; font-size: var(--dn-text-meta); opacity: .8; }
    .dn-desktop-filter-workspace__panel { min-width: 0; min-height: 0; padding: var(--dn-space-6); overflow-y: auto; }
    .dn-desktop-filter-workspace__heading { display: flex; align-items: baseline; gap: var(--dn-space-3); margin-bottom: var(--dn-space-6); }
    h3 { margin: 0; font-size: var(--dn-text-lead); font-weight: var(--dn-weight-semibold); }
    .dn-desktop-filter-workspace__heading > span { color: var(--dn-muted); font: var(--dn-control-font); }
    .dn-desktop-filter-workspace__options { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: var(--dn-space-3); }
    .dn-desktop-filter-workspace__options button { display: flex; align-items: center; justify-content: space-between; gap: var(--dn-space-3); min-height: 64px; padding: var(--dn-space-4); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-control); background: var(--dn-surface-subtle); color: var(--dn-ink); font: var(--dn-control-font); text-align: left; cursor: pointer; }
    .dn-desktop-filter-workspace__options button:hover { background: var(--dn-surface-hover); }
    .dn-desktop-filter-workspace__options button[aria-pressed='true'] { border-color: var(--dn-ink); background: var(--dn-white); }
    .dn-desktop-filter-workspace__check { flex: 0 0 16px; }
    .dn-desktop-filter-workspace__next { display: inline-flex; align-items: center; gap: var(--dn-space-3); margin-top: var(--dn-space-6); min-height: var(--dn-control-height-default); padding: var(--dn-space-2) var(--dn-space-4); border: 1px solid var(--dn-line); border-radius: var(--dn-pill); background: var(--dn-white); color: var(--dn-ink); font: var(--dn-control-font); cursor: pointer; }
    .dn-desktop-filter-workspace__ranges { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: var(--dn-space-4); }
    .dn-desktop-filter-workspace__ranges label { display: grid; gap: var(--dn-space-2); font: var(--dn-control-font); color: var(--dn-muted); }
    .dn-desktop-filter-workspace__ranges input { min-width: 0; width: 100%; height: 52px; padding: 0 var(--dn-space-4); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-control); background: var(--dn-surface-subtle); color: var(--dn-ink); font: var(--dn-entry-font); }
    .dn-desktop-filter-workspace__selection { grid-column: 1 / -1; display: flex; align-items: center; flex-wrap: wrap; gap: var(--dn-space-2); min-height: 52px; max-height: 96px; overflow-y: auto; padding: var(--dn-space-2) 0; border-top: 1px solid var(--dn-line); }
    .dn-desktop-filter-workspace__selection button { display: inline-flex; align-items: center; gap: var(--dn-space-2); min-height: 32px; padding: var(--dn-space-1) var(--dn-space-3); border: 0; border-radius: var(--dn-pill); background: var(--dn-surface-subtle); color: var(--dn-ink); font: var(--dn-control-font); cursor: pointer; }
    button:focus-visible, input:focus-visible, .dn-desktop-filter-workspace__panel:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  }
  @media (min-width: 992px) and (max-width: 1199px) {
    .dn-desktop-filter-workspace__options { grid-template-columns: repeat(2,minmax(0,1fr)); }
    .dn-desktop-filter-workspace__panel { padding: var(--dn-space-4); }
  }
</style>
