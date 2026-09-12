<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import {
		BadgeCheck,
		Box,
		BriefcaseBusiness,
		Car,
		ChevronRight,
		CircleUserRound,
		CreditCard,
		Fuel,
		Heart,
		Search,
		ShieldCheck,
		Star,
		Tag,
		Truck,
		UsersRound,
		Zap
	} from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let activeTab = $state('find');
	let query = $state('');
	const activeSearch = $derived(
		data.searchTabs.find((tab) => tab.id === activeTab) ?? data.searchTabs[0]
	);

	const pillIcons = {
		zap: Zap,
		lease: BriefcaseBusiness,
		star: Star,
		car: Car,
		truck: Truck,
		suv: Car,
		fuel: Fuel,
		box: Box,
		tag: Tag
	};

	const sellIcons = [UsersRound, Truck, CreditCard];

	function getPillIcon(icon: string) {
		return pillIcons[icon as keyof typeof pillIcons] ?? Car;
	}

	function submitSearch(event: SubmitEvent) {
		event.preventDefault();
		const target =
			activeTab === 'sell' ? '/sell-your-car' : activeTab === 'reviews' ? '/reviews' : '/inventory';
		const search = query.trim();
		void goto(resolve(search ? `${target}?q=${encodeURIComponent(search)}` : target));
	}
</script>

<svelte:head>
	<title>Promosale Varna Marketplace | Home3</title>
	<meta
		name="description"
		content="A carwow-inspired Promosale Varna marketplace homepage for buying, selling and comparing cars."
	/>
	<meta name="robots" content="noindex,nofollow" />
</svelte:head>

