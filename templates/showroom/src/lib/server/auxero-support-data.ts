import { agents } from '$lib/data/agents';
import { auxeroAboutContent } from '$lib/auxero/about';
import {
	auxeroCalculatorData,
	formatEur,
	type AuxeroCalculatorField
} from '$lib/auxero/calculator';
import { auxeroFaqGroups, supportFaqs, type AuxeroFaq } from '$lib/auxero/faqs';
import { auxeroReviewCards, type AuxeroReviewCard } from '$lib/auxero/reviews';
import { auxeroSellSteps } from '$lib/auxero/sell-your-car';
import { auxeroServiceCards, type AuxeroSupportService } from '$lib/auxero/services';
import { auxeroTermsSections } from '$lib/auxero/terms';
import {
	eliqautoAssets,
	eliqautoBrand,
	eliqautoContact,
	eliqautoConsultants
} from '$lib/data/eliqauto';
import type { BlogPost } from '$lib/data/blog';
import { brands, vehicles } from '$lib/data/vehicles';
import { getBlogDetailOrFallback, listBlogPosts } from './blog-state';
import type { AuxeroRenderOptions } from './auxero-listing-data';

const supportTemplates = new Set([
	'about-us.html',
	'blog-details-1.html',
	'blog-grid-style-1.html',
	'calculator.html',
	'clients-reviews.html',
	'faqs.html',
	'sell-your-car.html',
	'services-center.html',
	'terms.html'
]);

const escapeHtml = (value: string | number) =>
	String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');

const sentence = (value: string) => escapeHtml(value).replaceAll('\n', '<br>');

const stars = () =>
	Array.from({ length: 5 })
		.map(() => '<img src="/assets/icons/star-6.svg" alt="star">')
		.join('');

const checkList = (items: string[], white = false) =>
	`<ul class="list mb-32">
		${items
			.map(
				(
					item
				) => `<li class="flex items-center gap-12 mb-8 font-weight-500 h7 md-items-start${white ? ' text-white' : ''}">
					<img src="/assets/icons/${white ? 'check-white.svg' : 'check.svg'}" alt="check">
					${escapeHtml(item)}
				</li>`
			)
			.join('\n')}
	</ul>`;

const statsGrid = () => {
	const stats = [
		{ value: String(vehicles.length), suffix: '', label: 'Автомобила в наличност' },
		{ value: String(brands.length), suffix: '', label: 'Марки в инвентара' },
		{ value: '98', suffix: '%', label: 'Препоръки във Facebook' },
		{ value: '157', suffix: '', label: 'Публични отзива' }
	];

	return `<div class="grid grid-cols-4 gap-130 md-grid-cols-2 counter-spacing">
		${stats
			.map(
				(
					stat,
					index
				) => `<div class="box-couter-item ${index < stats.length - 1 ? 'outline-right' : ''} wow fadeInUp" data-wow-delay="0.${index + 1}s">
					<div class="content">
						<div class="box-couter counter">
							<div class="number-content font-main-2">
								<span class="count-number font-main-2" data-to="${escapeHtml(stat.value)}" data-speed="1500" data-inviewport="yes">${escapeHtml(stat.value)}</span>${escapeHtml(stat.suffix)}
							</div>
						</div>
						<p class="font-weight-500 text-muted h7 text-center">${escapeHtml(stat.label)}</p>
					</div>
				</div>`
			)
			.join('\n')}
	</div>`;
};

const reviewCard = (review: AuxeroReviewCard) => `<div class="testimonior-box">
		<div class="flex items-center gap-4 mb-16">${stars()}</div>
		<p class="testimonior-box--desc mb-16">${sentence(review.text)}</p>
		<div class="testimonior-box--user">
			<img class="testimonior--img" src="${escapeHtml(review.avatar)}" alt="${escapeHtml(review.name)}">
			<div class="testimonior-box--user-content">
				<p class="h5 title">${escapeHtml(review.name)}</p>
				<p class="desc">${escapeHtml(review.role)}</p>
			</div>
		</div>
	</div>`;

const reviewsGrid = (limit = auxeroReviewCards.length) =>
	`<div class="grid grid-cols-3 gap-y-38 gap-x-30 lg-grid-cols-2 md-grid-cols-1 mb-40" data-eliqauto-reviews-grid>
		${auxeroReviewCards.slice(0, limit).map(reviewCard).join('\n')}
	</div>`;

const faqToggle = (faq: AuxeroFaq, index: number, forceWhite = false) =>
	`<div class="flat-toggle ${forceWhite ? 'bg-white' : ''} ${index === 0 ? 'active' : ''}">
		<div class="toggle-title ${index === 0 ? 'active' : ''}">
			<p class="h5 title">${escapeHtml(faq.question)}</p>
			<span class="icon">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M20 15L12 7L4 15" stroke="#1C1C1C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</span>
		</div>
		<div class="toggle-content">
			<p class="h7 text-secondary line-height-28">${sentence(faq.answer)}</p>
		</div>
	</div>`;

const faqAccordion = (items: AuxeroFaq[], forceWhite = false) =>
	`<div class="flat-accordion flex flex-col gap-18 max-width-930 wow fadeIn" data-wow-delay=".3s">
		${items.map((faq, index) => faqToggle(faq, index, forceWhite)).join('\n')}
	</div>`;

