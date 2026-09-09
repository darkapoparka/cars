import { publicNavGroups, daynightSite } from '$lib/data/daynight-site';
import { daynightVehicles } from '$lib/data/daynight-vehicles';
import { desktopOnlyImageAttrs } from '$lib/utils/desktop-only-assets';

type PublicNavLink = {
	label: string;
	href: string;
	children?: readonly PublicNavLink[];
};

type MegaMenuColumn = {
	title: string;
	links: readonly PublicNavLink[];
};

type MegaMenuVehicleTile = PublicNavLink & {
	image: string;
	meta: string;
};

type FooterLinkGroup = {
	title: string;
	links: readonly PublicNavLink[];
};

type PresentationIconLink = {
	label: string;
	href: string;
	icon: string;
	title: string;
	kind: 'direct' | 'external';
};

const daynightFacebookUrl = '';
const daynightInstagramUrl = '';

const inventoryMegaMenuVehicles: readonly MegaMenuVehicleTile[] = [
	{
		label: 'Chrysler 300C',
		href: '/inventory/chrysler-300c-2018-gaz',
		image: '/assets/images/megamenu/chrysler-300c.webp',
		meta: '17 000 EUR · Газ/Бензин'
	},
	{
		label: 'BMW i7',
		href: '/inventory/bmw-i7-2023-full-maxx',
		image: '/assets/images/megamenu/bmw-i7.webp',
		meta: '81 000 EUR · Електрически'
	},
	{
		label: 'BMW 520i',
		href: '/inventory/bmw-520i-2006-avtomatik',
		image: '/assets/images/megamenu/bmw-520i.webp',
		meta: '4 500 EUR · Бензин'
	},
	{
		label: 'Mercedes E 350 D',
		href: '/inventory/mercedes-benz-e-350-d-2015-64594',
		image: '/assets/images/megamenu/mercedes-e220d.webp',
		meta: '11 500 EUR · Дизел'
	}
] as const;

const inventoryMegaMenuLinkColumns: readonly MegaMenuColumn[] = [
	{
		title: 'Наличност',
		links: [
			{ label: 'Всички автомобили', href: '/inventory' },
			{ label: 'Автомобили на карта', href: '/inventory/map' },
			{ label: 'Сравнение', href: '/compare' },
			{ label: 'Калкулатор', href: '/calculator' }
		]
	},
	{
		title: 'По тип',
		links: [
			{ label: 'Седан', href: '/inventory?body=Седан' },
			{ label: 'Джип', href: '/inventory?body=SUV' },
			{ label: 'Купе', href: '/inventory?body=Купе' },
			{ label: 'Комби', href: '/inventory?body=Комби' }
		]
	},
	{
		title: 'По гориво',
		links: [
			{ label: 'Дизел', href: '/inventory?fuel=Дизел' },
			{ label: 'Бензин', href: '/inventory?fuel=Бензин' },
			{ label: 'Газ/Бензин', href: '/inventory?fuel=Газ/Бензин' },
			{ label: 'Електрически', href: '/inventory?fuel=Електрически' }
		]
	},
	{
		title: 'Помощ при избор',
		links: [
			{ label: 'Финансиране', href: '/financing' },
			{ label: 'Услуги', href: '/services' },
			{ label: 'Често задавани въпроси', href: '/faq' },
			{ label: 'Полезно за купувачи', href: '/blog' }
		]
	}
] as const;

const footerLinkGroups: readonly FooterLinkGroup[] = [
	{
		title: 'G AUTO',
		links: [
			{ label: 'За G Auto', href: '/about' },
			{ label: 'Профил на автокъщата', href: '/about/g-auto' },
			{ label: 'Екип', href: '/team' },
			{ label: 'Отзиви', href: '/reviews' },
			{ label: 'Полезно', href: '/blog' },
			{ label: 'Контакти', href: '/contact' }
		]
	},
	{
		title: 'УСЛУГИ И ИНСТРУМЕНТИ',
		links: [
			{ label: 'Автомобили по обяви', href: '/inventory' },
			{ label: 'Финансиране', href: '/financing' },
			{ label: 'Калкулатор', href: '/calculator' },
			{ label: 'Продай или замени', href: '/sell-your-car' },
			{ label: 'Сравнение', href: '/compare' },
			{ label: 'ЧЗВ', href: '/faq' }
		]
	},
	{
		title: 'ЗАПИТВАНИЯ',
		links: [
			{ label: 'Контакт за оглед', href: '/contact' },
			{ label: 'Заявка за оценка', href: '/sell-your-car/request' },
			{ label: 'Продай или замени', href: '/sell-your-car' },
			{ label: 'ЧЗВ', href: '/faq' }
		]
	}
] as const;

