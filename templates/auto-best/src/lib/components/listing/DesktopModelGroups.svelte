<script module lang="ts">
  import type { PickerNavigation } from './FilterPopoverHeader.svelte';

  export type ModelPicker = { navigation: () => PickerNavigation | undefined };
</script>

<script lang="ts">
  import { onMount, tick } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import { getI18n } from '$lib/locale/context';
  import { vehicleCount } from '$lib/locale/messages';
  import { featuredVehicles } from '$data/inventory';
  import { desktopMakeCatalogue } from '$data/desktop-makes';
  import { modelMakes, type ModelMake, type ModelFamily } from '$data/model-catalogue';
  import { listingSelectionHas } from '$data/listing';
  import { listingSuggestionMatcher } from '$data/listing-draft';
  import DesktopFilterChoice from './DesktopFilterChoice.svelte';
  import Icon from '$components/ui/Icon.svelte';
  import CheckmarkIcon from '$components/ui/CheckmarkIcon.svelte';

  let { makes, selected, search = '', compact = false, name = 'model', onchange }: {
    makes: readonly string[]; selected: readonly string[]; search?: string; compact?: boolean; name?: string; onchange: (value: string) => void;
  } = $props();
  const i18n = getI18n();
  let root: HTMLDivElement;
  let pane: HTMLElement | undefined;
  let backButton: HTMLButtonElement | undefined;
  const attachBack: Attachment<HTMLButtonElement> = node => { backButton = node; return () => { backButton = undefined; }; };
  let paneHeight = $state(0);
  let activeMake = $state<string | null>(null);
  let activeFamily = $state<string | null>(null);
  const history: { make: string | null; family: string | null; scroll: number; key: string }[] = [];
  const matches = $derived(listingSuggestionMatcher(search, i18n.locale));
  const catalogue = $derived(modelMakes(featuredVehicles, makes, selected, desktopMakeCatalogue));
  const groups = $derived(catalogue.map(group => ({ ...group, families: group.families.map(family => ({ ...family,
    choices: family.choices.filter(choice => matches(`${group.make} ${family.name} ${choice.label}`))
  })).filter(family => family.choices.length) })).filter(group => group.families.length));
  const singleMake = $derived(makes.length === 1);
  const currentMake = $derived(singleMake ? catalogue[0] : catalogue.find(group => group.make === activeMake));
  const currentFamily = $derived(currentMake?.families.find(family => family.name === activeFamily));
  const searching = $derived(Boolean(search.trim()));
  const total = $derived(catalogue.reduce((count, group) => count + group.count, 0));
  const retained = $derived(selected.filter(value => !catalogue.some(group => group.families.some(family => family.choices.some(choice => listingSelectionHas([choice.value], value))))));
  const familyKey = (make: string, family = '') => JSON.stringify([make, family]);
  const hasSelection = (family: ModelFamily) => family.choices.some(choice => listingSelectionHas(selected, choice.value));
  // Reading this from the owner keeps its fixed header in the same browsing state.
  export function navigation(): PickerNavigation | undefined {
    if (searching || !currentMake) return;
    return { label: `${currentMake.make}${currentFamily ? ' / ' + currentFamily.name : ''}`,
      compactLabel: compact ? currentFamily?.name ?? currentMake.make : undefined,
      back: currentFamily || !singleMake ? back : undefined, attachBack };
  }
  onMount(() => {
    for (let node = root.parentElement; node; node = node.parentElement) {
      if (/auto|scroll/.test(getComputedStyle(node).overflowY)) { pane = node; break; }
    }
    // Measure after popover placement, then retain the actual viewport for short families.
    const observer = pane ? new ResizeObserver(([entry]) => { paneHeight = entry.contentRect.height; }) : undefined;
    if (pane) observer?.observe(pane);
    const chosen = catalogue.flatMap(group => group.families.filter(hasSelection).map(family => ({ make: group.make, family })));
    // Reopening a single selected family should reveal its checked choices immediately.
    if (chosen.length === 1 && !retained.length && chosen[0].family.choices.length > 1) {
      const { make, family } = chosen[0];
      if (!singleMake) history.push({ make: null, family: null, scroll: 0, key: familyKey(make) });
      history.push({ make: singleMake ? null : make, family: null, scroll: 0, key: familyKey(make, family.name) });
      activeMake = make; activeFamily = family.name;
    }
    return () => observer?.disconnect();
  });
  $effect(() => { search; if (pane) pane.scrollTop = 0; });
  async function enter(make: string, family: string | null = null) {
    history.push({ make: activeMake, family: activeFamily, scroll: pane?.scrollTop ?? 0, key: familyKey(make, family ?? '') });
    activeMake = make; activeFamily = family;
    await tick();
    if (pane) pane.scrollTop = 0;
    backButton?.focus({ preventScroll: true });
  }
  async function back() {
    const previous = history.pop();
    if (!previous) return;
    activeMake = previous.make; activeFamily = previous.family;
    await tick();
    if (pane) pane.scrollTop = previous.scroll;
    [...root.querySelectorAll<HTMLButtonElement>('[data-model-key]')].find(button => button.dataset.modelKey === previous.key)?.focus({ preventScroll: true });
  }
</script>

