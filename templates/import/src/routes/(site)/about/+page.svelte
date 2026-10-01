<script lang="ts">
	import type { PageProps } from './$types';
	import { desktopCopy } from '$lib/content/desktop-copy';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import ProcessSteps from '$lib/components/common/ProcessSteps.svelte';
	import ContactBanner from '$lib/components/common/ContactBanner.svelte';
	import SocialLinks from '$lib/components/common/SocialLinks.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import TeamMemberCard from '$lib/components/common/TeamMemberCard.svelte';
	let { data }: PageProps = $props();
	const english = $derived(data.locale === 'en');
	const about = $derived(data.about);
	const steps = $derived(
		about.process.map((step) => ({
			title: step.title.replace(/^\d+\.\s*/, ''),
			text: step.description,
			mobileText: step.mobileDescription
		}))
	);
</script>

{#snippet processSteps(mobilePanel: boolean)}
	<ProcessSteps {steps} horizontal {mobilePanel} />
{/snippet}

<svelte:head
	><title>{english ? 'About' : 'За нас'} — {data.site.identity.name}</title><meta
		name="description"
		content={about.hero.description}
	/></svelte:head
>
<main id="main-content">
	<PageIntro
		title={english ? 'About us' : 'За нас'}
		mobileAlign="center"
		mobileDescription={english
			? 'Car sourcing, import and checks before you buy.'
			: 'Подбор, внос и проверка на автомобили.'}
		description={about.hero.description}
		desktopDescription={desktopCopy[data.locale].aboutCaption}
		image={about.hero.image}
		desktopImage="/assets/daynight/banners/about-desktop-v2.webp"
		align="center"
	>
		{#snippet mobileActions()}
			<div class="about-mobile-actions">
				<Action
					href={about.hero.actions?.[0]?.href ?? '/inventory'}
					variant="secondary"
					size="primary"
					>{english ? 'Cars' : 'Коли'}<ArrowRight size={18} aria-hidden="true" /></Action
				>
				<Action href={about.hero.actions?.[1]?.href ?? '/contact'} variant="glass" size="primary"
					>{english ? 'Contact' : 'Контакти'}</Action
				>
			</div>
		{/snippet}
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
	<div class="site-mobile-only">
		<section class="site-section site-container site-stack">
			<header class="about-heading">
				<h2 class="site-heading">{english ? 'How we work' : 'Как работим'}</h2>
			</header>
			{@render processSteps(true)}
		</section>
	</div>
	<section class="site-section site-container site-stack" id="about-team">
		<header class="about-heading">
			<h2 class="site-heading">{english ? 'The team' : 'Екипът'}</h2>
		</header>
		<div class="about-team">
			{#each about.consultants as person (person.slug)}<TeamMemberCard
					{person}
					mobileCompact
				/>{/each}
		</div>
	</section>
	<div class="site-desktop-only">
		<section class="site-section site-container site-stack">
			<header class="about-heading">
				<h2 class="site-heading">{english ? 'How we work' : 'Как работим'}</h2>
			</header>
			{@render processSteps(false)}
		</section>
	</div>
	<section class="site-section site-container about-contact">
		<ContactBanner
			{english}
			title={english ? 'Visit ' + data.site.identity.name : 'Посети ' + data.site.identity.name}
		/>
		<div class="about-socials site-mobile-only"><SocialLinks /></div>
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
		.about-mobile-actions {
			display: flex;
			gap: var(--bc-space-3);
		}
		.about-mobile-actions :global(.site-action) {
			flex: 1;
			border-radius: var(--bc-radius-pill);
		}
		.about-heading :global(.site-heading) {
			font-size: var(--bc-mobile-section-title);
			line-height: var(--bc-mobile-section-title-leading);
		}
		.about-team {
			grid-template-columns: 1fr;
			gap: var(--bc-space-3);
		}
		.about-contact :global(.contact-banner h2) {
			font-size: var(--bc-mobile-section-title);
			line-height: var(--bc-mobile-section-title-leading);
		}
		.about-contact :global(.contact-banner p) {
			font-size: var(--bc-mobile-body);
			line-height: var(--bc-mobile-body-leading);
		}
	}
	@media (min-width: 768px) {
		#about-team {
			padding-top: var(--bc-space-6);
		}
		.about-team {
			width: 100%;
			max-width: var(--bc-desktop-team-width);
			margin-inline: auto;
		}
	}
</style>
