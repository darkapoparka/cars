<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveBrandCard, HomeFiveTypeCard } from '$lib/auxero/home-five';
	import { homeTwoBrandLogoForName } from '$lib/auxero/home-two';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import { ArrowRight } from '@lucide/svelte';

	let {
		brandCards,
		copy,
		typeCards
	}: {
		brandCards: HomeFiveBrandCard[];
		copy: HomePageCopy;
		typeCards: HomeFiveTypeCard[];
	} = $props();

	const featuredBrands = $derived(brandCards.slice(0, 8));
	const featuredTypes = $derived(typeCards.slice(0, 6));
</script>

<section class="home2-partners" aria-labelledby="home2-partners-title">
	<div class="home2-partners__inner">
		<div class="home2-browse-head">
			<div>
				<span class="home2-browse-head__kicker">Бърз избор</span>
				<h2 id="home2-partners-title">Намери кола по марка или каросерия</h2>
				<p>Сканирай най-търсените марки и форми без дълги филтри.</p>
			</div>
		</div>

		<div class="home2-brand-grid" aria-label={copy.brandTitle}>
			{#each featuredBrands as brand (brand.name)}
				<a href={resolve(`/inventory?brand=${encodeURIComponent(brand.query)}`)}>
					<span class="home2-brand-grid__logo">
						<img
							src={homeTwoBrandLogoForName(brand.name, brand.image)}
							alt=""
							loading="lazy"
							aria-hidden="true"
						/>
					</span>
					<span class="home2-brand-grid__copy">
						<strong>{brand.name}</strong>
						<small>{brand.count}</small>
					</span>
				</a>
			{/each}
		</div>

		<div class="home2-browse-cta-grid" aria-label="Бързи Day Night Auto действия">
			<a class="home2-browse-cta home2-browse-cta--inventory" href={resolve('/inventory')}>
				<img
					src="/assets/daynight/home2/home2-cta-browse-generated-v1.webp"
					alt=""
					loading="lazy"
					aria-hidden="true"
				/>
				<span class="home2-browse-cta__copy">
					<small>Налични сега</small>
					<strong>Автомобили за оглед и сравнение</strong>
					<em>Проверена история, ясни разходи и конкретна следваща стъпка.</em>
				</span>
				<span class="home2-browse-cta__arrow" aria-hidden="true">
					<ArrowRight size={18} strokeWidth={2.8} />
				</span>
			</a>

			<a class="home2-browse-cta home2-browse-cta--request" href={resolve('/import')}>
				<img
					class="home2-browse-cta__request-img"
					src="/assets/daynight/home2/home2-action-import.webp"
					alt=""
					loading="lazy"
					aria-hidden="true"
				/>
				<span class="home2-browse-cta__copy">
					<small>Търсиш конкретен модел?</small>
					<strong>Заяви автомобил по избор</strong>
					<em>Намираме оферти, проверяваме документите и смятаме крайната цена.</em>
				</span>
				<span class="home2-browse-cta__arrow" aria-hidden="true">
					<ArrowRight size={18} strokeWidth={2.8} />
				</span>
			</a>
		</div>

		<div class="home2-type-head">
			<h3>Каросерия</h3>
			<p>SUV, седан, хечбек и други чести избори за бързо ориентиране.</p>
		</div>

		<div class="home2-body-grid" aria-label={copy.typeTitle}>
			{#each featuredTypes as typeCard (typeCard.href)}
				<a href={resolve(typeCard.href)}>
					<span class="home2-body-card__copy">
						<strong>{typeCard.label}</strong>
						<small>Виж налични</small>
					</span>
					<img src={typeCard.image} alt="" loading="lazy" aria-hidden="true" />
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.home2-partners {
		background: #f3f4f6;
		padding: 34px 64px 88px;
	}

	.home2-partners__inner {
		margin: 0 auto;
		max-width: 1298px;
	}

	.home2-browse-head {
		display: block;
		margin-bottom: 24px;
	}

	.home2-browse-head__kicker {
		color: #b9161c;
		display: block;
		font-size: 13px;
		font-weight: 1000;
		letter-spacing: 0;
		line-height: 1;
		margin-bottom: 10px;
		text-transform: uppercase;
	}

	.home2-browse-head h2 {
		color: #121214;
		font-family: 'Arial Black', Impact, Inter, ui-sans-serif, system-ui, sans-serif;
		font-size: clamp(31px, 3vw, 44px);
		font-weight: 1000;
		letter-spacing: 0;
		line-height: 1.04;
		margin: 0;
	}

	.home2-browse-head p {
		color: #424248;
		font-size: 17px;
		font-weight: 650;
		margin: 8px 0 0;
	}

	.home2-brand-grid,
	.home2-body-grid {
		display: grid;
		gap: 12px;
	}

	.home2-brand-grid {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.home2-brand-grid a {
		align-items: center;
		background: #ffffff;
		border: 1px solid #e8eaee;
		border-radius: 8px;
		color: #121214;
		display: grid;
		gap: 13px;
		grid-template-columns: 60px minmax(0, 1fr);
		min-height: 82px;
		padding: 10px 16px 10px 15px;
	}

	.home2-brand-grid a:hover {
		background: #e8eddf;
		border-color: #dbe4ca;
		color: #121214;
		transform: none;
	}

	.home2-brand-grid__logo {
		align-items: center;
		background: #f4f5f7;
		border-radius: 7px;
		display: flex;
		height: 56px;
		justify-content: center;
		overflow: hidden;
		width: 60px;
	}

	.home2-brand-grid__logo img {
		max-height: 38px;
		max-width: 49px;
		object-fit: contain;
		transform: none !important;
	}

	.home2-brand-grid__copy {
		display: grid;
		gap: 5px;
		min-width: 0;
	}

	.home2-browse-cta-grid {
		display: grid;
		gap: 12px;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		margin-top: 14px;
	}

	.home2-browse-cta {
		border-radius: 8px;
		color: #121214;
		display: grid;
		min-height: 176px;
		overflow: hidden;
		position: relative;
	}

	.home2-browse-cta:hover {
		color: #121214;
		transform: none;
	}

	.home2-browse-cta--inventory {
		background: #101214;
		color: #ffffff;
		grid-template-columns: minmax(0, 1fr) 54px;
	}

	.home2-browse-cta--inventory:hover {
		color: #ffffff;
	}

	.home2-browse-cta--inventory img {
		height: 100%;
		inset: 0;
		object-fit: cover;
		object-position: center right;
		position: absolute;
		transform: none !important;
		width: 100%;
	}

	.home2-browse-cta--inventory::after {
		background: linear-gradient(
			90deg,
			rgb(10 12 12 / 0.98) 0%,
			rgb(10 12 12 / 0.84) 44%,
			rgb(10 12 12 / 0.16) 82%
		);
		content: '';
		inset: 0;
		pointer-events: none;
		position: absolute;
	}

	.home2-browse-cta--request {
		background: linear-gradient(90deg, #dce9c6 0%, #dbe8c5 58%, #cfdcb7 100%);
		border: 1px solid #cddcb5;
		grid-template-columns: minmax(0, 1fr) 54px;
	}

	.home2-browse-cta--request:hover {
		background: linear-gradient(90deg, #d7e6bd 0%, #d5e3bd 58%, #cbd9b3 100%);
	}

	.home2-browse-cta__request-img {
		bottom: -14px;
		height: 142px;
		object-fit: contain;
		object-position: right bottom;
		opacity: 0.72;
		position: absolute;
		right: 42px;
		transform: none !important;
		width: min(48%, 270px);
	}

	.home2-browse-cta__copy {
		align-content: center;
		display: grid;
		gap: 8px;
		max-width: 430px;
		padding: 24px 28px;
		position: relative;
		z-index: 1;
	}

	.home2-browse-cta--request .home2-browse-cta__copy {
		max-width: 380px;
	}

	.home2-browse-cta__copy small {
		color: #E3062F;
		font-size: 12px;
		font-weight: 1000;
		line-height: 1;
		text-transform: uppercase;
	}

	.home2-browse-cta--request .home2-browse-cta__copy small {
		color: #1c1c1c;
	}

	.home2-browse-cta__copy strong {
		color: inherit !important;
		font-size: clamp(22px, 2vw, 31px);
		font-weight: 1000;
		letter-spacing: 0;
		line-height: 1.04;
	}

	.home2-browse-cta__copy em {
		color: inherit !important;
		font-size: 14px;
		font-style: normal;
		font-weight: 760;
		line-height: 1.35;
		opacity: 0.84;
	}

	.home2-browse-cta--inventory .home2-browse-cta__copy,
	.home2-browse-cta--inventory .home2-browse-cta__copy strong,
	.home2-browse-cta--inventory .home2-browse-cta__copy em {
		color: #ffffff !important;
		text-shadow: 0 2px 14px rgb(0 0 0 / 0.42);
	}

	.home2-browse-cta__arrow {
		align-items: center;
		align-self: end;
		background: #ffffff;
		border-radius: 999px;
		color: #121214;
		display: inline-flex;
		height: 40px;
		justify-content: center;
		justify-self: end;
		margin: 0 18px 18px 0;
		position: relative;
		width: 40px;
		z-index: 1;
	}

	.home2-browse-cta:hover .home2-browse-cta__arrow {
		background: #ffffff;
		color: var(--bc-hover-accent);
	}

	.home2-browse-cta__arrow :global(svg) {
		stroke: currentColor !important;
	}

	.home2-browse-cta:hover .home2-browse-cta__arrow :global(svg),
	.home2-browse-cta:hover .home2-browse-cta__arrow :global(svg *) {
		color: currentColor !important;
		stroke: currentColor !important;
	}

	.home2-brand-grid__copy strong,
	.home2-body-grid strong {
		color: inherit;
		font-size: 17px;
		font-weight: 1000;
		line-height: 1.05;
		overflow-wrap: anywhere;
	}

	.home2-brand-grid__copy small,
	.home2-body-grid small {
		color: #626067;
		font-size: 12px;
		font-weight: 800;
	}

	.home2-type-head {
		margin: 36px 0 14px;
	}

	.home2-type-head h3 {
		color: #121214;
		font-size: 23px;
		font-weight: 1000;
		line-height: 1.1;
		margin: 0;
	}

	.home2-type-head p {
		color: #59585f;
		font-size: 13px;
		font-weight: 750;
		margin: 6px 0 0;
	}

	.home2-body-grid {
		grid-template-columns: repeat(6, minmax(0, 1fr));
	}

	.home2-body-grid a {
		background: linear-gradient(180deg, #ffffff 0%, #ebecef 100%);
		border: 1px solid #e2e4e8;
		border-radius: 8px;
		color: #121214;
		display: grid;
		grid-template-rows: auto 1fr;
		min-height: 152px;
		overflow: hidden;
		padding: 14px 12px 0;
	}

	.home2-body-grid a:hover {
		background: linear-gradient(180deg, #ffffff 0%, #e8eddf 100%);
		border-color: #dbe4ca;
		color: #121214;
		transform: none;
	}

	.home2-body-card__copy {
		display: grid;
		gap: 4px;
		position: relative;
		z-index: 1;
	}

	.home2-body-grid img {
		align-self: end;
		height: 78px;
		justify-self: center;
		max-width: 140px;
		object-fit: contain;
		transform: none !important;
		width: 100%;
	}

	@media (max-width: 1100px) {
		.home2-brand-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.home2-browse-cta-grid {
			grid-template-columns: 1fr;
		}

		.home2-body-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (max-width: 760px) {
		.home2-partners {
			padding-inline: 16px;
		}

		.home2-browse-head h2 {
			font-size: 31px;
		}

		.home2-brand-grid,
		.home2-body-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
