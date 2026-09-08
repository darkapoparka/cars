<script lang="ts">
	import { Heart } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import VehicleCard from '$lib/components/inventory/desktop/VehicleCard.svelte';
	import { cars, getDayNightVehicleBySlug, type DayNightVehicle } from '$lib/data/daynight-vehicles';
	import { getGarageContext } from '$lib/state/garage.svelte';
	import '$lib/components/inventory/desktop/inventory-desktop-base.css';
	import '$lib/components/inventory/desktop/inventory-desktop-layout.css';
	import '$lib/components/inventory/desktop/inventory-desktop-template-head.css';

	const garage = getGarageContext();

	const vehicles = $derived(
		garage.favorites
			.map((slug) => getDayNightVehicleBySlug(slug))
			.filter((vehicle): vehicle is DayNightVehicle => Boolean(vehicle))
	);
	const suggestedVehicles = $derived(
		cars.filter((vehicle) => !garage.favorites.includes(vehicle.slug)).slice(0, 4)
	);
	const countLabel = $derived(
		vehicles.length === 1 ? '1 запазен автомобил' : `${vehicles.length} запазени автомобила`
	);
</script>

<main id="main-content" tabindex="-1" class="desktop-favorites inventory-template-shell">
	<section class="desktop-favorites__hero" aria-labelledby="favorites-title">
		<div class="desktop-favorites__hero-inner">
			<div class="desktop-favorites__hero-copy">
				<p class="desktop-favorites__eyebrow">Любими</p>
				<h1 id="favorites-title">Запазени автомобили</h1>
				<p>
					{vehicles.length
						? `${countLabel} са готови за сравнение, оглед или запитване.`
						: 'Запазвайте автомобили от наличността и ги преглеждайте тук.'}
				</p>
			</div>
			<div class="desktop-favorites__hero-actions" aria-label="Действия">
				<a
					class="desktop-favorites__cta desktop-favorites__cta--primary"
					href={resolve('/inventory')}
				>
					Виж наличните автомобили
				</a>
				<a
					class="desktop-favorites__cta desktop-favorites__cta--secondary"
					href={resolve('/compare')}
				>
					Сравни автомобили
				</a>
			</div>
		</div>
	</section>

	<section class="desktop-favorites__content" aria-label="Списък със запазени автомобили">
		{#if vehicles.length}
			<div class="desktop-favorites__section-heading">
				<div>
					<p class="desktop-favorites__section-kicker">Вашият избор</p>
					<h2>{countLabel}</h2>
				</div>
				<p>Натиснете сърцето върху карта, за да премахнете автомобил от запазените.</p>
			</div>
			<div class="desktop-favorites__grid">
				{#each vehicles as vehicle, index (vehicle.slug)}
					<VehicleCard {vehicle} {index} extraClass="desktop-favorites__vehicle" />
				{/each}
			</div>
		{:else}
			<div class="desktop-favorites__empty">
				<div class="desktop-favorites__empty-icon" aria-hidden="true">
					<Heart size={34} strokeWidth={2.2} />
				</div>
				<h2>Нямате запазени автомобили</h2>
				<p>Изберете сърцето върху обява, за да съберете кратък списък за оглед и сравнение.</p>
				<a
					class="desktop-favorites__cta desktop-favorites__cta--primary"
					href={resolve('/inventory')}
				>
					Разгледай автомобилите
				</a>
			</div>
		{/if}

		{#if suggestedVehicles.length}
			<div class="desktop-favorites__section-heading desktop-favorites__section-heading--suggested">
				<div>
					<p class="desktop-favorites__section-kicker">Още налични</p>
					<h2>Автомобили, които може да разгледате</h2>
				</div>
				<a class="desktop-favorites__section-link" href={resolve('/inventory')}>
					Всички автомобили
				</a>
			</div>
			<div class="desktop-favorites__grid">
				{#each suggestedVehicles as vehicle, index (vehicle.slug)}
					<VehicleCard {vehicle} index={index + vehicles.length} />
				{/each}
			</div>
		{/if}
	</section>
</main>

<style>
	.desktop-favorites {
		background: #f3f6fa;
		color: #0f172a;
		font-family: var(--sa-font);
		min-height: 720px;
		padding-bottom: 96px;
	}

	.desktop-favorites__hero {
		background: var(--sa-blue);
		color: #fff;
	}

	.desktop-favorites__hero-inner,
	.desktop-favorites__content {
		box-sizing: border-box;
		margin: 0 auto;
		max-width: 1440px;
		padding-left: 15px;
		padding-right: 15px;
		width: 100%;
	}

	.desktop-favorites__hero-inner {
		align-items: end;
		display: flex;
		gap: 32px;
		justify-content: space-between;
		min-height: 288px;
		padding-bottom: 56px;
		padding-top: 58px;
	}

	.desktop-favorites__hero-copy {
		max-width: 760px;
	}

	.desktop-favorites__eyebrow,
	.desktop-favorites__section-kicker {
		color: #B00000;
		font-size: var(--sa-text-desktop-dense, 16px);
		font-weight: 700;
		line-height: 1.2;
		margin: 0 0 8px;
	}

	.desktop-favorites__eyebrow {
		color: rgba(255, 255, 255, 0.78);
	}

	.desktop-favorites h1,
	.desktop-favorites h2,
	.desktop-favorites p {
		letter-spacing: 0;
	}

	.desktop-favorites h1 {
		color: #fff;
		font-size: clamp(52px, 4.6vw, 68px);
		font-weight: 650;
		line-height: 1.04;
		margin: 0;
	}

	.desktop-favorites__hero-copy > p:last-child {
		color: rgba(255, 255, 255, 0.88);
		font-size: var(--sa-text-desktop-lead, 20px);
		font-weight: 500;
		line-height: 1.5;
		margin: 18px 0 0;
		max-width: 720px;
	}

	.desktop-favorites__hero-actions {
		align-items: center;
		display: flex;
		flex: 0 0 auto;
		gap: 12px;
	}

	.desktop-favorites__cta,
	.desktop-favorites__section-link {
		align-items: center;
		border-radius: 8px;
		display: inline-flex;
		font-size: var(--sa-text-desktop-action, 18px);
		font-weight: 600;
		justify-content: center;
		line-height: 1.15;
		min-height: 52px;
		padding: 0 24px;
		text-decoration: none;
		transition:
			background-color 0.14s ease-out,
			border-color 0.14s ease-out,
			color 0.14s ease-out;
		white-space: nowrap;
	}

	.desktop-favorites__cta--primary {
		background: #e11c2a;
		border: 1px solid #e11c2a;
		color: #fff;
	}

	.desktop-favorites__cta--primary:hover,
	.desktop-favorites__cta--primary:focus-visible {
		background: #b90f1f;
		border-color: #b90f1f;
		color: #fff;
	}

	.desktop-favorites__cta--secondary,
	.desktop-favorites__section-link {
		background: #fff;
		border: 1px solid #fff;
		color: #111827;
	}

	.desktop-favorites__cta--secondary:hover,
	.desktop-favorites__cta--secondary:focus-visible {
		background: var(--sa-yellow);
		border-color: var(--sa-yellow);
		color: #111827;
	}

	.desktop-favorites__content {
		padding-top: 52px;
	}

	.desktop-favorites__section-heading {
		align-items: end;
		display: flex;
		gap: 28px;
		justify-content: space-between;
		margin-bottom: 24px;
	}

	.desktop-favorites__section-heading h2 {
		color: #101828;
		font-size: clamp(34px, 3vw, 44px);
		font-weight: 650;
		line-height: 1.08;
		margin: 0;
	}

	.desktop-favorites__section-heading > p {
		color: #475467;
		font-size: var(--sa-text-desktop-body, 18px);
		font-weight: 500;
		line-height: 1.5;
		margin: 0;
		max-width: 520px;
		text-align: right;
	}

	.desktop-favorites__section-heading--suggested {
		border-top: 1px solid #dce5f0;
		margin-top: 56px;
		padding-top: 44px;
	}

	.desktop-favorites__section-link {
		background: #fff;
		border-color: #cbd7e6;
		color: #111827;
		min-height: 48px;
	}

	.desktop-favorites__section-link:hover,
	.desktop-favorites__section-link:focus-visible {
		background: #B00000;
		border-color: #B00000;
		color: #fff;
	}

	.desktop-favorites__grid {
		display: grid;
		gap: 24px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.desktop-favorites__empty {
		align-items: center;
		background: #fff;
		border: 1px solid #dfe7f2;
		border-radius: 8px;
		display: grid;
		gap: 14px;
		justify-items: center;
		min-height: 360px;
		padding: 48px 32px;
		text-align: center;
	}

	.desktop-favorites__empty-icon {
		align-items: center;
		background: #fff1f3;
		border-radius: 999px;
		color: #e11c2a;
		display: inline-flex;
		height: 72px;
		justify-content: center;
		width: 72px;
	}

	.desktop-favorites__empty h2 {
		color: #101828;
		font-size: var(--sa-text-desktop-panel-title, 28px);
		font-weight: 650;
		line-height: 1.15;
		margin: 0;
	}

	.desktop-favorites__empty p {
		color: #475467;
		font-size: var(--sa-text-desktop-body, 18px);
		line-height: 1.55;
		margin: 0;
		max-width: 560px;
	}

	.desktop-favorites :global(.card-box.card-box-style-1[data-daynight-vehicle-card]) {
		border-radius: 8px;
	}

	.desktop-favorites :global(.card-box.card-box-style-1[data-daynight-vehicle-card] .image) {
		border-radius: 8px 8px 0 0;
	}

	.desktop-favorites :global(.card-box.card-box-style-1[data-daynight-vehicle-card] .content) {
		border-radius: 0 0 8px 8px;
	}

	@media (max-width: 1320px) {
		.desktop-favorites__grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (max-width: 991px) {
		.desktop-favorites {
			display: none;
		}
	}
</style>
