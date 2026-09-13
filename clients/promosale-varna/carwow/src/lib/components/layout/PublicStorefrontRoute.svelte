<script lang="ts">
	import type { Snippet } from 'svelte';
	import DesktopHomeTrailingChrome from '$lib/components/home/desktop/DesktopHomeTrailingChrome.svelte';
	import MobileBottomDock from '$lib/components/home/mobile/MobileBottomDock.svelte';
	import MobileHeader from '$lib/components/home/mobile/MobileHeader.svelte';
	import { getViewportContext } from '$lib/hooks/viewport.svelte';
	const viewport = getViewportContext();
	import DayNightFooter from './DayNightFooter.svelte';
	import RouteImageBehavior from './RouteImageBehavior.svelte';
	import SiteChrome from './SiteChrome.svelte';
	import StorefrontShell from './StorefrontShell.svelte';

	type SearchHref = '/' | '/inventory' | '/contact';

	interface Props {
		children: Snippet;
		imageBehavior?: boolean;
		mainContentAnchor?: boolean;
		mobileReplaced?: boolean;
		searchHref?: SearchHref;
	}

	let {
		children,
		imageBehavior = true,
		mainContentAnchor = false,
		mobileReplaced = false,
		searchHref = '/inventory'
	}: Props = $props();
	const showMobileChrome = $derived(viewport.mobile);
</script>

{#if imageBehavior}
	<RouteImageBehavior />
{/if}

{#if showMobileChrome}
	<MobileHeader {searchHref} />
{/if}

<StorefrontShell {mobileReplaced}>
	{#if !showMobileChrome}<SiteChrome />{/if}
	{#if mainContentAnchor}
		<main id="main-content" tabindex="-1">{@render children()}</main>
	{:else}
		{@render children()}
	{/if}
	<DayNightFooter />
</StorefrontShell>

{#if !showMobileChrome}<DesktopHomeTrailingChrome />{/if}

{#if showMobileChrome}
	<MobileBottomDock />
{/if}
