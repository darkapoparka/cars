<script lang="ts">
	import { getDayNightVehicleAvailability } from '$lib/data/daynight-vehicles';
	import SiteChrome from '$lib/components/layout/SiteChrome.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import DayNightFooter from '$lib/components/layout/DayNightFooter.svelte';
	import DesktopDetailPrimarySection from './DesktopDetailPrimarySection.svelte';
	import MobileDetailPage from '$lib/components/detail/mobile/MobileDetailPage.svelte';
	import DesktopHomeTrailingChrome from '$lib/components/home/desktop/DesktopHomeTrailingChrome.svelte';
	import type { VehicleDetailPageData } from '$lib/types/storefront-page';
	import { daynightSite } from '$lib/data/daynight-site';
	import { getViewportContext } from '$lib/hooks/viewport.svelte';
	import DesktopStylesheet from '$lib/components/layout/DesktopStylesheet.svelte';
	import { page as appState } from '$app/state';
	// Desktop-only PDP styles, loaded through a viewport-checked bootstrap so phones
	// (which render MobileDetailPage) never download them. Mirrors HomePage.svelte.
	import desktopDetailCss from '$lib/styles/daynight-detail-desktop.css?url';

	let { page }: { page: VehicleDetailPageData } = $props();

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
				priceCurrency: daynightSite.currency,
				availability:
					getDayNightVehicleAvailability(vehicle) === 'incoming'
						? 'https://schema.org/PreOrder'
						: 'https://schema.org/InStock',
				url: appState.url ? appState.url.origin + appState.url.pathname : '',
				seller: { '@type': 'AutoDealer', name: daynightSite.shortName }
			}
		}).replaceAll('<', '\\u003c')
	);

	const viewport = getViewportContext();
</script>

<RouteSeo
	title={page.title}
	description={page.description}
	ogImage={vehicle.image}
	ogType="product"
/>
<svelte:head>
	<svelte:element this={'script'} type="application/ld+json">{vehicleJsonLd}</svelte:element>
</svelte:head>
<DesktopStylesheet id="daynight-detail-desktop-css" href={desktopDetailCss} />
{#if viewport.mobile}
	<MobileDetailPage vehicle={page.vehicle} />
{:else}
	<div id="wrapper">
		<SiteChrome />
		<main id="main-content" tabindex="-1" class="daynight-detail">
			<DesktopDetailPrimarySection
				vehicle={page.vehicle}
				featureTabs={page.detailFeatureTabs}
				similarVehicles={page.detailSimilarVehicles}
			/>
		</main>
		<DayNightFooter />
	</div>

	<div class="detail-template-trailing">
		<DesktopHomeTrailingChrome />
	</div>
{/if}
