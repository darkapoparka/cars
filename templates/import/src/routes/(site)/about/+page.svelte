<script lang="ts">
	import type { PageProps } from './$types';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import ProcessSteps from '$lib/components/common/ProcessSteps.svelte';
	import ContactBanner from '$lib/components/common/ContactBanner.svelte';
	import SocialLinks from '$lib/components/common/SocialLinks.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import TeamMemberCard from '$lib/components/common/TeamMemberCard.svelte';
	let { data }: PageProps = $props();
	const english = $derived(data.locale === 'en');
	const about = $derived(data.about);
</script>

<svelte:head
	><title>{english ? 'About' : 'За нас'} — {data.site.identity.name}</title><meta
		name="description"
		content={about.hero.description}
	/></svelte:head
>
<main id="main-content">
	<PageIntro
		title={english ? 'About us' : 'За нас'}
		description={about.hero.description}
		image={about.hero.image}
		desktopImage="/assets/daynight/banners/about-desktop-v2.webp"
		align="center"
	>
		{#snippet desktopActions()}
			<Action href={data.site.contact.mapHref} variant="glass" size="hero"
				><MapPin size={20} aria-hidden="true" />{english
					? 'Get directions'
					: 'Как да стигнем'}</Action
			>
		{/snippet}
		{#snippet desktopSecondaryActions()}
			<SocialLinks tone="dark" />
		{/snippet}
	</PageIntro>
	<div class="site-container about-socials site-mobile-only"><SocialLinks /></div>
	<section class="site-section site-container site-stack" id="about-team">
		<header class="about-heading">
			<h2 class="site-heading">{english ? 'The team' : 'Екипът'}</h2>
		</header>
		<div class="about-team">
			{#each about.consultants as person (person.slug)}<TeamMemberCard {person} />{/each}
		</div>
	</section>
	<section class="site-section site-container site-stack">
		<header class="about-heading">
			<h2 class="site-heading">{english ? 'How we work' : 'Как работим'}</h2>
		</header>
		<ProcessSteps
			steps={about.process.map((step) => ({
				title: step.title.replace(/^\d+\.\s*/, ''),
				text: step.description
			}))}
			horizontal
		/>
	</section>
	<section class="site-section site-container">
		<ContactBanner
			{english}
			title={english ? 'Visit ' + data.site.identity.name : 'Посети ' + data.site.identity.name}
		/>
	</section>
</main>

<style>
	.about-socials {
		padding-top: var(--bc-space-6);
	}
	.about-heading {
		text-align: center;
		max-width: 76ch;
		margin-inline: auto;
	}
	.about-team {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--bc-space-6);
	}
	@media (max-width: 767.98px) {
		.about-team {
			grid-template-columns: 1fr;
		}
	}
	@media (min-width: 768px) {
		#about-team {
			padding-top: var(--bc-space-8);
		}
		.about-team {
			width: 100%;
			max-width: 900px;
			margin-inline: auto;
		}
	}
</style>
