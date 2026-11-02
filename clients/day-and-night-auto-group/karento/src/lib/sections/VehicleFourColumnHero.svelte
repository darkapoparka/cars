<script lang="ts">
  import VehicleLandingHero from "./VehicleLandingHero.svelte";
  import MarketplaceSearch from "#lib/components/search/MarketplaceSearch.svelte";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
</script>

<VehicleLandingHero
  title={locale.locale === "bg" ? "Коли за покупка" : "Find your next car"}
  ><MarketplaceSearch /></VehicleLandingHero
>
