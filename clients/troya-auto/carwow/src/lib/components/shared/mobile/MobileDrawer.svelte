<script lang="ts">
	import { tick } from 'svelte';
	import type { Snippet } from 'svelte';
	import { Drawer } from 'vaul-svelte';

	let {
		open = $bindable(false),
		labelledBy,
		children
	}: {
		open?: boolean;
		labelledBy?: string;
		children?: Snippet;
	} = $props();

	let drawerRef = $state<HTMLElement | null>(null);
	let dragStartY: number | null = null;
	let dragDelta = 0;
	// Tracks whether the most recent input was the keyboard. vaul auto-focuses the
	// first control (the ✕) when a sheet opens; that should only paint a focus ring
	// for genuine keyboard users, not when the sheet was opened by tap.
	let keyboardModality = $state(false);

	function currentDrawer() {
		if (drawerRef?.dataset.state === 'open') {
			return drawerRef;
		}

		return document.querySelector<HTMLElement>('.mobile-drawer[data-state="open"]');
	}

	function focusDrawer() {
		const drawer = currentDrawer();
		if (!open || !drawer) return;
		// Move focus to the sheet CONTAINER only — never a child input/control.
		// Focusing a field on open was what popped the keyboard the instant the
		// sheet appeared (the "autofocus" jank). The container carries
		// aria-labelledby + tabindex=-1, so screen readers still announce the
		// dialog and keyboard users can tab into the first control themselves.
		const activeElement = document.activeElement;
		if (activeElement instanceof HTMLElement && drawer.contains(activeElement)) return;
		drawer.focus({ preventScroll: true });
	}

	function startHandleDrag(event: PointerEvent) {
		if (event.pointerType === 'mouse' && event.button !== 0) return;

		dragStartY = event.clientY;
		dragDelta = 0;
		(event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId);
	}

	function moveHandleDrag(event: PointerEvent) {
		if (dragStartY === null || !drawerRef) return;

		dragDelta = Math.max(0, event.clientY - dragStartY);
		drawerRef.style.setProperty('--mobile-drawer-pull', `${Math.min(dragDelta, 170)}px`);
	}

	function endHandleDrag(event: PointerEvent) {
		if (dragStartY === null || !drawerRef) return;

		const shouldClose = dragDelta > 88;
		dragStartY = null;
		dragDelta = 0;
		(event.currentTarget as HTMLElement | null)?.releasePointerCapture?.(event.pointerId);
		drawerRef.style.setProperty('--mobile-drawer-pull', '0px');

		if (shouldClose) {
			open = false;
		}
	}

	$effect(() => {
		if (!open) return;

		let raf = 0;
		const focusAfterRender = async () => {
			await tick();
			raf = requestAnimationFrame(focusDrawer);
		};

		focusAfterRender();

		return () => cancelAnimationFrame(raf);
	});

	// Single keyboard strategy for both platforms (replaces the old stack of
	// vaul repositionInputs + viewport clamp that double-lifted the sheet and
	// left a gap above the keyboard).
	//
	//   --sa-vvh     = visual-viewport height → clamps the sheet so its content
	//                  and sticky CTA never hide behind the keyboard.
	//   --sa-kb-inset = space the keyboard occupies at the bottom. On Android
	//                  (interactive-widget=resizes-content already shrank the
	//                  layout viewport) this resolves to ~0 and the fixed bottom:0
	//                  sheet is already above the keyboard. On iOS (no viewport
	//                  resize) it equals the keyboard height and lifts the sheet by
	//                  exactly that — one lift, never two, so no gap.
	$effect(() => {
		if (!open) return;
		const vv = window.visualViewport;
		if (!vv) return;

		const apply = () => {
			const drawer = drawerRef;
			if (!drawer) return;
			const inset = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
			drawer.style.setProperty('--sa-vvh', `${Math.round(vv.height)}px`);
			drawer.style.setProperty('--sa-kb-inset', `${inset}px`);
			const active = document.activeElement;
			if (
				active instanceof HTMLElement &&
				drawer.contains(active) &&
				/^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName)
			) {
				requestAnimationFrame(() => active.scrollIntoView({ block: 'center' }));
			}
		};

		apply();
		vv.addEventListener('resize', apply);
		vv.addEventListener('scroll', apply);
		return () => {
			vv.removeEventListener('resize', apply);
			vv.removeEventListener('scroll', apply);
			drawerRef?.style.removeProperty('--sa-vvh');
			drawerRef?.style.removeProperty('--sa-kb-inset');
		};
	});
