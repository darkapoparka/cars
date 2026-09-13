<script lang="ts">
	import { mobileImageSrc } from '$lib/data/mobile-media';
	import { ChevronRight } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';
	import { shortFuel } from '$lib/utils/format';
	import type { HomeMobileData } from '$lib/types/home';
	import { daynightImageFallback } from '$lib/utils/daynight-image-fallback';
	import {
		bodyLabel,
		bodyPhoto,
		brandLogos,
		brandMark,
		mobileBodyCatalog,
		mobileBrandCatalog
	} from './mobile-home-data';
	import MobileHomeServices from './MobileHomeServices.svelte';
	import MobileHomeVideos from './MobileHomeVideos.svelte';
	let { data }: { data: HomeMobileData } = $props();
	const inventoryPath = '/inventory' as const;
	const importRequestPath = '/contact' as const;
	const inventoryHref = resolve(inventoryPath);
	type InventoryHref = '/inventory' | `/inventory?${string}`;
	type ImportLeadHref = '/contact' | `/contact?${string}`;

	const bodyTiles = $derived.by(() => {
		const countByBody = new Map(data.bodyTiles.map((tile) => [tile.body, tile.count]));
		return mobileBodyCatalog.map((body) => ({ body, count: countByBody.get(body) ?? 0 }));
	});
	const budgetTiles = $derived(
		data.budgetTiles.filter((tile) => tile.count > 0 || tile.value === 'all').slice(0, 4)
	);

	const brandTiles = $derived.by(() => {
		const countByBrand = new Map(data.brandTiles.map((tile) => [tile.brand, tile.count]));

		return mobileBrandCatalog.map((tile) => ({
			...tile,
			count: countByBrand.get(tile.brand) ?? 0
		}));
	});
	const featuredCars = $derived(data.featuredCars.slice(0, 4));
	const total = $derived(data.total);

	const brandHref = (brand: string): InventoryHref =>
		`${inventoryPath}?brand=${encodeURIComponent(brand)}`;
	const bodyHref = (body: string): InventoryHref =>
		`${inventoryPath}?body=${encodeURIComponent(body)}`;
	const bodyCardHref = (body: string, count: number): InventoryHref | ImportLeadHref =>
		count > 0
			? bodyHref(body)
			: `${importRequestPath}?intent=import&query=${encodeURIComponent(body)}`;
	const bodyCountLabel = (count: number) =>
		count === 0 ? 'Внос по заявка' : count === 1 ? '1 кола' : `${count} коли`;
	const budgetHref = (budget: string): InventoryHref =>
		`${inventoryPath}?price=${encodeURIComponent(budget)}`;
	const budgetCardHref = (budget: string) =>
		budget === 'all' ? inventoryPath : budgetHref(budget);
	const brandCountLabel = (count: number) =>
		count > 0 ? `${count} ${count === 1 ? 'автомобил' : 'автомобила'}` : 'Внос по заявка';
</script>

