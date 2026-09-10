<script lang="ts">
	import type { Snippet } from 'svelte';
	import { resolve } from '$lib/utils/preview-paths';
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
		panel = 'dark',
		compact = false,
		artwork = 'cars',
		rail,
		afterPanel,
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
		panel?: 'dark' | 'light';
		compact?: boolean;
		artwork?: 'cars' | 'contact';
		rail?: Snippet;
		afterPanel?: Snippet;
		children?: Snippet;
	} = $props();

	const leftCarSrc =
		'/variant-3/assets/daynight-auto-v3/class-a-cutouts/transparent-webp/audi-q5-silver-right-hero-1400.webp';
	const rightCarSrc =
		'/variant-3/assets/daynight-auto-v3/class-a-cutouts/transparent-webp/bmw-x5-dark-grey-left-hero-1400.webp';
</script>

<section
	id={sectionId}
	class={[
		'daynight-yellow-route-hero',
		rail && 'daynight-yellow-route-hero--with-rail',
		compact && 'daynight-yellow-route-hero--compact',
		artwork === 'contact' && 'daynight-yellow-route-hero--contact'
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
						src={desktopOnlyImagePlaceholder}
						srcset={desktopOnlySrcset(
							resolve('/variant-3/assets/daynight-contact/contact-support-cutouts.webp'),
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
			<img
				class="daynight-yellow-route-hero__car daynight-yellow-route-hero__car--left"
				src={resolve(leftCarSrc)}
				alt=""
				width="1400"
				height="933"
				loading="eager"
				decoding="async"
			/>
			<img
				class="daynight-yellow-route-hero__car daynight-yellow-route-hero__car--right"
				src={resolve(rightCarSrc)}
				alt=""
				width="1400"
				height="933"
				loading="eager"
				decoding="async"
			/>
		{/if}
	</div>

	<div class="daynight-yellow-route-hero__content">
		<h1 id={headingId}>{title}</h1>
		{#if copy}
			<p>{copy}</p>
		{/if}

		{#if children || (primaryLabel && primaryHref)}
			<div
				class={[
					'daynight-yellow-route-hero__deck',
					panel === 'light' && 'daynight-yellow-route-hero__deck--light'
				]}
			>
				{#if children}
					{@render children()}
				{:else if primaryLabel && primaryHref}
					<div class="daynight-yellow-route-hero__actions">
						<a
							class="daynight-yellow-route-hero__primary sa-cta sa-cta-primary"
							href={resolve(primaryHref)}
						>
							{primaryLabel}
						</a>
						{#if secondaryLabel && secondaryHref}
							<a
								class="daynight-yellow-route-hero__secondary sa-cta sa-cta-ghost"
								href={resolve(secondaryHref)}
							>
								{secondaryLabel}
							</a>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
		{#if afterPanel}{@render afterPanel()}{/if}
	</div>

	{#if rail}
		<div class="daynight-yellow-route-hero__rail">
			{@render rail()}
		</div>
	{/if}
</section>

<style>
	.daynight-yellow-route-hero {
		background: var(--sa-yellow);
		isolation: isolate;
		min-height: 390px;
		overflow: hidden;
		position: relative;
	}

	.daynight-yellow-route-hero__content {
		align-items: center;
		display: flex;
		flex-direction: column;
		margin-inline: auto !important;
		max-width: 1180px;
		padding: 54px 24px 34px;
		position: relative;
		text-align: center;
		width: calc(100% - 48px);
		z-index: 2;
	}

	.daynight-yellow-route-hero--with-rail {
		overflow: visible;
	}

	.daynight-yellow-route-hero--with-rail .daynight-yellow-route-hero__content {
		padding-bottom: 16px;
		padding-top: 42px;
	}

	.daynight-yellow-route-hero--with-rail .daynight-yellow-route-hero__deck {
		margin-top: 22px !important;
	}

	.daynight-yellow-route-hero__rail {
		box-sizing: border-box;
		margin: 0 auto 18px !important;
		max-width: 1440px;
		position: relative;
		width: calc(100% - 48px);
		z-index: 4;
	}

	.daynight-yellow-route-hero__cars {
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		position: absolute;
		z-index: 1;
	}

	.daynight-yellow-route-hero--with-rail
		.daynight-yellow-route-hero__rail
		:global(.daynight-inventory-filter-region),
	.daynight-yellow-route-hero--with-rail
		.daynight-yellow-route-hero__rail
		:global(.daynight-inventory-filter-region .daynight-inventory-band),
	.daynight-yellow-route-hero--with-rail
		.daynight-yellow-route-hero__rail
		:global(.daynight-inventory-band .daynight-inventory-controls-shell),
	.daynight-yellow-route-hero--with-rail
		.daynight-yellow-route-hero__rail
		:global(.daynight-inventory-controls-shell .row),
	.daynight-yellow-route-hero--with-rail
		.daynight-yellow-route-hero__rail
		:global(.row .daynight-inventory-controls) {
		box-sizing: border-box;
		margin: 0 !important;
		max-width: none !important;
		padding: 0 !important;
		width: 100% !important;
	}

	.daynight-yellow-route-hero--with-rail
		.daynight-yellow-route-hero__rail
		:global(.daynight-inventory-filter-region .daynight-inventory-band) {
		background: transparent !important;
	}

	.daynight-yellow-route-hero--with-rail
		.daynight-yellow-route-hero__rail
		:global(.daynight-inventory-filter-region .daynight-inventory-band::before) {
		content: none !important;
		display: none !important;
	}

	.daynight-yellow-route-hero--with-rail
		.daynight-yellow-route-hero__rail
		:global(.daynight-inventory-controls .daynight-inventory-quick-form) {
		backdrop-filter: none !important;
		background: #f7f8fa !important;
		border: 0 !important;
		box-shadow: none !important;
	}

	.daynight-yellow-route-hero--with-rail
		.daynight-yellow-route-hero__rail
		:global(.daynight-inventory-quick-form .daynight-inventory-filter-dropdown),
	.daynight-yellow-route-hero--with-rail
		.daynight-yellow-route-hero__rail
		:global(.daynight-inventory-quick-form .daynight-inventory-quick-sidebar) {
		background: #fff !important;
		border: 1px solid #d5dae1 !important;
		color: var(--sa-ink) !important;
	}

	.daynight-yellow-route-hero--with-rail
		.daynight-yellow-route-hero__rail
		:global(.daynight-inventory-quick-form .daynight-inventory-type-pill) {
		background: #fff !important;
		border-color: #d5dae1 !important;
		color: #252b32 !important;
	}

	.daynight-yellow-route-hero--with-rail
		.daynight-yellow-route-hero__rail
		:global(.daynight-inventory-quick-form .daynight-inventory-type-pill:hover) {
		background: #eef0f3 !important;
		border-color: #bcc3cc !important;
	}

	.daynight-yellow-route-hero--with-rail
		.daynight-yellow-route-hero__rail
		:global(
			.daynight-inventory-quick-form .daynight-inventory-type-pill:is(.is-active, .is-selected)
		) {
		background: var(--sa-red) !important;
		border-color: var(--sa-red) !important;
		color: #fff !important;
	}

	.daynight-yellow-route-hero--with-rail .daynight-yellow-route-hero__car {
		bottom: 0;
	}

	h1 {
		color: var(--sa-ink);
		font-family: var(--sa-font);
		font-size: var(--sa-text-desktop-hero-title);
		font-weight: 900;
		letter-spacing: var(--sa-tracking-desktop-hero-title);
		line-height: var(--sa-leading-desktop-hero-title);
		margin: 0 !important;
		max-width: 920px;
		text-wrap: balance;
	}

	p {
		color: #282313;
		font-size: clamp(17px, 1.35vw, 20px);
		font-weight: 650;
		line-height: 1.4;
		margin: 18px 0 0 !important;
		max-width: 720px;
		text-wrap: balance;
	}

	.daynight-yellow-route-hero__deck {
		background: #171717;
		border-radius: 14px;
		box-sizing: border-box;
		margin: 28px auto 0 !important;
		max-width: 780px;
		padding: 14px;
		width: 100%;
	}

	.daynight-yellow-route-hero__actions {
		display: grid;
		gap: 10px;
		grid-template-columns: minmax(220px, 1fr) minmax(220px, 1fr);
	}

	.daynight-yellow-route-hero__deck--light {
		background: var(--desktop-panel);
		box-shadow: none;
	}

	.daynight-yellow-route-hero--compact .daynight-yellow-route-hero__deck {
		max-width: 720px;
		padding: 0;
	}

	.daynight-yellow-route-hero--compact .daynight-yellow-route-hero__content {
		padding-block: 40px;
	}

	.daynight-yellow-route-hero--contact .daynight-yellow-route-hero__deck {
		max-width: 680px;
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

	.daynight-yellow-route-hero__actions a {
		align-items: center;
		border: 1px solid transparent;
		border-radius: 9px;
		display: inline-flex;
		font-size: var(--sa-text-desktop-action-sm, 16px);
		font-weight: 800;
		justify-content: center;
		min-height: 48px;
		padding: 0 20px;
		text-decoration: none;
		transition:
			background-color 160ms ease,
			border-color 160ms ease;
	}

	.daynight-yellow-route-hero__primary {
		background: var(--sa-red);
		color: #fff;
	}

	.daynight-yellow-route-hero__primary:hover {
		background: var(--sa-red-strong);
	}

	.daynight-yellow-route-hero__secondary.sa-cta-ghost {
		background: #fff;
		color: var(--sa-ink);
	}

	.daynight-yellow-route-hero__secondary.sa-cta-ghost:hover {
		background: #f2f2f2;
	}

	.daynight-yellow-route-hero__actions a:focus-visible {
		outline: 3px solid #fff;
		outline-offset: 3px;
	}

	.daynight-yellow-route-hero__car {
		bottom: -18px;
		height: auto;
		max-height: 280px;
		max-width: min(35vw, 500px);
		object-fit: contain;
		pointer-events: none;
		position: absolute;
		user-select: none;
		width: auto;
		z-index: 1;
	}

	.daynight-yellow-route-hero__car--left {
		left: -46px;
		object-position: left bottom;
	}

	.daynight-yellow-route-hero__car--right {
		object-position: right bottom;
		right: -46px;
	}

	:global(.daynight-yellow-route-hero .daynight-inventory-searchbar__label) {
		color: #fff;
		font-size: 13px;
		font-weight: 700;
		margin: 0 0 7px;
		text-align: left;
	}

	:global(.daynight-yellow-route-hero .daynight-inventory-search) {
		align-items: stretch;
		background: #fff;
		border-radius: 9px;
		display: grid;
		grid-template-columns: 1fr 148px;
		overflow: hidden;
	}

	:global(.daynight-yellow-route-hero .daynight-inventory-search__input) {
		border: 0;
		border-radius: 0;
		box-sizing: border-box;
		color: var(--sa-ink);
		font-family: var(--sa-font);
		font-size: 16px;
		font-weight: 600;
		height: 54px;
		min-width: 0;
		outline: 0;
		padding: 0 18px;
		width: 100%;
	}

	:global(.daynight-yellow-route-hero .daynight-inventory-searchbar__submit) {
		background: var(--sa-red);
		border-radius: 0;
		color: #fff;
		font-family: var(--sa-font);
		font-size: 15px;
		font-weight: 800;
	}

	:global(.daynight-yellow-route-hero .daynight-inventory-searchbar__submit img) {
		filter: brightness(0) invert(1);
		height: 18px;
		width: 18px;
	}

	@media (max-width: 1199px) {
		.daynight-yellow-route-hero__car {
			max-height: 220px;
			opacity: 0.92;
		}

		h1 {
			font-size: clamp(44px, 5.2vw, 62px);
		}
	}

	@media (max-width: 991px) {
		.daynight-yellow-route-hero {
			display: none;
		}
	}
</style>