const contactCtaSection = () => `<section class="relative py-100">
	<div class="overlay-parallax"></div>
	<div class="overlay image">
		<img class="lazyload parallax" data-src="${escapeHtml(eliqautoAssets.hero)}" src="${escapeHtml(eliqautoAssets.hero)}" alt="Eliqauto">
	</div>
	<div class="container relative index-10">
		<h2 class="mb-12 text-white capitalize">Говори с Eliqauto</h2>
		<p class="h7 line-height-28 text-white mb-20">Изпрати автомобил, бюджет, VIN или снимки и екипът ще подготви следващата стъпка.</p>
		<p class="mb-4 text-white">${escapeHtml(eliqautoContact.appointmentNote)}</p>
		<p class="mb-20 text-white">${escapeHtml(eliqautoContact.addressLabel)}</p>
		<div class="flex">
			<a href="/contact" class="btn btn-white text-primary btn-large-3 font-weight-600">Свържи се с Eliqauto</a>
		</div>
	</div>
</section>`;

const replaceBodyAfterBreadcrumb = (html: string, body: string) => {
	const marker = '<!-- breadcrumb -->';
	const first = html.indexOf(marker);
	const second = first < 0 ? -1 : html.indexOf(marker, first + marker.length);
	const footer = html.indexOf('<footer', second > -1 ? second : 0);

	if (second < 0 || footer < 0) return html;

	return `${html.slice(0, second + marker.length)}\n\n${body}\n\n\t\t${html.slice(footer)}`;
};

const replaceFromFirstSection = (html: string, body: string) => {
	const start = html.indexOf('<section');
	const footer = html.indexOf('<footer', start);

	if (start < 0 || footer < 0) return html;

	return `${html.slice(0, start)}${body}\n\n\t\t${html.slice(footer)}`;
};

const serviceCard = (
	service: AuxeroSupportService,
	index: number
) => `<div class="service-box wow fadeInUp" data-wow-delay="0.${(index % 3) + 1}s">
	<div class="mb-22 radius-16 overflow-hidden">
		<img class="w-full" src="${escapeHtml(service.image)}" alt="${escapeHtml(service.title)}">
	</div>
	<a href="${escapeHtml(service.href)}" class="h4 font-weight-600 mb-8">${escapeHtml(service.title)}</a>
	<p class="text-secondary">${sentence(service.description)}</p>
</div>`;

const marketplacePhoneHref: string = eliqautoContact.marketplacePhoneHref;
const primaryPhoneHref: string = eliqautoContact.primaryPhoneHref;
const marketplacePhoneLabel: string = eliqautoContact.marketplacePhoneLabel;
const primaryPhoneLabel: string = eliqautoContact.primaryPhoneLabel;

const secondaryPhoneLink =
	marketplacePhoneHref === primaryPhoneHref &&
	marketplacePhoneLabel === primaryPhoneLabel
		? ''
		: `<a href="${marketplacePhoneHref}" class="text-sm text-white">${escapeHtml(marketplacePhoneLabel)}</a>`;

const consultantGrid =
	() => `<div class="grid grid-cols-4 sm-grid-cols-1 lg-grid-cols-2 gap-30 xl-gap-16">
	${agents
		.map(
			(agent) => `<div class="sale-agent-box">
				<div class="card-top mb-20">
					<a class="w-full flex" href="/agents/${escapeHtml(agent.slug)}">
						<img class="w-full" src="${escapeHtml(agent.image)}" alt="${escapeHtml(agent.name)}">
					</a>
				</div>
				<div class="card-bottom flex items-center justify-between gap-16">
					<div class="content">
						<a href="/agents/${escapeHtml(agent.slug)}" class="h5 font-weight-600 sale-agent-title">${escapeHtml(agent.name)}</a>
						<p class="text-secondary text-sm">${escapeHtml(agent.title)}</p>
					</div>
				</div>
			</div>`
		)
		.join('\n')}
</div>`;

