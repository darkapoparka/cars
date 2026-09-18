<script lang="ts">
	import { daynightSite } from '$lib/data/daynight-site';
	import { resolve } from '$app/paths';
	import DesktopYellowRouteHero from '$lib/components/layout/DesktopYellowRouteHero.svelte';

	type TermsParagraph = { readonly text: string; readonly spaced?: boolean };

	type TermsSection = {
		readonly id: string;
		readonly navLabel: string;
		readonly title: string;
		readonly paragraphs: readonly TermsParagraph[];
		readonly listItems?: readonly string[];
		readonly closing?: string;
	};

	const intro = `Информацията в този сайт има информативен характер. Актуалните цени, наличност и условия за финансиране се потвърждават директно със ${daynightSite.shortName} преди сделка.`;
	const usageNotice =
		'Използвайки сайта, потребителят приема, че обявите и описанията подлежат на проверка на място и не представляват публична оферта.';
	const photosNotice =
		'Снимките и описанията илюстрират конкретния автомобил, а състоянието и оборудването се потвърждават при оглед.';
	const accuracyNotice = `${daynightSite.shortName} полага усилия съдържанието да е точно и актуално, но не носи отговорност за непълноти или технически грешки в обявите.`;
	const stockNotice =
		'Възможно е автомобил да бъде продаден или резервиран, преди обявата да бъде обновена, затова препоръчваме предварително потвърждение на наличността.';
	const updatesNotice = `${daynightSite.shortName} може да актуализира услугите и условията по всяко време, като валидна е версията, публикувана към момента на ползване на сайта. `;

	const sharedListItems = [
		'Финансиране, разсрочено плащане и бартер се предлагат при условия, договорени индивидуално за всеки клиент.',
		`Огледът и тестът се организират предварително по уговорка в ${daynightSite.city}.`,
		'Техническите характеристики са по данни на производителя и предходния собственик и подлежат на проверка при оглед.'
	];

	const sections: readonly TermsSection[] = [
		{
			id: 'section1',
			navLabel: '1. Условия',
			title: '1. Условия',
			paragraphs: [
				{ text: intro, spaced: true },
				{ text: usageNotice, spaced: true },
				{ text: photosNotice }
			]
		},
		{
			id: 'section2',
			navLabel: '2. Ограничения',
			title: '2. Ограничения',
			paragraphs: [{ text: accuracyNotice }]
		},
		{
			id: 'section3',
			navLabel: '3. Наличност',
			title: '3. Наличност',
			paragraphs: [{ text: stockNotice }]
		},
		{
			id: 'section4',
			navLabel: '4. Промени в условията',
			title: '4. Промени в условията',
			paragraphs: [{ text: updatesNotice }]
		},
		{
			id: 'section5',
			navLabel: '5. Уточнения',
			title: '5. Уточнения',
			paragraphs: [],
			listItems: sharedListItems
		}
	];
</script>

