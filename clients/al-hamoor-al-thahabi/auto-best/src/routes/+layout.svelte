<script lang="ts">
  import { setLocaleContext, getI18n, applicationUrl } from '$lib/locale/context';
  import { localeHref } from '$lib/locale/core';
  import LocalePreferences from '$lib/locale/LocalePreferences.svelte';
  import LocaleTrigger from '$lib/locale/LocaleTrigger.svelte';

  import '@fontsource-variable/onest';
  import { template, canIndex } from '$config/template';
  import '../app.css';
  import { page } from '$app/state';
  import SiteShell from '$components/layout/SiteShell.svelte';
  import type { Snippet } from 'svelte';
  import { resolveShellPresentation } from '$data/shell';

  let { children, data }: { children: Snippet; data: import('./$types').LayoutData } = $props();
  setLocaleContext(() => data.localeState);
  const i18n = getI18n();

  $effect(() => {
    document.documentElement.lang = i18n.locale;
    document.documentElement.dir = 'ltr';
    window.dispatchEvent(new CustomEvent('cars:locale-change', { detail: i18n.state }));
  });

  const presentation = $derived(resolveShellPresentation(applicationUrl(page.url), page.status));
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
  <link rel="alternate" hreflang="en" href={page.url.origin + localeHref(page.url.pathname, 'en')} />
  <link rel="alternate" hreflang="bg" href={page.url.origin + localeHref(page.url.pathname, 'bg')} />
</svelte:head>
<LocalePreferences />

{#key i18n.locale}
<SiteShell {presentation}>
  {@render children()}
</SiteShell>
{/key}

<div class="cars-locale-footer"><LocaleTrigger compact={false} footer /></div>

<style>
  .cars-locale-footer { display: flex; justify-content: center; padding: var(--dn-space-4); background: var(--dn-surface); }
  @media (min-width: 768px) {
    .cars-locale-footer { padding: 0 var(--dn-space-4) var(--dn-space-6); background: var(--dn-ink-deep); color: var(--dn-muted-on-ink); }
  }
  @media (min-width: 768px) and (max-width: 991px) {
    .cars-locale-footer :global(.cars-locale-trigger--footer) { margin-bottom: calc(var(--dn-mobile-nav-height) + env(safe-area-inset-bottom)); }
  }
</style>
