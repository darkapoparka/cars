<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		ArrowRight,
		BadgeCheck,
		Calculator,
		Car,
		Database,
		FileSearch,
		GitCompare,
		Globe2,
		Heart,
		LayoutDashboard,
		ListChecks,
		MessagesSquare,
		PanelTop,
		Search,
		ShieldCheck,
		Smartphone,
		Workflow,
		Wrench
	} from '@lucide/svelte';

	const heroImage = '/assets/daynight/offer/offer-poster-background.webp';
	const logo = '/brand/daynight-wordmark.svg';

	const stats = [
		{ value: '42', label: 'реални автомобила в каталога' },
		{ value: '18+', label: 'готови потребителски страници' },
		{ value: 'BG / EN', label: 'структура за двуезично съдържание' },
		{ value: 'Admin', label: 'управление на обяви и заявки' }
	];

	const proofCards = [
		{
			image: '/assets/daynight/hero/home-hero-available-inventory-wow.webp',
			label: 'Начална страница',
			title: 'Homepage с реални входове към покупка, продажба и внос'
		},
		{
			image: '/assets/daynight/hero/home-05-inspection-studio.webp',
			label: 'Детайли и доверие',
			title: 'Страници за автомобили с галерия, спецификации и клиентски действия'
		},
		{
			image: '/assets/daynight/services/premium-cars-service.webp',
			label: 'Услуги',
			title: 'Подбрани автомобили, оценка, контактни форми и съдържание'
		}
	];

	const deliveredFeatures = [
		{
			icon: Car,
			title: 'Каталог с реални автомобили',
			text: 'Обявите са структурирани с цена, пробег, година, гориво, скоростна кутия, снимки, статус и детайли.'
		},
		{
			icon: Search,
			title: 'Търсене и филтри',
			text: 'Марка, тип купе, бюджет, година, пробег, гориво, скорости, ключова дума и различни изгледи на каталога.'
		},
		{
			icon: FileSearch,
			title: 'Детайлни страници',
			text: 'Всяка кола има собствен URL, SEO заглавие, галерия, спецификации и ясни действия за контакт.'
		},
		{
			icon: GitCompare,
			title: 'Сравнение',
			text: 'Клиентът може да избере автомобили и да ги сравни по ключови параметри.'
		},
		{
			icon: Heart,
			title: 'Любими',
			text: 'Запазване на интересни автомобили за по-късно разглеждане и връщане към тях.'
		},
		{
			icon: Calculator,
			title: 'Калкулатор за внос',
			text: 'Отделна страница за ориентация при внос, такси, транспорт и бюджет.'
		},
		{
			icon: LayoutDashboard,
			title: 'Админ зона',
			text: 'Страници за обяви, потребители, съобщения, запитвания и редакция на автомобил.'
		},
		{
			icon: Globe2,
			title: 'Съдържание и SEO',
			text: 'Блог, услуги, екип, ревюта, ЧЗВ, sitemap.xml и route структура за търсачки.'
		}
	];

	const stack = [
		{ label: 'Frontend', value: 'SvelteKit, Svelte 5, TypeScript, Vite' },
		{ label: 'UI база', value: 'Auxero template fidelity + Day Night Auto визуална адаптация' },
		{ label: 'Данни', value: 'структуриран автомобилен feed, server adapters, route state' },
		{ label: 'Качество', value: 'Vitest, Playwright, svelte-check, ESLint, Prettier' },
		{ label: 'Готовност', value: 'responsive pages, admin flows, SEO routes, reusable components' }
	];

	const roadmap = [
		{
			icon: BadgeCheck,
			kicker: 'Готово сега',
			title: 'Публичен сайт и каталог',
			text: 'Работеща потребителска част, реални обяви, детайлни страници, сравнение, любими, услуги и контакт.'
		},
		{
			icon: LayoutDashboard,
			kicker: 'Готово сега',
			title: 'Админ прототип',
			text: 'Управление на автомобили, потребители, съобщения и запитвания, за да не зависи съдържанието от разработчик.'
		},
		{
			icon: Database,
			kicker: 'Следва',
			title: 'Production backend',
			text: 'Истинска база данни, вход за екипа, роли, имейл известия, запазване на заявки и стабилна среда за качване.'
		},
		{
			icon: Smartphone,
			kicker: 'Развитие',
			title: 'Автоматизации и приложение',
			text: 'VIN проверка, постване към социални канали, известия, лизингов калкулатор или мобилно приложение.'
		}
	];
