import { agents } from '$lib/data/agents';
import { eliqautoAssets, eliqautoBrand, eliqautoContact } from '$lib/data/eliqauto';
import { posts } from '$lib/data/blog';
import { bodyTypes, brands, fuels, vehicles, type Vehicle } from '$lib/data/vehicles';
import {
	homeFiveBrandCards as home05BrandCards,
	homeFiveReviewItems as reviewItems,
	homeFiveTypeCards as home05TypeCards,
	homeFiveVehiclePills as home05VehiclePills,
	imageForHomeFiveVehicle as imageForVehicle
} from '$lib/auxero/home-five';

const escapeHtml = (value: string | number) =>
	String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');

const km = (value: number) => `${value.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} km`;

const iconArrow = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M8.125 0C6.51803 0 4.94714 0.476523 3.611 1.36931C2.27485 2.2621 1.23344 3.53105 0.618482 5.0157C0.00352044 6.50035 -0.157382 8.13401 0.156123 9.71011C0.469628 11.2862 1.24346 12.7339 2.37976 13.8702C3.51606 15.0065 4.9638 15.7804 6.5399 16.0939C8.11599 16.4074 9.74966 16.2465 11.2343 15.6315C12.719 15.0166 13.9879 13.9752 14.8807 12.639C15.7735 11.3029 16.25 9.73197 16.25 8.125C16.2477 5.97081 15.391 3.90551 13.8677 2.38227C12.3445 0.85903 10.2792 0.00227486 8.125 0ZM11.6922 8.56719L9.19219 11.0672C9.07492 11.1845 8.91586 11.2503 8.75 11.2503C8.58415 11.2503 8.42509 11.1845 8.30782 11.0672C8.19054 10.9499 8.12466 10.7909 8.12466 10.625C8.12466 10.4591 8.19054 10.3001 8.30782 10.1828L9.74141 8.75H5C4.83424 8.75 4.67527 8.68415 4.55806 8.56694C4.44085 8.44973 4.375 8.29076 4.375 8.125C4.375 7.95924 4.44085 7.80027 4.55806 7.68306C4.67527 7.56585 4.83424 7.5 5 7.5H9.74141L8.30782 6.06719C8.19054 5.94991 8.12466 5.79085 8.12466 5.625C8.12466 5.45915 8.19054 5.30009 8.30782 5.18281C8.42509 5.06554 8.58415 4.99965 8.75 4.99965C8.91586 4.99965 9.07492 5.06554 9.19219 5.18281L11.6922 7.68281C11.7503 7.74086 11.7964 7.80979 11.8279 7.88566C11.8593 7.96154 11.8755 8.04287 11.8755 8.125C11.8755 8.20713 11.8593 8.28846 11.8279 8.36434C11.7964 8.44021 11.7503 8.50914 11.6922 8.56719Z" fill="#1C1C1C"/>
</svg>`;

const compareIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
	<g clip-path="url(#clip0_eliqauto_home_compare)">
		<path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="M6.875 10H13.125" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="M10 6.875V13.125" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
	</g>
</svg>`;

const heartIcon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M8 14C8 14 1.5 10.5 1.5 6.375C1.5 5.47989 1.85558 4.62145 2.48851 3.98851C3.12145 3.35558 3.97989 3 4.875 3C6.28688 3 7.49625 3.76937 8 5C8.50375 3.76937 9.71312 3 11.125 3C12.0201 3 12.8785 3.35558 13.5115 3.98851C14.1444 4.62145 14.5 5.47989 14.5 6.375C14.5 10.5 8 14 8 14Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const typeImages = [
	'/assets/images/card/card-27.webp',
	'/assets/images/card/card-28.webp',
	'/assets/images/card/card-29.webp',
	'/assets/images/card/card-30.webp',
	'/assets/images/card/card-31.webp',
	'/assets/images/card/card-32.webp',
	'/assets/images/card/card-33.webp',
	'/assets/images/card/card-34.webp'
] as const;

const brandImages: Record<string, string> = {
	Audi: '/assets/images/brand/brand-3.webp',
	BMW: '/assets/images/brand/brand-1.webp',
	'Mercedes-Benz': '/assets/images/brand/brand-2.webp',
	Mazda: '/assets/images/brand/brand-10.webp',
	Toyota: '/assets/images/brand/brand-5.webp',
	Ford: '/assets/images/brand/brand-7.webp',
	Honda: '/assets/images/brand/brand-4.webp',
	Volvo: '/assets/images/brand/brand-6.webp',
	Hyundai: '/assets/images/brand/brand-8.webp',
	Kia: '/assets/eliqauto/brands/kia-transparent.webp',
	Ferrari: '/assets/images/brand/brand-11.webp',
	Tesla: '/assets/images/brand/brand-12.webp'
};

const brandShowcase = [
	{ count: 18, name: 'BMW', query: 'BMW' },
	{ count: 22, name: 'Mercedes', query: 'Mercedes-Benz' },
	{ count: 38, name: 'Audi', query: 'Audi' },
	{ count: 29, name: 'Honda', query: 'Honda' },
	{ count: 23, name: 'Toyota', query: 'Toyota' },
	{ count: 32, name: 'Volvo', query: 'Volvo' },
	{ count: 24, name: 'Ford', query: 'Ford' },
	{ count: 22, name: 'Hyundai', query: 'Hyundai' },
	{ count: 14, name: 'Kia', query: 'Kia' },
	{ count: 32, name: 'Mazda', query: 'Mazda' },
	{ count: 24, name: 'Ferrari', query: 'Ferrari' },
	{ count: 27, name: 'Tesla', query: 'Tesla' }
] as const;

const brandCountLabel = (count: number) => `${count} Vehicles`;

const replaceSectionByComment = (
	html: string,
	startComment: string,
	endComment: string,
	replacement: string
) => {
	const start = html.indexOf(startComment);
	const end = html.indexOf(endComment, start + startComment.length);

	if (start < 0 || end < 0) return html;

	return `${html.slice(0, start)}${replacement}${html.slice(end + endComment.length)}`;
};

const findClosingDivIndex = (html: string, openDivIndex: number) => {
	const pattern = /<\/?div\b[^>]*>/gi;
	pattern.lastIndex = openDivIndex;
	let depth = 0;
	let match: RegExpExecArray | null;

	while ((match = pattern.exec(html))) {
		if (match[0].startsWith('</')) {
			depth -= 1;
		} else {
			depth += 1;
		}

		if (depth === 0) return match.index + match[0].length;
	}

	return -1;
};

const replaceDivBlock = (html: string, start: number, replacement: string) => {
	if (start < 0) return html;

	const end = findClosingDivIndex(html, start);

	if (end < 0) return html;

	return `${html.slice(0, start)}${replacement}${html.slice(end)}`;
};

const replaceFirstDivAfter = (
	html: string,
	marker: string,
	blockStart: string,
	replacement: string
) => {
	const markerIndex = html.indexOf(marker);
	if (markerIndex < 0) return html;

	const start = html.indexOf(blockStart, markerIndex);

	return replaceDivBlock(html, start, replacement);
};

const optionCheckbox = (
	name: string,
	value: string,
	label = value,
	checked = false
) => `<label class="filter-checkbox">
	<input type="checkbox" name="${escapeHtml(name)}" value="${escapeHtml(value)}" ${checked ? 'checked' : ''}>
	<span>${escapeHtml(label)}</span>
</label>`;

