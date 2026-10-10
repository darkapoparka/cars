<script lang="ts">
	import X from '@lucide/svelte/icons/x';
	import { publicPageCopy } from '$lib/content/desktop-copy';
	import { compareDialogCopy } from '$lib/content/compare-dialog';
	import type { AuxeroInventoryVehicleCard } from '$lib/domain/vehicle-card';
	import type { Locale } from '$lib/locale/core';
	import { assetHref } from '$lib/utils/assets';
	import { linkHref } from '$lib/utils/links';

	let {
		selected,
		locale,
		rows,
		onremove
	}: {
		selected: AuxeroInventoryVehicleCard[];
		locale: Locale;
		rows: {
			label: string;
			key: 'priceLabel' | 'year' | 'mileageLabel' | 'fuel' | 'transmission';
		}[];
		onremove: (slug: string) => void;
	} = $props();
	const copy = $derived(publicPageCopy[locale].compare);
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need to focus and scroll the comparison region.) -->
<div
	class="compare-scroll compare-scroll--dialog compare-vehicle-columns"
	style:--compare-count={selected.length}
	tabindex="0"
	role="region"
	aria-label={copy.table}
>
	<table>
		<caption class="sr-only">{copy.specifications}</caption>
		<thead>
			<tr>
				{#each selected as car (car.slug)}
					<th scope="col">
						<div class="compare-car">
							<a href={linkHref('/inventory/' + car.slug)} title={car.title}>
								<span class="compare-media">
									<img
										src={assetHref(car.image)}
										class:compare-cutout={car.imagePresentation === 'cutout'}
										alt=""
										width="300"
										height="200"
									/>
								</span>
								<span class="compare-car-title">{car.title}</span>
							</a>
							<button
								type="button"
								class="compare-remove"
								aria-label={copy.remove + ': ' + car.title}
								onclick={() => onremove(car.slug)}
							>
								<X size={16} aria-hidden="true" />
							</button>
						</div>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each rows as row (row.key)}
				<tr class:compare-price={row.key === 'priceLabel'}>
					<th scope="row" class="sr-only">{row.label}</th>
					{#each selected as car (car.slug)}
						<td>
							<span class="compare-fact-label" aria-hidden="true">{row.label}</span>
							<span class="compare-fact-value" title={String(car[row.key] || '—')}>
								{car[row.key] || '—'}
							</span>
						</td>
					{/each}
				</tr>
			{:else}
				<tr class="compare-same">
					<td colspan={selected.length}>{compareDialogCopy[locale].same}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.compare-vehicle-columns {
		flex: 0 1 auto;
		min-width: 0;
		min-height: 0;
		overflow: auto;
		overscroll-behavior: contain;
		background: var(--bc-white);
		scrollbar-width: thin;
		--compare-column-gap: var(--bc-space-3);
		--compare-column-surface: color-mix(in srgb, var(--bc-ink) 4%, var(--bc-white));
	}
	table,
	thead,
	tbody {
		display: block;
		width: 100%;
	}
	table {
		border-collapse: separate;
	}
	tr {
		display: grid;
		grid-template-columns: repeat(var(--compare-count), minmax(0, 1fr));
		gap: 0 var(--compare-column-gap);
	}
	thead {
		position: sticky;
		top: 0;
		z-index: 1;
		background: var(--bc-white);
	}
	th:not(.sr-only),
	td {
		min-width: 0;
		padding: var(--bc-space-3) var(--bc-space-2);
		background: var(--compare-column-surface);
		text-align: center;
	}
	thead th:not(.sr-only) {
		padding-bottom: var(--bc-space-1);
		border-radius: var(--bc-radius-panel) var(--bc-radius-panel) 0 0;
	}
	.compare-car {
		position: relative;
		max-width: 320px;
		margin-inline: auto;
	}
	.compare-car a {
		display: grid;
		gap: var(--bc-space-2);
		color: inherit;
		text-decoration: none;
	}
	.compare-media {
		display: block;
		height: 80px;
		overflow: hidden;
		border-radius: var(--bc-radius-control);
	}
	.compare-media img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: inherit;
	}
	.compare-media img.compare-cutout {
		object-fit: contain;
	}
	.compare-car-title {
		display: -webkit-box;
		height: 2.6em;
		overflow: hidden;
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-heading);
		line-height: 1.3;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}
	.compare-remove {
		position: absolute;
		top: calc(-1 * var(--bc-space-2));
		right: calc(-1 * var(--bc-space-2));
		display: grid;
		place-items: center;
		width: var(--bc-control-height-chip);
		height: var(--bc-control-height-chip);
		padding: 0;
		border: 0;
		border-radius: var(--bc-radius-pill);
		background: transparent;
		color: var(--bc-ink);
		cursor: pointer;
	}
	.compare-remove::before {
		position: absolute;
		inset: var(--bc-space-2);
		border: 1px solid var(--bc-border);
		border-radius: inherit;
		background: var(--bc-white);
		content: '';
	}
	.compare-remove :global(svg) {
		position: relative;
	}
	.compare-remove:hover::before {
		background: var(--bc-control-hover);
	}
	.compare-fact-label,
	.compare-fact-value {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.compare-fact-label {
		margin-bottom: var(--bc-space-2);
		color: var(--bc-subtle);
		font-size: 14px;
		font-weight: var(--bc-weight-control);
		line-height: 1.25;
	}
	.compare-fact-value {
		font-size: var(--bc-text-control);
		font-variant-numeric: tabular-nums;
		line-height: var(--bc-leading-control);
	}
	.compare-price .compare-fact-value {
		font-size: var(--bc-text-h4);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-leading-h4);
	}
	tbody tr:last-child td {
		padding-bottom: var(--bc-space-4);
		border-radius: 0 0 var(--bc-radius-panel) var(--bc-radius-panel);
	}
	.compare-same {
		grid-template-columns: minmax(0, 1fr);
	}
	.compare-same td {
		margin-top: var(--bc-space-3);
		padding: var(--bc-space-4);
		border-radius: var(--bc-radius-control);
		background: var(--bc-white);
		color: var(--bc-muted);
	}
	@media (min-width: 768px) {
		.compare-vehicle-columns {
			--compare-column-gap: var(--bc-space-4);
		}
		th:not(.sr-only),
		td {
			padding-inline: var(--bc-space-4);
		}
		.compare-media {
			height: auto;
			aspect-ratio: 16 / 10;
			max-height: clamp(80px, calc(100dvh - 480px), 128px);
		}
	}
	@media (max-width: 767.98px) {
		.compare-remove :global(svg) {
			width: calc(var(--bc-control-icon-size-chip) - var(--bc-space-2));
			height: calc(var(--bc-control-icon-size-chip) - var(--bc-space-2));
		}
		table {
			width: max(100%, calc(100% * var(--compare-count) / 2));
		}
	}
	@media (min-width: 768px) and (max-height: 640px) {
		.compare-media {
			height: 64px;
			aspect-ratio: auto;
		}
	}
</style>
