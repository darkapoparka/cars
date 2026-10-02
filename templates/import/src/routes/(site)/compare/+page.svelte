<script lang="ts">
	import { publicPageCopy } from '$lib/content/desktop-copy';
	import { pageDescriptions } from '$lib/content/seo';
	import { assetHref } from '$lib/utils/assets';
	import { page } from '$app/state';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { goto } from '$app/navigation';
	import type { PageProps } from './$types';
	import { getGarageContext } from '$lib/state/garage.svelte';
	import { linkHref } from '$lib/utils/links';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import MobileVehiclePicker from '$lib/components/compare/MobileVehiclePicker.svelte';
	let { data }: PageProps = $props();
	const copy = $derived(publicPageCopy[data.locale].compare);
	const garage = getGarageContext();
	const english = $derived(data.locale === 'en');
	const ids = $derived(
		[
			...new Set(
				(page.url.searchParams.get('ids') ?? page.url.searchParams.get('compare'))
					?.split(',')
					.filter(Boolean) ?? garage.compare
			)
		].slice(0, 4)
	);
	const selected = $derived(
		ids
			.map((id) => data.cards.find((card) => card.slug === id))
			.filter((card) => card !== undefined)
			.slice(0, 4)
	);
	const available = $derived(data.cards.filter((card) => !ids.includes(card.slug)));
	const rows = $derived([
		{ label: copy.price, key: 'priceLabel' as const },
		{ label: copy.year, key: 'year' as const },
		{ label: copy.mileage, key: 'mileageLabel' as const },
		{ label: copy.fuel, key: 'fuel' as const },
		{ label: copy.transmission, key: 'transmission' as const }
	]);
	let pickerOpen = $state(false);
	let pendingCar = $state<string | null>(null);
	function chooseCar(slug: string) {
		pendingCar = slug;
		pickerOpen = false;
	}
	function finishPicker() {
		if (!pendingCar) return;
		const slug = pendingCar;
		pendingCar = null;
		// Start in the next event turn, after all router popstate listeners finish.
		setTimeout(() => update([...ids, slug]), 0);
	}
	function update(next: string[]) {
		const valid = [...new Set(next)].slice(0, 4);
		garage.setCompare(valid);
		const params = new SvelteURLSearchParams({ ids: valid.join(',') });
		if (english) params.set('lang', 'en');
		void goto(linkHref('/compare?' + params), { noScroll: true, keepFocus: true });
	}
</script>

<svelte:head
	><title>{copy.title} — {data.site.identity.name}</title><meta
		name="description"
		content={pageDescriptions.compare[data.locale === 'en' ? 'en' : 'bg']}
	/></svelte:head
>
<main id="main-content">
	<PageIntro title={copy.title}>
		{#snippet mobileActions()}
			<button
				class="compare-picker-trigger"
				type="button"
				disabled={selected.length >= 4}
				aria-haspopup="dialog"
				aria-expanded={pickerOpen}
				onclick={(event) => {
					event.currentTarget.focus({ preventScroll: true });
					pickerOpen = true;
				}}
				><Plus size={22} aria-hidden="true" /><span>{copy.add}</span><small
					>{selected.length} / 4</small
				></button
			>
		{/snippet}
	</PageIntro>
	<div class="site-section site-container site-stack">
		{#if selected.length}<div class="compare-mobile-controls">
				<Action variant="quiet" onclick={() => update([])}>{copy.clear}</Action
				>{#if selected.length > 1}<span>{copy.swipe}</span>{/if}
			</div>{/if}
		<div class="compare-controls">
			<label class="site-field"
				><span>{copy.addFour}</span><select
					disabled={selected.length >= 4}
					value=""
					onchange={(event) => {
						if (event.currentTarget.value) update([...ids, event.currentTarget.value]);
					}}
					><option value="">{copy.choose}</option>{#each available as car (car.slug)}<option
							value={car.slug}>{car.title}</option
						>{/each}</select
				></label
			>{#if selected.length}<Action variant="quiet" onclick={() => update([])}>{copy.clear}</Action
				>{/if}
		</div>
		{#if selected.length}
			<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need to focus and scroll the comparison region.) -->
			<div class="compare-scroll" tabindex="0" role="region" aria-label={copy.table}>
				<table>
					<caption class="sr-only">{copy.specifications}</caption><thead
						><tr
							><th scope="col">{copy.vehicle}</th>{#each selected as car (car.slug)}<th scope="col"
									><a href={linkHref('/inventory/' + car.slug)}
										><img
											src={assetHref(car.image)}
											alt=""
											width="300"
											height="200"
											loading="lazy"
										/>{car.title}</a
									><Action
										variant="quiet"
										onclick={() => update(ids.filter((id) => id !== car.slug))}
										>{copy.remove}</Action
									></th
								>{/each}</tr
						></thead
					>
					<tbody
						>{#each rows as row (row.key)}<tr
								><th scope="row">{row.label}</th>{#each selected as car (car.slug)}<td
										>{car[row.key] || '—'}</td
									>{/each}</tr
							>{/each}</tbody
					>
				</table>
			</div>
		{:else}<div class="site-panel site-stack site-empty-state">
				<h2>{copy.emptyTitle}</h2>
				<p>
					{copy.emptyText}
				</p>
				<Action href="/inventory" variant="secondary">{copy.browse}</Action>
			</div>{/if}
	</div>
</main>
<MobileVehiclePicker
	bind:open={pickerOpen}
	cars={available}
	{english}
	onselect={chooseCar}
	onclose={finishPicker}
/>

<style>
	.compare-mobile-controls {
		display: none;
	}
	.compare-picker-trigger {
		display: flex;
		align-items: center;
		gap: var(--bc-space-3);
		width: 100%;
		min-height: var(--bc-control-height-primary);
		padding: 0 var(--bc-space-4);
		border: 0;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-white);
		color: var(--bc-ink);
		font: var(--bc-weight-action) var(--bc-text-control)/var(--bc-leading-control)
			var(--bc-font-body);
		text-align: left;
	}
	.compare-picker-trigger small {
		margin-left: auto;
		font-size: var(--bc-text-label);
		color: var(--bc-muted);
		white-space: nowrap;
	}
	.compare-picker-trigger:disabled {
		opacity: 0.65;
	}
	.compare-controls {
		display: flex;
		align-items: end;
		flex-wrap: wrap;
		gap: var(--bc-space-4);
	}
	.compare-controls label {
		flex: 1;
		max-width: 600px;
		min-width: 240px;
	}
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
		gap: var(--bc-space-3);
		text-decoration: none;
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
		thead img {
			border-radius: var(--bc-desktop-media-radius);
		}
		thead th a {
			font-size: var(--bc-desktop-card-title);
			line-height: var(--bc-leading-h5);
		}
		th,
		td {
			font-size: var(--bc-text-body);
			line-height: var(--bc-leading-body);
		}
	}
	@media (max-width: 767.98px) {
		.compare-controls {
			display: none;
		}
		.compare-mobile-controls {
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-wrap: wrap;
			gap: var(--bc-space-2);
		}
		.compare-mobile-controls > span {
			color: var(--bc-muted);
			font-size: var(--bc-text-meta);
		}
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
