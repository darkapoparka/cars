<script lang="ts">
	import { localizedValidation } from '$lib/browser/localized-validation';
	import LocalePreferences from '$lib/locale/LocalePreferences.svelte';
	import LocaleTrigger from '$lib/locale/LocaleTrigger.svelte';
	import { localeHref, routeParts } from '$lib/locale/core';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import PublicHeader from '$lib/components/layout/PublicHeader.svelte';
	import PublicFooter from '$lib/components/layout/PublicFooter.svelte';
	import SiteSkipLink from '$lib/components/layout/SiteSkipLink.svelte';
	import DesktopImportRequestDialog from '$lib/components/services/DesktopImportRequestDialog.svelte';
	import DesktopSellRequestDialog from '$lib/components/services/DesktopSellRequestDialog.svelte';
	import CompareOverlay from '$lib/components/compare/CompareOverlay.svelte';
	import type { LayoutProps } from './$types';
	let { data, children }: LayoutProps = $props();
	const canonicalFor = (locale: 'bg' | 'en') =>
		data.site.identity.origin + localeHref(page.url.pathname, locale, base);
	const canonical = $derived(canonicalFor(data.locale));
	const isHome = $derived(routeParts(page.url.pathname).path === '/');
	const primaryMobilePage = $derived(
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
<div
	class="site-shell"
	class:site-shell--secondary={!isHome && !primaryMobilePage}
	use:localizedValidation={() => data.locale}
>
	<SiteSkipLink />
	<PublicHeader mobile={isHome} />
	{@render children()}
	<div class:site-shell__footer--desktop-only={!isHome} data-home-footer={isHome ? '' : undefined}>
		<PublicFooter />
		<div class="site-container"><LocaleTrigger /></div>
	</div>
	<LocalePreferences />
	<DesktopImportRequestDialog />
	<DesktopSellRequestDialog />
	<CompareOverlay />
</div>

<style>
	@media (max-width: 767.98px) {
		.site-shell--secondary {
			--bc-section-sm: var(--bc-space-4);
			background: var(--bc-bg-strong);
		}
		.site-shell--secondary :global(main) {
			min-height: calc(100dvh - var(--bc-mobile-nav-height));
			padding-bottom: var(--bc-space-6);
		}
		.site-shell--secondary :global(.site-empty-state) {
			align-content: start;
			gap: var(--bc-space-4);
		}
		.site-shell--secondary :global(.site-empty-state h2),
		.site-shell--secondary :global(.site-empty-state p) {
			margin: 0;
		}
		.site-shell--secondary :global(.site-stack) {
			gap: var(--bc-space-4);
		}

		.site-shell__footer--desktop-only {
			display: none;
		}
	}
</style>
