import { describe, expect, it } from 'vitest';
import { renderAuxeroTemplate } from './auxero-template';
import {
	extractAuxeroBodyScriptsHtml,
	extractAuxeroRuntimeHtml,
	renderAuxeroPageDocument,
	renderAuxeroPageSlot,
	removeAuxeroPageDocumentBodyHtml,
	removeAuxeroSlotScriptTags,
	splitAuxeroBodySection,
	splitAuxeroDivBlockByMarker,
	splitAuxeroDocument,
	splitAuxeroElementBlockByMarker
} from './auxero-page';

describe('splitAuxeroDocument', () => {
	it('extracts the Home 05 head, body class, and body markup for Svelte pages', () => {
		const html = renderAuxeroTemplate('home-05.html');
		const document = splitAuxeroDocument(html!);

		expect(document.headHtml).toContain('/assets/app.css');
		expect(document.bodyClass).toContain('auxero-template-home-05-html');
		expect(document.bodyHtml).toContain('Browse, Compare, Drive');
		expect(document.bodyHtml).toContain('search-cars__search');
		expect(document.bodyHtml).not.toContain('<body');
	});

	it('extracts the inline Auxero runtime without swallowing external scripts', () => {
		const html = renderAuxeroTemplate('home-05.html');
		const document = splitAuxeroDocument(html!);
		const bodyScriptsHtml = extractAuxeroBodyScriptsHtml(document.bodyHtml);
		const runtimeHtml = extractAuxeroRuntimeHtml(document.bodyHtml);

		expect(bodyScriptsHtml).toBe('');
		expect(bodyScriptsHtml).not.toContain('window.__ELIQAUTO_RUNTIME__');
		expect(runtimeHtml).toContain("window.addEventListener('eliqauto:svelte-mounted'");
		expect(runtimeHtml).toContain("window.addEventListener('load'");
		expect(runtimeHtml).toContain('window.__ELIQAUTO_RUNTIME__');
		expect(runtimeHtml).toContain("form.matches('.eliqauto-blog-comment-form')");
		expect(runtimeHtml).toContain("url: '/api/messages'");
		expect(runtimeHtml).toContain('Коментарът е запазен локално за преглед от Eliqauto');
		expect(runtimeHtml).toContain("form.matches('.eliqauto-sell-form')");
		expect(runtimeHtml).toContain("url: '/api/inventory/submissions'");
		expect(runtimeHtml).toContain('Заявката е подготвена. Eliqauto ще се свърже с вас.');
		expect(runtimeHtml).toContain("form.matches('.eliqauto-service-form')");
		expect(runtimeHtml).toContain('Заявката за услуга е подготвена локално за Eliqauto');
		expect(runtimeHtml).not.toContain('/assets/js/jquery.min.js');
		expect(runtimeHtml).not.toContain('<script src=');
	});

	it('extracts native public runtime without replaying template body scripts', () => {
		const home = splitAuxeroDocument(renderAuxeroTemplate('home-05.html')!);
		const homeRuntime = extractAuxeroRuntimeHtml(home.bodyHtml, {
			waitForBodyScripts: false
		});
		const detail = splitAuxeroDocument(renderAuxeroTemplate('listing-details-3.html')!);
		const detailRuntime = extractAuxeroRuntimeHtml(detail.bodyHtml, {
			waitForBodyScripts: false
		});

		expect(homeRuntime).toContain('window.__ELIQAUTO_RUNTIME__');
		expect(homeRuntime).toContain('eliqautoRuntimeWaitsForBodyScripts = false');
		expect(homeRuntime).not.toContain('/assets/js/jquery.min.js');
		expect(homeRuntime).not.toContain('/assets/js/app.js');
		expect(homeRuntime).not.toContain('/assets/js/swiper-bundle.min.js');
		expect(homeRuntime).not.toContain('code.jquery.com/ui');
		expect(homeRuntime).not.toContain('__ELIQAUTO_AUXERO_BODY_LOADER_EXECUTED__');

		expect(detailRuntime).toContain('window.__ELIQAUTO_RUNTIME__');
		expect(detailRuntime).toContain('eliqautoRuntimeWaitsForBodyScripts = false');
		expect(detailRuntime).not.toContain('/assets/js/swiper-bundle.min.js');
		expect(detailRuntime).not.toContain('/assets/js/jquery.min.js');
		expect(detailRuntime).not.toContain('/assets/js/app.js');
		expect(detailRuntime).not.toContain('/assets/js/swiper.js');
		expect(detailRuntime).not.toContain('/assets/js/gear-slider.js');
		expect(detailRuntime).not.toContain('code.jquery.com/ui');
	});

	it('renders a template document and extracts a marked page slot through the shared helper', () => {
		const pageDocument = renderAuxeroPageDocument(
			'compare.html',
			{ routePath: 'compare' },
			'Compare template could not be rendered'
		);
		const { pageDocument: slotDocument, slot } = renderAuxeroPageSlot(
			'compare.html',
			{ routePath: 'compare' },
			{
				marker: 'data-eliqauto-compare-table',
				slotError: 'Compare table slot could not be located',
				tagName: 'table',
				templateError: 'Compare template could not be rendered'
			}
		);

		expect(pageDocument.bodyClass).toContain('inner-page');
		expect(pageDocument.bodyClass).toContain('auxero-template-compare-html');
		expect(slotDocument.headHtml).toBe(pageDocument.headHtml);
		expect(slot.beforeHtml).toContain('Сравни автомобили от Eliqauto');
		expect(slot.sectionHtml).toContain('data-eliqauto-compare-table');
		expect(slot.afterHtml).toContain('CompareModal');
	});

	it('splits a marked Home 05 section without dropping surrounding body markup', () => {
		const html = renderAuxeroTemplate('home-05.html');
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroBodySection(
			document.bodyHtml,
			'<!-- Explore Our Brands -->',
			'<!-- /Explore Our Brands -->'
		);

		expect(split?.beforeHtml).toContain('<!-- /New Vehicles -->');
		expect(split?.sectionHtml).toContain('Explore Our Brands');
		expect(split?.sectionHtml).toContain('out-brand-2');
		expect(split?.afterHtml).toContain('<!-- Browse By Type -->');
	});

	it('can split the New Vehicles carousel before the brand strip slot', () => {
		const html = renderAuxeroTemplate('home-05.html');
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroBodySection(
			document.bodyHtml,
			'<!-- New Vehicles -->',
			'<!-- /New Vehicles -->'
		);

		expect(split?.beforeHtml).toContain('Browse, Compare, Drive');
		expect(split?.sectionHtml).toContain('Eliqauto Vehicles');
		expect(split?.sectionHtml).toContain('eliqauto-vehicle-pill car-box');
		// Quick pills are navigational links; none carries a fake pre-selected state.
		expect(split?.sectionHtml).not.toContain('eliqauto-vehicle-pill car-box active');
		expect(split?.sectionHtml).toContain('swiper-card-5');
		expect(split?.sectionHtml).toContain('pagination-swiper-card-5');
		expect(split?.afterHtml).toContain('<!-- Explore Our Brands -->');
	});

	it('can split the Home 05 hero/search block before New Vehicles', () => {
		const html = renderAuxeroTemplate('home-05.html');
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroBodySection(
			document.bodyHtml,
			'<!-- page-title -->',
			'<!-- page-title -->'
		);

		expect(split?.beforeHtml).toContain('header-style-4');
		expect(split?.sectionHtml).toContain('page-title-style-4');
		expect(split?.sectionHtml).toContain('page-title--slider');
		expect(split?.sectionHtml).toContain('search-cars__filters');
		expect(split?.afterHtml).toContain('<!-- New Vehicles -->');
	});

	it('can split the Home 05 header before the hero handoff', () => {
		const html = renderAuxeroTemplate('home-05.html');
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroBodySection(document.bodyHtml, '<!-- Header -->', '<!-- Header -->');

		expect(split?.beforeHtml).toContain('<div id="wrapper">');
		expect(split?.sectionHtml).toContain('header-wrapper-style-4');
		expect(split?.sectionHtml).toContain('header-style-4');
		expect(split?.sectionHtml).toContain('main-nav-wrapper');
		expect(split?.afterHtml).toContain('<!-- page-title -->');
		expect(split?.afterHtml).not.toContain('header-style-4');
	});

	it('can split the Browse By Type gallery after the brand strip slot', () => {
		const html = renderAuxeroTemplate('home-05.html');
		const document = splitAuxeroDocument(html!);
		const brandSplit = splitAuxeroBodySection(
			document.bodyHtml,
			'<!-- Explore Our Brands -->',
			'<!-- /Explore Our Brands -->'
		);
		const typeSplit = splitAuxeroBodySection(
			brandSplit!.afterHtml,
			'<!-- Browse By Type -->',
			'<!-- /Browse By Type -->'
		);

		expect(typeSplit?.sectionHtml).toContain('Browse By Type');
		expect(typeSplit?.sectionHtml).toContain('card-27.webp');
		expect(typeSplit?.afterHtml).toContain('<!-- Compare Top Rated Vehicles -->');
	});

	it('can split the compare section after the type gallery slot', () => {
		const html = renderAuxeroTemplate('home-05.html');
		const document = splitAuxeroDocument(html!);
		const brandSplit = splitAuxeroBodySection(
			document.bodyHtml,
			'<!-- Explore Our Brands -->',
			'<!-- /Explore Our Brands -->'
		);
		const typeSplit = splitAuxeroBodySection(
			brandSplit!.afterHtml,
			'<!-- Browse By Type -->',
			'<!-- /Browse By Type -->'
		);
		const compareSplit = splitAuxeroBodySection(
			typeSplit!.afterHtml,
			'<!-- Compare Top Rated Vehicles -->',
			'<!-- /Compare Top Rated Vehicles -->'
		);

		expect(compareSplit?.sectionHtml).toContain('Compare Top Rated Vehicles');
		expect(compareSplit?.sectionHtml).toContain('card-box-style-4');
		expect(compareSplit?.afterHtml).toContain('<!-- Used Cars by Budget -->');
	});

	it('can split the budget section after the compare slot', () => {
		const html = renderAuxeroTemplate('home-05.html');
		const document = splitAuxeroDocument(html!);
		const brandSplit = splitAuxeroBodySection(
			document.bodyHtml,
			'<!-- Explore Our Brands -->',
			'<!-- /Explore Our Brands -->'
		);
		const typeSplit = splitAuxeroBodySection(
			brandSplit!.afterHtml,
			'<!-- Browse By Type -->',
			'<!-- /Browse By Type -->'
		);
		const compareSplit = splitAuxeroBodySection(
			typeSplit!.afterHtml,
			'<!-- Compare Top Rated Vehicles -->',
			'<!-- /Compare Top Rated Vehicles -->'
		);
		const budgetSplit = splitAuxeroBodySection(
			compareSplit!.afterHtml,
			'<!-- Used Cars by Budget -->',
			'<!-- /Used Cars by Budget -->'
		);

		expect(budgetSplit?.sectionHtml).toContain('Eliqauto by Budget');
		expect(budgetSplit?.sectionHtml).toContain('grid grid-cols-3');
		expect(budgetSplit?.afterHtml).toContain('Client Reviews');
		expect(budgetSplit?.afterHtml).toContain('swiper-testimonior');
	});

	it('can split the reviews section after the budget slot', () => {
		const html = renderAuxeroTemplate('home-05.html');
		const document = splitAuxeroDocument(html!);
		const brandSplit = splitAuxeroBodySection(
			document.bodyHtml,
			'<!-- Explore Our Brands -->',
			'<!-- /Explore Our Brands -->'
		);
		const typeSplit = splitAuxeroBodySection(
			brandSplit!.afterHtml,
			'<!-- Browse By Type -->',
			'<!-- /Browse By Type -->'
		);
		const compareSplit = splitAuxeroBodySection(
			typeSplit!.afterHtml,
			'<!-- Compare Top Rated Vehicles -->',
			'<!-- /Compare Top Rated Vehicles -->'
		);
		const budgetSplit = splitAuxeroBodySection(
			compareSplit!.afterHtml,
			'<!-- Used Cars by Budget -->',
			'<!-- /Used Cars by Budget -->'
		);
		const reviewsSplit = splitAuxeroBodySection(
			budgetSplit!.afterHtml,
			'<!-- /Client Reviews -->',
			'<!-- /Client Reviews -->'
		);

		expect(reviewsSplit?.sectionHtml).toContain('Client Reviews');
		expect(reviewsSplit?.sectionHtml).toContain('testimonior-box');
		expect(reviewsSplit?.sectionHtml).toContain('swiper-testimonior');
		expect(reviewsSplit?.afterHtml).toContain('<!-- News & Reviews -->');
	});

	it('can split the news section after the reviews slot', () => {
		const html = renderAuxeroTemplate('home-05.html');
		const document = splitAuxeroDocument(html!);
		const brandSplit = splitAuxeroBodySection(
			document.bodyHtml,
			'<!-- Explore Our Brands -->',
			'<!-- /Explore Our Brands -->'
		);
		const typeSplit = splitAuxeroBodySection(
			brandSplit!.afterHtml,
			'<!-- Browse By Type -->',
			'<!-- /Browse By Type -->'
		);
		const compareSplit = splitAuxeroBodySection(
			typeSplit!.afterHtml,
			'<!-- Compare Top Rated Vehicles -->',
			'<!-- /Compare Top Rated Vehicles -->'
		);
		const budgetSplit = splitAuxeroBodySection(
			compareSplit!.afterHtml,
			'<!-- Used Cars by Budget -->',
			'<!-- /Used Cars by Budget -->'
		);
		const reviewsSplit = splitAuxeroBodySection(
			budgetSplit!.afterHtml,
			'<!-- /Client Reviews -->',
			'<!-- /Client Reviews -->'
		);
		const newsSplit = splitAuxeroBodySection(
			reviewsSplit!.afterHtml,
			'<!-- News & Reviews -->',
			'<!-- /News & Reviews -->'
		);

		expect(newsSplit?.sectionHtml).toContain('Eliqauto notes');
		expect(newsSplit?.sectionHtml).toContain('post-style-2');
		expect(newsSplit?.sectionHtml).toContain('post-style-3');
		expect(newsSplit?.afterHtml).toContain('footer');
	});

	it('can split the footer after the news slot', () => {
		const html = renderAuxeroTemplate('home-05.html');
		const document = splitAuxeroDocument(html!);
		const brandSplit = splitAuxeroBodySection(
			document.bodyHtml,
			'<!-- Explore Our Brands -->',
			'<!-- /Explore Our Brands -->'
		);
		const typeSplit = splitAuxeroBodySection(
			brandSplit!.afterHtml,
			'<!-- Browse By Type -->',
			'<!-- /Browse By Type -->'
		);
		const compareSplit = splitAuxeroBodySection(
			typeSplit!.afterHtml,
			'<!-- Compare Top Rated Vehicles -->',
			'<!-- /Compare Top Rated Vehicles -->'
		);
		const budgetSplit = splitAuxeroBodySection(
			compareSplit!.afterHtml,
			'<!-- Used Cars by Budget -->',
			'<!-- /Used Cars by Budget -->'
		);
		const reviewsSplit = splitAuxeroBodySection(
			budgetSplit!.afterHtml,
			'<!-- /Client Reviews -->',
			'<!-- /Client Reviews -->'
		);
		const newsSplit = splitAuxeroBodySection(
			reviewsSplit!.afterHtml,
			'<!-- News & Reviews -->',
			'<!-- /News & Reviews -->'
		);
		const footerSplit = splitAuxeroBodySection(
			newsSplit!.afterHtml,
			'<!-- Footer -->',
			'<!-- Footer -->'
		);

		expect(footerSplit?.sectionHtml).toContain('footer-top');
		expect(footerSplit?.sectionHtml).toContain('form-footer');
		expect(footerSplit?.sectionHtml).toContain('footer-bottom-links');
		expect(footerSplit?.afterHtml).toContain('LoginModal');
	});

	it('can split the Home 05 modal stack before the script tail', () => {
		const html = renderAuxeroTemplate('home-05.html');
		const document = splitAuxeroDocument(html!);
		const newsSplit = splitAuxeroBodySection(
			document.bodyHtml,
			'<!-- News & Reviews -->',
			'<!-- /News & Reviews -->'
		);
		const footerSplit = splitAuxeroBodySection(
			newsSplit!.afterHtml,
			'<!-- Footer -->',
			'<!-- Footer -->'
		);
		const modalSplit = splitAuxeroBodySection(
			footerSplit!.afterHtml,
			'<!-- Modal -->',
			'<!-- /CompareModal -->'
		);

		expect(modalSplit?.sectionHtml).toContain('CardModal');
		expect(modalSplit?.sectionHtml).toContain('LoginModal');
		expect(modalSplit?.sectionHtml).toContain('SearchModal');
		expect(modalSplit?.sectionHtml).toContain('SignUpModal');
		expect(modalSplit?.sectionHtml).toContain('CompareModal');
		expect(modalSplit?.beforeHtml).toContain('</div>');
		expect(modalSplit?.beforeHtml).not.toContain('<div id="LoginModal"');
		expect(modalSplit?.afterHtml).toContain('progress-wrap');
		expect(modalSplit?.afterHtml).not.toContain('<script src=');
		expect(modalSplit?.afterHtml).not.toContain('<div id="LoginModal"');
	});

	it('can split a generated inventory content div without dropping toolbar or filter markup', () => {
		const html = renderAuxeroTemplate('listing-grid3-columns.html');
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroDivBlockByMarker(document.bodyHtml, 'eliqauto-inventory-content');

		expect(split?.beforeHtml).toContain('eliqauto-inventory-toolbar-row');
		expect(split?.sectionHtml).toContain('content-tab eliqauto-inventory-content');
		expect(split?.sectionHtml).toContain('card-box-style-1');
		expect(split?.afterHtml).toContain('filter-sidebar');
		expect(split?.afterHtml).not.toContain('content-tab eliqauto-inventory-content');
	});

	it('can split the generated Listing Details 3 vehicle block without dropping related vehicles', () => {
		const html = renderAuxeroTemplate('listing-details-3.html');
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroDivBlockByMarker(document.bodyHtml, 'data-eliqauto-detail="true"');

		expect(split?.beforeHtml).toContain('swiper-listing-details-navigation');
		expect(split?.sectionHtml).toContain('listing-details--content');
		expect(split?.sectionHtml).toContain('listing-details--sidebar');
		expect(split?.afterHtml).toContain('You might also like');
		expect(split?.afterHtml).not.toContain('data-eliqauto-detail="true"');
	});

	it('can split the generated compare table without dropping Auxero page chrome', () => {
		const html = renderAuxeroTemplate('compare.html', { routePath: 'compare' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroElementBlockByMarker(
			document.bodyHtml,
			'data-eliqauto-compare-table',
			'table'
		);

		expect(split?.beforeHtml).toContain('Сравни автомобили от Eliqauto');
		expect(split?.beforeHtml).not.toContain('data-eliqauto-compare-table');
		expect(split?.sectionHtml).toContain('card-details--table');
		expect(split?.sectionHtml).toContain('data-eliqauto-compare-table');
		expect(split?.afterHtml).toContain('footer');
		expect(split?.afterHtml).toContain('CompareModal');
	});

	it('can split the account compare table from saved garage state', () => {
		const html = renderAuxeroTemplate('compare.html', { routePath: 'account/compare' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroElementBlockByMarker(
			document.bodyHtml,
			'data-eliqauto-compare-table',
			'table'
		);

		expect(split?.beforeHtml).toContain('Сравни автомобили от Eliqauto');
		expect(split?.sectionHtml).toContain('data-eliqauto-compare-table');
		expect(split?.sectionHtml).toContain('data-eliqauto-compare-column');
		expect(split?.afterHtml).toContain('CompareModal');
	});

	it('can split the account dashboard recent box without dropping dashboard chrome', () => {
		const html = renderAuxeroTemplate('dashboard.html', { routePath: 'account' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroDivBlockByMarker(document.bodyHtml, 'data-eliqauto-dashboard-recent');

		expect(split?.beforeHtml).toContain('Account Dashboard');
		expect(split?.beforeHtml).toContain('data-eliqauto-dashboard-stat="submissions"');
		expect(split?.sectionHtml).toContain('Скорошни съобщения');
		expect(split?.sectionHtml).toContain('Eliqauto Sales');
		expect(split?.sectionHtml).not.toContain('Great Experience!');
		expect(split?.afterHtml).toContain('LoginModal');
		expect(split?.afterHtml).toContain('window.__ELIQAUTO_RUNTIME__');
	});

	it('can split the admin dashboard recent box without dropping dashboard chrome', () => {
		const html = renderAuxeroTemplate('dashboard.html', { routePath: 'admin' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroDivBlockByMarker(document.bodyHtml, 'data-eliqauto-dashboard-recent');

		expect(split?.beforeHtml).toContain('Admin Dashboard');
		expect(split?.beforeHtml).toContain('data-eliqauto-dashboard-stat="inventory"');
		expect(split?.sectionHtml).toContain('Admin Focus');
		expect(split?.sectionHtml).toContain('Review leads');
		expect(split?.sectionHtml).toContain('Import & leasing lead');
		expect(split?.sectionHtml).not.toContain('Great Experience!');
		expect(split?.afterHtml).toContain('LoginModal');
		expect(split?.afterHtml).toContain('window.__ELIQAUTO_RUNTIME__');
	});

	it('can split the account messages container without keeping template demo contacts', () => {
		const html = renderAuxeroTemplate('message.html', { routePath: 'account/messages' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroDivBlockByMarker(
			document.bodyHtml,
			'data-eliqauto-message-container'
		);

		expect(split?.beforeHtml).toContain('Messages');
		expect(split?.beforeHtml).toContain('dashboard-menu-item active');
		expect(split?.sectionHtml).toContain('message-container');
		expect(split?.sectionHtml).toContain('Eliqauto Sales');
		expect(split?.sectionHtml).toContain('Please send appointment options');
		expect(split?.sectionHtml).not.toContain('data-contact="john"');
		expect(split?.sectionHtml).not.toContain('Eliqauto follow-up is ready');
		expect(split?.afterHtml).toContain('LoginModal');
		expect(split?.afterHtml).toContain('window.__ELIQAUTO_RUNTIME__');
	});

	it('can split the admin messages container without keeping template demo contacts', () => {
		const html = renderAuxeroTemplate('message.html', { routePath: 'admin/messages' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroDivBlockByMarker(
			document.bodyHtml,
			'data-eliqauto-message-container'
		);

		expect(split?.beforeHtml).toContain('Inquiries & Messages');
		expect(split?.beforeHtml).toContain('dashboard-menu-item active');
		expect(split?.sectionHtml).toContain('Import & leasing lead');
		expect(split?.sectionHtml).toContain('Customer asked for source history');
		expect(split?.sectionHtml).not.toContain('data-contact="john"');
		expect(split?.sectionHtml).not.toContain('Eliqauto follow-up is ready');
		expect(split?.afterHtml).toContain('LoginModal');
		expect(split?.afterHtml).toContain('window.__ELIQAUTO_RUNTIME__');
	});

	it('can split the generated account favorites grid without dropping dashboard chrome', () => {
		const html = renderAuxeroTemplate('my-favorites.html', { routePath: 'account/favorites' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroDivBlockByMarker(document.bodyHtml, 'data-eliqauto-favorites-grid');

		expect(split?.beforeHtml).toContain('My Favorites');
		expect(split?.beforeHtml).toContain('dashboard-menu-item active');
		expect(split?.sectionHtml).toContain('data-eliqauto-favorites-grid');
		expect(split?.sectionHtml).toContain('card-box-style-1');
		expect(split?.afterHtml).toContain('pagination justify-center');
		expect(split?.afterHtml).toContain('CardModal');
		expect(split?.afterHtml).toContain('renderAccountFavorites');
	});

	it('removes template scripts from native account slot tails', () => {
		const html = renderAuxeroTemplate('my-favorites.html', { routePath: 'account/favorites' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroDivBlockByMarker(document.bodyHtml, 'data-eliqauto-favorites-grid');
		const sanitized = removeAuxeroSlotScriptTags(split!);

		expect(split?.afterHtml).toContain('renderAccountFavorites');
		expect(sanitized.afterHtml).toContain('CardModal');
		expect(sanitized.afterHtml).not.toContain('<script');
		expect(sanitized.afterHtml).not.toContain('/assets/js/jquery.min.js');
		expect(sanitized.afterHtml).not.toContain('/assets/js/app.js');
		expect(sanitized.afterHtml).not.toContain('gear-slider.js');
		expect(sanitized.afterHtml).not.toContain('renderAccountFavorites');
	});

	it('can drop unused template body HTML before serializing native slot shells', () => {
		const document = splitAuxeroDocument(renderAuxeroTemplate('my-favorites.html')!);
		const shellDocument = removeAuxeroPageDocumentBodyHtml(document);

		expect(document.bodyHtml).toContain('window.__ELIQAUTO_RUNTIME__');
		expect(shellDocument.bodyClass).toBe(document.bodyClass);
		expect(shellDocument.headHtml).toBe(document.headHtml);
		expect(shellDocument.bodyHtml).toBe('');
	});

	it('can split the customer listings table without dropping dashboard chrome', () => {
		const html = renderAuxeroTemplate('my-listings.html', { routePath: 'account/listings' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroDivBlockByMarker(document.bodyHtml, 'data-eliqauto-account-listings');

		expect(split?.beforeHtml).toContain('Моите автомобили');
		expect(split?.beforeHtml).toContain('dashboard-menu-item active');
		expect(split?.sectionHtml).toContain('data-eliqauto-submissions-table');
		expect(split?.sectionHtml).toContain('Client BMW evaluation');
		expect(split?.sectionHtml).toContain('Trade-in review request');
		expect(split?.afterHtml).toContain('CardModal');
		expect(split?.afterHtml).toContain('window.__ELIQAUTO_RUNTIME__');
	});

	it('can split the admin inventory table without dropping dashboard chrome', () => {
		const html = renderAuxeroTemplate('my-listings.html', { routePath: 'admin/inventory' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroDivBlockByMarker(document.bodyHtml, 'data-eliqauto-account-listings');

		expect(split?.beforeHtml).toContain('Inventory Management');
		expect(split?.beforeHtml).toContain('dashboard-menu-item active');
		expect(split?.sectionHtml).toContain('data-eliqauto-slug');
		expect(split?.sectionHtml).toContain('BMW X5 40i M Sport Shadow Line');
		expect(split?.sectionHtml).toContain('/admin/inventory/edit/');
		expect(split?.afterHtml).toContain('CardModal');
		expect(split?.afterHtml).toContain('window.__ELIQAUTO_RUNTIME__');
	});

	it('can split the admin users table without dropping dashboard chrome', () => {
		const html = renderAuxeroTemplate('dashboard.html', { routePath: 'admin/users' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroDivBlockByMarker(document.bodyHtml, 'data-eliqauto-users-table');

		expect(split?.beforeHtml).toContain('User Management');
		expect(split?.beforeHtml).toContain('dashboard-menu-item active');
		expect(split?.sectionHtml).toContain('data-eliqauto-user-role="admin"');
		expect(split?.sectionHtml).toContain('customer@eliqauto.local');
		expect(split?.sectionHtml).toContain('Import & leasing lead');
		expect(split?.afterHtml).toContain('Role Access Notes');
		expect(split?.afterHtml).toContain('CardModal');
		expect(split?.afterHtml).toContain('window.__ELIQAUTO_RUNTIME__');
	});

	it('can split the account profile form without dropping dashboard chrome', () => {
		const html = renderAuxeroTemplate('my-profile.html', { routePath: 'account/profile' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroElementBlockByMarker(
			document.bodyHtml,
			'data-eliqauto-profile-form',
			'form'
		);

		expect(split?.beforeHtml).toContain('My profile');
		expect(split?.beforeHtml).toContain('dashboard-menu-item active');
		expect(split?.sectionHtml).toContain('eliqauto-profile-form');
		expect(split?.sectionHtml).toContain('customer@eliqauto.local');
		expect(split?.sectionHtml).toContain('Save Locally');
		expect(split?.sectionHtml).toContain('Внос и лизинг, проверена история');
		expect(split?.sectionHtml).toContain('+359 893 588 680');
		expect(split?.sectionHtml).not.toContain('Lorem ipsum');
		expect(split?.sectionHtml).not.toContain('sales@eliqauto.bg');
		expect(split?.afterHtml).toContain('CardModal');
		expect(split?.afterHtml).toContain('window.__ELIQAUTO_RUNTIME__');
	});

	it('can split the account password form without dropping dashboard chrome', () => {
		const html = renderAuxeroTemplate('change-password.html', {
			routePath: 'account/password'
		});
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroElementBlockByMarker(
			document.bodyHtml,
			'data-eliqauto-password-form',
			'form'
		);

		expect(split?.beforeHtml).toContain('Change Password');
		expect(split?.beforeHtml).toContain('dashboard-menu-item active');
		expect(split?.sectionHtml).toContain('eliqauto-password-form');
		expect(split?.sectionHtml).toContain('customer@eliqauto.local');
		expect(split?.sectionHtml).not.toContain('eliqauto@2026');
		expect(split?.afterHtml).toContain('CardModal');
		expect(split?.afterHtml).toContain('window.__ELIQAUTO_RUNTIME__');
	});

	it('can split the admin add-listing form without dropping dashboard chrome', () => {
		const html = renderAuxeroTemplate('add-listings-2.html', {
			routePath: 'admin/inventory/new'
		});
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroElementBlockByMarker(
			document.bodyHtml,
			'data-eliqauto-add-listing-form',
			'form'
		);

		expect(split?.beforeHtml).toContain('Add Listing');
		expect(split?.beforeHtml).toContain('eliqauto-local-form-action');
		expect(split?.beforeHtml).toContain('dashboard-menu-item active');
		expect(split?.sectionHtml).toContain('eliqauto-add-listing-form');
		expect(split?.sectionHtml).toContain('data-eliqauto-admin-listing-mode="create"');
		expect(split?.sectionHtml).toContain('name="actorRole" value="admin"');
		expect(split?.sectionHtml).toContain('Gallery');
		expect(split?.sectionHtml).toContain('Car Details');
		expect(split?.sectionHtml).toContain('Features');
		expect(split?.sectionHtml).toContain('Car Price');
		expect(split?.sectionHtml).toContain('Attachments');
		expect(split?.sectionHtml).toContain('Vehicle description and inspection notes');
		expect(split?.sectionHtml).not.toContain('Lorem ipsum');
		expect(split?.afterHtml).toContain('CardModal');
		expect(split?.afterHtml).toContain('window.__ELIQAUTO_RUNTIME__');
	});

	it('can split the admin edit-listing form without dropping dashboard chrome', () => {
		const html = renderAuxeroTemplate('add-listings-2.html', {
			routePath: 'admin/inventory/edit/21779200396408437'
		});
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroElementBlockByMarker(
			document.bodyHtml,
			'data-eliqauto-add-listing-form',
			'form'
		);

		expect(split?.beforeHtml).toContain('Edit Listing');
		expect(split?.beforeHtml).toContain('Save Draft');
		expect(split?.sectionHtml).toContain('data-eliqauto-admin-listing-mode="clone-static"');
		expect(split?.sectionHtml).toContain('name="sourceId" value="21779200396408437"');
		expect(split?.sectionHtml).toContain('name="actorRole" value="admin"');
		expect(split?.sectionHtml).toContain('Vehicle description and inspection notes');
		expect(split?.afterHtml).toContain('CardModal');
		expect(split?.afterHtml).toContain('window.__ELIQAUTO_RUNTIME__');
	});

	it('can split the public agents grid without dropping page chrome', () => {
		const html = renderAuxeroTemplate('sale-agents.html', { routePath: 'agents' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroDivBlockByMarker(
			document.bodyHtml,
			'data-eliqauto-agent-management="false"'
		);

		expect(split?.beforeHtml).toContain('Eliqauto Consultants');
		expect(split?.sectionHtml).toContain('eliqauto-agent-grid');
		expect(split?.sectionHtml).toContain('sale-agent-box');
		expect(split?.afterHtml).toContain('footer');
		expect(split?.afterHtml).toContain('LoginModal');
	});

	it('can split the agent detail container without dropping footer chrome', () => {
		const html = renderAuxeroTemplate('sale-agents-details.html', {
			routePath: 'agents/eliqauto-import'
		});
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroDivBlockByMarker(
			document.bodyHtml,
			'class="container innerpage-container"'
		);

		expect(split?.beforeHtml).toContain('Eliqauto Consultants');
		expect(split?.sectionHtml).toContain('Внос и лизинг');
		expect(split?.sectionHtml).toContain('Verified Eliqauto Consultant');
		expect(split?.sectionHtml).toContain('eliqauto-agent-inventory');
		expect(split?.sectionHtml).toContain('send-inquiry');
		expect(split?.afterHtml).toContain('footer');
		expect(split?.afterHtml).toContain('LoginModal');
	});

	it('can split the contact form card without dropping map, info, or footer chrome', () => {
		const html = renderAuxeroTemplate('contact-us.html', { routePath: 'contact' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroDivBlockByMarker(document.bodyHtml, 'contact-page-form');

		expect(split?.beforeHtml).toContain('widget-gg-map');
		expect(split?.beforeHtml).toContain('contact-page-info');
		expect(split?.sectionHtml).toContain('eliqauto-contact-form');
		expect(split?.sectionHtml).toContain('Send Message');
		expect(split?.afterHtml).toContain('footer');
		expect(split?.afterHtml).toContain('LoginModal');
	});

	it('can split the services form card without dropping service sections or footer chrome', () => {
		const html = renderAuxeroTemplate('services-center.html', { routePath: 'services' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroDivBlockByMarker(document.bodyHtml, 'services-center-form');

		expect(split?.beforeHtml).toContain('Услуги от Eliqauto');
		expect(split?.beforeHtml).toContain('Основни услуги');
		expect(split?.beforeHtml).toContain('services-center-info');
		expect(split?.sectionHtml).toContain('eliqauto-service-form');
		expect(split?.sectionHtml).toContain('Изпрати заявка');
		expect(split?.afterHtml).toContain('footer');
		expect(split?.afterHtml).toContain('LoginModal');
	});

	it('can split the sell-your-car intake form without dropping tabs or follow-up sections', () => {
		const html = renderAuxeroTemplate('sell-your-car.html', { routePath: 'sell-your-car' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroElementBlockByMarker(document.bodyHtml, 'eliqauto-sell-form', 'form');

		expect(split?.beforeHtml).toContain('Продай автомобила си с Eliqauto');
		expect(split?.beforeHtml).toContain('menu-tab-style7');
		expect(split?.sectionHtml).toContain('calculate-form eliqauto-sell-form');
		expect(split?.sectionHtml).toContain('Заяви преглед');
		expect(split?.afterHtml).toContain('Как работи');
		expect(split?.afterHtml).toContain('footer');
		expect(split?.afterHtml).toContain('LoginModal');
	});

	it('can split the reviews grid without dropping pagination or footer chrome', () => {
		const html = renderAuxeroTemplate('clients-reviews.html', { routePath: 'reviews' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroElementBlockByMarker(
			document.bodyHtml,
			'data-eliqauto-reviews-grid',
			'div'
		);

		expect(split?.beforeHtml).toContain('Client Reviews');
		expect(split?.sectionHtml).toContain('testimonior-box');
		expect(split?.sectionHtml).toContain('Aleksandar Vytev');
		expect(split?.afterHtml).toContain('pagination__link active');
		expect(split?.afterHtml).toContain('footer');
		expect(split?.afterHtml).toContain('LoginModal');
	});

	it('can split the calculator page body without dropping the page shell', () => {
		const html = renderAuxeroTemplate('calculator.html', { routePath: 'calculator' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroElementBlockByMarker(
			document.bodyHtml,
			'data-eliqauto-calculator-page',
			'div'
		);

		expect(split?.beforeHtml).toContain('Calculator');
		expect(split?.sectionHtml).toContain('Изчисли ориентировъчна крайна цена');
		expect(split?.sectionHtml).toContain('data-eliqauto-calc-output="total"');
		expect(split?.sectionHtml).toContain('Разгледай по бюджет');
		expect(split?.sectionHtml).toContain('Въпроси за калкулатора');
		expect(split?.afterHtml).toContain('footer');
		expect(split?.afterHtml).toContain('LoginModal');
	});

	it('can split the terms page body without dropping the page shell', () => {
		const html = renderAuxeroTemplate('terms.html', { routePath: 'terms' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroElementBlockByMarker(
			document.bodyHtml,
			'data-eliqauto-terms-page',
			'section'
		);

		expect(split?.beforeHtml).toContain('Terms of use');
		expect(split?.sectionHtml).toContain('Условия за използване на Eliqauto');
		expect(split?.sectionHtml).toContain('term-page--nav');
		expect(split?.sectionHtml).toContain('1. Информация за автомобилите');
		expect(split?.sectionHtml).toContain('6. Контакт и данни');
		expect(split?.afterHtml).toContain('footer');
		expect(split?.afterHtml).toContain('LoginModal');
	});

	it('can split the FAQ accordions without dropping the page shell', () => {
		const html = renderAuxeroTemplate('faqs.html', { routePath: 'faqs' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroElementBlockByMarker(
			document.bodyHtml,
			'data-eliqauto-faqs',
			'section'
		);

		expect(split?.sectionHtml).toContain('Често задавани въпроси');
		expect(split?.sectionHtml).toContain('Eliqauto помощ');
		expect(split?.sectionHtml).toContain('Внос и покупка');
		expect(split?.sectionHtml).toContain('flat-accordion');
		expect(split?.afterHtml).toContain('footer');
		expect(split?.afterHtml).toContain('LoginModal');
	});

	it('can split the about content without dropping footer or modal chrome', () => {
		const html = renderAuxeroTemplate('about-us.html', { routePath: 'about' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroElementBlockByMarker(document.bodyHtml, 'data-eliqauto-about', 'div');

		expect(split?.sectionHtml).toContain('Какво проверяваме');
		expect(split?.sectionHtml).toContain('Отзиви от клиенти');
		expect(split?.sectionHtml).toContain('Как работи процесът преди оглед или внос?');
		expect(split?.sectionHtml).toContain('Екипът зад процеса');
		expect(split?.afterHtml).toContain('footer');
		expect(split?.afterHtml).toContain('LoginModal');
	});

	it('can split the blog listing page body without dropping footer chrome', () => {
		const html = renderAuxeroTemplate('blog-grid-style-1.html', { routePath: 'blog' });
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroElementBlockByMarker(
			document.bodyHtml,
			'data-eliqauto-blog-page',
			'section'
		);

		expect(split?.beforeHtml).toContain('News');
		expect(split?.sectionHtml).toContain('Съвети от Eliqauto');
		expect(split?.sectionHtml).toContain('post-style-6');
		expect(split?.sectionHtml).toContain(
			'Какво проверява Eliqauto преди внос на автомобил с проверена история'
		);
		// Single page of posts: the fake "1 / Попитай" pagination row was removed.
		expect(split?.sectionHtml).not.toContain('pagination__link');
		expect(split?.afterHtml).toContain('footer');
		expect(split?.afterHtml).toContain('LoginModal');
	});

	it('can split the blog detail page body without dropping footer chrome', () => {
		const html = renderAuxeroTemplate('blog-details-1.html', {
			routePath: 'blog/vnos-ot-kanada-proverka'
		});
		const document = splitAuxeroDocument(html!);
		const split = splitAuxeroDivBlockByMarker(document.bodyHtml, 'data-eliqauto-blog-detail-page');

		expect(split?.sectionHtml).toContain('blog-details-banner');
		expect(split?.sectionHtml).toContain('eliqauto-blog-comment-form');
		expect(split?.sectionHtml).toContain('Следваща стъпка');
		expect(split?.sectionHtml).toContain('innerpage__sidebar');
		expect(split?.sectionHtml).toContain('Свързани публикации');
		expect(split?.afterHtml).toContain('footer');
	});
});
