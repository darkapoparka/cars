<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import VehicleFourColumnHero from "#lib/sections/VehicleFourColumnHero.svelte";
  import VehicleFleetHeading from "#lib/sections/VehicleFleetHeading.svelte";
  import VehicleFourColumnListing from "#lib/sections/VehicleFourColumnListing.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { MediaQuery } from "svelte/reactivity";
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

<PageMetadata
  title={locale.locale === "bg" ? "Коли за покупка" : "Cars to buy"}
/>
<main class="main">
  <VehicleFourColumnHero />
  {#if !desktop.current}
    <VehicleFleetHeading />
  {/if}
  <VehicleFourColumnListing />
  <Footer />
</main>
