import { eliqautoAssets, eliqautoBrand, eliqautoContact, mainNavigation } from '$lib/data/eliqauto';
import type { BlogPost } from '$lib/data/blog';
import { vehicles as inventoryVehicles } from '$lib/data/vehicles';
import type { Vehicle } from '$lib/data/vehicles';
import { inventoryCardDisplayTitle } from '$lib/auxero/inventory';
import {
	bgVehicleCountNoun,
	getMessages,
	localizeVehicleTermsInText,
	translateVehicleTerm,
	type Locale,
	type PublicMessages
} from '$lib/i18n/messages';

export type HomeFiveBrandCard = {
	allTile?: boolean;
	count: string;
	href?: string;
	image: string;
	name: string;
	query: string;
};

export type HomeFiveReview = {
	avatar: string;
	name: string;
	role: string;
	text: string;
};

export type HomeFiveNewsPost = {
	category: string;
	date: string;
	image: string;
	slug: string;
	title: string;
};

export type HomeFiveFooterLink = {
	href: string;
	label: string;
};

export type HomeFiveFooterSocial = {
	href: string;
	icon: 'facebook' | 'x' | 'instagram' | 'youtube' | 'viber';
	label: string;
};

export type HomeFiveFooterData = {
	buyingLinks: HomeFiveFooterLink[];
	contact: {
		address: string;
		phoneHref: string;
		phoneLabel: string;
	};
	copyright: string;
	hours: string[];
	labels: {
		buyingSelling: string;
		emailPlaceholder: string;
		openingHours: string;
		quickLinks: string;
		subscribe: string;
	};
	legalLinks: HomeFiveFooterLink[];
	logo: {
		alt: string;
		href: string;
		src: string;
	};
	quickLinks: HomeFiveFooterLink[];
	socialLinks: HomeFiveFooterSocial[];
};

export type HomeFiveHeaderSocial = {
	href: string;
	icon: 'chat' | 'facebook' | 'instagram' | 'telegram' | 'x' | 'youtube';
	label: string;
	target?: '_blank';
};

export type HomeFiveHeaderMegaMenuLink = {
	href: string;
	label: string;
};

export type HomeFiveHeaderMegaMenuSection = {
	links: HomeFiveHeaderMegaMenuLink[];
	title: string;
};

export type HomeFiveHeaderMegaMenuVehicle = {
	href: string;
	image: string;
	label: string;
	meta: string;
};

export type HomeFiveHeaderMegaMenuFooter = {
	copy: string;
	ctaHref: string;
	ctaLabel: string;
	title: string;
};

export type HomeFiveHeaderContainerMenu = {
	links: HomeFiveHeaderMegaMenuLink[];
	variant: 'container';
};

export type HomeFiveHeaderInventoryMegaMenu = {
	footer: HomeFiveHeaderMegaMenuFooter;
	sections: HomeFiveHeaderMegaMenuSection[];
	variant: 'inventory';
	vehicles: HomeFiveHeaderMegaMenuVehicle[];
};

export type HomeFiveHeaderMegaMenu = HomeFiveHeaderContainerMenu | HomeFiveHeaderInventoryMegaMenu;

export type HomeFiveHeaderNavigationItem = {
	active: boolean;
	href: string;
	label: string;
	megaMenu?: HomeFiveHeaderMegaMenu;
};

export type HomeFiveHeaderData = {
	actionBadges: {
		compare: number;
		wishlist: number;
	};
	contact: {
		addressDetail: string;
		addressHref: string;
		addressLabel: string;
		emailHref: string;
		emailLabel: string;
		mapHref: string;
		phoneHref: string;
		phoneLabel: string;
	};
	language: {
		current: string;
		options: string[];
	};
	ui: {
		addListing: string;
		compare: string;
		megaDetails: string;
		megaView: string;
		searchPlaceholder: string;
		signIn: string;
		wishlist: string;
	};
	logo: {
		alt: string;
		href: string;
		mobileSrc: string;
		src: string;
	};
	navigation: HomeFiveHeaderNavigationItem[];
	socialLinks: HomeFiveHeaderSocial[];
};

export type HomeFiveModalVehicle = {
	engine: string;
	exterior: string;
	fuel: string;
	image: string;
	interior: string;
	location: string;
	mileageLabel: string;
	slug: string;
	stockNumber: string;
	title: string;
	transmission: string;
	vin: string;
	year: number;
};

export type HomeFiveModalsData = {
	cardCompare: {
		left: HomeFiveModalVehicle;
		right: HomeFiveModalVehicle;
		rows: Array<{
			icon: string;
			label: string;
			left: string | number;
			right: string | number;
		}>;
	};
	comparePreview: HomeFiveModalVehicle[];
};

export type HomeFiveTypeCard = {
	bodyType: string;
	href: `/inventory${string}` | '/import';
	image: string;
	label: string;
};

export type HomeFiveVehiclePillIcon = 'coupe' | 'crossover' | 'luxury' | 'pickup' | 'sedan' | 'suv';

export type HomeFiveVehiclePill = {
	active: boolean;
	href: `/inventory${string}`;
	icon?: HomeFiveVehiclePillIcon;
	image?: string;
	kind: 'body' | 'brand' | 'spec';
	label: string;
	labels?: Partial<Record<Locale, string>>;
	termGroup?: keyof PublicMessages['vehicleTerms'];
};

export type HomeFiveCompareVehicle = {
	brand: string;
	image: string;
	priceLabel: string;
	slug: string;
	stats: {
		label: string;
		value: string;
	}[];
	title: string;
};

export type HomeFiveComparePair = {
	left: HomeFiveCompareVehicle;
	right: HomeFiveCompareVehicle;
};

export type HomeFiveVehicleCardData = {
	brand: string;
	fuel: string;
	highlightClass: 'bg-primary-2';
	image: string;
	monthlyLabel: string;
	photoCount: number;
	priceEur: number;
	priceLabel: string;
	slug: string;
	title: string;
	transmission: string;
	transmissionIcon: 'auto.svg' | 'manual.svg';
	year: number;
	mileageLabel: string;
};

export type HomeFiveHeroSelectOption = {
	brand?: string;
	countLabel?: string;
	image?: string;
	label: string;
	series?: string;
	shortLabel?: string;
	value: string;
	variant?: string;
};

export type HomeFiveHeroSelect = {
	defaultLabel: string;
	id: string;
	name: string;
	options: HomeFiveHeroSelectOption[];
	title: string;
};

export type HomeFiveHeroTextSlide = {
	ctaHref: '/inventory' | '/services' | '/sell-your-car';
	ctaLabel: string;
	heading: string;
	id: string;
	subtitle: string;
};

export type HomeFiveHeroTab = {
	active: boolean;
	label: string;
};

export type HomeFiveHeroActionMode = 'buy' | 'import' | 'sell';

export type HomeFiveHeroActionTabHref =
	| '/'
	| '/?intent=import'
	| '/?intent=sell'
	| '/?lang=en'
	| '/?lang=en&intent=import'
	| '/?lang=en&intent=sell';

