import {
	getDayNightVehicleCondition,
	placeholderImageSlugs,
	daynightVehicles
} from '$lib/data/daynight-vehicles';

type DayNightVehicle = (typeof daynightVehicles)[number];

export function escapeHtml(value: string | number) {
	return String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function uniqueSorted(values: string[]) {
	return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'bg'));
}

function normalizeBadgeLabel(value: string) {
	return value.trim().toLocaleLowerCase('bg-BG');
}

function renderCardMetaAttributes(vehicle: DayNightVehicle) {
	return `data-daynight-vehicle-card data-daynight-slug="${escapeHtml(vehicle.slug)}" data-daynight-brand="${escapeHtml(vehicle.brand)}" data-daynight-model="${escapeHtml(vehicle.model)}" data-daynight-body="${escapeHtml(vehicle.body)}" data-daynight-fuel="${escapeHtml(vehicle.fuel)}" data-daynight-transmission="${escapeHtml(vehicle.transmission)}" data-daynight-price="${vehicle.price}" data-daynight-mileage="${vehicle.mileageValue}" data-daynight-condition="${getDayNightVehicleCondition(vehicle)}" data-daynight-features="${escapeHtml(vehicle.features.join(' | '))}" data-daynight-title="${escapeHtml(vehicle.title)}" data-daynight-year="${vehicle.year}"`;
}

function renderCardBadge(vehicle: DayNightVehicle, index: number, preferPrimaryBadge = false) {
	const fallbackBadge = index % 5 === 1 ? 'Добра цена' : '';
	const badge =
		(preferPrimaryBadge ? vehicle.badges[0] : undefined) ??
		vehicle.badges.find((value) => normalizeBadgeLabel(value) !== 'vip') ??
		vehicle.badges[0] ??
		fallbackBadge;
	const badgeClass =
		normalizeBadgeLabel(badge) === normalizeBadgeLabel(fallbackBadge) ? 'bg-green' : 'bg-primary-2';

	return badge
		? `<p class="${badgeClass} text-white highlight">${escapeHtml(badge)}</p>`
		: '<p></p>';
}

function renderHeartIcon() {
	return `<p class="heart">
<svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_13399_19510)">
<path d="M8 14C8 14 1.5 10.5 1.5 6.375C1.5 5.47989 1.85558 4.62145 2.48851 3.98851C3.12145 3.35558 3.97989 3 4.875 3C6.28688 3 7.49625 3.76937 8 5C8.50375 3.76937 9.71312 3 11.125 3C12.0201 3 12.8785 3.35558 13.5115 3.98851C14.1444 4.62145 14.5 5.47989 14.5 6.375C14.5 10.5 8 14 8 14Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>
</p>`;
}

function renderCompareIcon() {
	return `<svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_13399_19575)">
<path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.875 10H13.125" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 6.875V13.125" stroke="#1C1C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>`;
}

function renderViewDetailsLink(route: string) {
	return `<a href="${route}" class="view-details">Виж детайли<img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt="" aria-hidden="true"></a>`;
}

function renderCardPrice(value: string) {
	return escapeHtml(value.replace(/\s*EUR\b/, ' €'));
}

function renderCardMediaStats(vehicle: DayNightVehicle) {
	// A placeholder-only gallery is not a real photo — no count badge for it.
	if (placeholderImageSlugs.has(vehicle.slug) || vehicle.gallery.length === 0) {
		return '';
	}

	return `<div class="flex items-center gap-8">
<p class="category uppercase text-white">
<img src="/assets/icons/picture.svg" alt="" aria-hidden="true">
${vehicle.gallery.length}
</p>
</div>`;
}

function renderCardBottomPill(vehicle: DayNightVehicle, route: string) {
	return `<p class="category text-white"><a href="${route}" class="text-white text-xs">${escapeHtml(vehicle.transmission)}</a></p>`;
}

