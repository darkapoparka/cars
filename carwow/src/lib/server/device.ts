// Server-side device guess from the request User-Agent. Used by the home load
// to SSR only the layout a device needs (mobile phones get the mobile home; no
// desktop markup/CSS shipped, and vice-versa). The client re-checks the real
// viewport with matchMedia after mount, so a wrong guess self-corrects.
const mobileUserAgentPattern =
	/\b(Android|BlackBerry|IEMobile|iPhone|iPod|Mobile|Opera Mini|webOS)\b/i;

export function isMobileUserAgent(userAgent: string | null): boolean {
	return mobileUserAgentPattern.test(userAgent ?? '');
}
