<script lang="ts">
	import { PanelLeft } from '@lucide/svelte';

	let {
		activeIndex = 3,
		layoutMode = 'grid',
		onGridChange,
		onSidebarChange
	}: {
		activeIndex?: number;
		layoutMode?: 'grid' | 'sidebar';
		onGridChange?: (index: number) => void;
		onSidebarChange?: () => void;
	} = $props();

	const toggles = [
		{ index: 0, label: 'Two columns', width: 14, circles: [3, 11] },
		{ index: 1, label: 'Three columns', width: 22, circles: [3, 11, 19] },
		{ index: 2, label: 'Four columns', width: 30, circles: [3, 11, 19, 27] },
		{ index: 3, label: 'Five columns', width: 38, circles: [3, 11, 19, 27, 35] }
	];

	// The sidebar layout caps the grid at 4 columns, so the 5-column toggle is hidden there.
	const visibleToggles = $derived(
		layoutMode === 'sidebar' ? toggles.filter((toggle) => toggle.index < 3) : toggles
	);
</script>

<div class="listing-tabs menu-tab flex items-center justify-center gap-12 py-12">
	{#each visibleToggles as toggle (toggle.index)}
		{@const isActive = toggle.index === activeIndex}
		<button
			class="item-menu{isActive ? ' active' : ''}"
			type="button"
			data-daynight-grid-toggle={toggle.index}
			aria-label={toggle.label}
			aria-pressed={isActive ? 'true' : 'false'}
			title={toggle.label}
			onclick={() => onGridChange?.(toggle.index)}
		>
			<svg
				aria-hidden="true"
				focusable="false"
				width={toggle.width}
				height="20"
				viewBox={`0 0 ${toggle.width} 20`}
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				{#each toggle.circles as cx (`top-${cx}`)}
					<circle {cx} cy="6" r="2.5" fill={isActive ? 'white' : 'none'} stroke="#9FA1A4" />
				{/each}
				{#each toggle.circles as cx (`bottom-${cx}`)}
					<circle {cx} cy="14" r="2.5" fill={isActive ? 'white' : 'none'} stroke="#9FA1A4" />
				{/each}
			</svg>
		</button>
	{/each}
	<button
		class="item-menu item-menu--toggle item-menu--sidebar{layoutMode === 'sidebar'
			? ' active'
			: ''}"
		type="button"
		data-daynight-layout-toggle="sidebar"
		aria-label="Filters in left column"
		aria-pressed={layoutMode === 'sidebar' ? 'true' : 'false'}
		title={layoutMode === 'sidebar' ? 'Hide left column' : 'Filters in left column'}
		onclick={() => onSidebarChange?.()}
	>
		<PanelLeft aria-hidden="true" size={18} strokeWidth={2.2} />
	</button>
</div>

<style>
	.item-menu {
		align-items: center;
		appearance: none;
		border: 0;
		cursor: pointer;
		display: inline-flex;
		font: inherit;
		justify-content: center;
		padding: 0;
	}

	.item-menu:not(.active) {
		background: transparent;
	}

	.item-menu--toggle {
		width: 36px;
	}

	.item-menu--sidebar {
		margin-left: 7px;
		position: relative;
	}

	.item-menu--sidebar::before {
		background: #d8dee8;
		content: '';
		height: 22px;
		left: -8px;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 1px;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-listings-shell
			.listing-tabs
			.item-menu.item-menu--toggle
	) {
		color: #667085;
		min-width: 36px;
		padding: 0;
		width: 36px;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-listings-shell
			.listing-tabs
			.item-menu.item-menu--toggle.active
	) {
		color: #fff;
	}

	:global(
		.inventory-template-shell
			.daynight-inventory-listings-shell
			.listing-tabs
			.item-menu.item-menu--toggle
			svg
	) {
		flex: 0 0 auto;
	}

	/* Template CSS forces svg stroke/fill to #1c1c1c, which makes the icon
	   invisible on the dark active chip — repaint it white when selected. */
	:global(
		.inventory-template-shell
			.daynight-inventory-listings-shell
			.listing-tabs
			.item-menu.item-menu--toggle.active
			svg
	),
	:global(
		.inventory-template-shell
			.daynight-inventory-listings-shell
			.listing-tabs
			.item-menu.item-menu--toggle.active
			svg
			path
	),
	:global(
		.inventory-template-shell
			.daynight-inventory-listings-shell
			.listing-tabs
			.item-menu.item-menu--toggle.active
			svg
			rect
	) {
		color: #fff !important;
		fill: none !important;
		stroke: #fff !important;
	}
</style>
