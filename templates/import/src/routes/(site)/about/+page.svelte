<script lang="ts">
	import type { PageProps } from './$types';
	import { desktopCopy } from '$lib/content/desktop-copy';
	import { aboutPageCopy } from '$lib/content/about-page';
	import DesktopHeroActions from '$lib/components/common/DesktopHeroActions.svelte';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import ProcessSteps from '$lib/components/common/ProcessSteps.svelte';
	import DesktopProcess from '$lib/components/common/DesktopProcess.svelte';
	import ContactLocation from '$lib/components/contact/ContactLocation.svelte';
	import ContactBanner from '$lib/components/common/ContactBanner.svelte';
	import SocialLinks from '$lib/components/common/SocialLinks.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import TeamMemberCard from '$lib/components/common/TeamMemberCard.svelte';
	let { data }: PageProps = $props();
	const english = $derived(data.locale === 'en');
	const copy = $derived(aboutPageCopy[data.locale]);
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
	><title>{copy.pageTitle} — {data.site.identity.name}</title><meta
		name="description"
		content={about.hero.description}
	/></svelte:head
>
<main id="main-content">
	<PageIntro
		title={copy.title}
		mobileAlign="center"
		mobileDescription={copy.mobileCaption}
		description={about.hero.description}
		desktopDescription={desktopCopy[data.locale].aboutCaption}
		image={about.hero.image}
		vehicleArtwork
		artworkPanelWidth="var(--bc-desktop-action-panel-width)"
	>
		{#snippet mobileActions()}
			<div class="about-mobile-actions">
				<Action
					href={about.hero.actions?.[0]?.href ?? '/inventory'}
					variant="secondary"
					size="primary">{copy.mobileCars}<ArrowRight size={18} aria-hidden="true" /></Action
				>
				<Action href={about.hero.actions?.[1]?.href ?? '/contact'} variant="glass" size="primary"
					>{copy.mobileContact}</Action
				>
			</div>
		{/snippet}
		{#snippet desktopActions()}
			<DesktopHeroActions>
				<Action href={about.hero.actions?.[0]?.href ?? '/inventory'} size="primary"
					>{desktopCopy[data.locale].aboutCars}<ArrowRight size={18} aria-hidden="true" /></Action
				>
				<Action
					href={about.hero.actions?.[1]?.href ?? '/contact'}
					variant="secondary"
					size="primary">{desktopCopy[data.locale].aboutContact}</Action
				>
			</DesktopHeroActions>
		{/snippet}
	</PageIntro>
	<div class="site-mobile-only">
		<section class="site-section site-container site-stack">
			<header class="about-heading">
				<h2 class="site-heading">{copy.processTitle}</h2>
			</header>
			{@render processSteps(true)}
		</section>
	</div>
	<section class="site-section site-container site-stack" id="about-team">
		<header class="about-heading">
			<h2 class="site-heading">{copy.teamTitle}</h2>
		</header>
		<div class="about-team">
			{#each about.consultants as person (person.slug)}<TeamMemberCard
					{person}
					mobileCompact
					desktopFramed
				/>{/each}
		</div>
	</section>
	<div class="site-desktop-only">
		<section class="site-section site-container site-stack">
			<header class="about-heading">
				<h2 class="site-heading">{copy.processTitle}</h2>
			</header>
			<DesktopProcess {steps} />
		</section>
	</div>
	<section class="site-section site-container site-desktop-only">
		<ContactLocation {english} desktopFramed />
	</section>
	<section class="site-section site-container about-contact site-mobile-only">
		<ContactBanner {english} title={`${copy.visitLabel} ${data.site.identity.name}`} />
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
		main {
			--bc-bg-strong: var(--bc-editorial-canvas);
			--bc-border: var(--bc-editorial-border);
			--bc-copy: var(--bc-editorial-muted);
			--bc-control: var(--bc-editorial-canvas);
			--bc-surface-hover: var(--bc-editorial-hover);
			background: var(--bc-editorial-canvas);
		}
		.about-mobile-actions {
			display: flex;
			gap: var(--bc-space-3);
		}
		.about-mobile-actions :global(.site-action) {
			flex: 1;
			border-radius: var(--bc-radius-pill);
		}
		.about-heading :global(.site-heading) {
			font-family: var(--bc-font-body);
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
		main {
			--bc-border: var(--bc-desktop-editorial-border);
			--bc-copy: var(--bc-desktop-editorial-muted);
			--bc-surface: var(--bc-desktop-editorial-canvas);
			--bc-control: var(--bc-desktop-editorial-canvas);
			--bc-surface-hover: var(--bc-desktop-editorial-hover);
			--bc-desktop-action-panel-width: var(--bc-desktop-editorial-action-width);
			--bc-desktop-team-image-height: var(--bc-desktop-editorial-portrait-height);
			--desktop-discovery-padding: var(--bc-space-3);
			--desktop-discovery-radius: var(--bc-desktop-editorial-radius);
			--desktop-discovery-shadow: var(--bc-desktop-editorial-shadow);
			background: var(--bc-desktop-editorial-canvas);
		}
		.site-section {
			width: min(calc(100% - var(--bc-space-8) * 2), var(--bc-desktop-editorial-width));
			padding-block: var(--bc-space-8);
		}
		.about-heading :global(.site-heading) {
			font-family: var(--bc-font-body);
			font-size: var(--bc-desktop-editorial-title);
			line-height: var(--bc-leading-h4);
		}
		.about-team {
			width: 100%;
			gap: var(--bc-space-4);
		}
	}
</style>
