<script lang="ts">
  import PageHeaderPt305ceb707b from "#lib/sections/PageHeaderPt305ceb707b.svelte";
  import BoxSectionBorderBottom6091630a from "#lib/sections/BoxSectionBorderBottom6091630a.svelte";
  import SectionCta7fc3183d2 from "#lib/sections/SectionCta7fc3183d2.svelte";
  import SectionStatic1Background2e19b6fdf from "#lib/sections/SectionStatic1Background2e19b6fdf.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Import Sources | Karento"
      : "Import Sources" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><PageHeaderPt305ceb707b />
  <BoxSectionBorderBottom6091630a />
  <SectionCta7fc3183d2 />
  <SectionStatic1Background2e19b6fdf />
  <Footer /></main
>
