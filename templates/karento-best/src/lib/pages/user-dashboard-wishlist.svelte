<script lang="ts">
  import BoxSectionPt801536352c from "#lib/sections/BoxSectionPt801536352c.svelte";
  import BoxSectionPt800d2ca8da from "#lib/sections/BoxSectionPt800d2ca8da.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "My Wishlist | Karento"
      : "My Wishlist" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><BoxSectionPt801536352c />
  <BoxSectionPt800d2ca8da />
  <Footer /></main
>
