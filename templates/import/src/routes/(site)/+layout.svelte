<script lang="ts">
	import { localizedValidation } from '$lib/browser/localized-validation';
	import LocalePreferences from '$lib/locale/LocalePreferences.svelte';
	import LocaleTrigger from '$lib/locale/LocaleTrigger.svelte';
	import { localeHref, routeParts } from '$lib/locale/core';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import PublicHeader from '$lib/components/layout/PublicHeader.svelte';
	import PublicFooter from '$lib/components/layout/PublicFooter.svelte';
	import type { LayoutProps } from './$types';
	let { data, children }: LayoutProps = $props();
	const canonicalFor = (locale: 'bg' | 'en') =>
		data.site.identity.origin + localeHref(page.url.pathname, locale, base);
	const canonical = $derived(canonicalFor(data.locale));
	const ownsMobileChrome = $derived(
		routeParts(page.url.pathname).path === '/inventory' ||
			routeParts(page.url.pathname).path.startsWith('/inventory/') ||
			['/import', '/sell-your-car', '/contact'].includes(routeParts(page.url.pathname).path)
	);
</script>

<svelte:head
	><link rel="canonical" href={canonical} /><meta
		property="og:site_name"
		content={data.site.identity.name}
	/><meta property="og:url" content={canonical} />
	{#each data.site.locale.supported as locale (locale)}
		<link rel="alternate" hreflang={locale} href={canonicalFor(locale)} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={canonicalFor(data.site.locale.default)} />
</svelte:head>
<div class="site-shell" use:localizedValidation={() => data.locale}>
	<a class="site-skip" href="#main-content"
		>{data.locale === 'en' ? 'Skip to content' : 'Към съдържанието'}</a
	>
	<PublicHeader mobile={!ownsMobileChrome} />
	{@render children()}
	<PublicFooter />
	<div class="site-container"><LocaleTrigger /></div>
	<LocalePreferences />
</div>

<style>
	.site-skip {
		position: fixed;
		top: 8px;
		left: 8px;
		z-index: 2000;
		transform: translateY(-200%);
		background: var(--bc-white);
		color: var(--bc-ink);
		padding: var(--bc-space-3);
		border-radius: var(--bc-radius-md);
	}
	.site-skip:focus {
		transform: none;
	}
</style>
