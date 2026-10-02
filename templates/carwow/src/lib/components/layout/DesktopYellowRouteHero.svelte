<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import type { Snippet } from 'svelte';
	import { resolve } from '$app/paths';
	import DesktopHeroArtwork from './DesktopHeroArtwork.svelte';
	import {
		desktopOnlyImagePlaceholder,
		desktopOnlySizes,
		desktopOnlySrcset
	} from '$lib/utils/desktop-only-assets';

	type HeroHref = `/${string}`;

	let {
		headingId = 'daynight-route-hero-title',
		title,
		copy,
		primaryLabel,
		primaryHref,
		secondaryLabel,
		secondaryHref,
		sectionId,
		deckWidth = 'standard',
		deckLayout = 'standard',
		artwork = 'cars',
		children
	}: {
		headingId?: string;
		title: string;
		copy?: string;
		primaryLabel?: string;
		primaryHref?: HeroHref;
		secondaryLabel?: string;
		secondaryHref?: HeroHref;
		sectionId?: string;
		deckWidth?: 'standard' | 'wide';
		deckLayout?: 'standard' | 'segmented';
		artwork?: 'cars' | 'contact' | 'services';
		children?: Snippet;
	} = $props();
</script>

<section
	id={sectionId}
	class={[
		'daynight-yellow-route-hero',
		deckLayout === 'standard' && deckWidth === 'wide' && 'daynight-yellow-route-hero--deck-wide',
		deckLayout === 'segmented' && 'daynight-yellow-route-hero--segmented',
		artwork === 'contact' && 'daynight-yellow-route-hero--contact',
		artwork === 'services' && 'daynight-yellow-route-hero--studio'
	]}
	aria-labelledby={headingId}
