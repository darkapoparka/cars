<script lang="ts">
	import { ArrowRight, GitCompare, X } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { getDayNightVehicleBySlug } from '$lib/data/daynight-vehicles';
	import { getGarageContext } from '$lib/state/garage.svelte';

	const garage = getGarageContext();
	const vehicles = $derived(
		garage.compare
			.map((slug) => getDayNightVehicleBySlug(slug))
			.filter((vehicle): vehicle is NonNullable<ReturnType<typeof getDayNightVehicleBySlug>> =>
				Boolean(vehicle)
			)
	);
</script>

{#if vehicles.length || garage.formMessage}
	<aside class="compare-tray" data-compare-tray aria-label="Избрани автомобили за сравнение">
		{#if vehicles.length}
			<div class="compare-tray__main">
				<div class="compare-tray__heading">
					<span class="compare-tray__icon" aria-hidden="true"><GitCompare size={17} /></span>
					<div>
						<strong>Сравнение</strong>
						<span>{vehicles.length} от 3 автомобила</span>
					</div>
				</div>

				<div class="compare-tray__items" aria-label="Избрани за сравнение">
					{#each vehicles as vehicle (vehicle.slug)}
						<div class="compare-tray__item">
							<img src={vehicle.image} alt="" loading="lazy" decoding="async" />
							<span>{vehicle.shortTitle}</span>
							<button
								type="button"
								aria-label={`Премахни ${vehicle.shortTitle} от сравнение`}
								onclick={() => garage.toggleCompare(vehicle.slug)}
							>
								<X size={15} strokeWidth={2.4} />
							</button>
						</div>
					{/each}
				</div>

				<div class="compare-tray__actions">
					<a class="compare-tray__open" href={resolve('/compare')}>
						Сравни <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
					</a>
					<button type="button" class="compare-tray__clear" onclick={() => garage.clearCompare()}>
						Изчисти
					</button>
				</div>
			</div>
		{/if}

		{#if garage.formMessage}
			<p class="compare-tray__message" role="alert" aria-live="polite">{garage.formMessage}</p>
		{/if}
	</aside>
{/if}

<style>
	.compare-tray {
		position: fixed;
		z-index: 64;
		right: 18px;
		bottom: 22px;
		left: 18px;
		width: min(100% - 36px, 760px);
		margin: 0 auto;
		border: 1px solid #d9e1ea;
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.98);
		box-shadow: 0 14px 32px rgba(15, 23, 42, 0.18);
		color: #111827;
		font-family: var(--sa-font);
		-webkit-backdrop-filter: blur(12px);
		backdrop-filter: blur(12px);
	}

	.compare-tray__main {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 14px;
		padding: 10px 12px;
	}

	.compare-tray__heading {
		display: flex;
		align-items: center;
		gap: 8px;
		white-space: nowrap;
	}

	.compare-tray__heading > div {
		display: grid;
		gap: 2px;
	}

	.compare-tray__heading strong {
		font-size: 13px;
		font-weight: 800;
	}

	.compare-tray__heading span:last-child {
		color: #677284;
		font-size: 11px;
		font-weight: 600;
	}

	.compare-tray__icon {
		display: grid;
		width: 34px;
		height: 34px;
		place-items: center;
		border-radius: 50%;
		background: #eef3fa;
		color: var(--sa-blue);
	}

	.compare-tray__items {
		display: flex;
		min-width: 0;
		align-items: center;
		gap: 6px;
		overflow-x: auto;
		padding: 1px 0;
		scrollbar-width: none;
	}

	.compare-tray__items::-webkit-scrollbar {
		display: none;
	}

	.compare-tray__item {
		display: inline-flex;
		min-width: 0;
		max-width: 190px;
		align-items: center;
		gap: 5px;
		border: 1px solid #e1e7ef;
		border-radius: 999px;
		background: #f7f9fb;
		padding: 3px 4px 3px 5px;
		color: #263244;
		font-size: 11px;
		font-weight: 700;
		white-space: nowrap;
	}

	.compare-tray__item img {
		width: 27px;
		height: 22px;
		flex: 0 0 auto;
		border-radius: 5px;
		background: #e7edf4;
		object-fit: cover;
	}

	.compare-tray__item span {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.compare-tray__item button {
		display: grid;
		width: 28px;
		height: 28px;
		flex: 0 0 28px;
		place-items: center;
		border: 0;
		border-radius: 50%;
		background: transparent;
		padding: 0;
		color: #6b7280;
		cursor: pointer;
	}

	.compare-tray__item button:hover,
	.compare-tray__item button:focus-visible {
		background: #e8edf3;
		color: #111827;
	}

	.compare-tray__item button:focus-visible,
	.compare-tray__clear:focus-visible,
	.compare-tray__open:focus-visible {
		outline: 3px solid rgba(47, 122, 255, 0.38);
		outline-offset: 2px;
	}

	.compare-tray__actions {
		display: flex;
		align-items: center;
		gap: 8px;
		white-space: nowrap;
	}

	.compare-tray__open,
	.compare-tray__clear {
		display: inline-flex;
		min-height: 36px;
		align-items: center;
		justify-content: center;
		gap: 5px;
		border-radius: 999px;
		padding: 0 12px;
		font-size: 12px;
		font-weight: 800;
		text-decoration: none;
	}

	.compare-tray__open {
		background: var(--sa-red);
		color: #fff;
	}

	.compare-tray__clear {
		border: 1px solid #d9e1ea;
		background: #fff;
		color: #526071;
		cursor: pointer;
	}

	.compare-tray__message {
		margin: 0;
		border-top: 1px solid #e6ebf1;
		padding: 8px 12px 9px;
		color: #9f1020;
		font-size: 12px;
		font-weight: 700;
		line-height: 1.35;
	}

	@media (max-width: 991px) {
		.compare-tray {
			right: 8px;
			bottom: calc(70px + env(safe-area-inset-bottom));
			left: 8px;
			width: auto;
			border-radius: 13px;
		}

		.compare-tray__main {
			grid-template-columns: auto minmax(0, 1fr);
			gap: 9px;
		}

		.compare-tray__heading {
			gap: 6px;
		}

		.compare-tray__icon {
			width: 30px;
			height: 30px;
		}

		.compare-tray__items {
			grid-column: 2;
			grid-row: 1;
		}

		.compare-tray__actions {
			grid-column: 1 / -1;
			justify-content: end;
		}
	}

	@media (max-width: 420px) {
		.compare-tray__heading > div {
			display: none;
		}

		.compare-tray__main {
			grid-template-columns: auto minmax(0, 1fr);
		}

		.compare-tray__open,
		.compare-tray__clear {
			min-height: 34px;
			padding-inline: 10px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.compare-tray * {
			transition: none !important;
		}
	}
</style>
