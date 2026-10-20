<svelte:options runes={true} />

<script lang="ts">
  import { dealer } from "#lib/content.ts";
  import { vehicleListings } from "#lib/data/vehicle-listing.ts";
  import {
    catalogDestination,
    emptyCatalogFilters,
  } from "#lib/data/mobile-catalog.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import MobilePill from "./MobilePill.svelte";
  import MobilePillRail from "./MobilePillRail.svelte";

  const locale = useLocale();
  // Use the same supplied inventory and make convention as the catalogue sheet.
  const makes = $derived(
    [
      ...new Set(
        vehicleListings.gridFourColumns.map(
          (card) =>
            (dealer.inventory[card.title]?.title ?? card.title).split(" ")[0],
        ),
      ),
    ]
      .filter(Boolean)
      .sort(),
  );
</script>

<div class="home-makes">
  <MobilePillRail label={locale.t("catalog.make")}>
    {#each makes as make (make)}
      <MobilePill
        label={make}
        href={locale.href(
          catalogDestination("/vehicles", { ...emptyCatalogFilters, make }),
        )}
      />
    {/each}
  </MobilePillRail>
</div>

<style>
  .home-makes {
    padding-inline: var(--karento-space-4);
    padding-top: var(--karento-space-3);
  }
</style>
