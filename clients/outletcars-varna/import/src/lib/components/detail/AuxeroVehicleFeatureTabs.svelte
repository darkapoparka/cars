<script lang="ts">
	import { tick } from 'svelte';
	import type { AuxeroVehicleDetailFeatureTab } from '$lib/auxero/detail';

	let {
		description,
		descriptionLabel,
		tabs
	}: {
		description: string;
		descriptionLabel: string;
		tabs: AuxeroVehicleDetailFeatureTab[];
	} = $props();

	type DetailTabPanel = {
		description?: string;
		items?: string[];
		label: string;
	};

	let selectedTabLabel = $state<string>();
	let tablistEl = $state<HTMLUListElement>();

	const tabPanels: DetailTabPanel[] = $derived([{ description, label: descriptionLabel }, ...tabs]);
	const activeTabIndex = $derived.by(() => {
		const index = tabPanels.findIndex(
			(tab) => tab.label === (selectedTabLabel ?? descriptionLabel)
		);
		return index >= 0 ? index : 0;
	});
	const tabId = (index: number) => `daynight-pdp-feature-tab-${index}`;
	const panelId = (index: number) => `daynight-pdp-feature-panel-${index}`;

	// WAI-ARIA tabs pattern: roving focus + automatic activation via arrow/Home/End keys.
	const focusTab = async (index: number) => {
		selectedTabLabel = tabPanels[index].label;
		await tick();
		tablistEl?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[index]?.focus();
	};

	const handleTablistKeydown = (event: KeyboardEvent) => {
		const last = tabPanels.length - 1;
		let next: number;

		if (event.key === 'ArrowRight') next = activeTabIndex >= last ? 0 : activeTabIndex + 1;
		else if (event.key === 'ArrowLeft') next = activeTabIndex <= 0 ? last : activeTabIndex - 1;
		else if (event.key === 'Home') next = 0;
		else if (event.key === 'End') next = last;
		else return;

		event.preventDefault();
		focusTab(next);
	};
</script>

<div class="flat-tabs mb-40">
	<div class="mb-16 overflow-x-auto">
		<ul
			class="menu-tab menu-tab-style4"
			aria-label="Vehicle detail sections"
			role="tablist"
			bind:this={tablistEl}
			onkeydown={handleTablistKeydown}
		>
			{#each tabPanels as tab, index (tab.label)}
				<li class={[activeTabIndex === index && 'active']} role="presentation">
					<button
						aria-controls={panelId(index)}
						aria-selected={activeTabIndex === index}
						class="daynight-pdp-feature-tab"
						id={tabId(index)}
						onclick={() => {
							selectedTabLabel = tab.label;
						}}
						role="tab"
						tabindex={activeTabIndex === index ? 0 : -1}
						type="button"
					>
						<span class="text-secondary font-weight-600">{tab.label}</span>
					</button>
				</li>
			{/each}
		</ul>
	</div>
	<div class="content-tab">
		{#each tabPanels as tab, index (tab.label)}
			<div
				aria-labelledby={tabId(index)}
				class={['content-inner', activeTabIndex === index && 'active']}
				id={panelId(index)}
				role="tabpanel"
			>
				{#if tab.description}
					<p class="text-secondary daynight-pdp-tab-description">{tab.description}</p>
				{:else if tab.items}
					<ul class="xl-grid-cols-2 md-grid-cols-1 grid grid-cols-3 gap-8 gap-x-30">
						{#each tab.items as feature (`${tab.label}-${feature}`)}
							<li class="flex items-center gap-8">
								<img src="/assets/icons/check.svg" alt="check" />
								{feature}
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.daynight-pdp-feature-tab {
		all: unset;
		box-sizing: border-box;
		cursor: pointer;
		display: block;
		width: 100%;
	}

	.daynight-pdp-feature-tab:focus-visible {
		border-radius: 6px;
		outline: 2px solid var(--bc-focus);
		outline-offset: 3px;
	}
</style>
