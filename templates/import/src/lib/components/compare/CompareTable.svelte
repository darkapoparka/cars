<script lang="ts">
	import { publicPageCopy } from '$lib/content/desktop-copy';
	import { assetHref } from '$lib/utils/assets';
	import { linkHref } from '$lib/utils/links';
	import type { AuxeroInventoryVehicleCard } from '$lib/domain/vehicle-card';
	import type { Locale } from '$lib/locale/core';
	import Action from '$lib/components/common/Action.svelte';
	import CompareVehicleColumns from './CompareVehicleColumns.svelte';
	import { compareDialogCopy } from '$lib/content/compare-dialog';
	let {
		selected,
		locale,
		presentation = 'page',
		differencesOnly = false,
		onremove
	}: {
		selected: AuxeroInventoryVehicleCard[];
		locale: Locale;
		presentation?: 'page' | 'dialog';
		differencesOnly?: boolean;
		onremove: (slug: string) => void;
	} = $props();
	const copy = $derived(publicPageCopy[locale].compare);
	const specifications = $derived([
		{ label: copy.price, key: 'priceLabel' as const },
		{ label: copy.year, key: 'year' as const },
		{ label: copy.mileage, key: 'mileageLabel' as const },
		{ label: copy.fuel, key: 'fuel' as const },
		{ label: copy.transmission, key: 'transmission' as const }
	]);
	const rows = $derived(
		differencesOnly
			? specifications.filter(
					(row) => new Set(selected.map((car) => String(car[row.key] || '—'))).size > 1
				)
			: specifications
	);
</script>

{#if presentation === 'dialog'}
	<CompareVehicleColumns {selected} {locale} {rows} {onremove} />
{:else}
	<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need to focus and scroll the comparison region.) -->
	<div class="compare-scroll" tabindex="0" role="region" aria-label={copy.table}>
		<table>
			<caption class="sr-only">{copy.specifications}</caption>
			<thead>
				<tr>
					<th scope="col">{copy.vehicle}</th>
					{#each selected as car (car.slug)}
						<th scope="col">
							<div class="compare-car">
								<a href={linkHref('/inventory/' + car.slug)}>
									<span class="compare-media">
										<img
											src={assetHref(car.image)}
											class:compare-cutout={car.imagePresentation === 'cutout'}
											alt=""
											width="300"
											height="200"
											loading="lazy"
										/>
									</span>
									<span class="compare-car-title">{car.title}</span>
								</a>
								<Action variant="quiet" onclick={() => onremove(car.slug)}>{copy.remove}</Action>
							</div>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each rows as row (row.key)}
					<tr class:compare-price={row.key === 'priceLabel'}>
						<th scope="row">{row.label}</th>
						{#each selected as car (car.slug)}<td>{car[row.key] || '—'}</td>{/each}
					</tr>
				{:else}
					<tr class="compare-same"
						><td colspan={selected.length + 1}>{compareDialogCopy[locale].same}</td></tr
					>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<style>
	.compare-scroll {
		overflow-x: auto;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-panel);
		background: var(--bc-surface-raised);
	}
	table {
		border-collapse: collapse;
		width: 100%;
	}
	th,
	td {
		min-width: 200px;
		padding: var(--bc-space-4);
		vertical-align: top;
		text-align: left;
		border-bottom: 1px solid var(--bc-border);
	}
	th:first-child {
		min-width: 130px;
		position: sticky;
		left: 0;
		background: var(--bc-surface);
		z-index: 1;
	}
	th {
		font-weight: var(--bc-weight-heading);
	}
	thead th {
		width: 260px;
	}
	thead th a {
		display: grid;
		color: inherit;
		gap: var(--bc-space-3);
		text-decoration: none;
	}
	.compare-car {
		position: relative;
	}
	.compare-media {
		display: block;
		overflow: hidden;
		border-radius: var(--bc-radius-card);
	}
	thead img {
		width: 100%;
		height: 140px;
		object-fit: cover;
		border-radius: var(--bc-radius-card);
	}
	tbody tr:last-child > * {
		border-bottom: 0;
	}
	@media (min-width: 768px) {
		.compare-scroll {
			border-radius: var(--bc-desktop-card-radius);
			box-shadow: var(--bc-editorial-shadow);
		}
		thead th {
			width: auto;
		}
		th:first-child {
			width: 160px;
			min-width: 160px;
			max-width: 160px;
		}
		thead img {
			height: 160px;
			border-radius: var(--bc-desktop-media-radius);
			background: var(--bc-card-media);
		}
		thead th a {
			font-size: var(--bc-desktop-card-title, var(--bc-text-h5));
			line-height: var(--bc-leading-h5);
		}
		th,
		td {
			font-size: var(--bc-text-body);
			line-height: var(--bc-leading-body);
		}
		thead :global(.site-action) {
			--action-text: var(--bc-text-control);
		}
		tbody tr:first-child td {
			font-size: var(--bc-desktop-card-price, var(--bc-text-h4));
			font-weight: var(--bc-weight-heading);
			font-variant-numeric: tabular-nums;
			white-space: nowrap;
		}
		thead img.compare-cutout {
			object-fit: contain;
			padding: var(--bc-space-3);
		}
	}
	@media (min-width: 768px) {
		thead img {
			height: auto;
			aspect-ratio: 16 / 10;
			max-height: 200px;
		}
		.compare-car-title {
			min-height: 2.7em;
		}
		thead th:first-child {
			vertical-align: bottom;
		}
		tbody th {
			color: var(--bc-copy);
			font-weight: var(--bc-weight-control);
		}
		thead th + th,
		tbody td {
			border-left: 1px solid var(--bc-border);
		}
	}
	@media (max-width: 767.98px) {
		.compare-scroll {
			--compare-car-width: max(144px, calc((100vw - var(--bc-page-x) * 2 - 104px) / 2));
		}
		table {
			width: max-content;
			min-width: 100%;
			table-layout: fixed;
		}
		thead th a {
			font-size: var(--bc-text-body);
			line-height: 1.25;
			gap: var(--bc-space-2);
			overflow-wrap: break-word;
		}
		thead img {
			height: 80px;
		}

		th,
		td {
			min-width: var(--compare-car-width);
			width: var(--compare-car-width);
			max-width: var(--compare-car-width);
			padding: var(--bc-space-2);
			font-size: var(--bc-text-body);
			overflow-wrap: anywhere;
		}
		th:first-child {
			min-width: 104px;
			width: 104px;
			max-width: 104px;
			font-size: var(--bc-text-label);
		}
	}
</style>
