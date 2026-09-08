<script lang="ts">
  import '@fontsource-variable/onest';
  import '../app.css';
  import { page } from '$app/state';
  import SiteShell from '$components/layout/SiteShell.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
  const showFooterActions = $derived(page.url.pathname !== '/');
  const showMobileFooter = $derived(page.url.pathname === '/' || page.url.pathname === '/about-us');
  const canonicalUrl = $derived(`${page.url.origin}${page.url.pathname}`);
</script>

<svelte:head>
  <link rel="canonical" href={canonicalUrl} />
</svelte:head>

<SiteShell {showFooterActions} {showMobileFooter}>
  {@render children()}
</SiteShell>
