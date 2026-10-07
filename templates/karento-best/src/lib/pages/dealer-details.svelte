<script lang="ts">
  import PageHeaderPt3064d3183f from "#lib/sections/PageHeaderPt3064d3183f.svelte";
  import BoxSectionBoxContentTourDetailf5ab29e1 from "#lib/sections/BoxSectionBoxContentTourDetailf5ab29e1.svelte";
  import Pt5023f5495b from "#lib/sections/Pt5023f5495b.svelte";
  import BoxSectionBlockContentTourlist1f909262 from "#lib/sections/BoxSectionBlockContentTourlist1f909262.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Import Source Profile | Karento"
      : "Import Source Profile" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><PageHeaderPt3064d3183f />
  <BoxSectionBoxContentTourDetailf5ab29e1 />
  <Pt5023f5495b />
  <BoxSectionBlockContentTourlist1f909262 />
  <Footer /></main
>