const applySellYourCarData = (html: string) => {
	const body = `<section class="pb-100 eliqauto-sell-hero">
	<div class="container">
		<h1 class="h2 eliqauto-sell-page-title">Продай автомобила си с Eliqauto</h1>
		<div class="tf-spacing-style3"></div>
		<div class="row eliqauto-sell-hero-grid">
			<div class="col-lg-6 lg-mb-40 eliqauto-sell-copy">
				<p class="eliqauto-sell-eyebrow mb-12 text-highlight font-weight-600 uppercase">${escapeHtml(eliqautoBrand.tagline)}</p>
				<h2 class="font-weight-600 mb-16 capitalize mt-12">Ясен процес за клиентски автомобили</h2>
				<p class="text-secondary h7 line-height-28 mb-32">Изпрати точната информация първо, за да преценим дали е подходяща директна оферта, съдействие при продажба или клиентска обява.</p>
				<ul class="flex flex-col gap-12 mb-32 eliqauto-sell-checklist">
					${[
						'VIN, пробег, история, документи и снимки се гледат заедно',
						'Реалистична обратна връзка за цената преди публикуване',
						'Предаване с уговорка и ясни следващи стъпки'
					]
						.map(
							(item) => `<li class="flex gap-4">
								<img class="w-24 h-24" src="/assets/icons/check.svg" alt="check">
								<p class="h6 font-weight-600">${escapeHtml(item)}</p>
							</li>`
						)
						.join('\n')}
				</ul>
				<div class="flex gap-28 items-center sm-flex-col sm-items-start sm-gap-16 eliqauto-sell-actions">
					<a href="/contact" class="btn btn-primary btn-large-3 font-weight-600">Свържи се с Eliqauto</a>
					<a href="${eliqautoContact.primaryPhoneHref}" class="flex gap-12 eliqauto-sell-phone">
						<img src="/assets/icons/PhoneCall-3.svg" alt="PhoneCall">
						<div class="mt2">
							<span class="text-sm text-secondary">Въпрос за продажба?</span>
							<p class="h5 font-weight-600">${escapeHtml(eliqautoContact.primaryPhoneLabel)}</p>
						</div>
					</a>
				</div>
			</div>
			<div class="col-lg-6">
				<div class="flat-tabs about-form eliqauto-sell-intake">
					<div class="overflow-x-auto mb-26">
						<ul class="menu-tab menu-tab-style7 large">
							<li>Данни за автомобила</li>
							<li class="active">VIN и снимки</li>
						</ul>
					</div>
					<div class="content-tab visible">
						<div class="content-inner active">
							<form action="#" class="calculate-form eliqauto-sell-form" novalidate>
								<div class="grid grid-cols-1 gap-15 mb-28">
									<div>
										<p class="mb-8">VIN номер</p>
										<input class="active input-large" placeholder="Въведете VIN" id="sellVIN" name="vin" type="text" required>
									</div>
									<div>
										<p class="mb-8">Пробег</p>
										<input class="input-large" id="sellMileage" name="mileage" placeholder="Пробег в км" type="text" required>
									</div>
									<div>
										<p class="mb-8">Очаквана цена</p>
										<input class="input-large" id="sellPrice" name="price" placeholder="Очаквана цена в EUR" type="text">
									</div>
									<div>
										<p class="mb-8">Телефон за контакт</p>
										<input class="input-large" id="sellPhone" name="phone" placeholder="Вашият телефон" type="tel" required>
									</div>
								</div>
								<button type="submit" class="btn btn-primary btn-large font-weight-600 w-full">Заяви преглед</button>
								<p class="auxero-form-status text-highlight font-weight-600 mt-12" aria-live="polite"></p>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="tf-spacing-style4 eliqauto-sell-section-gap"></div>
	<div class="divider w-full"></div>
	<div class="tf-spacing-style4 eliqauto-sell-section-gap"></div>
	<div class="container wow fadeInUp eliqauto-sell-process" data-wow-delay="0.1s">
		<div class="flex justify-center mb-40"><h2>Как работи</h2></div>
		<div class="sell-your-car-box-wrapper">
			${auxeroSellSteps
				.map(
					(step, index) => `<div class="sell-your-car-box ${index === 1 ? 'active-step' : ''}">
						<p class="number">${index + 1}</p>
						<a href="/sell-your-car" class="h4 font-weight-600 mb-8">${escapeHtml(step.title)}</a>
						<p class="text-secondary text-center">${escapeHtml(step.text)}</p>
					</div>`
				)
				.join('\n')}
		</div>
	</div>
</section>
<section class="py-100 background-light">
	<div class="container">
		<div class="why-choose-us style2 style3">
			<div class="wow fadeIn" data-wow-delay="0.1s">
				<img class="move5" src="/assets/eliqauto/cta/sell-car-banner-v2.webp" alt="Продай автомобила си с Eliqauto">
			</div>
			<div class="wow fadeIn" data-wow-delay="0.2s">
				<h2 class="mb-12">Защо Eliqauto?</h2>
				<p class="text-muted mb-20">Екипът държи решенията за клиентски автомобили върху документи, състояние, пазарна позиция и реалистичен срок.</p>
				${checkList([
					'Преглед според VIN, снимки, сервизна история и документи',
					'Директна оферта, съдействие или клиентска обява при подходящ случай',
					'Прозрачни следващи стъпки преди оглед или публикуване',
					'Локално съдействие от първа заявка до предаване'
				])}
				<a href="/inventory" class="btn btn-primary btn-large font-weight-600 max-w-min">Виж наличните</a>
			</div>
		</div>
		${statsGrid()}
	</div>
</section>
${contactCtaSection()}
<section class="background-light py-100">
	<div class="container">
		<h2 class="mb-40 text-center">Въпроси за продажба</h2>
		<div class="max-width-850 mx-auto w-full">${faqAccordion(
			supportFaqs.filter((faq) => ['Selling', 'Viewing', 'Documents', 'Costs'].includes(faq.topic)),
			true
		)}</div>
	</div>
</section>`;

	return replaceBodyAfterBreadcrumb(html, body);
};

