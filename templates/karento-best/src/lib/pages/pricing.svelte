<script lang="ts">
  import PageHeaderPt30c39bd6fc from "#lib/sections/PageHeaderPt30c39bd6fc.svelte";
  import SectionPricing1Pt805bcda6c1 from "#lib/sections/SectionPricing1Pt805bcda6c1.svelte";
  import SectionFaqs2Pt8006ca2711 from "#lib/sections/SectionFaqs2Pt8006ca2711.svelte";
  import BoxNews7a68114b from "#lib/sections/BoxNews7a68114b.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Membership & Pricing | Karento"
      : "Membership & Pricing" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><PageHeaderPt30c39bd6fc />
  <SectionPricing1Pt805bcda6c1 />
  <SectionFaqs2Pt8006ca2711 />
  <BoxNews7a68114b />
  <Footer /></main
>
