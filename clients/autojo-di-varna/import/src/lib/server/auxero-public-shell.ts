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
	bg: 'АУТО ЖО-ДИ — автомобили с проверена история и сертифициран подбор на автомобили. Прозрачни цени, оглед и съдействие при регистрация в Пловдив.',
	en: 'АУТО ЖО-ДИ — quality used cars with a verified history and certified import from Europe. Transparent pricing, inspections and registration support in Plovdiv, Bulgaria.'
};

// Per-route SEO descriptions keyed by the header activePath. Falls back to the generic
// АУТО ЖО-ДИ description so every shell route ships a meta description (previously only the
// homepage had one). Dynamic routes (PDP, blog/agent details) pass a specific override.
const shellDescriptions: Record<string, Record<Locale, string>> = {
	'/inventory': {
		bg: 'Разгледай наличните автомобили на АУТО ЖО-ДИ — провери цена, пробег, оборудване и история. Подбрани автомобили и съдействие при регистрация.',
		en: 'Browse АУТО ЖО-ДИ inventory — check price, mileage, equipment and history. Europe import and registration support.'
	},
	'/compare': {
		bg: 'Сравни до 4 автомобила едно до друго — цена, пробег, година и оборудване — за да избереш по-лесно с АУТО ЖО-ДИ.',
		en: 'Compare up to 4 cars side by side — price, mileage, year and equipment — to choose with confidence at АУТО ЖО-ДИ.'
	},
	'/financing': {
		bg: 'Финансиране на автомобил с ясна месечна вноска преди оглед. Изчисли вноската и заяви оферта от АУТО ЖО-ДИ.',
		en: 'Car financing with a clear monthly payment before viewing. Estimate the instalment and request an offer from АУТО ЖО-ДИ.'
	},
	'/calculator': {
		bg: 'Калкулатор за подбор на автомобили — изчисли ориентировъчната крайна цена с транспорт, мита и регистрация.',
		en: 'Europe import calculator — estimate the final price including transport, duties and registration.'
	},
	'/sell-your-car': {
		bg: 'Продай автомобила си с АУТО ЖО-ДИ — изпрати VIN, пробег и телефон и получи реална оферта за изкупуване или съдействие при продажба.',
		en: 'Sell your car with АУТО ЖО-ДИ — send VIN, mileage and phone for a real buy-out offer or sale support.'
	},
	'/services': {
		bg: 'Услугите на АУТО ЖО-ДИ — подбор на автомобили, проверка на история и състояние, изкупуване и съдействие при регистрация.',
		en: 'АУТО ЖО-ДИ services — Europe import, history and condition checks, buy-out and registration support.'
	},
	'/agents': {
		bg: 'Запознай се с консултантите на АУТО ЖО-ДИ — екипът, който ти помага при избор, внос и регистрация на автомобил.',
		en: 'Meet the АУТО ЖО-ДИ consultants — the team that helps you choose, import and register a car.'
	},
	'/blog': {
		bg: 'Съвети от АУТО ЖО-ДИ за купуване, внос и поддръжка на автомобил — проверки, регистрация и реални практики.',
		en: 'АУТО ЖО-ДИ notes on buying, importing and maintaining a car — checks, registration and real-world tips.'
	},
	'/reviews': {
		bg: 'Мнения на клиенти на АУТО ЖО-ДИ — реални отзиви за подбор на автомобили, изкупуване и обслужване.',
		en: 'АУТО ЖО-ДИ customer reviews — real feedback on Europe import, buy-outs and service.'
	},
	'/about': {
		bg: 'За АУТО ЖО-ДИ — екип за внос и продажба на автомобили от Европа с проверена история и прозрачни цени в Пловдив.',
		en: 'About АУТО ЖО-ДИ — a team importing and selling cars from Europe with verified history and transparent pricing in Plovdiv.'
	},
	'/contact': {
		bg: 'Свържи се с АУТО ЖО-ДИ — телефон, имейл и локация в Пловдив. Заяви консултация за внос или избор на автомобил.',
		en: 'Contact АУТО ЖО-ДИ — phone, email and Plovdiv location. Request a consultation for import or choosing a car.'
	},
	'/faqs': {
		bg: 'Често задавани въпроси за АУТО ЖО-ДИ — подбор на автомобили, цени, документи, регистрация и гаранции.',
		en: 'АУТО ЖО-ДИ frequently asked questions — Europe import, pricing, documents, registration and guarantees.'
	},
	'/terms': {
		bg: 'Общи условия на АУТО ЖО-ДИ — правила за ползване на сайта и услугите.',
		en: 'АУТО ЖО-ДИ terms and conditions — rules for using the site and services.'
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