const applyServicesData = (html: string) => {
	const body = `<div data-eliqauto-services><section class="bg-white pb-100">
	<div class="container">
		<h1 class="h2">Услуги</h1>
		<div class="tf-spacing-style3"></div>
		<div class="grid grid-cols-2 xl-grid-cols-2 lg-grid-cols-1 gap-30">
			<div class="flex justify-center flex-col wow fadeInUp">
				<h2 class="mb-12 capitalize">Услуги от Eliqauto</h2>
				<p class="mb-40 h7 line-height-28 text-secondary">Съдействие за внос и лизинг 100%, проверка на обяви, документи, подготовка за регистрация, клиентски автомобили и огледи с уговорка.</p>
				<p class="h4 mb-20 capitalize">Какво включват услугите</p>
				<ul class="grid grid-cols-2 sm-grid-cols-1 gap-x-60 gap-y-8 mb-40">
					${[
						'Подбор на премиум автомобили',
						'Проверка на VIN и история',
						'Carfax и контекст на документите',
						'Координация на транспорт',
						'Съдействие за мито и ДДС',
						'Подготовка за регистрация',
						'Преглед при продажба на клиентски автомобил',
						'Огледи с уговорка',
						'Сравнение на модели',
						'Съдействие при предаване'
					]
						.map(
							(item) => `<li class="flex items-start gap-8">
								<img src="/assets/icons/check.svg" alt="check">
								<div><p>${escapeHtml(item)}</p></div>
							</li>`
						)
						.join('\n')}
				</ul>
				<div class="flex"><a href="/contact" class="btn btn-primary btn-large-3 font-weight-600">Свържи се с Eliqauto</a></div>
			</div>
			<div class="ml-24 flex lg-ml-0 wow fadeInUp radius-20 overflow-hidden">
				<img class="w-full" src="/assets/eliqauto/services/import-canada-banner-generated.webp" alt="Eliqauto services">
			</div>
		</div>
	</div>
</section>
<section class="background-light py-100">
	<div class="container">
		<h2 class="text-center capitalize mb-12">Основни услуги</h2>
		<p class="mb-40 text-center">Запази покупката, вноса или продажбата практични още от първото съобщение.</p>
		<div class="grid grid-cols-3 lg-grid-cols-2 md-grid-cols-1 gap-30">
			${auxeroServiceCards.map(serviceCard).join('\n')}
		</div>
	</div>
</section>
<section class="relative py-100">
	<div class="overlay-parallax"></div>
	<div class="overlay image">
		<img class="lazyload parallax" data-src="/assets/eliqauto/proof-studio-import-handoff.webp" src="/assets/eliqauto/proof-studio-import-handoff.webp" alt="Eliqauto service support">
	</div>
	<div class="container relative index-10">
		<div class="grid grid-cols-2 lg-grid-cols-1 gap-30">
			<div class="services-center-info">
				<h2 class="mb-12 text-white">Контакт за услуга</h2>
				<p class="mb-28 text-white h7 line-height-28 font-weight-500">Изпрати линк към автомобил, VIN, бюджет, срок или заявка за продажба и правилният консултант ще подготви следващата стъпка.</p>
				${checkList(
					[
						'Специалисти по внос и документи',
						'Огледи с предварителна уговорка',
						'Ясни ориентировъчни разходи преди ангажимент',
						'Съдействие от заявка до предаване'
					],
					true
				)}
				<div class="divider-vertical-style4 mb-40"></div>
				<ul class="grid grid-cols-2 lg-grid-cols-1 gap-12">
					<li class="contact gap-12">
						<div class="icon"><img src="/assets/icons/PhoneCall-2.svg" alt="phone"></div>
						<div class="flex flex-col gap-4">
							<p class="text-sm text-muted">Контакт с Eliqauto</p>
							<a href="${eliqautoContact.primaryPhoneHref}" class="text-sm text-white">${escapeHtml(eliqautoContact.primaryPhoneLabel)}</a>
							${secondaryPhoneLink}
						</div>
					</li>
					<li class="contact gap-12">
						<div class="icon"><img src="/assets/icons/Alarm.svg" alt="hours"></div>
						<div class="flex flex-col gap-4">
							<p class="text-sm text-muted">Работно време</p>
							<span class="text-sm text-white">${escapeHtml(eliqautoContact.appointmentNote)}</span>
							<span class="text-sm text-white">${escapeHtml(eliqautoContact.addressLabel)}</span>
						</div>
					</li>
				</ul>
			</div>
			<div class="bg-white radius-20 services-center-form">
				<p class="h4 mb-16">Заяви услуга</p>
				<form action="#" class="send-inquiry eliqauto-service-form" novalidate>
					<div class="grid grid-cols-2 lg-grid-cols-1 gap-x-12 gap-y-24 mb-22">
						<div><p class="mb-8">Име</p><input class="active input-large" name="name" type="text" placeholder="Вашето име" required></div>
						<div><p class="mb-8">Имейл</p><input class="input-large" name="email" type="email" placeholder="Вашият имейл" required></div>
						<div><p class="mb-8">Телефон</p><input class="input-large" name="phone" type="tel" placeholder="Вашият телефон"></div>
						<div><p class="mb-8">Предпочитана дата</p><input class="input-large" name="date" aria-label="Предпочитана дата" type="date"></div>
						<div>
							<p class="mb-8">Услуга</p>
							<select class="select-style-2" name="service">
								${auxeroServiceCards.map((service) => `<option>${escapeHtml(service.title)}</option>`).join('\n')}
							</select>
						</div>
						<div><p class="mb-8">Автомобил или VIN</p><input class="input-large" name="vehicle" type="text" placeholder="Линк към автомобил или VIN"></div>
					</div>
					<button class="btn btn-primary btn-large font-weight-600 w-full">Изпрати заявка</button>
					<p class="auxero-form-status text-highlight font-weight-600 mt-12" aria-live="polite"></p>
				</form>
			</div>
		</div>
	</div>
</section>`;
	const chrome = html
		.replaceAll('<a href="/">Home</a>', '<a href="/">Начало</a>')
		.replaceAll('<span>Pages</span>', '<span>Раздели</span>')
		.replaceAll('<span>Services</span>', '<span>Услуги</span>')
		.replaceAll('WHAT ARE YOU LOOKING FOR?', 'Какво търсите?')
		.replace(
			/(<a href="#" class="btn btn-line btn-large font-weight-600 bg-sign-in open-modal"[\s\S]*?<\/svg>\s*)Sign In(\s*<\/a>)/,
			'$1Вход$2'
		);

	return replaceBodyAfterBreadcrumb(chrome, body);
};

