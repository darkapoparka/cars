/** Native dialogs make the background inert, but Tab may still reach browser chrome. */
export function modalTabStops(root: HTMLElement): HTMLElement[] {
	return [
		...root.querySelectorAll<HTMLElement>(
			'a[href], area[href], button, input, select, textarea, summary, [tabindex], [contenteditable="true"]'
		)
	]
		.filter(
			(element) =>
				element.tabIndex >= 0 &&
				!element.matches(':disabled') &&
				!element.closest('[inert]') &&
				element.getClientRects().length > 0 &&
				getComputedStyle(element).visibility !== 'hidden'
		)
		.sort(
			(left, right) =>
				(left.tabIndex > 0 ? left.tabIndex : Infinity) -
				(right.tabIndex > 0 ? right.tabIndex : Infinity)
		);
}

export function trapModalTab(event: KeyboardEvent, root: HTMLElement): void {
	if (event.key !== 'Tab' || event.defaultPrevented) return;
	const stops = modalTabStops(root);
	const first = stops[0];
	const last = stops[stops.length - 1];
	const active = document.activeElement;
	if (!first || !last) {
		event.preventDefault();
		root.focus({ preventScroll: true });
		return;
	}
	if (event.shiftKey && (active === first || active === root || !root.contains(active))) {
		event.preventDefault();
		last.focus({ preventScroll: true });
	} else if (!event.shiftKey && (active === last || active === root || !root.contains(active))) {
		event.preventDefault();
		first.focus({ preventScroll: true });
	}
}
