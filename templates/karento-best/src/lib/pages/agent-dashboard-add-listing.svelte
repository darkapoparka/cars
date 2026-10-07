<script lang="ts">
  import BoxSectionPt80fc08a1f7 from "#lib/sections/BoxSectionPt80fc08a1f7.svelte";
  import BoxSectionPt80b636db3e from "#lib/sections/BoxSectionPt80b636db3e.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Add Listing | Karento"
      : "Add Listing" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><BoxSectionPt80fc08a1f7 />
  <BoxSectionPt80b636db3e />
  <Footer /></main
>
