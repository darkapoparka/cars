<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import X from '@lucide/svelte/icons/x';
	import SearchField from '$lib/components/common/SearchField.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import { compareDialogCopy } from '$lib/content/compare-dialog';
	import { publicPageCopy } from '$lib/content/desktop-copy';
	import { vehicleImageDelivery } from '$lib/utils/vehicle-images';
	import { imageFallback } from '$lib/browser/image-fallback';
	import type { AuxeroInventoryVehicleCard } from '$lib/domain/vehicle-card';
	import type { Locale } from '$lib/locale/core';

	let {
		cards,
		selected,
		locale,
		ontoggle,
		onremove
	}: {
		cards: AuxeroInventoryVehicleCard[];
		selected: AuxeroInventoryVehicleCard[];
		locale: Locale;
		ontoggle: (slug: string) => void;
		onremove: (slug: string) => void;
	} = $props();
	const id = $props.id();
	const copy = $derived(compareDialogCopy[locale]);
	const pageCopy = $derived(publicPageCopy[locale].compare);
	let query = $state('');
	const selectedIds = $derived(new Set(selected.map((car) => car.slug)));
	const results = $derived(
		cards.filter((car) =>
			[car.title, car.brand, car.year]
				.join(' ')
				.toLocaleLowerCase()
				.includes(query.trim().toLocaleLowerCase())
		)
	);
</script>