const heroSelect = (
	id: string,
	name: string,
	title: string,
	defaultLabel: string,
	options: string[]
) => `<div class="search-cars__select-wrapper">
	<div class="search-cars__select bg-white filter-select-dropdown" data-name="${escapeHtml(name)}">
		<label for="${escapeHtml(id)}" class="search-cars__label">${escapeHtml(title)}</label>
		<input type="checkbox" id="${escapeHtml(id)}" class="filter-select-dropdown__toggle">
		<label for="${escapeHtml(id)}" class="filter-select-dropdown__text">
			<span>${escapeHtml(defaultLabel)}</span>
		</label>
		<div class="filter-select-dropdown__menu">
			<div class="filter-select-dropdown__list">
				${optionCheckbox(name, '', defaultLabel, true)}
				${options.map((option) => optionCheckbox(name, option)).join('\n')}
			</div>
		</div>
	</div>
</div>`;

const replaceHero = (html: string) => {
	const backgrounds = [
		eliqautoAssets.hero,
		vehicles[0]?.image,
		vehicles[1]?.image,
		vehicles[2]?.image
	]
		.filter(Boolean)
		.map(
			(image) => `<div class="swiper-slide">
		<div class="tp-showcase-slider-bg" data-background="${escapeHtml(image)}" style="background-image: url('${escapeHtml(
			image
		)}')"></div>
	</div>`
		)
		.join('\n');
	const wrapperStart = html.indexOf(
		'<div class="swiper-wrapper">',
		html.indexOf('page-title--slider')
	);
	let next = replaceDivBlock(
		html,
		wrapperStart,
		`<div class="swiper-wrapper">
	${backgrounds}
</div>`
	);
	const searchStart = next.indexOf(
		'<div class="search-cars container',
		next.indexOf('page-title-style-7')
	);
	const models = vehicles.map((vehicle) => vehicle.model).slice(0, 8);
	const priceOptions = ['30000', '50000', '80000', '120000'].map((value) => `${value} EUR`);
	const heroSearch = `<div class="search-cars container margin-top-auto wow fadeInUp" data-wow-delay="0.1s">
	<h1 class="search-cars__title">Find Your Next Eliqauto Vehicle</h1>
	<p class="search-cars__subtitle text-white mb-20">${escapeHtml(eliqautoBrand.tagline)}</p>

	<div class="flat-tabs mb-16">
		<div class="overflow-x-auto">
			<ul class="menu-tab menu-tab-style1 text-white">
				<li class="active"><span class="text-white font-weight-600">All Vehicles</span></li>
				<li><span class="text-white font-weight-600">New Listings</span></li>
				<li><span class="text-white font-weight-600">Client Vehicles</span></li>
			</ul>
		</div>
	</div>

	<div class="search-cars__filters">
		${heroSelect('HomeBrandSelectToggle', 'brand', 'Select Brand', 'All Brand', brands)}
		${heroSelect('HomeModelSelectToggle', 'query', 'Select Model', 'All Model', models)}
		${heroSelect('HomeBodySelectToggle', 'bodyType', 'Body Type', 'All Body Types', bodyTypes)}
		${heroSelect('HomePriceSelectToggle', 'maxPrice', 'Max Price', 'All Price', priceOptions)}
		<div class="search-cars__filter" id="filterToggle">
			<img src="/assets/icons/filter.svg" alt="Filter">
		</div>
		<button type="submit" class="search-cars__search flex items-center gap-8 justify-center md-w-full">
			<img src="/assets/icons/search.svg" alt="search">
			Show ${vehicles.length} Matches
		</button>
	</div>

	<div class="search-cars__advanced" id="advancedFilters">
		<div class="search-cars__advanced-content">
			<div class="search-cars__advanced-row">
				${heroSelect('HomeFuelSelectToggle', 'fuel', 'Fuel Type', 'All Fuel Types', fuels)}
				${heroSelect(
					'HomeTransmissionSelectToggle',
					'transmission',
					'Transmission',
					'All Transmissions',
					Array.from(new Set(vehicles.map((vehicle) => vehicle.transmission))).sort()
				)}
				${heroSelect('HomeStatusSelectToggle', 'status', 'Status', 'All Statuses', [
					'available',
					'new',
					'client'
				])}
				<div class="search-cars__range">
					<p class="search-cars__range-label">
						Year: <span id="yearMin">2015</span> - <span id="yearMax">2026</span>
					</p>
					<div class="search-cars__range-wrapper" id="yearRangeWrapper">
						<div id="slider-range" data-min="2015" data-max="2026" data-step="1" data-values="2015, 2026"></div>
					</div>
				</div>
			</div>
			<div class="divider mt-28 mb-24"></div>
			<div class="search-cars__features">
				<p class="h3 search-cars__features-title flex items-center gap-8">
					Eliqauto Checks
					<img src="/assets/icons/minus.svg" alt="minus">
				</p>
				<div class="search-cars__features-grid">
					${[
						'Verified source listing',
						'History review',
						'Mileage review',
						'Document trail',
						'Import & leasing support',
						'Registration readiness',
						'Viewing by appointment',
						'Client vehicle intake'
					]
						.map(
							(feature, index) => `<div class="form-group">
						<input type="checkbox" id="HomeFeature${index}" name="feature" value="${escapeHtml(feature)}">
						<label for="HomeFeature${index}">${escapeHtml(feature)}</label>
					</div>`
						)
						.join('\n')}
				</div>
			</div>
		</div>
	</div>
</div>`;

	next = replaceDivBlock(next, searchStart, heroSearch);

	return next.replace('<form action="#">', '<form action="/inventory" method="get">');
};

const sectionButton = (
	href: string,
	label: string,
	extraClass = 'btn btn-line-style-2 effect-line-primary btn-large hover-fill-white'
) =>
	`<a href="${href}" class="${extraClass}">
		${escapeHtml(label)}
		${iconArrow}
	</a>`;

const typeRail = () => {
	const counts = new Map(
		bodyTypes.map((body) => [body, vehicles.filter((vehicle) => vehicle.bodyType === body).length])
	);
	const orderedTypes = bodyTypes.slice(0, 8);

	return `<!-- Browse By Type -->
<section class="py-100">
	<div class="container">
		<div class="title-section mb-28 wow fadeInDown" data-wow-delay="0.1s">
			<h2 class="">Browse By Type</h2>
			${sectionButton('/inventory?view=4', 'Check All Car Types')}
		</div>
		<div class="swiper-container swiper-card-8">
			<div class="swiper-wrapper">
				${orderedTypes
					.map(
						(type, index) => `<div class="swiper-slide">
					<a href="/inventory?bodyType=${encodeURIComponent(type)}" class="card-box-style-5 wow fadeIn" data-wow-delay="0.${(index % 4) + 1}s">
						<div class="image">
							<img src="${typeImages[index % typeImages.length]}" alt="${escapeHtml(type)}">
						</div>
						<div class="content">
							<p class="h4 mb-4 link">${escapeHtml(type)}</p>
							<p class="text-sm text-muted">${counts.get(type) ?? 0} Vehicles</p>
						</div>
					</a>
				</div>`
					)
					.join('\n')}
			</div>
			<div class="swiper-pagination pagination-dark pagination-style pagination-swiper-card-8 mt-38"></div>
		</div>
	</div>
</section>
<!-- /Browse By Type -->`;
};

