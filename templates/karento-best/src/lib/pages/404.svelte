<script lang="ts">
  import ContainerPt1409c82aa21 from "#lib/sections/ContainerPt1409c82aa21.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Page Not Found | Karento"
      : "Page Not Found" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main background-body"
  ><ContainerPt1409c82aa21 />
  <Footer /></main
>
