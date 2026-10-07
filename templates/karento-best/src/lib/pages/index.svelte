<script lang="ts">
  import BoxSectionBlockBannerHome1c0c6f7d9 from "#lib/sections/BoxSectionBlockBannerHome1c0c6f7d9.svelte";
  import BoxSectionBoxSearchAdvanceHome10477169f7 from "#lib/sections/BoxSectionBoxSearchAdvanceHome10477169f7.svelte";
  import Pb7074223716 from "#lib/sections/Pb7074223716.svelte";
  import BoxFlightse66e7e96 from "#lib/sections/BoxFlightse66e7e96.svelte";
  import BoxCta1c3b76d8c from "#lib/sections/BoxCta1c3b76d8c.svelte";
  import Sectiond6a6020d from "#lib/sections/Sectiond6a6020d.svelte";
  import BoxWhyBook22ClassList7de3e37d from "#lib/sections/BoxWhyBook22ClassList7de3e37d.svelte";
  import BoxCta2OverflowHidden88468ec8 from "#lib/sections/BoxCta2OverflowHidden88468ec8.svelte";
  import BoxFlights3300f4a2 from "#lib/sections/BoxFlights3300f4a2.svelte";
  import Section3a6268f0 from "#lib/sections/Section3a6268f0.svelte";
  import BoxPropertiesAreaPt96ebd2b50a from "#lib/sections/BoxPropertiesAreaPt96ebd2b50a.svelte";
  import Section595246e3 from "#lib/sections/Section595246e3.svelte";
  import Section32e3e425 from "#lib/sections/Section32e3e425.svelte";
  import BoxPicked177a4801 from "#lib/sections/BoxPicked177a4801.svelte";
  import BoxNews7a68114b from "#lib/sections/BoxNews7a68114b.svelte";
  import BoxAppPositionRelative3978d4e8 from "#lib/sections/BoxAppPositionRelative3978d4e8.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Carento - Car rental Bootstrap 5 Template"
      : "Carento - Car rental Bootstrap 5 Template" +
        " | " +
        dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><BoxSectionBlockBannerHome1c0c6f7d9 />
  <BoxSectionBoxSearchAdvanceHome10477169f7 />
  <Pb7074223716 />
  <BoxFlightse66e7e96 />
  <BoxCta1c3b76d8c />
  <Sectiond6a6020d />
  <BoxWhyBook22ClassList7de3e37d />
  <BoxCta2OverflowHidden88468ec8 />
  <BoxFlights3300f4a2 />
  <Section3a6268f0 />
  <BoxPropertiesAreaPt96ebd2b50a />
  <Section595246e3 />
  <Section32e3e425 />
  <BoxPicked177a4801 />
  <BoxNews7a68114b />
  <BoxAppPositionRelative3978d4e8 /></main
>

<Footer />
