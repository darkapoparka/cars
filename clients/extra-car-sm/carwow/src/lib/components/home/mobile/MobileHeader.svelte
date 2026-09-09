<script lang="ts">
	import { Search } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';

	type SearchHref = '/' | '/inventory' | '/contact';

	let { searchHref = '/inventory' }: { searchHref?: SearchHref } = $props();
</script>

<header class="mobile-home-header">
	<a class="mobile-home-header__brand" href={resolve('/')} aria-label="ЕКСТРА КАР-СМ home">
		<img
			src={resolve('/dealer/logo-pending.svg')}
			alt={daynightSite.shortName}
		/>
	</a>

	<nav class="mobile-home-header__actions" aria-label="Бързи действия">
		<a class="mobile-home-header__icon" href={resolve(searchHref)} aria-label="Търсене">
			<Search size={19} strokeWidth={2.4} />
		</a>
	</nav>
</header>

<style>
	.mobile-home-header {
		position: fixed;
		z-index: 60;
		top: 0;
		right: 0;
		left: 0;
		display: none;
		height: calc(62px + env(safe-area-inset-top));
		align-items: center;
		justify-content: space-between;
		padding: env(safe-area-inset-top) 14px 0;
		background: rgba(255, 255, 255, 0.96);
		border-bottom: 1px solid rgba(215, 224, 234, 0.95);
		box-shadow: none;
		backdrop-filter: blur(18px);
		color: var(--sa-ink);
		font-family: var(--sa-font);
	}

	.mobile-home-header__brand {
		display: inline-flex;
		min-width: 0;
		align-items: center;
	}

	.mobile-home-header__brand img {
		display: block;
		width: 190px;
		height: 48px;
		object-fit: contain;
		object-position: left center;
	}

	.mobile-home-header__actions {
		display: flex;
		flex: 0 0 auto;
		align-items: center;
		gap: 7px;
	}

	.mobile-home-header__icon {
		display: grid;
		width: var(--sa-mobile-action-h);
		height: var(--sa-mobile-action-h);
		place-items: center;
		border: 1px solid var(--sa-line);
		border-radius: 50%;
		background: var(--sa-surface);
		color: var(--sa-ink);
		box-shadow: none;
	}

	.mobile-home-header :global(svg),
	.mobile-home-header :global(svg *) {
		color: var(--sa-ink) !important;
		stroke: var(--sa-ink) !important;
	}

	@media (max-width: 575px) {
		.mobile-home-header {
			display: flex;
		}
	}
</style>