function chevronDownIcon(stroke: string, className = 'chevron-down') {
	return `<svg class="${className}" width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 6.5L8 10.5L12 6.5" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

function searchIcon() {
	return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.8047 15.8047L21.0012 21.0012" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

function searchActionIcon(stroke = '#1C1C1C') {
	return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.8047 15.8047L21.0012 21.0012" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

function accountIcon(stroke = '#1C1C1C') {
	return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3 20.25C4.81594 17.1122 8.11406 15 12 15C15.8859 15 19.1841 17.1122 21 20.25" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

function plusCircleIcon(stroke = 'white') {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
<path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.25 12H15.75" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 8.25V15.75" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

function compareIcon(stroke = '#1C1C1C') {
	return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.5 13.5L19.5 16.5L16.5 19.5" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.5 16.5H19.5" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.5 10.5L4.5 7.5L7.5 4.5" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.5 7.5H4.5" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

function heartIcon(stroke = '#1C1C1C') {
	return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 21C12 21 2.25 15.75 2.25 9.5625C2.25 8.21984 2.78337 6.93217 3.73277 5.98277C4.68217 5.03337 5.96984 4.5 7.3125 4.5C9.43031 4.5 11.2444 5.65406 12 7.5C12.7556 5.65406 14.5697 4.5 16.6875 4.5C18.0302 4.5 19.3178 5.03337 20.2672 5.98277C21.2166 6.93217 21.75 8.21984 21.75 9.5625C21.75 15.75 12 21 12 21Z" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

function escapeHtml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function resizeSvg(svg: string, width: number, height: number) {
	return svg.replace(/width="\d+"\s+height="\d+"/, `width="${width}" height="${height}"`);
}

function closeIcon() {
	return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

function phoneIcon() {
	return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<path d="M14.25 4.5C15.5114 4.83218 16.6621 5.4932 17.5844 6.41557C18.5068 7.33793 19.1678 8.48858 19.5 9.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.5 7.5C15.0488 7.91438 16.0856 8.95125 16.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.6616 14.3752C14.7654 14.3061 14.8849 14.264 15.0091 14.2527C15.1334 14.2414 15.2585 14.2613 15.3731 14.3106L19.7944 16.2915C19.9434 16.3552 20.0677 16.4654 20.1489 16.6057C20.23 16.7459 20.2635 16.9087 20.2444 17.0696C20.0987 18.1581 19.5627 19.1566 18.736 19.8795C17.9093 20.6024 16.8482 21.0005 15.75 20.9996C12.3685 20.9996 9.12548 19.6563 6.73439 17.2652C4.3433 14.8741 3 11.6311 3 8.24961C2.99916 7.15143 3.3972 6.09032 4.12009 5.26361C4.84298 4.43691 5.84152 3.90089 6.93 3.75524C7.09091 3.73612 7.25368 3.76963 7.39395 3.85075C7.53422 3.93187 7.64444 4.05624 7.70813 4.20524L9.68906 8.63024C9.73774 8.74389 9.75756 8.86781 9.74676 8.99098C9.73597 9.11414 9.69489 9.23272 9.62719 9.33618L7.62375 11.7184C7.55269 11.8256 7.51066 11.9494 7.50179 12.0778C7.49291 12.2061 7.51749 12.3346 7.57313 12.4506C8.34844 14.0377 9.98906 15.6587 11.5809 16.4265C11.6975 16.4819 11.8266 16.5059 11.9553 16.4962C12.084 16.4865 12.208 16.4434 12.315 16.3712L14.6616 14.3752Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

function locationIcon() {
	return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<path d="M12 12.75C13.6569 12.75 15 11.4069 15 9.75C15 8.09315 13.6569 6.75 12 6.75C10.3431 6.75 9 8.09315 9 9.75C9 11.4069 10.3431 12.75 12 12.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.5 9.75C19.5 16.5 12 21.75 12 21.75C12 21.75 4.5 16.5 4.5 9.75C4.5 7.76088 5.29018 5.85322 6.6967 4.4467C8.10322 3.04018 10.0109 2.25 12 2.25C13.9891 2.25 15.8968 3.04018 17.3033 4.4467C18.7098 5.85322 19.5 7.76088 19.5 9.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

function facebookIcon() {
	return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<circle cx="10" cy="10" r="8.5" fill="currentColor"/>
<path class="brand-cutout" d="M12.96 11.18H15.5L15.9 8.1H12.96V6.42C12.96 5.54 13.2 4.94 14.46 4.94H16V2.18C15.28 2.08 14.55 2.03 13.82 2.03C11.66 2.03 10.18 3.35 10.18 5.77V8.1H7.73V11.18H10.18V18H12.96V11.18Z" fill="#B00000"/>
</svg>`;
}

