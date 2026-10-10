<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { dropdownNavigation } from "#lib/attachments.svelte.ts";
  import type { VehicleFilter } from "#lib/data/vehicle-filters.ts";
  let { filter }: { filter: VehicleFilter } = $props();
  const idBase = $props.id();
  let expanded = $state(false);
</script>

<div
  class="dropdown dropdown-filter"
  {@attach dropdownNavigation((value) => (expanded = value))}
>
  <button
    class="btn btn-dropdown dropdown-toggle m-0 desktop-type-pill"
    id={`${idBase}-dropdownCategory`}
    type="button"
    data-bs-toggle="dropdown"
    aria-label={locale.t("ui.vehicle-filter-menu.view-details")}
    onclick={() => (expanded = !expanded)}
    aria-expanded={expanded}
    ><span>{filter.labelKey ? locale.t(filter.labelKey) : filter.label}</span
    ></button
  >
  <ul
    aria-labelledby={`${idBase}-dropdownCategory`}
    class={"dropdown-menu dropdown-menu-light " + (expanded ? "show" : "")}
  >
    {#each filter.choices as choice (choice.id)}<li
        ><a
          class={["dropdown-item", { active: choice.active }]}
          href="#!"
          aria-label={choice.labelKey
            ? locale.t(choice.labelKey)
            : choice.label}
          onclick={(event) => {
            event.preventDefault();
            expanded = false;
          }}>{choice.labelKey ? locale.t(choice.labelKey) : choice.label}</a
        ></li
      >
    {/each}
  </ul>
</div>
