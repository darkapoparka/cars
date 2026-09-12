<script lang="ts">
  import '@fontsource-variable/onest';
  import { template, canIndex } from '$config/template';
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
</svelte:head>
<SiteShell {showFooterActions} {showMobileFooter}>
  <p class="lead-build-notice" role="status">Implementation in progress — not a finished dealer website. Eight dated Texas Drive Auto listing samples; USD and miles. Five listing photos remain unavailable. Source-model illustrations are decorative, not Texas Drive Auto inventory. No inquiry is delivered by this preview; confirm vehicles, payment terms and availability directly with the dealer.</p>
  {@render children()}
</SiteShell>
<style>
  .lead-build-notice { margin: 0; padding: 12px 20px; background: #fff4ce; color: #493d0b; font-size: 14px; line-height: 1.5; }
  :global(a[href=""]) { display: none; }
</style>
