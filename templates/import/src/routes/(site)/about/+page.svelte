<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import type { PageProps } from './$types';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import ProcessSteps from '$lib/components/common/ProcessSteps.svelte';
	import ContactBanner from '$lib/components/common/ContactBanner.svelte';
	import SocialLinks from '$lib/components/common/SocialLinks.svelte';
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
		align="center"
	/>
	<div class="site-container about-socials"><SocialLinks /></div>
	<section class="site-section site-container site-stack" id="about-team">
		<header class="about-heading">
			<h2 class="site-heading">{english ? 'The team' : 'Екипът'}</h2>
		</header>
		<div class="about-team">
			{#each about.consultants as person (person.slug)}<article>
					<img
						src={assetHref(person.image)}
						alt={person.name}
						width="600"
						height="700"
						loading="lazy"
					/>
					<div>
						<h3>{person.name}</h3>
						<p>{person.title}</p>
						<SocialLinks
							links={person.socials
								.filter((link) => link.icon === 'brands/instagram.svg')
								.map((link) => ({
									platform: 'instagram' as const,
									label: link.label,
									href: link.href
								}))}
						/>
					</div>
				</article>{/each}
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
	.about-team article > div {
		display: grid;
		justify-items: center;
		gap: var(--bc-space-3);
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
	.about-team article {
		min-width: 0;
		overflow: hidden;
		border-radius: var(--bc-radius-panel);
		background: var(--bc-surface);
	}
	.about-team img {
		display: block;
		width: 100%;
		height: 360px;
		object-fit: cover;
		object-position: top;
	}
	.about-team article > div {
		padding: var(--bc-space-5);
		text-align: center;
	}
	.about-team h3 {
		margin: 0 0 var(--bc-space-2);
		font: var(--bc-weight-heading) var(--bc-text-h4)/1.3 var(--bc-font-heading);
	}
	.about-team p {
		margin: 0;
		color: var(--bc-copy);
		font-size: var(--bc-text-body-lg);
	}
	@media (max-width: 767.98px) {
		.about-team {
			grid-template-columns: 1fr;
		}
		.about-team p {
			font-size: var(--bc-text-body);
		}
		.about-team img {
			height: 360px;
		}
	}
</style>