>
	<div class="daynight-yellow-route-hero__cars" aria-hidden="true">
		{#if artwork === 'contact'}
			{#each ['left', 'right'] as side (side)}
				<div
					class={`daynight-yellow-route-hero__contact-art daynight-yellow-route-hero__contact-art--${side}`}
				>
					<img
						src={i18n.asset(desktopOnlyImagePlaceholder)}
						srcset={desktopOnlySrcset(
							resolve('/assets/daynight-contact/contact-support-cutouts.webp'),
							1536
						)}
						sizes={desktopOnlySizes('48vw')}
						alt=""
						width="1536"
						height="1024"
						decoding="async"
					/>
				</div>
			{/each}
		{:else}
			<DesktopHeroArtwork
				variant={artwork === 'services' ? 'services' : 'cars'}
				panelWidth={deckLayout === 'segmented' ? 640 : deckWidth === 'wide' ? 1040 : 720}
			/>
		{/if}
	</div>

	<div class="daynight-yellow-route-hero__content">
		<h1 id={headingId}>{title}</h1>
		{#if copy}
			<p>{copy}</p>
		{/if}
		{#if children || (primaryLabel && primaryHref)}
			<div class="daynight-yellow-route-hero__deck">
				{#if children}
					{@render children()}
				{:else if primaryLabel && primaryHref}
					<div class="daynight-yellow-route-hero__actions">
						<a
							class="daynight-yellow-route-hero__primary sa-cta sa-cta-primary"
							href={i18n.href(resolve(primaryHref))}
						>
							{primaryLabel}
						</a>
						{#if secondaryLabel && secondaryHref}
							<a
								class="daynight-yellow-route-hero__secondary sa-cta sa-cta-ghost"
								href={i18n.href(resolve(secondaryHref))}
							>
								{secondaryLabel}
							</a>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</section>

<style>
	.daynight-yellow-route-hero {
		background: var(--sa-yellow);
		isolation: isolate;
		min-height: var(--desktop-hero-height);
		overflow: hidden;
		position: relative;
	}

	.daynight-yellow-route-hero__content {
		align-items: center;
		display: flex;
		flex-direction: column;
		margin-inline: auto !important;
		box-sizing: border-box;
		max-width: var(--desktop-content-max);
		padding: var(--desktop-hero-padding-top) 0 var(--desktop-hero-padding-bottom);
		position: relative;
		text-align: center;
		width: var(--desktop-content-width);
		z-index: 2;
	}

	.daynight-yellow-route-hero__cars {
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		position: absolute;
		z-index: 1;
	}

	h1 {
		color: var(--sa-ink);
		font-family: var(--sa-font);
		font-size: var(--sa-text-desktop-hero-title);
		font-weight: var(--sa-weight-heading);
		letter-spacing: var(--desktop-hero-title-tracking);
		line-height: var(--desktop-hero-title-leading);
		margin: 0 !important;
		max-width: 920px;
		text-wrap: balance;
	}
	.daynight-yellow-route-hero--studio {
		background: #141719;
	}
	.daynight-yellow-route-hero--studio h1 {
		color: #fff;
	}

	p {
		color: #282313;
		font-size: var(--sa-type-body);
		font-weight: var(--sa-weight-semibold);
		line-height: 1.4;
		margin: 18px 0 0 !important;
		max-width: 720px;
		text-wrap: balance;
	}

	.daynight-yellow-route-hero__deck {
		--desktop-focus: var(--sa-yellow);
		--desktop-hero-copy: #e2e5e7;
		background: var(--desktop-action-hover);
		color: #fff;
		border-radius: 12px;
		box-sizing: border-box;
		margin: var(--desktop-hero-panel-gap) auto 0 !important;
		max-width: 720px;
		padding: 20px 24px;
		width: 100%;
	}

	.daynight-yellow-route-hero--deck-wide .daynight-yellow-route-hero__deck {
		max-width: 1040px;
	}

	.daynight-yellow-route-hero--segmented .daynight-yellow-route-hero__deck {
		max-width: 640px;
		padding: 0;
	}

	.daynight-yellow-route-hero__actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 12px;
	}

	.daynight-yellow-route-hero__actions .sa-cta {
		flex: 1 1 0;
		min-width: 0;
		max-width: 300px;
	}

	/* Primary actions are yellow on charcoal. Keep this exception within the
  * desktop hero so forms, cards and mobile retain their own button roles. */
	@media (min-width: 992px) {
		.daynight-yellow-route-hero__content {
			min-height: var(--desktop-hero-height);
			justify-content: center;
		}

		.daynight-yellow-route-hero__deck :global(.sa-cta.sa-cta-primary),
		.daynight-yellow-route-hero__deck :global(.desktop-primary-action) {
			background: var(--sa-yellow) !important;
			border-color: var(--sa-yellow) !important;
			color: var(--sa-ink) !important;
		}
		.daynight-yellow-route-hero__deck
			:global(.sa-cta.sa-cta-primary:hover:not(:disabled):not([aria-disabled='true'])),
		.daynight-yellow-route-hero__deck
			:global(.desktop-primary-action:hover:not(:disabled):not([aria-disabled='true'])) {
			background: color-mix(in srgb, var(--sa-yellow) 92%, var(--sa-ink)) !important;
			border-color: color-mix(in srgb, var(--sa-yellow) 92%, var(--sa-ink)) !important;
			color: var(--sa-ink) !important;
		}
		.daynight-yellow-route-hero__deck :global(:is(a, button, input, select):focus-visible) {
			outline: 2px solid var(--sa-yellow) !important;
			outline-offset: 3px !important;
		}
	}

	.daynight-yellow-route-hero__contact-art {
		position: absolute;
		bottom: 0;
		width: clamp(220px, 20vw, 290px);
		height: 100%;
		overflow: hidden;
		pointer-events: none;
	}

	.daynight-yellow-route-hero__contact-art img {
		position: absolute;
		bottom: -8px;
		width: 200% !important;
		max-width: none !important;
		height: auto !important;
	}

	.daynight-yellow-route-hero__contact-art--left {
		left: 0;
	}
	.daynight-yellow-route-hero__contact-art--right {
		right: 0;
		clip-path: inset(0 0 0 12px);
	}
	.daynight-yellow-route-hero__contact-art--left img {
		left: 0;
	}
	.daynight-yellow-route-hero__contact-art--right img {
		right: 0;
	}

	@media (max-width: 991px) {
		.daynight-yellow-route-hero {
			display: none;
		}
	}
</style>
