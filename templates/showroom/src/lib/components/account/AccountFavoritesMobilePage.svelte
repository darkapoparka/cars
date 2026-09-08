<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight, Car, Fuel, Gauge, Heart, Search, X } from '@lucide/svelte';
	import type { AuxeroFavoriteVehicleCard } from '$lib/auxero/favorites';

	let { cards }: { cards: AuxeroFavoriteVehicleCard[] } = $props();

	let searchQuery = $state('');

	const normalizedSearch = $derived(searchQuery.trim().toLocaleLowerCase('bg-BG'));
	const savedCountLabel = (count: number) =>
		count === 1 ? '1 запазен автомобил' : `${count} запазени автомобила`;
	const filteredCards = $derived.by(() => {
		if (!normalizedSearch) return cards;

		return cards.filter((card) =>
			[
				card.brand,
				card.title,
				card.fuel,
				card.transmission,
				card.priceLabel,
				card.mileageLabel,
				String(card.year)
			].some((value) => value.toLocaleLowerCase('bg-BG').includes(normalizedSearch))
		);
	});
	const countLabel = $derived(
		normalizedSearch
			? `${filteredCards.length} от ${savedCountLabel(cards.length)}`
			: savedCountLabel(cards.length)
	);

	const clearSearch = () => {
		searchQuery = '';
	};

	const useFallbackImage = (event: Event) => {
		const image = event.currentTarget as HTMLImageElement;

		if (!image.src.endsWith('/assets/eliqauto/hero/home-hero-available-inventory-wow.webp')) {
			image.src = '/assets/eliqauto/hero/home-hero-available-inventory-wow.webp';
		}
	};
	const mobileImage = (card: AuxeroFavoriteVehicleCard) =>
		card.slug === '21764342419542174'
			? '/assets/eliqauto/megamenu/inventory-bmw-x5-cutout.webp'
			: card.image;
</script>

