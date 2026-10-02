<script lang="ts">
  import { vehicles } from "../lib/catalog";
  import CuratedCarCard from "./CuratedCarCard.svelte";
  const groups = [
    { key: "all", label: "All cars", cars: vehicles.slice(0, 8) },
    {
      key: "new",
      label: "New cars",
      cars: vehicles.filter((v) => v.condition === "New").slice(0, 8),
    },
    {
      key: "used",
      label: "Used cars",
      cars: vehicles.filter((v) => v.condition === "Used").slice(0, 8),
    },
  ];
</script>

<nav aria-label="Vehicle condition">
  <div class="nav nav-tabs" role="tablist" aria-label="Latest cars">
    {#each groups as group, i}
      <button
        class="nav-link"
        class:active={i === 0}
        id={`stock-${group.key}-tab`}
        data-bs-toggle="tab"
        data-bs-target={`#stock-${group.key}`}
        type="button"
        role="tab"
        aria-controls={`stock-${group.key}`}
        aria-selected={i === 0}
        tabindex={i === 0 ? 0 : -1}
      >
        {group.label}
      </button>
    {/each}
  </div>
</nav>
<div class="tab-content">
  {#each groups as group, i}
    <div
      class="tab-pane fade"
      class:show={i === 0}
      class:active={i === 0}
      id={`stock-${group.key}`}
      role="tabpanel"
      aria-labelledby={`stock-${group.key}-tab`}
    >
      <div class="row car-slider-three" data-preview="4">
        {#each group.cars as vehicle (vehicle.id)}<CuratedCarCard
            {vehicle}
          />{/each}
      </div>
    </div>
  {/each}
</div>
