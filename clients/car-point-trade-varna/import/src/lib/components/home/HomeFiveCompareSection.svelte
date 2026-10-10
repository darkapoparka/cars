<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveComparePair, HomeFiveCompareVehicle } from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import { getGarageContext } from '$lib/state/garage.svelte';
	import HomeSectionCta from './HomeSectionCta.svelte';

	let {
		copy,
		pairs
	}: {
		copy: HomePageCopy;
		pairs: HomeFiveComparePair[];
	} = $props();

	const garage = getGarageContext();
	const availableVehicles = $derived(pairs.flatMap((pair) => [pair.left, pair.right]));
	const vehicleBySlug = $derived(
		new Map<string, HomeFiveCompareVehicle>(
			availableVehicles.map((vehicle) => [vehicle.slug, vehicle])
		)
	);
	const selectedVehicles = $derived(
		garage.compare
			.map((slug) => vehicleBySlug.get(slug))
			.filter((vehicle): vehicle is HomeFiveCompareVehicle => Boolean(vehicle))
	);
	const comparisonGroups = $derived([
		[selectedVehicles[0], selectedVehicles[1]],
		[selectedVehicles[2], selectedVehicles[3]]
	]);
	const isEnglish = $derived(copy.compareTitle === 'Compare Top Rated Vehicles');
	const chooseLabel = $derived(isEnglish ? 'Choose vehicle' : 'Избери автомобил');
	const pickerLabel = $derived(
		isEnglish ? 'Open vehicle comparison picker' : 'Отвори избора на автомобили за сравнение'
	);
	const openComparePicker = (event: MouseEvent) => {
		garage.openComparePicker(event.currentTarget as HTMLElement);
	};
</script>

