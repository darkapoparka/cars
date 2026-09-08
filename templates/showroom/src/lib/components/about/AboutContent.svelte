<script lang="ts">
	import type { AuxeroAboutContent } from '$lib/auxero/about';
	import PageBanner from '$lib/components/common/PageBanner.svelte';
	import AboutBrandsSection from './AboutBrandsSection.svelte';
	import AboutIntroSection from './AboutIntroSection.svelte';
	import AboutLocationSection from './AboutLocationSection.svelte';
	import AboutMobileSurface from './AboutMobileSurface.svelte';
	import AboutGallerySection from './AboutGallerySection.svelte';
	import EliqVideoSection from '$lib/components/common/EliqVideoSection.svelte';

	let { about }: { about: AuxeroAboutContent } = $props();
</script>

<div id="about-team" class="eliqauto-about-page eliqauto-about-page__anchor" data-eliqauto-about>
	<AboutMobileSurface {about} />
	<PageBanner
		compactDesktop
		showDescription
		desktopTitle="За ELIQ AUTO"
		sectionLinks={[
			{ href: '#about-gallery', label: 'Галерия' },
			{ href: '#about-videos', label: 'Видео' },
			{ href: '#about-services', label: 'Услуги' },
			{ href: '#about-location', label: 'Локация' }
		]}
		banner={{
			...about.hero,
			title: 'За ELIQ AUTO',
			description: 'Автомобили и собствено финансиране в Пазарджик от 2017 г.'
		}}
		leftCutout={{
			src: '/assets/eliqauto/hero/eliq-s-class-cutout-v1.webp',
			variant: 'fleet'
		}}
		cutout={{
			alt: 'Mercedes-Benz S-Class',
			src: '/assets/eliqauto/hero/eliq-s-class-cutout-v1.webp',
			mirror: true,
			variant: 'fleet'
		}}
	/>
	<div id="about-gallery" class="eliqauto-about-page__anchor">
		<AboutGallerySection />
	</div>
	<div id="about-videos" class="eliqauto-about-page__anchor">
		<EliqVideoSection />
	</div>
	<div id="about-brands" class="eliqauto-about-page__anchor">
		<AboutBrandsSection brands={about.brands} />
	</div>
	<section id="about-services" class="eliqauto-about-page__intro eliqauto-about-page__anchor">
		<AboutIntroSection />
	</section>
	<div id="about-location" class="eliqauto-about-page__anchor">
		<AboutLocationSection office={about.office} />
	</div>
</div>

<style>
	.eliqauto-about-page {
		--bc-bg: #fff;
		background: var(--bc-bg);
	}

	.eliqauto-about-page__intro {
		overflow: hidden;
		background: var(--bc-bg);
		padding-block: 36px;
	}

	.eliqauto-about-page__anchor {
		scroll-margin-top: 132px;
	}

	@media (max-width: 767px) {
		.eliqauto-about-page__intro {
			padding-block: 28px;
		}

		.eliqauto-about-page__anchor {
			scroll-margin-top: 164px;
		}
	}
</style>
