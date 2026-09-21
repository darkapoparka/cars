<script lang="ts">
	import { nativeMessage } from '$lib/i18n/native';

	const nt = (key: import('$lib/i18n/native').NativeKey) =>
		nativeMessage(page.data.locale === 'en' ? 'en' : 'bg', key);
	import { page } from '$app/state';
	import { pushState } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onDestroy, onMount, tick, type Snippet } from 'svelte';
	import X from '@lucide/svelte/icons/x';
	import { Drawer } from 'vaul-svelte';
	import MobileIconAction from '$lib/components/common/MobileIconAction.svelte';

	let {
		open = $bindable(false),
		title,
		description,
		closeLabel = nt('ui33'),
		mode = 'sheet',
		showHandle = mode === 'sheet',
		showHeader = true,
		contentClass = '',
		repositionInputs = false,
		closeOnBack = true,
		children,
		footer,
		onclose
	}: {
		open?: boolean;
		title: string;
		description?: string;
		closeLabel?: string;
		mode?: 'sheet' | 'full';
		showHandle?: boolean;
		showHeader?: boolean;
		contentClass?: string;
		repositionInputs?: boolean;
		closeOnBack?: boolean;
		children: Snippet;
		footer?: Snippet;
		onclose?: () => void;
	} = $props();

	let contentElement = $state<HTMLElement | null>(null);
	let previouslyFocused: HTMLElement | null = null;
	let previousBodyOverflow = '';
	let sheetWasOpen = false;
	let historyEntryActive = false;
	let closeAfterHistory = false;
	const historyId = `bc-mobile-sheet-${Math.random().toString(36).slice(2)}`;

	const close = () => {
		open = false;
	};

	const handlePopState = () => {
		if (closeAfterHistory) {
			closeAfterHistory = false;
			onclose?.();
			return;
		}
		if (!open || !historyEntryActive) return;
		historyEntryActive = false;
		open = false;
	};

	onMount(() => {
		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	});

	$effect(() => {
		if (!browser) return;
		if (open && !sheetWasOpen) {
			sheetWasOpen = true;
			previouslyFocused =
				document.activeElement instanceof HTMLElement ? document.activeElement : null;
			previousBodyOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			if (closeOnBack && !historyEntryActive) {
				pushState('', { ...page.state, __bcMobileSheet: historyId });
				historyEntryActive = true;
			}
			void tick().then(() => contentElement?.focus({ preventScroll: true }));
			return;
		}
		if (!open && sheetWasOpen) {
			sheetWasOpen = false;
			document.body.style.overflow = previousBodyOverflow;
			if (closeOnBack && historyEntryActive) {
				historyEntryActive = false;
				closeAfterHistory = true;
				history.back();
			} else if (!closeAfterHistory) {
				onclose?.();
			}
			const target = previouslyFocused;
			previouslyFocused = null;
			void tick().then(() => target?.focus({ preventScroll: true }));
		}
	});
	onDestroy(() => {
		if (!browser || !sheetWasOpen) return;
		document.body.style.overflow = previousBodyOverflow;
	});
</script>

<Drawer.Root
	bind:open
	direction="bottom"
	fixed={true}
	{repositionInputs}
	dismissible={mode !== 'full'}