export type HomeFiveHeroAction = {
	actionHref: '/inventory' | '/import' | '/sell-your-car';
	drawerKicker: string;
	drawerTitle: string;
	helper: string;
	inputName: 'q' | 'vehicle' | 'vin';
	label: string;
	mobileHeading: string;
	mode: HomeFiveHeroActionMode;
	placeholder: string;
	secondaryHref: '/inventory' | '/import' | '/sell-your-car';
	secondaryLabel: string;
	submitLabel: string;
	tabHref: HomeFiveHeroActionTabHref;
};

export type HomeFiveHeroData = {
	activeMode: HomeFiveHeroActionMode;
	actions: HomeFiveHeroAction[];
	advancedFilters: HomeFiveHeroSelect[];
	backgroundImages: string[];
	checksTitle: string;
	features: string[];
	heading: string;
	primaryFilters: HomeFiveHeroSelect[];
	searchSubmitPrefix: string;
	searchSubmitSuffix: string;
	tabs: HomeFiveHeroTab[];
	textSlides: HomeFiveHeroTextSlide[];
	totalMatches: number;
	yearLabel: string;
	yearRange: {
		max: number;
		min: number;
	};
};

const brokenHomeImageSlugs = new Set(['21779200396408437']);

// Some listings carry a remote primary photo that does not match the model (e.g. the
// X5 shipped a sedan-looking shot). Use the same curated cutout the PDP and mega-menu
// use so the card thumbnail and the detail hero stay consistent.
const cardImageOverrides: Record<string, string> = {
	'11780176585830804': '/assets/eliqauto/cars/11780176585830804/img-02.webp',
	'21764342419542174': '/assets/eliqauto/megamenu/inventory-bmw-x5-cutout.webp',
	'21778067767337633': '/assets/eliqauto/megamenu/inventory-audi-sq5-cutout.webp',
	'21778068579001193': '/assets/eliqauto/megamenu/inventory-bmw-x4m-cutout-v2.webp'
};

export const imageForHomeFiveVehicle = (vehicle: Vehicle) =>
	cardImageOverrides[vehicle.slug] ??
	(brokenHomeImageSlugs.has(vehicle.slug) ? eliqautoAssets.hero : vehicle.image);

const inventoryMegaMenuVehicles = [
	{
		image: '/assets/eliqauto/cars/11779989521200947/img-01.webp',
		label: 'Audi A5 S Line',
		slug: '11779989521200947'
	},
	{
		image: '/assets/eliqauto/cars/11780007305121982/img-02.webp',
		label: 'BMW 750 Long',
		slug: '11780007305121982'
	},
	{
		image: '/assets/eliqauto/cars/11780175636720970/img-02.webp',
		label: 'S 500 Long',
		slug: '11780175636720970'
	},
	{
		image: '/assets/eliqauto/cars/11780907716855488/img-04.webp',
		label: 'GLS 450',
		slug: '11780907716855488'
	}
] as const satisfies Array<{
	image: string;
	label: string;
	slug: string;
}>;

const inventoryMegaMenuFeaturedVehicles: HomeFiveHeaderMegaMenuVehicle[] =
	inventoryMegaMenuVehicles.map((entry) => {
		const vehicle = inventoryVehicles.find((candidate) => candidate.slug === entry.slug);

		return {
			href: vehicle
				? `/inventory/${encodeURIComponent(vehicle.slug)}`
				: `/inventory?q=${encodeURIComponent(entry.label)}`,
			image: entry.image,
			label: entry.label,
			meta: vehicle ? `${vehicle.priceLabel} · ${vehicle.fuel}` : 'Available now'
		};
	});

const inventoryMegaMenu: HomeFiveHeaderInventoryMegaMenu = {
	variant: 'inventory',
	vehicles: inventoryMegaMenuFeaturedVehicles,
	sections: [
		{
			title: 'Browse Inventory',
			links: [
				{ href: '/inventory', label: 'All Vehicles' },
				{ href: '/inventory?view=4', label: 'Grid View' },
				{ href: '/inventory?view=map', label: 'Map View' },
				{ href: '/compare', label: 'Compare Vehicles' }
			]
		},
		{
			title: 'Shop By Body Type',
			links: [
				{ href: '/inventory?bodyType=SUV', label: 'SUV' },
				{ href: '/inventory?bodyType=Sedan', label: 'Sedan' },
				{ href: '/inventory?bodyType=Coupe', label: 'Coupe' },
				{ href: '/inventory?bodyType=Wagon', label: 'Wagon' }
			]
		},
		{
			title: 'Shop By Fuel Type',
			links: [
				{ href: '/inventory?fuel=Petrol', label: 'Petrol' },
				{ href: '/inventory?fuel=Diesel', label: 'Diesel' },
				{ href: '/inventory?fuel=Hybrid', label: 'Hybrid' },
				{ href: '/inventory?fuel=EV', label: 'EV' }
			]
		},
		{
			title: 'Eliq Auto Support',
			links: [
				{ href: '/services', label: 'Import & Buying Services' },
				{ href: '/calculator', label: 'Import Cost Calculator' },
				{ href: '/sell-your-car', label: 'Sell Your Car' },
				{ href: '/agents', label: 'Meet Our Consultants' }
			]
		}
	],
	footer: {
		copy: 'Filter by body, fuel, price, and mileage before you book a viewing.',
		ctaHref: '/inventory',
		ctaLabel: 'View All Inventory',
		title: `${inventoryVehicles.length} vehicles in the ELIQ Auto stock feed`
	}
};

const servicesMegaMenu: HomeFiveHeaderContainerMenu = {
	variant: 'container',
	links: [
		{ href: '/services', label: 'Services Overview' },
		{ href: '/financing', label: 'Financing' },
		{ href: '/calculator', label: 'Import Calculator' },
		{ href: '/sell-your-car', label: 'Sell Your Car' },
		{ href: '/compare', label: 'Compare Vehicles' },
		{ href: '/contact', label: 'Book A Consultation' }
	]
};

const aboutMegaMenu: HomeFiveHeaderContainerMenu = {
	variant: 'container',
	links: [
		{ href: '/about', label: 'About Us' },
		{ href: '/agents', label: 'Meet Our Consultants' },
		{ href: '/reviews', label: 'Client Reviews' },
		{ href: '/faqs', label: 'Frequently Asked Questions' },
		{ href: '/blog', label: 'Eliq Auto Notes' },
		{ href: '/contact', label: 'Visit The Office' }
	]
};