function renderVehicleTags(vehicle: DayNightVehicle, styleClass: string) {
	return `<ul class="tag ${styleClass}">
<li><img src="/assets/icons/icon-gauge.svg" alt="" aria-hidden="true"><span>${escapeHtml(vehicle.mileage)}</span></li>
<li><img src="/assets/icons/calendar.svg" alt="" aria-hidden="true"><span>${vehicle.year}</span></li>
<li><img src="/assets/icons/gaspump.svg" alt="" aria-hidden="true"><span>${escapeHtml(vehicle.fuel)}</span></li>
</ul>`;
}

function renderCompareLink() {
	return `<a href="/compare" class="compare-details btn btn-small" title="Сравни автомобили">${renderCompareIcon()}Сравни</a>`;
}

export function renderInventoryGridCard(vehicle: DayNightVehicle, index: number) {
	const route = `/inventory/${vehicle.slug}`;
	const delay = `0.${(index % 4) + 1}s`;

	return `<div class="card-box card-box-style-1 wow fadeIn" data-wow-delay="${delay}" ${renderCardMetaAttributes(vehicle)}>
<div class="top">
${renderCardBadge(vehicle, index)}
${renderHeartIcon()}
</div>
<div class="image">
<a href="${route}">
<img class="card--img" src="${escapeHtml(vehicle.image)}" alt="${escapeHtml(vehicle.shortTitle)}" loading="lazy" decoding="async">
</a>
</div>
<div class="content border-light border-top-none">
<div class="bottom">
${renderCardBottomPill(vehicle, route)}
${renderCardMediaStats(vehicle)}
</div>
<p class="h6 card-box__title mb-8"><a href="${route}">${escapeHtml(vehicle.title)}</a></p>
${renderVehicleTags(vehicle, 'style2 mb-10')}
<p class="h6 card-box__price daynight-inventory-card__price-row mb-15">
<span class="daynight-card-price__stack"><span class="daynight-card-price__value">${renderCardPrice(vehicle.priceEur)}</span><span class="daynight-card-price__monthly">${escapeHtml(vehicle.monthly)}</span></span>
<a href="${route}" class="daynight-card-price__link daynight-inventory-card__arrow" aria-label="Виж ${escapeHtml(vehicle.shortTitle)}" title="Виж автомобила">
<svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M4.25 10H15.25" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10.75 5.5L15.25 10L10.75 14.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
</a>
</p>
</div>
</div>`;
}

type InventoryPillIcon =
	| 'all'
	| 'electric'
	| 'sedan'
	| 'suv'
	| 'wagon'
	| 'hatchback'
	| 'coupe'
	| 'price';

