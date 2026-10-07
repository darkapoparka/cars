<script lang="ts">
  import PageHeaderPt30f3e0d191 from "#lib/sections/PageHeaderPt30f3e0d191.svelte";
  import BoxSection9bcc958d from "#lib/sections/BoxSection9bcc958d.svelte";
  import BoxNews7a68114b from "#lib/sections/BoxNews7a68114b.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "News Article | Karento"
      : "News Article" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><PageHeaderPt30f3e0d191 />
  <BoxSection9bcc958d />
  <BoxNews7a68114b />
  <Footer /></main
>
