<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import type { HomeBrandStripItem } from '$lib/data/home-brand-strip';
	import type { HomeDesktopData } from '$lib/types/home';
	import SiteChrome from '$lib/components/layout/SiteChrome.svelte';
	import DesktopHomeBrandStrip from './DesktopHomeBrandStrip.svelte';
	import DesktopHomeFooter from './DesktopHomeFooter.svelte';
	import DesktopHomeHero from './DesktopHomeHero.svelte';
	import DesktopHomeInventoryPreview from './DesktopHomeInventoryPreview.svelte';
	import DesktopHomeReviews from './DesktopHomeReviews.svelte';
	import DesktopHomeVehicleCategories from './DesktopHomeVehicleCategories.svelte';
	import DesktopHomeWhyDayNight from './DesktopHomeWhyDayNight.svelte';
	import DesktopHomeVideos from './DesktopHomeVideos.svelte';

	let { brandStrip, data }: { brandStrip: HomeBrandStripItem[]; data: HomeDesktopData } = $props();
</script>

<div class="daynight-home-shell daynight-home-shell--original">
	<div id="wrapper">
		<SiteChrome />
		<main id="main-content" tabindex="-1">
			<DesktopHomeHero vehicles={data.vehicles} variant="cutouts" />
			<DesktopHomeInventoryPreview
				vehicles={data.vehicles}
				showHeaderCta={true}
				showHeaderSubtitle={false}
			/>
			<DesktopHomeReviews showReviews={false} balancedActionCards />
			<DesktopHomeVehicleCategories
				title={i18n.t('copy.26557fae2714')}
				ctaLabel={i18n.text('Всички типове')}
			/>
			<DesktopHomeBrandStrip
				brands={brandStrip.slice(0, 12)}
				title={i18n.t('copy.de22b27028ed')}
				ctaLabel={i18n.t('copy.0adfd4e68815')}
			/>
			<DesktopHomeWhyDayNight showMetrics={false} variant="campaign-grid" />
			<DesktopHomeVideos />
			<DesktopHomeReviews
				showActionCards={false}
				showHeaderCta={true}
				showBelowCta={false}
				ctaLabel={i18n.text('Виж всички отзиви')}
			/>
		</main>
		<DesktopHomeFooter />
	</div>
</div>
