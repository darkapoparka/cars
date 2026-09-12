<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import { base } from '$app/paths';
	let {
		title,
		description,
		label,
		image,
		tone = 'dark',
		portrait = false,
		cars = false,
		onclick
	}: {
		title: string;
		description: string;
		label: string;
		image: `/${string}`;
		tone?: 'dark' | 'yellow' | 'red';
		portrait?: boolean;
		cars?: boolean;
		onclick: () => void;
	} = $props();
</script>

<button
	type="button"
	class={[
		'mobile-promo',
		`mobile-promo--${tone}`,
		portrait && 'mobile-promo--portrait',
		cars && 'mobile-promo--cars'
	]}
	{onclick}
>
	<span class="mobile-promo__copy">
		<strong>{title}</strong>
		<span class="mobile-promo__description">{description}</span>
		<span class="mobile-promo__cta"
			>{label}<ArrowRight size={16} strokeWidth={2} aria-hidden="true" /></span
		>
	</span>
	<img src={`${base}${image}`} alt="" aria-hidden="true" loading="lazy" decoding="async" />
</button>

<style>
	.mobile-promo {
		--promo-ink: #fff;
		--promo-action: #fff;
		--promo-action-ink: #171b1e;
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		min-height: 196px;
		padding: 20px 16px;
		border: 0;
		border-radius: 12px;
		background: #171b1e;
		box-shadow: none;
		color: var(--promo-ink);
		font-family: inherit;
		text-align: left;
		overflow: hidden;
		cursor: pointer;
	}
	.mobile-promo--yellow {
		--promo-ink: #171b1e;
		--promo-action: #171b1e;
		--promo-action-ink: #fff;
		background: var(--sa-yellow);
	}
	.mobile-promo--red {
		background: var(--sa-red-strong);
	}
	.mobile-promo__copy {
		display: grid;
		justify-items: start;
		gap: 8px;
		width: 68%;
		position: relative;
		z-index: 1;
	}
	.mobile-promo strong {
		color: var(--promo-ink);
		font-size: 20px;
		font-weight: 700;
		line-height: 1.15;
		letter-spacing: -0.02em;
	}
	.mobile-promo__description {
		color: var(--promo-ink);
		font-size: 13px;
		font-weight: 500;
		line-height: 1.45;
	}
	.mobile-promo__cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 44px;
		max-width: 100%;
		padding: 8px 12px;
		margin-top: 6px;
		border-radius: 8px;
		background: var(--promo-action);
		color: var(--promo-action-ink);
		font-size: 13px;
		font-weight: 600;
		line-height: 1.3;
	}
	.mobile-promo__cta :global(svg),
	.mobile-promo__cta :global(svg *) {
		color: inherit !important;
		stroke: currentColor !important;
		flex-shrink: 0;
	}
	.mobile-promo > img {
		position: absolute;
		right: -10px;
		bottom: 0;
		width: 38%;
		height: 154px;
		object-fit: contain;
		object-position: right bottom;
		pointer-events: none;
	}
	.mobile-promo--portrait > img {
		height: 174px;
		width: 44%;
		bottom: -20px;
	}
	.mobile-promo--cars > img {
		width: 52%;
		height: auto;
		bottom: -5%;
		right: -6px;
	}
	.mobile-promo:focus-visible {
		outline: 2px solid #171b1e !important;
		outline-offset: 3px !important;
		box-shadow: none !important;
	}
	.mobile-promo:active .mobile-promo__cta {
		background: var(--sa-yellow);
		color: #171b1e;
	}
	.mobile-promo--yellow:active .mobile-promo__cta {
		background: #343a3e;
		color: #fff;
	}
</style>
