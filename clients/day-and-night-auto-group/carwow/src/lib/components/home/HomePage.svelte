<script lang="ts">
	import type { HomeBrandStripItem } from '$lib/data/home-brand-strip';
	import { getViewportContext } from '$lib/hooks/viewport.svelte';
	import DesktopStylesheet from '$lib/components/layout/DesktopStylesheet.svelte';
	import type { HomeDesktopData, HomeMobileData, HomePageHeadData } from '$lib/types/home';
	// Baseline reset the home was authored against (both viewports). Bundled (not
	// ?url) so phones get it too — the heavy desktop sheet below stays withheld
	// from phones, but the small shared baseline must ship everywhere the home does.
	import '$lib/styles/daynight-home-base.css';
	// Loaded as a URL (not a bundled import) through a viewport-checked bootstrap
	// script, so phones do not download this desktop-only stylesheet. The link is
	// deliberately inserted before component styles: appending it after a client
	// navigation reverses the cascade and makes the home differ from a hard reload.
	import desktopHomeCss from '$lib/styles/daynight-home-desktop.css?url';
	import DesktopHome from './desktop/DesktopHome.svelte';
	import DesktopHomeHome1 from './desktop/DesktopHomeHome1.svelte';
	import HomePageHead from './HomePageHead.svelte';
	import MobileHome from './mobile/MobileHome.svelte';
	import CompareTray from '$lib/components/shared/CompareTray.svelte';

	let {
		home,
		homeBrandStrip,
		desktopHome,
		mobileHome,
		heroToggle = 'underline',
		heroBox = false,
		desktopComposition = 'default'
	}: {
		home: HomePageHeadData;
		homeBrandStrip: HomeBrandStripItem[];
		desktopHome: HomeDesktopData;
		mobileHome: HomeMobileData;
		heroToggle?: 'underline' | 'segmented';
		heroBox?: boolean;
		desktopComposition?: 'default' | 'home1';
	} = $props();

	const viewport = getViewportContext();
	const showDesktopHome = $derived(!viewport.mobile);
	const showMobileHome = $derived(viewport.mobile);
</script>

<DesktopStylesheet
	id="daynight-home-desktop-css"
	href={desktopHomeCss}
	placement="before-component-styles"
/>

<HomePageHead title={home.title} description={home.description} />
{#if showDesktopHome}
	{#if desktopComposition === 'home1'}
		<DesktopHomeHome1 brandStrip={homeBrandStrip} data={desktopHome} />
	{:else}
		<DesktopHome brandStrip={homeBrandStrip} data={desktopHome} />
	{/if}
{/if}

{#if showMobileHome}
	<MobileHome data={mobileHome} {heroToggle} {heroBox} />
{/if}

<CompareTray />

<style>
	@media (max-width: 991px) {
		:global(.daynight-home-shell) {
			display: none;
		}
	}

	@media (min-width: 992px) {
		:global(.daynight-home-shell .daynight-home-hero) {
			height: clamp(560px, calc(100vh - 360px), 620px) !important;
			min-height: clamp(560px, calc(100vh - 360px), 620px) !important;
		}
	}
</style>
