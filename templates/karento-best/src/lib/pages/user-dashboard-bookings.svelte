<script lang="ts">
  import BoxSectionPt801b5d99eb from "#lib/sections/BoxSectionPt801b5d99eb.svelte";
  import BoxSectionPt8029760a9f from "#lib/sections/BoxSectionPt8029760a9f.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "My Bookings | Karento"
      : "My Bookings" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><BoxSectionPt801b5d99eb />
  <BoxSectionPt8029760a9f />
  <Footer /></main
>
