<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { resolve } from '$app/paths';
	import { tick } from 'svelte';
	import {
		getDesktopInventoryContext,
		inventoryShortcuts
	} from './desktop-inventory-context.svelte';

	const filters = getDesktopInventoryContext();

	function pillHref(shortcut: (typeof inventoryShortcuts)[number]) {
		if (shortcut.clearsAll || !shortcut.field || !shortcut.value) {
			return resolve('/inventory');
		}
		const query = new URLSearchParams({ [shortcut.field]: shortcut.value }).toString();
		return resolve(`/inventory?${query}` as '/inventory');
	}

	function pillActive(shortcut: (typeof inventoryShortcuts)[number]) {
		return shortcut.clearsAll
			? !filters.hasActiveFilters
			: filters.isShortcutActive(shortcut.field, shortcut.value ?? '');
	}

	async function handlePillClick(event: MouseEvent, shortcut: (typeof inventoryShortcuts)[number]) {
		const anchor = event.currentTarget as HTMLAnchorElement;
		const retainFocus = event.detail === 0 || document.activeElement === anchor;
		event.preventDefault();
		filters.openField = '';
		if (shortcut.clearsAll) {
			filters.clearAll();
		} else if (shortcut.field && shortcut.value) {
			filters.toggleShortcut(shortcut.field, shortcut.value);
		}
		filters.syncUrl();
		// Restore keyboard focus after reactive changes and the browser's layout update.
		await tick();
		if (retainFocus) {
			requestAnimationFrame(() => {
				if (anchor.isConnected) anchor.focus({ preventScroll: true });
			});
		}
	}
</script>

<div
	class="daynight-inventory-type-pills"
	data-daynight-shortcut-pills
	aria-label={i18n.t('copy.0ff4d985dee2')}
>
	<div class="daynight-inventory-type-pills__group">
		{#each inventoryShortcuts as pill (pill.label)}
			{@const active = pillActive(pill)}
			<a
				class={[
					'daynight-inventory-type-pill desktop-discovery-chip',
					active && 'is-active',
					active && 'is-selected'
				]}
				href={i18n.href(pillHref(pill))}
				data-daynight-shortcut-clear={pill.clearsAll ? 'true' : undefined}
				data-daynight-shortcut-field={pill.field}
				data-daynight-shortcut-value={pill.value}
				aria-current={active ? 'true' : 'false'}
				aria-label={pill.clearsAll
					? i18n.t('copy.507ff40ff784')
					: i18n.t('pattern.8b15a08c1b53', { v0: i18n.spec(pill.label) })}
				title={pill.clearsAll
					? i18n.t('copy.507ff40ff784')
					: i18n.t('pattern.8b15a08c1b53', { v0: i18n.spec(pill.label) })}
				onclick={(event) => handlePillClick(event, pill)}
			>
				<span>{i18n.spec(pill.label)}</span>
			</a>
		{/each}
	</div>
</div>

<style>
	.daynight-inventory-type-pills__group {
		display: grid;
		grid-template-columns: repeat(5, max-content);
		gap: 8px;
	}
	.daynight-inventory-type-pill.is-selected:not([data-daynight-shortcut-clear='true'])::after {
		content: '×';
		display: grid;
		place-items: center;
		flex: 0 0 18px;
		width: 18px;
		height: 18px;
		border: 1px solid currentColor;
		border-radius: 50%;
		font: inherit;
		line-height: 1;
	}
</style>