{#snippet families(group: ModelMake)}
  {#each group.families as family (family.name)}
    {#if family.choices.length === 1 && family.choices[0].label === family.name}
      {@const choice = family.choices[0]}
      <DesktopFilterChoice value={choice.value} label={choice.label} accessibleLabel={choice.label} description={vehicleCount(i18n.locale, choice.count)} checked={listingSelectionHas(selected, choice.value)} multiple tile={!compact} {name} {onchange} />
    {:else}
      <button type="button" class="disclosure" class:selected={hasSelection(family)} data-model-family={family.name} data-model-key={familyKey(group.make, family.name)} onclick={() => enter(group.make, family.name)}>
        <span class="disclosure-label">{family.name}</span>{#if hasSelection(family)}<span class="selection-mark" aria-hidden="true"><CheckmarkIcon /></span>{/if}<small>{vehicleCount(i18n.locale, family.count)}</small><span class="chevron"><Icon name="chevron-down" size={16} /></span>
      </button>
    {/if}
  {/each}
{/snippet}

<div bind:this={root} class="dn-model-groups" class:compact style:min-height={paneHeight ? `${paneHeight}px` : undefined} role="group" aria-label={i18n.t('inventory.facet.model')}>
  {#if !searching && !currentFamily && (!currentMake || singleMake)}
    <div class="all-models"><DesktopFilterChoice value="" label={i18n.t('inventory.search.allModels')} accessibleLabel={i18n.t('inventory.search.allModels')} description={vehicleCount(i18n.locale, total)} checked={!selected.length} multiple tile={!compact} {name} {onchange} /></div>
  {/if}
  {#if searching}
    {#each groups as group (group.make)}
      {#each group.families as family (family.name)}
        <section class="search-group" aria-label={`${group.make} ${family.name}`}>
          <h3>{group.make} · {family.name}</h3>
          <div class="models">{#each family.choices as choice (choice.value)}
            <DesktopFilterChoice value={choice.value} label={choice.label} accessibleLabel={choice.label} description={vehicleCount(i18n.locale, choice.count)} checked={listingSelectionHas(selected, choice.value)} multiple {name} {onchange} />
          {/each}</div>
        </section>
      {/each}
    {/each}
    {#if !groups.length && !retained.some(matches)}<p class="empty" role="status">{i18n.t('inventory.search.empty')}</p>{/if}
  {:else if currentMake}
    {#if currentFamily}
      <div class="models" data-model-view={currentFamily.name} role="group" aria-label={`${currentMake.make} ${currentFamily.name}`}>
        {#each currentFamily.choices as choice (choice.value)}
          <DesktopFilterChoice value={choice.value} label={choice.label} accessibleLabel={choice.label} description={vehicleCount(i18n.locale, choice.count)} checked={listingSelectionHas(selected, choice.value)} multiple {name} {onchange} />
        {/each}
      </div>
    {:else}
      {@render families(currentMake)}
    {/if}
  {:else}
    {#each catalogue as group (group.make)}
      <button type="button" class="disclosure make-title" class:selected={group.families.some(hasSelection)} data-model-make={group.make} data-model-key={familyKey(group.make)} onclick={() => enter(group.make)}>
        <span class="disclosure-label">{group.make}</span>{#if group.families.some(hasSelection)}<span class="selection-mark" aria-hidden="true"><CheckmarkIcon /></span>{/if}<small>{vehicleCount(i18n.locale, group.count)}</small><span class="chevron"><Icon name="chevron-down" size={16} /></span>
      </button>
    {/each}
  {/if}
  {#each retained.filter(matches) as value (value)}
    <DesktopFilterChoice {value} label={value} accessibleLabel={value} description={vehicleCount(i18n.locale, 0)} checked multiple tile={!compact} {name} {onchange} />
  {/each}
</div>

<style>
  .dn-model-groups, .models { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-content: start; gap: var(--dn-space-2); min-width: 0; }
  .dn-model-groups { align-self: start; }
  .models, .search-group, .empty { grid-column: 1 / -1; }
  .disclosure { display: flex; align-items: center; gap: var(--dn-space-2); width: 100%; min-width: 0; min-height: var(--dn-control-height-default); padding: var(--dn-space-2) var(--dn-space-3); border: 0; border-radius: var(--dn-radius-control); background: var(--dn-surface-subtle); color: var(--dn-ink); font: var(--dn-field-font); text-align: left; cursor: pointer; }
  .disclosure-label { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  small { flex: none; color: var(--dn-muted); font-size: var(--dn-text-caption); font-weight: var(--dn-weight-ui); white-space: nowrap; }
  .disclosure:hover { background: var(--dn-surface-hover); }
  .disclosure:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
  .chevron { display: flex; flex: none; color: var(--dn-muted); transform: rotate(-90deg); }
  .selection-mark { display: flex; flex: none; color: var(--dn-ink); }
  h3 { min-width: 0; margin: 0; color: var(--dn-ink); font: var(--dn-control-font); overflow-wrap: anywhere; }
  .search-group { min-width: 0; }
  .search-group h3 { padding: var(--dn-space-2) var(--dn-space-3); color: var(--dn-muted); }
  .make-title { font: var(--dn-control-font); }
  .empty { padding: var(--dn-space-3); color: var(--dn-muted); font: var(--dn-field-font); }
  .compact, .compact .models { grid-template-columns: minmax(0, 1fr); }
  .compact .disclosure { background: transparent; }
  .compact .disclosure:hover { background: var(--dn-surface-subtle); }
</style>
