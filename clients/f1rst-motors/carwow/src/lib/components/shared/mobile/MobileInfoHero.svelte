<script lang="ts">
	import type { Snippet } from 'svelte';
	import MobileHeroBar from '../MobileHeroBar.svelte';
	let { title, description, children }: { title: string; description: string; children: Snippet } =
		$props();
</script>

<header class="mobile-info-hero">
	<MobileHeroBar showLocation={false} />
	<div class="mobile-info-hero__copy">
		<h1>{title}</h1>
		<p>{description}</p>
	</div>
	<div class="mobile-info-hero__actions">{@render children()}</div>
</header>

<style>
	.mobile-info-hero {
		display: grid;
		gap: 18px;
		padding: calc(env(safe-area-inset-top) + 12px) var(--sa-mobile-gutter-wide)
			var(--sa-mobile-hero-bottom);
		background: var(--sa-ink);
		color: white;
	}
	.mobile-info-hero__copy {
		display: grid;
		gap: 8px;
	}
	.mobile-info-hero h1 {
		margin: 0;
		font-size: var(--sa-mobile-type-page-title);
		font-weight: var(--sa-weight-medium);
		line-height: var(--sa-mobile-leading-heading);
	}
	.mobile-info-hero p {
		margin: 0;
		color: rgba(255, 255, 255, 0.76);
		font-size: var(--sa-type-body);
		font-weight: var(--sa-weight-regular);
		line-height: var(--sa-mobile-leading-body);
	}
	.mobile-info-hero__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.mobile-info-hero__actions :global(a) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: var(--sa-mobile-action-h);
		padding: 0 16px;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.08);
		color: white;
		text-decoration: none;
		font-size: var(--sa-type-body);
		font-weight: var(--sa-weight-regular);
	}
	.mobile-info-hero__actions :global(a:first-child) {
		background: var(--sa-red);
		border-color: var(--sa-red);
	}
	.mobile-info-hero__actions :global(a:focus-visible) {
		outline: 2px solid white;
		outline-offset: 3px;
	}
</style>