function instagramIcon() {
	return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.5 2.5H13.5C15.71 2.5 17.5 4.29 17.5 6.5V13.5C17.5 15.71 15.71 17.5 13.5 17.5H6.5C4.29 17.5 2.5 15.71 2.5 13.5V6.5C2.5 4.29 4.29 2.5 6.5 2.5ZM6.5 4.15C5.2 4.15 4.15 5.2 4.15 6.5V13.5C4.15 14.8 5.2 15.85 6.5 15.85H13.5C14.8 15.85 15.85 14.8 15.85 13.5V6.5C15.85 5.2 14.8 4.15 13.5 4.15H6.5ZM10 6.35C7.71 6.35 6.35 7.71 6.35 10C6.35 12.29 7.71 13.65 10 13.65C12.29 13.65 13.65 12.29 13.65 10C13.65 7.71 12.29 6.35 10 6.35ZM10 7.98C11.12 7.98 12.02 8.88 12.02 10C12.02 11.12 11.12 12.02 10 12.02C8.88 12.02 7.98 11.12 7.98 10C7.98 8.88 8.88 7.98 10 7.98ZM13.84 5.58C13.31 5.58 12.88 6.01 12.88 6.54C12.88 7.07 13.31 7.5 13.84 7.5C14.37 7.5 14.8 7.07 14.8 6.54C14.8 6.01 14.37 5.58 13.84 5.58Z" fill="currentColor"/>
</svg>`;
}

function carLotIcon(stroke: string) {
	return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<path d="M5 17H3.8C3.35817 17 3 16.6418 3 16.2V13.28C3 12.4108 3.56096 11.6411 4.38835 11.374L6.25 10.7738L8.00478 6.84909C8.32737 6.1278 9.04394 5.66333 9.83409 5.66333H14.1659C14.9561 5.66333 15.6726 6.1278 15.9952 6.84909L17.75 10.7738L19.6117 11.374C20.439 11.6411 21 12.4108 21 13.28V16.2C21 16.6418 20.6418 17 20.2 17H19" stroke="${stroke}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.25 10.75H17.75" stroke="${stroke}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.5 17C8.5 18.1046 7.60457 19 6.5 19C5.39543 19 4.5 18.1046 4.5 17C4.5 15.8954 5.39543 15 6.5 15C7.60457 15 8.5 15.8954 8.5 17Z" stroke="${stroke}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.5 17C19.5 18.1046 18.6046 19 17.5 19C16.3954 19 15.5 18.1046 15.5 17C15.5 15.8954 16.3954 15 17.5 15C18.6046 15 19.5 15.8954 19.5 17Z" stroke="${stroke}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

function renderIconLink(link: PresentationIconLink, className = 'effect-svg-hover') {
	const attrs =
		link.kind === 'external'
			? `href="${link.href}" target="_blank" rel="noopener" title="${escapeHtml(link.title)}" aria-label="${escapeHtml(link.title)}"`
			: `href="${link.href}" title="${escapeHtml(link.title)}" aria-label="${escapeHtml(link.title)}"`;

	return `<li><a ${attrs} class="${className}">${link.icon}</a></li>`;
}

function renderHeaderLanguageDropdown() {
	return `<div class="core-dropdown language-select" id="language-select">
<button class="core-dropdown__button" type="button" aria-label="Език: Български" aria-haspopup="listbox" aria-controls="headerLanguageMenu" aria-expanded="false">
<span class="core-dropdown__label">BG</span>
${chevronDownIcon('#1C1C1C', 'icon-chevron')}
</button>
<div class="core-dropdown__menu" id="headerLanguageMenu">
<ul class="core-dropdown__list" role="listbox" aria-label="Избор на език">
<li class="text-sm cursor-pointer">Български</li>
<li class="text-sm cursor-pointer">English</li>
<li class="text-sm cursor-pointer">Още езици скоро</li>
</ul>
</div>
</div>`;
}

function renderHeaderTopBarSocialLinks() {
	const links: readonly PresentationIconLink[] = [
		{
			label: 'Facebook',
			href: daynightFacebookUrl,
			title: 'Facebook',
			icon: facebookIcon(),
			kind: 'external'
		},
		{
			label: 'Instagram',
			href: daynightInstagramUrl,
			title: 'Instagram',
			icon: instagramIcon(),
			kind: 'external'
		}
	];

	return `<ul class="header-top-bar--socical pl-40">${links
		.filter(link => Boolean(link.href)).map((link) => renderIconLink(link))
		.join('')}</ul>`;
}

export function renderHeaderTopBarControls() {
	return `<div>
${renderHeaderLanguageDropdown()}
</div>
${renderHeaderTopBarSocialLinks()}`;
}

export function replaceHeaderTopBarControls(html: string) {
	const opening = '<div class="header-top-bar--socical-wrapper flex items-center gap-40">';
	const openIndex = html.indexOf(opening);
	if (openIndex === -1) {
		return html;
	}

	const openEndIndex = openIndex + opening.length;
	const closeIndex = findClosingDivIndex(html, openEndIndex);
	if (closeIndex === -1) {
		return html;
	}

	return `${html.slice(0, openEndIndex)}
${renderHeaderTopBarControls()}
${html.slice(closeIndex)}`;
}

function renderFooterLinkGroup(group: FooterLinkGroup) {
	const links = group.links.map((link) => `<li>${renderLink(link, '')}</li>`).join('');

	return `<div class="collapse">
<p class="font-weight-600 text-white mb-14 collapse-title justify-between" data-breakpoint="mobile">
${group.title}
<span class="icon text-white hidden md-block">+</span>
</p>
<ul class="widget-links collapse-content md-hidden">
${links}
</ul>
</div>`;
}

function renderFooterSocialLinks() {
	const whitePhoneIcon = resizeSvg(phoneIcon().replaceAll('currentColor', '#FFFFFF'), 20, 20);
	const whiteLocationIcon = resizeSvg(locationIcon().replaceAll('currentColor', '#FFFFFF'), 20, 20);
	const links: readonly PresentationIconLink[] = [
		{
			label: 'Facebook',
			href: daynightFacebookUrl,
			title: 'Facebook',
			icon: facebookIcon(),
			kind: 'external'
		},
		{
			label: 'Instagram',
			href: daynightInstagramUrl,
			title: 'Instagram',
			icon: instagramIcon(),
			kind: 'external'
		},
		{
			label: 'Телефон',
			href: `tel:${daynightSite.phone}`,
			title: `Свържете се с ${daynightSite.shortName} по публикувания телефон.`,
			kind: 'direct',
			icon: whitePhoneIcon
		},
		{
			label: 'Mobile.bg',
			href: daynightSite.sourceInventory,
			title: 'Виж автомобилите от селекцията в mobile.bg',
			kind: 'external',
			icon: carLotIcon('#FFFFFF')
		},
		{
			label: 'Google Maps',
			href: daynightSite.mapUrl,
			title: 'Отвори локацията на G Auto в Google Maps',
			kind: 'external',
			icon: whiteLocationIcon
		}
	];

	return `<ul class="widget-socical mb-12">${links
		.map((link) => renderIconLink(link, 'effect-svg-hover'))
		.join('')}</ul>`;
}

export function renderPresentationFooter() {
	const footerColumns = footerLinkGroups.map((group) => renderFooterLinkGroup(group)).join('');

	return `<footer class="bg-primary footer">
<div class="footer-top">
<div class="container">
<div class="row">
<div class="col-lg-4">
<div class="footer-top-inner">
<div>
<a href="/">
<img class="logo" ${desktopOnlyImageAttrs(daynightSite.logoLight, 570, '190px')} alt="${daynightSite.shortName}">
</a>
<p class="text-xs uppercase font-weight-500 mb-8 text-muted">Огледи и консултация</p>
<p class="text-white mb-28">Огледи с предварителна уговорка.<br>Наличност, финансиране, бартер и съдействие по документи.</p>
</div>
<form class="form-footer relative" action="/contact" method="get">
<label class="sr-only" for="footer-email">Имейл за нови оферти</label>
<input type="email" placeholder="Имейл за нови оферти" name="email" id="footer-email" autocomplete="email" required>
<button type="submit" class="btn-submit" aria-label="Изпрати интерес към нови оферти">
${searchIcon()}
</button>
</form>
</div>
</div>
<div class="col-lg-4">
<div class="flex justify-between gap-8 footer-links">
${footerColumns}
</div>
</div>
<div class="col-lg-4">
<div class="footer-contact">
<div>
<p class="font-weight-500 text-white mb-8">
<a href="tel:${daynightSite.phone}" class="flex items-start h7">${daynightSite.phoneLabel}</a>
</p>
<a href="${daynightSite.mapUrl}" target="_blank" rel="noopener" class="block font-weight-500 text-white mb-20 h7">${daynightSite.location}</a>
<p class="text-sm text-muted mb-16">G Auto предлага актуална дигитална витрина с наличност, запитвания и ясни следващи стъпки.</p>
${renderFooterSocialLinks()}
</div>
<div>
<p class="text-sm text-white font-weight-600 mb-8">Имате въпрос?</p>
<div class="flex items-center gap-12">
<a href="/contact" class="btn btn-line-1 btn-small" title="Свържете се със G Auto">Свържете се</a>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div class="divider divider-blur"></div>
<div class="footer-bottom">
<div class="container">
<div class="flex justify-between md-flex-col">
<p class="text-sm text-muted">©2026 <a class="text-sm text-white" href="/">G Auto</a>. Всички права запазени.</p>
<ul class="footer-bottom-links">
<li><a href="/terms">Условия за ползване</a></li>
<li><a href="/terms">Поверителност</a></li>
<li><a href="/terms">Бисквитки</a></li>
</ul>
</div>
</div>
</div>
</footer>`;
}

function renderLink(item: PublicNavLink, className = 'menu-item') {
	const classAttr = className ? ` class="${className}"` : '';

	return `<a${classAttr} href="${item.href}">${item.label}</a>`;
}

export function renderHeaderContact() {
	const viberHref = `viber://chat?number=%2B359${daynightSite.phone.slice(1)}`;

	return `<ul class="header-contact">
<li class="daynight-header-contact daynight-header-contact--phone">
<a href="tel:${daynightSite.phone}" class="icon" aria-label="Обади се на G Auto">${phoneIcon()}</a>
<div class="daynight-header-contact__body">
<a class="text" href="tel:${daynightSite.phone}">${daynightSite.phoneLabel}</a>
<a class="text-xs font-weight-500" href="${viberHref}">Обаждане / Viber</a>
</div>
<div class="daynight-contact-popover" role="group" aria-label="Контакт по телефон">
<strong>Свържете се веднага</strong>
<span>Изберете обаждане или Viber чат.</span>
<div class="daynight-contact-popover__actions">
<a href="tel:${daynightSite.phone}">Обади се</a>
<a href="${viberHref}">Viber</a>
</div>
</div>
</li>
<li class="daynight-header-contact daynight-header-contact--location">
<a href="${daynightSite.mapUrl}" class="icon" target="_blank" rel="noopener" aria-label="Отвори карта до G Auto">${locationIcon()}</a>
<div class="daynight-header-contact__body">
<a class="text" href="${daynightSite.mapUrl}" target="_blank" rel="noopener">${daynightSite.mapLabel}</a>
<a class="text-xs font-weight-500 uppercase" href="${daynightSite.mapUrl}" target="_blank" rel="noopener">ВИЖ КАРТА</a>
</div>
<a class="daynight-map-preview" href="${daynightSite.mapUrl}" target="_blank" rel="noopener" aria-label="Отвори Google карта до G Auto">
<span class="daynight-map-preview__thumb">
<span class="daynight-map-preview__pin"></span>
</span>
<span class="daynight-map-preview__body">
<strong>G Auto Благоевград</strong>
<span>${daynightSite.mapLabel}</span>
<em>Отвори в Google Maps</em>
</span>
</a>
</li>
</ul>`;
}

