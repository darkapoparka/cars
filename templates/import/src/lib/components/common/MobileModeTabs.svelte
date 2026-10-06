<script lang="ts">
	import type { Component } from 'svelte';
	import { assetHref, emptyImage } from '$lib/utils/assets';
	type MobileModeOption = {
		artwork?: {
			src: string;
			width: number;
			height: number;
			sources?: readonly { src: string; density: number }[];
		};
		icon?: Component<{ size?: number; strokeWidth?: number }>;
		href?: string;
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
		navigation = false,
		class: className = '',
		onchange
	}: {
		value: string;
		options: readonly MobileModeOption[];
		label: string;
		idPrefix?: string;
		surface?: 'dark' | 'light';
		appearance?: 'underline' | 'attached' | 'panel' | 'compact' | 'choices' | 'segmented';
		navigation?: boolean;
		class?: string;
		onchange?: (value: string) => void;
	} = $props();
	const panelAppearance = $derived(
		appearance === 'panel' || appearance === 'choices' || appearance === 'segmented'
	);

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

{#snippet optionContent(option: MobileModeOption)}
	<span class="mode-tab-content">
		{#if option.artwork}
			<span
				class="mode-tab-icon mode-tab-artwork"
				style:--mode-artwork-aspect={option.artwork.width / option.artwork.height}
				aria-hidden="true"
			>
				<picture>
					<source
						media="(min-width: 768px)"
						srcset={option.artwork.sources
							?.map((source) => `${assetHref(source.src)} ${source.density}x`)
							.join(', ') ?? assetHref(option.artwork.src)}
					/>
					<img
						src={emptyImage}
						width={option.artwork.width}
						height={option.artwork.height}
						alt=""
						decoding="async"
					/>
				</picture>
			</span>
		{:else if option.icon}{@const Icon = option.icon}<span class="mode-tab-icon" aria-hidden="true"
				><Icon size={panelAppearance ? 22 : 19} strokeWidth={panelAppearance ? 2 : 1.75} /></span
			>{/if}
		{#if panelAppearance}<span class="mode-tab-label">{option.label}</span
			>{:else}{option.label}{/if}
	</span>
{/snippet}

<svelte:element
	this={navigation ? 'nav' : 'div'}
	class={['mobile-mode-tabs', className]}
	class:mobile-mode-tabs--light={surface === 'light'}
	class:mobile-mode-tabs--attached={appearance === 'attached'}
	class:mobile-mode-tabs--panel={panelAppearance}
	class:mobile-mode-tabs--compact={appearance === 'compact'}
	class:mobile-mode-tabs--choices={appearance === 'choices'}
	class:mobile-mode-tabs--segmented={appearance === 'segmented'}
	style:--mobile-mode-count={options.length}
	role={navigation ? undefined : 'tablist'}
	aria-label={label}
>
	{#each options as option, index (option.value)}
		{#if navigation}
			<a
				href={option.href}
				class:active={value === option.value}
				class:has-artwork={Boolean(option.artwork)}
				aria-current={value === option.value ? 'page' : undefined}
				>{@render optionContent(option)}</a
			>
		{:else}<button
				type="button"
				id={`${idPrefix}-${option.value}`}
				data-mode={option.value}
				role="tab"
				class:active={value === option.value}
				class:has-artwork={Boolean(option.artwork)}
				aria-selected={value === option.value}
				aria-controls={option.panelId}
				tabindex={value === option.value ? 0 : -1}
				onclick={() => activate(option.value)}
				onkeydown={(event) => handleKeydown(event, index)}
			>
				{@render optionContent(option)}
			</button>{/if}
	{/each}
</svelte:element>

<style>
	.mobile-mode-tabs {
		display: grid;
		grid-template-columns: repeat(var(--mobile-mode-count, 2), minmax(0, 1fr));
		gap: 0;
		border-bottom: 1px solid rgb(255 255 255 / 0.2);
	}

	.mobile-mode-tabs :is(button, a) {
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
		text-decoration: none;
	}

	.mobile-mode-tabs :is(button, a).active {
		color: var(--bc-white);
		font-weight: var(--bc-weight-control);
	}

	.mobile-mode-tabs :is(button, a).active::after {
		position: absolute;
		inset: auto 0 -1px;
		height: 2px;
		background: var(--bc-white);
		content: '';
	}

	.mobile-mode-tabs :is(button, a):focus-visible {
		outline: 2px solid rgb(255 255 255 / 0.82);
		outline-offset: -3px;
	}

	@media (prefers-reduced-motion: reduce) {
		.mobile-mode-tabs :is(button, a),
		.mobile-mode-tabs :is(button, a)::after {
			transition: none !important;
		}
	}

	.mobile-mode-tabs--light {
		border-color: var(--bc-border);
	}
	.mobile-mode-tabs--light :is(button, a) {
		color: var(--bc-muted);
		align-items: center;
		padding-block: var(--bc-space-2);
		font-size: var(--mode-tab-font-size, var(--bc-text-mode-tab));
	}
	.mobile-mode-tabs--light :is(button, a).active {
		color: var(--bc-ink);
	}
	.mobile-mode-tabs--light :is(button, a).active::after {
		background: var(--bc-accent);
	}
	.mobile-mode-tabs--light :is(button, a):focus-visible {
		outline-color: var(--bc-focus);
	}

	.mode-tab-icon {
		display: inline-flex;
		flex: 0 0 auto;
	}
	.mode-tab-content {
		display: contents;
	}
	.mobile-mode-tabs--attached {
		border: 1px solid var(--bc-dark-border);
		border-bottom: 0;
		border-radius: var(--bc-radius-panel) var(--bc-radius-panel) 0 0;
		background: var(--bc-dark-surface);
		padding: var(--bc-space-1) var(--bc-space-1) 0;
	}
	.mobile-mode-tabs--attached :is(button, a) {
		align-items: center;
		gap: var(--bc-space-2);
		min-height: var(--bc-control-height-primary);
		height: auto;
		padding: var(--bc-space-3) var(--bc-space-4);
		font-size: var(--mode-tab-font-size, var(--bc-text-h5));
		border-radius: var(--bc-radius-control) var(--bc-radius-control) 0 0;
		color: var(--bc-dark-muted);
	}
	.mobile-mode-tabs--attached :is(button, a):hover {
		color: var(--bc-white);
		background: var(--bc-dark-hover);
	}
	.mobile-mode-tabs--attached :is(button, a).active {
		color: var(--bc-ink);
		background: var(--bc-surface-raised);
	}
	.mobile-mode-tabs--attached :is(button, a).active::after {
		display: none;
	}
	.mobile-mode-tabs--attached :is(button, a):focus-visible {
		outline-offset: -4px !important;
	}
	.mobile-mode-tabs--panel {
		gap: var(--bc-space-2);
		border: 0;
	}
	.mobile-mode-tabs--panel :is(button, a) {
		align-items: center;
		gap: var(--bc-space-2);
		height: auto;
		min-height: var(--bc-control-height-primary);
		padding: var(--bc-space-2) var(--bc-space-4);
		border: 1px solid transparent;
		border-radius: var(--bc-radius-md);
		color: var(--desktop-discovery-copy, var(--bc-dark-muted));
		font-size: var(--mode-tab-font-size, var(--bc-text-entry));
	}
	.mobile-mode-tabs--panel :is(button, a):hover {
		background: var(--bc-surface-raised);
		color: var(--desktop-discovery-ink, var(--bc-white));
	}
	.mobile-mode-tabs--panel :is(button, a).active {
		background: transparent;
		color: var(--desktop-discovery-ink, var(--bc-white));
	}
	.mobile-mode-tabs--panel :is(button, a).active::after {
		inset: auto var(--bc-space-4) 0;
		background: var(--bc-accent);
		border-radius: var(--bc-radius-pill);
	}
	@media (min-width: 768px) {
		.mobile-mode-tabs--panel {
			gap: var(--bc-space-3);
		}
		.mobile-mode-tabs--panel .mode-tab-artwork {
			display: grid;
			place-items: center;
			width: calc(var(--bc-mode-tab-artwork-size) * 4 / 3);
			height: var(--bc-mode-tab-artwork-size);
		}
		.mobile-mode-tabs--panel .mode-tab-artwork picture,
		.mobile-mode-tabs--panel .mode-tab-artwork img {
			display: block;
			width: calc(var(--bc-mode-tab-artwork-size) * var(--mode-artwork-aspect, 1));
			height: var(--bc-mode-tab-artwork-size);
			object-fit: contain;
		}
		.mobile-mode-tabs--panel :is(button, a).has-artwork {
			min-height: calc(var(--bc-mode-tab-artwork-size) + var(--bc-space-4));
		}
		.mobile-mode-tabs--panel .mode-tab-content {
			display: grid;
			grid-template-columns: calc(var(--bc-mode-tab-artwork-size) * 4 / 3) minmax(0, max-content);
			align-items: center;
			justify-content: center;
			gap: var(--bc-space-2);
			width: 100%;
			white-space: nowrap;
			text-align: start;
		}
		.mobile-mode-tabs--panel :is(button, a) {
			transition:
				background var(--bc-motion-fast),
				border-color var(--bc-motion-fast),
				color var(--bc-motion-fast);
		}
		.mobile-mode-tabs--panel :is(button, a).active::after {
			inset: auto var(--bc-space-4) 0;
			height: 2px;
			border-radius: var(--bc-radius-pill);
			background: var(--bc-accent);
			content: '';
		}
		.mobile-mode-tabs--panel :is(button, a).active .mode-tab-icon {
			color: var(--bc-accent);
		}
		.mobile-mode-tabs--panel :is(button, a):hover {
			background: var(--bc-control-hover);
			border-color: transparent;
		}
		.mobile-mode-tabs--panel :is(button, a):focus-visible {
			outline-color: var(--bc-focus);
		}
		.mobile-mode-tabs--choices :is(button, a).active {
			background: var(--bc-control-selected-surface);
			border-color: transparent;
		}
		.mobile-mode-tabs--choices :is(button, a).active:hover {
			background: var(--bc-control-selected-hover);
		}
		.mobile-mode-tabs--choices :is(button, a).active::after {
			display: none;
		}
		.mobile-mode-tabs--compact {
			display: flex;
			flex-wrap: wrap;
			gap: var(--bc-space-2);
			border: 0;
		}
		.mobile-mode-tabs--compact :is(button, a) {
			align-items: center;
			padding: var(--bc-space-2) var(--bc-space-3);
			border-radius: var(--bc-radius-control);
			color: var(--bc-copy);
			font-size: var(--mode-tab-font-size, var(--bc-text-search));
			white-space: nowrap;
		}
		.mobile-mode-tabs--compact :is(button, a):hover {
			background: var(--bc-control-hover);
			color: var(--bc-ink);
		}
		.mobile-mode-tabs--compact :is(button, a).active {
			color: var(--bc-ink);
		}
		.mobile-mode-tabs--compact :is(button, a).active::after {
			inset: auto var(--bc-space-3) 0;
			background: var(--bc-ink);
		}
		.mobile-mode-tabs--compact :is(button, a):focus-visible {
			outline-color: var(--bc-focus);
		}
	}
	@media (min-width: 768px) and (max-width: 1023px) {
		.mobile-mode-tabs--panel .mode-tab-content {
			grid-template-columns: minmax(0, 1fr);
			justify-items: center;
			gap: var(--bc-space-1);
			text-align: center;
		}
		.mobile-mode-tabs--panel :is(button, a) {
			padding-inline: var(--bc-space-2);
		}
	}
	@media (min-width: 768px) {
		.mobile-mode-tabs--segmented {
			--mode-segment-artwork-size: var(--bc-space-6);
			display: grid;
			gap: 2px;
			width: min(100%, var(--mode-segment-width, 620px));
			height: var(--bc-control-height-standard);
			margin-inline: auto;
			padding: 3px;
			border: 0;
			border-radius: var(--bc-radius-pill);
			background: var(--bc-control);
		}
		.mobile-mode-tabs--segmented :is(button, a),
		.mobile-mode-tabs--segmented :is(button, a).has-artwork {
			height: 100%;
			min-height: 0;
			padding: 0 var(--bc-space-2);
			border: 0;
			border-radius: inherit;
			background: transparent;
			color: var(--bc-copy);
			font-size: var(--mode-tab-font-size, var(--bc-text-body));
			white-space: nowrap;
		}
		.mobile-mode-tabs--segmented :is(button, a):hover {
			background: var(--bc-control-hover);
			color: var(--bc-ink);
		}
		.mobile-mode-tabs--segmented :is(button, a).active,
		.mobile-mode-tabs--segmented :is(button, a).active:hover {
			background: var(--bc-surface-raised);
			color: var(--bc-ink);
			box-shadow: var(--bc-shadow-subtle);
		}
		.mobile-mode-tabs--segmented :is(button, a).active::after {
			display: none;
		}
		.mobile-mode-tabs--segmented :is(button, a):focus-visible {
			outline-color: var(--bc-focus);
			outline-offset: -2px;
		}
		.mobile-mode-tabs--segmented .mode-tab-content {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: var(--bc-space-2);
			width: 100%;
			text-align: center;
		}
		.mobile-mode-tabs--segmented .mode-tab-artwork {
			width: calc(var(--mode-segment-artwork-size) * 4 / 3);
			height: var(--mode-segment-artwork-size);
		}
		.mobile-mode-tabs--segmented .mode-tab-artwork picture,
		.mobile-mode-tabs--segmented .mode-tab-artwork img {
			width: calc(var(--mode-segment-artwork-size) * var(--mode-artwork-aspect, 1));
			height: var(--mode-segment-artwork-size);
		}
		.mobile-mode-tabs--segmented :is(button, a).active .mode-tab-icon {
			color: inherit;
		}
	}
</style>
