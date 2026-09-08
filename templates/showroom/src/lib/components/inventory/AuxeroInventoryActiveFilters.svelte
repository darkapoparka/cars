<script lang="ts">
	import type { AuxeroInventoryDesktopData } from '$lib/auxero/inventory-desktop';
	import { RotateCcw, X } from '@lucide/svelte';

	let {
		activeFilters,
		modifierClass = ''
	}: {
		activeFilters: NonNullable<AuxeroInventoryDesktopData['activeFilters']>;
		modifierClass?: string;
	} = $props();

	const className = $derived(
		['eliqauto-inventory-active-filters', modifierClass].filter(Boolean).join(' ')
	);
	const linkHref = (href: string) => ({ href });
</script>

<div class={className} aria-label="Active inventory filters">
	<p class="eliqauto-inventory-active-filters__summary" role="status">{activeFilters.summary}</p>
	<div class="eliqauto-inventory-active-filters__chips">
		{#each activeFilters.chips as chip (chip.label)}
			<a
				class="eliqauto-active-filter"
				{...linkHref(chip.href)}
				aria-label={`Remove ${chip.label} filter`}
				data-sveltekit-noscroll
			>
				<span>{chip.label}</span>
				<X size={16} strokeWidth={2} aria-hidden="true" />
			</a>
		{/each}
		<a
			class="eliqauto-active-filter eliqauto-active-filter--clear"
			{...linkHref(activeFilters.clearHref)}
			data-sveltekit-noscroll
		>
			<RotateCcw size={16} strokeWidth={2} aria-hidden="true" />
			<span>{activeFilters.clearLabel}</span>
		</a>
	</div>
</div>

<style>
	:global(body.eliqauto-inventory-template) .eliqauto-inventory-active-filters--results {
		margin: 0 0 16px;
	}

	.eliqauto-inventory-active-filters__summary {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.eliqauto-inventory-active-filters__chips {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
	}

	:global(body.eliqauto-inventory-template) .eliqauto-active-filter {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 44px;
		max-width: 100%;
		gap: 8px;
		padding: 8px 12px;
		border: 1px solid #d4d4d8;
		border-radius: 999px;
		background: #ffffff;
		color: var(--bc-ink);
		font-size: 14px;
		font-weight: 500;
		line-height: 20px;
		text-decoration: none;
		transition:
			background-color 140ms ease,
			border-color 140ms ease;
	}

	.eliqauto-active-filter span {
		font: inherit;
		color: inherit;
		overflow-wrap: anywhere;
	}

	:global(body.eliqauto-inventory-template) .eliqauto-active-filter--clear {
		border-color: transparent;
		border-radius: 8px;
		background: transparent;
		color: var(--bc-ink);
	}

	:global(body.eliqauto-inventory-template) .eliqauto-active-filter:hover {
		border-color: var(--bc-accent);
		background: #fff5f5;
		color: var(--bc-ink);
	}

	:global(body.eliqauto-inventory-template) .eliqauto-active-filter--clear:hover {
		border-color: #d4d4d8;
		background: #e9e9ec;
	}

	.eliqauto-active-filter:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
	}

	:global(body.eliqauto-inventory-template) .eliqauto-active-filter :global(svg) {
		flex: 0 0 auto;
		color: currentColor;
	}
</style>
