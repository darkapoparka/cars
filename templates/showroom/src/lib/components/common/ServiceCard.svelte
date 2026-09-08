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
		surface = 'soft',
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
		surface?: 'soft' | 'raised';
		title: string;
	} = $props();

	const resolvedImageAlt = $derived(imageAlt ?? title);
</script>

<article
	class={[
		'service-box eliqauto-service-card wow fadeInUp',
		className,
		compact && 'eliqauto-service-card--compact',
		surface === 'raised' && 'eliqauto-service-card--raised',
		ctaLabel && 'eliqauto-service-card--has-cta'
	]}
	data-wow-delay={delay}
>
	<a
		class="eliqauto-service-card__media radius-16 mb-22 overflow-hidden"
		href={resolve(href as '/')}
	>
		<img class="w-full" src={image} alt={resolvedImageAlt} loading="lazy" />
	</a>

	<a href={resolve(href as '/')} class="eliqauto-service-card__title h4 font-weight-600 mb-8">
		{title}
	</a>

	<p class="eliqauto-service-card__description text-secondary">{description}</p>

	{#if ctaLabel}
		<a
			class="eliqauto-service-card__cta"
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
	.eliqauto-service-card {
		display: flex;
		height: 100%;
		min-width: 0;
		flex-direction: column;
		border: 0;
		background: var(--bc-surface);
		box-shadow: none;
		color: #1c1c1c;
		text-decoration: none;
		transform: none;
		transition:
			background-color 0.2s ease,
			color 0.2s ease;
	}

	.eliqauto-service-card--raised {
		background: var(--bc-surface-raised);
	}

	@media (hover: hover) and (pointer: fine) {
		.eliqauto-service-card:hover,
		.eliqauto-service-card:focus-within {
			border: 0;
			background: var(--bc-surface-hover);
			box-shadow: none;
			transform: none;
		}

		.eliqauto-service-card--raised:hover,
		.eliqauto-service-card--raised:focus-within {
			background: var(--bc-surface-raised);
		}
	}

	.eliqauto-service-card__media {
		display: block;
		aspect-ratio: 16 / 9;
		background: var(--bc-surface-soft);
	}

	.eliqauto-service-card__media img {
		height: 100%;
		object-fit: cover;
	}

	.eliqauto-service-card__title {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		margin-block: -6px;
		color: #1c1c1c;
		padding-block: 6px;
		text-decoration: none;
		transition: color 0.18s ease;
	}

	.eliqauto-service-card__title:hover,
	.eliqauto-service-card__title:focus-visible {
		color: var(--bc-accent);
		text-decoration: none;
	}

	.eliqauto-service-card__description {
		display: -webkit-box;
		min-height: 42px;
		margin-bottom: 0;
		overflow: hidden;
		-webkit-box-orient: vertical;
		color: var(--bc-muted);
		font-size: 15px;
		font-weight: 500;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		line-height: 1.55;
	}

	.eliqauto-service-card__cta {
		--service-card-cta-icon-color: #ffffff;

		display: inline-flex;
		width: fit-content;
		min-height: var(--bc-touch);
		align-items: center;
		margin-top: 20px;
		border-radius: 999px;
		background: var(--bc-ink);
		padding: 0 16px;
		gap: 8px;
		color: #ffffff;
		font-size: var(--bc-text-control);
		font-weight: 700;
		line-height: 1;
		text-decoration: none;
		transition:
			background-color 0.16s ease,
			color 0.16s ease;
	}

	.eliqauto-service-card__cta svg {
		flex: 0 0 auto;
		color: inherit;
	}

	.eliqauto-service-card__cta svg path {
		color: var(--service-card-cta-icon-color);
		stroke: var(--service-card-cta-icon-color);
	}

	.eliqauto-service-card__cta:hover,
	.eliqauto-service-card__cta:focus-visible,
	.eliqauto-service-card:hover .eliqauto-service-card__cta {
		--service-card-cta-icon-color: var(--bc-hover-accent-ink);

		background: var(--bc-hover-accent);
		color: var(--bc-hover-accent-ink);
		text-decoration: none;
	}

	.eliqauto-service-card--compact {
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		overflow: hidden;
		padding: 0;
	}

	.eliqauto-service-card--compact .eliqauto-service-card__media {
		border-radius: 0;
		margin-bottom: 0;
	}

	.eliqauto-service-card--compact .eliqauto-service-card__title,
	.eliqauto-service-card--compact .eliqauto-service-card__description,
	.eliqauto-service-card--compact .eliqauto-service-card__cta {
		margin-inline: 16px;
	}

	.eliqauto-service-card--compact .eliqauto-service-card__title {
		margin-top: 14px;
		margin-bottom: 0;
		font-size: 16px;
		line-height: 1.3;
	}

	.eliqauto-service-card--compact .eliqauto-service-card__description {
		font-size: 14.5px;
	}

	.eliqauto-service-card--compact .eliqauto-service-card__cta {
		margin-top: 20px;
		margin-bottom: 16px;
	}

	@media (max-width: 767px) {
		.eliqauto-service-card__description {
			-webkit-line-clamp: initial;
			line-clamp: initial;
		}

		.eliqauto-service-card__cta {
			min-height: 44px;
		}
	}
</style>
