<script lang="ts">
  import ContainerPt1402de480ad from "#lib/sections/ContainerPt1402de480ad.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Register | Karento"
      : "Register" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main background-body"
  ><ContainerPt1402de480ad />
  <Footer /></main
>
