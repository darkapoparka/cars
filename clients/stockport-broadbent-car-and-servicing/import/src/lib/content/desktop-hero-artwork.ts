// Decorative Auto Best side profiles. Alpha bounds exclude transparent canvas padding.
export const desktopHeroArtwork = [
	{
		side: 'left',
		src: '/assets/daynight/banners/hero-car-left-profile-v1.webp',
		width: 1000,
		height: 667,
		bounds: [7, 112, 995, 542],
		mirrored: true
	},
	{
		side: 'right',
		src: '/assets/daynight/banners/hero-car-right-profile-v1.webp',
		width: 1000,
		height: 667,
		bounds: [18, 156, 983, 495],
		mirrored: false
	}
] as const;
