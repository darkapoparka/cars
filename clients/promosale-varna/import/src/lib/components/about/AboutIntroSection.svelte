<script lang="ts">
	import type { AuxeroAboutContent } from '$lib/auxero/about';
	import ServiceCard from '$lib/components/common/ServiceCard.svelte';
	import AboutSectionHeader from './AboutSectionHeader.svelte';

	let { about }: { about: AuxeroAboutContent } = $props();
</script>

<div class="container">
	<section class="daynight-about-story wow fadeInUp" data-wow-delay="0.1s">
		<AboutSectionHeader heading={about.intro.heading} description={about.intro.description} />

		<div class="daynight-about-services__grid" aria-label={about.intro.heading}>
			{#each about.profile.steps as step, index (step.title)}
				<ServiceCard
					className="daynight-about-service"
					ctaLabel="Научи повече"
					delay={`0.${(index % 4) + 1}s`}
					description={step.description}
					href={step.href}
					image={step.image}
					title={step.title}
				/>
			{/each}
		</div>
	</section>
</div>

<style>
	.daynight-about-story {
		display: block;
	}

	.daynight-about-services__grid {
		display: grid;
		gap: 30px;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	@media (max-width: 1199px) {
		.daynight-about-services__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 767px) {
		.daynight-about-services__grid {
			grid-template-columns: 1fr;
		}
	}
</style>
