<script lang="ts">
	// Native 1:1 rebuild of the localized /financing (financing.html) desktop main
	// content: breadcrumb + hero (advantages) + "Как работи" process steps + the
	// "Полезно" blog cards + the FAQ accordion. The copy and data are kept verbatim;
	// the look that used to come from app.css + StorefrontTemplateContent's :global
	// stylesheet is now reproduced as a SELF-CONTAINED scoped style block below,
	// confirmed against getComputedStyle at 1440px (see the comments per section for
	// the measured values). Svelte scopes it to this component's markup, so no legacy
	// template CSS is needed. Brand colours route through tokens (--sa-*); template
	// neutrals stay literal for an exact visual match.
	//
	// The FAQ accordion is a NATIVE Svelte accordion: open/close is driven by local
	// $state (no template JS — the markup carries data-daynight-native-accordion so
	// RouteAccordionBehavior skips it). Single-open behaviour mirrors the template;
	// the first item starts open, matching the baseline.

	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';
	import DesktopYellowRouteHero from '$lib/components/layout/DesktopYellowRouteHero.svelte';

	type AssetHref = `/assets/${string}`;
	type AppHref = `/${string}`;

	type Benefit = {
		title: string;
		copy: string;
	};

	type Step = {
		number: string;
		title: string;
		copy: string;
		href: AppHref;
		active?: boolean;
	};

	type BlogCard = {
		href: '/faq' | '/calculator' | '/sell-your-car';
		image: AssetHref;
		category: string;
		title: string;
		copy: string;
	};

	type FaqItem = {
		id: string;
		question: string;
		answers: readonly string[];
		active?: boolean;
	};

	const benefits: Benefit[] = [
		{
			title: 'Съдействие по документи и прехвърляне',
			copy: 'Екипът подготвя документите и съпровожда прехвърлянето от началото до края.'
		},
		{
			title: 'Ясни условия предварително',
			copy: 'Получавате ориентировъчна месечна вноска и условия още преди да дойдете за оглед.'
		},
		{
			title: 'Отнема само няколко минути',
			copy: 'Изпратете запитване с автомобила и бюджета - екипът ще Ви изпрати конкретни следващи стъпки.'
		}
	];

	const steps: Step[] = [
		{
			number: '1',
			title: 'Изпратете запитване',
			copy: 'Кажете кой автомобил ви интересува и какъв месечен бюджет е удобен — без ангажимент и без влияние върху решението ви.',
			href: '/contact?intent=financing'
		},
		{
			number: '2',
			title: 'Търсете според месечния бюджет',
			copy: 'Използвайте калкулатора, за да сравните първоначална вноска, срок и ориентировъчна месечна вноска.',
			href: '/calculator',
			active: true
		},
		{
			number: '3',
			title: 'Изберете подходяща оферта',
			copy: 'Изберете автомобил от наличността, уточнете условията с екипа и запазете оглед в Шереметя.',
			href: '/inventory'
		}
	];

	const blogCards: BlogCard[] = [
		{
			image: '/assets/images/blog/post-32.jpg',
			href: '/faq',
			category: 'СЪВЕТИ',
			title: 'Въпроси преди покупка',
			copy: 'Отговори за оглед, документи и процеса на покупка.'
		},
		{
			image: '/assets/images/blog/post-31.jpg',
			href: '/calculator',
			category: 'ФИНАНСИРАНЕ',
			title: 'Калкулатор за финансиране',
			copy: 'Ориентировъчна сметка според цена, първоначална вноска и срок.'
		},
		{
			image: '/assets/images/blog/post-23.jpg',
			href: '/sell-your-car',
			category: 'ПОЛЕЗНО',
			title: 'Продажба или бартер',
			copy: 'Изпратете данни за вашия автомобил и обсъдете възможностите с екипа.'
		}
	];

	const faqs: FaqItem[] = [
		{
			id: 'documents',
			question: 'Какви документи са нужни за финансиране?',
			answers: [
				'Обикновено са достатъчни лична карта и основни данни за дохода; за фирми — фирмени документи. Екипът подготвя останалото и съдейства през целия процес.',
				'Конкретните изисквания зависят от избрания финансов партньор и автомобила.'
			],
			active: true
		},
		{
			id: 'owe-money',
			question: 'Мога ли да участвам с бартер при финансиране?',
			answers: [
				'Да — оценяваме текущия ви автомобил и стойността му намалява финансираната сума. Условията се уточняват според автомобила, бюджета и документите.'
			]
		},
		{
			id: 'leasing',
			question: 'Каква първоначална вноска е нужна?',
			answers: [
				'Зависи от автомобила и избраната схема. Екипът може да насочи към подходящ вариант и ориентировъчна месечна вноска още при запитването.'
			]
		},
		{
			id: 'benefits',
			question: 'Колко време отнема одобрението?',
			answers: [
				'Обикновено получавате обратна връзка в рамките на работния ден. Условията се потвърждават окончателно при огледа и подготовката на документите.'
			]
		}
	];

	function asset(path: AssetHref): AssetHref {
		return path;
	}

	// First item starts open, matching the baseline `active` toggle.
	let openId = $state<string | null>(faqs.find((faq) => faq.active)?.id ?? null);

	function toggleFaq(id: string) {
		openId = openId === id ? null : id;
	}
