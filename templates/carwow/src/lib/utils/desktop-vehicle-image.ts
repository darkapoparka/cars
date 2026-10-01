import { desktopVehicleImages } from '$lib/data/desktop-vehicle-images';
import { desktopOnlyImagePlaceholder } from '$lib/utils/desktop-only-assets';

/** Desktop alone opts into full-size photographs; custom inventory keeps its own source. */
export function desktopVehicleImage(src: string, width: 320 | 640 | 1280 = 640) {
	return (
		desktopVehicleImages[src]?.[width] ?? {
			src,
			width: src.startsWith('/assets/daynight/inventory-current/') ? 280 : undefined,
			height: src.startsWith('/assets/daynight/inventory-current/') ? 210 : undefined
		}
	);
}

/** Let ordinary screens choose card-sized photos while dense screens retain detail. */
export function desktopVehicleImageSrcset(
	src: string,
	asset: (path: string) => string,
	includePlaceholder = true
) {
	const variants = desktopVehicleImages[src];
	const original = desktopVehicleImage(src);
	const images = variants ? [variants[320], variants[640]] : original.width ? [original] : [];
	if (!images.length) return undefined;
	const photos = images.map((image) => `${asset(image.src)} ${image.width}w`).join(', ');
	return includePlaceholder ? `${asset(desktopOnlyImagePlaceholder)} 4w, ${photos}` : photos;
}
