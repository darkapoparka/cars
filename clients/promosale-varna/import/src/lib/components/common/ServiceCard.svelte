<script lang="ts">
	import { resolve } from '$app/paths';

	let {
		compact = false,
		className,
		ctaLabel,
		delay,
		description,
		href,
		image,
		imageAlt,
		title
	}: {
		compact?: boolean;
		className?: string;
		ctaLabel?: string;
		delay?: string;
		description: string;
		href: string;
		image: string;
		imageAlt?: string;
		title: string;
	} = $props();

	const resolvedImageAlt = $derived(imageAlt ?? title);
</script>

<article
	class={[
		'service-box daynight-service-card wow fadeInUp',
		className,
		compact && 'daynight-service-card--compact',
		ctaLabel && 'daynight-service-card--has-cta'
	]}
	data-wow-delay={delay}
>
	<a
		class="daynight-service-card__media radius-16 mb-22 overflow-hidden"
		href={resolve(href as '/')}
	>
		<img class="w-full" src={image} alt={resolvedImageAlt} loading="lazy" />
	</a>

	<a href={resolve(href as '/')} class="daynight-service-card__title h4 font-weight-600 mb-8">
		{title}
	</a>

	<p class="daynight-service-card__description text-secondary">{description}</p>

	{#if ctaLabel}
		<a
			class="daynight-service-card__cta"
			href={resolve(href as '/')}
			aria-label={`${ctaLabel}: ${title}`}
		>
			{ctaLabel}
			<svg
				width="15"
				height="15"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.4"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M5 12h14" />
				<path d="M13 6l6 6-6 6" />
			</svg>
		</a>
	{/if}
</article>

<style>
	.daynight-service-card {
		display: flex;
		height: 100%;
		min-width: 0;
		flex-direction: column;
		border: 0 !important;
		background: var(--bc-surface) !important;
		box-shadow: none !important;
		color: #1c1c1c;
		text-decoration: none;
		transform: none !important;
		transition:
			background-color 0.2s ease,
			color 0.2s ease !important;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-service-card:hover,
		.daynight-service-card:focus-within {
			border: 0 !important;
			background: var(--bc-surface-hover) !important;
			box-shadow: none !important;
			transform: none !important;
		}
	}

	.daynight-service-card__media {
		display: block;
		aspect-ratio: 16 / 9;
		background: var(--bc-surface-soft);
	}

	.daynight-service-card__media img {
		height: 100%;
		object-fit: cover;
	}

	.daynight-service-card__title {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		margin-block: -6px;
		color: #1c1c1c;
		padding-block: 6px;
		text-decoration: none;
		transition: color 0.18s ease;
	}

	.daynight-service-card__title:hover,
	.daynight-service-card__title:focus-visible {
		color: var(--bc-accent);
		text-decoration: none;
	}

	.daynight-service-card__description {
		display: block;
		margin-bottom: 0;
		color: #696665;
		font-size: 14px;
		font-weight: 500;
		line-height: 1.5;
	}

	.daynight-service-card__cta {
		--service-card-cta-icon-color: #ffffff;

		display: inline-flex;
		width: fit-content;
		min-height: 44px;
		align-items: center;
		margin-top: 20px;
		border-radius: var(--bc-radius-control);
		background: var(--bc-accent);
		padding: 0 14px;
		gap: 8px;
		color: #ffffff !important;
		font-size: 16px;
		font-weight: 600;
		line-height: 1;
		text-decoration: none;
		transition:
			background-color 0.16s ease,
			color 0.16s ease;
	}

	.daynight-service-card__cta svg {
		flex: 0 0 auto;
		color: inherit !important;
	}

	.daynight-service-card__cta svg path {
		color: var(--service-card-cta-icon-color) !important;
		stroke: var(--service-card-cta-icon-color) !important;
	}

	.daynight-service-card__cta:hover,
	.daynight-service-card__cta:focus-visible,
	.daynight-service-card:hover .daynight-service-card__cta {
		--service-card-cta-icon-color: var(--bc-hover-accent-ink);

		background: var(--bc-hover-accent);
		color: var(--bc-hover-accent-ink) !important;
		text-decoration: none;
	}

	.daynight-service-card--compact {
		border: 1px solid var(--bc-border) !important;
		border-radius: 8px;
		overflow: hidden;
		padding: 0 !important;
	}

	.daynight-service-card--compact .daynight-service-card__media {
		border-radius: 0 !important;
		margin-bottom: 0 !important;
	}

	.daynight-service-card--compact .daynight-service-card__title,
	.daynight-service-card--compact .daynight-service-card__description,
	.daynight-service-card--compact .daynight-service-card__cta {
		margin-inline: 16px;
	}

	.daynight-service-card--compact .daynight-service-card__title {
		margin-top: 14px;
		margin-bottom: 0 !important;
		font-size: 16px;
		line-height: 1.3;
	}

	.daynight-service-card--compact .daynight-service-card__description {
		font-size: 13.5px;
	}

	.daynight-service-card--compact .daynight-service-card__cta {
		margin-top: 20px;
		margin-bottom: 16px;
	}

	@media (max-width: 767px) {
		.daynight-service-card__description {
			-webkit-line-clamp: initial;
			line-clamp: initial;
		}

		.daynight-service-card__cta {
			min-height: 44px;
		}
	}
</style>
