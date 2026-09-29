<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import type { AuxeroAgentCard } from '$lib/auxero/agents';
	import SocialLinks from './SocialLinks.svelte';
	let { person }: { person: Pick<AuxeroAgentCard, 'name' | 'title' | 'image' | 'socials'> } =
		$props();
	const socials = $derived(
		person.socials
			.filter((link) => link.icon === 'brands/instagram.svg')
			.map((link) => ({ platform: 'instagram' as const, label: link.label, href: link.href }))
	);
</script>

<article class="team-card">
	<img
		class="team-card__portrait"
		src={assetHref(person.image)}
		alt={person.name}
		width="600"
		height="700"
		loading="lazy"
	/>
	<div class="team-card__body">
		<h3>{person.name}</h3>
		<p>{person.title}</p>
		{#if socials.length}<div class="team-card__socials"><SocialLinks links={socials} /></div>{/if}
	</div>
</article>

<style>
	.team-card {
		min-width: 0;
		overflow: hidden;
		border-radius: var(--bc-radius-panel);
		background: var(--bc-surface);
	}
	.team-card__portrait {
		display: block;
		width: 100%;
		height: 360px;
		object-fit: cover;
		object-position: top;
	}
	.team-card__body {
		display: grid;
		justify-items: center;
		gap: var(--bc-space-3);
		padding: var(--bc-space-5);
		text-align: center;
	}
	h3 {
		margin: 0 0 var(--bc-space-2);
		font: var(--bc-weight-heading) var(--bc-text-h4)/1.3 var(--bc-font-heading);
	}
	p {
		margin: 0;
		color: var(--bc-copy);
		font-size: var(--bc-text-body);
	}
	.team-card__socials {
		display: contents;
	}
	@media (min-width: 768px) {
		.team-card {
			display: grid;
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: 200px auto 1fr;
			padding: var(--bc-space-3);
			border: 1px solid var(--bc-border);
			background: var(--bc-surface-raised);
			transition: box-shadow var(--bc-motion-standard);
		}
		.team-card:hover,
		.team-card:focus-within {
			box-shadow: var(--bc-shadow-card);
		}
		.team-card__portrait {
			grid-area: 1 / 1;
			height: 100%;
			border-radius: var(--bc-radius-card);
		}
		.team-card__body {
			display: contents;
		}
		h3 {
			grid-area: 2 / 1;
			margin: var(--bc-space-4) var(--bc-space-1) 0;
			font-size: 20px;
			text-align: left;
		}
		p {
			grid-area: 3 / 1;
			margin: var(--bc-space-1) var(--bc-space-1);
			font-size: 14px;
			line-height: 1.5;
			text-align: left;
		}
		.team-card__socials {
			display: block;
			grid-area: 1 / 1;
			align-self: end;
			justify-self: center;
			z-index: 1;
			margin-bottom: var(--bc-space-3);
			transition:
				opacity var(--bc-motion-standard),
				transform var(--bc-motion-standard);
		}
	}
	@media (min-width: 768px) and (hover: hover) and (pointer: fine) {
		.team-card__socials {
			opacity: 0;
			transform: translateY(var(--bc-space-2));
			pointer-events: none;
		}
		.team-card:hover .team-card__socials,
		.team-card:focus-within .team-card__socials {
			opacity: 1;
			transform: translateY(0);
			pointer-events: auto;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.team-card,
		.team-card__socials {
			transition: none;
		}
	}
</style>
