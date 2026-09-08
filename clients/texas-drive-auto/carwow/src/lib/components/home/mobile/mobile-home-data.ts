import { daynightSite } from '$lib/data/daynight-site';

export type FooterSocialIcon = 'facebook' | 'instagram' | 'mobilebg';

export type FooterSocialLink = {
	label: string;
	title: string;
	icon: FooterSocialIcon;
} & ({ href: '/contact'; external?: false } | { href: string; external: true });

export type BodyChipIcon = 'sedan' | 'suv' | 'wagon' | 'hatchback' | 'coupe' | 'mpv';

export const footerSocialLinks: FooterSocialLink[] = [
	{
		label: 'Facebook',
		href: 'https://www.facebook.com/61566304063141/',
		title: 'Facebook',
		icon: 'facebook',
		external: true
	},
	{
		label: 'Instagram',
		href: 'https://www.instagram.com/daynight.auto.plovdiv/',
		title: 'Instagram',
		icon: 'instagram',
		external: true
	},
	{
		label: 'Mobile.bg',
		href: daynightSite.sourceInventory,
		title: 'View available vehicles on mobile.bg',
		icon: 'mobilebg',
		external: true
	}
];

export const brandLogos: Record<string, string> = {
	Audi: '/assets/images/brand/brand-3.png',
	BMW: '/assets/images/brand/brand-1.webp',
	Chevrolet: '/assets/images/brand/mobile/chevrolet.svg',
	Chrysler: '/assets/images/brand/mobile/chrysler.svg',
	Citroen: '/assets/images/brand/oem/citroen.svg',
	Ford: '/assets/images/brand/mobile/ford.svg',
	Honda: '/assets/images/brand/mobile/honda.svg',
	Hyundai: '/assets/images/brand/brand-8.png',
	Jaguar: '/assets/images/brand/mobile/jaguar.svg',
	Kia: '/assets/images/brand/brand-9.png',
	'Land Rover': '/assets/images/brand/oem/land-rover.svg',
	Mazda: '/assets/images/brand/brand-10.png',
	'Mercedes-Benz': '/assets/images/brand/brand-2.webp',
	Opel: '/assets/images/brand/oem/opel.svg',
	Peugeot: '/assets/images/brand/mobile/peugeot.svg',
	Porsche: '/assets/images/brand/oem/porsche.webp',
	Skoda: '/assets/images/brand/mobile/skoda.svg',
	Toyota: '/assets/images/brand/brand-5.webp',
	Tesla: '/assets/images/brand/brand-12.png',
	Volvo: '/assets/images/brand/mobile/volvo.svg',
	VW: '/assets/images/brand/mobile/volkswagen.svg'
};

const brandFallbackMarks: Record<string, string> = {
	Chevrolet: 'CHE',
	Chrysler: 'CHR',
	Genesis: 'GEN',
	Mustang: 'MUS',
	Opel: 'OP',
	Porsche: 'POR',
	Skoda: 'SK',
	VW: 'VW'
};

const bodyTypeArt = {
	suv: '/assets/images/body-type/normalized/body-suv-transparent.webp',
	hatch: '/assets/images/body-type/normalized/body-hatchback-transparent.webp',
	wagon: '/assets/images/body-type/normalized/body-wagon-transparent.webp',
	sedan: '/assets/images/body-type/normalized/body-sedan-transparent.webp',
	coupe: '/assets/images/body-type/normalized/body-coupe-transparent.webp',
	mpv: '/assets/images/body-type/normalized/body-mpv-transparent.webp'
} as const;

export const brandMark = (brand: string) =>
	brandFallbackMarks[brand] ??
	brand
		.split(/[\s-]+/)
		.map((part) => part[0])
		.join('')
		.slice(0, 3)
		.toUpperCase();

export const bodyPhoto = (body: string) => {
	const normalized = body.toLocaleLowerCase('en-US');
	if (body === 'SUV') return bodyTypeArt.suv;
	if (normalized.includes('hatchback')) return bodyTypeArt.hatch;
	if (normalized.includes('wagon')) return bodyTypeArt.wagon;
	if (normalized.includes('sedan') || normalized.includes('limousine')) return bodyTypeArt.sedan;
	if (normalized.includes('coupe')) return bodyTypeArt.coupe;
	if (normalized.includes('minivan') || normalized.includes('van')) return bodyTypeArt.mpv;
	return bodyTypeArt.suv;
};

export const bodyChipIconFor = (body: string): BodyChipIcon => {
	const normalized = body.toLocaleLowerCase('en-US');
	if (body === 'SUV') return 'wagon';
	if (normalized.includes('hatchback')) return 'hatchback';
	if (normalized.includes('wagon')) return 'suv';
	if (normalized.includes('coupe')) return 'coupe';
	if (normalized.includes('minivan') || normalized.includes('van')) return 'mpv';
	if (normalized.includes('sedan') || normalized.includes('limousine')) return 'sedan';
	return 'suv';
};

export const bodyLabel = (body: string) => (body === 'SUV' ? 'SUV' : body);