const applyAboutData = (html: string) => {
	const body = `<div data-eliqauto-about><section class="pb-100">
	<div class="container">
		<h1 class="h2">${escapeHtml(auxeroAboutContent.intro.title)}</h1>
		<div class="tf-spacing-style3"></div>
		<div class="row">
			<div class="col-lg-6">
				<div class="about-box">
					<img class="main-img radius-16 wow fadeIn" data-wow-delay="0.1s" src="${escapeHtml(auxeroAboutContent.assets.hero)}" alt="${escapeHtml(auxeroAboutContent.intro.mainImageAlt)}">
					<div class="sub-img wow fadeInUp" data-wow-delay="0.2s"><img src="${escapeHtml(auxeroAboutContent.intro.subImage)}" alt="${escapeHtml(auxeroAboutContent.intro.subImageAlt)}"></div>
				</div>
			</div>
			<div class="col-lg-6">
				<div class="about-content">
					<h2 class="font-weight-600 mb-20">${escapeHtml(auxeroAboutContent.intro.heading)}</h2>
					<p class="text-secondary h7 line-height-28 mb-32">${escapeHtml(auxeroAboutContent.intro.description)}</p>
					<ul class="flex flex-col gap-24 mb-32">
						${auxeroAboutContent.intro.checklist
							.map(
								(item) => `<li class="flex gap-4">
									<img class="w-24 h-24" src="/assets/icons/check.svg" alt="check">
									<p class="h5">${escapeHtml(item)}</p>
								</li>`
							)
							.join('\n')}
					</ul>
					<div class="flex gap-28 items-center">
						<a href="/contact" class="btn btn-primary btn-large font-weight-600">Свържи се с Eliqauto</a>
						<a href="${auxeroAboutContent.contact.primaryPhoneHref}" class="flex gap-16">
							<img src="/assets/icons/PhoneCall-3.svg" alt="PhoneCall">
							<div class="mt2"><span class="text-sm text-secondary">Имаш въпрос?</span><p class="h4">${escapeHtml(auxeroAboutContent.contact.primaryPhoneLabel)}</p></div>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="tf-spacing-style5"></div>
	<section>
		<div class="container wow fadeIn" data-wow-delay="0.3s">
			<div class="title-section mb-40">
				<h2>Отзиви от клиенти</h2>
				<a href="/reviews" class="btn btn-line-style-2 effect-line-primary hover-fill-white btn-large">Виж всички</a>
			</div>
			<div class="swiper-container swiper-testimonior">
				<div class="swiper-wrapper">
					${auxeroReviewCards
						.slice(0, 4)
						.map((review) => `<div class="swiper-slide">${reviewCard(review)}</div>`)
						.join('\n')}
				</div>
				<div class="swiper-pagination pagination-dark pagination-style pagination-swiper-testimonior mt-35"></div>
			</div>
		</div>
	</section>
</section>
<section class="py-100 background-light">
		<div class="container">
			<div class="why-choose-us style2 style3">
			<div class="wow fadeIn" data-wow-delay="0.1s"><img class="move5" src="${escapeHtml(auxeroAboutContent.why.image)}" alt="${escapeHtml(auxeroAboutContent.why.imageAlt)}"></div>
			<div class="wow fadeIn" data-wow-delay="0.2s">
				<h2 class="mb-12">${escapeHtml(auxeroAboutContent.why.heading)}</h2>
				<p class="text-muted mb-20">${escapeHtml(auxeroAboutContent.why.description)}</p>
				${checkList(auxeroAboutContent.why.checklist)}
				<a href="/services" class="btn btn-primary btn-large font-weight-600 max-w-min">Виж услугите</a>
			</div>
		</div>
		${statsGrid()}
	</div>
</section>
<div class="tf-spacing"></div>
<section>
	<h2 class="mb-40 text-center">Екипът зад процеса</h2>
	<div class="container">${consultantGrid()}</div>
</section>`;

	return replaceBodyAfterBreadcrumb(html, body);
};

const applyReviewsData = (html: string) => {
	const body = `<section class="pb-100" data-eliqauto-reviews-page>
	<div class="container">
		<h1 class="h2">Отзиви от клиенти</h1>
		<div class="tf-spacing-style3"></div>
		${reviewsGrid()}
		<ul class="pagination justify-center">
			<li><a href="/reviews" class="pagination__link active">1</a></li>
			<li><a href="${escapeHtml(eliqautoContact.reviewsHref)}" class="pagination__link" target="_blank" rel="noreferrer">Facebook</a></li>
		</ul>
	</div>
</section>`;

	return replaceBodyAfterBreadcrumb(html, body);
};

const applyFaqData = (html: string) => {
	const body = `<section class="bg-white pb-84" data-eliqauto-faqs>
	<div class="container mb-60">
		<h1 class="h2">Често задавани въпроси</h1>
		<div class="tf-spacing-style3"></div>
		<p class="h3 mb-20 text-center capitalize">Eliqauto помощ</p>
		<div class="max-width-850 mx-auto w-full">${faqAccordion(supportFaqs.slice(0, 3), true)}</div>
	</div>
	${auxeroFaqGroups
		.map(
			(group) => `<div class="container mb-60">
				<p class="h3 mb-20 text-center capitalize">${escapeHtml(group.title)}</p>
				<div class="max-width-850 mx-auto w-full">${faqAccordion(group.items, true)}</div>
			</div>`
		)
		.join('\n')}
</section>`;

	return replaceBodyAfterBreadcrumb(html, body);
};

