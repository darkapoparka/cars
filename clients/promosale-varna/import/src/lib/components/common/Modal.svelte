<script lang="ts">
	import { page } from '$app/state';
	import { Dialog } from 'bits-ui';
	import X from '@lucide/svelte/icons/x';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import type { Snippet } from 'svelte';
	import MobileIconAction from './MobileIconAction.svelte';
	let {
		open = $bindable(false),
		title,
		description,
		children,
		footer,
		wide = false,
		bodyTone = 'default',
		variant = 'default',
		onBack,
		backLabel,
		onOpenAutoFocus,
		onEscapeKeydown,
		headerContent,
		headerActions,
		class: className = ''
	}: {
		open?: boolean;
		title: string;
		description?: string;
		children: Snippet;
		footer?: Snippet;
		wide?: boolean;
		bodyTone?: 'default' | 'muted';
		variant?: 'default' | 'filter';
		onBack?: () => void;
		backLabel?: string;
		onOpenAutoFocus?: (event: Event) => void;
		onEscapeKeydown?: (event: KeyboardEvent) => void;
		headerContent?: Snippet;
		headerActions?: Snippet;
		class?: string;
	} = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Portal>
		<Dialog.Overlay class="site-dialog-backdrop" />
		<Dialog.Content
			{onOpenAutoFocus}
			{onEscapeKeydown}
			class={[
				'site-dialog',
				className,
				wide && 'site-dialog--wide',
				variant === 'filter' && 'site-dialog--filter',
				bodyTone === 'muted' && 'site-dialog--muted'
			]}
		>
			<header class="site-dialog__header">
				{#if onBack}<button
						type="button"
						class="site-dialog__icon"
						aria-label={backLabel ?? (page.data.locale === 'en' ? 'Back' : 'Назад')}
						onclick={onBack}><ArrowLeft size={20} aria-hidden="true" /></button
					>{/if}
				<div class="site-dialog__heading">
					<Dialog.Title class="site-dialog__title">{title}</Dialog.Title
					>{#if description}<Dialog.Description class="site-dialog__description"
							>{description}</Dialog.Description
						>{/if}
				</div>
				{#if headerActions}{@render headerActions()}{/if}
				{#if variant === 'filter'}
					<Dialog.Close
						class="site-dialog__icon"
						aria-label={page.data.locale === 'en' ? 'Close' : 'Затвори'}
						><X size={20} aria-hidden="true" /></Dialog.Close
					>
				{:else}<MobileIconAction
						label={page.data.locale === 'en' ? 'Close' : 'Затвори'}
						onclick={() => (open = false)}><X size={20} aria-hidden="true" /></MobileIconAction
					>
				{/if}
			</header>
			{#if headerContent}<div class="site-dialog__toolbar">{@render headerContent()}</div>{/if}
			<div class="site-dialog__body">{@render children()}</div>
			{#if footer}<footer class="site-dialog__footer">{@render footer()}</footer>{/if}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
	:global(.site-dialog-backdrop) {
		position: fixed;
		inset: 0;
		z-index: calc(var(--bc-z-overlay) + var(--bits-dialog-depth, 0) * 2);
		background: rgb(9 10 11 / 0.48);
	}
	:global(.site-dialog) {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: calc(var(--bc-z-dialog) + var(--bits-dialog-depth, 0) * 2);
		width: min(560px, calc(100vw - 32px));
		max-height: min(800px, calc(100dvh - 48px));
		display: flex;
		flex-direction: column;
		border-radius: var(--bc-radius-panel);
		background: var(--bc-surface-raised);
		color: var(--bc-ink);
		box-shadow: var(--bc-shadow-modal);
		padding: var(--bc-space-6);
		outline: none;
	}
	:global(.site-dialog--wide) {
		width: min(900px, calc(100vw - 32px));
	}
	.site-dialog__header {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-4);
		padding-bottom: var(--bc-space-4);
	}
	.site-dialog__heading {
		flex: 1;
		min-width: 0;
	}
	:global(.site-dialog__title) {
		margin: 0;
		font: var(--bc-weight-heading) var(--bc-text-h4)/1.25 var(--bc-font-heading);
	}
	:global(.site-dialog__description) {
		margin: var(--bc-space-1) 0 0;
		color: var(--bc-muted);
	}
	.site-dialog__body {
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
	}
	.site-dialog__footer {
		flex-shrink: 0;
		padding-top: var(--bc-space-4);
	}
	:global(.site-dialog--muted) {
		padding: 0;
		overflow: hidden;
	}
	:global(.site-dialog--muted) .site-dialog__header {
		padding: var(--bc-space-5) var(--bc-space-6);
		border-bottom: 1px solid var(--bc-border);
	}
	:global(.site-dialog--muted) .site-dialog__body {
		background: var(--bc-bg-strong);
		padding: var(--bc-space-5) var(--bc-space-6);
		scrollbar-width: thin;
		scrollbar-color: var(--bc-border-strong) var(--bc-bg-strong);
	}
	:global(.site-dialog--muted) .site-dialog__body::-webkit-scrollbar {
		width: 8px;
	}
	:global(.site-dialog--muted) .site-dialog__body::-webkit-scrollbar-thumb {
		background: var(--bc-border-strong);
		border-radius: var(--bc-radius-pill);
	}
	:global(.site-dialog--muted) .site-dialog__body::-webkit-scrollbar-track {
		background: var(--bc-bg-strong);
	}
	:global(.site-dialog--muted) .site-dialog__footer {
		border-top: 1px solid var(--bc-border);
		padding: var(--bc-space-4) var(--bc-space-6);
		background: var(--bc-surface-raised);
	}
	@media (max-width: 599px) {
		:global(.site-dialog--muted) .site-dialog__header,
		:global(.site-dialog--muted) .site-dialog__body,
		:global(.site-dialog--muted) .site-dialog__footer {
			padding-inline: var(--bc-space-4);
		}
	}

	.site-dialog__toolbar {
		flex-shrink: 0;
		min-width: 0;
	}
	/* Filter dialogs own their shell here; consumers only arrange their content. */
	:global(.site-dialog--filter) {
		padding: 0;
		overflow: hidden;
	}
	:global(.site-dialog--filter) .site-dialog__header {
		padding: var(--bc-space-5) var(--bc-space-6) var(--bc-space-4);
		gap: var(--bc-space-3);
	}
	:global(.site-dialog--filter .site-dialog__title) {
		font-family: var(--bc-font-body);
		line-height: var(--bc-leading-h4);
	}
	:global(.site-dialog--filter) .site-dialog__body {
		padding: 0 var(--bc-space-6);
		scrollbar-width: thin;
	}
	:global(.site-dialog--filter) .site-dialog__footer {
		padding: var(--bc-space-5) var(--bc-space-6) var(--bc-space-6);
	}
	:global(.site-dialog--filter) .site-dialog__footer :global(.site-action) {
		font-size: var(--bc-text-control);
		border-radius: var(--bc-radius-md);
		min-height: var(--bc-control-height-standard);
	}
	:global(.site-dialog--filter) .site-dialog__footer :global(.primary) {
		padding-inline: var(--bc-space-8);
	}
	:global(.site-dialog__icon) {
		display: grid;
		place-items: center;
		flex-shrink: 0;
		width: var(--bc-control-height-secondary);
		height: var(--bc-control-height-secondary);
		border: 0;
		border-radius: var(--bc-radius-md);
		background: transparent;
		color: var(--bc-copy);
		cursor: pointer;
	}
	:global(.site-dialog__icon:hover) {
		background: var(--bc-surface);
		color: var(--bc-ink);
	}
	@media (min-width: 768px) {
		:global(.site-dialog__title) {
			font-family: var(--bc-font-body);
			line-height: var(--bc-leading-h4);
		}
		:global(.site-dialog:not(.site-dialog--filter):not(.site-dialog--muted)) {
			padding: 0;
			overflow: hidden;
		}
		:global(.site-dialog:not(.site-dialog--filter):not(.site-dialog--muted)) .site-dialog__header {
			padding: var(--bc-space-5) var(--bc-space-6);
		}
		:global(.site-dialog:not(.site-dialog--filter):not(.site-dialog--muted)) .site-dialog__body {
			padding: 0 var(--bc-space-6) var(--bc-space-6);
			scrollbar-width: thin;
		}
		:global(.site-dialog:not(.site-dialog--filter):not(.site-dialog--muted)) .site-dialog__footer {
			padding: var(--bc-space-4) var(--bc-space-6) var(--bc-space-6);
		}
		.site-dialog__header :global(.bc-mobile-icon-action) {
			--bc-mobile-icon-surface: transparent;
			--bc-mobile-icon-border: none;
			border-radius: var(--bc-radius-md);
		}
		.site-dialog__header :global(.bc-mobile-icon-action:hover) {
			background: var(--bc-surface);
		}
		:global(.filter-picker-dialog) {
			padding: var(--bc-space-6);
		}
		:global(.filter-picker-dialog) .site-dialog__header {
			padding: 0 0 var(--bc-space-4);
			border: 0;
		}
		:global(.filter-picker-dialog) .site-dialog__body {
			padding: var(--bc-space-1);
			background: var(--bc-surface-raised);
		}
		:global(.filter-picker-dialog) .site-dialog__footer {
			padding: var(--bc-space-5) 0 0;
			border: 0;
		}
		:global(.filter-picker-dialog) .site-dialog__footer :global(.site-action) {
			min-width: 96px;
			font-size: var(--bc-text-control);
			border-radius: var(--bc-radius-md);
		}
	}
</style>