const cardMeta = (
	vehicle: Vehicle,
	dark = false
) => `<ul class="tag ${dark ? 'mb-10' : 'style2 mb-10'}">
	<li><img src="/assets/icons/${dark ? 'icon-gauge-2.svg' : 'icon-gauge.svg'}" alt="mileage"><span>${km(vehicle.mileage)}</span></li>
	<li><img src="/assets/icons/${dark ? 'calendar-2.svg' : 'calendar.svg'}" alt="year"><span>${vehicle.year}</span></li>
	<li><img src="/assets/icons/${dark ? 'gaspump-2.svg' : 'gaspump.svg'}" alt="fuel"><span>${escapeHtml(vehicle.fuel)}</span></li>
	<li><img src="/assets/icons/${dark ? 'auto-2.svg' : 'auto.svg'}" alt="transmission"><span>${escapeHtml(vehicle.transmission)}</span></li>
</ul>`;

const homeVehicleCard = (vehicle: Vehicle, index: number) => {
	const url = `/inventory/${encodeURIComponent(vehicle.slug)}`;
	const highlightClass = 'bg-primary-2';

	return `<div class="card-box card-box-style-1 wow fadeIn" data-wow-delay="0.${(index % 4) + 1}s" data-eliqauto-slug="${escapeHtml(vehicle.slug)}">
	<div class="top">
		<p class="${highlightClass} text-white highlight">${escapeHtml(vehicle.tag ?? 'Available')}</p>
		<p class="heart eliqauto-favorite" role="button" tabindex="0" aria-label="Запази ${escapeHtml(vehicle.title)}">${heartIcon}</p>
	</div>
	<div class="image">
		<a href="${url}">
			<img class="card--img" src="${escapeHtml(imageForVehicle(vehicle))}" alt="${escapeHtml(vehicle.title)}">
		</a>
	</div>
	<div class="content border-light border-top-none">
		<div class="bottom">
			<p class="category uppercase text-white"><a href="${url}" class="text-white uppercase text-xs">${escapeHtml(vehicle.brand)}</a></p>
			<div class="flex items-center gap-8">
				<p class="category uppercase text-white"><img src="/assets/icons/picture.svg" alt="photos"> ${vehicle.images.length || 1}</p>
				<p class="category uppercase text-white"><img src="/assets/icons/play.svg" alt="video"> 0</p>
			</div>
		</div>
		<p class="h6 card-box__title mb-8"><a href="${url}">${escapeHtml(vehicle.title)}</a></p>
		${cardMeta(vehicle)}
		<p class="h6 card-box__price mb-15 flex justify-between gap-8 items-center">
			${escapeHtml(vehicle.priceLabel)}
			<span class="text-sm">${vehicle.monthly.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} EUR/mo</span>
		</p>
		<div class="divider mb-15"></div>
		<div class="flex justify-between">
			<p class="compare-details btn btn-small open-modal" data-modal-id="#CompareModal" data-eliqauto-compare="${escapeHtml(vehicle.slug)}" role="button" tabindex="0">
				${compareIcon}
				Compare
			</p>
			<a href="${url}" class="view-details">View details <img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt="view details"></a>
		</div>
	</div>
</div>`;
};

const home05HeroSlide = () => `<div class="swiper-slide">
	<h1 class="search-cars__title text-center effect-item effect-up delay-3">Browse, Compare, Drive <br class="lg-hide"> With Eliqauto!</h1>
	<p class="h7 text-white mb-36 text-center effect-item effect-up delay-4">${escapeHtml(eliqautoBrand.tagline)} and clear appointment support.</p>
	<a href="/inventory" class="btn btn-white text-primary btn-large-2 font-weight-600 max-w-min capitalize mx-auto effect-item effect-up delay-5">
		View Inventory
	</a>
</div>`;

const replaceHome05Hero = (html: string) => {
	const backgrounds = eliqautoAssets.homeHeroSlides
		.filter(Boolean)
		.map(
			(image) => `<div class="swiper-slide">
	<div class="tp-showcase-slider-bg" data-background="${escapeHtml(image)}" style="background-image: url('${escapeHtml(
		image
	)}')"></div>
</div>`
		)
		.join('\n');
	let next = replaceFirstDivAfter(
		html,
		'page-title--slider',
		'<div class="swiper-wrapper"',
		`<div class="swiper-wrapper">
${backgrounds}
</div>`
	);
	const searchStart = next.indexOf(
		'<div class="search-cars container thumb effect-zoom-item">',
		next.indexOf('page-title-style-4')
	);
	const models = vehicles.map((vehicle) => vehicle.model).slice(0, 8);
	const priceOptions = ['30 000 EUR', '50 000 EUR', '80 000 EUR', '120 000 EUR'];
	const heroSearch = `<div class="search-cars container thumb effect-zoom-item">
	<div class="sw-single-thumb swiper">
		<div class="swiper-wrapper">
			${Array.from({ length: 4 }, home05HeroSlide).join('\n')}
		</div>
	</div>

	<div class="flat-tabs mb-16">
		<div class="overflow-x-auto">
			<ul class="menu-tab menu-tab-style1 text-white margin-auto">
				<li class="active"><span class="text-white font-weight-600">All Vehicles</span></li>
				<li><span class="text-white font-weight-600">New Listings</span></li>
				<li><span class="text-white font-weight-600">Client Vehicles</span></li>
			</ul>
		</div>
	</div>

	<!-- Primary Search Filters -->
	<div class="search-cars__filters">
		${heroSelect('Home05BrandSelectToggle', 'brand', 'Select Brand', 'All Brand', brands)}
		${heroSelect('Home05ModelSelectToggle', 'q', 'Select Model', 'All Model', models)}
		${heroSelect('Home05BodySelectToggle', 'bodyType', 'Body Type', 'All Body Types', bodyTypes)}
		${heroSelect('Home05MaxPriceSelectToggle', 'maxPrice', 'Max Price', 'All Price', priceOptions)}
		<div class="search-cars__filter" id="filterToggle">
			<img src="/assets/icons/filter.svg" alt="Filter">
		</div>
		<button type="submit" class="search-cars__search flex items-center gap-8 justify-center md-w-full">
			<img src="/assets/icons/search.svg" alt="search">
			Show ${vehicles.length} Matches
		</button>
	</div>

	<!-- Advanced Filters Panel -->
	<div class="search-cars__advanced" id="advancedFilters">
		<div class="search-cars__advanced-content">
			<div class="search-cars__advanced-row">
				${heroSelect('Home05FuelSelectToggle', 'fuel', 'Fuel Type', 'All Fuel Types', fuels)}
				${heroSelect(
					'Home05TransmissionSelectToggle',
					'transmission',
					'Transmission',
					'All Transmissions',
					Array.from(new Set(vehicles.map((vehicle) => vehicle.transmission))).sort()
				)}
				${heroSelect('Home05StatusSelectToggle', 'status', 'Status', 'All Statuses', [
					'New listing',
					'Available',
					'Client vehicle'
				])}
				<div class="search-cars__range">
					<p class="search-cars__range-label">
						Year: <span id="yearMin">2015</span> - <span id="yearMax">2026</span>
					</p>
					<div class="search-cars__range-wrapper" id="yearRangeWrapper">
						<div id="slider-range" data-min="2015" data-max="2026" data-step="1" data-values="2015, 2026"></div>
					</div>
				</div>
			</div>
			<div class="divider mt-28 mb-24"></div>
			<div class="search-cars__features">
				<p class="h3 search-cars__features-title flex items-center gap-8">
					Eliqauto Checks
					<img src="/assets/icons/minus.svg" alt="minus">
				</p>
				<div class="search-cars__features-grid">
					${[
						'Verified source listing',
						'History review',
						'Mileage review',
						'Document trail',
						'Import & leasing support',
						'Registration readiness',
						'Viewing by appointment',
						'Client vehicle intake'
					]
						.map(
							(feature, index) => `<div class="form-group">
						<input type="checkbox" id="Home05Feature${index}" name="feature" value="${escapeHtml(feature)}">
						<label for="Home05Feature${index}">${escapeHtml(feature)}</label>
					</div>`
						)
						.join('\n')}
				</div>
			</div>
		</div>
	</div>
</div>`;

	next = replaceDivBlock(next, searchStart, heroSearch);

	return next.replace(
		'<form action="#">',
		'<form action="/inventory" method="get" data-eliqauto-search-form="inventory">'
	);
};

