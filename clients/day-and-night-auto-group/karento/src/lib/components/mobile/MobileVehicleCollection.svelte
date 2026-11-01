<svelte:options runes={true} />

<script lang="ts">
  import { dealer, type VehicleCardContent } from "#lib/content.ts";
  import { focusableScroll } from "#lib/horizontal-scroll.ts";
  import MobileVehicleCard from "./MobileVehicleCard.svelte";

  let {
    groups,
    label,
  }: {
    groups: readonly (readonly VehicleCardContent[])[];
    label: string;
  } = $props();

  const inventory = $derived(
    groups.map((group) =>
      group.map((card) => dealer.inventory[card.title] ?? card),
    ),
  );
</script>

<div
  class="mobile-vehicle-collection"
  role="region"
  aria-label={label}
  {@attach focusableScroll}
>
  {#each inventory as group, index (index)}
    <div
      class="mobile-vehicle-page"
      role="group"
      aria-label={`Group ${index + 1} of ${inventory.length}`}
    >
      {#each group as card, cardIndex (cardIndex)}
        <MobileVehicleCard {card} />
      {/each}
    </div>
  {/each}
</div>
