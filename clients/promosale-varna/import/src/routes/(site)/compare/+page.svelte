<script lang="ts">
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
	let { data }: PageProps = $props();
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
		{ label: english ? 'Price' : 'Цена', key: 'priceLabel' as const },
		{ label: english ? 'Year' : 'Година', key: 'year' as const },
		{ label: english ? 'Mileage' : 'Пробег', key: 'mileageLabel' as const },
		{ label: english ? 'Fuel' : 'Гориво', key: 'fuel' as const },
		{ label: english ? 'Transmission' : 'Скоростна кутия', key: 'transmission' as const }
	]);
	function update(next: string[]) {
		const valid = [...new Set(next)].slice(0, 4);
		garage.setCompare(valid);
		const params = new SvelteURLSearchParams({ ids: valid.join(',') });
		if (english) params.set('lang', 'en');
		void goto(linkHref('/compare?' + params), { noScroll: true, keepFocus: true });
	}
</script>

<svelte:head
	><title>{english ? 'Compare cars' : 'Сравни автомобили'} — {data.site.identity.name}</title><meta
		name="description"
		content={pageDescriptions.compare[data.locale === 'en' ? 'en' : 'bg']}
	/></svelte:head
>
<main id="main-content">
	<PageIntro title={english ? 'Compare cars' : 'Сравни автомобили'} />
	<div class="site-section site-container site-stack">
		<div class="compare-controls">
			<label class="site-field"
				><span>{english ? 'Add a car (up to four)' : 'Добави автомобил (до четири)'}</span><select
					disabled={selected.length >= 4}
					value=""
					onchange={(event) => {
						if (event.currentTarget.value) update([...ids, event.currentTarget.value]);
					}}
					><option value="">{english ? 'Choose a car' : 'Избери автомобил'}</option
					>{#each available as car (car.slug)}<option value={car.slug}>{car.title}</option
						>{/each}</select
				></label
			>{#if selected.length}<Action variant="quiet" onclick={() => update([])}
					>{english ? 'Clear comparison' : 'Изчисти сравнението'}</Action
				>{/if}
		</div>
		{#if selected.length}
			<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need to focus and scroll the comparison region.) -->
			<div
				class="compare-scroll"
				tabindex="0"
				role="region"
				aria-label={english ? 'Vehicle comparison table' : 'Таблица за сравнение'}
			>
				<table>
					<caption class="sr-only"
						>{english ? 'Vehicle specifications' : 'Характеристики на автомобилите'}</caption
					><thead
						><tr
							><th scope="col">{english ? 'Vehicle' : 'Автомобил'}</th
							>{#each selected as car (car.slug)}<th scope="col"
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
										>{english ? 'Remove' : 'Премахни'}</Action
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
				<h2>{english ? 'Choose cars to compare' : 'Избери автомобили за сравнение'}</h2>
				<p>
					{english
						? 'Compare the facts side by side, without an automatic winner.'
						: 'Сравни характеристиките на избраните автомобили.'}
				</p>
				<Action href="/inventory" variant="secondary"
					>{english ? 'Browse cars' : 'Разгледай автомобили'}</Action
				>
			</div>{/if}
	</div>
</main>

<style>
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
	@media (max-width: 767.98px) {
		th,
		td {
			min-width: 170px;
		}
		th:first-child {
			min-width: 100px;
			font-size: var(--bc-text-label);
		}
	}
</style>
