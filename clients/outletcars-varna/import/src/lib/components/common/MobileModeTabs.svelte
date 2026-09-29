<script lang="ts">
	import type { Component } from 'svelte';
	type MobileModeOption = {
		icon?: Component<{ size?: number; strokeWidth?: number }>;
		label: string;
		panelId?: string;
		value: string;
	};

	let {
		value = $bindable(),
		options,
		label,
		idPrefix = 'mobile-mode',
		surface = 'dark',
		appearance = 'underline',
		onchange
	}: {
		value: string;
		options: readonly MobileModeOption[];
		label: string;
		idPrefix?: string;
		surface?: 'dark' | 'light';
		appearance?: 'underline' | 'attached';
		onchange?: (value: string) => void;
	} = $props();

	const activate = (nextValue: string) => {
		value = nextValue;
		onchange?.(nextValue);
	};

	const focusTab = (index: number) => {
		document.getElementById(`${idPrefix}-${options[index]?.value}`)?.focus({ preventScroll: true });
	};

	const handleKeydown = (event: KeyboardEvent, index: number) => {
		if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
		event.preventDefault();

		const nextIndex =
			event.key === 'Home'
				? 0
				: event.key === 'End'
					? options.length - 1
					: event.key === 'ArrowLeft'
						? (index - 1 + options.length) % options.length
						: (index + 1) % options.length;
		const next = options[nextIndex];
		if (!next) return;
		activate(next.value);
		queueMicrotask(() => focusTab(nextIndex));
	};
</script>

<div
	class="mobile-mode-tabs"
	class:mobile-mode-tabs--light={surface === 'light'}
	class:mobile-mode-tabs--attached={appearance === 'attached'}
	style:--mobile-mode-count={options.length}
	role="tablist"
	aria-label={label}
>
	{#each options as option, index (option.value)}
		<button
			type="button"
			id={`${idPrefix}-${option.value}`}
			data-mode={option.value}
			role="tab"
			class:active={value === option.value}
			aria-selected={value === option.value}
			aria-controls={option.panelId}
			tabindex={value === option.value ? 0 : -1}
			onclick={() => activate(option.value)}
			onkeydown={(event) => handleKeydown(event, index)}
		>
			{#if option.icon}{@const Icon = option.icon}<span class="mode-tab-icon" aria-hidden="true"
					><Icon size={19} strokeWidth={1.75} /></span
				>{/if}
			{option.label}
		</button>
	{/each}
</div>

<style>
	.mobile-mode-tabs {
		display: grid;
		grid-template-columns: repeat(var(--mobile-mode-count, 2), minmax(0, 1fr));
		gap: 0;
		border-bottom: 1px solid rgb(255 255 255 / 0.2);
	}

	.mobile-mode-tabs button {
		position: relative;
		display: flex;
		height: var(--bc-control-height-standard);
		min-height: var(--bc-control-height-standard);
		align-items: flex-end;
		justify-content: center;
		border: 0;
		background: transparent;
		color: rgb(255 255 255 / 0.72);
		font-family: var(--bc-font-body);
		font-size: var(--bc-text-mode-tab);
		font-weight: var(--bc-weight-control);
		line-height: 24px;
		cursor: pointer;
		padding: 0 4px 6px;
		text-align: center;
		user-select: none;
	}

	.mobile-mode-tabs button.active {
		color: var(--bc-white);
		font-weight: var(--bc-weight-control);
	}

	.mobile-mode-tabs button.active::after {
		position: absolute;
		inset: auto 0 -1px;
		height: 2px;
		background: var(--bc-white);
		content: '';
	}

	.mobile-mode-tabs button:focus-visible {
		outline: 2px solid rgb(255 255 255 / 0.82);
		outline-offset: -3px;
	}

	@media (prefers-reduced-motion: reduce) {
		.mobile-mode-tabs button,
		.mobile-mode-tabs button::after {
			transition: none !important;
		}
	}

	.mobile-mode-tabs--light {
		border-color: var(--bc-border);
	}
	.mobile-mode-tabs--light button {
		color: var(--bc-muted);
		align-items: center;
		padding-block: var(--bc-space-2);
		font-size: var(--mode-tab-font-size, var(--bc-text-mode-tab));
	}
	.mobile-mode-tabs--light button.active {
		color: var(--bc-ink);
	}
	.mobile-mode-tabs--light button.active::after {
		background: var(--bc-accent);
	}
	.mobile-mode-tabs--light button:focus-visible {
		outline-color: var(--bc-focus);
	}

	.mode-tab-icon {
		display: inline-flex;
		flex: 0 0 auto;
	}
	.mobile-mode-tabs--attached {
		border: 1px solid var(--bc-dark-border);
		border-bottom: 0;
		border-radius: var(--bc-radius-panel) var(--bc-radius-panel) 0 0;
		background: var(--bc-dark-surface);
		padding: var(--bc-space-1) var(--bc-space-1) 0;
	}
	.mobile-mode-tabs--attached button {
		align-items: center;
		gap: var(--bc-space-2);
		min-height: var(--bc-control-height-primary);
		height: auto;
		padding: var(--bc-space-3) var(--bc-space-4);
		font-size: var(--mode-tab-font-size, var(--bc-text-h5));
		border-radius: var(--bc-radius-control) var(--bc-radius-control) 0 0;
		color: var(--bc-dark-muted);
	}
	.mobile-mode-tabs--attached button:hover {
		color: var(--bc-white);
		background: var(--bc-dark-hover);
	}
	.mobile-mode-tabs--attached button.active {
		color: var(--bc-ink);
		background: var(--bc-surface-raised);
	}
	.mobile-mode-tabs--attached button.active::after {
		display: none;
	}
	.mobile-mode-tabs--attached button:focus-visible {
		outline-offset: -4px !important;
	}
</style>