</script>

<svelte:head>
	<title>Оферта за Day Night Auto</title>
	<meta
		name="description"
		content="Клиентска оферта за новия Day Night Auto сайт: реален каталог, админ панел, услуги, SEO, технологии и следващи стъпки."
	/>
	<link rel="preload" as="image" href={heroImage} />
</svelte:head>

<main class="offer-page" data-daynight-offer>
	<header class="offer-header" aria-label="Day Night Auto offer header">
		<a class="offer-header__logo" href={resolve('/')} aria-label="Day Night Auto home">
			<img src={logo} alt="Day Night Auto" />
		</a>
		<div class="offer-header__meta">
			<span>Оферта</span>
			<a href={resolve('/')} aria-label="Отвори Day Night Auto сайта">Към сайта</a>
		</div>
	</header>

	<section class="offer-hero">
		<div class="offer-wrap offer-hero__grid">
			<div class="offer-hero__copy">
				<p class="offer-eyebrow">Предложение за Day Night Auto</p>
				<h1>Новият сайт не е идея. Той вече работи.</h1>
				<p class="offer-hero__lead">
					Изградих реална версия на Day Night Auto върху Auxero визуалната база: каталог с истински
					автомобили, страници за услуги, админ зона, сравнение, любими, блог, SEO и ясна пътна
					карта към production.
				</p>
				<div class="offer-hero__actions">
					<a class="offer-action offer-action--primary" href={resolve('/')}>
						Разгледай сайта <ArrowRight size={18} strokeWidth={2.4} />
					</a>
					<a class="offer-action offer-action--secondary" href={resolve('/admin/inventory')}>
						Виж админ частта
					</a>
				</div>
			</div>

			<figure class="offer-hero__visual">
				<img src={heroImage} alt="Premium showroom workspace with a digital website proposal" />
				<figcaption>
					<span>Built as a real product surface</span>
					<strong>SvelteKit + Auxero + Day Night Auto data</strong>
				</figcaption>
			</figure>
		</div>
	</section>

	<section class="offer-stats" aria-label="Project summary stats">
		<div class="offer-wrap offer-stats__grid">
			{#each stats as stat (stat.label)}
				<div class="offer-stat">
					<strong>{stat.value}</strong>
					<span>{stat.label}</span>
				</div>
			{/each}
		</div>
	</section>

	<section class="offer-section offer-section--proof">
		<div class="offer-wrap">
			<div class="offer-section__head">
				<p class="offer-eyebrow">Визуално доказателство</p>
				<h2>Не е generic landing page. Това е Day Night Auto продукт.</h2>
				<p>
					Страниците използват реалните теми, снимки, сценарии и действия, които клиент на автокъща
					очаква да види.
				</p>
			</div>

			<div class="offer-proof-grid">
				{#each proofCards as card (card.title)}
					<article class="offer-proof-card">
						<img src={card.image} alt="" loading="lazy" />
						<div>
							<span>{card.label}</span>
							<h3>{card.title}</h3>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="offer-section">
		<div class="offer-wrap offer-two-column">
			<div class="offer-section__head offer-section__head--sticky">
				<p class="offer-eyebrow">Какво е изградено</p>
				<h2>Готови функции, които могат да се покажат веднага.</h2>
				<p>
					Фокусът е практичен: клиентът намира автомобил, разбира услугата, праща запитване,
					сравнява, запазва и Day Night Auto може да управлява съдържанието.
				</p>
			</div>

			<div class="offer-feature-grid">
				{#each deliveredFeatures as feature (feature.title)}
					<article class="offer-feature-card">
						<span><feature.icon size={22} strokeWidth={2.35} /></span>
						<h3>{feature.title}</h3>
						<p>{feature.text}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="offer-section offer-section--stack">
		<div class="offer-wrap offer-stack">
			<div>
				<p class="offer-eyebrow">Техническа основа</p>
				<h2>Модерен Svelte проект, не статична картинка.</h2>
			</div>
			<div class="offer-stack__list">
				{#each stack as item (item.label)}
					<div class="offer-stack__item">
						<span>{item.label}</span>
						<strong>{item.value}</strong>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="offer-section">
		<div class="offer-wrap">
			<div class="offer-section__head">
				<p class="offer-eyebrow">Project map</p>
				<h2>От showcase към production.</h2>
				<p>
					Първата версия вече показва продукта. Следващата стъпка е да се върже към реална
					инфраструктура и процесите на екипа.
				</p>
			</div>

			<div class="offer-roadmap">
				{#each roadmap as item (item.title)}
					<article class="offer-roadmap__item">
						<span class="offer-roadmap__icon"><item.icon size={22} strokeWidth={2.35} /></span>
						<div>
							<p>{item.kicker}</p>
							<h3>{item.title}</h3>
							<span>{item.text}</span>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="offer-section offer-section--closing">
		<div class="offer-wrap offer-closing">
			<div>
				<p class="offer-eyebrow">Финал</p>
				<h2>Ако Day Night Auto иска, това може да стане официалният сайт.</h2>
			</div>
			<div class="offer-closing__panel">
				<div class="offer-closing__icons" aria-hidden="true">
					<PanelTop size={22} strokeWidth={2.35} />
					<Workflow size={22} strokeWidth={2.35} />
					<ListChecks size={22} strokeWidth={2.35} />
					<ShieldCheck size={22} strokeWidth={2.35} />
					<MessagesSquare size={22} strokeWidth={2.35} />
					<Wrench size={22} strokeWidth={2.35} />
				</div>
				<p>
					Най-важното вече е доказано: визуална посока, структура, съдържание, потребителски потоци
					и админ логика. Оттук нататък говорим за финализиране, реална база данни, домейн, роли,
					имейли и последни business правила.
				</p>
				<a class="offer-action offer-action--primary" href={resolve('/contact')}>
					Да се чуем <ArrowRight size={18} strokeWidth={2.4} />
				</a>
			</div>
		</div>
	</section>
</main>

<style>
	.offer-page {
		--offer-bg: var(--bc-showcase-bg);
		--offer-panel: var(--bc-white);
		--offer-ink: var(--bc-showcase-ink);
		--offer-muted: var(--bc-showcase-muted);
		--offer-line: var(--bc-showcase-line);
		--offer-lime: var(--bc-accent-bright);
		--offer-lime-dark: var(--bc-accent-olive);
		--offer-dark: var(--bc-showcase-dark);
		--offer-dark-soft: var(--bc-showcase-dark-soft);
		--offer-dark-panel: var(--bc-showcase-dark-panel);
		--offer-icon-bg: var(--bc-showcase-icon-bg);
		--offer-card-hover: var(--bc-showcase-card-hover);

		min-height: 100vh;
		background: var(--offer-bg);
		color: var(--offer-ink);
		font-family: var(--bc-font-dashboard);
		overflow: hidden;
	}

	.offer-page,
	.offer-page * {
		box-sizing: border-box;
	}

	.offer-page :is(h1, h2, h3) {
		font-family: var(--bc-font-dashboard) !important;
	}

	.offer-page a {
		color: inherit;
		text-decoration: none;
	}

	.offer-page img {
		display: block;
		max-width: 100%;
	}

	.offer-wrap {
		width: min(calc(100% - 40px), 1180px);
		margin-inline: auto;
	}

	.offer-header {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		z-index: 5;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 18px;
		width: min(calc(100% - 40px), 1180px);
		min-height: 88px;
		margin-inline: auto;
		color: var(--bc-white);
	}

	.offer-header__logo {
		display: flex;
		width: 190px;
		min-height: 44px;
		align-items: center;
	}

	.offer-header__logo img {
		width: 100%;
		height: auto;
	}

	.offer-header__meta {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 13px;
		font-weight: 800;
		text-transform: uppercase;
	}

	.offer-header__meta span,
	.offer-header__meta a {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.12);
		padding: 10px 13px;
		backdrop-filter: blur(12px);
	}

	.offer-header__meta a:hover,
	.offer-header__meta a:focus-visible {
		background: var(--bc-white);
		color: var(--offer-ink);
	}

	.offer-hero {
		position: relative;
		background: var(--offer-dark);
		color: var(--bc-white);
		padding: 128px 0 78px;
	}

	.offer-hero::before {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(
				90deg,
				rgba(17, 20, 15, 0.96),
				rgba(17, 20, 15, 0.78) 42%,
				rgba(17, 20, 15, 0.34)
			),
			url('/assets/daynight/offer/offer-poster-background.webp') center / cover;
		content: '';
	}

	.offer-hero__grid {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(420px, 1.1fr);
		gap: 34px;
		align-items: end;
	}

	.offer-hero__copy {
		padding: 52px 0 18px;
	}

	.offer-eyebrow {
		margin: 0 0 12px;
		color: var(--offer-lime);
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0;
		text-transform: uppercase;
	}

	.offer-hero h1,
	.offer-section h2,
	.offer-closing h2 {
		margin: 0;
		letter-spacing: 0;
	}

	.offer-hero h1 {
		max-width: 660px;
		font-size: clamp(46px, 7vw, 82px);
		font-weight: 800;
		line-height: 0.98;
	}

	.offer-hero__lead {
		max-width: 620px;
		margin: 24px 0 0;
		color: rgba(255, 255, 255, 0.78);
		font-size: clamp(17px, 2vw, 20px);
		line-height: 1.55;
	}

	.offer-hero__actions,
	.offer-closing__panel {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	.offer-hero__actions {
		margin-top: 34px;
	}

	.offer-action {
		display: inline-flex;
		min-height: 50px;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border-radius: 8px;
		padding: 0 20px;
		font-size: 15px;
		font-weight: 800;
		line-height: 20px;
	}

	.offer-action--primary {
		background: var(--offer-lime);
		color: var(--offer-ink);
	}

	.offer-action--primary:hover,
	.offer-action--primary:focus-visible {
		background: var(--bc-white);
		color: var(--offer-ink);
	}

	.offer-action--secondary {
		background: rgba(255, 255, 255, 0.12);
		color: var(--bc-white);
	}

	.offer-action--secondary:hover,
	.offer-action--secondary:focus-visible {
		background: var(--bc-white);
		color: var(--offer-ink);
	}

	.offer-hero__visual {
		overflow: hidden;
		margin: 0;
		border: 1px solid rgba(255, 255, 255, 0.16);
		border-radius: 8px;
		background: var(--offer-dark-soft);
	}

	.offer-hero__visual img {
		aspect-ratio: 16 / 10;
		width: 100%;
		object-fit: cover;
	}

	.offer-hero__visual figcaption {
		display: grid;
		gap: 3px;
		padding: 18px 20px;
		background: rgba(255, 255, 255, 0.08);
	}

	.offer-hero__visual span {
		color: rgba(255, 255, 255, 0.62);
		font-size: 12px;
		font-weight: 800;
		text-transform: uppercase;
	}

	.offer-hero__visual strong {
		color: var(--bc-white);
		font-size: 17px;
		line-height: 23px;
	}

	.offer-stats {
		background: var(--offer-lime);
	}

	.offer-stats__grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1px;
		background: rgba(23, 25, 21, 0.16);
	}

	.offer-stat {
		min-height: 132px;
		background: var(--offer-lime);
		padding: 28px 24px;
	}

	.offer-stat strong {
		display: block;
		margin-bottom: 9px;
		color: var(--offer-ink);
		font-size: clamp(34px, 4vw, 48px);
		font-weight: 800;
		line-height: 1;
	}

	.offer-stat span {
		display: block;
		max-width: 190px;
		color: rgba(23, 25, 21, 0.68);
		font-size: 14px;
		font-weight: 800;
		line-height: 20px;
	}

	.offer-section {
		padding: clamp(66px, 8vw, 108px) 0;
	}

	.offer-section--proof,
	.offer-section--closing {
		background: var(--bc-white);
	}

	.offer-section--stack {
		background: var(--offer-dark);
		color: var(--bc-white);
	}

	.offer-section__head {
		max-width: 680px;
		margin-bottom: 36px;
	}

	.offer-section__head--sticky {
		position: sticky;
		top: 24px;
		align-self: start;
		margin-bottom: 0;
	}

	.offer-section h2,
	.offer-closing h2 {
		font-size: clamp(34px, 5vw, 56px);
		font-weight: 800;
		line-height: 1.04;
	}

	.offer-section__head p:not(.offer-eyebrow),
	.offer-closing__panel p {
		margin: 18px 0 0;
		color: var(--offer-muted);
		font-size: 17px;
		line-height: 1.58;
	}

	.offer-proof-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
	}

	.offer-proof-card,
	.offer-feature-card,
	.offer-roadmap__item,
	.offer-closing__panel {
		border: 1px solid var(--offer-line);
		border-radius: 8px;
		background: var(--offer-panel);
	}

	.offer-proof-card {
		overflow: hidden;
	}

	.offer-proof-card img {
		aspect-ratio: 4 / 3;
		width: 100%;
		object-fit: cover;
	}

	.offer-proof-card div {
		padding: 19px 20px 22px;
	}

	.offer-proof-card span,
	.offer-roadmap__item p,
	.offer-stack__item span {
		display: block;
		margin: 0 0 8px;
		color: var(--offer-lime-dark);
		font-size: 12px;
		font-weight: 800;
		text-transform: uppercase;
	}

	.offer-proof-card h3,
	.offer-feature-card h3,
	.offer-roadmap__item h3 {
		margin: 0;
		color: var(--offer-ink);
		font-size: 20px;
		font-weight: 800;
		line-height: 1.22;
	}

	.offer-two-column {
		display: grid;
		grid-template-columns: minmax(260px, 0.72fr) minmax(0, 1.28fr);
		gap: 34px;
		align-items: start;
	}

	.offer-feature-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px;
	}

	.offer-feature-card {
		padding: 24px;
	}

	.offer-feature-card span {
		display: inline-flex;
		width: 46px;
		height: 46px;
		align-items: center;
		justify-content: center;
		margin-bottom: 18px;
		border-radius: 8px;
		background: var(--offer-icon-bg);
		color: var(--offer-lime-dark);
	}

	.offer-feature-card p {
		margin: 11px 0 0;
		color: var(--offer-muted);
		font-size: 15px;
		line-height: 1.55;
	}

	.offer-feature-card:hover,
	.offer-feature-card:focus-within,
	.offer-roadmap__item:hover,
	.offer-proof-card:hover {
		background: var(--offer-card-hover);
	}

	.offer-stack {
		display: grid;
		grid-template-columns: minmax(260px, 0.74fr) minmax(0, 1.26fr);
		gap: 42px;
		align-items: start;
	}

	.offer-stack .offer-eyebrow {
		color: var(--offer-lime);
	}

	.offer-stack__list {
		display: grid;
		gap: 1px;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.12);
	}

	.offer-stack__item {
		display: grid;
		grid-template-columns: 150px minmax(0, 1fr);
		gap: 18px;
		padding: 22px;
		background: var(--offer-dark-panel);
	}

	.offer-stack__item span {
		margin: 0;
		color: rgba(227, 6, 47, 0.86);
	}

	.offer-stack__item strong {
		color: rgba(255, 255, 255, 0.84);
		font-size: 17px;
		font-weight: 750;
		line-height: 1.45;
	}

	.offer-roadmap {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 14px;
	}

	.offer-roadmap__item {
		display: flex;
		gap: 16px;
		padding: 24px 22px;
	}

	.offer-roadmap__icon {
		display: flex;
		flex: 0 0 auto;
		width: 44px;
		height: 44px;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		background: var(--offer-lime);
		color: var(--offer-ink);
	}

	.offer-roadmap__item span:not(.offer-roadmap__icon) {
		display: block;
		margin-top: 10px;
		color: var(--offer-muted);
		font-size: 15px;
		line-height: 1.54;
	}

	.offer-closing {
		display: grid;
		grid-template-columns: minmax(260px, 0.8fr) minmax(0, 1.2fr);
		gap: 42px;
		align-items: start;
	}

	.offer-closing__panel {
		padding: 28px;
	}

	.offer-closing__panel p {
		width: 100%;
		margin-top: 22px;
	}

	.offer-closing__icons {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.offer-closing__icons :global(svg) {
		box-sizing: content-box;
		border-radius: 8px;
		background: var(--offer-icon-bg);
		padding: 11px;
		color: var(--offer-lime-dark);
	}

	.offer-closing__panel .offer-action {
		margin-top: 10px;
	}

	:global(body) {
		margin: 0;
		min-width: 320px;
		background: var(--bc-showcase-bg);
		color: var(--bc-showcase-ink);
	}

	:global(.mobile-bottom-nav),
	:global(.mobile-menu-sheet),
	:global(.mobile-menu-toggle) {
		display: none !important;
	}

	@media (max-width: 767.98px) {
		:global(body) {
			padding-bottom: 0 !important;
		}
	}

	@media (max-width: 1180px) {
		.offer-hero__grid,
		.offer-two-column,
		.offer-stack,
		.offer-closing {
			grid-template-columns: 1fr;
		}

		.offer-section__head--sticky {
			position: static;
			margin-bottom: 32px;
		}

		.offer-roadmap {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 860px) {
		.offer-header {
			min-height: 76px;
		}

		.offer-header__logo {
			width: 158px;
		}

		.offer-header__meta span {
			display: none;
		}

		.offer-hero {
			padding-top: 108px;
		}

		.offer-hero::before {
			background:
				linear-gradient(
					180deg,
					rgba(17, 20, 15, 0.96),
					rgba(17, 20, 15, 0.86) 46%,
					rgba(17, 20, 15, 0.56)
				),
				url('/assets/daynight/offer/offer-poster-background.webp') center / cover;
		}

		.offer-hero__visual {
			display: none;
		}

		.offer-stats__grid,
		.offer-proof-grid,
		.offer-feature-grid,
		.offer-roadmap {
			grid-template-columns: 1fr;
		}

		.offer-stat {
			min-height: auto;
			padding: 22px 20px;
		}

		.offer-stack__item {
			grid-template-columns: 1fr;
			gap: 6px;
		}
	}

	@media (max-width: 540px) {
		.offer-wrap,
		.offer-header {
			width: min(calc(100% - 28px), 1180px);
		}

		.offer-header__meta a {
			padding: 9px 11px;
			font-size: 12px;
		}

		.offer-hero h1 {
			font-size: clamp(40px, 12vw, 54px);
		}

		.offer-hero__actions,
		.offer-closing__panel {
			align-items: stretch;
			flex-direction: column;
		}

		.offer-action {
			width: 100%;
		}

		.offer-section h2,
		.offer-closing h2 {
			font-size: 34px;
		}

		.offer-feature-card,
		.offer-roadmap__item,
		.offer-closing__panel {
			padding: 20px;
		}
	}
</style>
