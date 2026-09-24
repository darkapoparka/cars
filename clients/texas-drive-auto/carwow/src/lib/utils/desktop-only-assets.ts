import { base } from '$app/paths';
const asset = (value: string) =>
	base && value.startsWith('/') && !value.startsWith(base + '/') ? base + value : value;
export const desktopOnlyImagePlaceholder = asset('/assets/images/placeholder/transparent-1x1.svg');

export function desktopOnlySrcset(src: string, width: number) {
	return `${desktopOnlyImagePlaceholder} 4w, ${asset(src)} ${width}w`;
}

export function desktopOnlySizes(desktopSize: string) {
	return `(min-width: 992px) ${desktopSize}, 1px`;
}

export function desktopOnlyImageAttrs(src: string, width: number, desktopSize: string) {
	return `src="${desktopOnlyImagePlaceholder}" srcset="${desktopOnlySrcset(src, width)}" sizes="${desktopOnlySizes(desktopSize)}"`;
}
