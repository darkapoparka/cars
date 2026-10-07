<script lang="ts">
  import BoxSectionPt80627c6b85 from "#lib/sections/BoxSectionPt80627c6b85.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "News | Karento"
      : "News" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><BoxSectionPt80627c6b85 />
  <Footer /></main
>
