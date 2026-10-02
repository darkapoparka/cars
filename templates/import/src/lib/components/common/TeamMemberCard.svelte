<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import type { AuxeroAgentCard } from '$lib/auxero/agents';
	import SocialLinks from './SocialLinks.svelte';
	let {
		person,
		mobileCompact = false,
		desktopFramed = false
	}: {
		person: Pick<AuxeroAgentCard, 'name' | 'title' | 'image' | 'socials' | 'desktopPortrait'>;
		mobileCompact?: boolean;
		desktopFramed?: boolean;
	} = $props();
	const socials = $derived(
		person.socials
			.filter((link) => link.icon === 'brands/instagram.svg')
			.map((link) => ({ platform: 'instagram' as const, label: link.label, href: link.href }))
	);
</script>

<article
	class="team-card"
	class:team-card--mobile-compact={mobileCompact}
	class:team-card--has-socials={socials.length > 0}
	class:team-card--desktop-framed={desktopFramed}
>
	<div class="team-card__media">
		<img
			class="team-card__portrait"
			style:--team-portrait-position={person.desktopPortrait?.position}
			style:--team-portrait-scale={person.desktopPortrait?.scale}
			src={assetHref(person.image)}
			alt={person.name}
			width="600"
			height="700"
			loading="lazy"
		/>
	</div>
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
	.team-card__media {
		display: contents;
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
			position: relative;
			display: flex;
			flex-direction: column;
			border: 1px solid var(--bc-border);
			background: var(--bc-surface-raised);
			border-radius: var(--bc-radius-card);
			transition: box-shadow var(--bc-motion-standard);
		}
		.team-card:hover,
		.team-card:focus-within {
			box-shadow: var(--bc-shadow-card);
		}
		.team-card__media {
			display: block;
			flex-shrink: 0;
			overflow: hidden;
			height: var(--bc-desktop-team-image-height);
		}
		.team-card__portrait {
			height: 100%;
			object-position: var(--team-portrait-position, center 25%);
			transform: scale(var(--team-portrait-scale, 1));
			transform-origin: var(--team-portrait-position, center 25%);
		}
		.team-card__body {
			flex: 1;
			justify-items: start;
			align-content: start;
			gap: var(--bc-space-2);
			padding: var(--bc-space-4);
			text-align: left;
		}
		h3 {
			margin: 0;
			font-family: var(--bc-font-body);
			font-size: var(--bc-text-cta);
		}
		p {
			font-size: var(--bc-text-body);
			line-height: var(--bc-leading-body-lg);
		}
		.team-card__socials {
			position: absolute;
			top: calc(
				var(--bc-desktop-team-image-height) - var(--bc-control-height-primary) - var(--bc-space-3)
			);
			right: var(--bc-space-4);
			display: block;
			z-index: 1;
			transition:
				opacity var(--bc-motion-standard),
				transform var(--bc-motion-standard);
		}
		.team-card--desktop-framed {
			padding: var(--bc-space-2);
			border-color: var(--bc-desktop-editorial-border);
			border-radius: var(--bc-desktop-editorial-radius);
			box-shadow: var(--bc-desktop-editorial-shadow);
		}
		.team-card--desktop-framed .team-card__media {
			--team-portrait-position: center 10%;
			border-radius: var(--bc-desktop-editorial-photo-radius);
		}
		.team-card--desktop-framed .team-card__body {
			padding: var(--bc-space-4) var(--bc-space-3);
		}
		.team-card--desktop-framed .team-card__socials {
			top: calc(
				var(--bc-desktop-team-image-height) + var(--bc-space-2) - var(--bc-control-height-primary) -
					var(--bc-space-3)
			);
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

	@media (max-width: 767.98px) {
		.team-card {
			display: grid;
			grid-template-columns: 104px minmax(0, 1fr);
			align-items: stretch;
			border: 1px solid var(--bc-border);
			background: var(--bc-white);
		}
		.team-card__portrait {
			width: 104px;
			height: 100%;
			min-height: 144px;
			object-position: center 25%;
		}
		.team-card__body {
			min-width: 0;
			justify-items: start;
			align-content: center;
			text-align: left;
			gap: var(--bc-space-2);
			padding: var(--bc-space-3);
		}
		h3 {
			margin: 0;
			font-size: var(--bc-text-h4);
			overflow-wrap: anywhere;
		}
		p {
			font-size: var(--bc-text-body);
			line-height: var(--bc-leading-body);
		}
		.team-card--mobile-compact {
			grid-template-columns: 64px minmax(0, 1fr);
			align-items: center;
			gap: var(--bc-space-3);
			padding: var(--bc-space-4);
			box-shadow: var(--bc-editorial-shadow);
		}
		.team-card--mobile-compact .team-card__portrait {
			width: 64px;
			height: 64px;
			min-height: 0;
			border-radius: var(--bc-radius-pill);
		}
		.team-card--mobile-compact .team-card__body {
			padding: 0;
			gap: var(--bc-space-1);
		}
		.team-card--mobile-compact h3 {
			grid-column: 1 / -1;
			font-family: var(--bc-font-body);
			font-size: var(--bc-mobile-card-title);
			line-height: var(--bc-mobile-card-title-leading);
		}
		.team-card--mobile-compact p {
			min-block-size: calc(var(--bc-mobile-body-leading) * 2);
			align-content: center;
			line-height: var(--bc-mobile-body-leading);
		}
		.team-card--mobile-compact.team-card--has-socials .team-card__body {
			grid-template-columns: minmax(0, 1fr) var(--bc-control-height-primary);
			column-gap: var(--bc-space-2);
		}
		.team-card--mobile-compact .team-card__socials {
			display: block;
			grid-column: 2;
			grid-row: 2;
			align-self: center;
		}
	}
</style>
