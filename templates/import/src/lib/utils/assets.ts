import { base } from '$app/paths';
export function assetHref(value: string): string {
	return value.startsWith('/') &&
		!value.startsWith('//') &&
		!/^\/variant-[23](?:\/|$)/.test(value) &&
		!(base && value.startsWith(base + '/'))
		? base + value
		: value;
}
