import { MediaQuery } from 'svelte/reactivity';
import { innerWidth } from 'svelte/reactivity/window';

export const MOBILE_SHELL_MAX_WIDTH = 991;
const DEFAULT_MOBILE_BREAKPOINT = MOBILE_SHELL_MAX_WIDTH + 1;
export const PHONE_VIEWPORT_MAX_WIDTH = MOBILE_SHELL_MAX_WIDTH;

export class IsMobile extends MediaQuery {
	constructor(breakpoint: number = DEFAULT_MOBILE_BREAKPOINT) {
		super(`max-width: ${breakpoint - 1}px`);
	}
}

export function isPhoneViewport(maxWidth = MOBILE_SHELL_MAX_WIDTH) {
	return innerWidth.current !== undefined && innerWidth.current <= maxWidth;
}

export function isPhoneOrServerViewport(maxWidth = MOBILE_SHELL_MAX_WIDTH) {
	return innerWidth.current === undefined || innerWidth.current <= maxWidth;
}

export function isDesktopOrServerViewport(maxWidth = MOBILE_SHELL_MAX_WIDTH) {
	return innerWidth.current === undefined || innerWidth.current > maxWidth;
}
