<script lang="ts">
	import { resolve } from '$app/paths';

	type FavoriteStat = {
		icon: `/${string}`;
		iconClass?: string;
		text: string;
	};

	type FavoriteCard = {
		id: string;
		highlightText?: string;
		highlightClass?: string;
		imageHref: `/${string}`;
		imageSrc: string;
		imageClass: string;
		imageFallback?: boolean;
		brandHref: `/${string}`;
		brandClass: string;
		brandText: string;
		titleHref: `/${string}`;
		titleText: string;
		stats: FavoriteStat[];
		priceClass: string;
		priceText: string;
		monthlyText?: string;
		monthlyHref?: `/${string}`;
		monthlyLinkText?: string;
		compareClass: string;
		viewHref: `/${string}`;
	};

	const imageFallback =
		'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22640%22%20height%3D%22480%22%20viewBox%3D%220%200%20640%20480%22%3E%3Crect%20width%3D%22640%22%20height%3D%22480%22%20fill%3D%22%23f1f4f9%22%2F%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%22638%22%20height%3D%22478%22%20fill%3D%22none%22%20stroke%3D%22%23d7deea%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%22320%22%20y%3D%22250%22%20font-family%3D%22Manrope%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2230%22%20font-weight%3D%22700%22%20fill%3D%22%231d63d8%22%20text-anchor%3D%22middle%22%3EDealer%20preview%3C%2Ftext%3E%3C%2Fsvg%3E';

	const cards: FavoriteCard[] = [
		{
			id: 'chrysler-300c',
			highlightText: 'Специално',
			highlightClass: 'bg-primary-2 text-white highlight',
			imageHref: '/inventory/chrysler-300c-2018-gaz',
			imageSrc: 'https://mobistatic3.focus.bg/mobile/photosorg/017/1/11776804395836017_yX.webp',
			imageClass: 'card--img',
			brandHref: '/inventory',
			brandClass: 'text-white uppercase text-xs',
			brandText: 'Audi',
			titleHref: '/inventory/chrysler-300c-2018-gaz',
			titleText: 'Chrysler 300C 2018 г., Газ/Бензин, 105 000 км, Топ състояние',
			stats: [
				{ icon: '/assets/icons/icon-gauge.svg', text: '105 000 км' },
				{ icon: '/assets/icons/calendar.svg', text: '2022' },
				{ icon: '/assets/icons/gaspump.svg', text: 'Газ/Бензин' },
				{ icon: '/assets/icons/manual.svg', text: 'Автоматик' }
			],
			priceClass: 'card-box__price mb-15',
			priceText: '17 000 EUR',
			compareClass: 'compare-details btn btn-small open-modal',
			viewHref: '/inventory/chrysler-300c-2018-gaz'
		},
		{
			id: 'bmw-i7',
			highlightText: 'Добра цена',
			highlightClass: 'bg-green text-white highlight',
			imageHref: '/inventory/chrysler-300c-2018-gaz',
			imageSrc: '/assets/images/card/card-2.jpg',
			imageClass: 'card--img',
			brandHref: '/inventory/chrysler-300c-2018-gaz',
			brandClass: 'text-white',
			brandText: 'Hyundai',
			titleHref: '/inventory/chrysler-300c-2018-gaz',
			titleText: 'BMW i7 2023 г., Електрически, 127 000 км, FULL MAX',
			stats: [
				{ icon: '/assets/icons/icon-gauge.svg', text: '127 000 км' },
				{ icon: '/assets/icons/calendar.svg', text: '2018' },
				{ icon: '/assets/icons/gaspump.svg', text: 'Бензин' },
				{ icon: '/assets/icons/auto.svg', text: 'Автоматик' }
			],
			priceClass: 'h6 card-box__price mb-15 flex justify-between gap-8 items-center',
			priceText: '81 000 EUR',
			monthlyText: '588 лв./мес.',
			monthlyHref: '/inventory/chrysler-300c-2018-gaz',
			monthlyLinkText: 'Виж вноска',
			compareClass: 'compare-details btn btn-small compare open-modal',
			viewHref: '/inventory/chrysler-300c-2018-gaz'
		},
		{
			id: 'bmw-520i',
			imageHref: '/inventory/chrysler-300c-2018-gaz',
			imageSrc: '/assets/images/card/card-3.jpg',
			imageClass: 'card--img',
			brandHref: '/inventory/chrysler-300c-2018-gaz',
			brandClass: 'text-white',
			brandText: 'Kia',
			titleHref: '/inventory/chrysler-300c-2018-gaz',
			titleText: 'BMW 520i 2006 г., Бензин, 201 000 км, Топ състояние',
			stats: [
				{ icon: '/assets/icons/icon-gauge.svg', text: '201 000 км' },
				{ icon: '/assets/icons/calendar.svg', text: '2020' },
				{ icon: '/assets/icons/gaspump.svg', text: 'Diesel' },
				{ icon: '/assets/icons/auto.svg', text: 'Автоматик' }
			],
			priceClass: 'card-box__price mb-15',
			priceText: '4 500 EUR',
			compareClass: 'compare-details btn btn-small open-modal',
			viewHref: '/inventory/chrysler-300c-2018-gaz'
		},
		{
			id: 'bmw-x4',
			imageHref: '/inventory/chrysler-300c-2018-gaz',
			imageSrc: imageFallback,
			imageClass: 'card--img daynight-img-fallback',
			imageFallback: true,
			brandHref: '/inventory/chrysler-300c-2018-gaz',
			brandClass: 'text-white',
			brandText: 'Chevrolet',
			titleHref: '/inventory/chrysler-300c-2018-gaz',
			titleText: 'BMW X4 2.0D 2017 г., Дизел, 171 000 км, M Pack',
			stats: [
				{ icon: '/assets/icons/icon-gauge.svg', text: '171 000 км' },
				{ icon: '/assets/icons/calendar.svg', text: '2023' },
				{ icon: '/assets/icons/gaspump.svg', text: 'Бензин' },
				{ icon: '/assets/icons/auto.svg', text: 'Автоматик' }
			],
			priceClass: 'card-box__price mb-15',
			priceText: '17 500 EUR',
			compareClass: 'compare-details btn btn-small open-modal',
			viewHref: '/inventory/chrysler-300c-2018-gaz'
		},
		{
			id: 'bmw-730d',
			imageHref: '/inventory/chrysler-300c-2018-gaz',
			imageSrc: '/assets/images/card/card-9.jpg',
			imageClass: 'card--img',
			brandHref: '/inventory/chrysler-300c-2018-gaz',
			brandClass: 'text-white',
			brandText: 'Audi',
			titleHref: '/inventory/chrysler-300c-2018-gaz',
			titleText: 'BMW 730 D 2009 г., Дизел, 225 000 км, 4x4',
			stats: [
				{ icon: '/assets/icons/icon-gauge.svg', text: '225 000 км' },
				{ icon: '/assets/icons/calendar.svg', text: '2022' },
				{ icon: '/assets/icons/gaspump.svg', text: 'Газ/Бензин' },
				{ icon: '/assets/icons/manual.svg', iconClass: 'w-20 h-20', text: 'Автоматик' }
			],
			priceClass: 'card-box__price mb-15',
			priceText: '4 500 EUR',
			compareClass: 'compare-details btn btn-small open-modal',
			viewHref: '/inventory/chrysler-300c-2018-gaz'
		},
		{
			id: 'genesis-g80',
			highlightText: 'Специално',
			highlightClass: 'bg-primary-2 text-white highlight',
			imageHref: '/inventory/chrysler-300c-2018-gaz',
			imageSrc: '/assets/images/card/card-6.jpg',
			imageClass: 'card--img',
			brandHref: '/inventory/chrysler-300c-2018-gaz',
			brandClass: 'text-white',
			brandText: 'BMW',
			titleHref: '/inventory/chrysler-300c-2018-gaz',
			titleText: 'Genesis Electrified G80',
			stats: [
				{ icon: '/assets/icons/icon-gauge.svg', text: '51600 км' },
				{ icon: '/assets/icons/calendar.svg', text: '2021' },
				{ icon: '/assets/icons/gaspump.svg', text: 'Diesel' },
				{ icon: '/assets/icons/auto.svg', text: 'Автоматик' }
			],
			priceClass: 'card-box__price mb-15',
			priceText: '$24.900,00',
			compareClass: 'compare-details btn btn-small open-modal',
			viewHref: '/inventory/chrysler-300c-2018-gaz'
		}
	];

	const paginationPages = [1, 2] as const;

	function resolveMaybe(src: string) {
		return src.startsWith('/') ? resolve(src as `/${string}`) : src;
	}
