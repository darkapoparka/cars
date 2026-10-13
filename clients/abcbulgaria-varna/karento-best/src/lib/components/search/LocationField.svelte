<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { dropdownNavigation } from "#lib/attachments.svelte.ts";
  import { referenceVehicleSearch } from "#lib/data/search.ts";
  let {
    id,
    label,
    value = $bindable(""),
    options = referenceVehicleSearch.locations,
    class: className = "item-search",
  }: {
    id: string;
    label: string;
    value?: string;
    options?: readonly string[];
    class?: string;
  } = $props();
  let expanded = $state(false);
</script>

<div class={className}>
  <label class="text-sm-bold neutral-500 desktop-type-label" for={id}
    >{label}</label
  >
  <div
    class="dropdown"
    {@attach dropdownNavigation((open) => (expanded = open))}
  >
    <button
      class="btn btn-secondary dropdown-toggle btn-dropdown-search location-search desktop-type-control"
      type="button"
      data-bs-toggle="dropdown"
      {id}
      aria-label={value}
      onclick={() => (expanded = !expanded)}
      aria-expanded={expanded}>{value}</button
    >
    <ul class={"dropdown-menu " + (expanded ? "show" : "")}>
      {#each options as location (location)}
        <li>
          <a
            class="dropdown-item desktop-type-body-small"
            href="#!"
            aria-label={location}
            onclick={(event) => {
              event.preventDefault();
              expanded = false;
              value = location;
            }}>{location}</a
          >
        </li>
      {/each}
    </ul>
  </div>
</div>
