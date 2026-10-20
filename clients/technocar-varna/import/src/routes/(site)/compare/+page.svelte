<script lang="ts">
	import { publicPageCopy } from '$lib/content/desktop-copy';
	import { pageDescriptions } from '$lib/content/seo';
	import { page } from '$app/state';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { goto } from '$app/navigation';
	import type { PageProps } from './$types';
	import { getGarageContext } from '$lib/state/garage.svelte';
	import { linkHref } from '$lib/utils/links';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import CompareTable from '$lib/components/compare/CompareTable.svelte';
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
			<CompareTable
				{selected}
				locale={data.locale}
				onremove={(slug) => update(ids.filter((id) => id !== slug))}
			/>
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
	@media (min-width: 768px) {
		.compare-controls {
			width: 100%;
			padding: var(--bc-space-4) var(--bc-space-6);
			border: 1px solid var(--bc-border);
			border-radius: var(--bc-desktop-card-radius);
			background: var(--bc-card-bg);
			box-shadow: var(--bc-editorial-shadow);
		}
		.compare-controls label {
			max-width: 520px;
		}
		.compare-controls :global(.site-action) {
			margin-left: auto;
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
	}
</style>
