/** Sized mobile artwork. Original files remain available to desktop compositions. */
export const mobileImageVariants = [
	{
		source: '/variant-3/assets/images/brand/brand-2.webp',
		output: '/variant-3/assets/images/brand/brand-2-mobile.webp',
		width: 192,
		quality: 82
	},
	{
		source: '/variant-3/assets/images/brand/oem/porsche.webp',
		output: '/variant-3/assets/images/brand/oem/porsche-mobile.webp',
		width: 192,
		quality: 82
	},
	{
		source: '/variant-3/assets/images/brand/brand-5.webp',
		output: '/variant-3/assets/images/brand/brand-5-mobile.webp',
		width: 192,
		quality: 82
	},
	{
		source: '/variant-3/assets/images/body-type/normalized/body-suv-transparent.webp',
		output: '/variant-3/assets/images/body-type/normalized/body-suv-transparent-mobile.webp',
		width: 480,
		quality: 82
	},
	{
		source: '/variant-3/assets/images/body-type/normalized/body-hatchback-transparent.webp',
		output: '/variant-3/assets/images/body-type/normalized/body-hatchback-transparent-mobile.webp',
		width: 480,
		quality: 82
	},
	{
		source: '/variant-3/assets/images/body-type/normalized/body-wagon-transparent.webp',
		output: '/variant-3/assets/images/body-type/normalized/body-wagon-transparent-mobile.webp',
		width: 480,
		quality: 82
	},
	{
		source: '/variant-3/assets/images/body-type/normalized/body-sedan-transparent.webp',
		output: '/variant-3/assets/images/body-type/normalized/body-sedan-transparent-mobile.webp',
		width: 480,
		quality: 82
	},
	{
		source: '/variant-3/assets/images/body-type/normalized/body-coupe-transparent.webp',
		output: '/variant-3/assets/images/body-type/normalized/body-coupe-transparent-mobile.webp',
		width: 480,
		quality: 82
	},
	{
		source: '/variant-3/assets/images/body-type/normalized/body-mpv-transparent.webp',
		output: '/variant-3/assets/images/body-type/normalized/body-mpv-transparent-mobile.webp',
		width: 480,
		quality: 82
	},
	{
		source: '/variant-3/assets/images/home-videos/urus.jpg',
		output: '/variant-3/assets/images/home-videos/urus-mobile.webp',
		width: 640,
		quality: 76
	},
	{
		source: '/variant-3/assets/images/home-videos/panamera.jpg',
		output: '/variant-3/assets/images/home-videos/panamera-mobile.webp',
		width: 640,
		quality: 76
	},
	{
		source: '/variant-3/assets/images/home-videos/g-class.jpg',
		output: '/variant-3/assets/images/home-videos/g-class-mobile.webp',
		width: 640,
		quality: 76
	},
	{
		source: '/variant-3/assets/images/home-promos/sell-studio-v1.webp',
		output: '/variant-3/assets/images/home-promos/sell-studio-v1-mobile.webp',
		width: 480,
		quality: 82
	},
	{
		source: '/variant-3/assets/images/import/import-delivery-handoff-banner-v1.webp',
		output: '/variant-3/assets/images/import/import-delivery-handoff-banner-v1-mobile.webp',
		width: 480,
		quality: 82
	},
	{
		source: '/variant-3/assets/images/budget/open-budget-supercar-v2.webp',
		output: '/variant-3/assets/images/budget/open-budget-supercar-v2-mobile.webp',
		width: 480,
		quality: 82
	}
] as const;

const variants = new Map<string, string>(
	mobileImageVariants.map((item) => [item.source, item.output])
);
export function mobileImageSrc(source: string): string {
	if (!source.startsWith('/')) return source;
	const assetIndex = source.indexOf('/variant-3/assets/');
	if (assetIndex < 0) return source;
	const asset = source.slice(assetIndex);
	return source.slice(0, assetIndex) + (variants.get(asset) ?? asset);
}