const applyTermsData = (html: string) => {
	const nav = auxeroTermsSections
		.map(
			(section) => `<li><a href="#${escapeHtml(section.id)}">${escapeHtml(section.title)}</a></li>`
		)
		.join('\n');
	const sections = auxeroTermsSections
		.map(
			(section) => `<div class="section" id="${escapeHtml(section.id)}">
				<p class="h4 mb-12 capitalize">${escapeHtml(section.title)}</p>
				${section.body
					.map((paragraph) => `<p class="text-body-style-2 mb-12">${sentence(paragraph)}</p>`)
					.join('\n')}
			</div>`
		)
		.join('\n');
	const body = `<section class="bg-white pb-100" data-eliqauto-terms-page>
	<div class="container">
		<h1 class="h2 capitalize">Условия за използване на Eliqauto</h1>
		<div class="tf-spacing-style3"></div>
		<div class="term-page" id="scrollContainer" data-eliqauto-terms>
			<div class="term-page--nav-container">
				<ul class="term-page--nav" id="sidebarSticky">${nav}</ul>
			</div>
			<div class="content">${sections}</div>
		</div>
	</div>
</section>`;

	return replaceBodyAfterBreadcrumb(html, body);
};

const calculatorField = (field: AuxeroCalculatorField) =>
	`<div><p class="mb-8">${escapeHtml(field.label)}${field.mutedLabel ? ` <span class="text-muted">${escapeHtml(field.mutedLabel)}</span>` : ''}</p><input class="${field.active ? 'active ' : ''}input-large" name="${escapeHtml(field.name)}" aria-label="${escapeHtml(field.label)}" type="number" value="${field.value}" min="${field.min}" step="${field.step}" data-eliqauto-calc-input="${escapeHtml(field.key)}"></div>`;

const applyCalculatorData = (html: string) => {
	const calculator = auxeroCalculatorData;
	const budgetLinks = [
		['Налични автомобили', 'До 20k EUR', 'highest-price'],
		['Внос и лизинг', 'До 30k EUR', 'best-match'],
		['Клиентски автомобили', 'До 40k EUR', 'newest-listed'],
		['SUV кандидати', 'До 60k EUR', 'newest-year'],
		['Премиум автомобили', 'Над 60k EUR', 'highest-price']
	];
	const body = `<div data-eliqauto-calculator-page>
<section class="pb-100">
	<div class="tf-spacing-style3"></div>
	<div class="container">
		<h1 class="h2 text-center mb-12">Калкулатор за внос</h1>
		<p class="mb-40 text-center text-secondary h7 line-height-28">Изчисли ориентировъчна крайна цена за автомобил с проверена история преди точна разбивка от Eliqauto.</p>
		<div class="grid grid-cols-2 gap-40 lg-grid-cols-1" data-eliqauto-calculator>
			<div class="border-box">
				<p class="h3 mb-28">Изчисли ориентировъчна крайна цена</p>
				<form action="#" class="calculate-form" novalidate>
					<div class="grid grid-cols-1 gap-15">
						${calculator.fields.map(calculatorField).join('\n')}
					</div>
				</form>
			</div>
			<div class="border-box">
				<p class="h3 mb-8">${escapeHtml(calculator.title)}</p>
				<p class="mb-10"><span class="text-56 font-weight-600" data-eliqauto-calc-output="total">${formatEur(calculator.total)}</span></p>
				<p class="h5 mb-28 capitalize">${escapeHtml(calculator.totalNote)}</p>
				<div class="divider mb-28 w-full"></div>
				<p class="h4 mb-20">${escapeHtml(calculator.subtitle)}</p>
				<div class="flex flex-col gap-18 mb-28">
					${calculator.summaryRows
						.map(
							(row) =>
								`<p class="flex justify-between gap-8"><span class="h7 text-secondary">${escapeHtml(row.label)}</span><span class="h7" data-eliqauto-calc-output="${escapeHtml(row.key)}">${formatEur(row.value)}</span></p>`
						)
						.join('\n')}
				</div>
				<div class="divider mb-28 w-full"></div>
				<div class="flex justify-between gap-8 mb-16"><p class="h4">Ориентировъчно общо</p><p class="h4" data-eliqauto-calc-output="totalSmall">${formatEur(calculator.total)}</p></div>
				<a href="${escapeHtml(calculator.ctaHref)}" class="btn btn-primary btn-large font-weight-600 w-full">${escapeHtml(calculator.ctaLabel)}</a>
			</div>
		</div>
	</div>
	<div class="tf-spacing"></div>
	<h2 class="text-center mb-40 capitalize">Разгледай по бюджет</h2>
	<div class="container">
		<div class="grid grid-cols-5 lg-grid-cols-3 md-grid-cols-2 smb-grid-cols-1 gap-20 mb-40 padding-box-20">
			${budgetLinks
				.map(
					([label, price, sort]) => `<div class="price-box">
						<a href="/inventory?sort=${escapeHtml(sort)}" class="h7 font-weight-500 mb-8 text-underline">${escapeHtml(label)}</a>
						<p class="h4">${escapeHtml(price)}</p>
					</div>`
				)
				.join('\n')}
		</div>
		<div class="flex justify-center"><a href="/inventory" class="btn btn-line-hover effect-line-primary btn-large font-weight-600 hover-fill-white">Виж наличните</a></div>
	</div>
</section>
<section class="background-light py-100">
	<div class="container">
		<h2 class="mb-40 text-center">Въпроси за калкулатора</h2>
		<div class="max-width-930 mx-auto w-full">${faqAccordion(
			supportFaqs.filter((faq) => ['Costs', 'Documents', 'Timing'].includes(faq.topic)),
			true
		)}</div>
	</div>
</section>
</div>`;

	return replaceBodyAfterBreadcrumb(html, body);
};

