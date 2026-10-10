<script lang="ts">
	import { page } from '$app/state';
	import { tick } from 'svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Modal from '$lib/components/common/Modal.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import ComparePicker from './ComparePicker.svelte';
	import CompareTable from './CompareTable.svelte';
	import { publicPageCopy } from '$lib/content/desktop-copy';
	import { compareDialogCopy } from '$lib/content/compare-dialog';
	import { linkHref } from '$lib/utils/links';
	import { getGarageContext } from '$lib/state/garage.svelte';
	import type { AuxeroInventoryVehicleCard } from '$lib/domain/vehicle-card';

	let {
		open = $bindable(false),
		cards,
		loading,
		failed,
		onretry,
		onCloseAutoFocus
	}: {
		open?: boolean;
		cards: AuxeroInventoryVehicleCard[];
		loading: boolean;
		failed: boolean;
		onretry: () => void;
		onCloseAutoFocus: (event: Event) => void;
	} = $props();
	const garage = getGarageContext();
	const locale = $derived(page.data.locale === 'en' ? 'en' : 'bg');
	const copy = $derived(publicPageCopy[locale].compare);
	const dialogCopy = $derived(compareDialogCopy[locale]);
	const selected = $derived(
		garage.compare
			.map((slug) => cards.find((car) => car.slug === slug))
			.filter((car) => car !== undefined)
	);
	let pickerOpen = $state(false);
	let differencesOnly = $state(false);
	let linkStatus = $state<'idle' | 'copied' | 'failed'>('idle');
	const choosing = $derived(pickerOpen || selected.length < 2);
	let workspace = $state<HTMLDivElement | null>(null);
	const pageHref = $derived(
		'/compare?ids=' + encodeURIComponent(selected.map((car) => car.slug).join(','))
	);
	function startComparison(event: Event) {
		event.preventDefault();
		pickerOpen = garage.compare.length < 2;
		differencesOnly = false;
		linkStatus = 'idle';
		void focusDialog();
	}
	async function focusDialog() {
		await tick();
		workspace?.closest<HTMLElement>('[role="dialog"]')?.focus({ preventScroll: true });
	}
	function toggle(slug: string) {
		if (garage.compare.includes(slug)) garage.removeCompare(slug);
		else if (selected.length < 4) garage.setCompare([...garage.compare, slug]);
		pickerOpen = true;
		linkStatus = 'idle';
	}
	function remove(slug: string) {
		garage.removeCompare(slug);
		linkStatus = 'idle';
		void focusDialog();
	}
	async function copyLink() {
		try {
			if (!navigator.clipboard) throw new Error('Clipboard unavailable');
			await navigator.clipboard.writeText(new URL(linkHref(pageHref), page.url).href);
			linkStatus = 'copied';
		} catch {
			linkStatus = 'failed';
		}
	}
</script>