{#if pairs.length}
	<section class="daynight-home-compare py-100">
		<div class="container">
			<div
				class="title-section daynight-home-compare__banner mb-42 flex items-center justify-between"
			>
				<h2>{copy.compareTitle}</h2>
				<HomeSectionCta href="/compare" label={copy.commonCta} />
			</div>

			<div class="daynight-home-compare__grid">
				{#each comparisonGroups as group, groupIndex (groupIndex)}
					<div class="daynight-home-compare__builder">
						{@render comparisonSlot(group[0], groupIndex * 2 + 1)}
						<button
							class="daynight-home-compare__add"
							type="button"
							aria-label={pickerLabel}
							onclick={openComparePicker}
						>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<path
									d="M12 5v14M5 12h14"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
								/>
							</svg>
						</button>
						{@render comparisonSlot(group[1], groupIndex * 2 + 2)}
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}

{#snippet comparisonSlot(vehicle: HomeFiveCompareVehicle | undefined, slotNumber: number)}
	{#if vehicle}
		<div class="daynight-home-compare__slot daynight-home-compare__slot--selected">
			<a
				class="daynight-home-compare__selected-link"
				href={resolve(`/inventory/${encodeURIComponent(vehicle.slug)}`)}
			>
				<span class="daynight-home-compare__selected-image">
					<img
						src={vehicle.image}
						alt={vehicle.title}
						width="320"
						height="200"
						loading="lazy"
						decoding="async"
					/>
				</span>
				<span class="daynight-home-compare__selected-copy">
					<strong>{vehicle.title}</strong>
					<span>{vehicle.priceLabel}</span>
				</span>
			</a>
			<button
				class="daynight-home-compare__remove"
				type="button"
				aria-label={`${isEnglish ? 'Remove' : 'Премахни'} ${vehicle.title}`}
				onclick={() => garage.removeCompare(vehicle.slug)}
			>
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
					<path
						d="M4 4l10 10M14 4L4 14"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
					/>
				</svg>
			</button>
		</div>
	{:else}
		<button
			class="daynight-home-compare__slot daynight-home-compare__slot--empty"
			type="button"
			aria-label={`${chooseLabel} ${slotNumber}`}
			onclick={openComparePicker}
		>
			<span class="daynight-home-compare__slot-icon" aria-hidden="true">
				<svg width="42" height="42" viewBox="0 0 42 42" fill="none">
					<path
						d="M8 27.5h26l-2.7-7.2a4 4 0 0 0-3.75-2.6h-13.1a4 4 0 0 0-3.75 2.6L8 27.5Z"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linejoin="round"
					/>
					<path
						d="M6.5 27.5h29v5h-29v-5Z"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linejoin="round"
					/>
					<circle cx="12" cy="32.5" r="2.5" fill="currentColor" />
					<circle cx="30" cy="32.5" r="2.5" fill="currentColor" />
				</svg>
			</span>
			<span class="daynight-home-compare__slot-number">
				{isEnglish ? `Vehicle ${slotNumber}` : `Автомобил ${slotNumber}`}
			</span>
			<strong>{chooseLabel}</strong>
		</button>
	{/if}
{/snippet}

<style>
	.daynight-home-compare {
		background: var(--bc-bg);
		padding-top: 64px;
		padding-bottom: 64px;
	}

	.daynight-home-compare__banner {
		position: relative;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		background: #101010;
		padding: 24px 28px;
	}

	.daynight-home-compare__banner h2 {
		margin: 0;
		color: #ffffff;
	}

	.daynight-home-compare__grid {
		display: grid;
		gap: 30px;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.daynight-home-compare__builder {
		align-items: center;
		background: #ffffff;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		display: grid;
		gap: 14px;
		grid-template-columns: minmax(0, 1fr) 48px minmax(0, 1fr);
		min-height: 286px;
		padding: 22px;
	}

	.daynight-home-compare__slot {
		border: 1.5px dashed #aeb3aa;
		border-radius: 10px;
		min-height: 240px;
		min-width: 0;
		position: relative;
	}

	.daynight-home-compare__slot--empty {
		align-items: center;
		background: #fafafa;
		color: #1c1c1c;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		font: inherit;
		justify-content: center;
		padding: 24px 16px;
		transition:
			background-color 0.16s ease,
			border-color 0.16s ease;
	}

	.daynight-home-compare__slot--empty:hover,
	.daynight-home-compare__slot--empty:focus-visible {
		background: #f3f3f3;
		border-color: #1c1c1c;
		outline: none;
	}

	.daynight-home-compare__slot-icon {
		align-items: center;
		color: #6f7769;
		display: inline-flex;
		justify-content: center;
		margin-bottom: 16px;
	}

	.daynight-home-compare__slot-number {
		color: #6f7769;
		font-size: 13px;
		font-weight: 600;
		line-height: 18px;
		margin-bottom: 4px;
	}

	.daynight-home-compare__slot--empty strong {
		font-size: 16px;
		font-weight: 700;
		line-height: 22px;
	}

	.daynight-home-compare__add {
		align-items: center;
		background: #1c1c1c;
		border: 0;
		border-radius: 50%;
		color: #ffffff;
		cursor: pointer;
		display: inline-flex;
		height: 48px;
		justify-content: center;
		padding: 0;
		transition: background-color 0.16s ease;
		width: 48px;
	}

	.daynight-home-compare__add:hover,
	.daynight-home-compare__add:focus-visible {
		background: var(--bc-accent);
		outline: 3px solid rgba(185, 22, 28, 0.18);
		outline-offset: 3px;
	}

	.daynight-home-compare__selected-link {
		color: #1c1c1c;
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 12px;
	}

	.daynight-home-compare__selected-image {
		align-items: center;
		background: var(--bc-surface-soft);
		border-radius: 8px;
		display: flex;
		flex: 1;
		justify-content: center;
		min-height: 136px;
		overflow: hidden;
		padding: 10px;
	}

	.daynight-home-compare__selected-image img {
		display: block;
		height: 100%;
		object-fit: contain;
		width: 100%;
	}

	.daynight-home-compare__selected-copy {
		display: grid;
		gap: 4px;
		padding-top: 12px;
		text-align: center;
	}

	.daynight-home-compare__selected-copy strong {
		font-size: 14px;
		line-height: 19px;
		overflow-wrap: anywhere;
	}

	.daynight-home-compare__selected-copy span {
		font-size: 16px;
		font-weight: 800;
		line-height: 22px;
	}

	.daynight-home-compare__remove {
		align-items: center;
		background: #ffffff;
		border: 1px solid var(--bc-border);
		border-radius: 50%;
		color: #1c1c1c;
		cursor: pointer;
		display: inline-flex;
		height: 34px;
		justify-content: center;
		padding: 0;
		position: absolute;
		right: 10px;
		top: 10px;
		width: 34px;
	}

	.daynight-home-compare__remove:hover,
	.daynight-home-compare__remove:focus-visible {
		border-color: #1c1c1c;
		outline: none;
	}

	@media (max-width: 991px) {
		.daynight-home-compare__grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 767px) {
		.daynight-home-compare {
			padding-top: 6px;
			padding-bottom: 16px;
		}

		.daynight-home-compare :global(.title-section) {
			align-items: center;
			gap: 12px;
			margin-bottom: 14px !important;
		}

		.daynight-home-compare__banner {
			border: 0;
			border-radius: 0;
			background: transparent;
			padding: 0;
		}

		.daynight-home-compare :global(.title-section h2) {
			color: #1c1c1c;
			font-size: 24px;
			font-weight: 700;
			letter-spacing: 0;
			line-height: 30px;
		}

		.daynight-home-compare :global(.daynight-section-cta) {
			display: none;
		}

		.daynight-home-compare__grid {
			display: flex;
			gap: 14px;
			margin-inline: -16px;
			overflow-x: auto;
			padding: 2px 16px;
			scroll-padding-inline: 16px;
			scroll-snap-type: x proximity;
			scrollbar-width: none;
		}

		.daynight-home-compare__grid::-webkit-scrollbar {
			display: none;
		}

		.daynight-home-compare__builder {
			flex: 0 0 min(90vw, 360px);
			gap: 8px;
			grid-template-columns: minmax(0, 1fr) 38px minmax(0, 1fr);
			min-height: 0;
			padding: 12px;
			scroll-snap-align: start;
		}

		.daynight-home-compare__slot {
			min-height: 188px;
		}

		.daynight-home-compare__slot--empty {
			padding: 18px 8px;
		}

		.daynight-home-compare__slot-icon {
			margin-bottom: 10px;
		}

		.daynight-home-compare__slot--empty strong {
			font-size: 14px;
			line-height: 18px;
		}

		.daynight-home-compare__add {
			height: 38px;
			width: 38px;
		}

		.daynight-home-compare__selected-link {
			padding: 8px;
		}

		.daynight-home-compare__selected-image {
			min-height: 102px;
		}

		.daynight-home-compare__selected-copy strong {
			font-size: 13px;
			line-height: 17px;
		}

		.daynight-home-compare__selected-copy span {
			font-size: 14px;
			line-height: 19px;
		}
	}
</style>