const inventoryPillIcons: Record<InventoryPillIcon, string> = {
	all: `<svg aria-hidden="true" width="38" height="18" viewBox="0 0 76 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13 23H8.5C6.6 23 5 21.4 5 19.5V17.6C5 15.9 6.2 14.4 7.9 14.1L17.7 12.3L24.2 6.7C25.5 5.6 27.1 5 28.8 5H45.5C47.7 5 49.8 6 51.1 7.8L55.3 13.4L66.3 15.8C69 16.4 71 18.8 71 21.6V23H64" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M25 23H52" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
<path d="M22.5 28.5C25.5376 28.5 28 26.0376 28 23C28 19.9624 25.5376 17.5 22.5 17.5C19.4624 17.5 17 19.9624 17 23C17 26.0376 19.4624 28.5 22.5 28.5Z" stroke="currentColor" stroke-width="2"/>
<path d="M58.5 28.5C61.5376 28.5 64 26.0376 64 23C64 19.9624 61.5376 17.5 58.5 17.5C55.4624 17.5 53 19.9624 53 23C53 26.0376 55.4624 28.5 58.5 28.5Z" stroke="currentColor" stroke-width="2"/>
<path d="M25 13H48" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`,
	electric: `<svg aria-hidden="true" width="41" height="16" viewBox="0 0 41 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.95237 14.7054C8.73393 14.7054 10.1782 13.2612 10.1782 11.4796C10.1782 9.69803 8.73393 8.25378 6.95237 8.25378C5.17081 8.25378 3.72656 9.69803 3.72656 11.4796C3.72656 13.2612 5.17081 14.7054 6.95237 14.7054Z" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M30.1789 14.7054C31.9605 14.7054 33.4047 13.2612 33.4047 11.4796C33.4047 9.69803 31.9605 8.25378 30.1789 8.25378C28.3974 8.25378 26.9531 9.69803 26.9531 11.4796C26.9531 13.2612 28.3974 14.7054 30.1789 14.7054Z" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M26.9539 12.1249H10.1797" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M33.4032 12.1244H37.9194L39.8548 10.8341L39.2097 10.1889V8.25342L40.5 7.60826L40.2419 7.47922C37.0161 5.41471 32.629 4.38246 28.8871 4.38246C28.8871 4.38246 28.2419 3.47924 26.9516 2.57601C25.6613 1.67279 23.7258 0.640522 21.1452 0.51149C16.1129 0.253425 6.30645 4.38246 6.30645 4.38246H1.79032C1.01613 4.38246 0.5 5.02762 0.5 5.67278V10.8341L3.72581 11.4792" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M35.3398 6.96472L37.2753 7.60988" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.466 6.31817L6.30469 4.38269" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.6953 7.60988L21.7921 9.41633C22.1792 9.54536 22.5663 9.41635 22.8243 9.15829L25.534 6.96472" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M28.8881 4.38263H20.501C17.5333 4.38263 14.5655 3.73747 11.7268 2.57618L11.4688 2.44714" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M0.5 8.25372H1.01612C2.17741 8.25372 3.33871 7.47953 3.72581 6.31824H0.5" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
	sedan: `<svg aria-hidden="true" width="41" height="18" viewBox="0 0 41 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.88597 17.2766C10.6675 17.2766 12.1118 15.8323 12.1118 14.0508C12.1118 12.2692 10.6675 10.825 8.88597 10.825C7.1044 10.825 5.66016 12.2692 5.66016 14.0508C5.66016 15.8323 7.1044 17.2766 8.88597 17.2766Z" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M31.468 17.2766C33.2496 17.2766 34.6938 15.8323 34.6938 14.0508C34.6938 12.2692 33.2496 10.825 31.468 10.825C29.6864 10.825 28.2422 12.2692 28.2422 14.0508C28.2422 15.8323 29.6864 17.2766 31.468 17.2766Z" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.1133 14.0494H28.2424" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M34.6936 14.0484H40.5001V9.53228C37.5324 7.46776 34.0485 6.30647 30.4356 6.30647H29.5323L25.7904 1.53226C25.2743 0.887097 24.5001 0.5 23.7259 0.5H10.6936C10.4355 0.5 10.0484 0.629034 9.79034 0.758066L5.6613 4.37098H3.08065C2.30646 4.37098 1.79033 4.88711 1.79033 5.6613V9.53228L0.5 10.8226V12.7581L5.6613 14.0484" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.6927 8.23975H13.4023" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M21.1458 8.23975H19.8555" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M29.5313 6.30647H12.1119L9.53125 5.01614V3.72582L13.4022 0.5" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.78906 9.53134H3.07939C3.85358 9.53134 4.36971 9.01521 4.36971 8.24101C4.36971 7.46681 3.85358 6.95068 3.07939 6.95068H1.78906" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M36.6289 7.59521V9.5307C36.6289 10.3049 37.145 10.821 37.9192 10.821H40.4999" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.9219 0.5V6.30647" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
	suv: `<svg aria-hidden="true" width="41" height="18" viewBox="0 0 41 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M29.6618 14.6937H11.9844" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M35.8548 14.6937H37.2742L40.5 13.4033V8.24206L30.1774 5.66141L26.5645 2.04851C25.5323 1.01625 24.2419 0.500122 22.9516 0.500122H7.59677C4.75806 1.79044 2.30644 3.98399 1.01612 6.95173L0.5 8.24206V12.7582L5.01613 14.6937H5.79033" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M40.4992 9.53235H37.2734L37.9186 12.113H40.4992" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M0.5 8.24207H3.72581L3.20969 9.66142C2.82259 10.6937 1.66129 11.4679 0.5 11.4679" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.8228 0.500122L8.24219 4.37109L9.53251 5.66141H30.1777" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.88596 17.2744C10.6675 17.2744 12.1118 15.8301 12.1118 14.0486C12.1118 12.267 10.6675 10.8228 8.88596 10.8228C7.1044 10.8228 5.66016 12.267 5.66016 14.0486C5.66016 15.8301 7.1044 17.2744 8.88596 17.2744Z" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M32.7571 17.2744C34.5386 17.2744 35.9829 15.8301 35.9829 14.0486C35.9829 12.267 34.5386 10.8228 32.7571 10.8228C30.9755 10.8228 29.5312 12.267 29.5312 14.0486C29.5312 15.8301 30.9755 17.2744 32.7571 17.2744Z" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.59551 0.500122L4.36971 5.66141H1.78906" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.2109 5.66141V0.500122" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.1145 8.24207H10.8242" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.8555 8.24207H21.791" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
	wagon: `<svg aria-hidden="true" width="41" height="18" viewBox="0 0 41 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.8235 17.2742C12.605 17.2742 14.0493 15.83 14.0493 14.0484C14.0493 12.2669 12.605 10.8226 10.8235 10.8226C9.0419 10.8226 7.59766 12.2669 7.59766 14.0484C7.59766 15.83 9.0419 17.2742 10.8235 17.2742Z" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M33.4016 17.2742C35.1832 17.2742 36.6274 15.83 36.6274 14.0484C36.6274 12.2669 35.1832 10.8226 33.4016 10.8226C31.62 10.8226 30.1758 12.2669 30.1758 14.0484C30.1758 15.83 31.62 17.2742 33.4016 17.2742Z" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.59677 14.0484H1.79032L0.5 12.7581V5.66129H13.4032V0.5H24.1129C24.7581 0.5 25.2742 0.758057 25.6613 1.01612L31.4677 5.66129L39.3387 6.82257C39.9839 6.9516 40.5 7.46773 40.5 8.1129V12.7581C40.5 13.5323 39.9839 14.0484 39.2097 14.0484H36.629" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M30.1759 14.0483H14.0469" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M21.1445 0.5V5.66129" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M22.4349 8.24194H21.1445" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M0.5 7.5968H4.37097L3.46774 9.01616C3.20968 9.27423 2.95161 9.53229 2.56452 9.53229H0.629033" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M40.4986 10.1774H37.918V8.24194H40.4986" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
	hatchback: `<svg aria-hidden="true" width="41" height="18" viewBox="0 0 41 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.5969 17.0373C9.37846 17.0373 10.8227 15.5931 10.8227 13.8115C10.8227 12.0299 9.37846 10.5857 7.5969 10.5857C5.81534 10.5857 4.37109 12.0299 4.37109 13.8115C4.37109 15.5931 5.81534 17.0373 7.5969 17.0373Z" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.6289 0.908325V4.77929" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M30.8241 6.06962L10.8241 5.42445L6.95312 4.13413L9.53377 0.908325" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.37097 13.8119L0.5 13.1668V9.94097L1.79032 8.65065L1.14516 6.71516L5.66129 1.55387L4.37097 0.908713L14.5645 0.521617C20.5 0.263553 26.3065 2.32807 30.8226 6.07C30.8226 6.07 37.0161 6.71516 40.5 9.29581V14.4571H35.3387" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M32.1125 17.0373C33.8941 17.0373 35.3383 15.5931 35.3383 13.8115C35.3383 12.0299 33.8941 10.5857 32.1125 10.5857C30.331 10.5857 28.8867 12.0299 28.8867 13.8115C28.8867 15.5931 30.331 17.0373 32.1125 17.0373Z" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.43422 5.42444L5.66003 6.71476C4.88584 7.87605 3.46648 8.65024 2.04712 8.65024H1.78906" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M40.5011 11.2308C38.8237 10.8437 37.1463 10.0695 35.856 9.03726L35.3398 8.65017L38.3076 8.005" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.1145 8.005H10.8242" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.8567 8.005H18.5664" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.8242 13.8115H28.8887" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
	coupe: `<svg aria-hidden="true" width="41" height="16" viewBox="0 0 41 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.53049 14.6937C11.3121 14.6937 12.7563 13.2494 12.7563 11.4679C12.7563 9.68631 11.3121 8.24207 9.53049 8.24207C7.74893 8.24207 6.30469 9.68631 6.30469 11.4679C6.30469 13.2494 7.74893 14.6937 9.53049 14.6937Z" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M32.7571 14.6937C34.5386 14.6937 35.9829 13.2494 35.9829 11.4679C35.9829 9.68631 34.5386 8.24207 32.7571 8.24207C30.9755 8.24207 29.5312 9.68631 29.5312 11.4679C29.5312 13.2494 30.9755 14.6937 32.7571 14.6937Z" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.30645 11.4679L0.5 10.1775V6.95173L1.79032 6.30657L0.5 4.37109C0.5 4.37109 5.91935 0.500122 12.1129 0.500122C17.0161 0.500122 21.7903 0.500122 23.5968 0.500122C24.1129 0.500122 24.629 0.629153 25.0161 0.887218L30.1774 4.37109C30.1774 4.37109 36.5 4.75819 40.5 5.66141L39.8548 6.95173L40.5 8.24206V10.8227L35.9839 11.4679" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.7578 11.4679H29.532" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M30.1777 4.37109H10.8228L8.24219 3.72593C9.14541 2.43561 10.3067 1.53238 11.7261 0.887218L12.7583 0.500122" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.4023 6.30652H14.6927" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M21.1445 6.30652H22.4349" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.79032 6.30658H4.37097L3.72581 4.37109H0.5" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M37.918 6.95178H39.8535" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.5664 4.37109V0.500122" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
	price: `<svg aria-hidden="true" width="34" height="18" viewBox="0 0 34 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.5 3.5H15.6C16.2 3.5 16.8 3.75 17.22 4.18L26.32 13.28C27.05 14.01 27.05 15.19 26.32 15.92C25.59 16.65 24.41 16.65 23.68 15.92L14.58 6.82C14.15 6.39 13.56 6.15 12.95 6.15H4.5V3.5Z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.5 6.2C9.05228 6.2 9.5 5.75228 9.5 5.2C9.5 4.64772 9.05228 4.2 8.5 4.2C7.94772 4.2 7.5 4.64772 7.5 5.2C7.5 5.75228 7.94772 6.2 8.5 6.2Z" fill="currentColor"/>
<path d="M20.8 8.2H29.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
<path d="M22.8 11.2H31.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
</svg>`
};

