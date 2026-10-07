<script lang="ts">
  import BoxSectionBoxBreadcrumb1621a424 from "#lib/sections/BoxSectionBoxBreadcrumb1621a424.svelte";
  import BoxBannerHome2a4f111ff from "#lib/sections/BoxBannerHome2a4f111ff.svelte";
  import BoxSectionBoxContentTourDetail5a1eb992 from "#lib/sections/BoxSectionBoxContentTourDetail5a1eb992.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Product Details | Karento"
      : "Product Details" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><BoxSectionBoxBreadcrumb1621a424 />
  <BoxBannerHome2a4f111ff />
  <BoxSectionBoxContentTourDetail5a1eb992 />
  <Footer /></main
>
