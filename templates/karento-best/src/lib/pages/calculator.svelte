<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import CalculatorHero from "#lib/sections/CalculatorHero.svelte";
  import LoanCalculatorLayout from "#lib/sections/LoanCalculatorLayout.svelte";
  import RentalSavingsBanner from "#lib/sections/RentalSavingsBanner.svelte";
  import AboutFaqColumns from "#lib/sections/AboutFaqColumns.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { MediaQuery } from "svelte/reactivity";
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

<PageMetadata title={locale.t("ui.calculator.car-calculator")} />
<main class="main"
  ><CalculatorHero />
  <LoanCalculatorLayout />
  {#if !desktop.current}
    <RentalSavingsBanner />
    <AboutFaqColumns />
  {/if}
  <Footer /></main
>