<section class="mh-section mh-section--budget" aria-labelledby="mh-budget-title">
	<div class="mh-section__head">
		<h2 id="mh-budget-title">По цена</h2>
		<a href={inventoryHref}>Всички <ChevronRight size={13} strokeWidth={2.6} /></a>
	</div>
	<div class="mh-budget-grid">
		{#each budgetTiles as tile (tile.value)}
			<a
				class={`mh-budget-card${tile.variant === 'open' ? ' mh-budget-card--open' : ''}`}
				href={resolve(budgetCardHref(tile.value))}
			>
				<span class="mh-budget-card__media">
					<img
						src={mobileImageSrc(tile.image)}
						alt=""
						loading="lazy"
						decoding="async"
						data-daynight-image-fallback
						use:daynightImageFallback
					/>
				</span>
				<span class="mh-budget-card__copy">
					<strong
						>{tile.label
							.replace('EUR', '€')
							.replace(
								/ (\d[\d ]* €)$/,
								(_, amount: string) => ' ' + amount.replaceAll(' ', '\u00a0')
							)}</strong
					>
					<span>{tile.caption ?? `${tile.count} коли`}</span>
				</span>
			</a>
		{/each}
	</div>
</section>

<section class="mh-section mh-section--featured" aria-labelledby="mh-featured-title">
	<div class="mh-section__head">
		<h2 id="mh-featured-title">Избрани</h2>
		<a href={inventoryHref}>Всички <ChevronRight size={13} strokeWidth={2.6} /></a>
	</div>
	<div class="mh-carlist">
		{#each featuredCars as car (car.slug)}
			<article class="mh-car">
				<a class="mh-car__link" href={resolve('/inventory/[slug]', { slug: car.slug })}>
					<span class="mh-car__media">
						<img
							src={car.image}
							alt={car.shortTitle}
							loading="lazy"
							decoding="async"
							data-daynight-image-fallback
							use:daynightImageFallback
						/>
						{#if car.badges[0]}
							<span class="mh-car__badge">{car.badges[0]}</span>
						{/if}
					</span>
					<span class="mh-car__copy">
						<span class="mh-car__brand">{car.brand}</span>
						<strong class="mh-car__title">{car.model}</strong>
						<span class="mh-car__meta">{car.year} · {shortFuel(car.fuel)} · {car.mileage}</span>
					</span>
					<span class="mh-car__foot">
						<span class="mh-car__price">{car.priceEur}</span>
						<span class="mh-car__go" aria-hidden="true">
							<ChevronRight size={18} strokeWidth={3} />
						</span>
					</span>
				</a>
			</article>
		{/each}
	</div>
</section>

<section class="mh-section mh-section--brands" aria-labelledby="mh-brand-title">
	<div class="mh-section__head mh-section__head--solo">
		<h2 id="mh-brand-title">Марки</h2>
	</div>
	<div class="mh-brand-grid">
		{#each brandTiles as tile (tile.brand)}
			<a
				class="mh-brandcard"
				data-brand={tile.brand}
				aria-label={`${tile.label}, ${brandCountLabel(tile.count)}`}
				title={tile.count === 0 ? 'Внос по заявка' : undefined}
				href={resolve(
					tile.count > 0
						? brandHref(tile.brand)
						: `/contact?intent=import&make=${encodeURIComponent(tile.brand)}`
				)}
			>
				<span class="mh-brandcard__icon">
					{#if brandLogos[tile.brand]}
						<img
							class="mh-brandcard__logo"
							src={mobileImageSrc(brandLogos[tile.brand])}
							alt=""
							loading="lazy"
						/>
					{:else}
						<span class="mh-brandcard__mark" aria-hidden="true">{brandMark(tile.brand)}</span>
					{/if}
				</span>
				<span class="mh-brandcard__copy">
					<span class="mh-brandcard__name">{tile.label}</span>
					<span class="mh-brandcard__count" aria-hidden="true">
						{tile.count > 0 ? `(${tile.count})` : '(?)'}
					</span>
				</span>
			</a>
		{/each}
		<a
			class="mh-brandcard mh-brandcard--all"
			href={inventoryHref}
			aria-label={`Всички марки, ${brandCountLabel(total)}`}
		>
			<span class="mh-brandcard__icon mh-brandcard__icon--all" aria-hidden="true">
				<img src={resolve(daynightSite.logoLight)} alt="" loading="lazy" />
			</span>
			<span class="mh-brandcard__copy">
				<span class="mh-brandcard__name">Всички</span>
				<span class="mh-brandcard__count" aria-hidden="true">({total})</span>
			</span>
		</a>
	</div>
	<p class="mh-brand-note">(?) Внос по заявка</p>
</section>

<MobileHomeServices kind="sell" />

<section class="mh-section" aria-labelledby="mh-type-title">
	<div class="mh-section__head">
		<h2 id="mh-type-title">По тип</h2>
		<a href={inventoryHref}>Всички <ChevronRight size={13} strokeWidth={2.6} /></a>
	</div>
	<div class="mh-type-grid">
		{#each bodyTiles as tile (tile.body)}
			<a class="mh-cat" href={resolve(bodyCardHref(tile.body, tile.count))}>
				<span class="mh-cat__media">
					<img
						class="mh-cat__image"
						src={mobileImageSrc(bodyPhoto(tile.body))}
						alt=""
						loading="lazy"
					/>
				</span>
				<span class="mh-cat__foot">
					<span class="mh-cat__label">{bodyLabel(tile.body)}</span>
					<span class="mh-cat__count">{bodyCountLabel(tile.count)}</span>
				</span>
			</a>
		{/each}
	</div>
</section>

<MobileHomeServices kind="import" />

<MobileHomeVideos />

<style>
	.mh-section a {
		color: inherit;
		text-decoration: none;
	}

	.mh-section {
		display: grid;
		gap: 8px;
	}

	.mh-section--brands {
		gap: 8px;
	}

	.mh-section--budget {
		gap: 8px;
	}

	.mh-section__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 0 16px;
	}

	.mh-section__head h2 {
		margin: 0;
		color: var(--sa-ink);
		font-size: var(--sa-mobile-type-section-title);
		font-weight: var(--sa-weight-medium);
		line-height: var(--sa-mobile-leading-heading);
		letter-spacing: var(--sa-tracking-tight);
	}

	.mh-section__head a {
		display: inline-flex;
		flex: 0 0 auto;
		min-height: 44px;
		margin-block: -7px;
		align-items: center;
		gap: 2px;
		color: var(--sa-blue-strong) !important;
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-regular);
		line-height: 1;
	}

	.mh-section__head a :global(svg) {
		width: 13px;
		height: 13px;
	}

	.mh-budget-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
		padding: 0 16px;
	}

	.mh-budget-card {
		position: relative;
		display: grid;
		grid-template-rows: 62px 48px;
		min-height: 112px;
		overflow: hidden;
		border: 1px solid #e0e5ec;
		border-radius: 8px;
		background: #e7eaee;
		color: var(--sa-ink) !important;
		box-shadow: none;
	}

	.mh-budget-card--open {
		border-color: #e0e5ec;
		background: #e7eaee;
	}

	.mh-budget-card__media {
		position: relative;
		display: grid;
		min-height: 62px;
		place-items: end center;
		overflow: hidden;
		padding: 4px 8px 0;
	}

	.mh-budget-card__media::after {
		position: absolute;
		right: 18px;
		bottom: 11px;
		left: 18px;
		height: 14px;
		border-radius: 50%;
		background: rgba(34, 45, 58, 0.12);
		filter: blur(5px);
		content: '';
	}

	.mh-budget-card__media img {
		position: relative;
		z-index: 1;
		display: block;
		width: 100%;
		max-width: 100%;
		height: 54px;
		object-fit: contain;
		object-position: center bottom;
		transform: none;
	}

	.mh-budget-card__media :global(img.daynight-img-fallback) {
		box-sizing: border-box;
		width: 100%;
		padding: 14px;
		background: #f1f4f9;
		object-fit: contain;
		transform: none;
	}

	.mh-budget-card--open .mh-budget-card__media img {
		width: 100%;
		height: 54px;
		transform: translateX(0);
	}

	.mh-budget-card__copy {
		display: grid;
		align-content: start;
		gap: 2px;
		min-width: 0;
		padding: 4px 10px 8px;
	}

	.mh-budget-card__copy strong {
		color: var(--sa-ink);
		font-size: var(--sa-mobile-type-control-sm);
		font-weight: var(--sa-weight-heading);
		line-height: 1.1;
	}

	.mh-budget-card__copy span {
		overflow: hidden;
		color: var(--sa-ink-soft);
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-medium);
		line-height: 1.15;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mh-type-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
		padding: 0 16px 4px;
	}

	.mh-carlist {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: min(264px, calc(100vw - 82px));
		gap: 8px;
		overflow-x: auto;
		padding: 0 16px 4px;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}

	.mh-carlist::-webkit-scrollbar {
		display: none;
	}

	.mh-cat {
		display: grid;
		grid-template-rows: minmax(0, 1fr) 40px;
		min-height: 112px;
		overflow: hidden;
		border: 1px solid #e2e7ee;
		border-radius: 8px;
		background: #eef1f6;
		box-shadow: none;
	}

	.mh-cat__media {
		position: relative;
		isolation: isolate;
		display: grid;
		min-height: 0;
		place-items: center;
		background: transparent;
		padding: 6px 6px 0;
	}

	.mh-cat__image {
		position: relative;
		z-index: 1;
		display: block;
		width: auto;
		max-width: 100%;
		height: 52px;
		max-height: 100%;
		filter: drop-shadow(0 7px 8px rgba(15, 20, 27, 0.13));
		object-fit: contain;
		object-position: center;
	}

	.mh-cat__foot {
		display: grid;
		align-content: center;
		justify-items: center;
		gap: 2px;
		padding: 0 6px 7px;
		text-align: center;
	}

	.mh-cat__label {
		color: var(--sa-ink);
		font-size: var(--sa-mobile-type-control-sm);
		font-weight: var(--sa-weight-semibold);
		line-height: 1.05;
	}

	.mh-cat__count {
		color: #4f5966;
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-medium);
		line-height: 1.1;
		white-space: nowrap;
	}

	.mh-brand-note {
		margin: 0;
		padding: 0 16px;
		color: var(--sa-ink-soft);
		font-size: var(--sa-mobile-type-meta);
		font-weight: var(--sa-weight-regular);
		line-height: var(--sa-mobile-leading-meta);
	}

	.mh-brand-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
		padding: 0 16px 4px;
	}

	.mh-brandcard {
		display: grid;
		min-height: 112px;
		align-items: center;
		justify-items: center;
		align-content: center;
		gap: 4px;
		overflow: hidden;
		border: 1px solid #dce1e8;
		border-radius: 8px;
		background: #f1f3f5;
		padding: 10px 6px 9px;
		box-shadow: none;
		text-align: center;
	}

	.mh-brandcard__icon,
	.mh-brandcard__mark {
		flex: 0 0 auto;
	}

	.mh-brandcard__icon {
		display: grid;
		width: 58px;
		height: 48px;
		flex: 0 0 48px;
		place-items: center;
	}

	.mh-brandcard__logo {
		display: block;
		max-width: 48px;
		max-height: 42px;
		width: auto;
		height: auto;
		object-fit: contain;
	}

	.mh-brandcard[data-brand='Audi'] .mh-brandcard__logo,
	.mh-brandcard[data-brand='Ford'] .mh-brandcard__logo,
	.mh-brandcard[data-brand='Hyundai'] .mh-brandcard__logo {
		max-width: 56px;
	}

	.mh-brandcard[data-brand='Tesla'] .mh-brandcard__logo {
		max-height: 40px;
	}

	.mh-brandcard__mark {
		display: grid;
		width: 58px;
		height: 48px;
		place-items: center;
		color: var(--sa-ink-soft);
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-strong);
		line-height: 1;
	}

	.mh-brandcard__copy {
		display: grid;
		min-width: 0;
		justify-items: center;
		gap: 2px;
	}

	.mh-brandcard__name {
		max-width: 100%;
		color: var(--sa-ink);
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-regular);
		line-height: 1.15;
	}

	.mh-brandcard__count {
		color: #5f6876;
		font-size: var(--sa-mobile-type-meta);
		font-weight: var(--sa-weight-regular);
		line-height: 1.2;
		white-space: nowrap;
	}

	.mh-brandcard--all {
		background: #e9edf2;
	}

	.mh-brandcard__icon--all {
		width: 76px;
	}

	.mh-brandcard__icon--all img {
		display: block;
		width: 76px;
		height: auto;
		object-fit: contain;
	}

	.mh-car {
		position: relative;
		display: grid;
		grid-template-rows: 136px minmax(68px, auto) 42px;
		overflow: hidden;
		border: 1px solid #e2e7ee;
		border-radius: 8px;
		background: #e7eaee;
		box-shadow: none;
	}

	.mh-car__link {
		display: contents;
		color: inherit;
		text-decoration: none;
	}

	.mh-car__copy {
		display: grid;
		align-content: start;
		gap: 4px;
		min-width: 0;
		padding: 11px 13px 4px;
	}

	.mh-car__brand {
		overflow: hidden;
		color: #4f5966;
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-semibold);
		letter-spacing: var(--sa-tracking-wide);
		line-height: 1;
		text-overflow: ellipsis;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.mh-car__media {
		position: relative;
		min-height: 136px;
		overflow: hidden;
		background: #eef1f6;
	}

	.mh-car__media img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.mh-car__media :global(img.daynight-img-fallback) {
		box-sizing: border-box;
		padding: 18px;
		background: #f1f4f9;
		object-fit: contain;
	}

	.mh-car__badge {
		position: absolute;
		top: 7px;
		left: 7px;
		border-radius: var(--sa-r-pill);
		background: var(--sa-blue);
		padding: 4px 7px;
		color: #fff;
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-semibold);
		letter-spacing: var(--sa-tracking-wide);
		line-height: 1;
		text-transform: uppercase;
	}

	.mh-car__title {
		display: block;
		overflow: hidden;
		color: var(--sa-ink);
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-heading);
		line-height: 1.08;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mh-car__meta {
		overflow: hidden;
		color: #4f5966;
		font-size: var(--sa-text-sm);
		font-weight: var(--sa-weight-medium);
		line-height: 1.15;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mh-car__foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 0 13px 13px;
	}

	.mh-car__price {
		display: inline-flex;
		max-width: calc(100% - 40px);
		min-height: var(--sa-mobile-section-action-h);
		align-items: center;
		border-radius: 6px;
		background: #fff;
		padding: 0 9px;
		overflow: hidden;
		color: var(--sa-price);
		font-size: var(--sa-text-lg);
		font-weight: var(--sa-weight-strong);
		line-height: 1;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mh-car__go {
		display: grid;
		width: var(--sa-mobile-card-action);
		height: var(--sa-mobile-card-action);
		flex: 0 0 auto;
		place-items: center;
		border-radius: 999px;
		background: var(--sa-ink);
		color: #fff;
	}

	.mh-car__go :global(svg) {
		width: 16px;
		height: 16px;
		color: #fff !important;
	}

	.mh-car__go :global(path) {
		stroke: #fff !important;
	}

	.mh-cta:active {
		opacity: 0.9;
	}

	.mh-car__go :global(svg),
	.mh-car__go :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}

	@media (max-width: 360px) {
		.mh-brand-grid {
			gap: 8px;
			padding-right: 16px;
			padding-left: 16px;
		}

		.mh-brandcard {
			min-height: 112px;
			gap: 3px;
			padding: 8px 4px;
		}
	}

	.mh-budget-card__copy strong {
		font-size: var(--sa-text-lg);
		font-weight: var(--sa-weight-heading);
		line-height: var(--sa-mobile-leading-heading);
	}

	.mh-budget-card__copy span {
		font-size: var(--sa-mobile-type-meta);
		font-weight: var(--sa-weight-medium);
		line-height: var(--sa-mobile-leading-meta);
	}

	.mh-car__brand,
	.mh-car__badge {
		font-size: var(--sa-mobile-type-micro);
		font-weight: var(--sa-weight-semibold);
	}

	.mh-car__title {
		font-size: var(--sa-mobile-type-card-title);
		font-weight: var(--sa-weight-heading);
		line-height: var(--sa-mobile-leading-heading);
	}

	.mh-car__meta {
		font-size: var(--sa-mobile-type-meta);
		font-weight: var(--sa-weight-medium);
		line-height: var(--sa-mobile-leading-meta);
	}

	.mh-car__price {
		font-size: var(--sa-mobile-type-feature-title);
		font-weight: var(--sa-weight-strong);
	}
</style>