{#snippet clearComparison()}
	<Action
		variant="quiet"
		class="compare-clear"
		aria-label={copy.clear}
		title={copy.clear}
		onclick={() => {
			garage.clearCompare();
			pickerOpen = true;
			linkStatus = 'idle';
			void focusDialog();
		}}
	>
		<Trash2 size={18} aria-hidden="true" />
		<span class="compare-clear-label">{copy.clear}</span>
	</Action>
{/snippet}

{#snippet comparisonTools()}
	<div class="compare-tools">
		<Action
			variant="secondary"
			aria-label={selected.length < 4 ? copy.add : dialogCopy.edit}
			title={selected.length < 4 ? copy.add : dialogCopy.edit}
			onclick={() => {
				pickerOpen = true;
				void focusDialog();
			}}
		>
			<Plus size={18} aria-hidden="true" /><span class="compare-add-label"
				>{selected.length < 4 ? copy.add : dialogCopy.edit}</span
			>
		</Action>
		<div class="compare-header-clear">{@render clearComparison()}</div>
	</div>
{/snippet}

<Modal
	bind:open
	title={copy.title}
	description={choosing ? dialogCopy.chooseDescription : dialogCopy.description}
	wide
	class={[
		'compare-dialog',
		!choosing && 'compare-dialog--results',
		!choosing && selected.length === 4 && 'compare-dialog--four'
	]
		.filter(Boolean)
		.join(' ')}
	bodyTone="muted"
	onOpenAutoFocus={startComparison}
	{onCloseAutoFocus}
>
	{#snippet headerActions()}
		{#if !loading && !failed && !choosing}
			<div class="compare-desktop-tools">{@render comparisonTools()}</div>
		{/if}
	{/snippet}
	{#snippet headerContent()}
		{#if !loading && !failed && !choosing}
			<div class="compare-mobile-tools">{@render comparisonTools()}</div>
		{/if}
	{/snippet}
	<div class="compare-workspace" bind:this={workspace} aria-busy={loading}>
		{#if loading}
			<p class="compare-message" role="status">{dialogCopy.loading}</p>
		{:else if failed}
			<div class="compare-message">
				<p role="alert">{dialogCopy.failed}</p>
				<Action onclick={onretry}>{dialogCopy.retry}</Action>
			</div>
		{:else if choosing}
			<ComparePicker {cards} {selected} {locale} ontoggle={toggle} onremove={remove} />
		{:else}
			<div class="compare-table-panel">
				<div class="compare-table-content">
					<CompareTable
						{selected}
						{locale}
						{differencesOnly}
						presentation="dialog"
						onremove={remove}
					/>
					<div class="compare-table-options">
						<label class="compare-differences">
							<span>{dialogCopy.differences}</span>
							<input type="checkbox" bind:checked={differencesOnly} />
						</label>
					</div>
				</div>
			</div>
		{/if}
	</div>
	{#snippet footer()}
		{#if choosing && !loading && !failed}
			<div class="compare-footer compare-footer--picker">
				<div class="compare-selection-count" role="status">
					<span>{dialogCopy.selected.replace('{count}', String(selected.length))}</span>
					{#if selected.length < 2}<small>{dialogCopy.chooseMore}</small>{/if}
				</div>
				<Action
					disabled={selected.length < 2}
					onclick={() => {
						pickerOpen = false;
						void focusDialog();
					}}
				>
					{dialogCopy.compare.replace('{count}', String(selected.length))}
				</Action>
			</div>
		{:else}
			<div class="compare-footer">
				{#if !loading && !failed && selected.length >= 2}
					{#if linkStatus === 'failed'}
						<Action href={pageHref} data-compare-page variant="quiet">{dialogCopy.page}</Action>
					{:else}
						<Action variant="quiet" onclick={() => void copyLink()}>
							{#if linkStatus === 'copied'}<Check size={18} aria-hidden="true" />{:else}<Copy
									size={18}
									aria-hidden="true"
								/>{/if}
							{linkStatus === 'copied' ? dialogCopy.copied : dialogCopy.copyLink}
						</Action>
					{/if}
				{:else}<span></span>{/if}
				<Action onclick={() => (open = false)}>{dialogCopy.close}</Action>
			</div>
			<p class="sr-only" role="status">
				{linkStatus === 'copied'
					? dialogCopy.copied
					: linkStatus === 'failed'
						? dialogCopy.copyFailed
						: ''}
			</p>
		{/if}
	{/snippet}
</Modal>

<style>
	:global(.site-dialog.compare-dialog) {
		width: min(1000px, calc(100vw - 48px));
		height: min(780px, calc(100dvh - 48px));
		max-height: none;
	}
	:global(.compare-dialog.site-dialog--muted .site-dialog__body) {
		display: flex;
		flex: 1;
		min-height: 0;
		overflow: hidden;
		padding: 0;
	}
	.compare-workspace {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
		min-height: 0;
	}
	.compare-tools {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		gap: var(--bc-space-2);
		padding: var(--bc-space-3) var(--bc-space-4);
		background: var(--bc-white);
	}
	.compare-desktop-tools {
		display: none;
	}
	.compare-tools :global(.site-action) {
		--action-height: var(--bc-control-height-chip);
		--action-text: var(--bc-text-control);
	}
	.compare-header-clear {
		margin-left: auto;
	}
	.compare-tools :global(.compare-clear) {
		width: var(--bc-control-height-chip);
		padding: 0;
	}
	.compare-clear-label {
		display: none;
	}
	.compare-differences {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-2);
		min-height: var(--bc-control-height-chip);
		font-size: var(--bc-text-control);
		line-height: var(--bc-leading-control);
		cursor: pointer;
	}
	.compare-differences input {
		appearance: none;
		width: 38px;
		height: 24px;
		flex-shrink: 0;
		margin: 0;
		padding: 3px;
		border: 0;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-border-strong);
		cursor: pointer;
	}
	.compare-differences input::after {
		display: block;
		width: 18px;
		height: 18px;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-white);
		box-shadow: 0 1px 2px color-mix(in srgb, var(--bc-ink) 14%, transparent);
		content: '';
		transition: transform 160ms ease;
	}
	.compare-differences input:checked {
		background: var(--bc-ink);
	}
	.compare-differences input:checked::after {
		transform: translateX(14px);
	}
	@media (prefers-reduced-motion: reduce) {
		.compare-differences input::after {
			transition: none;
		}
	}
	.compare-table-panel {
		display: flex;
		flex: 1;
		min-height: 0;
		min-width: 0;
		padding: var(--bc-space-4);
		background: var(--bc-white);
	}
	.compare-table-content {
		--bc-border: color-mix(in srgb, var(--bc-ink) 8%, var(--bc-white));
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
		min-height: 0;
		overflow: hidden;
		background: var(--bc-white);
	}
	.compare-table-content :global(.compare-scroll--dialog) {
		border: 0;
		border-radius: 0;
	}
	.compare-table-options {
		flex-shrink: 0;
		padding: var(--bc-space-2) 0 0;
	}
	.compare-message {
		margin: 0;
		padding: var(--bc-space-6);
	}
	.compare-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--bc-space-3);
	}
	.compare-selection-count {
		display: grid;
		gap: var(--bc-space-1);
		font-size: var(--bc-text-control);
	}
	.compare-selection-count small {
		color: var(--bc-muted);
		font-size: var(--bc-text-meta);
	}
	@media (min-width: 768px) {
		:global(.site-dialog.compare-dialog--results) {
			height: min(880px, calc(100dvh - 48px));
		}
		:global(.compare-dialog.site-dialog--muted .site-dialog__header) {
			padding-block: var(--bc-space-4);
		}
		:global(.compare-dialog .site-dialog__title) {
			font-size: var(--bc-text-h4);
		}
		.compare-desktop-tools {
			display: flex;
		}
		.compare-mobile-tools {
			display: none;
		}
		.compare-tools {
			padding: 0;
			background: transparent;
		}
		.compare-tools :global(.site-action) {
			width: auto;
			padding-inline: var(--bc-space-3);
			white-space: nowrap;
		}
		.compare-clear-label,
		.compare-add-label {
			display: inline;
		}
		.compare-table-panel {
			padding: var(--bc-space-4) var(--bc-space-6);
		}
	}
	@media (min-width: 768px) and (max-width: 900px) {
		.compare-clear-label {
			display: none;
		}
		.compare-tools :global(.compare-clear) {
			width: 44px;
			padding: 0;
		}
	}
	@media (min-width: 768px) and (max-height: 640px) {
		.compare-table-panel {
			padding-block: var(--bc-space-3);
		}
	}
	@media (max-width: 767.98px) {
		:global(.site-dialog.compare-dialog) {
			inset: 0;
			transform: none;
			width: 100%;
			height: 100dvh;
			border-radius: 0;
		}
		:global(.compare-dialog.site-dialog--muted .site-dialog__header) {
			padding: var(--bc-space-4);
			gap: var(--bc-space-2);
		}
		:global(.compare-dialog.site-dialog--muted .site-dialog__footer) {
			padding: var(--bc-space-3) var(--bc-space-4)
				max(var(--bc-space-3), env(safe-area-inset-bottom));
		}
		.compare-differences {
			min-height: var(--bc-control-height-chip);
		}
		.compare-footer--picker {
			gap: var(--bc-space-2);
		}
	}
</style>