const inventoryMegaMenuForLocale = (locale: Locale): HomeFiveHeaderInventoryMegaMenu => {
	if (locale === 'en') return inventoryMegaMenu;

	return {
		variant: 'inventory',
		vehicles: inventoryMegaMenuFeaturedVehicles.map((vehicle) => ({
			...vehicle,
			meta: localizeVehicleTermsInText(locale, vehicle.meta)
		})),
		sections: [
			{
				title: locale === 'bg' ? 'Каталог' : 'Browse Inventory',
				links: [
					{ href: '/inventory', label: locale === 'bg' ? 'Всички автомобили' : 'All Vehicles' },
					{ href: '/inventory?view=4', label: locale === 'bg' ? 'Изглед с карти' : 'Grid View' },
					{ href: '/inventory?view=map', label: locale === 'bg' ? 'Карта' : 'Map View' },
					{ href: '/compare', label: locale === 'bg' ? 'Сравни автомобили' : 'Compare Vehicles' }
				]
			},
			{
				title: locale === 'bg' ? 'Каросерия' : 'Shop By Body Type',
				links: [
					{
						href: '/inventory?bodyType=SUV',
						label: translateVehicleTerm(locale, 'bodyTypes', 'SUV')
					},
					{
						href: '/inventory?bodyType=Sedan',
						label: translateVehicleTerm(locale, 'bodyTypes', 'Sedan')
					},
					{
						href: '/inventory?bodyType=Coupe',
						label: translateVehicleTerm(locale, 'bodyTypes', 'Coupe')
					},
					{
						href: '/inventory?bodyType=Wagon',
						label: translateVehicleTerm(locale, 'bodyTypes', 'Wagon')
					}
				]
			},
			{
				title: locale === 'bg' ? 'Гориво' : 'Shop By Fuel Type',
				links: [
					{
						href: '/inventory?fuel=Petrol',
						label: translateVehicleTerm(locale, 'fuels', 'Petrol')
					},
					{
						href: '/inventory?fuel=Diesel',
						label: translateVehicleTerm(locale, 'fuels', 'Diesel')
					},
					{
						href: '/inventory?fuel=Hybrid',
						label: translateVehicleTerm(locale, 'fuels', 'Hybrid')
					},
					{ href: '/inventory?fuel=EV', label: translateVehicleTerm(locale, 'fuels', 'EV') }
				]
			},
			{
				title: locale === 'bg' ? 'Услуги' : 'Eliq Auto Support',
				links: [
					{
						href: '/services',
						label: locale === 'bg' ? 'Внос и покупка' : 'Import & Buying Services'
					},
					{
						href: '/calculator',
						label: locale === 'bg' ? 'Калкулатор за внос' : 'Import Cost Calculator'
					},
					{
						href: '/sell-your-car',
						label: locale === 'bg' ? 'Продай автомобила си' : 'Sell Your Car'
					},
					{
						href: '/agents',
						label: locale === 'bg' ? 'Нашите консултанти' : 'Meet Our Consultants'
					}
				]
			}
		],
		footer: {
			copy:
				locale === 'bg'
					? 'Филтрирай по тип, гориво, цена и пробег преди да запазиш оглед.'
					: 'Filter by body, fuel, price, and mileage before you book a viewing.',
			ctaHref: '/inventory',
			ctaLabel: locale === 'bg' ? 'Виж всички автомобили' : 'View All Inventory',
			title:
				locale === 'bg'
					? `${inventoryVehicles.length} автомобила в наличност`
					: `${inventoryVehicles.length} vehicles in the ELIQ Auto stock feed`
		}
	};
};

const servicesMegaMenuForLocale = (locale: Locale): HomeFiveHeaderContainerMenu => ({
	variant: 'container',
	links:
		locale === 'bg'
			? [
					{ href: '/services', label: 'Услуги' },
					{ href: '/financing', label: 'Финансиране' },
					{ href: '/calculator', label: 'Калкулатор за внос' },
					{ href: '/sell-your-car', label: 'Продай автомобила си' },
					{ href: '/compare', label: 'Сравни автомобили' },
					{ href: '/contact', label: 'Запази консултация' }
				]
			: servicesMegaMenu.links
});

const aboutMegaMenuForLocale = (locale: Locale): HomeFiveHeaderContainerMenu => ({
	variant: 'container',
	links:
		locale === 'bg'
			? [
					{ href: '/about', label: 'За нас' },
					{ href: '/agents', label: 'Нашите консултанти' },
					{ href: '/reviews', label: 'Отзиви от клиенти' },
					{ href: '/faqs', label: 'Често задавани въпроси' },
					{ href: '/blog', label: 'Съвети от Eliq Auto' },
					{ href: '/contact', label: 'Посети офиса' }
				]
			: aboutMegaMenu.links
});

const countBy = (items: string[]) =>
	items.reduce((counts, item) => {
		if (!item) return counts;
		counts.set(item, (counts.get(item) ?? 0) + 1);
		return counts;
	}, new Map<string, number>());

const brandInventoryCounts = countBy(inventoryVehicles.map((vehicle) => vehicle.brand));

// Stocked brands lead with real inventory counts; the rest are honest
// "import on request" cards that route to the import flow instead of an
// empty inventory result.
const homeFiveBrandShowcase = [
	{ image: '/assets/images/brand/brand-1.webp', name: 'BMW', query: 'BMW' },
	{
		image: '/assets/images/brand/brand-2.webp',
		name: 'Mercedes',
		query: 'Mercedes-Benz'
	},
	{ image: '/assets/images/brand/brand-3.webp', name: 'Audi', query: 'Audi' },
	{ image: '/assets/eliqauto/brands/porsche.webp', name: 'Porsche', query: 'Porsche' },
	{ image: '/assets/images/brand/brand-10.webp', name: 'Mazda', query: 'Mazda' },
	{ image: '/assets/images/brand/brand-4.webp', name: 'Honda', query: 'Honda' },
	{ image: '/assets/images/brand/brand-5.webp', name: 'Toyota', query: 'Toyota' },
	{ image: '/assets/images/brand/brand-6.webp', name: 'Volvo', query: 'Volvo' },
	{ image: '/assets/images/brand/brand-7.webp', name: 'Ford', query: 'Ford' },
	{ image: '/assets/images/brand/brand-8.webp', name: 'Hyundai', query: 'Hyundai' },
	{ image: '/assets/images/brand/brand-12.webp', name: 'Tesla', query: 'Tesla' }
] as const;

const showcaseBrandCountLabel = (locale: Locale, count: number) => {
	if (locale === 'bg') return count === 1 ? '1 автомобил' : `${count} автомобила`;

	return count === 1 ? '1 Vehicle' : `${count} Vehicles`;
};

const showcaseBrandCard = (
	locale: Locale,
	brand: (typeof homeFiveBrandShowcase)[number]
): HomeFiveBrandCard => {
	const stockCount = brandInventoryCounts.get(brand.query) ?? 0;

	if (stockCount === 0) {
		return {
			...brand,
			count: locale === 'bg' ? 'Внос по заявка' : 'Import on request',
			href: '/import'
		};
	}

	return { ...brand, count: showcaseBrandCountLabel(locale, stockCount) };
};