export function replaceHeaderContact(html: string) {
	return html.replace(/<ul class="header-contact">[\s\S]*?<\/ul>/, renderHeaderContact());
}

export function renderHeaderSearchForm() {
	return `<div class="search-modal daynight-header-search" id="searchForm" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="headerSearchTitle">
<div class="search-modal__overlay"></div>
<div class="search-modal__content">
<button class="search-modal__close" id="searchModalClose" type="button" aria-label="Затвори търсенето">
${closeIcon()}
</button>
<h2 class="search-modal__title" id="headerSearchTitle">Какво търсите?</h2>
<form class="search-modal__form daynight-header-search-form" action="/inventory" method="get" role="search">
<div class="search-modal__input-wrapper">
<input type="text" class="search-modal__input daynight-header-search__input" placeholder="Търси по марка, модел, година, гориво..." autocomplete="off" id="searchModalInput" name="q">
<button type="submit" class="search-modal__submit" aria-label="Търси">
${searchIcon()}
</button>
</div>
</form>
</div>
</div>`;
}

export function replaceHeaderSearch(html: string) {
	const next = html
		.replace(
			/<span class="relative header-action-btn" id="searchToggle">/,
			'<span class="relative header-action-btn" id="searchToggle" role="button" tabindex="0" aria-label="Отвори търсене" title="Отвори търсене" aria-expanded="false" aria-controls="searchForm">'
		)
		.replace(
			/<div class="search-form" id="searchForm">[\s\S]*?<\/div>\s*<!-- Search Form -->/,
			'<!-- Search Form -->'
		);

	if (next.includes('id="searchForm"')) {
		return next;
	}

	return next.replace('</header>', `</header>\n${renderHeaderSearchForm()}`);
}