const home05CardMeta = (
	vehicle: Vehicle,
	style2 = false
) => `<ul class="tag mb-10${style2 ? ' style2' : ''}">
	<li>
		<img src="/assets/icons/icon-gauge.svg" alt="mileage">
		<span>${km(vehicle.mileage)}</span>
	</li>
	<li>
		<img src="/assets/icons/calendar.svg" alt="year">
		<span>${vehicle.year}</span>
	</li>
	<li>
		<img src="/assets/icons/gaspump.svg" alt="fuel">
		<span>${escapeHtml(vehicle.fuel)}</span>
	</li>
	<li>
		<img src="/assets/icons/${vehicle.transmission === 'Manual' ? 'manual.svg' : 'auto.svg'}" alt="transmission">
		<span>${escapeHtml(vehicle.transmission)}</span>
	</li>
</ul>`;

const home05VehicleCard = (vehicle: Vehicle, style2 = false) => {
	const url = `/inventory/${encodeURIComponent(vehicle.slug)}`;
	const highlightClass = 'bg-primary-2';
	const highlight = vehicle.tag ?? (vehicle.isClientVehicle ? 'Client vehicle' : 'Available');

	return `<div class="card-box card-box-style-1 eliqauto-no-image-zoom" data-eliqauto-slug="${escapeHtml(vehicle.slug)}">
	<div class="top">
		<p class="${highlightClass} text-white highlight">${escapeHtml(highlight)}</p>
		<p class="heart eliqauto-favorite" role="button" tabindex="0" aria-label="Запази ${escapeHtml(vehicle.title)}">${heartIcon}</p>
	</div>
	<div class="image">
		<a href="${url}">
			<img class="card--img" src="${escapeHtml(imageForVehicle(vehicle))}" alt="${escapeHtml(vehicle.title)}">
		</a>
	</div>
	<div class="content border-light border-top-none">
		<div class="bottom">
			<p class="category uppercase text-white">
				<a href="/inventory?brand=${encodeURIComponent(vehicle.brand)}" class="text-white uppercase text-xs">${escapeHtml(vehicle.brand)}</a>
			</p>
			<div class="flex items-center gap-8">
				<p class="category uppercase text-white"><img src="/assets/icons/picture.svg" alt="photos"> ${vehicle.images.length || 1}</p>
				<p class="category uppercase text-white"><img src="/assets/icons/play.svg" alt="video"> 0</p>
			</div>
		</div>
		<p class="h6 card-box__title mb-8">
			<a href="${url}">${escapeHtml(vehicle.title)}</a>
		</p>
		${home05CardMeta(vehicle, style2)}
		<p class="h6 card-box__price mb-15 flex justify-between gap-8 items-center">
			${escapeHtml(vehicle.priceLabel)}
			<span class="text-sm">
				${vehicle.monthly.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} EUR/mo
				<a href="/financing" class="text-underline ml-2 text-muted text-xs">See Finance</a>
			</span>
		</p>
		<div class="divider mb-15"></div>
		<div class="flex justify-between">
			<p class="compare-details btn btn-small open-modal" data-modal-id="#CompareModal" data-eliqauto-compare="${escapeHtml(vehicle.slug)}" role="button" tabindex="0">
				${compareIcon}
				Compare
			</p>
			<a href="${url}" class="view-details">
				View details
				<img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt="view details">
			</a>
		</div>
	</div>
</div>`;
};

const home05FeaturedInventory = () => `<!-- New Vehicles -->
<section class="py-100 background-light">
	<div class="container">
		<div class="title-section mb-40 wow fadeInUp" data-wow-delay="0.1s">
			<h2 class="capitalize">Eliqauto Vehicles</h2>
			${sectionButton('/inventory?view=4', 'View All')}
		</div>
		<div class="eliqauto-vehicle-pills wow fadeIn mb-40 flex items-center justify-center gap-8 overflow-x-auto" data-wow-delay="0.1s">
			<ul class="menu-tab menu-tab-style2 margin-auto gap-10">
				${home05VehiclePills
					.map(
						(pill) =>
							`<li class="eliqauto-vehicle-pill car-box${pill.active ? ' active' : ''}"><a href="${escapeHtml(pill.href)}">${escapeHtml(pill.label)}</a></li>`
					)
					.join('\n')}
			</ul>
		</div>
		<div class="swiper-container swiper-card-wrapper swiper-card-5 wow fadeIn" data-wow-delay="0.1s">
			<div class="swiper-wrapper">
				${vehicles
					.slice(0, 6)
					.map(
						(vehicle) => `<div class="swiper-slide">
					${home05VehicleCard(vehicle)}
				</div>`
					)
					.join('\n')}
			</div>
			<div class="hidden xl-show">
				<div class="swiper-pagination pagination-dark pagination-style pagination-swiper-card-5 mt-35"></div>
			</div>
		</div>
	</div>
</section>
<!-- /New Vehicles -->`;

const home05BrandStrip = () => `<!-- Explore Our Brands -->
<section class="bg-white py-100">
	<div class="container">
		<div class="title-section mb-42 wow fadeInDown" data-wow-delay="0.1s">
			<h2 class="">Explore Our Brands</h2>
			${sectionButton('/inventory', 'View All Brand')}
		</div>
		<div class="swiper-container swiper-outbrand-3 wow fadeIn" data-wow-delay="0.1s">
			<div class="swiper-wrapper">
				${home05BrandCards
					.map(
						(brand, index) => `<div class="swiper-slide">
					<a href="/inventory?brand=${encodeURIComponent(brand.query)}" class="out-brand-2${index === 0 ? ' ' : ''}">
						<span class="eliqauto-brand-logo-frame">
							<img class="out-brand--img" src="${brand.image}" alt="">
						</span>
						<p class="h5">${escapeHtml(brand.name)}</p>
						<p class="text-muted text-sm">${brand.count}</p>
					</a>
				</div>`
					)
					.join('\n')}
			</div>
			<div class="swiper-pagination pagination-dark pagination-style pagination-swiper-outbrand-3 mt-35"></div>
		</div>
	</div>
</section>
<!-- /Explore Our Brands -->`;

