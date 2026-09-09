<script lang="ts">
	import { resolve } from '$app/paths';

	type TermsParagraph = { readonly text: string; readonly spaced?: boolean };

	type TermsSection = {
		readonly id: string;
		readonly navLabel: string;
		readonly title: string;
		readonly paragraphs: readonly TermsParagraph[];
		readonly listItems?: readonly string[];
		readonly closing?: string;
	};

	const intro = 'Това е демонстрационен проект за обсъждане на дизайн, а не потвърден официален сайт на автокъщата.';
	const usageNotice = 'Демонстрацията не извършва покупка, резервация или абонамент. Формите не изпращат съобщения до продавача. Използвайте публикувания телефон за реален контакт.';
	const photosNotice = 'Снимките на автомобилите са от посочените обяви. Декоративните илюстрации не представят служители, помещения или проверено имущество на автокъщата.';
	const accuracyNotice = 'Данните са извадка от публични обяви, не независима техническа проверка. Не са добавени оценки, потвърден пробег или гаранции от автора на демонстрацията.';
	const stockNotice = 'Обява може да бъде променена, резервирана или свалена след датата на извадката. Потвърдете наличността и състоянието директно с продавача преди посещение.';
	const updatesNotice = 'Извадката е прегледана на 9 септември 2026 г. Няма свързан автоматичен канал за обновяване на наличността.';
	const sharedListItems = [
		'Цените са в публикуваната валута. Данъчните и ценовите бележки се отнасят за конкретната обява.',
		'Калкулаторите са илюстративни инструменти, не кредитни оферти, одобрения или обещания от финансов доставчик.',
		'Не въвеждайте лични документи или платежни данни в демонстрационните форми.'
	];

	const sections: readonly TermsSection[] = [
		{
			id: 'section1',
			navLabel: '1. Демонстрация',
			title: '1. Демонстрация',
			paragraphs: [
				{ text: intro, spaced: true },
				{ text: usageNotice, spaced: true },
				{ text: photosNotice }
			]
		},
		{
			id: 'section2',
			navLabel: '2. Източници',
			title: '2. Източници',
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
			navLabel: '4. Дата на извадката',
			title: '4. Дата на извадката',
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
					<span>Информация за демонстрацията</span>
				</li>
			</ol>
		</div>
	</section>

	<section class="terms-main">
		<div class="terms-container">
			<h1>Информация за демонстрацията</h1>
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
		font-size: 14px;
		font-weight: 700;
		line-height: 22px;
	}

	.breadcrumb a,
	.breadcrumb span {
		font-size: 14px;
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
		font-size: 68px;
		font-weight: 600;
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
		font-size: 20px;
		font-weight: 600;
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
		font-size: 24px;
		font-weight: 600;
		line-height: 1.333;
	}

	.terms-body {
		color: #4b4b4b;
		font-size: 18px;
		font-weight: 400;
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

	@media (max-width: 767px) {
		.terms-main {
			padding-bottom: 70px;
		}

		.heading-spacer {
			height: 24px;
		}

		.terms-layout {
			flex-direction: column;
			gap: 40px;
		}

		.terms-content,
		.terms-nav-container,
		.terms-nav {
			width: 100%;
		}

		.terms-main h1 {
			font-size: 40px;
			line-height: 1.2;
		}
	}
</style>