function renderDropdownToggle(label: string, chevronStroke: string, href = '#') {
	return `<a href="${href}">${label} 
${chevronDownIcon(chevronStroke)}
</a>`;
}

function renderContainerDropdown(item: PublicNavLink, chevronStroke: string) {
	const childLinks = item.children?.map((child) => renderLink(child)).join('') ?? '';

	return `<li class="menu-item menu-item-has-children">
${renderDropdownToggle(item.label, chevronStroke, item.href)}
<ul class="sub-menu sub-menu--container"><li>${childLinks}</li></ul>
</li>`;
}

function renderMegaColumn(column: MegaMenuColumn) {
	const links = column.links.map((link) => `<li>${renderLink(link, '')}</li>`).join('');

	return `<div class="sub-menu-item-listing">
<p class="h5 mb-16 menu-item-inner-title">${column.title} 
${chevronDownIcon('#9FA1A4', 'chevron-down hidden lg-show')}
</p>
<ul class="flex flex-col gap-16 sub-menu-item-inner">${links}</ul>
</div>`;
}

function renderVehicleTile(vehicle: MegaMenuVehicleTile) {
	return `<a class="daynight-mega-car" href="${vehicle.href}">
<span class="daynight-mega-car__image-wrap">
<img class="daynight-mega-car__image" ${desktopOnlyImageAttrs(vehicle.image, 300, '180px')} alt="${vehicle.label}">
</span>
<span class="daynight-mega-car__title">${vehicle.label}</span>
<span class="daynight-mega-car__meta">${vehicle.meta}</span>
<span class="daynight-mega-car__actions"><span>Виж</span><span>Детайли</span></span>
</a>`;
}

