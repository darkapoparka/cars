import { ensureDescriptionMeta, type AuxeroPageDocument } from '$lib/auxero/page-document';
import {
	homeFiveFooterDataForLocale,
	homeFiveHeaderDataForLocale,
	homeFiveModalsDataFromVehicles
} from '$lib/auxero/home-five';
import { vehicles } from '$lib/data/vehicles';
import { getMessages, type Locale } from '$lib/i18n/messages';
import { extractAuxeroRuntimeHtml } from './auxero-page';

const genericDescription: Record<Locale, string> = {
	bg: 'ЦЕНТРАЛ АВТОСАЛОН — автомобили с проверена история и сертифициран подбор на автомобили. Прозрачни цени, оглед и съдействие при регистрация в Пловдив.',
	en: 'ЦЕНТРАЛ АВТОСАЛОН — quality used cars with a verified history and certified import from Europe. Transparent pricing, inspections and registration support in Plovdiv, Bulgaria.'
};

// Per-route SEO descriptions keyed by the header activePath. Falls back to the generic
// ЦЕНТРАЛ АВТОСАЛОН description so every shell route ships a meta description (previously only the
// homepage had one). Dynamic routes (PDP, blog/agent details) pass a specific override.
const shellDescriptions: Record<string, Record<Locale, string>> = {
	'/inventory': {
		bg: 'Разгледай наличните автомобили на ЦЕНТРАЛ АВТОСАЛОН — провери цена, пробег, оборудване и история. Подбрани автомобили и съдействие при регистрация.',
		en: 'Browse ЦЕНТРАЛ АВТОСАЛОН inventory — check price, mileage, equipment and history. Europe import and registration support.'
	},
	'/compare': {
		bg: 'Сравни до 4 автомобила едно до друго — цена, пробег, година и оборудване — за да избереш по-лесно с ЦЕНТРАЛ АВТОСАЛОН.',
		en: 'Compare up to 4 cars side by side — price, mileage, year and equipment — to choose with confidence at ЦЕНТРАЛ АВТОСАЛОН.'
	},
	'/financing': {
		bg: 'Финансиране на автомобил с ясна месечна вноска преди оглед. Изчисли вноската и заяви оферта от ЦЕНТРАЛ АВТОСАЛОН.',
		en: 'Car financing with a clear monthly payment before viewing. Estimate the instalment and request an offer from ЦЕНТРАЛ АВТОСАЛОН.'
	},
	'/calculator': {
		bg: 'Калкулатор за подбор на автомобили — изчисли ориентировъчната крайна цена с транспорт, мита и регистрация.',
		en: 'Europe import calculator — estimate the final price including transport, duties and registration.'
	},
	'/sell-your-car': {
		bg: 'Продай автомобила си с ЦЕНТРАЛ АВТОСАЛОН — изпрати VIN, пробег и телефон и получи реална оферта за изкупуване или съдействие при продажба.',
		en: 'Sell your car with ЦЕНТРАЛ АВТОСАЛОН — send VIN, mileage and phone for a real buy-out offer or sale support.'
	},
	'/services': {
		bg: 'Услугите на ЦЕНТРАЛ АВТОСАЛОН — подбор на автомобили, проверка на история и състояние, изкупуване и съдействие при регистрация.',
		en: 'ЦЕНТРАЛ АВТОСАЛОН services — Europe import, history and condition checks, buy-out and registration support.'
	},
	'/agents': {
		bg: 'Запознай се с консултантите на ЦЕНТРАЛ АВТОСАЛОН — екипът, който ти помага при избор, внос и регистрация на автомобил.',
		en: 'Meet the ЦЕНТРАЛ АВТОСАЛОН consultants — the team that helps you choose, import and register a car.'
	},
	'/blog': {
		bg: 'Съвети от ЦЕНТРАЛ АВТОСАЛОН за купуване, внос и поддръжка на автомобил — проверки, регистрация и реални практики.',
		en: 'ЦЕНТРАЛ АВТОСАЛОН notes on buying, importing and maintaining a car — checks, registration and real-world tips.'
	},
	'/reviews': {
		bg: 'Мнения на клиенти на ЦЕНТРАЛ АВТОСАЛОН — реални отзиви за подбор на автомобили, изкупуване и обслужване.',
		en: 'ЦЕНТРАЛ АВТОСАЛОН customer reviews — real feedback on Europe import, buy-outs and service.'
	},
	'/about': {
		bg: 'За ЦЕНТРАЛ АВТОСАЛОН — екип за внос и продажба на автомобили от Европа с проверена история и прозрачни цени в Пловдив.',
		en: 'About ЦЕНТРАЛ АВТОСАЛОН — a team importing and selling cars from Europe with verified history and transparent pricing in Plovdiv.'
	},
	'/contact': {
		bg: 'Свържи се с ЦЕНТРАЛ АВТОСАЛОН — телефон, имейл и локация в Пловдив. Заяви консултация за внос или избор на автомобил.',
		en: 'Contact ЦЕНТРАЛ АВТОСАЛОН — phone, email and Plovdiv location. Request a consultation for import or choosing a car.'
	},
	'/faqs': {
		bg: 'Често задавани въпроси за ЦЕНТРАЛ АВТОСАЛОН — подбор на автомобили, цени, документи, регистрация и гаранции.',
		en: 'ЦЕНТРАЛ АВТОСАЛОН frequently asked questions — Europe import, pricing, documents, registration and guarantees.'
	},
	'/terms': {
		bg: 'Общи условия на ЦЕНТРАЛ АВТОСАЛОН — правила за ползване на сайта и услугите.',
		en: 'ЦЕНТРАЛ АВТОСАЛОН terms and conditions — rules for using the site and services.'
	}
};

export const auxeroPublicShellData = (
	pageDocument: AuxeroPageDocument,
	locale: Locale,
	activePath: string,
	description?: string
) => {
	const shellRuntimeHtml = extractAuxeroRuntimeHtml(pageDocument.bodyHtml, {
		waitForBodyScripts: false
	});

	// Native public shells render Svelte-owned content, so avoid serializing raw template tails.
	pageDocument.bodyHtml = '';

	// Ensure the page ships a meta description (route-specific override, else per-path, else
	// generic). Idempotent — never clobbers a description already present in the template head.
	pageDocument.headAssets = ensureDescriptionMeta(
		pageDocument.headAssets,
		description ?? shellDescriptions[activePath]?.[locale] ?? genericDescription[locale]
	);

	return {
		shellCopy: getMessages(locale).home,
		shellFooter: homeFiveFooterDataForLocale(locale),
		shellHeader: homeFiveHeaderDataForLocale(locale, activePath),
		shellModals: homeFiveModalsDataFromVehicles(vehicles, locale),
		shellRuntimeHtml
	};
};
