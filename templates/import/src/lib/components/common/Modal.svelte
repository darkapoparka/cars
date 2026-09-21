<script lang="ts">
	import { page } from '$app/state';
	import { Dialog } from 'bits-ui';
	import X from '@lucide/svelte/icons/x';
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
		onOpenAutoFocus,
		headerContent,
		class: className = ''
	}: {
		open?: boolean;
		title: string;
		description?: string;
		children: Snippet;
		footer?: Snippet;
		wide?: boolean;
		bodyTone?: 'default' | 'muted';
		onOpenAutoFocus?: (event: Event) => void;
		headerContent?: Snippet;
		class?: string;
	} = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Portal>
		<Dialog.Overlay class="site-dialog-backdrop" />
		<Dialog.Content
			{onOpenAutoFocus}
			class={[
				'site-dialog',
				className,
				wide && 'site-dialog--wide',
				bodyTone === 'muted' && 'site-dialog--muted'
			]}
		>
			<header class="site-dialog__header">
				<div>
					<Dialog.Title class="site-dialog__title">{title}</Dialog.Title
					>{#if description}<Dialog.Description class="site-dialog__description"
							>{description}</Dialog.Description
						>{/if}
				</div>
				<MobileIconAction
					label={page.data.locale === 'en' ? 'Close' : 'Затвори'}
					onclick={() => (open = false)}><X size={20} aria-hidden="true" /></MobileIconAction
				>
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
</style>
