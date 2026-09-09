<script lang="ts">
	import { resolve } from '$app/paths';

	type DropdownOption = {
		value: string;
		label: string;
		active?: boolean;
	};

	type Review = {
		id: string;
		menuId: string;
		menuDropdownId: string;
		avatar: `/${string}`;
		name: string;
		date: string;
		title: string;
		body: string;
	};

	const ratingOptions: DropdownOption[] = [
		{ value: 'all', label: 'All Ratings', active: true },
		{ value: '5', label: 'Rating 5' },
		{ value: '4', label: 'Rating 4' },
		{ value: '3', label: 'Rating 3' },
		{ value: '2', label: 'Rating 2' },
		{ value: '1', label: 'Rating 1' }
	];

	const dateOptions: DropdownOption[] = [
		{ value: 'desc', label: 'Най-нови' },
		{ value: 'asc', label: 'Най-стари' }
	];

	const reviews: Review[] = [
		{
			id: 'review-ivan',
			menuId: 'MoreDropdown-1',
			menuDropdownId: 'coreDropdownMessage',
			avatar: '/assets/images/avatar/avatar-4.png',
			name: 'Иван Д.',
			date: 'Август 2025',
			title: 'Отлично преживяване',
			body: 'Получих ясна информация за автомобила, документите и следващите стъпки. Огледът беше организиран спокойно, без натиск и без излишни обещания.'
		},
		{
			id: 'review-maria',
			menuId: 'MoreDropdown-2',
			menuDropdownId: 'coreDropdownMessage2',
			avatar: '/assets/images/avatar/coment-avatar-1.png',
			name: 'Мария Г.',
			date: 'Август 2025',
			title: 'Лесно и удобно',
			body: 'Сайтът е удобен и сравних няколко автомобила за минути. Вариантите за финансиране бяха обяснени ясно и намерих подходящ за бюджета ми.'
		},
		{
			id: 'review-nikolay',
			menuId: 'MoreDropdown-3',
			menuDropdownId: 'coreDropdownMessage3',
			avatar: '/assets/images/avatar/coment-avatar-2.png',
			name: 'Николай П.',
			date: 'Август 2025',
			title: 'Коректно и надеждно',
			body: 'Автомобилът беше представен коректно, със снимки, цена и обяснение за състоянието. Сделката мина бързо и подредено.'
		}
	];

	const starIndexes = [1, 2, 3, 4, 5] as const;
	const paginationPages = [1, 2, 3] as const;

	function optionClass(option: DropdownOption) {
		return option.active ? 'core-dropdown__option active' : 'core-dropdown__option';
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

{#snippet moreIcon()}
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M8.75 4.6875C8.75 4.44027 8.82331 4.1986 8.96066 3.99304C9.09802 3.78748 9.29324 3.62726 9.52165 3.53265C9.75005 3.43804 10.0014 3.41329 10.2439 3.46152C10.4863 3.50975 10.7091 3.6288 10.8839 3.80362C11.0587 3.97843 11.1778 4.20116 11.226 4.44364C11.2742 4.68611 11.2495 4.93745 11.1549 5.16585C11.0602 5.39426 10.9 5.58949 10.6945 5.72684C10.4889 5.86419 10.2472 5.9375 10 5.9375C9.66848 5.9375 9.35054 5.8058 9.11612 5.57138C8.8817 5.33696 8.75 5.01902 8.75 4.6875ZM10 8.75C9.75277 8.75 9.5111 8.82331 9.30554 8.96066C9.09998 9.09802 8.93976 9.29324 8.84515 9.52165C8.75054 9.75005 8.72579 10.0014 8.77402 10.2439C8.82225 10.4863 8.9413 10.7091 9.11612 10.8839C9.29093 11.0587 9.51366 11.1778 9.75614 11.226C9.99861 11.2742 10.2499 11.2495 10.4784 11.1549C10.7068 11.0602 10.902 10.9 11.0393 10.6945C11.1767 10.4889 11.25 10.2472 11.25 10C11.25 9.66848 11.1183 9.35054 10.8839 9.11612C10.6495 8.8817 10.3315 8.75 10 8.75ZM10 14.0625C9.75277 14.0625 9.5111 14.1358 9.30554 14.2732C9.09998 14.4105 8.93976 14.6057 8.84515 14.8341C8.75054 15.0626 8.72579 15.3139 8.77402 15.5564C8.82225 15.7988 8.9413 16.0216 9.11612 16.1964C9.29093 16.3712 9.51366 16.4903 9.75614 16.5385C9.99861 16.5867 10.2499 16.562 10.4784 16.4674C10.7068 16.3727 10.902 16.2125 11.0393 16.007C11.1767 15.8014 11.25 15.5597 11.25 15.3125C11.25 14.981 11.1183 14.663 10.8839 14.4286C10.6495 14.1942 10.3315 14.0625 10 14.0625Z"
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

{#snippet starRating()}
	<div class="mb-12 flex items-center">
		{#each starIndexes as index (index)}
			<img
				src={resolve('/assets/icons/star-2.svg')}
				alt="star"
				data-daynight-img="1"
				decoding="async"
				loading="eager"
			/>
		{/each}
	</div>
{/snippet}

{#snippet reviewActions(review: Review)}
	<div class="core-dropdown more" id={review.menuId}>
		<button class="core-dropdown__button user-admin" type="button">
			{@render moreIcon()}
		</button>
		<div class="core-dropdown__menu" id={review.menuDropdownId}>
			<ul class="core-dropdown__list more-links">
				<li>
					<a href={resolve('/dashboard/messages')} class="active">Изпрати съобщение</a>
				</li>
				<li>
					<a href={resolve('/dashboard/profile')}>View Profile</a>
				</li>
				<li>
					<a href={resolve('/dashboard/reviews')}>Delete Review</a>
				</li>
			</ul>
		</div>
	</div>
{/snippet}

{#snippet reviewItem(review: Review)}
	<div class="comment-box" data-start="5">
		<div class="comment-box__header mb-24 gap-12">
			<div class="comment-box__avatar">
				<img
					src={resolve(review.avatar)}
					alt="avatar"
					data-daynight-img="1"
					decoding="async"
					loading="eager"
				/>
			</div>
			<div>
				<div class="text-secondary gap-4 pt-4">
					<p class="h5 mb-4">{review.name}</p>
					<p class="text-secondary text-sm">{review.date}</p>
				</div>
			</div>

			{@render reviewActions(review)}
		</div>

		{@render starRating()}

		<p class="h5 mb-12">{review.title}</p>
		<p class="h7 line-height-28">{review.body}</p>
	</div>
{/snippet}

{#snippet ratingDropdown()}
	<div class="core-dropdown style-2 listing">
		<button class="core-dropdown__button dropdown__normal" type="button" id="ratingDropdownBtn">
			<span class="core-dropdown__selected">All Ratings</span>
			<img
				src={resolve('/assets/icons/chevron-down-primary.svg')}
				alt="chevron"
				class="core-dropdown__icon"
				data-daynight-img="1"
				decoding="async"
				loading="eager"
			/>
		</button>
		<div class="core-dropdown__menu" id="ratingDropdownMenu">
			<ul class="core-dropdown__list style2">
				{#each ratingOptions as option (option.value)}
					<li class="core-dropdown__item">
						<a
							href={resolve('/dashboard/reviews')}
							class={optionClass(option)}
							data-value={option.value}
						>
							{option.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
{/snippet}

{#snippet dateDropdown()}
	<div class="core-dropdown style-2 listing">
		<button class="core-dropdown__button dropdown__normal" type="button" id="sortDateDropdownBtn">
			<span class="core-dropdown__selected">(Default)</span>
			<img
				src={resolve('/assets/icons/chevron-down-primary.svg')}
				alt="chevron"
				class="core-dropdown__icon"
				data-daynight-img="1"
				decoding="async"
				loading="eager"
			/>
		</button>
		<div class="core-dropdown__menu" id="sortDateDropdownMenu">
			<ul class="core-dropdown__list style-2">
				{#each dateOptions as option (option.value)}
					<li class="core-dropdown__item">
						<a
							href={resolve('/dashboard/reviews')}
							class={optionClass(option)}
							data-value={option.value}
						>
							{option.label}
						</a>
					</li>
				{/each}
			</ul>
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
		<p class="h3 mb-40">Моите отзиви</p>
		<div class="dashboard-box style-2 mb-30 bg-white">
			<p class="h4 mb-14">Customer Feedback</p>

			<div class="mb-18 flex flex-wrap items-center justify-between gap-20">
				<form action={resolve('/dashboard/reviews')} class="search-form-listing">
					<input
						type="text"
						name="searchListing"
						id="searchListing"
						class="form-control"
						placeholder="Search by keyword"
						aria-label="Search by keyword"
						style=""
					/>
					<button type="submit">
						{@render searchIcon()}
					</button>
				</form>

				<div class="md-gap-12 flex flex-wrap gap-40">
					<div class="flex items-center gap-8">
						<p class="text-secondary">Sort by:</p>
						{@render ratingDropdown()}
					</div>

					<div class="flex items-center gap-8">
						<p class="text-secondary">Sort by:</p>
						{@render dateDropdown()}
					</div>
				</div>
			</div>

			<div class="divider mb-28 w-full"></div>

			<div class="comments style2 mb-28">
				{#each reviews as review (review.id)}
					{@render reviewItem(review)}
				{/each}
			</div>

			<div class="divider mb-32 w-full"></div>

			<div class="flex flex-wrap items-center justify-between gap-12">
				<ul class="pagination">
					{#each paginationPages as pageNumber (pageNumber)}
						<li>
							<a
								href={resolve(`/dashboard/reviews?page=${pageNumber}`)}
								class={pageNumber === 1 ? 'pagination__link active' : 'pagination__link'}
							>
								{pageNumber}
							</a>
						</li>
					{/each}
					<li>
						<a href={resolve('/dashboard/reviews?page=2')} class="pagination__link">
							{@render nextIcon()}
						</a>
					</li>
				</ul>
				<p class="text-secondary">Showing 1 to 9 of 16 entries</p>
			</div>
		</div>
	</div>
</div>
