<script lang="ts">
  import BoxSectionPt80da85a548 from "#lib/sections/BoxSectionPt80da85a548.svelte";
  import BoxSectionPt8097261e44 from "#lib/sections/BoxSectionPt8097261e44.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Listings | Karento"
      : "Listings" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><BoxSectionPt80da85a548 />
  <BoxSectionPt8097261e44 />
  <Footer /></main
>
