<script lang="ts">
	import { resolve } from '$app/paths';
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

	function handlePillClick(event: MouseEvent, shortcut: (typeof inventoryShortcuts)[number]) {
		event.preventDefault();
		filters.openField = '';
		if (shortcut.clearsAll) {
			filters.clearAll();
		} else if (shortcut.field && shortcut.value) {
			filters.toggleShortcut(shortcut.field, shortcut.value);
		}
		filters.syncUrl();
	}
</script>

{#snippet pillIcon()}
	<svg
		aria-hidden="true"
		width="42"
		height="20"
		viewBox="0 0 76 36"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M13 23H8.5C6.6 23 5 21.4 5 19.5V17.6C5 15.9 6.2 14.4 7.9 14.1L17.7 12.3L24.2 6.7C25.5 5.6 27.1 5 28.8 5H45.5C47.7 5 49.8 6 51.1 7.8L55.3 13.4L66.3 15.8C69 16.4 71 18.8 71 21.6V23H64"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path d="M25 23H52" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
		<path
			d="M22.5 28.5C25.5376 28.5 28 26.0376 28 23C28 19.9624 25.5376 17.5 22.5 17.5C19.4624 17.5 17 19.9624 17 23C17 26.0376 19.4624 28.5 22.5 28.5Z"
			stroke="currentColor"
			stroke-width="2"
		/>
		<path
			d="M58.5 28.5C61.5376 28.5 64 26.0376 64 23C64 19.9624 61.5376 17.5 58.5 17.5C55.4624 17.5 53 19.9624 53 23C53 26.0376 55.4624 28.5 58.5 28.5Z"
			stroke="currentColor"
			stroke-width="2"
		/>
		<path d="M25 13H48" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
	</svg>
{/snippet}

<div class="daynight-inventory-type-pills" data-daynight-shortcut-pills aria-label="Бърз избор">
	{#each inventoryShortcuts as pill (pill.label)}
		{@const active = pillActive(pill)}
		<a
			class={[
				'daynight-inventory-type-pill desktop-discovery-chip',
				active && 'is-active',
				active && 'is-selected'
			]}
			href={pillHref(pill)}
			data-daynight-shortcut-clear={pill.clearsAll ? 'true' : undefined}
			data-daynight-shortcut-field={pill.field}
			data-daynight-shortcut-value={pill.value}
			aria-current={active ? 'true' : 'false'}
			aria-label={pill.clearsAll ? 'Покажи всички автомобили' : `Избери ${pill.label}`}
			title={pill.clearsAll ? 'Покажи всички автомобили' : `Избери ${pill.label}`}
			onclick={(event) => handlePillClick(event, pill)}
		>
			{@render pillIcon()}
			<span>{pill.label}</span>
		</a>
	{/each}
</div>

<style>
	:global(.inventory-template-shell .daynight-inventory-type-pill) {
		position: relative;
	}

	:global(
		.inventory-template-shell .daynight-inventory-quick-form .daynight-inventory-type-pill.is-active
	) {
		background: #8b6811;
		border-color: #8b6811;
		color: #fff;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-quick-form
			.daynight-inventory-type-pill.is-active:hover
	) {
		background: #8a0000;
		border-color: #8a0000;
		color: #fff;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-quick-form
			.daynight-inventory-type-pill.is-selected
	) {
		background: #8b6811;
		border-color: #8b6811;
		color: #fff;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-quick-form
			.daynight-inventory-type-pill.is-selected:hover
	) {
		background: #8a0000;
		border-color: #8a0000;
		color: #fff;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-type-pill.is-selected:not([data-daynight-shortcut-clear='true'])::after
	) {
		align-items: center;
		border: 1px solid rgba(255, 255, 255, 0.78);
		border-radius: 999px;
		content: 'x';
		display: inline-flex;
		flex: 0 0 auto;
		font-size: 12px;
		font-weight: 700;
		height: 18px;
		justify-content: center;
		line-height: 1;
		margin-left: 1px;
		text-transform: uppercase;
		width: 18px;
	}

	:global(.inventory-template-shell .daynight-inventory-type-pill:focus-visible) {
		box-shadow: none;
		outline: 2px solid #8b6811;
		outline-offset: 2px;
	}
</style>
