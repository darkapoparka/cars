<script lang="ts">
  import PageHeaderPt30ddd2d327 from "#lib/sections/PageHeaderPt30ddd2d327.svelte";
  import Section35142173 from "#lib/sections/Section35142173.svelte";
  import SectionBoxBanner3Banner285f6a313 from "#lib/sections/SectionBoxBanner3Banner285f6a313.svelte";
  import Section6d539111 from "#lib/sections/Section6d539111.svelte";
  import SectionCta718be8b86 from "#lib/sections/SectionCta718be8b86.svelte";
  import SectionStatic1BorderBottom8d026355 from "#lib/sections/SectionStatic1BorderBottom8d026355.svelte";
  import BoxNews7a68114b from "#lib/sections/BoxNews7a68114b.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Services | Karento"
      : "Services" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><PageHeaderPt30ddd2d327 />
  <Section35142173 />
  <SectionBoxBanner3Banner285f6a313 />
  <Section6d539111 />
  <SectionCta718be8b86 />
  <SectionStatic1BorderBottom8d026355 />
  <BoxNews7a68114b />
  <Footer /></main
>
