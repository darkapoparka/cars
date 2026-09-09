<script lang="ts">
	import Phone from '@lucide/svelte/icons/phone';
	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';
</script>

<div class="mobile-hero-bar">
	<a class="mobile-hero-bar__brand" href={resolve('/')} aria-label="СТЕНЛИ КАР начало">
		<img
			src={resolve('/assets/dealer/brand/logo.jpg')}
			alt={daynightSite.shortName}
			width="170"
			height="44"
		/>
	</a>
	<a
		class="mobile-hero-bar__call"
		href={`tel:+359${daynightSite.phone.slice(1)}`}
		aria-label="Обади се"
		title="Обади се"
	>
		<Phone size={22} strokeWidth={2} aria-hidden="true" />
	</a>
</div>

<style>
	.mobile-hero-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		height: 44px;
		min-width: 0;
	}
	.mobile-hero-bar__brand {
		display: flex;
		align-items: center;
		width: 170px;
		height: 44px;
		min-width: 0;
	}
	.mobile-hero-bar__brand img {
		display: block;
		width: 170px;
		height: 44px;
		object-fit: contain;
		object-position: left center;
	}
	.mobile-hero-bar__call {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		flex: 0 0 44px;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: #fff;
		color: #171b1e !important;
		box-shadow: none;
		text-decoration: none;
	}
	.mobile-hero-bar__call :global(svg),
	.mobile-hero-bar__call :global(svg *) {
		color: inherit !important;
		stroke: currentColor !important;
	}
	.mobile-hero-bar__call:hover,
	.mobile-hero-bar__call:active {
		background: var(--sa-yellow);
	}
	.mobile-hero-bar a:focus-visible {
		outline: 2px solid var(--sa-yellow) !important;
		outline-offset: 3px !important;
		box-shadow: none !important;
	}
</style>
