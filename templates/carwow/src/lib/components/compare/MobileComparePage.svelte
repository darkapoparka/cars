<script lang="ts">
	import { resolve } from '$app/paths';
	import { GitCompare, Plus, X } from '@lucide/svelte';
	import { getGarageContext } from '$lib/state/garage.svelte';
	import { getDayNightVehicleBySlug, type Car } from '$lib/data/daynight-vehicles';
	import MobileCompareSelector from './MobileCompareSelector.svelte';
	let selectorOpen = $state(false);
	import MobileBottomDock from '$lib/components/home/mobile/MobileBottomDock.svelte';
	const garage = getGarageContext();
	const vehicles = $derived(
		garage.compare.map(getDayNightVehicleBySlug).filter((car): car is Car => Boolean(car))
	);
	const rows: { label: string; value: (car: Car) => string }[] = [
		{ label: 'Година', value: (car) => String(car.year) },
		{ label: 'Пробег', value: (car) => car.mileage },
		{ label: 'Гориво', value: (car) => car.fuel },
		{ label: 'Скорости', value: (car) => car.transmission },
		{ label: 'Мощност', value: (car) => car.power },
		{ label: 'Каросерия', value: (car) => car.body },
		{ label: 'Двигател', value: (car) => car.engine },
		{ label: 'Цвят', value: (car) => car.color }
	];
</script>

<div class="mobile-compare">
	<main id="main-content" tabindex="-1">
		<div class="page-title">
			<h1>Сравнение</h1>
			<span aria-label={`${vehicles.length} от 3 избрани автомобила`}>{vehicles.length} / 3</span>
		</div>
		<div class="actions">
			<button type="button" aria-haspopup="dialog" onclick={() => (selectorOpen = true)}>
				<Plus size={20} /> {vehicles.length < 3 ? 'Добави автомобил' : 'Промени избора'}
			</button>
			{#if vehicles.length > 2}<span>Плъзнете за третия автомобил</span>{/if}
		</div>
		{#if vehicles.length}
			<!-- Keyboard focus allows horizontal scrolling of selected cars. -->
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<section class="cars" aria-label="Избрани автомобили за сравнение" tabindex="0">
				{#each vehicles as car (car.slug)}
					<article>
						<div class="photo">
							<a
								href={resolve('/inventory/[slug]', { slug: car.slug })}
								aria-label={`Виж ${car.shortTitle}`}><img src={car.image} alt={car.shortTitle} /></a
							>
							<button
								type="button"
								aria-label={`Премахни ${car.shortTitle}`}
								onclick={() => garage.toggleCompare(car.slug)}><X size={18} /></button
							>
						</div>
						<div class="identity">
							<a href={resolve('/inventory/[slug]', { slug: car.slug })}>{car.shortTitle}</a><strong
								>{car.priceEur}</strong
							>
						</div>
						<dl>
							{#each rows as row (row.label)}<div>
									<dt>{row.label}</dt>
									<dd>{row.value(car) || '—'}</dd>
								</div>{/each}
						</dl>
					</article>
				{/each}
			</section>
		{:else}
			<section class="empty" aria-label="Няма избрани автомобили">
				<GitCompare size={28} aria-hidden="true" />
				<h2>Кои автомобили сравнявате?</h2>
				<p>Изберете до 3 автомобила, за да сравните характеристиките им.</p>
			</section>
		{/if}
	</main>
	<MobileBottomDock />
</div>

{#if selectorOpen}<MobileCompareSelector onClose={() => (selectorOpen = false)} />{/if}

<style>
	.mobile-compare {
		min-height: 100svh;
		background: #fff;
		color: var(--sa-ink);
		font-family: var(--sa-font);
	}
	main {
		padding-top: env(safe-area-inset-top);
		padding-bottom: calc(80px + env(safe-area-inset-bottom));
	}
	.page-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 20px 16px 4px;
	}
	h1 {
		margin: 0;
		color: inherit;
		font-size: 22px;
		font-weight: 700;
		line-height: 1.2;
	}
	.page-title span {
		color: var(--sa-ink-soft);
		font-size: 14px;
		font-variant-numeric: tabular-nums;
	}
	.empty {
		margin: 16px;
		padding: 24px 18px;
		display: grid;
		justify-items: center;
		gap: 14px;
		border-radius: 12px;
		background: var(--sa-fill);
		text-align: center;
	}
	.empty h2 {
		margin: 0;
		font-size: 18px;
		line-height: 1.3;
	}
	.empty p {
		margin: 0;
		font-size: 14px;
		line-height: 1.5;
		color: var(--sa-ink-soft);
	}
	.empty > :global(svg) {
		color: var(--sa-red);
	}
	.actions {
		display: grid;
		gap: 10px;
		padding: 16px;
	}
	.actions span {
		font-size: 12px;
		color: var(--sa-ink-soft);
	}
	.actions button {
		border: 1px solid var(--sa-line);
		border-radius: 8px;
		background: var(--sa-fill);
		display: flex;
		justify-content: center;
		gap: 8px;
		align-items: center;
		min-height: 48px;
		width: 100%;
		color: var(--sa-ink);
		font: inherit;
		font-size: 14px;
		font-weight: 600;
	}
	.cars {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: calc((100% - 8px) / 2);
		gap: 8px;
		overflow-x: auto;
		padding: 0 16px 8px;
		scroll-snap-type: x proximity;
	}
	article {
		min-width: 0;
		border-radius: 10px;
		overflow: hidden;
		background: var(--sa-fill);
		scroll-snap-align: start;
	}
	.photo {
		position: relative;
		height: 112px;
	}
	.photo a,
	.photo img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.photo button {
		position: absolute;
		top: 4px;
		right: 4px;
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 0;
		border-radius: 50%;
		background: white;
		color: var(--sa-ink);
	}
	.identity {
		display: grid;
		align-content: start;
		grid-template-rows: 57px auto;
		gap: 6px;
		min-height: 112px;
		padding: 12px 10px;
	}
	.identity a {
		color: inherit;
		font-size: 14px;
		line-height: 1.35;
		font-weight: 600;
	}
	.identity strong {
		font-size: 17px;
		line-height: 1.3;
	}
	dl {
		margin: 0;
		padding: 0 10px 10px;
	}
	dl div {
		min-height: 70px;
		padding: 10px 0;
		border-top: 1px solid var(--sa-line);
	}
	dt {
		font-size: 12px;
		color: var(--sa-ink-soft);
		margin-bottom: 4px;
	}
	dd {
		margin: 0;
		font-size: 14px;
		line-height: 1.4;
		font-weight: 500;
		overflow-wrap: anywhere;
	}
	a:focus-visible,
	button:focus-visible,
	.cars:focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: 2px;
	}
</style>
