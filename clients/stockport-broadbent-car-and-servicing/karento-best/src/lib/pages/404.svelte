<svelte:options runes={true} />

<script lang="ts">
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import ErrorPanel from "#lib/sections/ErrorPanel.svelte";
  import Footer from "#lib/components/Footer.svelte";
  let { status = 404 }: { status?: number } = $props();
  const title = $derived(
    status === 404 ? "Page Not Found" : "Something went wrong",
  );
</script>

<PageMetadata {title} />
<main class="main background-body"
  ><ErrorPanel {status} />
  <Footer /></main
>