const blogCard = (
	post: BlogPost
) => `<a href="/blog/${escapeHtml(post.slug)}" class="post-style-6 eliqauto-no-image-zoom overflow-hidden">
	<div class="image"><img class="post--img flex" src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}"></div>
	<div class="content">
		<div class="flex gap-12 justify-start mb-12">
			<span class="text-sm">от Eliqauto</span>
			<span class="text-sm">${escapeHtml(post.date)}</span>
			<span class="text-sm text-highlight uppercase text-underline">${escapeHtml(post.category)}</span>
		</div>
		<p class="h4 title mb-12">${escapeHtml(post.title)}</p>
		<p class="clamp clamp-2 text-secondary">${escapeHtml(post.excerpt)}</p>
	</div>
</a>`;

const applyBlogListData = (html: string) => {
	const posts = listBlogPosts();
	const body = `<section class="pb-100" data-eliqauto-blog-page>
	<div class="container"><h1 class="h2">Съвети от Eliqauto</h1></div>
	<div class="tf-spacing-style3"></div>
	<div class="container">
		<div class="grid grid-cols-3 md-grid-cols-1 gap-y-40 gap-x-30 mb-40" data-eliqauto-blog-grid>
			${posts.map(blogCard).join('\n')}
		</div>
	</div>
</section>`;

	return replaceBodyAfterBreadcrumb(html, body);
};

