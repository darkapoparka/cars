<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';
	type Props = { title: string; action: string; image: string } & (
		| { href: string; onOpen?: never }
		| { href?: never; onOpen: () => void }
	);
	let { title, action, image, href, onOpen }: Props = $props();
</script>

{#snippet content()}
	<img src={image} alt="" width="960" height="540" />
	<strong class="lead-image-banner__title">{title}</strong>
	<span class="lead-image-banner__action" aria-hidden="true"
		>{action}<ChevronRight size={17} strokeWidth={2.5} /></span
	>
{/snippet}

{#if href}
	<a class="lead-image-banner" {href} aria-label={`${action}: ${title}`}>{@render content()}</a>
{:else}
	<button
		class="lead-image-banner"
		type="button"
		aria-label={title}
		aria-haspopup="dialog"
		onclick={(event) => {
			event.currentTarget.focus({ preventScroll: true });
			onOpen?.();
		}}
	>
		{@render content()}
	</button>
{/if}

<style>
	.lead-image-banner {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
		isolation: isolate;
		overflow: hidden;
		width: 100%;
		min-height: 136px;
		padding: 14px 16px;
		border: 0;
		border-radius: 14px;
		background: #f0f2f4;
		color: var(--sa-ink);
		font-family: var(--sa-font);
		text-align: left;
		text-decoration: none;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}
	img {
		position: absolute;
		z-index: -1;
		right: 8px;
		bottom: 0;
		width: 142px;
		height: 82px;
		object-fit: contain;
		object-position: right bottom;
	}
	.lead-image-banner__title {
		width: 100%;
		color: var(--sa-ink);
		font-size: var(--sa-mobile-type-section-title);
		font-weight: var(--sa-weight-heading);
		line-height: 1.15;
		letter-spacing: -0.4px;
		text-wrap: balance;
	}
	.lead-image-banner__action {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: fit-content;
		min-height: var(--sa-mobile-action-h);
		padding: 0 12px;
		border-radius: var(--sa-r-pill);
		background: var(--sa-red);
		color: #fff;
		font-size: var(--sa-button-font-size);
		font-weight: var(--sa-button-font-weight);
		line-height: 1.2;
		white-space: nowrap;
	}
	.lead-image-banner__action :global(svg),
	.lead-image-banner__action :global(svg *) {
		color: #fff;
		stroke: #fff;
	}
	.lead-image-banner:focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: 3px;
	}
	.lead-image-banner:active .lead-image-banner__action {
		background: var(--sa-red-hover, #bc002c);
	}
	@media (max-width: 359px) {
		img {
			width: 120px;
		}
	}
</style>
