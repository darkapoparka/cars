<script lang="ts">
  import ContainerPt140d2109d6f from "#lib/sections/ContainerPt140d2109d6f.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Login | Karento"
      : "Login" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main background-body"
  ><ContainerPt140d2109d6f />
  <Footer /></main
>