<div class="terms-page">
	<DesktopYellowRouteHero
		headingId="terms-route-title"
		title="Условия за ползване"
		copy={`Информация за ползването на сайта, обявите, наличността и условията на ${daynightSite.shortName}.`}
		panel="light"
		primaryLabel="Свържете се"
		primaryHref="/contact"
		secondaryLabel="Виж автомобилите"
		secondaryHref="/inventory"
	/>
	<section class="breadcrumb-band" aria-label="Навигационна пътека">
		<div class="terms-container">
			<ol class="breadcrumb">
				<li>
					<a href={resolve('/')}>Начало</a>
				</li>
				<li class="breadcrumb__icon" aria-hidden="true">
					<img src="/assets/icons/right.svg" alt="" />
				</li>
				<li>
					<span>Още</span>
				</li>
				<li class="breadcrumb__icon" aria-hidden="true">
					<img src="/assets/icons/right.svg" alt="" />
				</li>
				<li>
					<span>Условия за ползване</span>
				</li>
			</ol>
		</div>
	</section>

	<section class="terms-main">
		<div class="terms-container">
			<h1>Условия за ползване</h1>
			<div class="heading-spacer"></div>

			<div class="terms-layout" id="scrollContainer">
				<nav class="terms-nav-container" aria-label="Съдържание">
					<ol class="terms-nav" id="sidebarSticky">
						{#each sections as section (section.id)}
							<li>
								<a href="#{section.id}">{section.navLabel}</a>
							</li>
						{/each}
					</ol>
				</nav>

				<div class="terms-content">
					{#each sections as section (section.id)}
						<section class="terms-section" id={section.id} aria-labelledby={`${section.id}-title`}>
							<h2 id={`${section.id}-title`}>{section.title}</h2>

							{#each section.paragraphs as paragraph (paragraph.text)}
								<p class={['terms-body', paragraph.spaced && 'terms-body--spaced']}>
									{paragraph.text}
								</p>
							{/each}

							{#if section.listItems}
								<ul class="terms-list">
									{#each section.listItems as item (item)}
										<li class="terms-body terms-body--spaced">
											{item}
										</li>
									{/each}
								</ul>
							{/if}

							{#if section.closing}
								<p class="terms-body">{section.closing}</p>
							{/if}
						</section>
					{/each}
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	@media (min-width: 992px) {
		.terms-page > .breadcrumb-band,
		.terms-main h1,
		.heading-spacer {
			display: none;
		}

		.terms-main {
			padding-top: var(--sa-desktop-section-y-md);
		}
	}

	.terms-page,
	.terms-page * {
		box-sizing: border-box;
	}

	.terms-page {
		background: #fff;
		color: #1c1c1c;
		font-family: var(--sa-font);
		letter-spacing: 0;
	}

	.terms-page a {
		color: inherit;
		text-decoration: none;
	}

	.terms-page img {
		display: block;
		max-width: 100%;
	}

	.terms-page h1,
	.terms-page h2,
	.terms-page p,
	.terms-page ol,
	.terms-page ul {
		margin-top: 0;
	}

	.terms-page p,
	.terms-page ol,
	.terms-page ul {
		margin-bottom: 0;
	}

	.terms-page ol,
	.terms-page ul {
		list-style: none;
		padding-left: 0;
	}

	.terms-container {
		width: 100%;
		max-width: 1440px;
		margin: 0 auto;
		padding: 0 15px;
	}

	.breadcrumb-band {
		margin-bottom: 32px;
		background: #f5f7fb;
	}

	.breadcrumb-band .terms-container {
		width: min(100% - 48px, 1320px);
		padding: 0;
	}

	.breadcrumb {
		display: flex;
		min-height: 76px;
		align-items: center;
		flex-wrap: wrap;
		gap: 10px;
		padding: 0;
		color: #5f6877;
		font-size: var(--sa-text-caption);
		font-weight: var(--sa-weight-strong);
		line-height: 22px;
	}

	.breadcrumb a,
	.breadcrumb span {
		font-size: var(--sa-text-caption);
		line-height: 22px;
	}

	.breadcrumb a {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		color: #1c1c1c;
	}

	.breadcrumb span {
		color: #667085;
	}

	.breadcrumb__icon img {
		width: 14px;
		height: 14px;
		opacity: 0.72;
	}

	.terms-main {
		background: #fff;
		padding-bottom: 100px;
	}

	.terms-main h1 {
		margin-bottom: 0;
		color: #1c1c1c;
		font-size: var(--sa-text-desktop-hero-title);
		font-weight: var(--sa-weight-heading);
		line-height: 76px;
	}

	.heading-spacer {
		height: 40px;
	}

	.terms-layout {
		display: flex;
		justify-content: space-between;
	}

	.terms-nav-container {
		position: relative;
		width: 360px;
	}

	.terms-nav {
		position: relative;
		display: flex;
		height: fit-content;
		flex-direction: column;
		gap: 16px;
		border-left: 1px solid #e7e7e7;
		padding-top: 11px;
	}

	.terms-nav a {
		position: relative;
		display: inline-block;
		border-left: 3px solid transparent;
		padding-left: 12px;
		color: #1c1c1c;
		font-size: var(--sa-text-xl);
		font-weight: var(--sa-button-font-weight);
		line-height: 28px;
		transition:
			border-color 0.3s ease,
			color 0.3s ease;
	}

	.terms-nav a:hover,
	.terms-nav a:focus-visible {
		border-color: #b00000;
		color: #b00000;
	}

	.terms-content {
		width: calc(100% - 490px);
	}

	.terms-section {
		scroll-margin-top: 110px;
	}

	.terms-section:not(:first-child) {
		margin-top: 32px;
	}

	.terms-section h2 {
		margin-bottom: 12px;
		color: #1c1c1c;
		font-size: var(--sa-text-2xl);
		font-weight: var(--sa-weight-heading);
		line-height: 1.333;
	}

	.terms-body {
		color: #4b4b4b;
		font-size: var(--sa-text-lg);
		font-weight: var(--sa-weight-regular);
		line-height: 28px;
	}

	.terms-body.terms-body--spaced {
		margin-bottom: 12px;
	}

	.terms-list li {
		position: relative;
		padding-left: 28px;
	}

	.terms-list li::before {
		position: absolute;
		top: 13px;
		left: 11px;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: #1c1c1c;
		content: '';
	}

	@media (min-width: 768px) {
		.terms-page {
			margin-top: -2px;
		}
	}

	@media (max-width: 1199px) {
		.terms-nav {
			width: 300px;
		}

		.terms-content {
			width: calc(100% - 340px);
		}
	}

	@media (max-width: 991px) {
		.terms-page .terms-container,
		.terms-page .breadcrumb-band .terms-container {
			width: calc(100% - 2 * var(--sa-mobile-gutter-wide));
			padding: 0;
		}
		.terms-page .breadcrumb {
			min-height: var(--sa-mobile-action-h);
			padding-block: var(--sa-mobile-gap-xs);
			gap: var(--sa-mobile-gap-sm);
		}
		.terms-page .breadcrumb-band {
			margin-bottom: var(--sa-mobile-page-gap);
		}
		.terms-page .terms-main {
			padding-bottom: var(--sa-space-8);
		}
		.terms-page .terms-main h1 {
			font-size: var(--sa-mobile-type-page-title);
			line-height: var(--sa-mobile-leading-heading);
		}
		.terms-page .heading-spacer {
			height: var(--sa-mobile-page-gap);
		}
		.terms-page .terms-layout {
			flex-direction: column;
			gap: var(--sa-mobile-page-gap);
		}
		.terms-page .terms-content,
		.terms-page .terms-nav-container,
		.terms-page .terms-nav {
			width: 100%;
		}
		.terms-page .terms-nav {
			gap: 0;
			padding-top: 0;
		}
		.terms-page .terms-nav a {
			display: flex;
			align-items: center;
			min-height: var(--sa-mobile-action-h);
			font-size: var(--sa-mobile-type-input);
			line-height: 1.4;
		}
		.terms-page .terms-section h2 {
			font-size: var(--sa-mobile-type-section-title);
			line-height: 1.25;
		}
		.terms-page .terms-body {
			font-size: var(--sa-mobile-type-input);
			line-height: var(--sa-leading-body);
			color: var(--sa-ink-soft);
		}
		.terms-page .terms-section {
			scroll-margin-top: var(--sa-mobile-gap-lg);
		}
	}
</style>
