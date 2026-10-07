<script lang="ts">
  import PageHeaderPt308f30dc04 from "#lib/sections/PageHeaderPt308f30dc04.svelte";
  import BoxSectionTermPt85b8262f12 from "#lib/sections/BoxSectionTermPt85b8262f12.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Terms | Karento"
      : "Terms" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><PageHeaderPt308f30dc04 />
  <BoxSectionTermPt85b8262f12 />
  <Footer /></main
>
