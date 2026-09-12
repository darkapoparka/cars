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
  <p role="note" style="margin:0;padding:10px 16px;text-align:center;font-size:13px;background:#f3f4f6;color:#374151">Неофициално демо. Обяви към 09.09.2026. Снимките очакват разрешение. Логото е неофициално предложение. Запитванията не се изпращат.</p>
  {@render children()}
</SiteShell>