</script>

{#snippet heartIcon()}
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g clip-path="url(#clip0_13399_19510)">
			<path
				d="M8 14C8 14 1.5 10.5 1.5 6.375C1.5 5.47989 1.85558 4.62145 2.48851 3.98851C3.12145 3.35558 3.97989 3 4.875 3C6.28688 3 7.49625 3.76937 8 5C8.50375 3.76937 9.71312 3 11.125 3C12.0201 3 12.8785 3.35558 13.5115 3.98851C14.1444 4.62145 14.5 5.47989 14.5 6.375C14.5 10.5 8 14 8 14Z"
				stroke="white"
				stroke-linecap="round"
				stroke-linejoin="round"
			></path>
		</g>
	</svg>
{/snippet}

{#snippet compareIcon()}
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g clip-path="url(#clip0_13399_19575)">
			<path
				d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
				stroke="#1C1C1C"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			></path>
			<path
				d="M6.875 10H13.125"
				stroke="#1C1C1C"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			></path>
			<path
				d="M10 6.875V13.125"
				stroke="#1C1C1C"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			></path>
		</g>
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

{#snippet favoriteCard(card: FavoriteCard)}
	<div class="card-box card-box-style-1">
		<div class="top">
			{#if card.highlightText}
				<p class={card.highlightClass}>{card.highlightText}</p>
			{:else}
				<p></p>
			{/if}

			<p class="heart">
				{@render heartIcon()}
			</p>
		</div>
		<div class="image">
			<a href={resolve(card.imageHref)}>
				<img
					class={card.imageClass}
					src={resolveMaybe(card.imageSrc)}
					alt={card.titleText}
					data-daynight-img="1"
					data-daynight-img-fallback={card.imageFallback ? '1' : undefined}
					decoding="async"
					loading="eager"
				/>
			</a>
		</div>
		<div class="content border-light border-top-none">
			<div class="bottom">
				<p class="category text-white uppercase">
					<a href={resolve(card.brandHref)} class={card.brandClass}>{card.brandText}</a>
				</p>

				<div class="flex items-center gap-8">
					<p class="category text-white uppercase">
						<img
							src={resolve('/assets/icons/picture.svg')}
							alt=""
							data-daynight-img="1"
							decoding="async"
							loading="eager"
						/>
						8
					</p>
					<p class="category text-white uppercase">
						<img
							src={resolve('/assets/icons/play.svg')}
							alt=""
							data-daynight-img="1"
							decoding="async"
							loading="eager"
						/>
						1
					</p>
				</div>
			</div>
			<p class="h6 card-box__title mb-8">
				<a href={resolve(card.titleHref)}>{card.titleText}</a>
			</p>

			<ul class="tag mb-10">
				{#each card.stats as stat (stat.icon + stat.text)}
					<li>
						<img
							class={stat.iconClass}
							src={resolve(stat.icon)}
							alt=""
							data-daynight-img="1"
							decoding="async"
							loading="eager"
						/>
						<span>{stat.text}</span>
					</li>
				{/each}
			</ul>

			<p class={card.priceClass}>
				{card.priceText}
				{#if card.monthlyText && card.monthlyHref && card.monthlyLinkText}
					<span class="text-sm">
						{card.monthlyText}
						<a href={resolve(card.monthlyHref)} class="text-underline text-muted ml-2 text-xs">
							{card.monthlyLinkText}
						</a>
					</span>
				{/if}
			</p>

			<div class="divider mb-15"></div>

			<div class="flex justify-between">
				<p class={card.compareClass} data-modal-id="#CompareModal">
					{@render compareIcon()}
					Сравни
				</p>

				<a href={resolve(card.viewHref)} class="view-details">
					Виж детайли
					<img
						class="ml-4"
						src={resolve('/assets/icons/CaretCircleRight.svg')}
						alt=""
						data-daynight-img="1"
						decoding="async"
						loading="eager"
					/>
				</a>
			</div>
		</div>
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
			Show Моят профил
		</button>
		<p class="h3 mb-40">Запазени автомобили</p>

		<div
			class="dashboard-box style-4 wow fadeIn animated bg-white"
			data-wow-delay="0.1s"
			style="visibility: visible; animation-delay: 0.1s;"
		>
			<div class="lg-grid-cols-2 md-grid-cols-1 mb-30 grid grid-cols-3 gap-x-23 gap-y-30">
				{#each cards as card (card.id)}
					{@render favoriteCard(card)}
				{/each}
			</div>

			<ul class="pagination justify-center">
				{#each paginationPages as pageNumber (pageNumber)}
					<li>
						<a
							href={resolve(`/dashboard/favorites?page=${pageNumber}`)}
							class={pageNumber === 1 ? 'pagination__link active' : 'pagination__link'}
						>
							{pageNumber}
						</a>
					</li>
				{/each}
				<li>
					<a href={resolve('/dashboard/favorites?page=2')} class="pagination__link">
						{@render nextIcon()}
					</a>
				</li>
			</ul>
		</div>
	</div>
</div>
