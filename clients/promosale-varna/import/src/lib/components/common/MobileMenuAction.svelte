<script lang="ts">
	import type { Component } from 'svelte';

	let {
		href,
		label,
		icon: Icon,
		variant = 'row',
		active = false,
		onclick
	}: {
		href: string;
		label: string;
		icon: Component<{ size?: number; strokeWidth?: number }>;
		variant?: 'row' | 'primary' | 'secondary';
		active?: boolean;
		onclick?: (event: MouseEvent) => void;
	} = $props();
</script>

<a
	class={`bc-mobile-menu-action bc-mobile-menu-action--${variant}`}
	class:active
	{href}
	aria-current={active ? 'page' : undefined}
	{onclick}
>
	<span class="bc-mobile-menu-action__icon" aria-hidden="true">
		<Icon size={19} strokeWidth={2} />
	</span>
	<span class="bc-mobile-menu-action__label">{label}</span>
</a>

<style>
	.bc-mobile-menu-action {
		display: flex;
		min-width: 0;
		min-height: var(--bc-mobile-menu-row-height);
		align-items: center;
		gap: var(--bc-space-3);
		border: 1px solid transparent;
		border-radius: var(--bc-radius-control);
		background: var(--bc-white);
		color: var(--bc-ink);
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-control);
		line-height: var(--bc-leading-control);
		padding: 0 var(--bc-space-3);
		text-decoration: none !important;
		transition:
			background-color var(--bc-motion-hover),
			border-color var(--bc-motion-hover),
			color var(--bc-motion-hover);
	}

	.bc-mobile-menu-action__icon {
		display: grid;
		width: var(--bc-mobile-menu-icon-size);
		height: var(--bc-mobile-menu-icon-size);
		flex: 0 0 var(--bc-mobile-menu-icon-size);
		place-items: center;
		color: currentColor;
	}

	.bc-mobile-menu-action__icon :global(svg),
	.bc-mobile-menu-action__icon :global(svg *) {
		color: currentColor;
		stroke: currentColor;
	}

	.bc-mobile-menu-action__label {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.bc-mobile-menu-action.active {
		background: var(--bc-surface-hover);
		color: var(--bc-accent);
	}

	.bc-mobile-menu-action--primary,
	.bc-mobile-menu-action--secondary {
		justify-content: center;
		gap: var(--bc-space-2);
		font-weight: var(--bc-weight-action);
	}

	.bc-mobile-menu-action--primary {
		border-color: var(--bc-accent);
		background: var(--bc-accent);
		color: var(--bc-accent-contrast);
	}

	.bc-mobile-menu-action--secondary {
		border-color: var(--bc-border);
		background: var(--bc-white);
	}

	.bc-mobile-menu-action:focus-visible {
		background: var(--bc-surface-hover);
		color: var(--bc-ink);
	}

	.bc-mobile-menu-action--primary:focus-visible {
		border-color: var(--bc-accent-hover);
		background: var(--bc-accent-hover);
		color: var(--bc-white);
	}

	@media (hover: hover) and (pointer: fine) {
		.bc-mobile-menu-action:hover {
			background: var(--bc-surface-hover);
			color: var(--bc-ink);
		}

		.bc-mobile-menu-action--primary:hover {
			border-color: var(--bc-accent-hover);
			background: var(--bc-accent-hover);
			color: var(--bc-white);
		}
	}
</style>
