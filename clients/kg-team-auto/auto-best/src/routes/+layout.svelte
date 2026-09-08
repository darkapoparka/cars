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
<meta name="robots" content="noindex,nofollow,noarchive" />
  {#if canonicalUrl}<link rel="canonical" href={canonicalUrl} />{/if}
  {#if !indexable}<meta name="robots" content="noindex, nofollow" />{/if}
</svelte:head>

<SiteShell {showFooterActions} {showMobileFooter}>
  {@render children()}
<aside role="note" style="padding:12px 20px;background:#f5f5f5;color:#424242;font:500 12px/1.5 sans-serif;text-align:center">Демонстрация с обяви към 09.09.2026 г. Цената и наличността се потвърждават с продавача. Непубликувана концепция, а не официален сайт. Формите не изпращат запитвания.</aside>
</SiteShell>
