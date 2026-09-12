<script lang="ts">
	import { resolve } from '$app/paths';
	import { daynightVehicles } from '$lib/data/daynight-vehicles';

	type ExportKind = 'mobilebg' | 'carsbg' | 'preview';

	type DashboardStat = {
		id: string;
		label: string;
		value: string;
		icon: `/${string}`;
	};

	type ChartRange = {
		id: string;
		label: string;
		active?: boolean;
	};

	type SortOption = {
		id: string;
		label: string;
		active?: boolean;
	};

	type DashboardListing = {
		id: string;
		href: `/${string}`;
		image: string;
		imageLoading: 'eager' | 'lazy';
		title: string;
		subtitle: string;
		price: string;
		brand: string;
		year: string;
		transmission: string;
		fuel: string;
	};

	type DashboardReview = {
		id: string;
		avatar: `/${string}`;
		name: string;
		date: string;
		title: string;
		body: string;
	};

	const dashboardStats: DashboardStat[] = [
		{
			id: 'listings',
			label: 'Моите автомобили',
			value: String(daynightVehicles.length),
			icon: '/assets/images/dashboard/car.svg'
		},
		{
			id: 'pending',
			label: 'В процес',
			value: '03',
			icon: '/assets/images/dashboard/clockCountdown.svg'
		},
		{
			id: 'favorites',
			label: 'Запазени автомобили',
			value: '08',
			icon: '/assets/images/dashboard/star.svg'
		},
		{
			id: 'reviews',
			label: 'Моите отзиви',
			value: '137',
			icon: '/assets/images/dashboard/chats.svg'
		}
	];

	const chartRanges: ChartRange[] = [
		{ id: '3-month', label: '3 месеца' },
		{ id: '6-month', label: '6 месеца', active: true },
		{ id: '12-month', label: '12 месеца' }
	];

	const sortOptions: SortOption[] = [
		{ id: 'best-match', label: 'Най-подходящи' },
		{ id: 'lowest-price', label: 'Най-ниска цена', active: true },
		{ id: 'highest-price', label: 'Най-висока цена' },
		{ id: 'lowest-mileage', label: 'Най-малък пробег' },
		{ id: 'highest-mileage', label: 'Най-голям пробег' },
		{ id: 'newest-year', label: 'Най-нова година' },
		{ id: 'oldest-year', label: 'Най-стара година' }
	];

	const listingHeaders = [
		'Автомобил',
		'Марка',
		'Година',
		'Скорости',
		'Гориво',
		'Действия'
	] as const;
	const paginationPages = [1, 2, 3] as const;

	// Real inventory rows — the demo panel must show the dealer's own cars.
	const listingRows: DashboardListing[] = daynightVehicles.slice(0, 3).map((vehicle, index) => ({
		id: vehicle.slug,
		href: `/inventory/${vehicle.slug}`,
		image: vehicle.image,
		imageLoading: index < 2 ? 'eager' : 'lazy',
		title: vehicle.title,
		subtitle: vehicle.conditionLine,
		price: vehicle.priceEur,
		brand: vehicle.brand,
		year: String(vehicle.year),
		transmission: vehicle.transmission,
		fuel: vehicle.fuel
	}));

	const reviewCards: DashboardReview[] = [
		{
			id: 'review-ivan',
			avatar: '/assets/images/avatar/avatar-4.png',
			name: 'Иван Д.',
			date: 'Август 2025',
			title: 'Отлично преживяване',
			body: 'Получих ясна информация за автомобила, документите и следващите стъпки. Огледът беше организиран спокойно, без натиск и без излишни обещания.'
		},
		{
			id: 'review-maria',
			avatar: '/assets/images/avatar/coment-avatar-1.png',
			name: 'Мария Г.',
			date: 'Август 2025',
			title: 'Лесно и удобно',
			body: 'Сайтът е удобен и сравних няколко автомобила за минути. Вариантите за финансиране бяха обяснени ясно и намерих подходящ за бюджета ми.'
		},
		{
			id: 'review-nikolay',
			avatar: '/assets/images/avatar/coment-avatar-2.png',
			name: 'Николай П.',
			date: 'Август 2025',
			title: 'Коректно и надеждно',
			body: 'Автомобилът беше представен коректно, със снимки, цена и обяснение за състоянието. Сделката мина бързо и подредено.'
		}
	];

	const exportFeed = daynightVehicles.map((vehicle) => ({
		ref: vehicle.lot,
		brand: vehicle.brand,
		model: vehicle.model,
		year: vehicle.year,
		priceBgn: vehicle.priceBgn,
		fuel: vehicle.fuel,
		gearbox: vehicle.transmission,
		category: vehicle.body,
		mileage: vehicle.mileageValue,
		power: vehicle.power,
		color: vehicle.color,
		title: vehicle.title,
		description: vehicle.description,
		images: vehicle.gallery
	}));

	let isPreviewVisible = $state(false);
	const previewText = $derived(isPreviewVisible ? buildXml() : '');
	const previewButtonLabel = $derived(isPreviewVisible ? 'Скрий feed-а' : 'Преглед на feed-а');

	const xmlEsc = (value: unknown) =>
		String(value ?? '')
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;')
			.replaceAll('"', '&quot;');

	function buildXml() {
		const lines = [
			'<?xml version="1.0" encoding="UTF-8"?>',
			'<ads source="Автосалон Тодоров" type="demo-feed">'
		];

		for (const vehicle of exportFeed) {
			lines.push('  <ad>');
			lines.push(`    <ref>${xmlEsc(vehicle.ref)}</ref>`);
			lines.push(`    <make>${xmlEsc(vehicle.brand)}</make>`);
			lines.push(`    <model>${xmlEsc(vehicle.model)}</model>`);
			lines.push(`    <year>${xmlEsc(vehicle.year)}</year>`);
			lines.push(`    <price currency="BGN">${xmlEsc(vehicle.priceBgn)}</price>`);
			lines.push(`    <fuel>${xmlEsc(vehicle.fuel)}</fuel>`);
			lines.push(`    <gearbox>${xmlEsc(vehicle.gearbox)}</gearbox>`);
			lines.push(`    <category>${xmlEsc(vehicle.category)}</category>`);
			lines.push(`    <mileage unit="km">${xmlEsc(vehicle.mileage)}</mileage>`);
			lines.push(`    <power>${xmlEsc(vehicle.power)}</power>`);
			lines.push(`    <color>${xmlEsc(vehicle.color)}</color>`);
			lines.push(`    <title>${xmlEsc(vehicle.title)}</title>`);
			lines.push(`    <description>${xmlEsc(vehicle.description)}</description>`);
			lines.push('    <images>');
			for (const image of vehicle.images) {
				lines.push(`      <image>${xmlEsc(image)}</image>`);
			}
			lines.push('    </images>');
			lines.push('  </ad>');
		}

		lines.push('</ads>');
		return lines.join('\n');
	}

	const csvCell = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;

	function buildCsv() {
		const headers = [
			'ref',
			'make',
			'model',
			'year',
			'price_bgn',
			'fuel',
			'gearbox',
			'category',
			'mileage_km',
			'power',
			'color',
			'images'
		];
		const rows = [headers.join(',')];

		for (const vehicle of exportFeed) {
			rows.push(
				[
					vehicle.ref,
					vehicle.brand,
					vehicle.model,
					vehicle.year,
					vehicle.priceBgn,
					vehicle.fuel,
					vehicle.gearbox,
					vehicle.category,
					vehicle.mileage,
					vehicle.power,
					vehicle.color,
					vehicle.images.join(' | ')
				]
					.map(csvCell)
					.join(',')
			);
		}

		return rows.join('\r\n');
	}

	function download(filename: string, content: string, mime: string) {
		const blob = new Blob([content], { type: `${mime};charset=utf-8` });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		link.remove();
		window.setTimeout(() => URL.revokeObjectURL(url), 1500);
	}

	function handleExport(kind: ExportKind) {
		if (kind === 'mobilebg') {
			download('daynight-auto-mobilebg.xml', buildXml(), 'application/xml');
		} else if (kind === 'carsbg') {
			download('daynight-auto-carsbg.csv', buildCsv(), 'text/csv');
		} else {
			isPreviewVisible = !isPreviewVisible;
		}
	}
