<script lang="ts">
  import BoxPostsGrid244dc77d6 from "#lib/sections/BoxPostsGrid244dc77d6.svelte";
  import BoxSection35f1a4b6 from "#lib/sections/BoxSection35f1a4b6.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Carento - Car rental Bootstrap 5 Template"
      : "Carento - Car rental Bootstrap 5 Template" +
        " | " +
        dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><BoxPostsGrid244dc77d6 />
  <BoxSection35f1a4b6 />
  <Footer /></main
>