const home05TypeGallery = () => `<!-- Browse By Type -->
<section class="py-100 relative bg-primary">
	<div class="container relative">
		<div class="title-section mb-42 wow fadeInDown" data-wow-delay="0.1s">
			<h2 class="text-white text-center">Browse By Type</h2>
			${sectionButton('/inventory?view=4', 'Check All Car Type', 'btn btn-blur hover-fill-primary font-weight-600 btn-large')}
		</div>
	</div>
	<div class="container">
		<div class="container-grid-gallery gallery-scroll">
			<div class="slide-gallery-list scroll">
				${home05TypeCards
					.map(
						(
							typeCard,
							index
						) => `<div class="brand-item-style-2 slide-gallery ${index === 1 ? 'active ' : ''}cursor-pointer">
					<img src="${typeCard.image}" alt="${escapeHtml(typeCard.label)}">
					<a class="brand-item-button" href="/inventory?bodyType=${encodeURIComponent(typeCard.bodyType)}">${escapeHtml(typeCard.label)}</a>
				</div>`
					)
					.join('\n')}
			</div>
		</div>
	</div>
</section>
<!-- /Browse By Type -->`;

const home05ComparePair = (left: Vehicle, right: Vehicle) => `<div class="swiper-slide">
	<div class="card-box-style-4">
		<div class="image">
			<img class="w-full" src="${escapeHtml(imageForVehicle(left))}" alt="${escapeHtml(left.title)}">
			<img class="w-full" src="${escapeHtml(imageForVehicle(right))}" alt="${escapeHtml(right.title)}">
		</div>
		<div class="content">
			<div class="flex justify-between gap-12 mb-12">
				<div>
					<p class="text-xs uppercase text-underline text-muted mb-4">${escapeHtml(left.brand)}</p>
					<p class="h7">${escapeHtml(left.title)}</p>
					<p class="h6">${escapeHtml(left.priceLabel)}</p>
				</div>
				<div class="text-right">
					<p class="text-xs uppercase text-underline text-muted mb-4">${escapeHtml(right.brand)}</p>
					<p class="h7">${escapeHtml(right.title)}</p>
					<p class="h6">${escapeHtml(right.priceLabel)}</p>
				</div>
			</div>
			<a href="/compare?ids=${encodeURIComponent(left.slug)},${encodeURIComponent(right.slug)}" class="btn btn-small btn-line-1 text-sm">
				${compareIcon}
				Compare
			</a>
		</div>
	</div>
</div>`;

const home05CompareSection = () => `<!-- Compare Top Rated Vehicles -->
<section class="background-light py-100">
	<div class="container">
		<div class="title-section mb-40 wow fadeInUp" data-wow-delay="0.1s">
			<h2 class="">Compare Top Rated Vehicles</h2>
			${sectionButton('/compare', 'View All')}
		</div>
		<div class="swiper-container swiper-card-2 wow fadeIn" data-wow-delay="0.1s">
			<div class="swiper-wrapper">
				${home05ComparePair(vehicles[0], vehicles[1])}
				${home05ComparePair(vehicles[2], vehicles[3])}
			</div>
			<div class="hidden md-block">
				<div class="swiper-pagination pagination-dark pagination-style pagination-swiper-card-2 mt-35"></div>
			</div>
		</div>
	</div>
</section>
<!-- /Compare Top Rated Vehicles -->`;

const home05BudgetSection = () => `<!-- Used Cars by Budget -->
<section class="py-100 flat-tabs">
	<div class="container">
		<div class="flex items-center justify-center mb-40 wow fadeInUp">
			<h2>Eliqauto by Budget</h2>
		</div>
		<div class="flex items-center justify-center overflow-x-auto mb-40 gap-8 wow fadeIn" data-wow-delay="0.1s">
			<ul class="menu-tab menu-tab-style2 margin-auto gap-10">
				<li class="car-box">All Cars</li>
				<li class="active car-box">20 000 - 50 000 EUR</li>
				<li class="car-box">50 000 - 70 000 EUR</li>
				<li class="car-box">70 000 - 100 000 EUR</li>
				<li class="car-box">100 000+ EUR</li>
			</ul>
		</div>
	</div>
	<div class="container wow fadeIn" data-wow-delay="0.2s">
		<div class="content-tab">
			<div class="content-inner active">
				<div class="grid grid-cols-3 xl-grid-cols-2 sm-grid-cols-1 gap-30">
					${vehicles
						.slice(0, 9)
						.map((vehicle) => home05VehicleCard(vehicle, true))
						.join('\n')}
				</div>
			</div>
		</div>
	</div>
</section>
<!-- /Used Cars by Budget -->`;

const home05ReviewsSection = () => `<!-- Clients Reviews -->
<section class="background-light py-100">
	<div class="container">
		<div class="title-section mb-38 wow fadeInDown" data-wow-delay="0.1s">
			<h2 class="">Client Reviews</h2>
			${sectionButton('/reviews', 'View All')}
		</div>
		<div class="swiper-container swiper-testimonior wow fadeIn" data-wow-delay="0.1s">
			<div class="swiper-wrapper">
				${[...reviewItems, ...reviewItems]
					.map(
						(review) => `<div class="swiper-slide">
					<a href="/reviews" class="testimonior-box">
						<div class="flex items-center gap-4 mb-16">${stars}</div>
						<p class="testimonior-box--desc mb-16">${escapeHtml(review.text)}</p>
						<div class="testimonior-box--user">
							<img class="testimonior--img" src="${review.avatar}" alt="${escapeHtml(review.name)}">
							<div class="testimonior-box--user-content">
								<p class="h5 title">${escapeHtml(review.name)}</p>
								<p class="desc">${escapeHtml(review.role)}</p>
							</div>
						</div>
					</a>
				</div>`
					)
					.join('\n')}
			</div>
			<div class="swiper-pagination pagination-dark pagination-style pagination-swiper-testimonior mt-35"></div>
		</div>
	</div>
</section>
<!-- /Clients Reviews -->`;

const home05NewsSection = () => {
	const [featured, second = featured, third = featured] = posts;

	return `<!-- News & Reviews -->
<section class="py-100">
	<div class="container wow fadeIn" data-wow-delay="0.1s">
		<div class="title-section mb-30 wow fadeInDown" data-wow-delay="0.1s">
			<h2 class="capitalize">Eliqauto notes</h2>
			${sectionButton('/blog', 'View All')}
		</div>
		<div class="row">
			<div class="col-lg-6 md-mb-30">
				<a href="/blog/${featured.slug}" class="post-style-2 radius-none eliqauto-no-image-zoom overflow-hidden">
					<img class="post--img flex" src="${featured.image}" alt="${escapeHtml(featured.title)}">
					<div class="content">
						<p class="h5 text-white mb-8 title">${escapeHtml(featured.title)}</p>
						<div class=" flex gap-8 justify-start">
							<span class="text-white text-xs">by Eliqauto</span>
							<span class="text-white text-xs">${escapeHtml(featured.date)}</span>
							<span class="text-xs text-highlight uppercase text-underline">${escapeHtml(featured.category)}</span>
						</div>
					</div>
				</a>
			</div>
			<div class="col-lg-6">
				${[second, third]
					.map(
						(
							post,
							index
						) => `<a href="/blog/${post.slug}" class="post-style-3 eliqauto-no-image-zoom ${index === 0 ? 'mb-20' : ''}">
					<div class="post--img">
						<img class="flex" src="${post.image}" alt="${escapeHtml(post.title)}">
					</div>
					<div class="content">
						<p class="h5 mb-8 title">${escapeHtml(post.title)}</p>
						<div class=" flex gap-8 justify-start">
							<span class="text-xs">by Eliqauto</span>
							<span class="text-xs">${escapeHtml(post.date)}</span>
							<span class="text-xs text-highlight uppercase text-underline">${escapeHtml(post.category)}</span>
						</div>
					</div>
				</a>`
					)
					.join('\n')}
			</div>
		</div>
	</div>
</section>
<!-- /News & Reviews -->`;
};