function renderInventoryPillIcon(icon: InventoryPillIcon) {
	return inventoryPillIcons[icon]
		.replaceAll('stroke="#1C1C1C"', 'stroke="currentColor"')
		.replaceAll('fill="#1C1C1C"', 'fill="currentColor"');
}

function inventoryHref(params: Record<string, string>) {
	const search = new URLSearchParams(params).toString();
	return `/inventory${search ? `?${search}` : ''}`;
}

function renderInventoryTypePill(
	label: string,
	href: string,
	icon: InventoryPillIcon,
	active = false
) {
	return `<a class="daynight-inventory-type-pill${active ? ' is-active' : ''}" href="${escapeHtml(href)}">
${renderInventoryPillIcon(icon)}
<span>${escapeHtml(label)}</span>
</a>`;
}

function renderInventoryTypePills() {
	return [
		renderInventoryTypePill('Всички', inventoryHref({}), 'all', true),
		renderInventoryTypePill('Електрически', inventoryHref({ fuel: 'Електрически' }), 'electric'),
		renderInventoryTypePill('Седан', inventoryHref({ body: 'Седан' }), 'sedan'),
		renderInventoryTypePill('Джип', inventoryHref({ body: 'SUV' }), 'suv'),
		renderInventoryTypePill('Комби', inventoryHref({ body: 'Комби' }), 'wagon'),
		renderInventoryTypePill('Хечбек', inventoryHref({ body: 'Хечбек' }), 'hatchback'),
		renderInventoryTypePill('Купе', inventoryHref({ body: 'Купе' }), 'coupe'),
		renderInventoryTypePill('До 20 000 EUR', inventoryHref({ price: 'under-20000' }), 'price')
	].join('\n');
}

