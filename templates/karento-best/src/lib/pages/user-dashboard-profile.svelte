<script lang="ts">
  import BoxSectionPt80828fa4bb from "#lib/sections/BoxSectionPt80828fa4bb.svelte";
  import BoxSectionPt8049bbf3aa from "#lib/sections/BoxSectionPt8049bbf3aa.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "My Profile | Karento"
      : "My Profile" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><BoxSectionPt80828fa4bb />
  <BoxSectionPt8049bbf3aa />
  <Footer /></main
>