<main class="home3-shell">
	<header class="home3-header" aria-label="Home3 navigation">
		<a class="home3-logo" href={resolve('/presentation/home3')} aria-label="Promosale Varna Home3">
			<span>DAY</span>
			<strong>AUTO</strong>
		</a>

		<nav class="home3-nav" aria-label="Primary">
			{#each data.navItems as item (item)}
				<a href={resolve('/inventory')}>{item}</a>
			{/each}
		</nav>

		<div class="home3-actions" aria-label="Account actions">
			<a href={resolve('/favorites')} aria-label="Saved cars">
				<Heart size={23} strokeWidth={2.1} />
				<span>Saved</span>
			</a>
			<a href={resolve('/admin/login')} aria-label="Sign in">
				<CircleUserRound size={23} strokeWidth={2.1} />
				<span>Sign in</span>
			</a>
			<a class="home3-sell-button" href={resolve('/sell-your-car')}>Sell my car</a>
		</div>
	</header>

	<section class="home3-hero" aria-labelledby="home3-title">
		<img
			class="home3-hero__car home3-hero__car--left"
			src="/assets/images/body-type/normalized/body-sedan-transparent.webp"
			alt=""
			aria-hidden="true"
		/>
		<img
			class="home3-hero__car home3-hero__car--right"
			src="/assets/images/body-type/normalized/body-suv-transparent.webp"
			alt=""
			aria-hidden="true"
		/>

		<div class="home3-hero__center">
			<h1 id="home3-title">
				<span>Changing your car?</span>
				<span>Promosale Varna can help</span>
			</h1>
			<i aria-hidden="true"></i>

			<form class="home3-search" onsubmit={submitSearch} aria-label="Find your next car">
				<div class="home3-search__tabs" role="tablist" aria-label="Search mode">
					{#each data.searchTabs as tab (tab.id)}
						<button
							class:home3-search__tab--active={activeTab === tab.id}
							type="button"
							role="tab"
							aria-selected={activeTab === tab.id}
							onclick={() => (activeTab = tab.id)}
						>
							{tab.label}
						</button>
					{/each}
				</div>

				<label class="home3-search__input">
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
		</div>
	</section>

	<section class="home3-market">
		<div class="home3-chips" aria-label="Popular searches">
			{#each data.shortcutPills as pill (pill.label)}
				{@const PillIcon = getPillIcon(pill.icon)}
				<a href={resolve('/inventory')}>
					<PillIcon size={19} strokeWidth={2.6} />
					{pill.label}
				</a>
			{/each}
		</div>

		<section class="home3-sell-panel" aria-labelledby="home3-sell-title">
			<div class="home3-sell-panel__copy">
				<h2 id="home3-sell-title">Sell your car for what it’s really worth</h2>
				<p>
					We’ll put your car in front of 5,500+ verified dealers. Fast payment, home collection,
					completely free.
				</p>
				<a href={resolve('/sell-your-car')}>Get instant valuation</a>
			</div>

			<div class="home3-sell-panel__media" aria-hidden="true">
				<img src="/assets/images/card/card-32.png" alt="" />
			</div>

			<ul class="home3-sell-panel__points" aria-label="Selling benefits">
				{#each data.sellPoints as point, index (point)}
					{@const SellIcon = sellIcons[index] ?? BadgeCheck}
					<li>
						<SellIcon size={24} strokeWidth={2.2} />
						<span>{point}</span>
					</li>
				{/each}
			</ul>
		</section>

		<section class="home3-budget" aria-labelledby="home3-budget-title">
			<h2 id="home3-budget-title">Browse by budget</h2>
			<div class="home3-budget__grid">
				{#each data.budgetTiles as tile (tile.label)}
					<a
						class="home3-budget-card"
						class:home3-budget-card--blue={tile.tone === 'blue'}
						class:home3-budget-card--dark={tile.tone === 'dark'}
						class:home3-budget-card--red={tile.tone === 'red'}
						href={resolve('/inventory')}
					>
						<span>
							<strong>{tile.label}</strong>
							<small>{tile.count}</small>
						</span>
						<img src={tile.image} alt="" aria-hidden="true" />
					</a>
				{/each}
			</div>
		</section>

		<section class="home3-premium" aria-labelledby="home3-premium-title">
			<div class="home3-section-head">
				<div>
					<Zap size={25} fill="currentColor" strokeWidth={2.2} />
					<h2 id="home3-premium-title">Premium is trending</h2>
				</div>
				<a href={resolve('/inventory')}>See all premium</a>
			</div>

			<div class="home3-premium__grid">
				{#each data.premiumCars as car, index (car.slug)}
					<article class="home3-premium-card">
						<div class="home3-premium-card__copy">
							<h3>{car.title}</h3>
							<p>{car.meta}</p>
							<span>
								<ShieldCheck size={12} strokeWidth={2.5} />
								{car.badge}
							</span>
						</div>
						<img
							class:home3-premium-card__image--blue={index === 1}
							src={car.image}
							alt={car.title}
						/>
						<div class="home3-premium-card__price">
							<small>Cash from</small>
							<strong>{car.cash}</strong>
							<small>Lease from</small>
							<b>{car.lease}</b>
						</div>
						<a href={resolve(`/inventory/${car.slug}`)} aria-label={`View ${car.title}`}>
							<ChevronRight size={22} strokeWidth={2.6} />
						</a>
					</article>
				{/each}
			</div>
		</section>

		<section class="home3-news" aria-labelledby="home3-news-title">
			<div class="home3-section-head">
				<h2 id="home3-news-title">Expert reviews & latest news</h2>
				<a href={resolve('/blog')}>View all</a>
			</div>

			<div class="home3-news__grid">
				{#each data.newsCards as card (card.title)}
					<a href={resolve('/blog')} class="home3-news-card">
						<img src={card.image} alt="" aria-hidden="true" />
						<strong>{card.title}</strong>
					</a>
				{/each}
			</div>
		</section>

		<section class="home3-explore" aria-labelledby="home3-explore-title">
			<div class="home3-section-head">
				<div>
					<Star size={25} fill="currentColor" strokeWidth={2.2} />
					<h2 id="home3-explore-title">Browse popular cars</h2>
				</div>
				<a href={resolve('/inventory')}>View all cars</a>
			</div>

			<section class="home3-browse-block" aria-labelledby="home3-brand-title">
				<h3 id="home3-brand-title">Browse by brand</h3>
				<div class="home3-brand-grid">
					{#each data.brands as brand (brand.brand)}
						<a href={resolve('/inventory')} class="home3-brand-card">
							<span class="home3-brand-card__mark">
								{#if brand.logo}
									<img src={brand.logo} alt="" aria-hidden="true" />
								{:else}
									{brand.brand.slice(0, 1)}
								{/if}
							</span>
							<span class="home3-brand-card__copy">
								<strong>{brand.brand}</strong>
								<small>{brand.count} cars</small>
							</span>
							<ChevronRight size={19} strokeWidth={2.8} />
						</a>
					{/each}
				</div>
			</section>

			<section class="home3-browse-block" aria-labelledby="home3-type-title">
				<h3 id="home3-type-title">Browse by body type</h3>
				<div class="home3-type-grid">
					{#each data.bodyTypes as body (body.body)}
						<a href={resolve('/inventory')} class="home3-type-card">
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
	</section>
</main>

<style>
	:global(body:has(.home3-shell)) {
		margin: 0;
		background: #fff;
		color: #070b14;
	}

	:global(body:has(.home3-shell) .site-header),
	:global(body:has(.home3-shell) .site-footer),
	:global(body:has(.home3-shell) .scroll-top) {
		display: none !important;
	}

	.home3-shell {
		--blue: #8A0000;
		--blue-dark: #000000;
		--red: #ed1b2f;
		--ink: #070b14;
		--muted: #5f6674;
		--line: #dfe4ec;
		--soft: #f6f8fb;
		min-height: 100vh;
		overflow: clip;
		background: #fff;
		font-family:
			Inter,
			ui-sans-serif,
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
	}

	.home3-shell :where(a, button) {
		font: inherit;
	}

	.home3-shell a {
		color: inherit;
		text-decoration: none;
	}

	.home3-shell :where(a, button):focus-visible {
		outline: 3px solid var(--blue);
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

	.home3-header {
		position: relative;
		z-index: 10;
		display: grid;
		grid-template-columns: minmax(244px, 1fr) auto minmax(244px, 1fr);
		align-items: center;
		gap: 24px;
		height: 58px;
		padding: 0 52px;
		border-bottom: 1px solid rgb(15 23 42 / 0.06);
		background: white;
		box-shadow: 0 1px 10px rgb(15 23 42 / 0.04);
	}

	.home3-logo {
		display: inline-flex;
		align-items: baseline;
		gap: 8px;
		width: fit-content;
		font-size: 31px;
		font-weight: 1000;
		line-height: 1;
		letter-spacing: -0.01em;
	}

	.home3-logo span {
		color: var(--blue);
		font: inherit !important;
		line-height: inherit !important;
	}

	.home3-logo strong {
		color: var(--red);
		font: inherit !important;
		line-height: inherit !important;
	}

	.home3-nav {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 38px;
		color: #070b14;
		font-size: 14px;
		font-weight: 720;
		white-space: nowrap;
	}

	.home3-actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 23px;
	}

	.home3-actions > a:not(.home3-sell-button) {
		display: grid;
		justify-items: center;
		gap: 2px;
		min-width: 44px;
		color: #07101f;
		font-size: 11px;
		font-weight: 760;
		line-height: 1;
	}

	.home3-actions :global(svg) {
		color: currentColor;
		stroke: currentColor;
	}

	.home3-sell-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 122px;
		height: 39px;
		border-radius: 5px;
		background: var(--red);
		color: white;
		font-size: 14px;
		font-weight: 900;
		box-shadow: 0 8px 16px rgb(237 27 47 / 0.17);
	}

	.home3-hero {
		position: relative;
		min-height: 320px;
		background:
			linear-gradient(180deg, rgb(255 255 255 / 0) 72%, white),
			linear-gradient(
				90deg,
				rgb(6 74 169 / 0.14) 0%,
				rgb(6 74 169 / 0.05) 18%,
				transparent 36%,
				transparent 66%,
				rgb(237 27 47 / 0.06) 100%
			),
			repeating-linear-gradient(90deg, #f7f9fc 0, #f7f9fc 1px, transparent 1px, transparent 42px),
			linear-gradient(180deg, #f8fafc 0%, #fff 100%);
		isolation: isolate;
	}

	.home3-hero::before {
		position: absolute;
		inset: 0;
		z-index: -1;
		background:
			linear-gradient(180deg, rgb(6 74 169 / 0.05), transparent 54%),
			linear-gradient(
				90deg,
				rgb(6 74 169 / 0.08),
				transparent 30%,
				transparent 70%,
				rgb(237 27 47 / 0.06)
			);
		content: '';
	}

	.home3-hero__car {
		position: absolute;
		z-index: 0;
		bottom: 70px;
		width: 38vw;
		min-width: 520px;
		max-width: 680px;
		height: auto;
		object-fit: contain;
		pointer-events: none;
		user-select: none;
	}

	.home3-hero__car--left {
		left: -92px;
		filter: saturate(1.18) brightness(0.94) contrast(1.08)
			drop-shadow(0 18px 24px rgb(15 23 42 / 0.18));
	}

	.home3-hero__car--right {
		right: -52px;
		bottom: 45px;
		filter: drop-shadow(0 18px 24px rgb(15 23 42 / 0.16));
	}

	.home3-hero__center {
		position: relative;
		z-index: 2;
		display: grid;
		justify-items: center;
		width: min(760px, calc(100% - 48px));
		margin: 0 auto;
		padding-top: 16px;
	}

	.home3-hero h1 {
		margin: 0;
		color: #060b15;
		text-align: center;
		font-size: clamp(42px, 3.25vw, 52px);
		font-weight: 1000;
		letter-spacing: -0.01em;
		line-height: 0.98;
	}

	.home3-hero h1 span {
		display: block;
		color: inherit !important;
		font: inherit !important;
		line-height: inherit !important;
	}

	.home3-hero__center > i {
		display: block;
		width: 56px;
		height: 3px;
		margin: 8px 0 13px;
		border-radius: 999px;
		background: var(--red);
	}

	.home3-search {
		width: min(710px, 100%);
		border-radius: 7px;
		background: #101820;
		color: white;
		box-shadow: 0 18px 38px rgb(2 6 23 / 0.17);
		overflow: hidden;
	}

	.home3-search__tabs {
		display: flex;
		justify-content: center;
		gap: 54px;
		height: 50px;
	}

	.home3-search__tabs button {
		position: relative;
		border: 0;
		background: transparent;
		color: white;
		font-size: 16px;
		font-weight: 900;
		cursor: pointer;
	}

	.home3-search__tabs button::after {
		position: absolute;
		left: 50%;
		bottom: 0;
		width: 0;
		height: 3px;
		background: var(--blue);
		content: '';
		transform: translateX(-50%);
		transition: width 160ms ease;
	}

	.home3-search__tabs .home3-search__tab--active::after {
		width: 90px;
	}

	.home3-search__input {
		display: flex;
		align-items: center;
		width: calc(100% - 36px);
		height: 44px;
		margin: 2px auto 13px;
		border-radius: 999px;
		background: white;
		overflow: hidden;
	}

	.home3-search__input input {
		width: 100%;
		min-width: 0;
		border: 0;
		outline: 0;
		padding: 0 18px;
		color: #111827;
		font-size: 16px;
		font-weight: 650;
	}

	.home3-search__input input::placeholder {
		color: #737b8b;
	}

	.home3-search__input button {
		display: grid;
		place-items: center;
		width: 42px;
		height: 42px;
		margin-right: 1px;
		border: 0;
		border-radius: 999px;
		background: var(--blue);
		color: white;
		cursor: pointer;
	}

	.home3-search p {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		margin: 0 0 12px;
		color: white !important;
		font-size: 14px;
		font-weight: 720;
	}

	.home3-search p a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 108px;
		height: 32px;
		border-radius: 4px;
		background: var(--blue);
		color: white;
		font-size: 14px;
		font-weight: 900;
	}

	.home3-market {
		padding: 0 52px 72px;
		background: #fff;
	}

	.home3-chips {
		position: relative;
		z-index: 3;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 11px;
		max-width: 1220px;
		margin: -31px auto 15px;
	}

	.home3-chips a {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		min-height: 42px;
		padding: 0 16px;
		border: 1px solid var(--line);
		border-radius: 7px;
		background: #f8fafc;
		color: #07101f;
		box-shadow: 0 9px 17px rgb(15 23 42 / 0.07);
		font-size: 14px;
		font-weight: 780;
	}

	.home3-chips :global(svg) {
		color: var(--blue);
		stroke: currentColor;
	}

	.home3-sell-panel,
	.home3-budget,
	.home3-premium,
	.home3-news {
		max-width: 1430px;
		margin-inline: auto;
	}

	.home3-sell-panel {
		display: grid;
		grid-template-columns: minmax(470px, 1.1fr) minmax(330px, 0.68fr) minmax(310px, 0.72fr);
		min-height: 160px;
		border: 1px solid var(--line);
		border-radius: 7px;
		background: white;
		overflow: hidden;
	}

	.home3-sell-panel__copy {
		padding: 21px 32px 19px;
		background: linear-gradient(135deg, #064eb3 0%, #003f98 100%);
		color: white;
	}

	.home3-sell-panel h2,
	.home3-budget h2,
	.home3-section-head h2 {
		margin: 0;
		color: inherit;
		font-size: 22px;
		font-weight: 1000;
		letter-spacing: -0.01em;
		line-height: 1.05;
	}

	.home3-sell-panel p {
		max-width: 560px;
		margin: 9px 0 0;
		color: white !important;
		font-size: 14px;
		font-weight: 650;
		line-height: 1.38;
	}

	.home3-sell-panel__copy a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 187px;
		height: 38px;
		margin-top: 12px;
		border-radius: 4px;
		background: var(--red);
		color: white;
		font-size: 14px;
		font-weight: 900;
		box-shadow: 0 8px 18px rgb(237 27 47 / 0.24);
	}

	.home3-sell-panel__media {
		position: relative;
		display: grid;
		place-items: end center;
		background:
			linear-gradient(90deg, rgb(6 78 179 / 0.12), transparent 22%),
			linear-gradient(180deg, #f6f9fd, #edf3f9);
		overflow: hidden;
	}

	.home3-sell-panel__media img {
		width: 370px;
		max-width: 114%;
		margin: 0 0 -4px;
		filter: hue-rotate(340deg) saturate(1.85) brightness(0.94) contrast(1.08)
			drop-shadow(0 10px 12px rgb(15 23 42 / 0.16));
	}

	.home3-sell-panel__points {
		display: grid;
		align-content: center;
		gap: 15px;
		margin: 0;
		padding: 18px 29px;
		list-style: none;
	}

	.home3-sell-panel__points li {
		display: grid;
		grid-template-columns: 31px 1fr;
		align-items: center;
		gap: 12px;
		color: #070b14;
		font-size: 14px;
		font-weight: 730;
		line-height: 1.18;
	}

	.home3-sell-panel__points :global(svg) {
		color: var(--blue);
		stroke: currentColor;
	}

	.home3-budget {
		margin-top: 15px;
	}

	.home3-budget h2 {
		color: #070b14;
	}

	.home3-budget__grid {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 14px;
		margin-top: 10px;
	}

	.home3-budget-card {
		position: relative;
		display: grid;
		grid-template-rows: auto 1fr;
		min-height: 146px;
		padding: 15px 14px 8px;
		border: 1px solid var(--line);
		border-radius: 7px;
		background: linear-gradient(180deg, white 0%, #f7f9fc 100%);
		box-shadow: 0 8px 18px rgb(15 23 42 / 0.045);
		overflow: hidden;
	}

	.home3-budget-card::before {
		position: absolute;
		right: 8px;
		bottom: 3px;
		width: 84%;
		height: 76px;
		border-radius: 999px;
		background: radial-gradient(ellipse at center, rgb(6 74 169 / 0.12), transparent 68%);
		content: '';
	}

	.home3-budget-card--red {
		background: linear-gradient(180deg, #fff 0%, #fde9ec 100%);
	}

	.home3-budget-card--red::before {
		background: radial-gradient(ellipse at center, rgb(237 27 47 / 0.18), transparent 68%);
	}

	.home3-budget-card span {
		position: relative;
		z-index: 2;
		display: grid;
		gap: 1px;
	}

	.home3-budget-card strong {
		font-size: 18px;
		font-weight: 950;
		line-height: 1.05;
	}

	.home3-budget-card small {
		color: var(--muted);
		font-size: 11px;
		font-weight: 700;
	}

	.home3-budget-card img {
		position: relative;
		z-index: 1;
		align-self: end;
		width: 120%;
		max-width: none;
		height: 84px;
		margin: 0 0 0 -10%;
		object-fit: contain;
		object-position: center bottom;
		filter: drop-shadow(0 8px 7px rgb(15 23 42 / 0.13));
	}

	.home3-budget-card--blue img {
		filter: sepia(0.38) saturate(3.4) hue-rotate(165deg) brightness(0.84)
			drop-shadow(0 8px 7px rgb(15 23 42 / 0.13));
	}

	.home3-budget-card--dark img {
		filter: brightness(0.45) contrast(1.35) drop-shadow(0 8px 7px rgb(15 23 42 / 0.13));
	}

	.home3-premium {
		margin-top: 15px;
	}

	.home3-section-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 18px;
	}

	.home3-section-head > div {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		color: #070b14;
	}

	.home3-section-head :global(svg) {
		color: var(--red);
		fill: var(--red);
		stroke: var(--red);
	}

	.home3-section-head a {
		color: var(--blue);
		font-size: 14px;
		font-weight: 800;
	}

	.home3-premium__grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
		margin-top: 12px;
	}

	.home3-premium-card {
		position: relative;
		display: block;
		min-height: 188px;
		padding: 17px 16px 16px 18px;
		border: 1px solid var(--line);
		border-radius: 7px;
		background: linear-gradient(180deg, #fff 0%, #fbfdff 100%);
		box-shadow: 0 10px 22px rgb(15 23 42 / 0.045);
		overflow: hidden;
	}

	.home3-premium-card::before {
		position: absolute;
		right: 48px;
		bottom: 20px;
		width: 57%;
		height: 118px;
		border-radius: 999px;
		background:
			radial-gradient(ellipse at center, rgb(6 74 169 / 0.13), transparent 66%),
			linear-gradient(180deg, rgb(246 248 252 / 0), #eef3f8);
		content: '';
	}

	.home3-premium-card__copy {
		position: relative;
		z-index: 1;
		width: min(178px, calc(100% - 246px));
		min-width: 0;
	}

	.home3-premium-card h3 {
		margin: 0;
		color: #070b14;
		font-size: 20px;
		font-weight: 1000;
		line-height: 1.04;
	}

	.home3-premium-card p {
		max-width: 100%;
		margin: 8px 0 8px;
		overflow: hidden;
		color: #151b28;
		font-size: 13px;
		font-weight: 730;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.home3-premium-card__copy span {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		min-height: 20px;
		padding: 0 7px;
		border-radius: 3px;
		background: var(--blue);
		color: white;
		font-size: 11px;
		font-weight: 900;
		line-height: 1;
	}

	.home3-premium-card img {
		position: absolute;
		z-index: 1;
		right: 50px;
		bottom: 56px;
		width: min(47%, 220px);
		max-width: none;
		height: 116px;
		margin: 0;
		object-fit: contain;
		object-position: center bottom;
		filter: drop-shadow(0 11px 10px rgb(15 23 42 / 0.18));
	}

	.home3-premium-card__image--blue {
		filter: hue-rotate(185deg) saturate(1.7) brightness(0.72)
			drop-shadow(0 11px 10px rgb(15 23 42 / 0.18)) !important;
	}

	.home3-premium-card__price {
		display: grid;
		position: absolute;
		z-index: 2;
		right: 58px;
		bottom: 17px;
		justify-items: end;
		grid-template-columns: auto auto;
		gap: 2px 7px;
		width: auto;
		color: #070b14;
		text-align: right;
	}

	.home3-premium-card__price small {
		color: var(--muted);
		font-size: 10px;
		font-weight: 730;
		line-height: 1.15;
		justify-self: end;
	}

	.home3-premium-card__price strong,
	.home3-premium-card__price b {
		color: #070b14;
		font-size: 16px;
		font-weight: 1000;
		line-height: 1.1;
		white-space: nowrap;
	}

	.home3-premium-card > a {
		display: grid;
		position: absolute;
		z-index: 2;
		right: 16px;
		bottom: 19px;
		width: 32px;
		height: 32px;
		border-radius: 999px;
		background: white;
		place-items: center;
		color: #070b14;
		box-shadow: inset 0 0 0 1px var(--line);
	}

	.home3-news {
		margin-top: 15px;
	}

	.home3-news__grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 14px;
		margin-top: 10px;
	}

	.home3-news-card {
		position: relative;
		min-height: 154px;
		border-radius: 7px;
		background: #111827;
		overflow: hidden;
	}

	.home3-news-card::after {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, transparent 38%, rgb(0 0 0 / 0.72));
		content: '';
	}

	.home3-news-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 180ms ease;
	}

	.home3-news-card strong {
		position: absolute;
		z-index: 2;
		left: 16px;
		right: 16px;
		bottom: 15px;
		color: white;
		font-size: 16px;
		font-weight: 1000;
		line-height: 1.05;
	}

	.home3-explore {
		margin-top: 22px;
		padding: 26px 0 42px;
		border-top: 1px solid #edf1f6;
	}

	.home3-browse-block {
		margin-top: 22px;
	}

	.home3-browse-block h3 {
		margin: 0 0 12px;
		color: #070b14;
		font-size: 23px;
		font-weight: 1000;
		line-height: 1.05;
	}

	.home3-brand-grid {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 14px;
	}

	.home3-brand-card {
		display: grid;
		align-items: center;
		grid-template-columns: 58px minmax(0, 1fr) auto;
		gap: 13px;
		min-height: 104px;
		padding: 16px;
		border: 1px solid var(--line);
		border-radius: 7px;
		background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);
		box-shadow: 0 8px 18px rgb(15 23 42 / 0.045);
	}

	.home3-brand-card__mark {
		display: grid;
		place-items: center;
		width: 58px;
		height: 58px;
		border-radius: 7px;
		background: white;
		color: var(--blue);
		font-size: 26px;
		font-weight: 1000;
		box-shadow: inset 0 0 0 1px #e3e9f1;
	}

	.home3-brand-card__mark img {
		width: 37px;
		height: 37px;
		object-fit: contain;
		filter: grayscale(1) contrast(1.12);
	}

	.home3-brand-card__copy {
		display: grid;
		gap: 4px;
		min-width: 0;
	}

	.home3-brand-card__copy strong,
	.home3-type-card strong {
		overflow: hidden;
		color: #070b14;
		font-size: 18px;
		font-weight: 950;
		line-height: 1.1;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.home3-brand-card__copy small,
	.home3-type-card small {
		color: var(--muted);
		font-size: 12px;
		font-weight: 780;
	}

	.home3-brand-card :global(svg) {
		color: var(--red);
		stroke: currentColor;
	}

	.home3-type-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
	}

	.home3-type-card {
		position: relative;
		display: grid;
		grid-template-rows: 1fr auto;
		min-height: 230px;
		padding: 18px;
		border: 1px solid var(--line);
		border-radius: 7px;
		background: linear-gradient(180deg, #f7f9fc 0%, white 100%);
		overflow: hidden;
		box-shadow: 0 9px 20px rgb(15 23 42 / 0.045);
	}

	.home3-type-card::before {
		position: absolute;
		inset: 36px 22px 58px;
		border-radius: 999px;
		background: radial-gradient(ellipse at center, rgb(6 74 169 / 0.13), transparent 68%);
		content: '';
	}

	.home3-type-card img {
		position: relative;
		z-index: 1;
		align-self: end;
		justify-self: center;
		width: 118%;
		max-width: none;
		height: 145px;
		object-fit: contain;
		object-position: center bottom;
		filter: drop-shadow(0 12px 10px rgb(15 23 42 / 0.14));
	}

	.home3-type-card span {
		position: relative;
		z-index: 1;
		display: grid;
		gap: 4px;
		padding-top: 10px;
		border-top: 1px solid #e8edf4;
	}

	@media (hover: hover) {
		.home3-sell-button,
		.home3-search p a,
		.home3-sell-panel__copy a,
		.home3-chips a,
		.home3-budget-card,
		.home3-premium-card,
		.home3-news-card,
		.home3-brand-card,
		.home3-type-card {
			transition:
				transform 160ms ease,
				box-shadow 160ms ease;
		}

		.home3-sell-button:hover,
		.home3-search p a:hover,
		.home3-sell-panel__copy a:hover,
		.home3-chips a:hover,
		.home3-budget-card:hover,
		.home3-premium-card:hover,
		.home3-news-card:hover,
		.home3-brand-card:hover,
		.home3-type-card:hover {
			transform: translateY(-2px);
		}

		.home3-news-card:hover img {
			transform: scale(1.035);
		}
	}

	@media (max-width: 1320px) {
		.home3-header {
			padding-inline: 30px;
			grid-template-columns: minmax(204px, 1fr) auto minmax(204px, 1fr);
		}

		.home3-nav {
			gap: 24px;
		}

		.home3-actions {
			gap: 14px;
		}

		.home3-market {
			padding-inline: 24px;
		}

		.home3-hero__car {
			width: 36vw;
			min-width: 430px;
			max-width: 560px;
		}

		.home3-sell-panel {
			grid-template-columns: 1.04fr 0.74fr 0.76fr;
		}

		.home3-premium-card {
			min-height: 182px;
			padding: 16px;
		}

		.home3-premium-card__copy {
			width: min(160px, calc(100% - 220px));
		}

		.home3-premium-card img {
			right: 48px;
			bottom: 56px;
			width: min(43%, 168px);
			height: 104px;
		}

		.home3-premium-card h3 {
			font-size: 18px;
		}

		.home3-premium-card__price strong,
		.home3-premium-card__price b {
			font-size: 14px;
		}

		.home3-premium-card__price {
			right: 58px;
		}
	}

	@media (max-width: 1080px) {
		.home3-header {
			grid-template-columns: 1fr auto;
			height: auto;
			min-height: 62px;
			padding-block: 10px;
		}

		.home3-nav {
			grid-column: 1 / -1;
			grid-row: 2;
			flex-wrap: wrap;
			gap: 12px 18px;
		}

		.home3-sell-panel {
			grid-template-columns: 1fr;
		}

		.home3-sell-panel__media {
			min-height: 154px;
		}

		.home3-budget__grid,
		.home3-premium__grid,
		.home3-news__grid,
		.home3-type-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.home3-brand-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (max-width: 760px) {
		.home3-header {
			padding-inline: 18px;
		}

		.home3-logo {
			font-size: 24px;
		}

		.home3-actions > a:not(.home3-sell-button),
		.home3-nav {
			display: none;
		}

		.home3-hero {
			min-height: 490px;
		}

		.home3-hero__center {
			width: calc(100% - 28px);
			padding-top: 30px;
		}

		.home3-hero h1 {
			font-size: 39px;
		}

		.home3-hero__car {
			opacity: 0.38;
		}

		.home3-hero__car--left {
			left: -180px;
		}

		.home3-hero__car--right {
			right: -180px;
		}

		.home3-search__tabs {
			gap: 14px;
		}

		.home3-search__tabs button {
			font-size: 14px;
		}

		.home3-market {
			padding-inline: 16px;
		}

		.home3-chips {
			justify-content: flex-start;
			overflow-x: auto;
			flex-wrap: nowrap;
			padding-bottom: 5px;
		}

		.home3-chips a {
			white-space: nowrap;
		}

		.home3-budget__grid,
		.home3-premium__grid,
		.home3-news__grid,
		.home3-brand-grid,
		.home3-type-grid {
			grid-template-columns: 1fr;
		}

		.home3-premium-card {
			min-height: auto;
			padding: 14px;
		}

		.home3-premium-card__copy {
			width: auto;
		}

		.home3-premium-card__price {
			position: relative;
			right: auto;
			bottom: auto;
			justify-items: start;
			width: auto;
			text-align: left;
		}

		.home3-premium-card > a {
			position: absolute;
			right: 14px;
			bottom: 14px;
		}

		.home3-premium-card img {
			position: relative;
			right: auto;
			bottom: auto;
			display: block;
			width: 100%;
			height: 94px;
			margin: 12px 0 8px;
		}

		.home3-explore {
			padding-bottom: 28px;
		}

		.home3-brand-card {
			min-height: 92px;
		}

		.home3-type-card {
			min-height: 202px;
		}
	}
</style>