function renderInventoryMapListCard(vehicle: DayNightVehicle, index: number) {
	const route = `/inventory/${vehicle.slug}`;

	return `<div class="card-box card-box-style-9" ${renderCardMetaAttributes(vehicle)}>
<div class="top">
${renderCardBadge(vehicle, index)}
${renderHeartIcon()}
</div>
<div class="bottom">
${renderCardBottomPill(vehicle, route)}
${renderCardMediaStats(vehicle)}
</div>
<div class="image">
<a href="${route}"><img class="card--img" src="${escapeHtml(vehicle.image)}" alt="${escapeHtml(vehicle.shortTitle)}" loading="lazy" decoding="async"></a>
</div>
<div class="content">
<p class="h6 card-box__title mb-4"><a href="${route}">${escapeHtml(vehicle.title)}</a></p>
<p class="text-secondary clamp-1 clamp mb-8">${escapeHtml(vehicle.conditionLine)}</p>
${renderVehicleTags(vehicle, 'style3 mb-14')}
<p class="h6 card-box__price mb-10 flex justify-between gap-8 items-center"><span class="daynight-card-price__value">${renderCardPrice(vehicle.priceEur)}</span></p>
<div class="flex gap-32">
${renderCompareLink()}
<a href="${route}" class="view-details">Виж детайли<img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt="" aria-hidden="true"></a>
</div>
</div>
</div>`;
}

