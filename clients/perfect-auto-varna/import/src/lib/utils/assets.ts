import { base } from '$app/paths';

/** Inactive picture sources retain dimensions without downloading desktop artwork. */
export const emptyImage = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

export function assetHref(value: string): string {
	return value.startsWith('/') &&
		!value.startsWith('//') &&
		!/^\/variant-[23](?:\/|$)/.test(value) &&
		!(base && value.startsWith(base + '/'))
		? base + value
		: value;
}
