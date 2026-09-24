<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes, HTMLAnchorAttributes, HTMLAttributes } from 'svelte/elements';
	import { linkHref } from '$lib/utils/links';
	type Props = Omit<HTMLAttributes<HTMLElement>, 'children' | 'onclick'> &
		Pick<HTMLAnchorAttributes, 'href' | 'target' | 'rel' | 'download' | 'hreflang'> & {
			children?: Snippet;
			type?: HTMLButtonAttributes['type'];
			disabled?: boolean;
			name?: string;
			value?: HTMLButtonAttributes['value'];
			form?: string;
			onclick?: (event: MouseEvent) => void;
			variant?: 'primary' | 'secondary' | 'strong' | 'quiet' | 'inverse' | 'glass';
			size?: 'compact' | 'standard' | 'primary' | 'hero';
		};
	let {
		children,
		href,
		variant = 'primary',
		size = 'standard',
		type = 'button',
		disabled = false,
		class: className = '',
		onclick,
		...rest
	}: Props = $props();
</script>

{#if href}
	<a
		{...rest}
		href={linkHref(href)}
		class={['site-action', variant, `size-${size}`, className]}
		aria-disabled={disabled || undefined}
		tabindex={disabled ? -1 : rest.tabindex}
		onclick={(event) => {
			if (disabled) event.preventDefault();
			else onclick?.(event);
		}}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		{...rest}
		{type}
		{disabled}
		{onclick}
		class={['site-action', variant, `size-${size}`, className]}>{@render children?.()}</button
	>
{/if}

<style>
	.site-action {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--bc-space-2);
		min-height: var(--bc-control-height-standard);
		border: 1px solid transparent;
		border-radius: var(--bc-radius-control);
		padding: 0 var(--bc-control-x);
		font-family: var(--bc-font-body);
		font-size: var(--bc-text-cta);
		font-weight: var(--bc-weight-action);
		line-height: var(--bc-leading-control);
		text-decoration: none;
		cursor: pointer;
		transition:
			background-color var(--bc-motion-fast),
			border-color var(--bc-motion-fast);
	}
	.primary {
		background: var(--bc-accent);
		color: var(--bc-accent-contrast);
	}
	.primary:hover {
		background: var(--bc-accent-hover);
	}
	.secondary {
		background: var(--bc-control);
		border-color: transparent;
		color: var(--bc-ink);
	}
	.secondary:hover,
	.quiet:hover {
		background: var(--bc-surface-hover);
	}
	.strong {
		background: var(--bc-ink);
		color: var(--bc-white);
	}
	.strong:hover {
		background: var(--bc-dark-hover);
	}
	.quiet {
		background: transparent;
		color: var(--bc-ink);
	}
	.inverse {
		background: transparent;
		border-color: var(--bc-dark-muted);
		color: var(--bc-white);
	}
	.inverse:hover {
		background: var(--bc-dark-hover);
	}
	.glass {
		background: var(--bc-glass-surface);
		border-color: var(--bc-glass-border);
		color: var(--bc-white);
		backdrop-filter: blur(12px);
	}
	.glass:hover,
	.glass[aria-pressed='true'] {
		background: var(--bc-glass-hover);
		border-color: var(--bc-white);
	}
	.size-compact {
		font-size: var(--bc-text-control);
		min-height: var(--bc-control-height-standard);
	}
	.size-primary {
		min-height: var(--bc-control-height-primary);
	}
	.size-hero {
		min-height: var(--bc-control-height-hero);
	}
	.site-action:disabled,
	.site-action[aria-disabled='true'] {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.site-action :global(svg) {
		flex-shrink: 0;
	}
</style>
