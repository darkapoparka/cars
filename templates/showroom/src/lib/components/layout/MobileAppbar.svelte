<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';

	let {
		actionsLabel = 'Контакт',
		children,
		logoAlt = 'Eliqauto'
	}: {
		actionsLabel?: string;
		children?: Snippet;
		logoAlt?: string;
	} = $props();
</script>

<!-- Shared black mobile appbar for the import and sell flows. It deliberately
     reuses the homepage wordmark and action treatment instead of a fallback logo. -->
<header class="bc-mobile-appbar">
	<a class="bc-mobile-appbar__brand" href={resolve('/')} aria-label="Eliqauto начало">
		<img
			src="/assets/eliqauto/brand/eliq-auto-wordmark-clean.png"
			alt={logoAlt}
			width="1285"
			height="235"
		/>
	</a>
	<div class="bc-mobile-appbar__actions" aria-label={actionsLabel}>
		{@render children?.()}
	</div>
</header>

<style>
	.bc-mobile-appbar {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		z-index: 20;
		display: flex;
		height: calc(64px + env(safe-area-inset-top));
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		background: #090a0c;
		padding: env(safe-area-inset-top) 12px 0;
	}

	.bc-mobile-appbar__brand {
		display: flex;
		flex: 1 1 auto;
		min-width: 0;
		align-items: center;
		text-decoration: none;
	}

	.bc-mobile-appbar__brand img {
		display: block;
		width: 174px;
		max-width: 100%;
		height: auto;
		object-fit: contain;
		filter: brightness(0) invert(1);
	}

	.bc-mobile-appbar__actions {
		display: flex;
		flex: 0 0 auto;
		align-items: center;
		gap: 8px;
	}

	.bc-mobile-appbar__actions :global(a),
	.bc-mobile-appbar__actions :global(label),
	.bc-mobile-appbar__actions :global(button) {
		display: flex;
		width: 44px;
		height: 44px;
		align-items: center;
		justify-content: center;
		border: 1px solid #3b3d42;
		border-radius: 999px;
		background: #1a1b1f;
		box-shadow: none;
		color: #ffffff;
		cursor: pointer;
		padding: 0;
		text-decoration: none;
		transition:
			background-color 0.18s ease,
			color 0.18s ease;
	}

	.bc-mobile-appbar__actions :global(.bc-mobile-appbar__action--primary) {
		border-color: var(--bc-accent);
		background: var(--bc-accent);
		box-shadow: none;
		color: #ffffff;
	}

	.bc-mobile-appbar__actions :global(a:focus-visible),
	.bc-mobile-appbar__actions :global(label:focus-visible),
	.bc-mobile-appbar__actions :global(button:focus-visible) {
		outline: 2px solid rgba(20, 33, 15, 0.64);
		outline-offset: 2px;
	}

	.bc-mobile-appbar__actions :global(svg),
	.bc-mobile-appbar__actions :global(svg *) {
		color: currentColor;
		stroke: currentColor;
	}

	@media (max-width: 374px) {
		.bc-mobile-appbar__actions {
			gap: 6px;
		}

		.bc-mobile-appbar__actions :global(a),
		.bc-mobile-appbar__actions :global(label),
		.bc-mobile-appbar__actions :global(button) {
			width: 38px;
			height: 38px;
		}
	}

	@media (max-width: 359px) {
		.bc-mobile-appbar__brand img {
			width: 126px;
		}
	}
</style>
