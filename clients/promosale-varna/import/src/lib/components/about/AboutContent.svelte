<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import type { AuxeroAboutContent } from '$lib/auxero/about';
	import CenteredRouteHero from '$lib/components/common/CenteredRouteHero.svelte';
	import AboutBrandsSection from './AboutBrandsSection.svelte';
	import AboutConsultantsSection from './AboutConsultantsSection.svelte';
	import AboutIntroSection from './AboutIntroSection.svelte';
	import AboutLocationSection from './AboutLocationSection.svelte';
	import AboutVideosSection from './AboutVideosSection.svelte';
	import { aboutVideos } from '$lib/data/about-videos';

	let { about }: { about: AuxeroAboutContent } = $props();
</script>

<div class="daynight-about-page" data-daynight-about>
	<CenteredRouteHero
		supportText="Подбор, проверка и съдействие до предаването на автомобила."
		image="/assets/daynight/banners/route-about-studio-v6.png"
		leftImage="/dealer/showroom.webp"
		rightImage="/dealer/logo.png"
		labelledby="about-page-title"
		title="За Promosale Varna"
		mobileTitle={about.hero.title}
		mobileDescription={about.hero.description}
	>
		<a class="daynight-route-hero-cta" href={resolve('/contact')}
			>Свържете се с нас <ArrowRight size={18} aria-hidden="true" /></a
		>
		<a
			class="daynight-route-hero-cta daynight-route-hero-cta--secondary"
			href={resolve('/inventory')}>Вижте автомобилите</a
		>
	</CenteredRouteHero>
	<div id="about-team" class="daynight-about-page__anchor">
		<AboutConsultantsSection consultants={about.consultants} />
	</div>
	<AboutVideosSection videos={aboutVideos} />
	<div id="about-brands" class="daynight-about-page__anchor">
		<AboutBrandsSection brands={about.brands} />
	</div>
	<section id="about-services" class="daynight-about-page__intro daynight-about-page__anchor">
		<AboutIntroSection {about} />
	</section>
	<div id="about-location" class="daynight-about-page__anchor">
		<AboutLocationSection office={about.office} />
	</div>
</div>

<style>
	@media (min-width: 768px) {
		.daynight-about-page :global(.daynight-about-services__grid .daynight-service-card) {
			padding: 24px !important;
			border-radius: 16px;
		}
		.daynight-about-page :global(.daynight-about-services__grid .daynight-service-card__media) {
			margin-bottom: 14px !important;
		}
	}

	.daynight-about-page {
		background: var(--bc-bg);
	}

	.daynight-about-page__intro {
		overflow: hidden;
		background: var(--bc-bg);
		padding-top: 38px;
		padding-bottom: 42px;
	}

	.daynight-about-page__anchor {
		scroll-margin-top: 132px;
	}

	@media (max-width: 767px) {
		.daynight-about-page__intro {
			padding-top: 32px;
			padding-bottom: 40px;
		}

		.daynight-about-page__anchor {
			scroll-margin-top: 164px;
		}
	}
	@media (min-width: 768px) {
		.daynight-about-page :global(.daynight-consultants) {
			padding-top: 40px;
		}
		.daynight-about-page :global(.container) {
			width: calc(100% - 64px) !important;
			max-width: var(--bc-page-width) !important;
			margin-inline: auto;
		}
		.daynight-about-page :global(.daynight-about-brands),
		.daynight-about-page :global(.daynight-about-location),
		.daynight-about-page__intro {
			padding-block: 32px;
		}
		.daynight-about-page :global(.daynight-about-services__grid) {
			gap: 24px;
		}
	}
	@media (min-width: 768px) {
		.daynight-about-page :global(.daynight-about-location__panel-head) {
			background: transparent !important;
			border: 0 !important;
			padding: 0 0 12px !important;
			color: var(--bc-ink) !important;
		}
		.daynight-about-page :global(.daynight-about-location__panel-head span),
		.daynight-about-page :global(.daynight-about-location__panel-head strong) {
			color: var(--bc-ink) !important;
		}
	}
</style>