export function renderInventoryMapCardCollection(limit = daynightVehicles.length) {
	return daynightVehicles
		.slice(0, limit)
		.map((vehicle, index) => renderInventoryMapListCard(vehicle, index))
		.join('\n');
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

export function replaceDivInnerByExactClass(
	html: string,
	className: string,
	innerHtml: string,
	occurrence = 0
) {
	const opening = `<div class="${className}">`;
	let searchFrom = 0;
	let seen = 0;

	while (searchFrom < html.length) {
		const openIndex = html.indexOf(opening, searchFrom);
		if (openIndex === -1) {
			return html;
		}

		const openEndIndex = openIndex + opening.length;
		const closeIndex = findClosingDivIndex(html, openEndIndex);
		if (closeIndex === -1) {
			return html;
		}

		if (seen === occurrence) {
			return `${html.slice(0, openEndIndex)}\n${innerHtml}\n${html.slice(closeIndex)}`;
		}

		seen += 1;
		searchFrom = closeIndex + '</div>'.length;
	}

	return html;
}

export function replaceInventoryCardCollections(html: string, templateFile: string) {
	const gridCards = daynightVehicles
		.map((vehicle, index) => renderInventoryGridCard(vehicle, index))
		.join('\n');

	if (templateFile === 'listing-grid4-columns.html') {
		return [
			'grid grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-40',
			'grid grid-cols-3 lg-grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-41',
			'grid grid-cols-4 xl-grid-cols-3 lg-grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-41'
		].reduce(
			(output, className) => replaceDivInnerByExactClass(output, className, gridCards),
			html
		);
	}

	if (templateFile === 'listing-gridstyle-halfmap.html') {
		const listCards = renderInventoryMapCardCollection();
		const withListCards = replaceDivInnerByExactClass(html, 'grid grid-cols-1 gap-20', listCards);

		return replaceDivInnerByExactClass(
			withListCards,
			'grid grid-cols-2 md-grid-cols-1 gap-x-30 gap-y-41 mb-28',
			gridCards
		);
	}

	return html;
}

type QuickSelectOption = {
	value: string;
	label: string;
	/* Brands that actually stock this option — lets the runtime scope the
	   Модел menu to the selected Марка. */
	brands?: string[];
};

const mileageOptions = [
	{ value: 'under-100000', label: 'До 100 000 км' },
	{ value: 'under-150000', label: 'До 150 000 км' },
	{ value: 'under-200000', label: 'До 200 000 км' },
	{ value: 'over-200000', label: 'Над 200 000 км' }
] as const;

function renderQuickSelect(
	name: string,
	label: string,
	placeholder: string,
	options: readonly QuickSelectOption[],
	idPrefix = 'daynight-quick'
) {
	const fieldId = `${idPrefix}-${name}`;
	const menuId = `${fieldId}-menu`;
	const visuallyHiddenStyle =
		'position:absolute;inline-size:1px;block-size:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0;padding:0;margin:-1px;';
	const optionHtml = options
		.map(
			(option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`
		)
		.join('');
	const menuOptionHtml = [{ value: '', label: placeholder } as QuickSelectOption, ...options]
		.map((option, index) => {
			const checked = index === 0 ? ' checked' : '';
			const brandsAttr = option.brands?.length
				? ` data-daynight-option-brands="${escapeHtml(option.brands.join('|'))}"`
				: '';

			return `<label class="filter-checkbox">
<input type="checkbox" name="${escapeHtml(idPrefix)}-${escapeHtml(name)}" value="${escapeHtml(option.value)}" data-daynight-quick-option${checked}${brandsAttr}>
<span>${escapeHtml(option.label)}</span>
</label>`;
		})
		.join('');

	return `<div class="daynight-inventory-filter-field daynight-inventory-quick-field daynight-inventory-quick-field--${escapeHtml(name)}">
<div class="daynight-inventory-filter-dropdown bg-white filter-select-dropdown" data-name="${escapeHtml(label)}" data-daynight-quick-dropdown>
<label for="${escapeHtml(fieldId)}" class="daynight-inventory-filter-dropdown__label">${escapeHtml(label)}</label>
<input type="checkbox" id="${escapeHtml(fieldId)}" class="filter-select-dropdown__toggle" aria-hidden="true" tabindex="-1" style="${visuallyHiddenStyle}">
<button type="button" class="filter-select-dropdown__text" aria-expanded="false" aria-controls="${escapeHtml(menuId)}" title="${escapeHtml(label)}">
<span data-daynight-quick-value>${escapeHtml(label)}</span>
</button>
<select class="daynight-inventory-quick-select" name="${escapeHtml(name)}" aria-hidden="true" tabindex="-1" style="${visuallyHiddenStyle}">
<option value="">${escapeHtml(placeholder)}</option>
${optionHtml}
</select>
<div class="filter-select-dropdown__menu" id="${escapeHtml(menuId)}" role="listbox" aria-label="${escapeHtml(label)}" aria-hidden="true">
<div class="filter-select-dropdown__list">${menuOptionHtml}</div>
</div>
</div>
</div>`;
}

export function renderInventoryQuickFilters() {
	const brandOptions = uniqueSorted(daynightVehicles.map((vehicle) => vehicle.brand)).map(
		(brand) => ({
			value: brand,
			label: brand
		})
	);
	const brandsByModel = new Map<string, Set<string>>();
	for (const vehicle of daynightVehicles) {
		const brands = brandsByModel.get(vehicle.model) ?? new Set<string>();
		brands.add(vehicle.brand);
		brandsByModel.set(vehicle.model, brands);
	}
	const modelOptions = uniqueSorted(daynightVehicles.map((vehicle) => vehicle.model)).map(
		(model) => ({
			value: model,
			label: model,
			brands: [...(brandsByModel.get(model) ?? [])].sort((a, b) => a.localeCompare(b, 'bg'))
		})
	);
	const fuelOptions = uniqueSorted(daynightVehicles.map((vehicle) => vehicle.fuel)).map((fuel) => ({
		value: fuel,
		label: fuel
	}));
	const transmissionOptions = uniqueSorted(
		daynightVehicles.map((vehicle) => vehicle.transmission)
	).map((transmission) => ({
		value: transmission,
		label: transmission
	}));
	const bodyOptions = uniqueSorted(daynightVehicles.map((vehicle) => vehicle.body)).map((body) => ({
		value: body,
		label: body
	}));
	const priceOptions = [
		{ value: 'under-10000', label: 'До 10 000 EUR' },
		{ value: 'under-20000', label: 'До 20 000 EUR' },
		{ value: 'under-30000', label: 'До 30 000 EUR' },
		{ value: 'under-50000', label: 'До 50 000 EUR' },
		{ value: 'over-50000', label: 'Над 50 000 EUR' }
	] as const;
	const featureOptions = uniqueSorted(daynightVehicles.flatMap((vehicle) => vehicle.features)).map(
		(feature) => ({
			value: feature,
			label: feature
		})
	);
	return `<div class="col-md-12 daynight-inventory-controls">
<h1 class="daynight-inventory-heading">Налични автомобили</h1>
<form class="daynight-inventory-quick-form" data-daynight-inventory-filter aria-label="Бързи филтри">
<div class="daynight-inventory-searchbar">
<div class="daynight-inventory-search">
<label class="daynight-inventory-searchbar__label" for="daynight-inventory-search">Търсене</label>
<input id="daynight-inventory-search" class="daynight-inventory-search__input" type="search" name="q" autocomplete="off" placeholder="Търси по марка, модел, година, гориво, екстри...">
</div>
<button class="daynight-inventory-searchbar__submit flex items-center gap-8 justify-center" type="submit"><img src="/assets/icons/search.svg" alt="" aria-hidden="true"><span>Търси</span></button>
</div>
<div class="daynight-inventory-filter-group daynight-inventory-filterbar">
<button class="daynight-inventory-filter-toggle daynight-inventory-quick-sidebar" type="button" data-daynight-open-sidebar aria-label="Филтри"><img src="/assets/icons/filter.svg" alt="" aria-hidden="true"></button>
${renderQuickSelect('brand', 'Марка', 'Всички марки', brandOptions)}
${renderQuickSelect('model', 'Модел', 'Всички модели', modelOptions)}
${renderQuickSelect('price', 'Цена', 'Всички цени', priceOptions)}
${renderQuickSelect('mileage', 'Пробег', 'Всички пробези', mileageOptions)}
${renderQuickSelect('fuel', 'Гориво', 'Всички горива', fuelOptions)}
${renderQuickSelect('transmission', 'Скорости', 'Всички скорости', transmissionOptions)}
${renderQuickSelect('body', 'Купе', 'Всички купета', bodyOptions)}
${renderQuickSelect('feature', 'Екстри', 'Всички екстри', featureOptions)}
</div>
<div class="daynight-inventory-type-pills" aria-label="Бърз избор">
${renderInventoryTypePills()}
</div>
</form>
<p class="daynight-inventory-empty" aria-live="polite" hidden>Няма автомобили по избраните филтри.</p>
</div>`;
}
