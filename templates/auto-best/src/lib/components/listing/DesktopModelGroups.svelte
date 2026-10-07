<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  import { vehicleCount } from '$lib/locale/messages';
  import { featuredVehicles } from '$data/inventory';
  import { desktopMakeCatalogue } from '$data/desktop-makes';
  import { modelMakes, type ModelMake, type ModelFamily } from '$data/model-catalogue';
  import { listingSelectionHas } from '$data/listing';
  import { listingSuggestionMatcher } from '$data/listing-draft';
  import DesktopFilterChoice from './DesktopFilterChoice.svelte';
  import Icon from '$components/ui/Icon.svelte';

  let { makes, selected, search = '', compact = false, name = 'model', onchange }: {
    makes: readonly string[]; selected: readonly string[]; search?: string; compact?: boolean; name?: string; onchange: (value: string) => void;
  } = $props();
  const i18n = getI18n();
  let expanded = $state(new Map<string, boolean>());
  const matches = $derived(listingSuggestionMatcher(search, i18n.locale));
  const catalogue = $derived(modelMakes(featuredVehicles, makes, selected, desktopMakeCatalogue));
  const groups = $derived(catalogue.map(group => ({ ...group, families: group.families.map(family => ({ ...family,
    choices: family.choices.filter(choice => matches(`${group.make} ${family.name} ${choice.label}`))
  })).filter(family => family.choices.length) })).filter(group => group.families.length));
  const singleMake = $derived(makes.length === 1);
  const total = $derived(catalogue.reduce((count, group) => count + group.count, 0));
  const retained = $derived(selected.filter(value => !catalogue.some(group => group.families.some(family => family.choices.some(choice => listingSelectionHas([choice.value], value))))));
  const familyKey = (make: string, family: string) => `${make}\u0000${family}`;
  const hasSelection = (family: ModelFamily) => family.choices.some(choice => listingSelectionHas(selected, choice.value));
  function toggle(value: string, open: boolean) {
    expanded = new Map(expanded).set(value, !open);
  }
</script>

{#snippet families(group: ModelMake)}
  <div class="families">
    {#each group.families as family (family.name)}
      {@const key = familyKey(group.make, family.name)}
      {@const open = Boolean(search.trim()) || (expanded.get(key) ?? hasSelection(family))}
      {#if family.choices.length === 1 && family.choices[0].label === family.name}
        {@const choice = family.choices[0]}
        <DesktopFilterChoice value={choice.value} label={choice.label} accessibleLabel={choice.label} description={vehicleCount(i18n.locale, choice.count)} checked={listingSelectionHas(selected, choice.value)} multiple tile={!compact} {name} {onchange} />
      {:else}
        <div class="family" class:open data-model-family={family.name}>
          <button type="button" class="disclosure" class:selected={hasSelection(family)} aria-expanded={open} onclick={() => toggle(key, open)}>
            <span class="disclosure-label">{family.name}</span><small>{vehicleCount(i18n.locale, family.count)}</small><span class="chevron" class:expanded={open}><Icon name="chevron-down" size={16} /></span>
          </button>
          {#if open}
            <div class="models" role="group" aria-label={`${group.make} ${family.name}`}>
              {#each family.choices as choice (choice.value)}
                <DesktopFilterChoice value={choice.value} label={choice.label} accessibleLabel={choice.label} description={vehicleCount(i18n.locale, choice.count)} checked={listingSelectionHas(selected, choice.value)} multiple {name} {onchange} />
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    {/each}
  </div>
{/snippet}

<div class="dn-model-groups" class:compact role="group" aria-label={i18n.t('inventory.facet.model')}>
  {#if !search}
    <div class="all-models"><DesktopFilterChoice value="" label={i18n.t('inventory.search.allModels')} accessibleLabel={i18n.t('inventory.search.allModels')} description={vehicleCount(i18n.locale, total)} checked={!selected.length} multiple tile={!compact} {name} {onchange} /></div>
  {/if}
  {#each groups as group (group.make)}
    {#if singleMake}{@render families(group)}
    {:else}
      {@const open = Boolean(search.trim()) || (expanded.get(group.make) ?? group.families.some(hasSelection))}
      <div class="make" class:open data-model-make={group.make}>
        <button type="button" class="disclosure make-title" aria-expanded={open} onclick={() => toggle(group.make, open)}>
          <span class="disclosure-label">{group.make}</span><small>{vehicleCount(i18n.locale, group.count)}</small><span class="chevron" class:expanded={open}><Icon name="chevron-down" size={16} /></span>
        </button>
        {#if open}{@render families(group)}{/if}
      </div>
    {/if}
  {/each}
  {#each retained.filter(matches) as value (value)}
    <DesktopFilterChoice {value} label={value} accessibleLabel={value} description={vehicleCount(i18n.locale, 0)} checked multiple tile={!compact} {name} {onchange} />
  {/each}
  {#if !groups.length}<p class="empty" role="status">{i18n.t('inventory.search.empty')}</p>{/if}
</div>

<style>
  .dn-model-groups, .families { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--dn-space-2); min-width: 0; }
  .all-models, .families, .make.open, .empty { grid-column: 1 / -1; }
  .all-models { width: calc(50% - var(--dn-space-1)); }
  .family, .make { min-width: 0; }
  .family.open { grid-column: 1 / -1; }
  .disclosure { display: flex; align-items: center; gap: var(--dn-space-2); width: 100%; min-width: 0; min-height: var(--dn-control-height-default); padding: var(--dn-space-2) var(--dn-space-3); border: 0; border-radius: var(--dn-radius-control); background: var(--dn-surface-subtle); color: var(--dn-ink); font: var(--dn-field-font); text-align: left; cursor: pointer; }
  .disclosure-label { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  small { flex: none; color: var(--dn-muted); font-size: var(--dn-text-caption); font-weight: var(--dn-weight-ui); white-space: nowrap; }
  .disclosure:hover { background: var(--dn-surface-hover); }
  .disclosure:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  .disclosure.selected { box-shadow: inset 0 0 0 1px var(--dn-line-emphasis); }
  .chevron { display: flex; flex: none; color: var(--dn-muted); }
  .chevron.expanded { transform: rotate(180deg); }
  .models { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--dn-space-1); padding: var(--dn-space-2) 0; }
  .make.open > .families { padding-top: var(--dn-space-2); }
  .make-title { font: var(--dn-control-font); }
  .empty { padding: var(--dn-space-3); color: var(--dn-muted); font: var(--dn-field-font); }
  .compact, .compact .families, .compact .models { grid-template-columns: minmax(0, 1fr); }
  .compact .all-models { width: 100%; }
  .compact .disclosure { background: transparent; }
  .compact .disclosure:hover { background: var(--dn-surface-subtle); }
  .compact .models { margin-left: var(--dn-space-3); border-left: 1px solid var(--dn-line); padding-left: var(--dn-space-2); }
</style>
