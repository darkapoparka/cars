let lockCount = 0;
let previousBodyOverflow = '';
let previousBodyPaddingRight = '';
let previousBodyCompensation = '';
let previousHtmlCompensation = '';
let previousHtmlScrollbarGutter = '';
let hadBodyLockClass = false;
let hadHtmlLockClass = false;

const LOCK_CLASS = 'daynight-scroll-locked';
const COMPENSATION_VAR = '--daynight-scrollbar-compensation';

function layoutWidth() {
	return (
		document.body.getBoundingClientRect().width ||
		document.body.clientWidth ||
		document.documentElement.clientWidth ||
		window.innerWidth
	);
}

function roundedPixelDelta(before: number, after: number) {
	return Math.max(0, Math.round((after - before) * 100) / 100);
}

function restoreCustomProperty(element: HTMLElement, name: string, value: string) {
	if (value) {
		element.style.setProperty(name, value);
		return;
	}

	element.style.removeProperty(name);
}

export function lockBodyScroll() {
	if (typeof window === 'undefined') return;

	lockCount += 1;
	if (lockCount > 1) return;

	const body = document.body;
	const html = document.documentElement;
	const widthBeforeLock = layoutWidth();

	previousBodyOverflow = body.style.overflow;
	previousBodyPaddingRight = body.style.paddingRight;
	previousBodyCompensation = body.style.getPropertyValue(COMPENSATION_VAR);
	previousHtmlCompensation = html.style.getPropertyValue(COMPENSATION_VAR);
	previousHtmlScrollbarGutter = html.style.scrollbarGutter;
	hadBodyLockClass = body.classList.contains(LOCK_CLASS);
	hadHtmlLockClass = html.classList.contains(LOCK_CLASS);

	html.style.scrollbarGutter = 'stable';
	body.style.overflow = 'hidden';

	const compensation = roundedPixelDelta(widthBeforeLock, layoutWidth());
	body.style.setProperty(COMPENSATION_VAR, `${compensation}px`);
	html.style.setProperty(COMPENSATION_VAR, `${compensation}px`);
	body.classList.add(LOCK_CLASS);
	html.classList.add(LOCK_CLASS);

	if (compensation > 0) {
		const currentPadding = window.getComputedStyle(body).paddingRight;
		body.style.paddingRight = `calc(${currentPadding} + var(${COMPENSATION_VAR}))`;
	}
}

export function unlockBodyScroll() {
	if (typeof window === 'undefined' || lockCount === 0) return;

	lockCount -= 1;
	if (lockCount > 0) return;

	const body = document.body;
	const html = document.documentElement;

	body.style.overflow = previousBodyOverflow;
	body.style.paddingRight = previousBodyPaddingRight;
	html.style.scrollbarGutter = previousHtmlScrollbarGutter;
	restoreCustomProperty(body, COMPENSATION_VAR, previousBodyCompensation);
	restoreCustomProperty(html, COMPENSATION_VAR, previousHtmlCompensation);

	if (!hadBodyLockClass) {
		body.classList.remove(LOCK_CLASS);
	}
	if (!hadHtmlLockClass) {
		html.classList.remove(LOCK_CLASS);
	}

	previousBodyOverflow = '';
	previousBodyPaddingRight = '';
	previousBodyCompensation = '';
	previousHtmlCompensation = '';
	previousHtmlScrollbarGutter = '';
	hadBodyLockClass = false;
	hadHtmlLockClass = false;
}