<div class="eliqauto-favorites-mobile">
	<main class="eliqauto-favorites-mobile__main">
		<section class="eliqauto-favorites-mobile__hero" aria-labelledby="favorites-mobile-title">
			<div class="eliqauto-favorites-mobile__hero-row">
				<h1 id="favorites-mobile-title">Любими коли</h1>
				<p>{countLabel}</p>
				<a href={resolve('/inventory')}>
					<Search size={18} strokeWidth={2.2} aria-hidden="true" />
					Всички
				</a>
			</div>

			<div class="eliqauto-favorites-mobile__search">
				<Search size={20} strokeWidth={2.2} aria-hidden="true" />
				<input
					bind:value={searchQuery}
					type="search"
					placeholder="Търси в любимите..."
					autocomplete="off"
					aria-label="Търси в любимите автомобили"
				/>
				{#if searchQuery}
					<button type="button" onclick={clearSearch} aria-label="Изчисти търсенето">
						<X size={18} strokeWidth={2.25} aria-hidden="true" />
					</button>
				{/if}
			</div>
		</section>

		{#if cards.length}
			{#if filteredCards.length}
				<section class="eliqauto-favorites-mobile__list" aria-label="Любими автомобили">
					{#each filteredCards as card (card.slug)}
						<article class="eliqauto-favorites-mobile-card">
							<a
								class="eliqauto-favorites-mobile-card__image"
								href={resolve('/inventory/[slug]', { slug: card.slug })}
							>
								<img
									src={mobileImage(card)}
									alt={card.title}
									width="264"
									height="336"
									loading="lazy"
									decoding="async"
									onerror={useFallbackImage}
								/>
								<span>{card.tag}</span>
							</a>
							<div class="eliqauto-favorites-mobile-card__body">
								<div>
									<p>{card.brand}</p>
									<Heart size={18} strokeWidth={2.35} aria-hidden="true" />
								</div>
								<h2>
									<a href={resolve('/inventory/[slug]', { slug: card.slug })}>{card.title}</a>
								</h2>
								<strong>{card.priceLabel}</strong>
								<ul>
									<li><Gauge size={14} strokeWidth={2} aria-hidden="true" />{card.mileageLabel}</li>
									<li>{card.year}</li>
									<li><Fuel size={14} strokeWidth={2} aria-hidden="true" />{card.fuel}</li>
									<li>{card.transmission}</li>
								</ul>
								<a
									class="eliqauto-favorites-mobile-card__details"
									href={resolve('/inventory/[slug]', { slug: card.slug })}
								>
									Виж детайли
									<ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
								</a>
							</div>
						</article>
					{/each}
				</section>
			{:else}
				<section class="eliqauto-favorites-mobile__empty" aria-label="Няма резултати">
					<Search size={28} strokeWidth={2.1} aria-hidden="true" />
					<h2>Няма съвпадения</h2>
					<p>Пробвай с марка, модел, година, гориво или скоростна кутия.</p>
					<button type="button" onclick={clearSearch}>
						Изчисти търсенето
						<X size={17} strokeWidth={2.2} aria-hidden="true" />
					</button>
				</section>
			{/if}
		{:else}
			<section class="eliqauto-favorites-mobile__empty" aria-label="Няма любими автомобили">
				<Car size={28} strokeWidth={2.1} aria-hidden="true" />
				<h2>Няма запазени коли</h2>
				<p>Разгледай наличните автомобили и запази тези, които искаш да сравниш по-късно.</p>
				<a href={resolve('/inventory')}>
					Към колите
					<ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
				</a>
			</section>
		{/if}
	</main>
</div>

<style>
	.eliqauto-favorites-mobile {
		min-height: 100vh;
		background: var(--bc-bg);
		color: #111111;
	}

	.eliqauto-favorites-mobile__main {
		display: grid;
		gap: 10px;
		padding: 0 14px 92px;
	}

	.eliqauto-favorites-mobile__empty {
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface);
	}

	.eliqauto-favorites-mobile__hero {
		position: relative;
		display: grid;
		gap: 9px;
		min-height: 128px;
		overflow: hidden;
		margin: 0 -14px;
		padding: 12px 14px 14px;
		background:
			linear-gradient(90deg, rgba(18, 18, 18, 0.9), rgba(18, 18, 18, 0.52)),
			url('/assets/eliqauto/hero/home-hero-available-inventory-wow.webp') center 56% / cover;
		color: #ffffff;
	}

	.eliqauto-favorites-mobile__hero-row {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 8px;
		align-items: center;
	}

	.eliqauto-favorites-mobile__hero h1 {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	.eliqauto-favorites-mobile__hero p {
		margin: 0;
		letter-spacing: 0.04em;
		overflow: hidden;
		color: var(--bc-accent);
		font-size: var(--bc-text-micro);
		font-weight: 600;
		line-height: 16px;
		text-overflow: ellipsis;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.eliqauto-favorites-mobile__hero-row a {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		gap: 7px;
		flex: 0 0 auto;
		border-radius: 999px;
		background: var(--bc-accent);
		padding: 0 16px;
		color: #111111;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
	}

	.eliqauto-favorites-mobile__search {
		position: relative;
		z-index: 1;
		display: flex;
		min-height: 50px;
		align-items: center;
		gap: 10px;
		border: 1px solid rgba(255, 255, 255, 0.24);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.94);
		padding: 0 8px 0 18px;
		color: #111111;
		box-shadow: 0 12px 30px rgba(0, 0, 0, 0.16);
	}

	.eliqauto-favorites-mobile__search input {
		display: block;
		min-width: 0;
		width: 100%;
		height: 46px;
		flex: 1 1 auto;
		border: 0;
		border-radius: 0;
		background: transparent;
		box-shadow: none;
		color: #111111;
		font-size: 16px;
		font-weight: 500;
		line-height: 22px;
		outline: 0;
		padding: 0;
	}

	.eliqauto-favorites-mobile__search input::placeholder {
		color: #8d949c;
		opacity: 1;
	}

	.eliqauto-favorites-mobile__search button {
		display: flex;
		width: 44px;
		height: 44px;
		align-items: center;
		justify-content: center;
		flex: 0 0 44px;
		border: 0;
		border-radius: 999px;
		background: var(--bc-surface);
		color: #111111;
		padding: 0;
	}

	.eliqauto-favorites-mobile__list {
		display: grid;
		gap: 10px;
	}

	.eliqauto-favorites-mobile-card {
		display: grid;
		grid-template-columns: 132px minmax(0, 1fr);
		min-height: 168px;
		overflow: hidden;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface);
	}

	.eliqauto-favorites-mobile-card__image {
		position: relative;
		display: block;
		min-height: 168px;
		overflow: hidden;
	}

	.eliqauto-favorites-mobile-card__image img {
		display: block;
		width: 100%;
		height: 100%;
		min-height: 168px;
		object-fit: cover;
	}

	.eliqauto-favorites-mobile-card__image span {
		position: absolute;
		top: 8px;
		left: 8px;
		min-height: 24px;
		border-radius: 999px;
		background: #a51717;
		padding: 0 8px;
		color: #ffffff;
		font-size: var(--bc-text-micro);
		font-weight: 700;
		line-height: 24px;
		text-transform: uppercase;
	}

	.eliqauto-favorites-mobile-card__body {
		display: grid;
		align-content: start;
		padding: 9px 10px;
	}

	.eliqauto-favorites-mobile-card__body > div {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		margin-bottom: 2px;
	}

	.eliqauto-favorites-mobile-card__body p {
		margin: 0;
		color: #586070;
		font-size: var(--bc-text-micro);
		font-weight: 600;
		letter-spacing: 0.04em;
		line-height: 16px;
		text-transform: uppercase;
	}

	.eliqauto-favorites-mobile-card__body > div :global(svg) {
		color: #a51717;
		fill: #a51717;
		flex: 0 0 auto;
	}

	.eliqauto-favorites-mobile-card__body h2 {
		display: -webkit-box;
		min-height: 40px;
		margin: 0 0 5px;
		overflow: hidden;
		color: #101010;
		font-size: 16px;
		font-weight: 700;
		line-height: 20px;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	.eliqauto-favorites-mobile-card__body h2 a {
		display: block;
		min-height: 44px;
		color: inherit;
	}

	.eliqauto-favorites-mobile-card__body strong {
		margin-bottom: 7px;
		color: #a51717;
		font-size: 18px;
		font-weight: 700;
		line-height: 22px;
	}

	.eliqauto-favorites-mobile-card__body ul {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 6px;
		margin: 0 0 8px;
		padding: 0;
		list-style: none;
	}

	.eliqauto-favorites-mobile-card__body li {
		display: flex;
		min-width: 0;
		min-height: 25px;
		align-items: center;
		justify-content: center;
		gap: 4px;
		overflow: hidden;
		border-radius: 8px;
		background: #ffffff;
		padding: 0 5px;
		color: #4b5563;
		font-size: var(--bc-text-micro);
		font-weight: 600;
		line-height: 16px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.eliqauto-favorites-mobile-card__details {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		justify-content: center;
		gap: 5px;
		border-radius: 8px;
		background: #ffffff;
		color: #111111;
		font-size: 14px;
		font-weight: 700;
		line-height: 16px;
	}

	.eliqauto-favorites-mobile__empty {
		display: grid;
		justify-items: start;
		gap: 9px;
		padding: 18px;
	}

	.eliqauto-favorites-mobile__empty :global(svg) {
		color: #a51717;
	}

	.eliqauto-favorites-mobile__empty h2,
	.eliqauto-favorites-mobile__empty p {
		margin: 0;
		letter-spacing: 0;
	}

	.eliqauto-favorites-mobile__empty h2 {
		color: #111111;
		font-size: 22px;
		font-weight: 700;
		line-height: 26px;
	}

	.eliqauto-favorites-mobile__empty p {
		color: #5f6b5d;
		font-size: 14px;
		font-weight: 500;
		line-height: 20px;
	}

	.eliqauto-favorites-mobile__empty a {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		gap: 7px;
		border-radius: 8px;
		background: #1c1c1c;
		padding: 0 13px;
		color: #ffffff;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
	}

	.eliqauto-favorites-mobile__empty button {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		gap: 7px;
		border: 0;
		border-radius: 8px;
		background: #1c1c1c;
		padding: 0 13px;
		color: #ffffff;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
	}

	@media (max-width: 399px) {
		.eliqauto-favorites-mobile-card {
			grid-template-columns: 124px minmax(0, 1fr);
		}
	}
</style>
