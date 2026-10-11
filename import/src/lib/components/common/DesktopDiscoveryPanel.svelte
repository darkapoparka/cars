<script lang="ts">
	import type { Snippet } from 'svelte';
	let {
		header,
		compactHeader = false,
		description,
		descriptionContent,
		children,
		class: className = ''
	}: {
		header?: Snippet;
		compactHeader?: boolean;
		description?: string;
		descriptionContent?: Snippet;
		children: Snippet;
		class?: string;
	} = $props();
</script>

<div
	class={['desktop-discovery-panel', className]}
	class:has-header={Boolean(header)}
	class:has-compact-header={compactHeader && Boolean(header)}
>
	{#if header}<div class="desktop-discovery-panel__header">{@render header()}</div>{/if}
	<div class="desktop-discovery-panel__body" class:has-header={Boolean(header)}>
		{#if descriptionContent || description}<p class="desktop-discovery-panel__description">
				{#if descriptionContent}{@render descriptionContent()}{:else}{description}{/if}
			</p>{/if}
		{@render children()}
	</div>
</div>

<style>
	.desktop-discovery-panel {
		--desktop-discovery-inset: var(--bc-space-5);
		--action-strong-border: var(--desktop-discovery-border, transparent);
		--bc-border: var(--desktop-discovery-border);
		--bc-control: var(--bc-surface-raised);
		--bc-surface: var(--bc-surface-raised);
		width: 100%;
		max-width: var(--hero-panel-width, var(--bc-desktop-discovery-width));
		margin-inline: auto;
		border: 1px solid var(--desktop-discovery-border, var(--bc-border));
		border-radius: var(--desktop-discovery-radius, var(--bc-radius-section));
		background: var(--desktop-discovery-surface, var(--bc-surface-raised));
		color: var(--desktop-discovery-ink, var(--bc-ink));
		text-align: start;
		box-shadow: var(--desktop-discovery-shadow, var(--bc-shadow-panel));
	}
	.desktop-discovery-panel__header {
		border-radius: var(--desktop-discovery-radius, var(--bc-radius-section))
			var(--desktop-discovery-radius, var(--bc-radius-section)) 0 0;
		padding: var(--bc-space-3) var(--desktop-discovery-inset) 0;
		background: inherit;
	}
	.desktop-discovery-panel__body {
		--desktop-discovery-control-radius: var(--bc-desktop-control-radius);
		display: grid;
		align-content: center;
		gap: var(--desktop-discovery-gap, var(--bc-space-4));
		min-width: 0;
		min-height: var(--bc-desktop-discovery-panel-height);
		padding: var(--desktop-discovery-padding, var(--desktop-discovery-inset));
		border-radius: inherit;
	}
	.desktop-discovery-panel__body.has-header {
		min-height: calc(var(--bc-desktop-discovery-panel-height) - var(--bc-space-2));
		padding-top: var(--bc-space-3);
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}
	@media (min-width: 768px) {
		.desktop-discovery-panel {
			display: grid;
			grid-template-rows: minmax(0, 1fr);
			min-height: var(--bc-desktop-hero-panel-height);
			max-width: var(--bc-desktop-discovery-width);
			--desktop-discovery-inset: var(--bc-space-6);
			--bc-control: var(--bc-desktop-control-surface, var(--bc-surface-raised));
			--bc-border: var(--desktop-discovery-border, var(--bc-editorial-border));
		}
		.desktop-discovery-panel.has-header {
			grid-template-rows: auto minmax(0, 1fr);
		}
		.desktop-discovery-panel__description {
			margin: 0;
			color: var(--desktop-discovery-copy, var(--bc-copy));
			font: var(--bc-weight-body) var(--bc-text-body) / var(--bc-space-6) var(--bc-font-body);
			text-align: center;
		}
		.desktop-discovery-panel__header {
			padding-top: var(--bc-space-4);
		}
		.desktop-discovery-panel__body.has-header {
			min-height: 0;
			padding-bottom: var(--bc-space-5);
		}
		.desktop-discovery-panel.has-compact-header .desktop-discovery-panel__header {
			padding-top: var(--desktop-discovery-inset);
		}
		.desktop-discovery-panel.has-compact-header .desktop-discovery-panel__body {
			align-content: start;
			padding-top: var(--bc-space-3);
		}
	}
</style>
