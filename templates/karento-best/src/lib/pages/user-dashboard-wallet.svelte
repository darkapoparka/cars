<script lang="ts">
  import BoxSectionPt80f00c7808 from "#lib/sections/BoxSectionPt80f00c7808.svelte";
  import BoxSectionPt800c8b68bb from "#lib/sections/BoxSectionPt800c8b68bb.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "My Wallet | Karento"
      : "My Wallet" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><BoxSectionPt80f00c7808 />
  <BoxSectionPt800c8b68bb />
  <Footer /></main
>
