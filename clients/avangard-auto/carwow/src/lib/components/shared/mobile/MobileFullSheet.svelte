<script lang="ts">
	import { tick } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { cubicOut } from 'svelte/easing';

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
		onClose,
		children
	}: {
		open?: boolean;
		labelledBy?: string;
		onClose?: () => void;
		children?: Snippet;
	} = $props();

	const fullSheetPanel: Attachment<HTMLElement> = (node) => {
		document.body.appendChild(node);

		const vv = window.visualViewport;
		const applyViewportSize = () => {
			if (!vv) return;
			node.style.setProperty('--sa-ov-h', `${Math.round(vv.height)}px`);
			node.style.setProperty('--sa-ov-top', `${Math.round(vv.offsetTop)}px`);
		};
		applyViewportSize();
		vv?.addEventListener('resize', applyViewportSize);
		vv?.addEventListener('scroll', applyViewportSize);

		const { body } = document;
		const previousOverflow = body.style.overflow;
		body.style.overflow = 'hidden';

		let raf = 0;
		void tick().then(() => {
			raf = requestAnimationFrame(() => node.focus({ preventScroll: true }));
		});

		return () => {
			vv?.removeEventListener('resize', applyViewportSize);
			vv?.removeEventListener('scroll', applyViewportSize);
			body.style.overflow = previousOverflow;
			cancelAnimationFrame(raf);
			node.remove();
		};
	};

	function closeSheet() {
		if (!open) return;
		open = false;
		onClose?.();
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') closeSheet();
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if open}
	<div
		class="mobile-fullsheet"
		{@attach fullSheetPanel}
		role="dialog"
		aria-modal="true"
		aria-labelledby={labelledBy}
		tabindex={-1}
		transition:slideSheet
	>
		{@render children?.()}
	</div>
{/if}

<style>
	.mobile-fullsheet {
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
</style>