<div class="compare-picker">
	<div class="compare-picker__controls">
		<SearchField
			bind:value={query}
			label={copy.search}
			placeholder={copy.placeholder}
			controls={id}
		/>
		{#if selected.length}
			<div class="compare-selection" role="group" aria-label={copy.selection}>
				{#each selected as car (car.slug)}
					{@const image = vehicleImageDelivery(car.image)}
					<button
						type="button"
						class="compare-selection__car"
						aria-label={pageCopy.remove + ': ' + car.title}
						onclick={() => onremove(car.slug)}
					>
						<img use:imageFallback src={image.src} alt="" width="48" height="36" />
						<span>{car.title}</span><X size={16} aria-hidden="true" />
					</button>
				{/each}
			</div>
		{/if}
	</div>
	<div class="compare-picker__results" {id}>
		{#each results as car (car.slug)}
			{@const image = vehicleImageDelivery(car.image)}
			{@const chosen = selectedIds.has(car.slug)}
			<button
				type="button"
				class="compare-choice"
				class:compare-choice--selected={chosen}
				aria-label={copy.select + ': ' + car.title}
				aria-pressed={chosen}
				aria-describedby={id + '-' + car.slug}
				disabled={!chosen && selected.length >= 4}
				onclick={() => ontoggle(car.slug)}
			>
				<div class="compare-choice__image">
					<img
						use:imageFallback
						src={image.src}
						srcset={image.srcset}
						sizes="120px"
						class:compare-choice__cutout={car.imagePresentation === 'cutout'}
						alt=""
						width="120"
						height="96"
						loading="lazy"
						decoding="async"
					/>
				</div>
				<div class="compare-choice__info">
					<strong>{car.title}</strong>
					<div id={id + '-' + car.slug}>
						<span>{car.year} · {car.mileageLabel}</span><b>{car.priceLabel}</b>
					</div>
				</div>
				<span class="compare-choice__check" aria-hidden="true">
					{#if chosen}<Check size={16} strokeWidth={2.5} />{/if}
				</span>
			</button>
		{:else}
			<div class="compare-picker__empty">
				<p>{copy.noResults}</p>
				<Action variant="secondary" onclick={() => (query = '')}>{copy.clearSearch}</Action>
			</div>
		{/each}
	</div>
</div>

<style>
	.compare-picker {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
		min-width: 0;
	}
	.compare-picker__controls {
		flex: none;
		display: grid;
		gap: var(--bc-space-3);
		padding: var(--bc-space-4);
		border-bottom: 1px solid var(--bc-border);
		background: var(--bc-white);
	}
	.compare-selection {
		display: flex;
		gap: var(--bc-space-2);
		overflow-x: auto;
		padding: var(--bc-space-1);
		margin: calc(var(--bc-space-1) * -1);
	}
	.compare-selection__car {
		display: flex;
		align-items: center;
		gap: var(--bc-space-2);
		flex: 0 0 auto;
		min-width: 0;
		max-width: 230px;
		min-height: 44px;
		padding: 0 var(--bc-space-2);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-control);
		background: var(--bc-control);
		color: var(--bc-ink);
		font: inherit;
		font-size: var(--bc-text-meta);
		text-align: left;
		cursor: pointer;
	}
	.compare-selection__car img {
		flex: none;
		width: 48px;
		height: 36px;
		object-fit: contain;
	}
	.compare-selection__car span {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.compare-selection__car :global(svg) {
		flex: none;
	}
	.compare-picker__results {
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		align-content: start;
		gap: var(--bc-space-3);
		padding: var(--bc-space-4);
	}
	.compare-choice {
		position: relative;
		min-width: 0;
		display: grid;
		grid-template-columns: 120px minmax(0, 1fr);
		align-items: center;
		padding: 0;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		background: var(--bc-white);
		color: var(--bc-ink);
		font: inherit;
		text-align: left;
		cursor: pointer;
	}
	.compare-choice:hover:not(:disabled),
	.compare-selection__car:hover {
		background: var(--bc-control-hover);
	}
	.compare-choice--selected {
		border-color: var(--bc-ink);
		box-shadow: inset 0 0 0 1px var(--bc-ink);
	}
	.compare-choice:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}
	.compare-choice__image {
		padding: var(--bc-space-2);
	}
	.compare-choice__image img {
		display: block;
		width: 100%;
		height: 96px;
		border-radius: var(--bc-radius-control);
		object-fit: cover;
		background: var(--bc-card-media);
	}
	.compare-choice__image img.compare-choice__cutout {
		object-fit: contain;
		padding: var(--bc-space-2);
	}
	.compare-choice__info {
		display: grid;
		gap: var(--bc-space-2);
		padding: var(--bc-space-3) var(--bc-space-4) var(--bc-space-3) 0;
	}
	.compare-choice__info strong {
		padding-right: var(--bc-space-6);
		font-size: var(--bc-text-body);
		line-height: var(--bc-leading-h5);
	}
	.compare-choice__info div {
		display: grid;
		gap: var(--bc-space-1);
	}
	.compare-choice__info span {
		color: var(--bc-muted);
		font-size: var(--bc-text-meta);
	}
	.compare-choice__info b {
		font-size: var(--bc-text-control);
		font-variant-numeric: tabular-nums;
	}
	.compare-choice__check {
		position: absolute;
		right: var(--bc-space-3);
		top: var(--bc-space-3);
		display: grid;
		place-items: center;
		width: 22px;
		height: 22px;
		border: 1px solid var(--bc-border-strong);
		border-radius: var(--bc-radius-pill);
	}
	.compare-choice--selected .compare-choice__check {
		border-color: var(--bc-ink);
		background: var(--bc-ink);
		color: var(--bc-white);
	}
	.compare-picker__empty {
		grid-column: 1 / -1;
		padding: var(--bc-space-6);
		text-align: center;
	}
	@media (max-width: 767.98px) {
		.compare-selection__car {
			flex-basis: calc((100% - var(--bc-space-2)) / 2);
			max-width: none;
			gap: var(--bc-space-1);
		}
		.compare-selection__car img {
			width: 24px;
		}
		.compare-selection__car {
			min-height: var(--bc-control-height-chip);
			font-size: var(--bc-text-control);
			line-height: var(--bc-leading-control);
		}
		.compare-picker__results {
			grid-template-columns: minmax(0, 1fr);
		}
		.compare-choice {
			grid-template-columns: 88px minmax(0, 1fr);
		}
		.compare-choice__image img {
			height: 88px;
		}
		.compare-choice__info {
			gap: var(--bc-space-1);
		}
	}
</style>