// Closing tile: links to the full inventory with the live total, keeping the wall at 12 cards.
const allBrandsCard = (locale: Locale): HomeFiveBrandCard => ({
	allTile: true,
	count: showcaseBrandCountLabel(locale, inventoryVehicles.length),
	href: '/inventory',
	image: '',
	name: locale === 'bg' ? 'Всички марки' : 'All brands',
	query: 'all'
});

export const homeFiveBrandCards: HomeFiveBrandCard[] = [
	...homeFiveBrandShowcase.map((brand) => showcaseBrandCard('en', brand)),
	allBrandsCard('en')
];

export const homeFiveBrandCardsForLocale = (locale: Locale): HomeFiveBrandCard[] => [
	...homeFiveBrandShowcase.map((brand) => showcaseBrandCard(locale, brand)),
	allBrandsCard(locale)
];

const isHeaderNavActive = (activePath: string, href: string) => {
	if (href === '/') return activePath === '/';

	return activePath === href || activePath.startsWith(`${href}/`);
};

export const homeFiveHeaderDataForLocale = (
	locale: Locale,
	activePath = '/'
): HomeFiveHeaderData => {
	const t = getMessages(locale);

	return {
		actionBadges: {
			compare: 0,
			wishlist: 0
		},
		contact: {
			addressDetail: eliqautoContact.addressCopyLabel,
			addressHref: '/contact',
			addressLabel: eliqautoContact.addressLabel,
			emailHref: eliqautoContact.emailHref,
			emailLabel: eliqautoContact.emailLabel,
			mapHref: eliqautoContact.mapHref,
			phoneHref: eliqautoContact.primaryPhoneHref,
			phoneLabel: eliqautoContact.primaryPhoneLabel
		},
		language: {
			current: t.header.languageCurrent,
			options: t.header.languageOptions
		},
		ui: {
			addListing: t.header.addListing,
			compare: t.header.compare,
			megaDetails: t.header.megaDetails,
			megaView: t.header.megaView,
			searchPlaceholder: t.header.searchPlaceholder,
			signIn: t.header.signIn,
			wishlist: t.header.wishlist
		},
		logo: {
			alt: eliqautoBrand.name,
			href: '/',
			mobileSrc: eliqautoAssets.logoLight,
			src: eliqautoAssets.logoLight
		},
		navigation: mainNavigation.map<HomeFiveHeaderNavigationItem>((item) => ({
			...item,
			label: t.nav[item.href as keyof typeof t.nav],
			active: isHeaderNavActive(activePath, item.href),
			megaMenu:
				item.href === '/inventory'
					? inventoryMegaMenuForLocale(locale)
					: item.href === '/services'
						? servicesMegaMenuForLocale(locale)
						: item.href === '/about'
							? aboutMegaMenuForLocale(locale)
							: undefined
		})),
		socialLinks: [
			{ href: eliqautoContact.facebookHref, icon: 'facebook', label: 'Facebook' },
			{ href: eliqautoContact.youtubeHref, icon: 'youtube', label: 'YouTube' },
			{ href: eliqautoContact.viberHref, icon: 'chat', label: 'Viber' },
			{ href: eliqautoContact.emailHref, icon: 'telegram', label: eliqautoContact.emailLabel }
		]
	};
};

export const homeFiveHeaderData: HomeFiveHeaderData = homeFiveHeaderDataForLocale('en');

export const homeFiveReviewItems: HomeFiveReview[] = [
	{
		name: 'Aleksandar Vytev',
		role: 'Клиент на Eliq Auto',
		avatar: '/assets/images/avatar/avatar-1.webp',
		text: 'Екипът ми обясни историята на автомобила, транспорта и стъпките по регистрацията, преди да поема ангажимент. Предаването беше спокойно и прозрачно.'
	},
	{
		name: 'Krasimir Georgiev',
		role: 'Клиент с внос',
		avatar: '/assets/images/avatar/avatar-2.webp',
		text: 'Eliq Auto запазиха разговора практичен: снимки, документи, пробег и разходите, които имат значение преди доставка.'
	},
	{
		name: 'Iliyan Petrov',
		role: 'Продава клиентски автомобил',
		avatar: '/assets/images/avatar/avatar-3.webp',
		text: 'Изпратих данните за колата и получих ясна обратна връзка за цената, документите и най-добрия начин да представя автомобила.'
	}
];

export const homeFiveNewsPostsFromPosts = (posts: BlogPost[]): HomeFiveNewsPost[] =>
	posts.slice(0, 4).map((post) => ({
		category: post.category,
		date: post.date,
		image: post.image,
		slug: post.slug,
		title: post.title.replace(/Eliqauto/g, 'Eliq Auto')
	}));

export const homeFiveFooterData: HomeFiveFooterData = {
	buyingLinks: [
		{ href: '/services', label: 'Services' },
		{ href: '/inventory', label: 'Find a Car' },
		{ href: '/agents', label: 'Find a Consultant' },
		{ href: '/inventory?view=map', label: 'Inventory Map' },
		{ href: '/inventory?status=available', label: 'Verified Listings' },
		{ href: '/calculator', label: 'Import Calculator' },
		{ href: '/reviews', label: 'Client Reviews' }
	],
	contact: {
		address: eliqautoContact.addressLabel,
		phoneHref: eliqautoContact.primaryPhoneHref,
		phoneLabel: eliqautoContact.primaryPhoneLabel
	},
	copyright: `©2026 ${eliqautoBrand.name}. All Rights Reserved.`,
	hours: ['Monday–Saturday: 09:30–19:00', 'Sunday: 10:00–16:00'],
	labels: {
		buyingSelling: 'BUYING & SELLING',
		emailPlaceholder: 'Enter your e-mail',
		openingHours: 'Opening Hours:',
		quickLinks: 'QUICK LINKS',
		subscribe: 'Subscribe'
	},
	legalLinks: [
		{ href: '/terms', label: 'Terms Of Services' },
		{ href: '/terms', label: 'Privacy Policy' },
		{ href: '/terms', label: 'Cookie Policy' }
	],
	logo: {
		alt: eliqautoBrand.name,
		href: '/',
		src: eliqautoAssets.logoDark
	},
	quickLinks: [
		{ href: '/about', label: 'About Us' },
		{ href: '/inventory?view=4', label: 'Buying With Eliq Auto' },
		{ href: '/sell-your-car', label: 'Sell Your Car' },
		{ href: '/services', label: 'Services' },
		{ href: '/faqs', label: 'FAQ' },
		{ href: '/blog', label: 'News' },
		{ href: '/contact', label: 'Contact Eliq Auto' }
	],
	socialLinks: [
		{ href: eliqautoContact.facebookHref, icon: 'facebook', label: 'Facebook' },
		{ href: eliqautoContact.youtubeHref, icon: 'youtube', label: 'YouTube' },
		{ href: eliqautoContact.viberHref, icon: 'viber', label: 'Viber' }
	]
};

