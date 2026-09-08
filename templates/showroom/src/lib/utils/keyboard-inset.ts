import type { Attachment } from 'svelte/attachments';

/**
 * Writes the on-screen keyboard height into `--bc-kb-inset` on `target`.
 *
 * On Android Chrome the viewport meta `interactive-widget=resizes-content` already
 * shrinks the layout viewport, so `innerHeight` and `visualViewport.height` track
 * together and the computed inset stays ~0 — the browser does the lifting. iOS Safari
 * ignores that meta: there the visual viewport shrinks while the layout viewport (and
 * `position: fixed` anchoring) does not, so the inset equals the keyboard height and
 * bottom sheets must be lifted via `bottom: var(--bc-kb-inset, 0px)`.
 *
 * Returns a cleanup that detaches the listeners and clears the property. Pass
 * `document.documentElement` (the default) when the consumer is portaled out of the
 * component tree (e.g. a vaul drawer) so the variable still cascades to it.
 */
export function trackKeyboardInset(
	target: HTMLElement = document.documentElement
): () => void {
	const viewport = window.visualViewport;
	if (!viewport) return () => {};

	const update = () => {
		const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
		target.style.setProperty('--bc-kb-inset', `${Math.round(inset)}px`);
	};

	update();
	viewport.addEventListener('resize', update);
	viewport.addEventListener('scroll', update);

	return () => {
		viewport.removeEventListener('resize', update);
		viewport.removeEventListener('scroll', update);
		target.style.removeProperty('--bc-kb-inset');
	};
}

/**
 * Attachment form of {@link trackKeyboardInset} — exposes the keyboard height as
 * `--bc-kb-inset` on the attached element. Use for hand-rolled sheets that live in
 * the normal component tree; for portaled drawers drive the document root instead.
 */
export const keyboardInset: Attachment<HTMLElement> = (node) => trackKeyboardInset(node);