>
	<Drawer.Overlay class="bc-mobile-sheet__backdrop" />
	<Drawer.Content
		bind:ref={contentElement}
		tabindex={-1}
		class={`bc-mobile-sheet__content bc-mobile-sheet__content--${mode} ${contentClass}`.trim()}
	>
		{#if showHandle}<Drawer.Handle class="bc-mobile-sheet__handle" />{/if}
		{#if showHeader}
			<header
				class="bc-mobile-sheet__header"
				class:bc-mobile-sheet__header--with-description={Boolean(description)}
			>
				<div>
					<Drawer.Title class="bc-mobile-sheet__title">{title}</Drawer.Title>
					{#if description}
						<Drawer.Description class="bc-mobile-sheet__description">
							{description}
						</Drawer.Description>
					{/if}
				</div>
				<MobileIconAction label={closeLabel} onclick={close}>
					<X size={20} strokeWidth={2.25} aria-hidden="true" />
				</MobileIconAction>
			</header>
		{:else}
			<Drawer.Title class="sr-only">{title}</Drawer.Title>
			{#if description}<Drawer.Description class="sr-only">{description}</Drawer.Description>{/if}
		{/if}
		<div class="bc-mobile-sheet__body" data-vaul-no-drag>{@render children()}</div>
		{#if footer}<footer class="bc-mobile-sheet__footer">{@render footer()}</footer>{/if}
	</Drawer.Content>
</Drawer.Root>

<style>
	:global(.bc-mobile-sheet__backdrop) {
		position: fixed;
		inset: 0;
		z-index: 1400;
		background: rgb(9 10 11 / 0.48);
	}

	:global(.bc-mobile-sheet__content) {
		position: fixed;
		right: 0;
		bottom: var(--bc-kb-inset, 0px);
		left: 0;
		z-index: 1401;
		display: flex;
		flex-direction: column;
		width: min(100%, var(--bc-mobile-sheet-max-width));
		max-height: min(calc(92dvh - var(--bc-kb-inset, 0px)), var(--bc-mobile-sheet-max-height));
		overflow: hidden;
		margin-inline: auto;
		border-radius: var(--bc-radius-panel) var(--bc-radius-panel) 0 0;
		background: var(--bc-bg);
		color: var(--bc-ink);
		outline: 0;
		padding: var(--bc-space-2) var(--bc-mobile-gutter)
			max(var(--bc-space-4), env(safe-area-inset-bottom));
	}

	:global(.bc-mobile-sheet__content--full) {
		inset: 0;
		width: 100%;
		height: calc(100dvh - var(--bc-kb-inset, 0px));
		max-height: none;
		border-radius: 0;
		padding-top: max(var(--bc-space-3), env(safe-area-inset-top));
	}

	:global(.bc-mobile-sheet__handle) {
		position: relative;
		width: 56px;
		height: 22px;
		align-self: center;
		flex: 0 0 22px;
		background: transparent;
	}

	:global(.bc-mobile-sheet__handle)::after {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 42px;
		height: 4px;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-border-strong);
		content: '';
		transform: translate(-50%, -50%);
	}

	:global(.bc-mobile-sheet__header) {
		position: relative;
		z-index: 2;
		display: flex;
		min-height: var(--bc-mobile-sheet-header-height);
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-4);
		padding: 0 0 var(--bc-space-2);
	}

	:global(.bc-mobile-sheet__header--with-description) {
		min-height: calc(var(--bc-control-height-standard) + var(--bc-space-4));
		padding: var(--bc-space-1) 0 var(--bc-space-3);
	}

	:global(.bc-mobile-sheet__header > div) {
		min-width: 0;
	}

	:global(.bc-mobile-sheet__title) {
		margin: 0;
		font-size: var(--bc-mobile-section-title);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-section-title-leading);
	}

	:global(.bc-mobile-sheet__description) {
		display: block;
		margin-top: var(--bc-space-1);
		color: var(--bc-muted);
		font-size: var(--bc-mobile-body);
		line-height: var(--bc-mobile-body-leading);
	}

	:global(.bc-mobile-sheet__body) {
		min-height: 0;
		flex: 1 1 auto;
		overflow-y: auto;
		overscroll-behavior: contain;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}

	:global(.bc-mobile-sheet__body::-webkit-scrollbar) {
		display: none;
	}

	:global(.bc-mobile-sheet__footer) {
		flex: 0 0 auto;
		padding-top: var(--bc-space-3);
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.bc-mobile-sheet__content),
		:global(.bc-mobile-sheet__backdrop) {
			animation: none !important;
			transition: none !important;
		}
	}
</style>