const applyBlogDetailData = (html: string, options: AuxeroRenderOptions = {}) => {
	const slug = options.routePath?.split('/').filter(Boolean).pop();
	const detailState = getBlogDetailOrFallback(slug);

	if (!detailState) return html;

	const { post, related } = detailState;
	const firstRelated = related[0] ?? post;
	const secondRelated = related[1] ?? post;
	const body = `<div data-eliqauto-blog-detail-page><section class="blog-details-banner">
	<img class="overlay-image" src="/assets/images/blog/overlay-blogdetails.webp" alt="blog-details-banner">
	<div class="breadcrumb-wrapper">
		<div class="container">
			<ul class="breadcrumb">
				<li><a class="text-white" href="/">Начало</a></li>
				<li><img src="/assets/icons/right.svg" alt="chevron-right"></li>
				<li><a class="text-white" href="/blog">Съвети</a></li>
				<li><img src="/assets/icons/right.svg" alt="chevron-right"></li>
				<li><span class="text-muted">${escapeHtml(post.title)}</span></li>
			</ul>
		</div>
	</div>
	<div class="image flex"><img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}"></div>
	<div class="content">
		<div class="container">
			<h1 class="mb-20 text-white letter-spacing-1">${escapeHtml(post.title)}</h1>
			<ul class="flex items-center flex-wrap gap-20">
				<li><a class="text-white" href="/agents">от Eliqauto</a></li>
				<li><a class="text-white" href="/blog">${escapeHtml(post.date)}</a></li>
				<li><a class="uppercase text-underline text-highlight" href="/blog">${escapeHtml(post.category)}</a></li>
			</ul>
		</div>
	</div>
</section>
<section>
	<div class="tf-spacing"></div>
	<div class="container innerpage-container">
		<div class="innerpage__content md-mb-30">
			<img class="post--img radius-20 flex mb-40" src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}">
			${post.content
				.map((paragraph, index) =>
					index === 1
						? `<div class="quote mb-28">
							<div class="content">
								<p class="h4 mb-14 capitalize">"Доброто решение за внос започва с документи, снимки, история и ясна следваща стъпка."</p>
								<p class="h7 flex items-center gap-8"><img src="/assets/icons/line.svg" alt="quote">Eliqauto</p>
							</div>
							<img class="icon-quote" src="/assets/icons/quote.svg" alt="quote">
						</div><p class="text-secondary mb-40 h7 line-height-28">${sentence(paragraph)}</p>`
						: `<p class="h7 text-secondary mb-28 line-height-28">${sentence(paragraph)}</p>`
				)
				.join('\n')}
			<p class="h4 mb-12 capitalize">Следваща стъпка</p>
			<p class="text-secondary h7 line-height-28 mb-40">Изпрати точен линк, VIN, бюджет или заявка за продажба, за да прегледаме реалния случай вместо обща оценка.</p>
			<div class="flex justify-between mb-40 gap-16 md-flex-col">
				<ul class="blog-detail-tags flex gap-12">
					<li><p>Таг:</p></li>
					<li><a href="/blog">${escapeHtml(post.category)}</a></li>
					<li><a href="/services">Eliqauto</a></li>
				</ul>
				<ul class="blog-detail-social flex gap-12">
					<li><p>Сподели:</p></li>
					<li><a href="${escapeHtml(eliqautoContact.facebookHref)}">Facebook</a></li>
				</ul>
			</div>
			<div class="divider mb-26"></div>
			<div class="flex justify-between mb-24 blog-detail-recentpost">
				<div class="previous">
					<p class="font-weight-600 text-highlight uppercase mb-4">Предишна</p>
					<a href="/blog/${escapeHtml(firstRelated.slug)}" class="h5 font-weight-500 capitalize">${escapeHtml(firstRelated.title)}</a>
				</div>
				<div class="next">
					<p class="font-weight-600 text-highlight uppercase mb-4 text-right">Следваща</p>
					<a href="/blog/${escapeHtml(secondRelated.slug)}" class="h5 font-weight-500 text-right capitalize">${escapeHtml(secondRelated.title)}</a>
				</div>
			</div>
			<div class="divider mb-40"></div>
			<form action="#" class="blog-detail-comment-form eliqauto-blog-comment-form" novalidate>
				<p class="h3 mb-24 capitalize">Изпрати коментар</p>
				<div class="grid grid-cols-2 gap-22 mb-16 md-grid-cols-1">
					<div class="md-col-span-2"><p class="mb-8">Име</p><input class="active input-large" name="name-review" type="text" placeholder="Вашето име" required></div>
					<div class="md-col-span-2"><p class="mb-8">Имейл</p><input class="input-large" name="email-comment" type="email" placeholder="Вашият имейл" required></div>
					<div class="col-span-2 padding-0"><p class="mb-8">Коментар</p><textarea placeholder="Вашият коментар" rows="3" name="comment" class="message" required></textarea></div>
				</div>
				<label class="filter-checkbox style-2 style-3 mb-28"><input type="checkbox" name="save"><span>Запази име и имейл за следващ път</span></label>
				<button class="btn btn-primary-3 btn-large font-weight-600 capitalize">Публикувай коментар</button>
				<p class="auxero-form-status text-highlight font-weight-600 mt-12" aria-live="polite"></p>
			</form>
		</div>
		<div class="innerpage__sidebar">
			<form action="/blog" class="widget-search w-full mb-34">
				<input class="input-normal" type="text" name="q" placeholder="Търси в съветите на Eliqauto">
				<button type="submit" class="widget-search-btn"><img src="/assets/icons/search.svg" alt="Search"></button>
			</form>
			<div class="mb-32">
				<div class="listing-details--contact-dealer style-3 mb-20">
					<img src="${escapeHtml(agents[1]?.image ?? eliqautoConsultants[1].image)}" alt="Eliqauto consultant">
					<div class="content"><a href="/agents/eliqauto-import" class="h4 mb-8 font-weight-600">Внос и лизинг</a><p class="text-secondary">Подбор, транспорт и крайни разходи</p></div>
				</div>
				<p class="mb-16">Изпрати VIN, линк към обява, бюджет или срок и Eliqauto ще прегледа конкретния случай.</p>
			</div>
			<div class="divider mb-32 w-full"></div>
			<p class="h4 mb-16 capitalize">Последни публикации</p>
			<div class="mb-32">
				${related
					.map(
						(
							item
						) => `<a href="/blog/${escapeHtml(item.slug)}" class="recent-post overflow-hidden mb-16">
							<div class="image"><img class="post--img flex" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}"></div>
							<div class="content">
								<div class="flex gap-12 md-gap-6 justify-start mb-6"><span class="text-xs">от Eliqauto</span><span class="text-xs">${escapeHtml(item.date)}</span></div>
								<p class="title h7">${escapeHtml(item.title)}</p>
							</div>
						</a><div class="divider mb-16 w-full"></div>`
					)
					.join('\n')}
			</div>
			<div class="divider mb-32 w-full"></div>
			<p class="h4 mb-18">Абонамент за новини</p>
			<form action="#" class="widget-search w-full mb-34 eliqauto-newsletter-form" novalidate>
				<input class="input-normal" type="email" name="email" placeholder="Имейл адрес" required>
				<button type="submit" class="widget-search-btn"><img src="/assets/icons/right.svg" alt="Subscribe"></button>
				<p class="auxero-form-status text-highlight font-weight-600 mt-12" aria-live="polite"></p>
			</form>
		</div>
	</div>
</section>
<section class="py-100">
	<div class="container">
		<h2 class="mb-40">Свързани публикации</h2>
		<div class="grid grid-cols-3 md-grid-cols-1 gap-y-40 gap-x-30">${related.map(blogCard).join('\n')}</div>
	</div>
</section></div>`;

	return replaceFromFirstSection(html, body);
};

export const isSupportTemplate = (templateFile: string) => supportTemplates.has(templateFile);

export const applySupportTemplateData = (
	html: string,
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => {
	if (templateFile === 'sell-your-car.html') return applySellYourCarData(html);
	if (templateFile === 'services-center.html') return applyServicesData(html);
	if (templateFile === 'about-us.html') return applyAboutData(html);
	if (templateFile === 'clients-reviews.html') return applyReviewsData(html);
	if (templateFile === 'faqs.html') return applyFaqData(html);
	if (templateFile === 'terms.html') return applyTermsData(html);
	if (templateFile === 'calculator.html') return applyCalculatorData(html);
	if (templateFile === 'blog-grid-style-1.html') return applyBlogListData(html);
	if (templateFile === 'blog-details-1.html') return applyBlogDetailData(html, options);

	return html;
};
