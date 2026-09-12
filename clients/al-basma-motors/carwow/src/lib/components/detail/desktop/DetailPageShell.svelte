<script lang="ts">
	import { getDayNightVehicleAvailability } from '$lib/data/daynight-vehicles';
	import SiteChrome from '$lib/components/layout/SiteChrome.svelte';
	import StorefrontPageHead from '$lib/components/seo/StorefrontPageHead.svelte';
	import DayNightFooter from '$lib/components/layout/DayNightFooter.svelte';
	import DesktopDetailPrimarySection from './DesktopDetailPrimarySection.svelte';
	import MobileDetailPage from '$lib/components/detail/mobile/MobileDetailPage.svelte';
	import DesktopHomeTrailingChrome from '$lib/components/home/desktop/DesktopHomeTrailingChrome.svelte';
	import type { DetailTemplatePage } from '$lib/types/template-page';
	import type { HomeInitialViewport } from '$lib/types/home';
	import { onMount } from 'svelte';
	import { MOBILE_SHELL_MAX_WIDTH } from '$lib/hooks/is-mobile.svelte';
	import { page as appState } from '$app/state';
	// Desktop-only PDP styles, loaded through a viewport-checked bootstrap so phones
	// (which render MobileDetailPage) never download them. Mirrors HomePage.svelte.
	import desktopDetailCss from '$lib/styles/daynight-detail-desktop.css?url';

	let {
		page,
		initialViewport
	}: { page: DetailTemplatePage; initialViewport: HomeInitialViewport } = $props();

	// Per-vehicle Car + Offer structured data for Google rich results.
	const vehicle = $derived(page.vehicle);
	const vehicleJsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Car',
			name: vehicle.title,
			image: vehicle.image,
			brand: { '@type': 'Brand', name: vehicle.brand },
			model: vehicle.model,
			vehicleModelDate: vehicle.year,
			...(vehicle.mileageValue
				? {
						mileageFromOdometer: {
							'@type': 'QuantitativeValue',
							value: vehicle.mileageValue,
							unitCode: 'KMT'
						}
					}
				: {}),
			fuelType: vehicle.fuel,
			vehicleTransmission: vehicle.transmission,
			offers: {
				'@type': 'Offer',
				price: vehicle.price,
				priceCurrency: 'EUR',
				availability:
					getDayNightVehicleAvailability(vehicle) === 'incoming'
						? 'https://schema.org/PreOrder'
						: 'https://schema.org/InStock',
				url: appState.url ? appState.url.origin + appState.url.pathname : '',
				seller: { '@type': 'AutoDealer', name: 'Al Basma София' }
			}
		}).replaceAll('<', '\\u003c')
	);

	// UA-based SSR: the server rendered only the layout the device needs (from the
	// request User-Agent), so phones never ship/hydrate the desktop detail shell.
	// Hydration starts from the same guess; bind:innerWidth corrects a wrong UA
	// guess after mount. 991px matches the CSS breakpoint where the layouts swap.
	let viewportWidth = $state<number | undefined>();
	const isMobileViewport = $derived(
		viewportWidth === undefined
			? initialViewport === 'mobile'
			: viewportWidth <= MOBILE_SHELL_MAX_WIDTH
	);
	const showMobileDetail = $derived(isMobileViewport);
	const showDesktopDetail = $derived(!isMobileViewport);

	// The desktop gallery is now Svelte-owned, so keep the legacy Swiper bundle and
	// template initializer out of the route head entirely.
	const legacyGalleryScriptSrcs = new Set([
		'/assets/js/swiper-bundle.min.js',
		'/assets/js/swiper.js'
	]);
	const scriptSrcs = $derived(page.scriptSrcs.filter((src) => !legacyGalleryScriptSrcs.has(src)));

	// Desktop PDP stylesheet, injected behind a min-width gate (same mechanism as
	// the desktop home CSS) so it never ships to phones even on a wrong UA guess.
	const desktopDetailCssLinkId = 'daynight-detail-desktop-css';
	const desktopDetailCssMedia = `(min-width: ${MOBILE_SHELL_MAX_WIDTH + 1}px)`;
	const desktopDetailCssBootstrap = `(() => {
const media = ${JSON.stringify(desktopDetailCssMedia)};
if (!window.matchMedia(media).matches) return;
if (document.getElementById(${JSON.stringify(desktopDetailCssLinkId)})) return;
const link = document.createElement('link');
link.id = ${JSON.stringify(desktopDetailCssLinkId)};
link.rel = 'stylesheet';
link.href = ${JSON.stringify(desktopDetailCss)};
link.media = media;
document.head.appendChild(link);
})();`;

	function ensureDesktopDetailStyles() {
		if (typeof window === 'undefined' || !window.matchMedia(desktopDetailCssMedia).matches) {
			return;
		}
		if (document.getElementById(desktopDetailCssLinkId)) {
			return;
		}
		const link = document.createElement('link');
		link.id = desktopDetailCssLinkId;
		link.rel = 'stylesheet';
		link.href = desktopDetailCss;
		link.media = desktopDetailCssMedia;
		document.head.appendChild(link);
	}

	onMount(() => {
		if (!isMobileViewport) {
			ensureDesktopDetailStyles();
		}
	});
</script>

<svelte:window bind:innerWidth={viewportWidth} />

<StorefrontPageHead
	title={page.title}
	scriptSrcs={showDesktopDetail ? scriptSrcs : []}
	description={page.description}
	ogImage={vehicle.image}
	ogType="product"
/>
<svelte:head>
	<svelte:element this={'script'} type="application/ld+json">{vehicleJsonLd}</svelte:element>
	<svelte:element this={'script'}>{desktopDetailCssBootstrap}</svelte:element>
</svelte:head>
{#if showMobileDetail}
	<MobileDetailPage vehicle={page.vehicle} />
{/if}

{#if showDesktopDetail}
	<div id="wrapper">
		<SiteChrome />
		<div class="daynight-detail">
			<DesktopDetailPrimarySection
				vehicle={page.vehicle}
				featureTabs={page.detailFeatureTabs}
				similarVehicles={page.detailSimilarVehicles}
			/>
		</div>
		<DayNightFooter />
	</div>

	<div class="detail-template-trailing">
		<DesktopHomeTrailingChrome />
	</div>
{/if}

<style>
	@media (max-width: 991px) {
		#wrapper {
			display: none;
		}

		.detail-template-trailing {
			display: none;
		}
	}
</style>