export const homeFiveFooterDataForLocale = (locale: Locale): HomeFiveFooterData => {
	if (locale === 'en') return homeFiveFooterData;

	return {
		...homeFiveFooterData,
		buyingLinks: [
			{ href: '/services', label: 'Услуги' },
			{ href: '/inventory', label: 'Намери автомобил' },
			{ href: '/agents', label: 'Намери консултант' },
			{ href: '/inventory?view=map', label: 'Карта на наличните' },
			{ href: '/inventory?status=available', label: 'Проверени обяви' },
			{ href: '/calculator', label: 'Калкулатор за внос' },
			{ href: '/reviews', label: 'Отзиви от клиенти' }
		],
		copyright: `©2026 ${eliqautoBrand.name}. Всички права запазени.`,
		hours: eliqautoContact.hours,
		labels: {
			buyingSelling: 'ПОКУПКА И ПРОДАЖБА',
			emailPlaceholder: 'Въведете имейл',
			openingHours: 'Работно време:',
			quickLinks: 'БЪРЗИ ВРЪЗКИ',
			subscribe: 'Абонирай се'
		},
		legalLinks: [
			{ href: '/terms', label: 'Общи условия' },
			{ href: '/terms', label: 'Поверителност' },
			{ href: '/terms', label: 'Бисквитки' }
		],
		quickLinks: [
			{ href: '/about', label: 'За нас' },
			{ href: '/inventory?view=4', label: 'Покупка с Eliq Auto' },
			{ href: '/sell-your-car', label: 'Продай автомобила си' },
			{ href: '/services', label: 'Услуги' },
			{ href: '/faqs', label: 'FAQ' },
			{ href: '/blog', label: 'Новини' },
			{ href: '/contact', label: 'Контакт с Eliq Auto' }
		],
		socialLinks: [
			{ href: eliqautoContact.facebookHref, icon: 'facebook', label: 'Facebook' },
			{ href: eliqautoContact.youtubeHref, icon: 'youtube', label: 'YouTube' },
			{ href: eliqautoContact.viberHref, icon: 'viber', label: 'Viber' }
		]
	};
};

// Types without stock route to the import flow instead of an empty inventory result.
export const homeFiveTypeCards: HomeFiveTypeCard[] = [
	{
		label: 'Electric',
		image: '/assets/images/card/card-27.webp',
		bodyType: 'Electric',
		href: '/import'
	},
	{
		label: 'Sedan',
		image: '/assets/images/card/card-28.webp',
		bodyType: 'Sedan',
		href: '/inventory?bodyType=Sedan'
	},
	{
		label: 'SUV',
		image: '/assets/images/card/card-29.webp',
		bodyType: 'SUV',
		href: '/inventory?bodyType=SUV'
	},
	{
		label: 'Pickup Truck',
		image: '/assets/images/card/card-30.webp',
		bodyType: 'Pickup Truck',
		href: '/import'
	},
	{
		label: 'Hatchback',
		image: '/assets/images/card/card-31.webp',
		bodyType: 'Hatchback',
		href: '/import'
	},
	{
		label: 'Crossover',
		image: '/assets/images/card/card-32.webp',
		bodyType: 'Crossover',
		href: '/import'
	},
	{
		label: 'Cabriolet',
		image: '/assets/images/card/card-34.webp',
		bodyType: 'Cabriolet',
		href: '/inventory?bodyType=Cabriolet'
	},
	{
		label: 'View all',
		image: '/assets/eliqauto/megamenu/inventory-audi-sq5-cutout.webp',
		bodyType: 'View all',
		href: '/inventory'
	}
];

export const homeFiveTypeCardsForLocale = (locale: Locale): HomeFiveTypeCard[] =>
	homeFiveTypeCards.map((card) => ({
		...card,
		label: translateVehicleTerm(locale, 'bodyTypes', card.label)
	}));

export const homeFiveVehiclePills: HomeFiveVehiclePill[] = [
	{
		active: false,
		href: '/inventory?bodyType=SUV',
		icon: 'suv',
		kind: 'body',
		label: 'SUV',
		termGroup: 'bodyTypes'
	},
	{
		active: false,
		href: '/inventory?bodyType=Sedan',
		icon: 'sedan',
		kind: 'body',
		label: 'Sedan',
		termGroup: 'bodyTypes'
	},
	{
		active: false,
		href: '/inventory?bodyType=Cabriolet',
		icon: 'coupe',
		kind: 'body',
		label: 'Cabriolet',
		termGroup: 'bodyTypes'
	},
	{
		active: false,
		href: '/inventory?minPrice=50000',
		icon: 'luxury',
		kind: 'body',
		label: 'Luxury',
		termGroup: 'bodyTypes'
	},
	{
		active: false,
		href: '/inventory?transmission=Automatic',
		image: '/assets/icons/transmission.svg',
		kind: 'spec',
		label: 'Automatic',
		termGroup: 'transmissions'
	},
	{
		active: false,
		href: '/inventory?fuel=Petrol',
		image: '/assets/icons/gaspump.svg',
		kind: 'spec',
		label: 'Petrol',
		termGroup: 'fuels'
	},
	{
		active: false,
		href: '/inventory?minYear=2021',
		image: '/assets/icons/calendar.svg',
		kind: 'spec',
		label: '2021+'
	},
	{
		active: false,
		href: '/inventory?maxMileage=120000',
		image: '/assets/icons/mileage.svg',
		kind: 'spec',
		label: 'Under 120k',
		labels: { bg: 'до 120k' }
	},
	{
		active: false,
		href: '/inventory?brand=BMW',
		image: '/assets/images/brand/brand-1.webp',
		kind: 'brand',
		label: 'BMW'
	},
	{
		active: false,
		href: '/inventory?brand=Audi',
		image: '/assets/images/brand/brand-3.webp',
		kind: 'brand',
		label: 'Audi'
	},
	{
		active: false,
		href: '/inventory?brand=Mercedes-Benz',
		image: '/assets/images/brand/brand-2.webp',
		kind: 'brand',
		label: 'Mercedes'
	}
];

export const homeFiveVehiclePillsForLocale = (locale: Locale): HomeFiveVehiclePill[] =>
	homeFiveVehiclePills.map((pill) => ({
		...pill,
		label:
			pill.labels?.[locale] ??
			(pill.termGroup ? translateVehicleTerm(locale, pill.termGroup, pill.label) : pill.label)
	}));

const uniqueSortedValues = (items: string[]) =>
	Array.from(new Set(items.filter(Boolean))).sort((left, right) => left.localeCompare(right));

const modalBrandLogos: Record<string, string> = {
	Audi: '/assets/images/brand/brand-3.webp',
	BMW: '/assets/images/brand/brand-1.webp',
	Ferrari: '/assets/images/brand/brand-11.webp',
	Ford: '/assets/images/brand/brand-7.webp',
	Honda: '/assets/images/brand/brand-4.webp',
	Hyundai: '/assets/images/brand/brand-8.webp',
	Kia: '/assets/eliqauto/brands/kia-transparent.webp',
	Mazda: '/assets/images/brand/brand-10.webp',
	'Mercedes-Benz': '/assets/images/brand/brand-2.webp',
	Porsche: '/assets/eliqauto/brands/porsche.webp',
	Tesla: '/assets/images/brand/brand-12.webp',
	Toyota: '/assets/images/brand/brand-5.webp',
	Volvo: '/assets/images/brand/brand-6.webp',
	Volkswagen: '/assets/eliqauto/brands/volkswagen.webp'
};

