<script lang="ts">
	import LayoutGrid from '@lucide/svelte/icons/layout-grid';
	import PanelLeft from '@lucide/svelte/icons/panel-left';
	import Settings2 from '@lucide/svelte/icons/settings-2';
	import X from '@lucide/svelte/icons/x';

	let {
		layoutMode,
		activeGridIndex,
		onLayoutChange,
		onGridChange
	}: {
		layoutMode: 'grid' | 'sidebar';
		activeGridIndex: number;
		onLayoutChange: (mode: 'grid' | 'sidebar') => void;
		onGridChange: (index: number) => void;
	} = $props();

	const densityOptions = [
		{ index: 0, label: '2 колони' },
		{ index: 1, label: '3 колони' },
		{ index: 2, label: '4 колони' },
		{ index: 3, label: '5 колони' }
	];

	let open = $state(false);

	function close() {
		open = false;
	}

	function handleDocumentKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') close();
	}
</script>

<svelte:document onkeydown={handleDocumentKeydown} />

<div class="inventory-preview-settings" data-daynight-preview-settings>
	{#if open}
		<section class="inventory-preview-settings__panel" aria-label="Настройки на изгледа">
			<header>
				<div>
					<span>Демо настройки</span>
					<strong>Преглед на инвентара</strong>
				</div>
				<button type="button" aria-label="Затвори настройките" onclick={close}>
					<X aria-hidden="true" size={18} strokeWidth={2.2} />
				</button>
			</header>

			<div class="inventory-preview-settings__group">
				<span>Подредба</span>
				<div class="inventory-preview-settings__segmented">
					<button
						class:active={layoutMode === 'grid'}
						type="button"
						aria-pressed={layoutMode === 'grid'}
						onclick={() => onLayoutChange('grid')}
					>
						<LayoutGrid aria-hidden="true" size={17} />
						Без колона
					</button>
					<button
						class:active={layoutMode === 'sidebar'}
						type="button"
						aria-pressed={layoutMode === 'sidebar'}
						onclick={() => onLayoutChange('sidebar')}
					>
						<PanelLeft aria-hidden="true" size={17} />
						С колона
					</button>
				</div>
			</div>

			<div class="inventory-preview-settings__group">
				<span>Карти на ред</span>
				<div class="inventory-preview-settings__density">
					{#each densityOptions as option (option.index)}
						<button
							class:active={activeGridIndex === option.index}
							type="button"
							aria-label={option.label}
							aria-pressed={activeGridIndex === option.index}
							onclick={() => onGridChange(option.index)}
						>
							{option.index + 2}
						</button>
					{/each}
				</div>
			</div>

			<p>Тези контроли са само за сравнение на демо вариантите.</p>
		</section>
	{/if}

	<button
		class="inventory-preview-settings__launcher"
		type="button"
		aria-label={open ? 'Затвори настройките на изгледа' : 'Настройки на изгледа'}
		aria-expanded={open}
		onclick={() => (open = !open)}
	>
		{#if open}
			<X aria-hidden="true" size={21} strokeWidth={2.3} />
		{:else}
			<Settings2 aria-hidden="true" size={21} strokeWidth={2.3} />
		{/if}
	</button>
</div>

<style>
	.inventory-preview-settings {
		bottom: 96px;
		position: fixed;
		right: 24px;
		z-index: 8990;
	}

	.inventory-preview-settings__launcher {
		align-items: center;
		background: #fff;
		border: 1px solid #d0d7e2;
		border-radius: 50%;
		box-shadow: 0 12px 30px rgba(16, 24, 40, 0.2);
		color: #101828;
		cursor: pointer;
		display: inline-flex;
		height: 48px;
		justify-content: center;
		padding: 0;
		width: 48px;
	}

	.inventory-preview-settings__launcher:hover,
	.inventory-preview-settings__launcher:focus-visible {
		border-color: #8b6811;
		color: #8b6811;
	}

	.inventory-preview-settings__launcher:focus-visible {
		outline: 2px solid #8b6811;
		outline-offset: 3px;
	}

	.inventory-preview-settings__panel {
		background: #fff;
		border: 1px solid #d8dee8;
		border-radius: 14px;
		bottom: 62px;
		box-shadow: 0 20px 56px rgba(16, 24, 40, 0.22);
		padding: 16px;
		position: absolute;
		right: 0;
		width: 292px;
	}

	.inventory-preview-settings__panel header {
		align-items: flex-start;
		display: flex;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	.inventory-preview-settings__panel header div {
		display: grid;
		gap: 3px;
	}

	.inventory-preview-settings__panel header span {
		color: #8b6811;
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.inventory-preview-settings__panel header strong {
		color: #101828;
		font-size: 16px;
		line-height: 1.3;
	}

	.inventory-preview-settings__panel header button {
		align-items: center;
		background: #f2f4f7;
		border: 0;
		border-radius: 7px;
		color: #344054;
		cursor: pointer;
		display: inline-flex;
		height: 30px;
		justify-content: center;
		padding: 0;
		width: 30px;
	}

	.inventory-preview-settings__group {
		display: grid;
		gap: 7px;
		margin-top: 13px;
	}

	.inventory-preview-settings__group > span {
		color: #667085;
		font-size: 12px;
		font-weight: 700;
	}

	.inventory-preview-settings__segmented {
		background: #f2f4f7;
		border-radius: 9px;
		display: grid;
		gap: 4px;
		grid-template-columns: 1fr 1fr;
		padding: 4px;
	}

	.inventory-preview-settings__segmented button,
	.inventory-preview-settings__density button {
		align-items: center;
		background: transparent;
		border: 0;
		border-radius: 7px;
		color: #475467;
		cursor: pointer;
		display: inline-flex;
		font: inherit;
		font-size: 12px;
		font-weight: 700;
		height: 36px;
		justify-content: center;
	}

	.inventory-preview-settings__segmented button {
		gap: 6px;
	}

	.inventory-preview-settings__segmented button.active,
	.inventory-preview-settings__density button.active {
		background: #101828;
		color: #fff;
	}

	.inventory-preview-settings__density {
		display: grid;
		gap: 6px;
		grid-template-columns: repeat(4, 1fr);
	}

	.inventory-preview-settings__density button {
		background: #f2f4f7;
		font-size: 14px;
	}

	.inventory-preview-settings__panel p {
		border-top: 1px solid #eaecf0;
		color: #667085;
		font-size: 11px;
		line-height: 1.45;
		margin: 15px 0 0;
		padding-top: 12px;
	}
</style>