const featuredInventory = () => {
	const selected = vehicles.slice(0, 6);

	return `<!-- New Vehicles -->
<section class="py-100 flat-tabs background-light radius-40">
	<div class="container">
		<div class="flex items-center justify-center mb-40 wow fadeInUp" data-wow-delay="0.1s">
			<h2>New Eliqauto Vehicles</h2>
		</div>
		<div class="overflow-x-auto flex items-center justify-center mb-40 gap-8">
			<ul class="menu-tab menu-tab-style2 margin-auto gap-10">
				<li class="active car-box">All Vehicles</li>
				<li class="car-box">New Listings</li>
				<li class="car-box">Client Vehicles</li>
				<li class="car-box">Import Import</li>
			</ul>
		</div>
		<div class="content-tab eliqauto-home-featured">
			<div class="content-inner active">
				<div class="grid grid-cols-3 lg-grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-41">
					${selected.map(homeVehicleCard).join('\n')}
				</div>
			</div>
		</div>
		<div class="flex justify-center mt-40">
			<a href="/inventory" class="btn btn-primary btn-large font-weight-600">View Eliqauto Inventory</a>
		</div>
	</div>
</section>
<!-- /New Vehicles -->`;
};

const brandStrip = () => `<!-- Explore Our Brands -->
<section class="bg-white py-100">
	<div class="container">
		<div class="title-section mb-42 wow fadeInDown" data-wow-delay="0.1s">
			<h2 class="">Explore Our Brands</h2>
			${sectionButton('/inventory', 'View All Brands')}
		</div>
	</div>
	<div class="container wow fadeIn" data-wow-delay="0.2s">
		<div class="swiper-container swiper-outbrand-3 wow fadeIn" data-wow-delay="0.1s">
			<div class="swiper-wrapper">
				${brandShowcase
					.map(
						(brand) => `<div class="swiper-slide">
					<a href="/inventory?brand=${encodeURIComponent(brand.query)}" class="out-brand-2">
						<span class="eliqauto-brand-logo-frame">
							<img class="out-brand--img" src="${brandImages[brand.query] ?? '/assets/images/brand/brand-1.webp'}" alt="">
						</span>
						<p class="h5">${escapeHtml(brand.name)}</p>
						<p class="text-muted text-sm">${brandCountLabel(brand.count)}</p>
					</a>
				</div>`
					)
					.join('\n')}
			</div>
			<div class="swiper-pagination pagination-dark pagination-style pagination-swiper-outbrand-3 mt-35"></div>
		</div>
	</div>
</section>
<!-- /Explore Our Brands -->`;

const whyChoose = () => {
	const clientVehicles = vehicles.filter((vehicle) => vehicle.isClientVehicle).length;

	return `<!-- Why Choose Us -->
<section class="py-100 background-light radius-40">
	<div class="container">
		<div class="why-choose-us style2">
			<div class="wow fadeIn" data-wow-delay="0.1s">
				<img class="move5" src="/assets/eliqauto/proof-studio-import-handoff.webp" alt="Eliqauto vehicle handoff">
			</div>
			<div class="wow fadeIn" data-wow-delay="0.2s">
				<h2 class="mb-15">Why Choose Eliqauto?</h2>
				<p class="text-muted mb-20">Eliqauto keeps each purchase grounded in source checks, practical import guidance, document review, and viewing appointments before the next commitment.</p>
				<ul class="list mb-32">
					<li class="flex items-center gap-12 mb-8 font-weight-500 h7 md-items-start"><img src="/assets/icons/check.svg" alt="check">Import-sourced vehicles reviewed before approval.</li>
					<li class="flex items-center gap-12 mb-8 font-weight-500 h7 md-items-start"><img src="/assets/icons/check.svg" alt="check">Mileage, history, and document trail discussed clearly.</li>
					<li class="flex items-center gap-12 mb-8 font-weight-500 h7 md-items-start"><img src="/assets/icons/check.svg" alt="check">Registration and preparation steps explained up front.</li>
					<li class="flex items-center gap-12 mb-8 font-weight-500 h7 md-items-start"><img src="/assets/icons/check.svg" alt="check">Sell-your-car intake for client vehicles.</li>
				</ul>
				<a href="/services" class="btn btn-primary btn-large font-weight-600 max-w-min">Explore Services</a>
			</div>
		</div>
		<div class="grid grid-cols-4 gap-30 md-grid-cols-2 counter-spacing">
			${[
				[String(vehicles.length), 'Eliqauto Listings'],
				[String(brands.length), 'Active Brands'],
				[String(clientVehicles), 'Client Vehicles'],
				['4.9', 'Client Rating']
			]
				.map(
					(
						[value, label],
						index
					) => `<div class="box-couter-item ${index < 3 ? 'outline-right' : ''} wow fadeInUp" data-wow-delay="0.${index + 1}s">
				<div class="content">
					<div class="box-couter counter">
						<div class="number-content font-main-2">
							<span class="count-number font-main-2" data-to="${escapeHtml(value)}" data-speed="1500" data-inviewport="yes">${escapeHtml(value)}</span>${label === 'Client Rating' ? '' : '+'}
						</div>
					</div>
					<p class="font-weight-500 text-muted h7 text-center">${escapeHtml(label)}</p>
				</div>
			</div>`
				)
				.join('\n')}
		</div>
	</div>
</section>
<!-- Why Choose Us -->`;
};

const comparePair = (left: Vehicle, right: Vehicle) => `<div class="swiper-slide">
	<div class="card-box-style-7 style3">
		<div class="image">
			<img src="${escapeHtml(imageForVehicle(left))}" alt="${escapeHtml(left.title)}">
			<img src="${escapeHtml(imageForVehicle(right))}" alt="${escapeHtml(right.title)}">
		</div>
		<div class="content style-2">
			<div class="flex justify-between gap-12 mb-12">
				<div>
					<p class="text-xs uppercase text-underline text-muted mb-4">${escapeHtml(left.brand)}</p>
					<p class="card-box-style-7--title h7 mb-4">${escapeHtml(left.title)}</p>
					<p class="h6">${escapeHtml(left.priceLabel)}</p>
				</div>
				<div class="text-right">
					<p class="text-xs uppercase text-underline text-muted mb-4">${escapeHtml(right.brand)}</p>
					<p class="card-box-style-7--title h7 mb-4">${escapeHtml(right.title)}</p>
					<p class="h6">${escapeHtml(right.priceLabel)}</p>
				</div>
			</div>
			<a href="/compare?ids=${encodeURIComponent(left.slug)},${encodeURIComponent(right.slug)}" class="btn btn-small btn-line-1 text-sm">
				${compareIcon}
				Compare
			</a>
		</div>
	</div>
</div>`;

