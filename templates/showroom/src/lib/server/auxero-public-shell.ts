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
	bg: 'Eliqauto — автомобили с проверена история и сертифициран внос и лизинг 100%. Прозрачни цени, оглед и съдействие при регистрация в Пазарджик.',
	en: 'Eliqauto — quality used cars with a verified history and certified import support. Transparent pricing, inspections and registration support in Pazardzhik, Bulgaria.'
};

// Per-route SEO descriptions keyed by the header activePath. Falls back to the generic
// Eliqauto description so every shell route ships a meta description (previously only the
// homepage had one). Dynamic routes (PDP, blog/agent details) pass a specific override.
const shellDescriptions: Record<string, Record<Locale, string>> = {
	'/inventory': {
		bg: 'Разгледай наличните автомобили на Eliqauto — провери цена, пробег, оборудване и история. Внос и лизинг и съдействие при регистрация.',
		en: 'Browse Eliqauto inventory — check price, mileage, equipment and history. Import & leasing and registration support.'
	},
	'/compare': {
		bg: 'Сравни до 4 автомобила едно до друго — цена, пробег, година и оборудване — за да избереш по-лесно с Eliqauto.',
		en: 'Compare up to 4 cars side by side — price, mileage, year and equipment — to choose with confidence at Eliqauto.'
	},
	'/financing': {
		bg: 'Финансиране на автомобил с ясна месечна вноска преди оглед. Изчисли вноската и заяви оферта от Eliqauto.',
		en: 'Car financing with a clear monthly payment before viewing. Estimate the instalment and request an offer from Eliqauto.'
	},
	'/calculator': {
		bg: 'Калкулатор за внос и лизинг 100% — изчисли ориентировъчната крайна цена с транспорт, мита и регистрация.',
		en: 'Import & leasing calculator — estimate the final price including transport, duties and registration.'
	},
	'/sell-your-car': {
		bg: 'Продай автомобила си с Eliqauto — изпрати VIN, пробег и телефон и получи реална оферта за изкупуване или съдействие при продажба.',
		en: 'Sell your car with Eliqauto — send VIN, mileage and phone for a real buy-out offer or sale support.'
	},
	'/services': {
		bg: 'Услугите на Eliqauto — внос и лизинг 100%, проверка на история и състояние, изкупуване и съдействие при регистрация.',
		en: 'Eliqauto services — Import & leasing, history and condition checks, buy-out and registration support.'
	},
	'/agents': {
		bg: 'Запознай се с консултантите на Eliqauto — екипът, който ти помага при избор, внос и регистрация на автомобил.',
		en: 'Meet the Eliqauto consultants — the team that helps you choose, import and register a car.'
	},
	'/blog': {
		bg: 'Съвети от Eliqauto за купуване, внос и поддръжка на автомобил — проверки, регистрация и реални практики.',
		en: 'Eliqauto notes on buying, importing and maintaining a car — checks, registration and real-world tips.'
	},
	'/reviews': {
		bg: 'Мнения на клиенти на Eliqauto — реални отзиви за внос и лизинг 100%, изкупуване и обслужване.',
		en: 'Eliqauto customer reviews — real feedback on Import & leasing, buy-outs and service.'
	},
	'/about': {
		bg: 'За Eliqauto — екип за внос и продажба на премиум автомобили с проверена история и прозрачни цени в Пазарджик.',
		en: 'About Eliqauto — a team importing and selling cars with verified history and transparent pricing in Pazardzhik.'
	},
	'/contact': {
		bg: 'Свържи се с Eliqauto — телефон, имейл и локация в Пазарджик. Заяви консултация за внос или избор на автомобил.',
		en: 'Contact Eliqauto — phone, email and Pazardzhik location. Request a consultation for import or choosing a car.'
	},
	'/faqs': {
		bg: 'Често задавани въпроси за Eliqauto — внос и лизинг 100%, цени, документи, регистрация и гаранции.',
		en: 'Eliqauto frequently asked questions — Import & leasing, pricing, documents, registration and guarantees.'
	},
	'/terms': {
		bg: 'Общи условия на Eliqauto — правила за ползване на сайта и услугите.',
		en: 'Eliqauto terms and conditions — rules for using the site and services.'
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
