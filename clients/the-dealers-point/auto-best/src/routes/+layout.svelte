<script lang="ts">
  import '@fontsource-variable/onest';
  import { template, canIndex } from '$config/template';
  import '../app.css';
  import { page } from '$app/state';
  import SiteShell from '$components/layout/SiteShell.svelte';
  import type { Snippet } from 'svelte';
  import { resolveShellPresentation } from '$data/shell';

  let { children }: { children: Snippet } = $props();
  const presentation = $derived(resolveShellPresentation(page.url, page.status));
  $effect(() => {
    document.documentElement.classList.toggle('dn-html--workflow', presentation.workflowJourney);
    return () => document.documentElement.classList.remove('dn-html--workflow');
  });
  const indexable = canIndex();
  const canonicalUrl = $derived(template.canonicalOrigin ? `${template.canonicalOrigin}${page.url.pathname}` : null);
</script>

<svelte:body class:dn-body--workflow={presentation.workflowJourney} />
<svelte:head>
  {#if canonicalUrl}<link rel="canonical" href={canonicalUrl} />{/if}
  {#if !indexable}<meta name="robots" content="noindex, nofollow" />{/if}
</svelte:head>

<SiteShell {presentation}>
  {@render children()}
</SiteShell>
