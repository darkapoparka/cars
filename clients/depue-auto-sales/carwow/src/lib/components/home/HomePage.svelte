<script lang="ts">
	import type { HomeBrandStripItem } from '$lib/data/home-brand-strip';
	import { MOBILE_SHELL_MAX_WIDTH } from '$lib/hooks/is-mobile.svelte';
	import type {
		HomeDesktopData,
		HomeInitialViewport,
		HomeMobileData,
		HomePageHeadData
	} from '$lib/types/home';
	import { onMount } from 'svelte';
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
		initialViewport,
		heroToggle = 'underline',
		heroBox = false,
		desktopComposition = 'default'
	}: {
		home: HomePageHeadData;
		homeBrandStrip: HomeBrandStripItem[];
		desktopHome: HomeDesktopData;
		mobileHome: HomeMobileData;
		initialViewport: HomeInitialViewport;
		heroToggle?: 'underline' | 'segmented';
		heroBox?: boolean;
		desktopComposition?: 'default' | 'home1';
	} = $props();

	// The server already renders only the layout the User-Agent implies, so a
	// phone never ships/hydrates the desktop home (and vice-versa). Hydration
	// starts from that same guess (clientIsMobileViewport is null → falls back to
	// initialViewport) so there is no SSR/client mismatch. After mount the real
	// viewport via matchMedia takes over and corrects any UA mis-guess — a desktop
	// UA on a narrow window, a mobile UA on a tablet, etc. The 991px query matches
	// the CSS breakpoint where .mobile-home / .daynight-home-shell swap.
	let clientIsMobileViewport = $state<boolean | null>(null);
	const isMobileViewport = $derived(clientIsMobileViewport ?? initialViewport === 'mobile');
	const showDesktopHome = $derived(!isMobileViewport);
	const showMobileHome = $derived(isMobileViewport);
	const desktopHomeCssLinkId = 'daynight-home-desktop-css';
	const desktopHomeCssMedia = `(min-width: ${MOBILE_SHELL_MAX_WIDTH + 1}px)`;
	const desktopHomeCssBootstrap = `(() => {
const media = ${JSON.stringify(desktopHomeCssMedia)};
if (!window.matchMedia(media).matches) return;
if (document.getElementById(${JSON.stringify(desktopHomeCssLinkId)})) return;
const link = document.createElement('link');
link.id = ${JSON.stringify(desktopHomeCssLinkId)};
link.rel = 'stylesheet';
link.href = ${JSON.stringify(desktopHomeCss)};
link.media = media;
const firstStyle = document.head.querySelector('style, link[rel="stylesheet"]');
document.head.insertBefore(link, firstStyle);
})();`;

	function ensureDesktopHomeStyles() {
		if (typeof window === 'undefined' || !window.matchMedia(desktopHomeCssMedia).matches) {
			return;
		}

		if (document.getElementById(desktopHomeCssLinkId)) {
			return;
		}

		const link = document.createElement('link');
		link.id = desktopHomeCssLinkId;
		link.rel = 'stylesheet';
		link.href = desktopHomeCss;
		link.media = desktopHomeCssMedia;
		const firstStyle = document.head.querySelector('style, link[rel="stylesheet"]');
		document.head.insertBefore(link, firstStyle);
	}

	onMount(() => {
		const query = window.matchMedia(`(max-width: ${MOBILE_SHELL_MAX_WIDTH}px)`);
		const update = () => {
			clientIsMobileViewport = query.matches;
			if (!query.matches) {
				ensureDesktopHomeStyles();
			}
		};
		update();
		query.addEventListener('change', update);
		return () => query.removeEventListener('change', update);
	});
</script>

<svelte:head>
	<svelte:element this={'script'}>{desktopHomeCssBootstrap}</svelte:element>
</svelte:head>

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
