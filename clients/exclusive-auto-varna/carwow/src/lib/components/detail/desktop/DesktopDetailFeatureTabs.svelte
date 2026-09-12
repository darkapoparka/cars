<script lang="ts">
	import type { DayNightVehicle } from '$lib/data/daynight-vehicles';
	import type { DetailFeatureTab } from '$lib/types/template-page';

	let { vehicle, tabs }: { vehicle: DayNightVehicle; tabs: DetailFeatureTab[] } = $props();

	const DESCRIPTION_TAB_ID = '__description__';

	// Описание leads as the default tab, followed by the feature groups.
	const navTabs = $derived([
		{ id: DESCRIPTION_TAB_ID, label: 'Описание' },
		...tabs.map((tab) => ({ id: tab.id, label: tab.label }))
	]);

	let selectedTabId = $state<string>(DESCRIPTION_TAB_ID);
	const activeTabId = $derived(
		navTabs.some((tab) => tab.id === selectedTabId) ? selectedTabId : DESCRIPTION_TAB_ID
	);

	function selectTab(id: string) {
		selectedTabId = id;
	}
</script>

<div class="flat-tabs pdp-info-tabs mb-40">
	<div class="mb-24 overflow-x-auto">
		<ul class="menu-tab menu-tab-style4">
			{#each navTabs as tab (tab.id)}
				<li class={{ active: tab.id === activeTabId }}>
					<button
						type="button"
						class="pdp-feature-tab-button"
						aria-pressed={tab.id === activeTabId}
						onclick={() => selectTab(tab.id)}
					>
						<span>{tab.label}</span>
					</button>
				</li>
			{/each}
		</ul>
	</div>

	<div class="content-tab">
		<div class={['content-inner', activeTabId === DESCRIPTION_TAB_ID && 'active']}>
			<p class="text-secondary pdp-info-tabs__description">{vehicle.description}</p>
		</div>
		{#each tabs as tab (tab.id)}
			<div class={['content-inner', tab.id === activeTabId && 'active']}>
				<ul class="xl-grid-cols-2 md-grid-cols-1 grid grid-cols-3 gap-8 gap-x-30">
					{#each tab.features as feature (feature.id)}
						<li class="flex items-center gap-8">
							<img
								src="/assets/icons/check.svg"
								alt=""
								aria-hidden="true"
								decoding="async"
								loading="lazy"
							/>
							{feature.label}
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</div>

<style>
	.pdp-feature-tab-button {
		all: unset;
		cursor: pointer;
		display: inline;
	}

	/* Bigger, clearer PDP info tabs (Описание + feature groups). */
	.pdp-info-tabs :global(.menu-tab-style4 li) {
		padding-bottom: 14px;
	}

	.pdp-info-tabs :global(.menu-tab-style4 li:not(:last-child)) {
		margin-right: 32px;
	}

	.pdp-info-tabs :global(.menu-tab-style4 li span) {
		font-size: 18px;
		line-height: 1.4;
		font-weight: 600;
		color: #4b4b4b;
		transition: color 0.2s ease;
	}

	.pdp-info-tabs :global(.menu-tab-style4 li:hover span) {
		color: #1c1c1c;
	}

	.pdp-info-tabs :global(.menu-tab-style4 li.active span) {
		color: #1c1c1c;
	}

	/* Thicker, more visible active underline. */
	.pdp-info-tabs :global(.menu-tab-style4 li::before) {
		height: 3px;
		bottom: -2px;
	}

	.pdp-info-tabs__description {
		margin: 0;
	}
</style>