</script>

<svelte:window
	onpointerdown={() => (keyboardModality = false)}
	onkeydown={() => (keyboardModality = true)}
/>

<Drawer.Root
	bind:open
	direction="bottom"
	closeThreshold={0.28}
	fixed
	repositionInputs={false}
	autoFocus={false}
	shouldScaleBackground={false}
	scrollLockTimeout={260}
>
	<Drawer.Portal>
		<Drawer.Overlay class="mobile-drawer__overlay" />
		<Drawer.Content
			bind:ref={drawerRef}
			class="mobile-drawer"
			data-modality={keyboardModality ? 'keyboard' : 'pointer'}
			aria-labelledby={labelledBy}
			tabindex={-1}
		>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="mobile-drawer__handle-zone"
				onpointerdown={startHandleDrag}
				onpointermove={moveHandleDrag}
				onpointerup={endHandleDrag}
				onpointercancel={endHandleDrag}
			>
				<Drawer.Handle class="mobile-drawer__handle" preventCycle />
			</div>
			{@render children?.()}
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>

<style>
	:global(.mobile-drawer__overlay) {
		position: fixed;
		z-index: 72;
		inset: 0;
		background: rgba(15, 23, 42, 0.45);
	}

	:global(.mobile-drawer) {
		--mobile-drawer-resting-offset: 100%;

		position: fixed;
		z-index: 73;
		right: 0;
		bottom: var(--sa-kb-inset, 0px);
		left: 0;
		max-height: min(84svh, 660px, calc(var(--sa-vvh, 100dvh) - 16px));
		overflow-y: auto;
		border-radius: var(--sa-r-xl) var(--sa-r-xl) 0 0;
		background: #fff;
		padding: 8px var(--sa-mobile-gutter) calc(14px + env(safe-area-inset-bottom));
		color: var(--sa-ink);
		font-family: var(--sa-font);
		-webkit-font-smoothing: antialiased;
		box-shadow: 0 -24px 64px rgba(15, 23, 42, 0.24);
		overscroll-behavior: contain;
		outline: none;
		animation: none !important;
		transform: translate3d(0, var(--mobile-drawer-resting-offset), 0);
		transition: transform 220ms cubic-bezier(0.32, 0.72, 0, 1);
	}

	:global(.mobile-drawer[data-state='open']) {
		--mobile-drawer-resting-offset: var(--mobile-drawer-pull, 0px);
	}

	:global(.mobile-drawer[data-state='closed']) {
		--mobile-drawer-resting-offset: 100%;
	}

	/* The sheet container can receive focus as a fallback (it carries
	 * aria-labelledby). Suppress the global focus ring on the container itself —
	 * it is not an actionable control, and a ring around the whole sheet looks
	 * wrong — while keeping the ring on child buttons/links for keyboard nav. */
	:global(.mobile-drawer:focus-visible),
	:global(.mobile-drawer:focus) {
		outline: none !important;
		box-shadow: 0 -24px 64px rgba(15, 23, 42, 0.24) !important;
	}

	/* Pointer-opened sheets auto-focus the close button; that should not paint a
	 * focus ring (it read like an error). Suppress the ring while the last input
	 * was a pointer — it returns the instant the user navigates by keyboard,
	 * restoring the :focus-visible behaviour the programmatic open-focus defeats. */
	:global(.mobile-drawer[data-modality='pointer'] :focus-visible) {
		outline: none !important;
		box-shadow: none !important;
	}

	:global(.mobile-drawer input),
	:global(.mobile-drawer textarea),
	:global(.mobile-drawer select) {
		font-size: var(--sa-text-base) !important;
	}

	.mobile-drawer__handle-zone {
		display: grid;
		min-height: 18px;
		place-items: start center;
		touch-action: none;
	}

	:global(.mobile-drawer__handle) {
		width: var(--sa-mobile-drawer-handle-w);
		height: 5px;
		margin: 0 auto 13px;
		border-radius: 999px;
		background: #cfd7df;
		touch-action: none;
	}

	@media (max-width: 370px) {
		:global(.mobile-drawer) {
			padding-right: var(--sa-mobile-gap-md);
			padding-left: var(--sa-mobile-gap-md);
		}
	}
</style>
