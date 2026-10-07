<script lang="ts">
  import BoxSectionPt803562461d from "#lib/sections/BoxSectionPt803562461d.svelte";
  import BoxSectionPt80e1f57090 from "#lib/sections/BoxSectionPt80e1f57090.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Earnings | Karento"
      : "Earnings" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><BoxSectionPt803562461d />
  <BoxSectionPt80e1f57090 />
  <Footer /></main
>
