<script lang="ts">
  import PageHeaderPt303794e9c8 from "#lib/sections/PageHeaderPt303794e9c8.svelte";
  import BoxSectionPt1105cb56a12 from "#lib/sections/BoxSectionPt1105cb56a12.svelte";
  import BoxSectionBoxContactForm71cbd808 from "#lib/sections/BoxSectionBoxContactForm71cbd808.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Contact | Karento"
      : "Contact" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><PageHeaderPt303794e9c8 />
  <BoxSectionPt1105cb56a12 />
  <BoxSectionBoxContactForm71cbd808 />
  <Footer /></main
>
