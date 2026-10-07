<script lang="ts">
  import SectionCta11Pt85655b768d from "#lib/sections/SectionCta11Pt85655b768d.svelte";
  import SectionCta12633889a9 from "#lib/sections/SectionCta12633889a9.svelte";
  import SectionBoxBanner3Banner285f6a313 from "#lib/sections/SectionBoxBanner3Banner285f6a313.svelte";
  import SectionFaqs2Pt80ae47a2dc from "#lib/sections/SectionFaqs2Pt80ae47a2dc.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Car Calculator | Karento"
      : "Car Calculator" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><SectionCta11Pt85655b768d />
  <SectionCta12633889a9 />
  <SectionBoxBanner3Banner285f6a313 />
  <SectionFaqs2Pt80ae47a2dc />
  <Footer /></main
>
