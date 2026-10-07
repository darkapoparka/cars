<script lang="ts">
  import BoxSectionBackground23057ec46 from "#lib/sections/BoxSectionBackground23057ec46.svelte";
  import SectionFaqs2Pt8092250cf0 from "#lib/sections/SectionFaqs2Pt8092250cf0.svelte";
  import SectionFaqs2Pt80635426c2 from "#lib/sections/SectionFaqs2Pt80635426c2.svelte";
  import SectionStatic1Background2e19b6fdf from "#lib/sections/SectionStatic1Background2e19b6fdf.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "FAQ | Karento"
      : "FAQ" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><BoxSectionBackground23057ec46 />
  <SectionFaqs2Pt8092250cf0 />
  <SectionFaqs2Pt80635426c2 />
  <SectionStatic1Background2e19b6fdf />
  <Footer /></main
>