const compareSection = () => `<!-- Compare Top Rated Vehicles -->
<section class="bg-white py-100">
	<div class="container wow fadeIn" data-wow-delay="0.2s">
		<div class="title-section mb-12 wow fadeInDown" data-wow-delay="0.1s">
			<h2 class="">Compare Top Rated Vehicles</h2>
			${sectionButton('/compare', 'Open Compare')}
		</div>
		<div class="swiper-container swiper-card-3">
			<div class="swiper-wrapper">
				${comparePair(vehicles[0], vehicles[1])}
				${comparePair(vehicles[2], vehicles[3])}
				${comparePair(vehicles[4], vehicles[5])}
			</div>
			<div class="swiper-pagination pagination-dark pagination-style pagination-swiper-card-3 mt-35"></div>
		</div>
	</div>
</section>
<!-- /Compare Top Rated Vehicles -->`;

const darkVehicleCard = (vehicle: Vehicle) => {
	const url = `/inventory/${encodeURIComponent(vehicle.slug)}`;
	const highlightClass = 'bg-primary-2';

	return `<div class="swiper-slide">
	<div class="card-box card-box-style-2" data-eliqauto-slug="${escapeHtml(vehicle.slug)}">
		<div class="top">
			<p class="${highlightClass} text-white highlight">${escapeHtml(vehicle.tag ?? 'Available')}</p>
			<p class="heart eliqauto-favorite" role="button" tabindex="0" aria-label="Запази ${escapeHtml(vehicle.title)}">${heartIcon}</p>
		</div>
		<div class="image">
			<a href="${url}">
				<img class="card--img" src="${escapeHtml(imageForVehicle(vehicle))}" alt="${escapeHtml(vehicle.title)}">
			</a>
		</div>
		<div class="content border-top-none bg-blur border-blur">
			<div class="bottom">
				<p class="category uppercase text-white"><a href="${url}" class="text-white">${escapeHtml(vehicle.brand)}</a></p>
				<div class="flex items-center gap-8">
					<p class="category uppercase text-white"><img src="/assets/icons/picture.svg" alt="photos"> ${vehicle.images.length || 1}</p>
					<p class="category uppercase text-white"><img src="/assets/icons/play.svg" alt="video"> 0</p>
				</div>
			</div>
			<p class="h6 card-box__title mb-8 mt-1"><a href="${url}" class="text-white">${escapeHtml(vehicle.title)}</a></p>
			${cardMeta(vehicle, true)}
			<p class="card-box__price mb-15 text-white">${escapeHtml(vehicle.priceLabel)}</p>
			<div class="divider-blur mb-14"></div>
			<div class="flex justify-between">
				<p class="compare-details btn btn-small open-modal" data-modal-id="#CompareModal" data-eliqauto-compare="${escapeHtml(vehicle.slug)}" role="button" tabindex="0">
					${compareIcon}
					Compare
				</p>
				<a href="${url}" class="view-details text-white">View details <img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt="view details"></a>
			</div>
		</div>
	</div>
</div>`;
};

const trendingSection = () => `<!-- Trending searches near you -->
<section class="py-100 bg-primary radius-40">
	<div class="container">
		<div class="title-section mb-40 wow fadeInUp" data-wow-delay="0.1s">
			<h2 class="text-white capitalize">Featured Eliqauto Searches</h2>
			${sectionButton('/inventory?view=4', 'View All', 'btn btn-line-blur effect-line-white hover-fill-primary font-weight-600 btn-large')}
		</div>
		<div class="swiper-container swiper-card wow fadeIn" data-wow-delay="0.2s">
			<div class="swiper-wrapper">
				${vehicles.slice(6, 12).map(darkVehicleCard).join('\n')}
			</div>
			<div class="swiper-pagination pagination-white pagination-style pagination-swiper-card mt-38"></div>
		</div>
	</div>
</section>
<!-- /Trending searches near you -->`;

const calculatorSection = () => {
	const vehicle = vehicles[0];
	const transport = 2400;
	const duty = Math.round(vehicle.price * 0.1);
	const vat = Math.round((vehicle.price + transport + duty) * 0.2);
	const prep = 1200;
	const total = vehicle.price + transport + duty + vat + prep;

	return `<!-- Financing Calculator -->
<section class="bg-white py-100">
	<div class="container">
		<div class="row items-center">
			<div class="col-lg-6 wow fadeInUp">
				<div class="caculator-box bg-white outline radius-12">
					<h2 class="mb-20">Import Cost Calculator</h2>
					<form action="/calculator">
						<div class="grid gap-22 gap-x-16 grid-cols-2 mb-20 md-grid-cols-1">
							<div class="md-colspan-1">
								<p class="mb-8">Vehicle Price</p>
								<input class="active" type="text" value="${escapeHtml(vehicle.priceLabel)}" name="price" required>
							</div>
							<div class="md-colspan-1">
								<p class="mb-8">Transport Estimate</p>
								<input type="text" value="${transport.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} EUR" name="transport" required>
							</div>
							<div class="md-colspan-1">
								<p class="mb-8">Duty + VAT Basis</p>
								<select name="basis">
									<option>Standard import estimate</option>
									<option>Confirm with Eliqauto</option>
								</select>
							</div>
							<div>
								<p class="mb-8">Preparation</p>
								<input type="text" value="${prep.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} EUR" name="prep" required>
							</div>
							<button class="btn btn-medium btn-primary col-span-2" type="submit">Open Calculator</button>
						</div>
						<div class="grid gap-8 grid-cols-3 md-grid-cols-1">
							<div>
								<p class="mb-4">Duty estimate:</p>
								<p class="font-weight-600">${duty.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} EUR</p>
							</div>
							<div>
								<p class="mb-4">VAT estimate:</p>
								<p class="font-weight-600">${vat.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} EUR</p>
							</div>
							<div>
								<p class="mb-4">Estimated total:</p>
								<p class="font-weight-600">${total.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} EUR</p>
							</div>
						</div>
					</form>
				</div>
			</div>
			<div class="col-lg-6 text-center wow fadeInUp">
				<img class="max-w-628 ml-60 move3" src="/assets/eliqauto/cta/import-canada-banner-v2.webp" alt="Eliqauto import calculator">
			</div>
		</div>
	</div>
</section>
<!-- /Financing Calculator -->`;
};

const stars = Array.from(
	{ length: 5 },
	() => '<img src="/assets/icons/star.svg" alt="rating">'
).join('');

const reviewsSection = () => `<!-- Clients Reviews -->
<section class="py-100 background-light radius-40">
	<div class="container wow fadeIn" data-wow-delay="0.2s">
		<div class="title-section mb-38 wow fadeInDown" data-wow-delay="0.1s">
			<h2 class="">Client Reviews</h2>
			${sectionButton('/reviews', 'View All')}
		</div>
		<div class="swiper-container swiper-testimonior-2">
			<div class="swiper-wrapper">
				${reviewItems
					.map(
						(review) => `<div class="swiper-slide">
					<a href="/reviews" class="testimonior-box">
						<div class="flex items-center gap-4 mb-16">${stars}</div>
						<p class="testimonior-box--desc mb-16">${escapeHtml(review.text)}</p>
						<div class="testimonior-box--user">
							<img class="testimonior--img" src="${review.avatar}" alt="${escapeHtml(review.name)}">
							<div class="testimonior-box--user-content">
								<p class="h5 title">${escapeHtml(review.name)}</p>
								<p class="desc">${escapeHtml(review.role)}</p>
							</div>
						</div>
					</a>
				</div>`
					)
					.join('\n')}
			</div>
			<div class="swiper-pagination pagination-dark pagination-style pagination-testimonior mt-35"></div>
		</div>
	</div>
</section>
<!-- /Clients Reviews -->`;

