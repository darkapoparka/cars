<script lang="ts">
  import '@fontsource-variable/onest';
  import { template, canIndex } from '$config/template';
  import { brand, dealerSource } from '$config/brand';
  import '../app.css';
  import { page } from '$app/state';
  import SiteShell from '$components/layout/SiteShell.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
  const showFooterActions = $derived(page.url.pathname !== '/');
  const showMobileFooter = $derived(page.url.pathname === '/' || page.url.pathname === '/about-us');
  const indexable = canIndex();
  const canonicalUrl = $derived(template.canonicalOrigin ? `${template.canonicalOrigin}${page.url.pathname}` : null);
</script>

<svelte:head>
  {#if canonicalUrl}<link rel="canonical" href={canonicalUrl} />{/if}
  {#if !indexable}<meta name="robots" content="noindex, nofollow" />{/if}
  <meta property="og:site_name" content={`${brand.name} — демонстрация`} />
  <meta property="og:locale" content="bg_BG" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={`${brand.name} · Автомобили във Варна`} />
  <meta property="og:description" content={dealerSource.inventoryNotice} />
  <meta property="og:image" content={dealerSource.vehicles[4].images[1]} />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<SiteShell {showFooterActions} {showMobileFooter}>
  {@render children()}
</SiteShell>