</script>

{#snippet searchIcon()}
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M17.9438 17.0575L14.0321 13.1466C15.1659 11.7854 15.7312 10.0395 15.6106 8.27214C15.4899 6.50475 14.6925 4.85192 13.3843 3.65748C12.076 2.46304 10.3576 1.81895 8.58657 1.8592C6.81553 1.89945 5.12818 2.62094 3.87554 3.87358C2.62289 5.12622 1.9014 6.81357 1.86115 8.58462C1.8209 10.3557 2.46499 12.074 3.65943 13.3823C4.85387 14.6906 6.5067 15.488 8.27409 15.6086C10.0415 15.7293 11.7874 15.1639 13.1485 14.0302L17.0595 17.9419C17.1175 17.9999 17.1865 18.046 17.2623 18.0774C17.3382 18.1089 17.4195 18.125 17.5016 18.125C17.5838 18.125 17.6651 18.1089 17.741 18.0774C17.8168 18.046 17.8858 17.9999 17.9438 17.9419C18.0019 17.8838 18.048 17.8149 18.0794 17.739C18.1108 17.6631 18.127 17.5818 18.127 17.4997C18.127 17.4176 18.1108 17.3363 18.0794 17.2604C18.048 17.1845 18.0019 17.1156 17.9438 17.0575ZM3.12664 8.74969C3.12664 7.63717 3.45654 6.54963 4.07463 5.62461C4.69271 4.69958 5.57121 3.97861 6.59905 3.55287C7.62688 3.12712 8.75788 3.01573 9.84903 3.23277C10.9402 3.44981 11.9424 3.98554 12.7291 4.77221C13.5158 5.55888 14.0515 6.56116 14.2686 7.65231C14.4856 8.74345 14.3742 9.87445 13.9485 10.9023C13.5227 11.9301 12.8018 12.8086 11.8767 13.4267C10.9517 14.0448 9.86416 14.3747 8.75164 14.3747C7.26031 14.373 5.83053 13.7799 4.77599 12.7253C3.72146 11.6708 3.1283 10.241 3.12664 8.74969Z"
			fill="#1C1C1C"
		></path>
	</svg>
{/snippet}

{#snippet editIcon()}
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M21.3113 6.87821L17.1216 2.68946C16.9823 2.55014 16.8169 2.43962 16.6349 2.36421C16.4529 2.28881 16.2578 2.25 16.0608 2.25C15.8638 2.25 15.6687 2.28881 15.4867 2.36421C15.3047 2.43962 15.1393 2.55014 15 2.68946L3.43969 14.2498C3.2998 14.3886 3.18889 14.5538 3.11341 14.7358C3.03792 14.9178 2.99938 15.113 3.00001 15.3101V19.4998C3.00001 19.8976 3.15804 20.2791 3.43935 20.5604C3.72065 20.8417 4.10218 20.9998 4.50001 20.9998H20.25C20.4489 20.9998 20.6397 20.9208 20.7803 20.7801C20.921 20.6395 21 20.4487 21 20.2498C21 20.0509 20.921 19.8601 20.7803 19.7194C20.6397 19.5788 20.4489 19.4998 20.25 19.4998H10.8113L21.3113 8.99977C21.4506 8.86048 21.5611 8.69511 21.6365 8.5131C21.7119 8.33109 21.7507 8.136 21.7507 7.93899C21.7507 7.74198 21.7119 7.5469 21.6365 7.36489C21.5611 7.18288 21.4506 7.0175 21.3113 6.87821ZM8.68969 19.4998H4.50001V15.3101L12.75 7.06009L16.9397 11.2498L8.68969 19.4998ZM18 10.1895L13.8113 5.99977L16.0613 3.74977L20.25 7.93946L18 10.1895Z"
			fill="#1C1C1C"
		></path>
	</svg>
{/snippet}

{#snippet deleteIcon()}
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M20.25 4.5H16.5V3.75C16.5 3.15326 16.2629 2.58097 15.841 2.15901C15.419 1.73705 14.8467 1.5 14.25 1.5H9.75C9.15326 1.5 8.58097 1.73705 8.15901 2.15901C7.73705 2.58097 7.5 3.15326 7.5 3.75V4.5H3.75C3.55109 4.5 3.36032 4.57902 3.21967 4.71967C3.07902 4.86032 3 5.05109 3 5.25C3 5.44891 3.07902 5.63968 3.21967 5.78033C3.36032 5.92098 3.55109 6 3.75 6H4.5V19.5C4.5 19.8978 4.65804 20.2794 4.93934 20.5607C5.22064 20.842 5.60218 21 6 21H18C18.3978 21 18.7794 20.842 19.0607 20.5607C19.342 20.2794 19.5 19.8978 19.5 19.5V6H20.25C20.4489 6 20.6397 5.92098 20.7803 5.78033C20.921 5.63968 21 5.44891 21 5.25C21 5.05109 20.921 4.86032 20.7803 4.71967C20.6397 4.57902 20.4489 4.5 20.25 4.5ZM9 3.75C9 3.55109 9.07902 3.36032 9.21967 3.21967C9.36032 3.07902 9.55109 3 9.75 3H14.25C14.4489 3 14.6397 3.07902 14.7803 3.21967C14.921 3.36032 15 3.55109 15 3.75V4.5H9V3.75ZM18 19.5H6V6H18V19.5ZM10.5 9.75V15.75C10.5 15.9489 10.421 16.1397 10.2803 16.2803C10.1397 16.421 9.94891 16.5 9.75 16.5C9.55109 16.5 9.36032 16.421 9.21967 16.2803C9.07902 16.1397 9 15.9489 9 15.75V9.75C9 9.55109 9.07902 9.36032 9.21967 9.21967C9.36032 9.07902 9.55109 9 9.75 9C9.94891 9 10.1397 9.07902 10.2803 9.21967C10.421 9.36032 10.5 9.55109 10.5 9.75ZM15 9.75V15.75C15 15.9489 14.921 16.1397 14.7803 16.2803C14.6397 16.421 14.4489 16.5 14.25 16.5C14.0511 16.5 13.8603 16.421 13.7197 16.2803C13.579 16.1397 13.5 15.9489 13.5 15.75V9.75C13.5 9.55109 13.579 9.36032 13.7197 9.21967C13.8603 9.07902 14.0511 9 14.25 9C14.4489 9 14.6397 9.07902 14.7803 9.21967C14.921 9.36032 15 9.55109 15 9.75Z"
			fill="#1C1C1C"
		></path>
	</svg>
{/snippet}

{#snippet nextIcon()}
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M14.1925 10.4423L7.94254 16.6923C7.88447 16.7504 7.81553 16.7964 7.73966 16.8278C7.66379 16.8593 7.58247 16.8755 7.50035 16.8755C7.41823 16.8755 7.33691 16.8593 7.26104 16.8278C7.18517 16.7964 7.11623 16.7504 7.05816 16.6923C7.00009 16.6342 6.95403 16.5653 6.9226 16.4894C6.89117 16.4135 6.875 16.3322 6.875 16.2501C6.875 16.168 6.89117 16.0867 6.9226 16.0108C6.95403 15.9349 7.00009 15.866 7.05816 15.8079L12.8668 10.0001L7.05816 4.19229C6.94088 4.07502 6.875 3.91596 6.875 3.7501C6.875 3.58425 6.94088 3.42519 7.05816 3.30792C7.17544 3.19064 7.3345 3.12476 7.50035 3.12476C7.6662 3.12476 7.82526 3.19064 7.94254 3.30792L14.1925 9.55791C14.2506 9.61596 14.2967 9.68489 14.3282 9.76077C14.3597 9.83664 14.3758 9.91797 14.3758 10.0001C14.3758 10.0822 14.3597 10.1636 14.3282 10.2394C14.2967 10.3153 14.2506 10.3842 14.1925 10.4423Z"
			fill="#9FA1A4"
		></path>
	</svg>
{/snippet}

{#snippet stars()}
	<div class="mb-12 flex items-center">
		{#each [1, 2, 3, 4, 5] as star (star)}
			<img
				src={resolve('/assets/icons/star-2.svg')}
				alt="star"
				data-daynight-img="1"
				decoding="async"
				loading="lazy"
			/>
		{/each}
	</div>
{/snippet}

<div class="dashboard-content--inner">
	<div class="dashboard-content--details">
		<button
			class="btn btn-primary btn-large font-weight-600 dashboard-toggle-btn mb-24"
			id="dashboardToggleBtn"
			aria-label="Toggle Моят профил"
			type="button"
		>
			Меню профил
		</button>

		<p class="h3 mb-30">Моят профил</p>

		<div class="xl-grid-cols-2 sm-grid-cols-1 mb-30 grid grid-cols-4 gap-30">
			{#each dashboardStats as stat (stat.id)}
				<a href={resolve('/dashboard')} class="dashboard-cart">
					<div>
						<p class="h7 font-weight-500 mb-4">{stat.label}</p>
						<p class="h3">{stat.value}</p>
					</div>

					<div class="icon">
						<img
							src={resolve(stat.icon)}
							alt=""
							data-daynight-img="1"
							decoding="async"
							loading="eager"
						/>
					</div>
				</a>
			{/each}
		</div>

		<div class="dashboard-box daynight-export bg-white">
			<div class="daynight-export__head">
				<div>
					<p class="h4">Експорт към mobile.bg / cars.bg</p>
					<span class="daynight-export__sub"
						>Въведете автомобила веднъж — изтеглете готов файл за качване във всяка платформа. Край
						на ръчното дублиране на обяви.</span
					>
				</div>
				<span class="daynight-export__count">{exportFeed.length} активни обяви</span>
			</div>
			<div class="daynight-export__actions">
				<button
					type="button"
					class="daynight-export__btn daynight-export__btn--primary"
					data-export="mobilebg"
					onclick={() => handleExport('mobilebg')}>Свали mobile.bg feed (XML)</button
				>
				<button
					type="button"
					class="daynight-export__btn"
					data-export="carsbg"
					onclick={() => handleExport('carsbg')}>Свали cars.bg feed (CSV)</button
				>
				<button
					type="button"
					class="daynight-export__btn daynight-export__btn--ghost"
					data-export="preview"
					onclick={() => handleExport('preview')}>{previewButtonLabel}</button
				>
			</div>
			<pre class="daynight-export__preview" hidden={!isPreviewVisible}>{previewText}</pre>
			<p class="daynight-export__hint">
				Файлът се качва в дилърския панел на mobile.bg / cars.bg → „Импорт на обяви". Снимките се
				обслужват от публични URL адреси.
			</p>
		</div>

		<div class="dashboard-box car-views-chart mb-30 bg-white">
			<div class="car-views-chart__header">
				<p class="h4 car-views-chart__title">Интерес към автомобили</p>
				<div class="core-dropdown style-2">
					<button class="core-dropdown__button dropdown__normal" type="button">
						<span class="core-dropdown__selected">6 месеца</span>
						<img
							src={resolve('/assets/icons/chevron-down-primary.svg')}
							alt="chevron"
							class="core-dropdown__icon"
							data-daynight-img="1"
							decoding="async"
							loading="eager"
						/>
					</button>
					<div class="core-dropdown__menu">
						<ul class="core-dropdown__list style2">
							{#each chartRanges as range (range.id)}
								<li class="core-dropdown__item">
									<a
										href={resolve(`/dashboard?range=${range.id}`)}
										class={range.active ? 'core-dropdown__option active' : 'core-dropdown__option'}
										data-value={range.id}>{range.label}</a
									>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
			<div class="car-views-chart__container">
				<canvas id="carViewsChart" class="car-views-chart__canvas"></canvas>
				<div id="carViewsTooltip" class="car-views-chart__tooltip"></div>
			</div>
		</div>

		<div class="dashboard-box style-2 mb-30 bg-white">
			<p class="h4 mb-20">Всички заявки</p>

			<div class="mb-20 flex flex-wrap items-center justify-between gap-20">
				<form action={resolve('/dashboard')} class="search-form-listing" method="get">
					<input
						type="text"
						name="searchListing"
						id="searchListing"
						class="form-control"
						placeholder="Search by keyword"
						aria-label="Search by keyword"
					/>
					<button type="submit">
						{@render searchIcon()}
					</button>
				</form>

				<div class="flex items-center gap-8">
					<p class="text-secondary">Сортиране:</p>
					<div class="core-dropdown style-2 listing">
						<button
							class="core-dropdown__button dropdown__normal"
							type="button"
							id="coreDropdownBtn"
						>
							<span class="core-dropdown__selected">Най-нови</span>
							<img
								src={resolve('/assets/icons/chevron-down-primary.svg')}
								alt="chevron"
								class="core-dropdown__icon"
								data-daynight-img="1"
								decoding="async"
								loading="eager"
							/>
						</button>
						<div class="core-dropdown__menu" id="coreDropdownMenu">
							<ul class="core-dropdown__list style2">
								{#each sortOptions as option (option.id)}
									<li class="core-dropdown__item">
										<a
											href={resolve(`/dashboard?sort=${option.id}`)}
											class={option.active
												? 'core-dropdown__option active'
												: 'core-dropdown__option'}
											data-value={option.id}>{option.label}</a
										>
									</li>
								{/each}
							</ul>
						</div>
					</div>
				</div>
			</div>

			<div class="cart-wrapper">
				<div class="cart-header">
					{#each listingHeaders as header (header)}
						<div class="font-weight-600">{header}</div>
					{/each}
				</div>

				<div class="cart-items">
					{#each listingRows as listing (listing.id)}
						<div class="cart-item">
							<a href={resolve(listing.href)} class="cart-item__product">
								<div class="cart-item__image">
									<img
										src={listing.image}
										alt={listing.title}
										data-daynight-img="1"
										decoding="async"
										loading={listing.imageLoading}
									/>
								</div>
								<div class="cart-item__name">
									<p class="h4 clamp-1 clamp mb-8">{listing.title}</p>
									<p class="clamp-1 clamp text-secondary mb-12">{listing.subtitle}</p>
									<p class="h5">{listing.price}</p>
								</div>
							</a>
							<div class="cart-item__price">
								<span class="price">{listing.brand}</span>
							</div>
							<div class="cart-item__year">
								<span>{listing.year}</span>
							</div>
							<div class="cart-item__total">
								<span>{listing.transmission}</span>
							</div>
							<div>
								<span>{listing.fuel}</span>
							</div>
							<div class="cart-item__action">
								<a
									href={resolve('/dashboard/listings/new')}
									class="hover-fill-white cart-item__edit action"
								>
									{@render editIcon()}

									<p class="tooltip">Редактирай</p>
								</a>
								<div class="hover-fill-white cart-item__remove action">
									{@render deleteIcon()}

									<p class="tooltip">Изтрий</p>
								</div>
							</div>
						</div>
					{/each}
				</div>

				<div class="divider mb-20 w-full"></div>

				<div
					class="pagination-bottom flex flex-wrap items-center justify-between gap-12"
					id="pagination-bottom"
				>
					<ul class="pagination">
						{#each paginationPages as pageNumber (pageNumber)}
							<li>
								<a
									href={resolve(`/dashboard?page=${pageNumber}`)}
									class={pageNumber === 1 ? 'pagination__link active' : 'pagination__link'}
								>
									{pageNumber}
								</a>
							</li>
						{/each}
						<li>
							<a href={resolve('/dashboard?page=2')} class="pagination__link">
								{@render nextIcon()}
							</a>
						</li>
					</ul>
					<p class="text-secondary">
						Показани {listingRows.length} от {daynightVehicles.length} обяви
					</p>
				</div>
			</div>
		</div>

		<div class="dashboard-box bg-white">
			<p class="h4 mb-20">Последни отзиви</p>
			<div class="comments">
				{#each reviewCards as review (review.id)}
					<div class="comment-box">
						<div class="comment-box__header mb-24 gap-12">
							<div class="comment-box__avatar">
								<img
									src={resolve(review.avatar)}
									alt="avatar"
									data-daynight-img="1"
									decoding="async"
									loading="lazy"
								/>
							</div>
							<div>
								<div class="text-secondary gap-4 pt-4">
									<p class="h5 mb-4">{review.name}</p>
									<p class="text-secondary text-sm">{review.date}</p>
								</div>
							</div>
						</div>

						{@render stars()}

						<p class="h5 mb-12">{review.title}</p>
						<p class="h7 line-height-28">{review.body}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