const compactModelLabel = (value: string) =>
	value
		.replace(/\s+(M Sport Shadow Line|Black Optic|Technik Black Optic)$/i, '')
		.replace(/\s+(Carbon Package|Night Package|Sport Chrono|Signature)$/i, '')
		.replace(/\s+(xDrive|quattro|4MATIC|4M)\b/i, ' ')
		.replace(/\s+/g, ' ')
		.trim();

const modelSeriesLabel = (brand: string, model: string) => {
	const clean = compactModelLabel(model);
	const firstToken = clean.split(/\s+/)[0] ?? clean;

	if (brand === 'BMW') {
		if (/^XM$/i.test(firstToken)) return 'XM';
		if (/^X\d/i.test(firstToken)) return firstToken.toUpperCase();
		if (/^M\d/i.test(firstToken)) return firstToken.toUpperCase();
		const numericSeries = firstToken.match(/^([1-8])\d{2}/);
		if (numericSeries) return `${numericSeries[1]} Series`;
	}

	if (brand === 'Mercedes-Benz') {
		const mercedesFamily = firstToken.match(/^(GLA|GLB|GLC|GLE|GLS|CLA|CLS|A|B|C|E|G|S|SL)\b/i);
		if (mercedesFamily) return mercedesFamily[1].toUpperCase();
	}

	if (brand === 'Audi') {
		const audiFamily = firstToken.match(/^(RS\d|SQ\d|Q\d|A\d|S\d|TT|R8)\b/i);
		if (audiFamily) return audiFamily[1].toUpperCase();
	}

	if (brand === 'Mazda') {
		const mazdaFamily = firstToken.match(/^CX-\d/i);
		if (mazdaFamily) return mazdaFamily[0].toUpperCase();
	}

	return firstToken;
};

