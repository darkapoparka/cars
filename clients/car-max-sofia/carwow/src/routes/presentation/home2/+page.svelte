<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import {
		BadgeEuro,
		Car,
		CheckCircle2,
		ChevronRight,
		CircleUserRound,
		Euro,
		HeartHandshake,
		Menu,
		Search,
		Sparkles,
		Star,
		Truck,
		Zap
	} from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const searchTabs = [
		{ id: 'find', label: 'Find a car', placeholder: 'Search by body type' },
		{ id: 'sell', label: 'Sell my car', placeholder: 'Enter make, model or reg' },
		{ id: 'reviews', label: 'Read reviews', placeholder: 'Search reviews by model' }
	] as const;

	type SearchTab = (typeof searchTabs)[number]['id'];

	let activeTab = $state<SearchTab>('find');
	let query = $state('');
	const activeSearch = $derived(searchTabs.find((tab) => tab.id === activeTab) ?? searchTabs[0]);
	const starIndices = [0, 1, 2, 3, 4] as const;

	const pillIcons = [
		Car,
		HeartHandshake,
		BadgeEuro,
		CheckCircle2,
		Truck,
		Sparkles,
		Zap,
		HeartHandshake,
		Euro
	];

	const reviews = [
		{
			title: 'Outstanding service',
			body: 'The car was ready, the history was clear, and every document was handled on time.',
			author: 'Nikolay, 1 hour ago'
		},
		{
			title: 'Clear pricing',
			body: 'I saw the price, checked the car, and got finance support without surprises.',
			author: 'Maria, 2 hours ago'
		},
		{
			title: 'Smooth part exchange',
			body: 'I left my old car and drove away in the new one the same day. Very fair process.',
			author: 'Georgi, 3 hours ago'
		},
		{
			title: 'Inspection support',
			body: 'They helped with inspection and registration. The whole process felt organised.',
			author: 'Iva, 5 hours ago'
		}
	];

	const guideCards = [
		{
			title: 'How to buy a used car with confidence',
			image: '/assets/dealer/inventory/21776406793706557-1.webp',
			href: '/blog'
		},
		{
			title: 'Finance, registration and paperwork',
			image: '/assets/dealer/inventory/21776406793706557-1.webp',
			href: '/financing'
		},
		{
			title: 'Sell or part exchange with CAR MAX',
			image: '/assets/images/sell/trade-in-promo-v1.webp',
			href: '/sell-your-car'
		}
	] as const;

	function submitSearch(event: SubmitEvent) {
		event.preventDefault();
		const target =
			activeTab === 'sell' ? '/sell-your-car' : activeTab === 'reviews' ? '/reviews' : '/inventory';
		const search = query.trim();
		void goto(resolve(search ? `${target}?q=${encodeURIComponent(search)}` : target));
	}
</script>

<svelte:head>
	<title>CAR MAX Marketplace | Home2</title>
	<meta
		name="description"
		content="Browse, buy, sell and review verified cars from CAR MAX София."
	/>
	<meta name="robots" content="noindex,nofollow" />
</svelte:head>