const ctaSection = () => `<!-- Find Your Perfect Used Car -->
<section class="py-100">
	<div class="container">
		<div class="cta-box radius-16" style="background-image: url('${eliqautoAssets.footerImage}')">
			<div class="content">
				<p class="h2 text-white mb-16">Find your next Eliqauto vehicle</p>
				<p class="text-white mb-24">Browse current inventory, request a Import history review, or send details for a client vehicle sale.</p>
				<div class="flex gap-12 flex-wrap">
					<a href="/inventory" class="btn btn-primary btn-large font-weight-600">View Inventory</a>
					<a href="/sell-your-car" class="btn btn-line-blur effect-line-white hover-fill-primary font-weight-600 btn-large">Sell Your Car</a>
				</div>
			</div>
		</div>
	</div>
</section>
<!-- /Find Your Perfect Used Car -->`;

const routeFooterCopy = (html: string) =>
	html
		.replaceAll('15505 Roscoe Blvd, North Hills, USA', eliqautoContact.addressLabel)
		.replace(
			/Monday–Friday from 8 AM to 8 PM\s*<br>\s*Saturday from 9 AM to 6 PM EST/g,
			'Monday-Friday 9:00 - 18:00 <br>Weekend viewings by appointment'
		)
		.replaceAll('Buying a car', 'Buying With Eliqauto')
		.replaceAll('Selling a car', 'Sell Your Car')
		.replaceAll('Investor Relations', 'Services')
		.replaceAll('Careers', 'FAQ')
		.replaceAll('Find a Dealer', 'Find a Consultant')
		.replaceAll('Listings by City', 'Inventory Map')
		.replaceAll('Certified Pre-Owned', 'Verified Listings')
		.replaceAll('Car Payment Calculators', 'Import Calculator')
		.replaceAll('Car Reviews & Ratings', 'Client Reviews')
		.replaceAll('Download App', 'Eliqauto Online');

const homeBlogTeaser = () => {
	const latest = posts[0];
	const agent = agents[0];

	return `<section class="bg-white py-100 eliqauto-home-news">
	<div class="container">
		<div class="title-section mb-38 wow fadeInDown" data-wow-delay="0.1s">
			<h2>Latest Eliqauto Notes</h2>
			${sectionButton('/blog', 'Read Blog')}
		</div>
		<div class="grid grid-cols-2 lg-grid-cols-1 gap-30">
			<a href="/blog/${latest.slug}" class="blog-card">
				<img class="radius-16 mb-18" src="${latest.image}" alt="${escapeHtml(latest.title)}">
				<p class="text-sm text-muted mb-8">${escapeHtml(latest.category)} / ${escapeHtml(latest.date)}</p>
				<p class="h4 mb-12">${escapeHtml(latest.title)}</p>
				<p class="text-secondary">${escapeHtml(latest.excerpt)}</p>
			</a>
			<div class="sale-agent-box active">
				<div class="card-top mb-20">
					<a class="w-full flex" href="/agents/${agent.slug}">
						<img class="w-full" src="${agent.image}" alt="${escapeHtml(agent.name)}">
					</a>
				</div>
				<div class="card-bottom flex items-center justify-between gap-16">
					<div class="content">
						<a class="h5 font-weight-600 sale-agent-title" href="/agents/${agent.slug}">${escapeHtml(agent.name)}</a>
						<p class="text-secondary text-sm">${escapeHtml(agent.title)}</p>
					</div>
					<ul class="contact">
						<li><a href="${eliqautoContact.primaryPhoneHref}" aria-label="Call Eliqauto"><img src="/assets/icons/PhoneCall.svg" alt="phone"></a></li>
						<li><a href="${eliqautoContact.emailHref}" aria-label="Email Eliqauto"><img src="/assets/icons/input-telegram.svg" alt="email"></a></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</section>`;
};

export const applyHome05TemplateData = (html: string) => {
	let next = replaceHome05Hero(html);
	next = replaceSectionByComment(
		next,
		'<!-- New Vehicles -->',
		'<!-- /New Vehicles -->',
		home05FeaturedInventory()
	);
	next = replaceSectionByComment(
		next,
		'<!-- Explore Our Brands -->',
		'<!-- /Explore Our Brands -->',
		home05BrandStrip()
	);
	next = replaceSectionByComment(
		next,
		'<!-- Browse By Type -->',
		'<!-- /Browse By Type -->',
		home05TypeGallery()
	);
	next = replaceSectionByComment(
		next,
		'<!-- Compare Top Rated Vehicles -->',
		'<!-- /Compare Top Rated Vehicles -->',
		home05CompareSection()
	);
	next = replaceSectionByComment(
		next,
		'<!-- Used Cars by Budget -->',
		'<!-- Used Cars by Budget -->',
		home05BudgetSection()
	);
	next = replaceSectionByComment(
		next,
		'<!-- /Clients Reviews -->',
		'<!-- /Clients Reviews -->',
		home05ReviewsSection()
	);
	next = replaceSectionByComment(
		next,
		'<!-- News & Reviews -->',
		'<!-- /News & Reviews -->',
		home05NewsSection()
	);

	return routeFooterCopy(next);
};

export const applyHomeTemplateData = (html: string) => {
	let next = replaceHero(html);
	next = replaceSectionByComment(
		next,
		'<!-- Browse By Type -->',
		'<!-- /Browse By Type -->',
		typeRail()
	);
	next = replaceSectionByComment(
		next,
		'<!-- New Vehicles -->',
		'<!-- /New Vehicles -->',
		featuredInventory()
	);
	next = replaceSectionByComment(
		next,
		'<!-- Explore Our Brands -->',
		'<!-- /Explore Our Brands -->',
		brandStrip()
	);
	next = replaceSectionByComment(
		next,
		'<!-- Why Choose Us -->',
		'<!-- Why Choose Us -->',
		whyChoose()
	);
	next = replaceSectionByComment(
		next,
		'<!-- Compare Top Rated Vehicles -->',
		'<!-- /Compare Top Rated Vehicles -->',
		compareSection()
	);
	next = replaceSectionByComment(
		next,
		'<!-- Trending searches near you -->',
		'<!-- /Trending searches near you -->',
		trendingSection()
	);
	next = replaceSectionByComment(
		next,
		'<!-- Services Calculator -->',
		'<!-- /Services Calculator -->',
		calculatorSection()
	);
	next = replaceSectionByComment(
		next,
		'<!-- Client Reviews -->',
		'<!-- /Client Reviews -->',
		reviewsSection()
	);
	next = replaceSectionByComment(
		next,
		'<!-- Find Your Perfect Used Car -->',
		'<!-- /Find Your Perfect Used Car -->',
		`${homeBlogTeaser()}\n${ctaSection()}`
	);

	return routeFooterCopy(next);
};
