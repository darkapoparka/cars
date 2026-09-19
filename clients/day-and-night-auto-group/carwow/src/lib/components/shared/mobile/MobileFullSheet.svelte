<script lang="ts">
	import { tick } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { cubicOut } from 'svelte/easing';
	import { trapModalTab } from '$lib/utils/modal-focus';

	// Slide the OPAQUE panel up from the bottom (and back down on close). Never
	// animate opacity — fading a full-screen white panel reveals the page behind
	// it, which reads as broken. translateY is relative to the panel's own
	// height, so 100% parks it just off the bottom edge.
	function slideSheet(_node: HTMLElement, { duration = 270 } = {}) {
		const reduce =
			typeof window !== 'undefined' &&
			window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
		return {
			duration: reduce ? 0 : duration,
			easing: cubicOut,
			css: (t: number) => `transform: translateY(${(1 - t) * 100}%);`
		};
	}

	let {
		open = $bindable(false),
		labelledBy,
		presentation = 'full',
		draggable = false,
		onClose,
		children
	}: {
		open?: boolean;
		labelledBy?: string;
		presentation?: 'full' | 'content';
		draggable?: boolean;
		onClose?: () => void;
		children?: Snippet;
	} = $props();

	let pull = $state(0);
	let dragging = $state(false);
	let startY = 0;
	let dragged = false;
	function startDrag(event: PointerEvent) {
		if (event.button !== 0) return;
		startY = event.clientY;
		dragged = false;
		dragging = true;
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	}
	function moveDrag(event: PointerEvent) {
		if (dragging) {
			pull = Math.max(0, event.clientY - startY);
			if (Math.abs(event.clientY - startY) > 5) dragged = true;
		}
	}
	function endDrag(event: PointerEvent) {
		if (!dragging) return;
		const dismiss = event.type !== 'pointercancel' && pull > 88;
		dragging = false;
		(event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
		pull = 0;
		if (dismiss) closeSheet();
	}

	const fullSheetPanel: Attachment<HTMLDialogElement> = (node) => {
		const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		document.body.appendChild(node);
		node.showModal();
		// A backdrop gesture must begin and end outside the panel.
		let startedOnBackdrop = false;
		const outsidePanel = (event: MouseEvent) => {
			const rect = node.getBoundingClientRect();
			return (
				event.clientX < rect.left ||
				event.clientX >= rect.right ||
				event.clientY < rect.top ||
				event.clientY >= rect.bottom
			);
		};
		const trackPointer = (event: PointerEvent) => {
			startedOnBackdrop = presentation === 'content' && event.button === 0 && outsidePanel(event);
		};
		const dismissBackdrop = (event: MouseEvent) => {
			if (startedOnBackdrop && outsidePanel(event)) closeSheet();
			startedOnBackdrop = false;
		};
		document.addEventListener('pointerdown', trackPointer, true);
		document.addEventListener('click', dismissBackdrop, true);
		const containTab = (event: KeyboardEvent) => trapModalTab(event, node);
		const containFocus = (event: FocusEvent) => {
			if (node.open && event.target instanceof Node && !node.contains(event.target)) {
				node.focus({ preventScroll: true });
			}
		};
		document.addEventListener('keydown', containTab, true);
		document.addEventListener('focusin', containFocus);

		const vv = window.visualViewport;
		const applyViewportSize = () => {
			if (!vv) return;
			node.style.setProperty('--sa-ov-h', `${Math.round(vv.height)}px`);
			const bottom = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
			node.style.setProperty('--sa-ov-bottom', `${bottom}px`);
			node.style.setProperty('--sa-ov-top', `${Math.round(vv.offsetTop)}px`);
		};
		applyViewportSize();
		vv?.addEventListener('resize', applyViewportSize);
		vv?.addEventListener('scroll', applyViewportSize);

		const { body } = document;
		const previousOverflow = body.style.overflow;
		body.style.overflow = 'hidden';

		let disposed = false;
		let raf = 0;
		void tick().then(() => {
			if (disposed) return;
			raf = requestAnimationFrame(() => {
				if (!disposed && node.isConnected && node.open) node.focus({ preventScroll: true });
			});
		});

		return () => {
			disposed = true;
			document.removeEventListener('pointerdown', trackPointer, true);
			document.removeEventListener('click', dismissBackdrop, true);
			document.removeEventListener('keydown', containTab, true);
			document.removeEventListener('focusin', containFocus);
			vv?.removeEventListener('resize', applyViewportSize);
			vv?.removeEventListener('scroll', applyViewportSize);
			body.style.overflow = previousOverflow;
			cancelAnimationFrame(raf);
			node.close();
			node.remove();
			if (trigger?.isConnected && trigger.getClientRects().length)
				trigger.focus({ preventScroll: true });
		};
	};

	function closeSheet() {
		if (!open) return;
		open = false;
		pull = 0;
		dragging = false;
		onClose?.();
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) {
			event.preventDefault();
			closeSheet();
		}
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if open}
	<dialog
		class="mobile-fullsheet"
		class:mobile-fullsheet--content={presentation === 'content'}
		class:mobile-fullsheet--draggable={draggable && presentation === 'content'}
		class:mobile-fullsheet--dragging={dragging}
		style:translate={`0 ${pull}px`}
		{@attach fullSheetPanel}
		aria-modal="true"
		aria-labelledby={labelledBy}
		tabindex={-1}
		transition:slideSheet
		oncancel={(event) => {
			event.preventDefault();
			closeSheet();
		}}
	>
		{#if draggable && presentation === 'content'}
			<button
				class="mobile-fullsheet__handle"
				type="button"
				aria-label="Прибери панела"
				onclick={() => {
					if (!dragged) closeSheet();
					dragged = false;
				}}
				onpointerdown={startDrag}
				onpointermove={moveDrag}
				onpointerup={endDrag}
				onpointercancel={endDrag}
			>
				<span></span>
			</button>
		{/if}
		{@render children?.()}
	</dialog>
{/if}

<style>
	.mobile-fullsheet {
		margin: 0;
		padding: 0;
		border: 0;
		width: 100%;
		max-width: none;
		max-height: none;
		position: fixed;
		z-index: 80;
		top: var(--sa-ov-top, 0px);
		right: 0;
		left: 0;
		height: var(--sa-ov-h, 100dvh);
		display: grid;
		background: #fff;
		color: var(--sa-ink);
		font-family: var(--sa-font);
		-webkit-font-smoothing: antialiased;
		overscroll-behavior: contain;
		outline: none;
	}

	/* Information has intrinsic height. Full task sheets keep their original geometry. */
	.mobile-fullsheet--content {
		grid-template-rows: minmax(0, 1fr);
		top: auto;
		bottom: var(--sa-ov-bottom, 0px);
		height: auto;
		max-height: calc(var(--sa-ov-h, 100dvh) - var(--sa-space-4) - env(safe-area-inset-top));
		max-width: 36rem;
		margin-inline: auto;
		overflow: hidden;
		border-radius: var(--sa-r-xl) var(--sa-r-xl) 0 0;
		background: var(--sa-surface);
		box-shadow: var(--sa-shadow-lg);
	}
	.mobile-fullsheet--content::backdrop {
		background: color-mix(in srgb, var(--sa-dark) 52%, transparent);
	}
	.mobile-fullsheet--draggable {
		grid-template-rows: 44px minmax(0, 1fr);
		transition: translate 180ms ease-out;
	}
	.mobile-fullsheet--dragging {
		transition: none;
	}
	.mobile-fullsheet__handle {
		display: grid;
		place-items: center;
		border: 0;
		padding: 0;
		background: transparent;
		cursor: grab;
		touch-action: none;
	}
	.mobile-fullsheet__handle span {
		display: block;
		width: 36px;
		height: 4px;
		border-radius: 4px;
		background: #c4c9cf;
	}
	.mobile-fullsheet__handle:focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: -3px;
	}
	@media (prefers-reduced-motion: reduce) {
		.mobile-fullsheet--draggable {
			transition: none;
		}
	}
</style>
