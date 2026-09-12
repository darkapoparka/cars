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
		title: 'Виж наличните автомобили в mobile.bg',
		icon: 'mobilebg',
		external: true
	}
];

export const brandLogos: Record<string, string> = {
	Audi: '/variant-3/assets/images/brand/brand-3.png',
	BMW: '/variant-3/assets/images/brand/brand-1.webp',
	Chevrolet: '/variant-3/assets/images/brand/mobile/chevrolet.svg',
	Chrysler: '/variant-3/assets/images/brand/mobile/chrysler.svg',
	Citroen: '/variant-3/assets/images/brand/oem/citroen.svg',
	Ford: '/variant-3/assets/images/brand/mobile/ford.svg',
	Honda: '/variant-3/assets/images/brand/mobile/honda.svg',
	Hyundai: '/variant-3/assets/images/brand/brand-8.png',
	Jaguar: '/variant-3/assets/images/brand/mobile/jaguar.svg',
	Kia: '/variant-3/assets/images/brand/brand-9.png',
	'Land Rover': '/variant-3/assets/images/brand/oem/land-rover.svg',
	Mazda: '/variant-3/assets/images/brand/brand-10.png',
	'Mercedes-Benz': '/variant-3/assets/images/brand/brand-2.webp',
	Opel: '/variant-3/assets/images/brand/oem/opel.svg',
	Peugeot: '/variant-3/assets/images/brand/mobile/peugeot.svg',
	Porsche: '/variant-3/assets/images/brand/oem/porsche.webp',
	Skoda: '/variant-3/assets/images/brand/mobile/skoda.svg',
	Toyota: '/variant-3/assets/images/brand/brand-5.webp',
	Tesla: '/variant-3/assets/images/brand/brand-12.png',
	Volvo: '/variant-3/assets/images/brand/mobile/volvo.svg',
	VW: '/variant-3/assets/images/brand/mobile/volkswagen.svg'
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
	suv: '/variant-3/assets/images/body-type/normalized/body-suv-transparent.webp',
	hatch: '/variant-3/assets/images/body-type/normalized/body-hatchback-transparent.webp',
	wagon: '/variant-3/assets/images/body-type/normalized/body-wagon-transparent.webp',
	sedan: '/variant-3/assets/images/body-type/normalized/body-sedan-transparent.webp',
	coupe: '/variant-3/assets/images/body-type/normalized/body-coupe-transparent.webp',
	mpv: '/variant-3/assets/images/body-type/normalized/body-mpv-transparent.webp'
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
	const normalized = body.toLocaleLowerCase('bg-BG');
	if (body === 'SUV') return bodyTypeArt.suv;
	if (normalized.includes('хеч')) return bodyTypeArt.hatch;
	if (normalized.includes('комби')) return bodyTypeArt.wagon;
	if (normalized.includes('седан') || normalized.includes('лимуз')) return bodyTypeArt.sedan;
	if (normalized.includes('куп')) return bodyTypeArt.coupe;
	if (normalized.includes('ван') || normalized.includes('бус')) return bodyTypeArt.mpv;
	return bodyTypeArt.suv;
};

export const bodyChipIconFor = (body: string): BodyChipIcon => {
	const normalized = body.toLocaleLowerCase('bg-BG');
	if (body === 'SUV') return 'wagon';
	if (normalized.includes('хеч')) return 'hatchback';
	if (normalized.includes('комби')) return 'suv';
	if (normalized.includes('куп')) return 'coupe';
	if (normalized.includes('ван') || normalized.includes('бус')) return 'mpv';
	if (normalized.includes('седан') || normalized.includes('лимуз')) return 'sedan';
	return 'suv';
};

export const bodyLabel = (body: string) => (body === 'SUV' ? 'Джип' : body);