const modelVariantLabel = (brand: string, model: string, series: string) => {
	const clean = compactModelLabel(model);
	let variant: string;

	if (brand === 'BMW') {
		if (/^\d Series$/.test(series)) return clean;
		variant = clean.replace(
			new RegExp(`^${series.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'i'),
			''
		);
	} else {
		variant = clean.replace(
			new RegExp(`^${series.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'i'),
			''
		);
	}

	return variant.trim() || clean;
};

const modelSelectOptions = (vehicles: Vehicle[]): HomeFiveHeroSelectOption[] => {
	const counts = countBy(vehicles.map((vehicle) => `${vehicle.brand}|||${vehicle.model}`));
	const options = new Map<string, HomeFiveHeroSelectOption>();

	for (const vehicle of vehicles) {
		const key = `${vehicle.brand}|||${vehicle.model}`;

		if (!options.has(key)) {
			const count = counts.get(key) ?? 0;
			const series = modelSeriesLabel(vehicle.brand, vehicle.model);

			options.set(key, {
				brand: vehicle.brand,
				countLabel: count > 1 ? String(count) : undefined,
				label: vehicle.model,
				series,
				shortLabel: compactModelLabel(vehicle.model),
				value: vehicle.model,
				variant: modelVariantLabel(vehicle.brand, vehicle.model, series)
			});
		}
	}

	return Array.from(options.values()).sort((left, right) =>
		left.brand === right.brand
			? left.label.localeCompare(right.label)
			: (left.brand ?? '').localeCompare(right.brand ?? '')
	);
};

const selectOptions = (
	locale: Locale,
	values: string[],
	group?: keyof PublicMessages['vehicleTerms'],
	counts?: Map<string, number>
): HomeFiveHeroSelectOption[] =>
	uniqueSortedValues(values).map((value) => ({
		countLabel: counts?.get(value) ? String(counts.get(value)) : undefined,
		label: group ? translateVehicleTerm(locale, group, value) : value,
		value
	}));

const heroTextSlidesForLocale = (locale: Locale): Omit<HomeFiveHeroTextSlide, 'id'>[] =>
	locale === 'bg'
		? [
				{
					ctaHref: '/inventory',
					ctaLabel: 'Виж наличните',
					heading: 'Купи автомобил',
					subtitle: 'Проверени автомобили с ясна история и съдействие до регистрация.'
				},
				{
					ctaHref: '/services',
					ctaLabel: 'Виж процеса по внос',
					heading: 'Внос и лизинг',
					subtitle: 'Подбор, проверка, документи и доставка до България.'
				},
				{
					ctaHref: '/sell-your-car',
					ctaLabel: 'Заяви оценка',
					heading: 'Продай автомобила си',
					subtitle: 'Оценка, представяне и съдействие до финална сделка.'
				}
			]
		: [
				{
					ctaHref: '/inventory',
					ctaLabel: 'View available cars',
					heading: 'Buy a car',
					subtitle: 'Verified vehicles with clear history and registration support.'
				},
				{
					ctaHref: '/services',
					ctaLabel: 'See import process',
					heading: 'Premium Cars & Leasing',
					subtitle: 'Selection, inspection, documents, and delivery to Bulgaria.'
				},
				{
					ctaHref: '/sell-your-car',
					ctaLabel: 'Request valuation',
					heading: 'Sell Your Vehicle',
					subtitle: 'Valuation, presentation, and support through the final deal.'
				}
			];

const orderHeroTextSlidesByMode = (
	slides: HomeFiveHeroTextSlide[],
	activeMode: HomeFiveHeroActionMode
): HomeFiveHeroTextSlide[] => {
	const modeOrder: HomeFiveHeroActionMode[] = ['buy', 'import', 'sell'];
	const activeIndex = modeOrder.indexOf(activeMode);
	if (activeIndex <= 0) return slides;

	const activeSlide = slides[activeIndex];
	if (!activeSlide) return slides;

	return [activeSlide, ...slides.filter((_, index) => index !== activeIndex)];
};

const heroActionsForLocale = (locale: Locale): HomeFiveHeroAction[] =>
	locale === 'bg'
		? [
				{
					actionHref: '/inventory',
					drawerKicker: 'Търсене',
					drawerTitle: 'Намери автомобил',
					helper: 'Филтрирай наличните автомобили по марка, модел, купе, бюджет и гориво.',
					inputName: 'q',
					label: 'Купи',
					mobileHeading: 'Намери автомобила си.',
					mode: 'buy',
					placeholder: 'Търси марка, модел, цена...',
					secondaryHref: '/inventory',
					secondaryLabel: 'Разгледай всички',
					submitLabel: 'Покажи автомобили',
					tabHref: '/'
				},
				{
					actionHref: '/import',
					drawerKicker: 'Внос и лизинг',
					drawerTitle: 'Изпрати линк за проверка',
					helper:
						'Постави линк към обява или VIN. Eliq Auto ще провери историята, снимките, пробега и ориентировъчната крайна цена.',
					inputName: 'vehicle',
					label: 'Внос',
					mobileHeading: 'Внеси автомобил с проверена история.',
					mode: 'import',
					placeholder: 'Линк към обява или VIN...',
					secondaryHref: '/import',
					secondaryLabel: 'Пълна заявка',
					submitLabel: 'Провери линка',
					tabHref: '/?intent=import'
				},
				{
					actionHref: '/sell-your-car',
					drawerKicker: 'Продай автомобил',
					drawerTitle: 'Започни оценка',
					helper:
						'Изпрати VIN или линк към обява. След това допълни пробег, очаквана цена и телефон в страницата за оценка.',
					inputName: 'vin',
					label: 'Продай',
					mobileHeading: 'Продай автомобила си.',
					mode: 'sell',
					placeholder: 'VIN номер или линк към обява...',
					secondaryHref: '/sell-your-car',
					secondaryLabel: 'Пълна форма за продажба',
					submitLabel: 'Заяви оценка',
					tabHref: '/?intent=sell'
				}
			]
		: [
				{
					actionHref: '/inventory',
					drawerKicker: 'Search',
					drawerTitle: 'Find a car',
					helper: 'Filter available vehicles by brand, model, body type, budget, and fuel.',
					inputName: 'q',
					label: 'Buy',
					mobileHeading: 'Find your car.',
					mode: 'buy',
					placeholder: 'Search brand, model, price...',
					secondaryHref: '/inventory',
					secondaryLabel: 'Browse all',
					submitLabel: 'Show vehicles',
					tabHref: '/?lang=en'
				},
				{
					actionHref: '/import',
					drawerKicker: 'Import request',
					drawerTitle: 'Send a listing link',
					helper:
						'Paste a listing URL or VIN. ELIQ Auto will review history, photos, mileage, documents, and estimated final cost for Bulgaria.',
					inputName: 'vehicle',
					label: 'Import',
					mobileHeading: 'Import with ELIQ Auto.',
					mode: 'import',
					placeholder: 'Listing URL or VIN...',
					secondaryHref: '/import',
					secondaryLabel: 'Full request',
					submitLabel: 'Check',
					tabHref: '/?lang=en&intent=import'
				},
				{
					actionHref: '/sell-your-car',
					drawerKicker: 'Sell your car',
					drawerTitle: 'Start a valuation',
					helper:
						'Send a VIN or listing link first, then add mileage, expected price, and phone on the valuation page.',
					inputName: 'vin',
					label: 'Sell',
					mobileHeading: 'Sell your vehicle.',
					mode: 'sell',
					placeholder: 'VIN number or listing link...',
					secondaryHref: '/sell-your-car',
					secondaryLabel: 'Full sell form',
					submitLabel: 'Request valuation',
					tabHref: '/?lang=en&intent=sell'
				}
			];

export const resolveHomeFiveHeroActionMode = (value: string | null): HomeFiveHeroActionMode =>
	value === 'import' || value === 'sell' ? value : 'buy';

export function homeFiveHeroDataFromVehicles(
	vehicles: Vehicle[],
	locale: Locale = 'en',
	activeMode: HomeFiveHeroActionMode = 'buy'
): HomeFiveHeroData {
	const t = getMessages(locale).hero;
	const textSlides: HomeFiveHeroTextSlide[] = heroTextSlidesForLocale(locale).map(
		(slide, index) => ({
			id: `home-five-hero-slide-${index + 1}`,
			...slide
		})
	);
	const orderedTextSlides = orderHeroTextSlidesByMode(textSlides, activeMode);
	const brandCounts = countBy(vehicles.map((vehicle) => vehicle.brand));

	return {
		activeMode,
		actions: heroActionsForLocale(locale),
		advancedFilters: [
			{
				defaultLabel: t.filters.allFuelTypes,
				id: 'Home05FuelSelectToggle',
				name: 'fuel',
				options: selectOptions(
					locale,
					vehicles.map((vehicle) => vehicle.fuel),
					'fuels'
				),
				title: t.filters.fuelType
			},
			{
				defaultLabel: t.filters.allTransmissions,
				id: 'Home05TransmissionSelectToggle',
				name: 'transmission',
				options: selectOptions(
					locale,
					vehicles.map((vehicle) => vehicle.transmission),
					'transmissions'
				),
				title: t.filters.transmission
			},
			{
				defaultLabel: t.filters.allStatuses,
				id: 'Home05StatusSelectToggle',
				name: 'status',
				options: ['New listing', 'Available', 'Client vehicle'].map((value) => ({
					label: translateVehicleTerm(locale, 'statuses', value),
					value
				})),
				title: t.filters.status
			}
		],
		backgroundImages: eliqautoAssets.homeHeroSlides.filter(Boolean),
		checksTitle: t.checksTitle,
		features: t.features,
		heading: t.heading,
		primaryFilters: [
			{
				defaultLabel: t.filters.allBrand,
				id: 'Home05BrandSelectToggle',
				name: 'brand',
				options: selectOptions(
					locale,
					vehicles.map((vehicle) => vehicle.brand),
					undefined,
					brandCounts
				).map((option) => ({
					...option,
					image: modalBrandLogos[option.value],
					shortLabel: option.value === 'Mercedes-Benz' ? 'Mercedes' : option.value
				})),
				title: t.filters.selectBrand
			},
			{
				defaultLabel: t.filters.allModel,
				id: 'Home05ModelSelectToggle',
				name: 'q',
				options: modelSelectOptions(vehicles),
				title: t.filters.selectModel
			},
			{
				defaultLabel: t.filters.allBodyTypes,
				id: 'Home05BodySelectToggle',
				name: 'bodyType',
				options: selectOptions(
					locale,
					vehicles
						.map((vehicle) => vehicle.bodyType)
						.filter((bodyType) => Boolean(bodyType) && bodyType !== 'Car'),
					'bodyTypes'
				),
				title: t.filters.bodyType
			},
			{
				defaultLabel: t.filters.allPrice,
				id: 'Home05MaxPriceSelectToggle',
				name: 'maxPrice',
				options: ['30 000 EUR', '50 000 EUR', '80 000 EUR', '120 000 EUR'].map((value) => ({
					label: value,
					value
				})),
				title: t.filters.maxPrice
			}
		],
		searchSubmitPrefix: t.searchSubmitPrefix,
		searchSubmitSuffix:
			locale === 'bg' ? bgVehicleCountNoun(vehicles.length) : t.searchSubmitSuffix,
		tabs: t.tabs,
		textSlides: orderedTextSlides,
		totalMatches: vehicles.length,
		yearLabel: t.yearLabel,
		yearRange: { min: 2015, max: 2026 }
	};
}

// The A7's listing photo breaks its compact comparison row, so pin only that
// vehicle's existing cutout without changing the photo-first feature surfaces.
const compareStripImageOverrides: Record<string, string> = {
	'11774283016080050': '/assets/eliqauto/megamenu/inventory-audi-a7-cutout.webp'
};

const compareMileageLabel = (mileage: number, locale: Locale) =>
	`${mileage.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} ${locale === 'bg' ? 'км' : 'km'}`;

const comparePowerLabel = (engine: string, locale: Locale) =>
	locale === 'bg' ? engine : engine.replace(/к\.с\./gi, 'hp');

const compareVehicleFrom = (vehicle: Vehicle, locale: Locale): HomeFiveCompareVehicle => ({
	brand: vehicle.brand,
	image: compareStripImageOverrides[vehicle.slug] ?? imageForHomeFiveVehicle(vehicle),
	priceLabel: vehicle.priceLabel,
	slug: vehicle.slug,
	stats: [
		{ label: locale === 'bg' ? 'Година' : 'Year', value: String(vehicle.year) },
		{
			label: locale === 'bg' ? 'Пробег' : 'Mileage',
			value: compareMileageLabel(vehicle.mileage, locale)
		},
		{
			label: locale === 'bg' ? 'Мощност' : 'Power',
			value: comparePowerLabel(vehicle.engine, locale)
		}
	],
	title: inventoryCardDisplayTitle(vehicle.title)
});

const formatKm = (value: number) => `${value.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} km`;

const formatMonthly = (value: number, locale: Locale) =>
	value > 0
		? `${value.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} ${locale === 'bg' ? 'EUR/мес.' : 'EUR/mo'}`
		: '';

const compactFuelLabel = (fuel: string, locale: Locale) => {
	const normalizedFuel = fuel.toLowerCase();

	if (
		normalizedFuel.includes('hybrid') ||
		normalizedFuel.includes('хибрид') ||
		normalizedFuel.includes('phev')
	) {
		return translateVehicleTerm(locale, 'fuels', 'Hybrid');
	}

	return translateVehicleTerm(locale, 'fuels', fuel);
};

export const homeFiveVehicleCardFromVehicle = (
	vehicle: Vehicle,
	index: number,
	locale: Locale = 'en'
): HomeFiveVehicleCardData => ({
	brand: vehicle.brand,
	fuel: compactFuelLabel(vehicle.fuel, locale),
	highlightClass: 'bg-primary-2',
	image: imageForHomeFiveVehicle(vehicle),
	mileageLabel: formatKm(vehicle.mileage),
	monthlyLabel: formatMonthly(vehicle.monthly, locale),
	photoCount: vehicle.images.length || 1,
	priceEur: vehicle.price,
	priceLabel: vehicle.priceLabel,
	slug: vehicle.slug,
	title: inventoryCardDisplayTitle(vehicle.title),
	transmission: translateVehicleTerm(locale, 'transmissions', vehicle.transmission),
	transmissionIcon: vehicle.transmission === 'Manual' ? 'manual.svg' : 'auto.svg',
	year: vehicle.year
});

export const homeFiveVehicleCardsFromVehicles = (
	vehicles: Vehicle[],
	limit: number,
	locale: Locale = 'en'
) =>
	vehicles
		.slice(0, limit)
		.map((vehicle, index) => homeFiveVehicleCardFromVehicle(vehicle, index, locale));

const modalVehicleFromVehicle = (
	vehicle: Vehicle,
	locale: Locale = 'en'
): HomeFiveModalVehicle => ({
	engine: vehicle.engine,
	exterior: vehicle.exterior,
	fuel: translateVehicleTerm(locale, 'fuels', vehicle.fuel),
	image: imageForHomeFiveVehicle(vehicle),
	interior: vehicle.interior,
	location: vehicle.location,
	mileageLabel: formatKm(vehicle.mileage),
	slug: vehicle.slug,
	stockNumber: vehicle.stockNumber,
	title: inventoryCardDisplayTitle(vehicle.title),
	transmission: translateVehicleTerm(locale, 'transmissions', vehicle.transmission),
	vin: vehicle.vin,
	year: vehicle.year
});

export function homeFiveModalsDataFromVehicles(
	vehicles: Vehicle[],
	locale: Locale = 'en'
): HomeFiveModalsData | undefined {
	const [left, right, ...rest] = vehicles;

	if (!left || !right) {
		return undefined;
	}

	const modalLeft = modalVehicleFromVehicle(left, locale);
	const modalRight = modalVehicleFromVehicle(right, locale);

	return {
		cardCompare: {
			left: modalLeft,
			right: modalRight,
			rows: [
				{
					icon: 'mileage.svg',
					label: locale === 'bg' ? 'Пробег' : 'Mileage',
					left: modalLeft.mileageLabel,
					right: modalRight.mileageLabel
				},
				{
					icon: 'years.svg',
					label: locale === 'bg' ? 'Година' : 'Years',
					left: modalLeft.year,
					right: modalRight.year
				},
				{
					icon: 'fuel.svg',
					label: locale === 'bg' ? 'Гориво' : 'Fuel',
					left: modalLeft.fuel,
					right: modalRight.fuel
				},
				{
					icon: 'color.svg',
					label: locale === 'bg' ? 'Цвят' : 'Color',
					left: modalLeft.exterior,
					right: modalRight.exterior
				},
				{
					icon: 'location.svg',
					label: locale === 'bg' ? 'Локация' : 'Location',
					left: modalLeft.location,
					right: modalRight.location
				},
				{
					icon: 'interior.svg',
					label: locale === 'bg' ? 'Интериор' : 'Interior',
					left: modalLeft.interior,
					right: modalRight.interior
				},
				{
					icon: 'engine.svg',
					label: locale === 'bg' ? 'Двигател' : 'Engine',
					left: modalLeft.engine,
					right: modalRight.engine
				},
				{
					icon: 'transmission.svg',
					label: locale === 'bg' ? 'Трансмисия' : 'Transmission',
					left: modalLeft.transmission,
					right: modalRight.transmission
				},
				{ icon: 'VIN.svg', label: 'VIN', left: modalLeft.vin, right: modalRight.vin },
				{
					icon: 'QrCode.svg',
					label: locale === 'bg' ? 'Номер в наличност' : 'Stock Number',
					left: modalLeft.stockNumber,
					right: modalRight.stockNumber
				}
			]
		},
		comparePreview: [left, right, ...rest]
			.slice(0, 3)
			.map((vehicle) => modalVehicleFromVehicle(vehicle, locale))
	};
}

export function homeFiveComparePairsFromVehicles(
	vehicles: Vehicle[],
	locale: Locale = 'en'
): HomeFiveComparePair[] {
	return [
		[vehicles[0], vehicles[1]],
		[vehicles[2], vehicles[3]]
	]
		.filter((pair): pair is [Vehicle, Vehicle] => Boolean(pair[0] && pair[1]))
		.map(([left, right]) => ({
			left: compareVehicleFrom(left, locale),
			right: compareVehicleFrom(right, locale)
		}));
}