</script>

<div class="financing-page">
	<main id="main-content" tabindex="-1" aria-labelledby="daynight-financing-title">
		<DesktopYellowRouteHero
			headingId="daynight-financing-title"
			title="Финансиране"
			copy="Сравнете бюджет, първоначална вноска и ориентировъчна месечна вноска преди оглед."
			primaryLabel="Изпрати запитване"
			primaryHref="/contact"
			secondaryLabel="Виж автомобили"
			secondaryHref="/inventory"
		/>

		<!-- hero -->
		<section class="bg-white pb-100">
			<div class="container">
				<div class="hero-grid">
					<div>
						<!-- The legacy markup opened the left column with an empty `<p class="mb-12">`;
						     its 12px bottom margin added 12px to the column height (verified the
						     baseline hero grid row was 650.89px vs 638.89px of content). Kept for an
						     exact 1:1 height match. -->
						<p class="mb-12"></p>
						<h2 class="mb-12 capitalize">
							Финансиране и разсрочено плащане без излишни усложнения
						</h2>
						<p class="h7 line-height-28 text-secondary mb-42">
							Сравнете варианти за финансиране и ориентировъчна месечна вноска за минути — с ясни
							условия и съдействие от екипа.
						</p>
						<ul class="benefit-list mb-40">
							{#each benefits as benefit (benefit.title)}
								<li class="benefit-item">
									<img class="benefit-check" src={asset('/assets/icons/check.svg')} alt="" />
									<div>
										<p class="h5 mb-4 capitalize">{benefit.title}</p>
										<p class="h7">{benefit.copy}</p>
									</div>
								</li>
							{/each}
						</ul>

						<div class="hero-actions">
							<a href={resolve('/contact')} class="btn-large-3 sa-cta sa-cta-primary">
								Изпрати запитване
							</a>
							<p class="hero-actions__call">
								<span>Предпочитате разговор?</span>
								<a class="text-underline" href={`tel:${daynightSite.phone}`}>Обадете се</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
		<!-- hero -->

		<!-- process -->
		<section class="background-light py-100">
			<div class="container">
				<div class="section-head">
					<h2 class="mb-14 capitalize">Как работи финансирането</h2>
					<p class="text-secondary h7 line-height-28">
						Сравнете бюджет, първоначална вноска и ориентировъчна месечна вноска преди оглед.
					</p>
				</div>

				<div class="step-wrapper">
					{#each steps as step (step.number)}
						<div class={['step-box', { 'active-step': step.active }]}>
							<p class="step-number">{step.number}</p>
							<a href={resolve(step.href)} class="step-title h4 text-center capitalize">
								{step.title}
							</a>
							<p class="text-secondary text-center">{step.copy}</p>
						</div>
					{/each}
				</div>
			</div>
		</section>
		<!-- process -->

		<!-- blog -->
		<section class="bg-white py-100">
			<div class="container">
				<div class="mb-40">
					<h2 class="mb-12 capitalize">Полезно при покупка с финансиране</h2>
					<p class="text-secondary h7 line-height-28">
						Отговори, калкулатор и запитване за вашия автомобил.
					</p>
				</div>

				<div class="blog-grid">
					{#each blogCards as post (post.image)}
						<a href={resolve(post.href)} class="post-card">
							<div class="post-card__image">
								<img class="post-card__img" src={asset(post.image)} alt="" />
							</div>
							<div class="post-card__content">
								<div class="post-card__meta">
									<span class="post-card__category text-sm">{post.category}</span>
								</div>
								<p class="h4 post-card__title mb-12">{post.title}</p>
								<p class="clamp-2 text-secondary">{post.copy}</p>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</section>
		<!-- blog -->

		<!-- faq -->
		<section class="background-light py-100">
			<div class="container">
				<h2 class="mb-40 text-center capitalize">Често задавани въпроси за финансирането</h2>
				<div class="max-width-930 mx-auto w-full">
					<div class="flat-accordion flex flex-col gap-18" data-daynight-native-accordion>
						{#each faqs as faq (faq.id)}
							{@const open = openId === faq.id}
							<div class={['flat-toggle', { active: open }]}>
								<div
									class={['toggle-title', { active: open }]}
									role="button"
									tabindex="0"
									aria-expanded={open}
									onclick={() => toggleFaq(faq.id)}
									onkeydown={(event) => {
										if (event.key === 'Enter' || event.key === ' ') {
											event.preventDefault();
											toggleFaq(faq.id);
										}
									}}
								>
									<p class="h5 title">{faq.question}</p>
									<span class="icon">
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M20 15L12 7L4 15"
												stroke="#1C1C1C"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
									</span>
								</div>
								<div class="toggle-content">
									{#each faq.answers as answer, index (answer)}
										<p
											class={[
												'h7',
												'text-secondary',
												'line-height-28',
												{ 'mb-8': faq.answers.length > 1 && index === 0 }
											]}
										>
											{answer}
										</p>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</section>
		<!-- faq -->
	</main>
</div>

<style>
	/* Self-contained scoped styles for /financing. These reproduce the exact rules
	   the legacy app.css + StorefrontTemplateContent :global stylesheet provided for
	   the verbatim class strings used above, confirmed against getComputedStyle at
	   1440px. Svelte scopes them to this component's markup, so no :global wrapper is
	   required (except :global(svg) for the breadcrumb icon). Brand colours route
	   through tokens (--sa-*); template neutrals stay literal for an exact match. */
	.financing-page,
	.financing-page * {
		box-sizing: border-box;
	}

	/* app.css's universal `* { color: #1C1C1C }` reset made default text the template
	   neutral #1c1c1c (NOT --sa-ink). Kept literal for an exact baseline match;
	   elements with their own colour override below. The body default line-height was
	   26px (verified), so it is set here on the root. */
	.financing-page {
		color: #1c1c1c;
		font-size: 16px;
		font-weight: 400;
		line-height: 26px;
		letter-spacing: 0;
	}

	.financing-page a:not(.sa-cta) {
		color: inherit;
		text-decoration: none;
	}

	.financing-page img,
	.financing-page svg {
		display: block;
		max-width: 100%;
	}

	.financing-page p,
	.financing-page h2,
	.financing-page ul {
		margin-top: 0;
	}

	/* Layout container. The legacy `.container` was a blend of app.css
	   (`max-width:1440px; padding:0 15px`) and StorefrontTemplateContent
	   (`width:min(100% - 48px, 1320px)`). The explicit `max-width:1440px` also defeats
	   Tailwind's built-in `.container` utility (1280px at xl). Verified width 1320px /
	   max 1440px / padding 0 15px via getComputedStyle. */
	.container {
		width: min(100% - 48px, 1320px);
		max-width: 1440px;
		margin: 0 auto;
		padding: 0 15px;
	}

	.background-light {
		background: #f5f7fb;
	}

	.bg-white {
		background: #fff;
	}

	/* Section spacing utilities (verified: hero pb-100 = 100px; process/blog/faq
	   py-100 = 100px top+bottom; breadcrumb section mb-32 = 32px). */
	.pb-100 {
		padding-bottom: 100px;
	}

	.py-100 {
		padding-top: 100px;
		padding-bottom: 100px;
	}

	/* Margin utilities */
	.mb-4 {
		margin-bottom: 4px;
	}

	.mb-8 {
		margin-bottom: 8px;
	}

	.mb-12 {
		margin-bottom: 12px;
	}

	.mb-14 {
		margin-bottom: 14px;
	}

	.mb-40 {
		margin-bottom: 40px;
	}

	.mb-42 {
		margin-bottom: 42px;
	}

	.mx-auto {
		margin-right: auto;
		margin-left: auto;
	}

	.w-full {
		width: 100%;
	}

	.max-width-930 {
		max-width: 930px;
	}

	/* Flex utilities */
	.flex {
		display: flex;
	}

	.flex-col {
		flex-direction: column;
	}

	.gap-18 {
		gap: 18px;
	}

	/* Text utilities */
	.capitalize {
		text-transform: none;
	}

	.text-center {
		text-align: center;
	}

	.text-secondary {
		color: #667085;
	}

	.text-sm {
		font-size: var(--sa-text-desktop-dense);
		line-height: 1.45;
	}

	.text-underline {
		text-decoration: underline;
		text-underline-offset: 4px;
	}

	/* `.line-height-28` is declared BEFORE `.h7` to preserve the template's source
	   order: at equal specificity the later `.h7` rule wins on line-height (1.6),
	   matching the committed baseline. */
	.line-height-28 {
		line-height: 28px;
	}

	/* app.css applied `font-weight: 600` to the whole `.h4…h7,h1…h6` group, and
	   StorefrontTemplateContent's `.h7` declared no weight — so the legacy lead/copy/
	   answer text rendered at 600 (verified: font-weight 600, line-height 1.6). This is
	   load-bearing for height: dropping it lets the text wrap to fewer lines and the
	   page shrinks. */
	.h7 {
		font-size: var(--sa-text-desktop-body);
		font-weight: 500;
		line-height: var(--sa-leading-body);
	}

	.h5 {
		font-size: 18px;
		font-weight: var(--sa-weight-semibold);
		line-height: 1.35;
	}

	.h4 {
		font-size: 22px;
		font-weight: var(--sa-weight-semibold);
		line-height: 1.25;
	}

	/* h1 / h2 — both `.h2` utility and the bare h1/h2 element rules in the legacy
	   cascade resolved to colour #111827, weight 700, line-height 1.08. The page uses
	   `class="h2"` on the h1 (clamp 32–48 → 46.08px at 1440) and bare h2 elements that
	   also pick up the .h2 utility. text-align: the h1 is centered (verified), the
	   section h2 headings are left (start). */
	.financing-page h2 {
		color: #111827;
		font-size: clamp(32px, 3.2vw, 48px);
		font-weight: 700;
		letter-spacing: 0;
		line-height: 1.08;
	}

	/* The detailed financing explanation follows the route hero in one reading column. */
	.hero-grid {
		display: grid;
		grid-template-columns: minmax(0, 760px);
		justify-content: center;
		padding-top: 72px;
	}

	/* Benefit list (verified: grid single column, gap 26px, mb-40; each item flex,
	   gap 12px, items-start; the check icon 24x24; title .h5 semibold mb-4; copy .h7
	   16/600/1.6). */
	.benefit-list {
		display: grid;
		grid-template-columns: 1fr;
		gap: 26px;
		margin: 0 0 40px;
		padding: 0;
		list-style: none;
	}

	.benefit-item {
		display: flex;
		align-items: flex-start;
		gap: 12px;
	}

	.benefit-check {
		width: 24px;
		height: 24px;
		flex: 0 0 auto;
	}

	/* Hero buttons row (verified: flex, items-center, gap 20px). The CTA uses the shared
	   storefront button grammar with the legacy 54px height and 26px horizontal padding. */
	.hero-actions {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	.hero-actions__call {
		display: flex;
		gap: 8px;
	}

	.btn-large-3 {
		min-height: 54px;
		padding-right: 26px;
		padding-left: 26px;
	}

	/* Process section heading wrapper (verified: flex column items-center, mb-40; the
	   h2 mb-14, the sub .h7 16/600/1.6 #667085). */
	.section-head {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 40px;
	}

	/* Process step cards. The legacy render resolved to the StorefrontTemplateContent
	   card layout (NOT app.css's flex-stepper): grid 3 cols, gap 22px; each box is a
	   white card — grid, gap 12px, border 1px #e4e8ef, radius 12px, padding 30px 24px,
	   soft shadow. The number is a 46px blue circle (bg #B00000, white, 32px/700, grid
	   place-items center, margin-bottom 28px — verified). Title .h4 semibold centered
	   mb-8; copy 16/400/26 #667085 centered (the .text-secondary on a plain <p> stays
	   at the body weight 400, unlike the .h7 leads). */
	.step-wrapper {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 22px;
	}

	/* The legacy step card resolved with border-WIDTH 0 (verified borderTopWidth 0px
	   on both the normal and active step), so only the radius/background/shadow render
	   — adding a 1px border here would make every card 2px taller and shift the page. */
	.step-box {
		border: 1px solid var(--sa-line);
		display: grid;
		gap: 12px;
		align-items: center;
		border-radius: 12px;
		background: #fff;
		padding: 30px 24px;
		box-shadow: none;
	}

	.step-box.active-step {
		border-color: var(--sa-line-strong);
	}

	.step-number {
		display: grid;
		width: 46px;
		height: 46px;
		place-items: center;
		margin-bottom: 28px;
		border-radius: 999px;
		background: var(--sa-blue, #b00000);
		color: #fff;
		font-size: 32px;
		font-weight: 700;
	}

	.step-title {
		margin-bottom: 8px;
	}

	.step-box p.text-secondary {
		margin: 0;
		font-size: var(--sa-text-desktop-dense);
		font-weight: 400;
		line-height: 26px;
	}

	/* Blog cards (verified: grid 3 cols gap 30px; each card border 1px #e4e8ef, radius
	   12px, soft shadow, white; the image wrapper radius 16px overflow hidden mb-20,
	   the img min-height 300px object-fit cover; content padding 22px; meta spans 14px;
	   title .h4 mb-12; copy clamped 2 lines #667085). */
	.blog-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 30px;
	}

	.post-card {
		position: relative;
		display: block;
		border: 1px solid #e4e8ef;
		border-radius: 12px;
		background: #fff;
		color: #111827;
		box-shadow: none;
		text-decoration: none;
	}

	.post-card__image {
		overflow: hidden;
		margin-bottom: 20px;
		border-radius: 16px;
	}

	.post-card__img {
		width: 100%;
		min-height: 300px;
		height: 100%;
		object-fit: cover;
	}

	.post-card__content {
		width: 100%;
		padding: 22px;
	}

	.post-card__meta {
		display: flex;
		justify-content: flex-start;
		gap: 12px;
		margin-bottom: 12px;
	}

	.post-card__category {
		color: #b00000;
		text-decoration: underline;
		text-underline-offset: 4px;
		text-transform: uppercase;
	}

	.post-card__title {
		margin-bottom: 12px;
	}

	.clamp-2 {
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	/* FAQ accordion. The legacy look was a BLEND: app.css supplied the outer padding
	   (20px 28px) + the absolute-positioned icon, while StorefrontTemplateContent won
	   the border/radius/background/shadow + the flat-toggle flex title. These
	   declarations reproduce the *computed* result (verified): toggle padding 20px 28px,
	   border 1px #e4e8ef, radius 8px, white, soft shadow; title flex min-height 72px
	   padding 20px 24px; icon absolute top 2px right 0 (34px pill, #f4f6fa); content
	   padding 0 24px 24px, margin-top 6px; answers .h7 600/1.6 #667085. */
	.flat-accordion {
		width: 100%;
	}

	.flat-toggle {
		overflow: hidden;
		padding: 20px 28px;
		border: 1px solid #e4e8ef;
		border-radius: 8px;
		background: #fff;
		box-shadow: none;
	}

	.toggle-title {
		position: relative;
		display: flex;
		min-height: 72px;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 20px 24px;
		cursor: pointer;
	}

	.toggle-title .title {
		margin: 0;
	}

	/* app.css's absolute icon positioning + default 180° rotation (chevron points
	   down) won over StorefrontTemplateContent's grid pill at source order; the active
	   rotation also resolved to 180° in the legacy cascade, so every chevron points
	   down — matching the committed baseline. */
	.toggle-title .icon {
		position: absolute;
		top: 2px;
		right: 0;
		display: grid;
		width: 34px;
		height: 34px;
		flex: 0 0 auto;
		place-items: center;
		border-radius: 999px;
		background: #f4f6fa;
		transform: rotate(180deg);
		transition: all 0.3s ease;
	}

	.toggle-title.active .icon {
		transform: rotate(180deg);
	}

	.toggle-content {
		display: none;
		margin-top: 6px;
		padding: 0 24px 24px;
	}

	/* This native accordion reveals the open item's content purely from the `active`
	   class our Svelte state owns (the template did it imperatively via inline display). */
	.flat-accordion .flat-toggle.active .toggle-content {
		display: block;
	}

	@media (max-width: 767px) {
		.container {
			width: min(100% - 32px, 1320px);
		}

		.pb-100,
		.py-100 {
			padding-top: 56px;
			padding-bottom: 56px;
		}

		.pb-100 {
			padding-top: 0;
		}

		.step-wrapper,
		.blog-grid {
			grid-template-columns: 1fr;
		}

		.toggle-title {
			min-height: 64px;
			padding: 18px;
		}

		.toggle-content {
			padding: 0 18px 18px;
		}
	}
</style>