<main class="home2-shell">
	<section class="home2-hero" aria-labelledby="home2-title">
		<img
			class="home2-hero__cars"
			src="/assets/images/home2/daynight-hero-showroom-v2.webp"
			alt=""
			aria-hidden="true"
		/>

		<header class="home2-nav" aria-label="Home2 navigation">
			<a class="home2-logo" href={resolve('/presentation/home2')} aria-label="CAR MAX Home2">
				<img src="/assets/dealer/brand/logo.jpg" alt="CAR MAX" />
			</a>

			<nav class="home2-nav__links" aria-label="Primary">
				<a href={resolve('/inventory')}>Cars</a>
				<a href={resolve('/services')}>Services</a>
				<a href={resolve('/sell-your-car')}>Sell</a>
				<a href={resolve('/about')}>About us</a>
				<a href={resolve('/contact')}>Contact</a>
			</nav>

			<div class="home2-nav__actions" aria-label="Quick actions">
				<a href={resolve('/admin/login')}>
					<CircleUserRound size={27} strokeWidth={3} />
					<span>Log in</span>
				</a>
				<button type="button" aria-label="Menu">
					<Menu size={33} strokeWidth={3} />
					<span>Menu</span>
				</button>
			</div>
		</header>

		<h1 id="home2-title">
			<span>Changing your car?</span>
			<span>CAR MAX can help</span>
		</h1>

		<form class="home2-search" onsubmit={submitSearch} aria-label="Find your next car">
			<div class="home2-search__tabs" role="tablist" aria-label="Search mode">
				{#each searchTabs as tab (tab.id)}
					<button
						class:home2-search__tab--active={activeTab === tab.id}
						type="button"
						role="tab"
						aria-selected={activeTab === tab.id}
						onclick={() => (activeTab = tab.id)}
					>
						{tab.label}
					</button>
				{/each}
			</div>

			<label class="home2-search__input">
				<span class="sr-only">{activeSearch.placeholder}</span>
				<input bind:value={query} placeholder={activeSearch.placeholder} />
				<button type="submit" aria-label="Search">
					<Search size={26} strokeWidth={2.6} />
				</button>
			</label>

			<p>
				or let us help you
				<a href={resolve('/inventory')}>Find a car</a>
			</p>
		</form>
	</section>

	<section class="home2-market">
		<div class="home2-shortcuts" aria-label="Popular searches">
			{#each data.shortcutPills as pill, index (pill)}
				{@const ShortcutIcon = pillIcons[index] ?? Car}
				<a href={resolve('/inventory')}>
					<ShortcutIcon size={19} strokeWidth={3} />
					{pill}
				</a>
			{/each}
		</div>

		<section class="home2-sell-card" aria-labelledby="sell-car-title">
			<div class="home2-sell-card__copy">
				<h2 id="sell-car-title">Sell your car for what it’s really worth</h2>
				<p>
					Get a clear valuation, part-exchange support, and help with the paperwork from our Plovdiv
					team.
				</p>
				<a href={resolve('/sell-your-car')}>Get instant valuation</a>
			</div>
			<div class="home2-sell-card__media">
				<img src="/assets/images/home2/daynight-sell-banner-v2.webp" alt="" aria-hidden="true" />
				<span>ENTER REG</span>
			</div>
		</section>

		<section class="home2-budget" aria-labelledby="budget-title">
			<h2 id="budget-title">Browse by budget</h2>
			<div class="home2-budget__grid">
				{#each data.budgetTiles as tile (tile.label)}
					<a href={resolve('/inventory')} class="home2-budget-tile">
						<img src={tile.image} alt="" aria-hidden="true" />
						<span>{tile.label}</span>
						<small>{tile.count} cars</small>
					</a>
				{/each}
			</div>
		</section>

		<section class="home2-trending" aria-labelledby="trending-title">
			<div class="home2-section-title">
				<Zap size={54} fill="currentColor" strokeWidth={2.4} />
				<div>
					<h2 id="trending-title">Premium is trending</h2>
					<p>Popular CAR MAX picks, ready to compare side by side</p>
				</div>
			</div>

			<div class="home2-cars">
				{#each data.featuredCars as car (car.slug)}
					<article class="home2-car-card">
						<div class="home2-car-card__top">
							<div>
								<h3>{car.title}</h3>
								<p>{car.summary}</p>
								<small>{car.subtitle}</small>
							</div>
							<span>{car.badge}</span>
						</div>
						<strong>
							<CheckCircle2 size={15} strokeWidth={3} />
							{car.saving}
						</strong>
						<div class="home2-car-card__media">
							<img src={car.cardImage} alt={car.title} />
						</div>
						<div class="home2-car-card__price">
							<div class="home2-car-card__offers">
								<span class="home2-car-card__cash">
									<em>Cash from</em>
									<b>{car.price}</b>
								</span>
								<span class="home2-car-card__finance">Finance available</span>
							</div>
							<a href={resolve(`/inventory/${car.slug}`)} aria-label={`View ${car.title}`}>
								<span class="sr-only">View car</span>
								<ChevronRight size={20} strokeWidth={3} />
							</a>
						</div>
					</article>
				{/each}
			</div>
		</section>

		<section class="home2-reviews" aria-labelledby="reviews-title">
			<div class="home2-section-title">
				<Star size={55} fill="currentColor" strokeWidth={1.8} />
				<div>
					<h2 id="reviews-title">This is how it should feel</h2>
					<p>Customers rate CAR MAX as excellent for buying, selling and support</p>
				</div>
			</div>

			<div class="home2-review-grid">
				{#each reviews as review (review.title)}
					<article class="home2-review">
						<div class="home2-review__stars" aria-label="5 star rating">
							{#each starIndices as star (`${review.title}-${star}`)}
								<span>★</span>
							{/each}
							<small><CheckCircle2 size={13} /> Verified</small>
						</div>
						<h3>{review.title}</h3>
						<p>{review.body}</p>
						<footer>{review.author}</footer>
					</article>
				{/each}
			</div>
			<p class="home2-rating">
				Rated {data.stats.rating} based on {data.stats.reviews} local reviews.
			</p>
		</section>
	</section>

	<section class="home2-dark" aria-labelledby="easy-title">
		<div class="home2-dark__intro">
			<img src="/brand/daynight-team-placeholder.svg" alt="CAR MAX consultant" />
			<div>
				<h2 id="easy-title">We make car changing easy</h2>
				<p>
					From the first search to the final documents, our team helps you compare cars, arrange
					inspection, financing, registration and trade-in without losing the simple marketplace
					feel.
				</p>
			</div>
		</div>

		<div class="home2-guides">
			{#each guideCards as guide (guide.href)}
				<a href={resolve(guide.href)}>
					<img src={guide.image} alt="" aria-hidden="true" />
					<span>{guide.title}</span>
				</a>
			{/each}
		</div>
	</section>

	<section class="home2-explore" aria-labelledby="explore-title">
		<div class="home2-section-title home2-section-title--explore">
			<HeartHandshake size={58} fill="currentColor" strokeWidth={2.3} />
			<div>
				<h2 id="explore-title">Explore cars</h2>
				<p>Browse CAR MAX stock by the brands and body styles customers ask for most.</p>
			</div>
		</div>

		<section class="home2-browse-block" aria-labelledby="brand-browse-title">
			<h3 id="brand-browse-title">Browse by brand</h3>
			<div class="home2-brand-grid">
				{#each data.brands as brand (brand.brand)}
					<a href={resolve('/inventory')} class="home2-brand-card">
						<span class="home2-brand-card__mark">
							{#if brand.logo}
								<img src={brand.logo} alt="" aria-hidden="true" />
							{:else}
								{brand.brand.slice(0, 1)}
							{/if}
						</span>
						<span class="home2-brand-card__copy">
							<strong>{brand.brand}</strong>
							<small>{brand.count} cars</small>
						</span>
						<ChevronRight size={18} strokeWidth={3} />
					</a>
				{/each}
			</div>
		</section>

		<section class="home2-browse-block" aria-labelledby="type-browse-title">
			<h3 id="type-browse-title">Browse by body type</h3>
			<div class="home2-type-grid">
				{#each data.bodyTypes as body (body.body)}
					<a href={resolve('/inventory')} class="home2-type-card">
						<img src={body.image} alt="" aria-hidden="true" />
						<span>
							<strong>{body.body}</strong>
							<small>{body.count} available</small>
						</span>
					</a>
				{/each}
			</div>
		</section>
	</section>
</main>

<style>
	:global(body:has(.home2-shell)) {
		margin: 0;
		background: #f3f4f6;
		color: #121214;
	}

	:global(body:has(.home2-shell) .site-header),
	:global(body:has(.home2-shell) .site-footer),
	:global(body:has(.home2-shell) .scroll-top) {
		display: none !important;
	}

	.home2-shell {
		--cyan: #1d63b7;
		--cyan-soft: #dcecff;
		--ink: #121214;
		--panel: #17191d;
		--paper: #f3f4f6;
		--tile: #e5e7eb;
		--mint: #1d63b7;
		--red: #ec1c2e;
		--daynight-blue: #1d63b7;
		--daynight-red: #ec1c2e;
		min-height: 100vh;
		overflow: clip;
		background: var(--paper);
		color: var(--ink);
		font-family:
			Inter,
			ui-sans-serif,
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
	}

	.home2-shell :where(a, button) {
		font: inherit;
	}

	.home2-shell :where(a) {
		color: inherit;
		text-decoration: none;
	}

	.home2-shell :where(a, button):focus-visible {
		outline: 3px solid var(--daynight-blue);
		outline-offset: 3px;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.home2-hero {
		position: relative;
		min-height: 420px;
		background: #101215;
		isolation: isolate;
	}

	.home2-hero::after {
		position: absolute;
		inset: 0;
		z-index: -1;
		background:
			linear-gradient(180deg, rgb(5 7 10 / 0.5), rgb(5 7 10 / 0.12) 45%, rgb(5 7 10 / 0.56)),
			linear-gradient(90deg, rgb(5 7 10 / 0.2), transparent 24%, transparent 76%, rgb(5 7 10 / 0.2));
		content: '';
		pointer-events: none;
	}

	.home2-hero__cars {
		position: absolute;
		inset: 0;
		z-index: -2;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center center;
	}

	.home2-nav {
		position: relative;
		z-index: 2;
		display: grid;
		grid-template-columns: minmax(210px, 1fr) auto minmax(210px, 1fr);
		align-items: start;
		gap: 18px;
		max-width: 1320px;
		margin: 0 auto;
		padding: 18px 24px 0;
	}

	.home2-nav__links {
		grid-column: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 34px;
		min-height: 42px;
		padding: 0;
		border: 0;
		border-radius: 0;
		background: transparent;
		color: white;
		font-size: 16px;
		font-weight: 900;
		line-height: 1;
	}

	.home2-nav__links a {
		text-shadow: 0 3px 14px rgb(0 0 0 / 0.75);
		transition: none;
	}

	.home2-logo {
		grid-column: 1;
		grid-row: 1;
		width: fit-content;
		display: inline-flex;
		align-items: center;
		min-height: 42px;
	}

	.home2-logo img {
		display: block;
		width: 188px;
		height: auto;
		object-fit: contain;
	}

	.home2-nav__actions {
		grid-column: 3;
		grid-row: 1;
		display: flex;
		align-items: flex-start;
		justify-content: flex-end;
		gap: 18px;
		padding-top: 0;
	}

	.home2-nav__actions :where(a, button) {
		display: grid;
		place-items: center;
		gap: 2px;
		min-width: 42px;
		min-height: 42px;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: white;
		font-size: 12px;
		font-weight: 950;
		line-height: 1;
		text-shadow: 0 3px 14px rgb(0 0 0 / 0.75);
		cursor: pointer;
	}

	.home2-nav__actions :where(a, button) :global(svg) {
		width: 28px;
		height: 28px;
		stroke: currentColor !important;
	}

	.home2-nav__actions :where(a, button) :global(svg *) {
		color: inherit !important;
		stroke: currentColor !important;
	}

	.home2-nav__actions :where(a, button) span,
	.home2-nav__actions :where(a, button) :global(svg),
	.home2-car-card__price a :global(svg) {
		color: inherit;
	}

	.home2-hero h1,
	.home2-sell-card h2,
	.home2-budget h2,
	.home2-section-title h2,
	.home2-dark h2 {
		margin: 0;
		font-family: 'Arial Black', Impact, Inter, ui-sans-serif, system-ui, sans-serif;
		font-weight: 1000;
		letter-spacing: 0;
		text-transform: uppercase;
	}

	.home2-hero h1 {
		position: absolute;
		z-index: 1;
		top: 90px;
		left: 50%;
		width: min(1180px, calc(100% - 56px));
		transform: translateX(-50%);
		margin: 0;
		color: white;
		display: grid;
		gap: 2px;
		text-align: center;
		font-size: clamp(42px, 4.4vw, 68px);
		line-height: 0.9;
		text-shadow: 0 14px 34px rgb(0 0 0 / 0.45);
		white-space: normal;
	}

	.home2-hero h1 span {
		display: block;
		color: inherit !important;
		font: inherit !important;
		line-height: inherit !important;
		text-transform: inherit;
	}

	.home2-search {
		position: absolute;
		z-index: 3;
		left: 50%;
		bottom: 0;
		width: min(710px, calc(100% - 36px));
		transform: translateX(-50%);
		border: 1px solid rgb(255 255 255 / 0.08);
		border-radius: 8px;
		background: var(--panel);
		color: white;
		box-shadow: 0 18px 44px rgb(12 12 12 / 0.22);
		overflow: hidden;
	}

	.home2-search__tabs {
		display: flex;
		justify-content: center;
		gap: 20px;
		height: 58px;
		border-bottom: 1px solid rgb(255 255 255 / 0.12);
	}

	.home2-search__tabs button {
		position: relative;
		border: 0;
		background: transparent;
		color: white;
		font-size: 18px;
		font-weight: 950;
		cursor: pointer;
	}

	.home2-search__tabs button::after {
		position: absolute;
		left: 50%;
		bottom: 0;
		width: 0;
		height: 2px;
		background: white;
		content: '';
		transform: translateX(-50%);
		transition: width 160ms ease;
	}

	.home2-search__tabs .home2-search__tab--active::after {
		width: 88px;
	}

	.home2-search__input {
		display: flex;
		align-items: center;
		width: min(500px, calc(100% - 60px));
		height: 56px;
		margin: 13px auto;
		border-radius: 999px;
		background: white;
		overflow: hidden;
	}

	.home2-search__input input {
		width: 100%;
		min-width: 0;
		border: 0;
		outline: 0;
		padding: 0 20px;
		color: var(--ink);
		font-size: 19px;
		font-weight: 650;
	}

	.home2-search__input input::placeholder {
		color: #8a888d;
	}

	.home2-search__input button {
		display: grid;
		place-items: center;
		width: 55px;
		height: 55px;
		margin-right: 1px;
		border: 0;
		border-radius: 50%;
		background: var(--daynight-blue);
		color: white;
		cursor: pointer;
	}

	.home2-search p {
		margin: 4px 0 15px;
		color: white;
		text-align: center;
		font-size: 14px;
		font-weight: 850;
	}

	.home2-search p a {
		display: inline-flex;
		align-items: center;
		min-height: 36px;
		margin-left: 5px;
		padding: 0 13px;
		border: 1px solid white;
		border-radius: 5px;
		color: white;
	}

	.home2-market {
		padding: 32px 39px 58px;
		background: var(--paper);
	}

	.home2-shortcuts {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 15px;
		margin-bottom: 18px;
		scrollbar-width: none;
	}

	.home2-shortcuts::-webkit-scrollbar {
		display: none;
	}

	.home2-shortcuts a {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 45px;
		padding: 0 17px;
		border-radius: 8px;
		background: white;
		font-size: 16px;
		font-weight: 850;
		box-shadow:
			0 12px 28px rgb(15 23 42 / 0.06),
			inset 0 -1px 0 rgb(0 0 0 / 0.04);
		transition:
			transform 160ms ease,
			box-shadow 160ms ease,
			background 160ms ease;
	}

	.home2-sell-card {
		display: grid;
		grid-template-columns: 0.96fr 1fr;
		max-width: 1320px;
		min-height: 292px;
		margin: 0 auto;
		border-radius: 8px;
		background: #121316;
		box-shadow: 0 20px 44px rgb(15 23 42 / 0.08);
		overflow: hidden;
	}

	.home2-sell-card__copy {
		padding: 36px 32px 34px;
		background: linear-gradient(135deg, rgb(29 99 183 / 0.22), transparent 42%), #121316;
		color: white;
	}

	.home2-sell-card h2 {
		max-width: 720px;
		color: white;
		font-size: clamp(30px, 2.3vw, 36px);
		line-height: 1.05;
		white-space: normal;
	}

	.home2-sell-card p {
		max-width: 680px;
		margin: 22px 0 0;
		color: rgb(255 255 255 / 0.9);
		font-size: 18px;
		font-weight: 760;
		line-height: 1.42;
	}

	.home2-sell-card__copy a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 303px;
		height: 48px;
		margin-top: 30px;
		border-radius: 5px;
		background: var(--daynight-red);
		color: white;
		box-shadow: 0 12px 24px rgb(236 28 46 / 0.25);
		font-size: 18px;
		font-weight: 950;
		transition:
			transform 160ms ease,
			box-shadow 160ms ease,
			background 160ms ease;
	}

	.home2-sell-card__media {
		position: relative;
		min-width: 0;
		width: 100%;
		justify-self: stretch;
		background: #121316;
	}

	.home2-sell-card__media::before {
		position: absolute;
		inset: 0;
		z-index: 1;
		background:
			linear-gradient(90deg, #121316 0%, rgb(18 19 22 / 0) 16%),
			linear-gradient(270deg, #121316 0%, rgb(18 19 22 / 0) 10%);
		content: '';
		pointer-events: none;
	}

	.home2-sell-card__media img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.home2-sell-card__media span {
		position: absolute;
		z-index: 2;
		top: 31px;
		left: 50%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 200px;
		height: 56px;
		transform: translateX(-50%);
		border-radius: 8px;
		background: var(--daynight-red);
		color: white;
		font-family: 'Arial Black', Impact, sans-serif;
		font-size: 28px;
		line-height: 1;
	}

	.home2-budget {
		max-width: 1298px;
		margin: 35px auto 0;
	}

	.home2-budget h2 {
		text-align: center;
		font-size: clamp(40px, 4vw, 60px);
		line-height: 1;
	}

	.home2-budget__grid {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 18px;
		margin-top: 26px;
	}

	.home2-budget-tile {
		position: relative;
		display: grid;
		grid-template-rows: 1fr auto auto;
		min-height: 292px;
		padding: 0 14px 30px;
		border-radius: 8px;
		background: #deddd9;
		overflow: hidden;
		text-align: center;
		transition:
			transform 160ms ease,
			box-shadow 160ms ease;
	}

	.home2-budget-tile img {
		align-self: end;
		width: 164%;
		max-width: none;
		height: 185px;
		margin-left: -32%;
		object-fit: contain;
		object-position: center bottom;
	}

	.home2-budget-tile span {
		font-size: 18px;
		font-weight: 950;
	}

	.home2-budget-tile small {
		margin-top: 6px;
		color: #5d5b61;
		font-size: 13px;
		font-weight: 800;
	}

	.home2-trending,
	.home2-reviews {
		max-width: 1298px;
		margin: 44px auto 0;
	}

	.home2-section-title {
		display: flex;
		align-items: center;
		gap: 14px;
		color: var(--daynight-red);
	}

	.home2-section-title > :global(svg) {
		color: var(--daynight-red) !important;
		fill: var(--daynight-red) !important;
		stroke: var(--daynight-red) !important;
	}

	.home2-section-title h2 {
		color: var(--ink);
		font-size: clamp(29px, 3vw, 42px);
		line-height: 1.05;
		text-transform: none;
	}

	.home2-section-title p {
		margin: 8px 0 0;
		color: #3f3f46;
		font-size: 18px;
		font-weight: 600;
	}

	.home2-cars {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 18px;
		margin-top: 31px;
	}

	.home2-car-card {
		position: relative;
		min-height: 430px;
		padding: 18px;
		border: 0;
		border-radius: 8px;
		background: #deddd9;
		box-shadow: none;
		overflow: hidden;
		transition:
			transform 160ms ease,
			box-shadow 160ms ease;
	}

	.home2-car-card__top {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
		padding: 0;
	}

	.home2-car-card h3 {
		margin: 0;
		color: #0f1115;
		font-size: clamp(23px, 1.8vw, 28px);
		font-weight: 1000;
		line-height: 1.02;
	}

	.home2-car-card p {
		margin: 8px 0 0;
		max-width: 300px;
		color: #17181d;
		font-size: 14px;
		font-weight: 720;
		line-height: 1.22;
	}

	.home2-car-card small {
		display: block;
		margin-top: 7px;
		color: #44464c;
		font-size: 12px;
		font-weight: 820;
		line-height: 1.2;
	}

	.home2-car-card__top span {
		flex: 0 0 auto;
		min-width: 82px;
		padding: 8px 9px;
		border-radius: 5px;
		background: var(--daynight-blue);
		color: white;
		font-size: 11px;
		font-weight: 1000;
		letter-spacing: 0;
		text-align: center;
		text-transform: uppercase;
	}

	.home2-car-card strong {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		width: fit-content;
		max-width: calc(100% - 122px);
		margin-top: 10px;
		padding: 5px 8px;
		border-radius: 4px;
		background: #121316;
		color: white;
		font-size: 13px;
		font-weight: 950;
		line-height: 1.05;
	}

	.home2-car-card strong :global(svg) {
		color: var(--daynight-red);
		stroke: currentColor !important;
	}

	.home2-car-card__media {
		position: absolute;
		left: 18px;
		right: 72px;
		top: 172px;
		height: 178px;
		margin: 0;
		background: transparent;
		overflow: visible;
	}

	.home2-car-card__media::after {
		display: none;
	}

	.home2-car-card__media img {
		display: block;
		width: 118%;
		height: 100%;
		max-width: none;
		object-fit: contain;
		object-position: center bottom;
		filter: drop-shadow(0 13px 10px rgb(0 0 0 / 0.18));
		transition: none;
	}

	.home2-car-card__price {
		position: absolute;
		right: 18px;
		bottom: 18px;
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		gap: 10px;
	}

	.home2-car-card__offers {
		display: grid;
		justify-items: end;
		gap: 6px;
		min-width: 168px;
	}

	.home2-car-card__cash,
	.home2-car-card__finance {
		display: inline-flex;
		align-items: baseline;
		justify-content: center;
		gap: 4px;
		min-height: 28px;
		width: max-content;
		padding: 0 11px;
		border-radius: 4px;
		background: white;
		color: #101115;
		box-shadow: 0 1px 0 rgb(0 0 0 / 0.04);
		font-size: 14px;
		font-weight: 760;
		line-height: 1;
		white-space: nowrap;
	}

	.home2-car-card__cash b {
		color: #111318;
		font-size: 14px;
		font-weight: 1000;
		line-height: 1;
	}

	.home2-car-card__cash em {
		font-style: normal;
		font-weight: 720;
	}

	.home2-car-card__finance {
		font-size: 13px;
		font-weight: 900;
	}

	.home2-car-card__price a {
		display: grid;
		place-items: center;
		width: 50px;
		height: 50px;
		border-radius: 999px;
		background: var(--ink);
		color: white;
		box-shadow: 0 8px 16px rgb(0 0 0 / 0.16);
		transition:
			transform 160ms ease,
			box-shadow 160ms ease,
			background 160ms ease;
	}

	.home2-car-card__price a :global(svg),
	.home2-car-card__price a :global(svg *) {
		color: white !important;
		stroke: white !important;
	}

	.home2-reviews {
		margin-top: 66px;
	}

	.home2-review-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 20px;
		margin-top: 30px;
	}

	.home2-review {
		min-height: 160px;
		padding: 15px 16px;
		background: white;
		box-shadow: 0 1px 5px rgb(12 12 12 / 0.05);
	}

	.home2-review__stars {
		display: flex;
		align-items: center;
		gap: 2px;
		color: white;
	}

	.home2-review__stars span {
		display: grid;
		place-items: center;
		width: 18px;
		height: 18px;
		background: #02b67a;
		font-size: 12px;
		line-height: 1;
	}

	.home2-review__stars small {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		margin-left: 5px;
		color: #55545a;
		font-size: 12px;
	}

	.home2-review h3 {
		margin: 13px 0 7px;
		font-size: 16px;
		font-weight: 950;
	}

	.home2-review p {
		margin: 0;
		color: #24242a;
		font-size: 14px;
		line-height: 1.35;
	}

	.home2-review footer {
		margin-top: 22px;
		color: #59585f;
		font-size: 12px;
		font-weight: 700;
	}

	.home2-rating {
		margin: 13px 0 0;
		text-align: center;
		font-size: 14px;
		font-weight: 600;
	}

	.home2-dark {
		padding: 64px 64px 78px;
		border-radius: 8px 8px 0 0;
		background: #111;
		color: white;
	}

	.home2-dark__intro,
	.home2-guides {
		max-width: 1298px;
		margin: 0 auto;
	}

	.home2-dark__intro {
		display: flex;
		align-items: center;
		gap: 24px;
	}

	.home2-dark__intro img {
		width: 72px;
		height: 72px;
		border: 4px solid var(--cyan);
		border-radius: 999px;
		object-fit: cover;
	}

	.home2-dark h2 {
		color: white;
		font-size: clamp(27px, 2.9vw, 40px);
		line-height: 1.05;
	}

	.home2-dark p {
		max-width: 830px;
		margin: 22px 0 0;
		color: #f3f3f3;
		font-size: 18px;
		font-weight: 700;
		line-height: 1.5;
	}

	.home2-guides {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
		margin-top: 56px;
	}

	.home2-guides a {
		display: grid;
		gap: 15px;
		color: white;
		font-size: 19px;
		font-weight: 950;
		line-height: 1.18;
		transition: transform 160ms ease;
	}

	.home2-guides span {
		color: white;
	}

	.home2-guides img {
		width: 100%;
		aspect-ratio: 1.65;
		border-radius: 8px;
		object-fit: cover;
	}

	.home2-explore {
		padding: 64px 64px 104px;
		background: var(--paper);
	}

	.home2-explore > .home2-section-title,
	.home2-browse-block {
		max-width: 1298px;
		margin-inline: auto;
	}

	.home2-browse-block {
		margin-top: 34px;
	}

	.home2-browse-block h3 {
		margin: 0 0 16px;
		color: var(--ink);
		font-size: clamp(24px, 2vw, 32px);
		font-weight: 1000;
		line-height: 1.05;
	}

	.home2-brand-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 16px;
	}

	.home2-brand-card {
		box-sizing: border-box;
		flex: 0 1 calc((100% - 48px) / 4);
		display: grid;
		grid-template-columns: 64px minmax(0, 1fr) auto;
		align-items: center;
		gap: 16px;
		min-height: 128px;
		padding: 22px;
		border-radius: 8px;
		background: white;
		box-shadow: 0 14px 30px rgb(15 23 42 / 0.07);
		transition:
			transform 160ms ease,
			box-shadow 160ms ease;
	}

	.home2-brand-card__mark {
		display: grid;
		place-items: center;
		width: 64px;
		height: 64px;
		border-radius: 8px;
		background: #f0f1f3;
		color: var(--daynight-blue);
		font-size: 28px;
		font-weight: 1000;
	}

	.home2-brand-card__mark img {
		width: 42px;
		height: 42px;
		object-fit: contain;
		filter: grayscale(1) contrast(1.15);
	}

	.home2-brand-card__copy {
		display: grid;
		gap: 6px;
		min-width: 0;
	}

	.home2-brand-card__copy strong,
	.home2-type-card strong {
		color: #111318;
		font-size: 20px;
		font-weight: 950;
		line-height: 1.1;
	}

	.home2-brand-card__copy strong {
		white-space: nowrap;
	}

	.home2-brand-card__copy small,
	.home2-type-card small {
		color: #5d5b61;
		font-size: 14px;
		font-weight: 850;
	}

	.home2-brand-card :global(svg) {
		color: var(--daynight-red);
		stroke: currentColor !important;
	}

	.home2-type-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
	}

	.home2-type-card {
		position: relative;
		display: grid;
		grid-template-rows: 1fr auto;
		min-height: 246px;
		padding: 16px 18px 22px;
		border-radius: 8px;
		background: #deddd9;
		overflow: hidden;
		text-align: center;
		transition:
			transform 160ms ease,
			box-shadow 160ms ease;
	}

	.home2-type-card img {
		align-self: end;
		width: 124%;
		max-width: none;
		height: 154px;
		margin-left: -12%;
		object-fit: contain;
		object-position: center bottom;
	}

	.home2-type-card span {
		display: grid;
		gap: 6px;
	}

	@media (hover: hover) {
		.home2-shortcuts a:hover,
		.home2-budget-tile:hover,
		.home2-car-card:hover,
		.home2-guides a:hover,
		.home2-brand-card:hover,
		.home2-type-card:hover {
			transform: translateY(-2px);
		}

		.home2-shortcuts a:hover,
		.home2-brand-card:hover {
			box-shadow:
				0 20px 36px rgb(15 23 42 / 0.1),
				inset 0 -1px 0 rgb(0 0 0 / 0.04);
		}

		.home2-budget-tile:hover,
		.home2-car-card:hover,
		.home2-type-card:hover {
			box-shadow: 0 18px 34px rgb(15 23 42 / 0.1);
		}

		.home2-sell-card__copy a:hover {
			transform: translateY(-1px);
			box-shadow: 0 15px 28px rgb(236 28 46 / 0.28);
		}

		.home2-car-card__price a:hover {
			transform: translateY(-1px);
			background: #0b0c0f;
			box-shadow: 0 12px 22px rgb(0 0 0 / 0.2);
		}
	}

	@media (max-width: 1320px) {
		.home2-market {
			padding-inline: 24px;
		}

		.home2-shortcuts {
			gap: 10px;
		}

		.home2-shortcuts a {
			min-height: 44px;
			padding: 0 13px;
			font-size: 16px;
		}

		.home2-brand-card {
			grid-template-columns: 58px minmax(0, 1fr) auto;
			gap: 12px;
			padding: 18px;
		}

		.home2-brand-card__mark {
			width: 58px;
			height: 58px;
			font-size: 26px;
		}

		.home2-brand-card__mark img {
			width: 38px;
			height: 38px;
		}

		.home2-brand-card__copy strong {
			font-size: 18px;
		}
	}

	@media (max-width: 1100px) {
		.home2-nav {
			grid-template-columns: minmax(150px, 1fr) auto;
		}

		.home2-nav__actions {
			position: static;
			grid-column: 2;
			grid-row: 1;
			padding-top: 0;
		}

		.home2-nav__links {
			grid-column: 1 / -1;
			grid-row: 2;
			justify-self: center;
			max-width: none;
			flex-wrap: wrap;
			gap: 14px 18px;
		}

		.home2-sell-card {
			grid-template-columns: 1fr;
		}

		.home2-sell-card h2 {
			white-space: normal;
		}

		.home2-sell-card__media {
			min-height: 232px;
		}

		.home2-budget__grid,
		.home2-type-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.home2-review-grid,
		.home2-brand-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.home2-brand-card {
			flex-basis: calc((100% - 16px) / 2);
		}
	}

	@media (max-width: 760px) {
		.home2-hero {
			min-height: 536px;
		}

		.home2-hero__cars {
			inset: 0;
			height: 100%;
			opacity: 0.66;
			object-fit: cover;
			object-position: center center;
		}

		.home2-nav {
			grid-template-columns: 1fr auto;
			padding: 12px 18px 0;
		}

		.home2-nav__links {
			display: none;
		}

		.home2-logo {
			grid-column: 1;
			margin-top: 0;
		}

		.home2-logo img {
			width: 150px;
		}

		.home2-nav__actions {
			grid-column: 2;
			gap: 12px;
		}

		.home2-nav__actions a:not(:last-of-type) {
			display: none;
		}

		.home2-hero h1 {
			max-width: 360px;
			margin: 82px auto 0;
			position: relative;
			top: auto;
			right: auto;
			left: auto;
			width: auto;
			transform: none;
			font-size: 39px;
			white-space: normal;
		}

		.home2-search {
			bottom: 24px;
		}

		.home2-search__tabs {
			gap: 9px;
		}

		.home2-search__tabs button {
			font-size: 15px;
		}

		.home2-search__input {
			width: calc(100% - 28px);
		}

		.home2-market,
		.home2-explore {
			padding-inline: 16px;
		}

		.home2-shortcuts {
			justify-content: flex-start;
			overflow-x: auto;
			flex-wrap: nowrap;
			padding-bottom: 5px;
		}

		.home2-shortcuts a {
			white-space: nowrap;
		}

		.home2-budget h2 {
			font-size: 39px;
		}

		.home2-budget__grid,
		.home2-cars,
		.home2-review-grid,
		.home2-guides,
		.home2-brand-grid,
		.home2-type-grid {
			grid-template-columns: 1fr;
		}

		.home2-brand-card {
			flex-basis: 100%;
		}

		.home2-budget-tile {
			min-height: 210px;
		}

		.home2-sell-card__copy {
			padding: 24px 20px;
		}

		.home2-sell-card__copy a {
			width: 100%;
		}

		.home2-section-title {
			align-items: flex-start;
		}

		.home2-section-title h2 {
			font-size: 31px;
		}

		.home2-dark {
			padding: 46px 16px 70px;
		}

		.home2-dark__intro {
			align-items: flex-start;
		}

		.home2-dark p {
			font-size: 16px;
		}
	}
</style>