function renderInventoryMegaMenu(chevronStroke: string) {
	// Only surface curated tiles whose listing is still active. Guards against a
	// tile linking to a vehicle that has since moved to `inactiveSourceUrls`
	// (whose detail page 404s) — e.g. the Mercedes tile drifting out of stock.
	const activeSlugs = new Set(daynightVehicles.map((vehicle) => vehicle.slug));
	const vehicleTiles = inventoryMegaMenuVehicles
		.filter((tile) => activeSlugs.has(tile.href.replace(/^\/inventory\//, '')))
		.map(renderVehicleTile)
		.join('');
	const sideColumns = inventoryMegaMenuLinkColumns.map(renderMegaColumn).join('');

	return `<li class="menu-item menu-item-has-children menu-item--static">
${renderDropdownToggle('Автомобили', chevronStroke, '/inventory')}
<div class="sub-menu sub-menu--full sub-menu--listing daynight-mega daynight-mega--vehicles">
<div class="daynight-mega__content">
<div class="daynight-mega__vehicle-panel">
<div class="sub-menu--listing-nav daynight-mega__vehicles">${vehicleTiles}</div>
<div class="daynight-mega__footer">
<a class="daynight-mega__footer-button" href="/inventory">Виж всички автомобили</a>
<div class="daynight-mega__footer-copy">
<strong>${daynightVehicles.length} проверени автомобила в наличност</strong>
<span>С филтри по марка, цена, гориво, пробег и екстри.</span>
</div>
</div>
</div>
<div class="sub-menu--listing-image daynight-mega__links">${sideColumns}</div>
</div>
</div>
</li>`;
}

function renderPublicNavItem(item: PublicNavLink, chevronStroke: string, includeMegaMenu: boolean) {
	if (includeMegaMenu && item.label === 'Автомобили') {
		return renderInventoryMegaMenu(chevronStroke);
	}

	if (!item.children?.length) {
		return `<li class="menu-item"><a href="${item.href}">${item.label}</a></li>`;
	}

	return renderContainerDropdown(item, chevronStroke);
}

function renderPublicNav(chevronStroke = '#9FA1A4', includeMegaMenu = true) {
	return publicNavGroups
		.map((item) => renderPublicNavItem(item, chevronStroke, includeMegaMenu))
		.join('');
}

export function renderHeaderLogo(containerClass: 'logo' | 'logo-mobile', logoSrc: string) {
	return `<div class="${containerClass}">
<a href="/" class="daynight-header-logo" aria-label="${daynightSite.shortName}">
<img class="daynight-header-logo__image" ${desktopOnlyImageAttrs(logoSrc, 570, '190px')} alt="${daynightSite.shortName}">
</a>
</div>`;
}

export function renderStickyHeaderLogo(logoSrc = daynightSite.logoLight) {
	return `<a href="/" class="daynight-sticky-logo" aria-label="${daynightSite.shortName}">
<img class="daynight-sticky-logo__image" ${desktopOnlyImageAttrs(logoSrc, 570, '190px')} alt="${daynightSite.shortName}">
</a>`;
}

export function insertStickyHeaderLogo(html: string) {
	if (html.includes('daynight-sticky-logo')) {
		return html;
	}

	return html.replace(
		/(<div class="flex justify-between items-center gap-20 w-full main-nav-wrapper">\s*)(<!-- Menu -->)/,
		`$1${renderStickyHeaderLogo()}
$2`
	);
}

export function replaceMainNav(html: string) {
	return html.replace(/<nav id="main-nav"([^>]*)>[\s\S]*?<\/nav>/, (match, navAttrs: string) => {
		const ulAttrs = /<ul id="menu-primary-menu"([^>]*)>/.exec(match)?.[1] ?? ' class="menu"';
		const navHtml = renderPublicNav(ulAttrs.includes('style-2') ? '#fff' : '#9FA1A4');

		return `<nav id="main-nav"${navAttrs}><ul id="menu-primary-menu"${ulAttrs}>${navHtml}</ul></nav>`;
	});
}

export function renderTemplateMainMenu() {
	return `<nav class="main-menu"><ul>${renderPublicNav('#9FA1A4', false)}</ul></nav>`;
}

function renderHeaderButtons(mobile = false) {
	const accountClass = mobile
		? 'btn btn-primary btn-large font-weight-600'
		: 'btn btn-line btn-large font-weight-600 bg-sign-in';

	return `<div class="header-button ${mobile ? 'header-button-mobile' : 'mobile-hidden-header-button'} flex items-center gap-20">
<a href="/admin/login" class="${accountClass}">
${accountIcon()}
Екип вход
</a>
<a href="/sell-your-car/request" class="btn btn-primary btn-large font-weight-600">
${plusCircleIcon()}
${daynightSite.sellCarCta}
</a>
</div>`;
}

function renderHeaderActions() {
	return `<div class="header-actions ml-20">
<img class="logo-mobile-header" ${desktopOnlyImageAttrs(daynightSite.logoLight, 570, '190px')} alt="logo">
<div class="header-search-wrapper">
<span class="relative header-action-btn" id="searchToggle" role="button" tabindex="0" aria-label="Отвори търсене" title="Отвори търсене" aria-expanded="false" aria-controls="searchForm">
${searchActionIcon()}
</span>
<!-- Search Form -->
</div>
<a href="/compare" class="header-action-btn header-action-icon" aria-label="Сравни">
${compareIcon()}
</a>
<a href="/favorites" class="header-action-btn header-action-icon" aria-label="Запазени автомобили" data-badge="2">
${heartIcon()}
</a>
<div class="mobile-button"><span></span></div>
</div>`;
}

export function renderSharedHomeHeader() {
	return `<!-- Header -->
<div class="header-wrapper-style-3">
<header class="header header-style-2 header-style-3 bg-white" id="header_main">
<div class="header-top-bar relative background-light">
<div class="container header-top-bar--wrapper">
<p class="header-top-bar--text flex items-center">${daynightSite.primaryCta}</p>
<div class="header-top-bar--socical-wrapper flex items-center gap-40">
${renderHeaderTopBarControls()}
</div>
</div>
</div>
<div class="header-style-2-main relative md-hidden">
<div class="container">
<div class="header-inner header-inner-style-2 items-center w-full flex">
${renderHeaderLogo('logo', daynightSite.logoDark)}
${renderHeaderLogo('logo-mobile', daynightSite.logoDark)}
<div class="header-right">
${renderHeaderContact()}
${renderHeaderButtons()}
</div>
</div>
</div>
</div>
<div class="bg-primary">
<div class="header-container-fluid max-w-1920 relative bg-primary header-fixed-primary">
<div class="header-inner flex-col container" id="site-header-inner">
<div class="flex justify-between items-center gap-20 w-full main-nav-wrapper">
${renderStickyHeaderLogo()}
<!-- Menu -->
<nav id="main-nav" class="main-nav mr-18"><ul id="menu-primary-menu" class="menu style-2">${renderPublicNav('#fff', true)}</ul></nav>
<!-- Menu -->
${renderHeaderActions()}
</div>
</div>
</div>
</div>
<div class="hidden wrapper-header-button">
${renderHeaderButtons(true)}
</div>
</header>
${renderHeaderSearchForm()}
</div>
<!-- Header -->`;
}

function findClosingDivIndex(html: string, openEndIndex: number) {
	const divTagPattern = /<\/?div\b[^>]*>/gi;
	divTagPattern.lastIndex = openEndIndex;
	let depth = 1;
	let match: RegExpExecArray | null;

	while ((match = divTagPattern.exec(html))) {
		if (match[0].startsWith('</')) {
			depth -= 1;
			if (depth === 0) {
				return match.index;
			}
		} else {
			depth += 1;
		}
	}

	return -1;
}
