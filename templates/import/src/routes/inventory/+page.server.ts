import type { PageServerLoad } from './$types';
import { inventoryCardsFromVehicles } from '$lib/auxero/inventory';
import { inventoryDesktopDataFromState } from '$lib/auxero/inventory-desktop';
import { inventoryMobileDataFromState } from '$lib/auxero/inventory-mobile';
import {
	ensureDescriptionMeta,
	parseAuxeroHeadAssets,
	type AuxeroPageDocument
} from '$lib/auxero/page-document';
import { getMessages, resolveLocale } from '$lib/i18n/messages';
import {
	constrainInventoryViewForLayout,
	defaultInventoryViewForLayout,
	getInventoryState,
	inventoryTemplateForView,
	resolveInventoryLayout,
	resolveInventoryView
} from '$lib/server/inventory-state';
import {
	homeFiveFooterDataForLocale,
	homeFiveHeaderDataForLocale,
	homeFiveModalsDataFromVehicles
} from '$lib/auxero/home-five';
import { vehicles } from '$lib/data/vehicles';

const inventoryScopeBodyClass = 'daynight-inventory-template';
const mergeBodyClasses = (...classNames: string[]) =>
	Array.from(
		new Set(classNames.flatMap((className) => className.trim().split(/\s+/)).filter(Boolean))
	).join(' ');

const templateBodyClass = (templateFile: string) =>
	mergeBodyClasses(
		'inner-page',
		templateFile === 'listing-gridstyle-halfmap.html' ? 'halfmap' : '',
		`auxero-template-${templateFile.replace(/[^a-z0-9]/gi, '-')}`
	);

const inventoryPageDocument = (templateFile: string, title: string): AuxeroPageDocument => {
	const headHtml = `<title>${title}</title>`;

	return {
		bodyClass: mergeBodyClasses(templateBodyClass(templateFile), inventoryScopeBodyClass),
		bodyHtml: '',
		headAssets: parseAuxeroHeadAssets(headHtml),
		headHtml
	};
};

export const load: PageServerLoad = ({ request, url }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
	const copy = getMessages(locale).inventory;
	const layout = resolveInventoryLayout(url.searchParams);
	const explicitView = url.searchParams.get('view');
	const requestedView = explicitView
		? resolveInventoryView(explicitView)
		: defaultInventoryViewForLayout(layout);
	const view = constrainInventoryViewForLayout(layout, requestedView);
	const templateFile = inventoryTemplateForView(view);
	const renderOptions = {
		request,
		routePath: 'inventory',
		searchParams: url.searchParams,
		view
	};
	const seoTitle = locale === 'bg' ? 'Автомобили — Day Night Auto' : 'Cars — Day Night Auto';
	const pageDocument = inventoryPageDocument(templateFile, seoTitle);
	pageDocument.headAssets = ensureDescriptionMeta(
		pageDocument.headAssets,
		locale === 'bg'
			? 'Разгледай наличните автомобили на Day Night Auto — филтрирай по марка, тип, цена и пробег. Подбрани автомобили и съдействие при регистрация.'
			: 'Browse Day Night Auto inventory — filter by brand, type, price and mileage. Europe import and registration support.'
	);
	const inventoryState = getInventoryState(templateFile, renderOptions);

	return {
		auxeroFullPage: true,
		cards: inventoryCardsFromVehicles(inventoryState.selected, locale),
		copy,
		desktop: inventoryDesktopDataFromState(inventoryState, locale),
		mobile: inventoryMobileDataFromState(inventoryState, locale),
		pageDocument,
		seoTitle,
		shellCopy: getMessages(locale).home,
		shellFooter: homeFiveFooterDataForLocale(locale),
		shellHeader: homeFiveHeaderDataForLocale(locale, '/inventory'),
		shellModals: homeFiveModalsDataFromVehicles(vehicles, locale),
		view: inventoryState.view
	};
};
