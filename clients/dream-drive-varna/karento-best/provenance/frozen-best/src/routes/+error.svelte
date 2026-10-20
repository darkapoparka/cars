<script lang="ts">
  import { page } from '$app/state';
  import CapturedPage from '../lib/components/CapturedPage.svelte';
</script>

<svelte:head>
  {#if !page.error?.templatePage}<title>{page.status} | Karento</title>{/if}
</svelte:head>

{#if page.error?.templatePage}
  <CapturedPage page={page.error.templatePage} />
{:else}
  <main class="error-fallback">
    <h1>{page.status}</h1>
    <p>We couldn't open this page. Please try again or return home.</p>
    <a href="/">Back to Home</a>
  </main>
{/if}

<style>
  .error-fallback {
    max-width: 640px;
    margin: 80px auto;
    padding: 24px;
    text-align: center;
    font-family: system-ui, sans-serif;
  }
</style>
