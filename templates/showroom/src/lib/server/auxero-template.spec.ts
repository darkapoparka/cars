import { describe, expect, it } from 'vitest';
import { agents } from '$lib/data/agents';
import { posts } from '$lib/data/blog';
import { eliqautoAssets, eliqautoBrand, eliqautoContact } from '$lib/data/eliqauto';
import { vehicles } from '$lib/data/vehicles';
import {
	authenticateEliqautoUser,
	canAccessEliqautoRoute,
	resolveEliqautoSession,
	sessionCookieForEliqautoSession
} from './auth';
import { createInventoryListing } from './inventory';
import { updateEliqautoGarageState } from './garage';
import { listInquiriesForRole } from './inquiries';
import { listMessagesForRole } from './messages';
import {
	auxeroResponse,
	auxeroRouteResponse,
	renderAuxeroTemplate,
	resolveAuxeroTemplateFile
} from './auxero-template';

const requestForSession = (path: string, role: 'admin' | 'agent' | 'customer') => {
	const session = authenticateEliqautoUser({
		email: `${role}@eliqauto.local`,
		password: 'eliqauto prototype',
		role
	});
	const cookie = session ? sessionCookieForEliqautoSession(session) : undefined;

	return {
		request: new Request(`http://localhost/${path.replace(/^\/+/, '')}`, {
			headers: cookie ? { cookie } : undefined
		}),
		session
	};
};

describe('Auxero template Eliqauto adapter', () => {
	it('resolves planned Eliqauto aliases to preserved template files', () => {
		expect(resolveAuxeroTemplateFile('services')).toBe('services-center.html');
		expect(resolveAuxeroTemplateFile('account/favorites')).toBe('my-favorites.html');
		expect(resolveAuxeroTemplateFile('admin/inventory/new')).toBe('add-listings-2.html');
		expect(resolveAuxeroTemplateFile(`admin/inventory/edit/${vehicles[0].slug}`)).toBe(
			'add-listings-2.html'
		);
	});

	it('renders the planned Eliqauto route surfaces without opening a browser server', async () => {
		const routeCases = [
			['about', 'Услуги около внос, оглед и продажба'],
			['services', 'Услуги от Eliqauto'],
			['sell-your-car', 'Продай автомобила си с Eliqauto'],
			['compare', 'Сравни автомобили от Eliqauto'],
			['agents', 'Консултанти на Eliqauto'],
			['agents/eliqauto-import', 'Внос и лизинг'],
			['reviews', 'Aleksandar Vytev'],
			['calculator', 'Калкулатор за внос'],
			['faqs', 'Защо да внеса автомобил с проверена история?'],
			['terms', 'Условия за използване на Eliqauto'],
			['blog', 'Съвети от Eliqauto'],
			['blog/gotov-za-registracia', 'Какво означава „готов за регистрация“'],
			['contact', 'Свържете се с Eliqauto'],
			['account', 'Account Dashboard', 'customer'],
			['account/favorites', 'My Favorites', 'customer'],
			['account/compare', 'Сравни автомобили от Eliqauto', 'customer'],
			['account/messages', 'Messages', 'customer'],
			['account/listings', 'Моите автомобили', 'customer'],
			['account/profile', 'Профил', 'customer'],
			['account/password', 'Change Password', 'customer'],
			['admin', 'Admin Dashboard', 'admin'],
			['admin/inventory', 'Inventory Management', 'admin'],
			['admin/inventory/new', 'Add Listing', 'admin'],
			['admin/inquiries', 'Inquiries & Messages', 'agent'],
			['admin/messages', 'Inquiries & Messages', 'admin'],
			['admin/agents', 'Управление на консултанти', 'admin'],
			['admin/users', 'User Management', 'admin']
		] as const;

		const home = await auxeroResponse('home').text();
		const inventory = await auxeroResponse('inventory').text();
		const detail = await auxeroResponse('detail', { slug: vehicles[0].slug }).text();

		expect(home).toContain('Browse, Compare, Drive');
		expect(inventory).toContain('eliqauto-inventory-searchbar');
		expect(inventory).toContain('eliqauto-inventory-filter-grid');
		expect(detail).toContain(vehicles[0].title);
		expect(detail).toContain('Eliqauto Consultant');

		for (const [route, expected, role] of routeCases) {
			const response = auxeroRouteResponse(route, {
				searchParams: role ? new URLSearchParams(`role=${role}`) : undefined
			});
			const html = await response.text();

			expect(response.status, route).toBe(200);
			expect(html, route).toContain('Eliqauto');
			expect(html, route).toContain(expected);
		}
	});

	it('blocks ecommerce and coming-soon template routes', () => {
		expect(resolveAuxeroTemplateFile('shop')).toBeUndefined();
		expect(resolveAuxeroTemplateFile('shop.html')).toBeUndefined();
		expect(resolveAuxeroTemplateFile('coming-soon.html')).toBeUndefined();
	});

	it('removes blocked ecommerce and coming-soon menu anchors from rendered pages', () => {
		const publicTemplates = [
			'home-05.html',
			'listing-grid3-columns.html',
			'listing-details-3.html',
			'blog-grid-style-1.html',
			'dashboard.html',
			'sale-agents.html',
			'contact-us.html'
		];
		const blockedLabels = [
			'Products',
			'Product Details',
			'Shopping Cart',
			'Check Out',
			'Coming Soon'
		];

		for (const template of publicTemplates) {
			const html = renderAuxeroTemplate(template, {
				routePath: template === 'dashboard.html' ? 'account' : undefined
			});

			expect(html, template).toBeDefined();
			for (const label of blockedLabels) {
				expect(html, `${template} exposes ${label}`).not.toContain(`>${label}`);
			}
			expect(html, `${template} exposes blocked href`).not.toMatch(
				/href=(["'])(?:\/inventory|\/)?(?:check-out|coming-soon|product-details|shop|shopping-cart)(?:\.html)?\1/
			);
		}
	});

	it('redirects raw duplicate template filenames to branded canonical routes', () => {
		const duplicateHome = auxeroRouteResponse('home-02.html');
		const extensionlessDuplicateHome = auxeroRouteResponse('home-02');
		const primaryHome = auxeroRouteResponse('home-05.html');
		const extensionlessPrimaryHome = auxeroRouteResponse('home-05');
		const denseInventory = auxeroRouteResponse('listing-grid4-columns.html');
		const extensionlessDenseInventory = auxeroRouteResponse('listing-grid4-columns');
		const duplicateDetail = auxeroRouteResponse('listing-details-6.html');
		const extensionlessDuplicateDetail = auxeroRouteResponse('listing-details-6');
		const accountProfileAlias = auxeroRouteResponse('my-profile');
		const dashboardListingAlias = auxeroRouteResponse('dashboard/listings/new');

		expect(duplicateHome.status).toBe(308);
		expect(duplicateHome.headers.get('location')).toBe('/');
		expect(extensionlessDuplicateHome.status).toBe(308);
		expect(extensionlessDuplicateHome.headers.get('location')).toBe('/');
		expect(primaryHome.status).toBe(308);
		expect(primaryHome.headers.get('location')).toBe('/');
		expect(extensionlessPrimaryHome.status).toBe(308);
		expect(extensionlessPrimaryHome.headers.get('location')).toBe('/');
		expect(denseInventory.status).toBe(308);
		expect(denseInventory.headers.get('location')).toBe('/inventory');
		expect(extensionlessDenseInventory.status).toBe(308);
		expect(extensionlessDenseInventory.headers.get('location')).toBe('/inventory');
		expect(duplicateDetail.status).toBe(308);
		expect(duplicateDetail.headers.get('location')).toBe(`/inventory/${vehicles[0].slug}`);
		expect(extensionlessDuplicateDetail.status).toBe(308);
		expect(extensionlessDuplicateDetail.headers.get('location')).toBe(
			`/inventory/${vehicles[0].slug}`
		);
		expect(accountProfileAlias.status).toBe(308);
		expect(accountProfileAlias.headers.get('location')).toBe('/account/profile');
		expect(dashboardListingAlias.status).toBe(404);
	});

	it('brands the raw template without exposing demo credentials or duplicate nav labels', () => {
		const html = renderAuxeroTemplate('home-05.html');

		expect(html).toContain('Eliqauto');
		expect(html).toContain('/assets/eliqauto/brand/eliqauto-logo-light.svg');
		expect(html).toContain('Browse, Compare, Drive');
		expect(html).toContain('With Eliqauto!');
		expect(html).toContain(eliqautoBrand.tagline);
		expect(html).toMatch(/<header class="header header-style-4 header-blur"/);
		expect(html).toMatch(/id="menu-primary-menu" class="menu menu style-2"/);
		expect(html).toMatch(
			/class="btn btn-line-white btn-large font-weight-600\s+bg-sign-in open-modal"/
		);
		expect(html).toContain(`Show ${vehicles.length} Matches`);
		expect(html).toContain(vehicles[0].title);
		expect(html).toContain(vehicles[0].priceLabel);
		expect(html).toContain('Eliqauto Vehicles');
		expect(html).toContain('eliqauto-vehicle-pill car-box');
		// Quick pills are navigational links; none carries a fake pre-selected state.
		expect(html).not.toContain('eliqauto-vehicle-pill car-box active');
		expect(html).toContain('Eliqauto by Budget');
		expect(html).toContain('Eliqauto notes');
		expect(html).toContain(eliqautoContact.addressLabel);
		expect(html).toContain('/api/account/garage');
		expect(html).not.toContain('Username:');
		expect(html).not.toContain('Password:');
		expect(html).not.toContain('Show 1,029 Matches');
		expect(html).not.toContain('Discover the perfect car for you');
		expect(html).not.toContain('Homepage 02');
		expect(html).not.toContain('/shop.html');
	});

	it('globally replaces Auxero footer marketplace copy on routed template pages', () => {
		const html = renderAuxeroTemplate('blog-details-1.html', {
			routePath: 'blog/vnos-ot-kanada-proverka'
		});

		expect(html).toContain('Buying With Eliqauto');
		expect(html).toContain('Find a Consultant');
		expect(html).toContain('Verified Listings');
		expect(html).toContain('Eliqauto Online');
		expect(html).toContain('Weekend viewings by appointment');
		expect(html).not.toContain('Buying a car');
		expect(html).not.toContain('Find a Dealer');
		expect(html).not.toContain('Certified Pre-Owned');
		expect(html).not.toContain('Download App');
		expect(html).not.toContain('Saturday from 9 AM to 6 PM EST');
	});

	it('injects Eliqauto data into the preserved Home 09 homepage', () => {
		const html = renderAuxeroTemplate('home-09.html');
		const firstVehicle = vehicles[0];

		expect(html).toContain(eliqautoBrand.tagline);
		expect(html).toContain(eliqautoAssets.hero);
		expect(html).toContain(`Show ${vehicles.length} Matches`);
		expect(html).toContain(firstVehicle.title);
		expect(html).toContain(firstVehicle.priceLabel);
		expect(html).toContain('New Eliqauto Vehicles');
		expect(html).toContain('Why Choose Eliqauto?');
		expect(html).toContain('Featured Eliqauto Searches');
		expect(html).toContain('Import Cost Calculator');
		expect(html).toContain('Client Reviews');
		expect(html).toContain('/inventory?view=4');
		expect(html).toContain('/sell-your-car');
		expect(html).not.toContain('Search Cars Near You');
		expect(html).not.toContain('2024 Tesla Model Y');
		expect(html).not.toContain('Ford Mustang');
		expect(html).not.toContain('Mercedes-AMG C-Class');
		expect(html).not.toContain('Dealer Reviews');
		expect(html).not.toContain('Verified Dealers');
		expect(html).not.toContain('Certified Pre-Owned');
		expect(html).not.toContain('Download App');
		expect(html).not.toContain('Emily Johnson');
		expect(html).not.toContain('CEO Tesla');
	});

	it('injects real Eliqauto inventory cards into the default grid template', () => {
		const html = renderAuxeroTemplate('listing-grid3-columns.html');
		const firstVehicle = vehicles[0];

		expect(html).toContain(firstVehicle.title);
		expect(html).toContain(firstVehicle.priceLabel);
		expect(html).toContain(`/inventory/${firstVehicle.slug}`);
		expect(html).toContain('Showing 1 - 42 of 42 Eliqauto Listings');
		expect(html).not.toContain('$44.900,00');
		expect(html).not.toContain('Audi A6 Avant E-Tron');
	});

	it('renders dense and map inventory views from canonical query state', async () => {
		const denseResponse = auxeroResponse('inventory', {
			searchParams: new URLSearchParams('view=4')
		});
		const compactResponse = auxeroResponse('inventory', {
			searchParams: new URLSearchParams('layout=classic')
		});
		const mapResponse = auxeroResponse('inventory', {
			searchParams: new URLSearchParams('view=map')
		});
		const dense = await denseResponse.text();
		const compact = await compactResponse.text();
		const map = await mapResponse.text();

		expect(dense).toContain('grid-cols-4');
		expect(dense).toContain('Dense 4 grid');
		expect(compact).toContain('grid-cols-5');
		expect(compact).toContain('Compact 5 grid');
		expect(map).toContain('card-box-style-9');
		expect(map).toContain('eliqauto-map-fallback');
		expect(map).toContain(`data-eliqauto-map-selected="${vehicles.length}"`);
		expect(map).toContain(`${vehicles.length} съвпадащи автомобила`);
		expect(map).toContain(`data-eliqauto-map-location="${vehicles[0].location}"`);
		expect(map).toContain('Точната локация за оглед се потвърждава по телефона');
		expect(map).not.toContain('maps.googleapis.com/maps/api/js');
		expect(map).not.toContain('/assets/js/maps.js');
		expect(map).not.toContain('/assets/js/marker.js');
		expect(map).not.toContain('/assets/js/infobox.min.js');
	});

	it('preserves filtered inventory state in the map location fallback', async () => {
		const filteredLocation = vehicles.find((vehicle) =>
			vehicle.location.includes('София')
		)!.location;
		const excludedLocation = vehicles.find(
			(vehicle) => vehicle.location !== filteredLocation
		)!.location;
		const selectedCount = vehicles.filter(
			(vehicle) => vehicle.location === filteredLocation
		).length;
		const mapResponse = auxeroResponse('inventory', {
			searchParams: new URLSearchParams({
				location: filteredLocation,
				view: 'map'
			})
		});
		const map = await mapResponse.text();

		expect(map).toContain(`data-eliqauto-map-selected="${selectedCount}"`);
		expect(map).toContain(
			`${selectedCount} ${selectedCount === 1 ? 'съвпадащ автомобил' : 'съвпадащи автомобила'}`
		);
		expect(map).toContain(`data-eliqauto-map-location="${filteredLocation}"`);
		expect(map).not.toContain(`data-eliqauto-map-location="${excludedLocation}"`);
		expect(map).toContain('Точната локация за оглед се потвърждава по телефона');
	});

	it('applies rich inventory query filters through the preserved template route', async () => {
		const vehicle = vehicles[0];
		const params = new URLSearchParams({
			Transmission: vehicle.transmission,
			location: vehicle.location,
			maxMileage: String(vehicle.mileage + 1),
			priceFrom: String(vehicle.price - 1),
			priceTo: String(vehicle.price + 1),
			sourceId: vehicle.stockNumber,
			status: 'new',
			yearFrom: String(vehicle.year),
			yearTo: String(vehicle.year)
		});
		const response = auxeroResponse('inventory', { searchParams: params });
		const html = await response.text();

		expect(html).toContain(vehicle.title);
		expect(html).toContain(vehicle.priceLabel);
		expect(html).toContain('Showing 1 - 1 of 1 matching Eliqauto Listings');
		const inventoryStart = html.indexOf('eliqauto-inventory-content');
		const inventoryEnd = html.indexOf('filter-sidebar', inventoryStart);
		const inventoryHtml = html.slice(inventoryStart, inventoryEnd);

		expect(inventoryHtml).toContain(`data-eliqauto-slug="${vehicle.slug}"`);
		expect(inventoryHtml).not.toContain(`data-eliqauto-slug="${vehicles[1].slug}"`);
	});

	it('keeps filtered inventory state in the reference-style toolbar and drawer', async () => {
		const vehicle = vehicles[0];
		const response = auxeroResponse('inventory', {
			searchParams: new URLSearchParams({
				brand: vehicle.brand,
				fuel: vehicle.fuel,
				minYear: String(vehicle.year),
				q: vehicle.model,
				transmission: vehicle.transmission
			})
		});
		const html = await response.text();

		expect(html).toContain('eliqauto-inventory-banner');
		expect(html).toContain('Eliqauto inventory showcase');
		expect(html).toContain('/assets/eliqauto/hero/home-hero-runway-cars-v1.webp');
		expect(html).not.toContain('/assets/eliqauto/megamenu/inventory-audi-a7-cutout.webp');
		expect(html).not.toContain('Eliqauto current stock');
		expect(html).not.toContain('class="background-light mb-32"');
		expect(html).not.toContain('class="breadcrumb"');
		expect(html).toContain('eliqauto-inventory-banner__buybox');
		expect(html).toContain('class="eliqauto-inventory-searchbar"');
		expect(html).toContain('eliqauto-inventory-filter-grid');
		expect(html).not.toContain('eliqauto-inventory-quick-pills');
		expect(html).not.toContain('eliqauto-inventory-quick-pills--results');
		expect(html).toContain('eliqauto-inventory-active-filters--results');
		const bannerEnd = html.indexOf('</section>', html.indexOf('eliqauto-inventory-banner'));
		expect(
			html.indexOf(
				'<div class="eliqauto-inventory-active-filters eliqauto-inventory-active-filters--results"'
			)
		).toBeGreaterThan(bannerEnd);
		expect(html).toContain('Search make, model, year, fuel, extras...');
		expect(html).toContain('name="mileageTo"');
		expect(html).toContain('name="feature"');
		expect(html).toContain('role="search" aria-label="Search Eliqauto inventory"');
		expect(html).toContain('aria-controls="filterSidebar"');
		expect(html).toContain('id="eliqauto-inventory-title"');
		expect(html).toContain('class="eliqauto-sr-only"');
		expect(html).toContain(`value="${vehicle.model}"`);
		expect(html).toContain('eliqauto-inventory-toolbar-row');
		expect(html).toContain('matching Eliqauto Listings');
		expect(html).toContain(
			'body.eliqauto-inventory-template .eliqauto-inventory-content .content-inner.active'
		);
		expect(html).toContain('body.eliqauto-inventory-template .eliqauto-inventory-filter-grid *');
		expect(html).toContain('transition: none;');
		expect(html).toContain(`name="brand" value="${vehicle.brand}" checked`);
		expect(html).toContain(
			`name="FuelType" value="${vehicle.fuel.replace('Petrol', 'Petr&#111;l')}" checked`
		);
		expect(html).toContain(
			'<form class="search-form__form" action="/inventory" method="get" data-eliqauto-search-form="inventory">'
		);
		expect(html).toContain('name="q" placeholder="Search Eliqauto inventory"');
	});

	it('injects selected vehicle data into Listing Details 3', () => {
		const vehicle = vehicles[1];
		const html = renderAuxeroTemplate('listing-details-3.html', { slug: vehicle.slug });

		expect(html).toContain(vehicle.title);
		expect(html).toContain(vehicle.priceLabel);
		expect(html).toContain(vehicle.stockNumber);
		expect(html).toContain(vehicle.image);
		expect(html).toContain('Eliqauto Consultant');
		expect(html).toContain(`data-eliqauto-slug="${vehicle.slug}" data-eliqauto-detail="true"`);
		expect(html).toContain(`data-eliqauto-compare="${vehicle.slug}"`);
		expect(html).toContain(`aria-label="Compare ${vehicle.title}"`);
		expect(html).toContain(`aria-label="Запази ${vehicle.title}"`);
		expect(html).toContain('eliqauto-favorite');
		expect(html).not.toContain('Mike Hanley');
		expect(html).not.toContain('Tony Nguyen');
		expect(html).not.toContain('Honda HR-V');
	});

	it('injects real Eliqauto vehicles into the compare page', () => {
		const html = renderAuxeroTemplate('compare.html');
		const firstVehicle = vehicles[0];

		expect(html).toContain('eliqauto-compare-table');
		expect(html).toContain(firstVehicle.title);
		expect(html).toContain(firstVehicle.priceLabel);
		expect(html).toContain('Source ID');
		expect(html).not.toContain('Audi A6 Avant E-Tron');
		expect(html).not.toContain('Benzin + Plin');
	});

	it('replaces sale agent cards with Eliqauto consultants', () => {
		const html = renderAuxeroTemplate('sale-agents.html');

		for (const agent of agents) {
			expect(html).toContain(agent.name);
			expect(html).toContain(agent.image);
			expect(html).toContain(`/agents/${agent.slug}`);
		}

		expect(html).not.toContain('Robert Fox');
		expect(html).not.toContain('Bessie Cooper');
		expect(html).not.toContain('Brooklyn Simmons');
	});

	it('renders the requested Eliqauto consultant detail page', () => {
		const agent = agents[1];
		const html = renderAuxeroTemplate('sale-agents-details.html', {
			routePath: `agents/${agent.slug}`
		});

		expect(html).toContain(agent.name);
		expect(html).toContain(agent.bio);
		expect(html).toContain(agent.image);
		expect(html).toContain('Verified Eliqauto Consultant');
		expect(html).toContain(eliqautoContact.addressLabel);
		expect(html).not.toContain('Mike Hanley');
		expect(html).not.toContain('Darrell Steward');
		expect(html).not.toContain('Tony Nguyen');
	});

	it('rebrands contact page data and local form behavior', () => {
		const html = renderAuxeroTemplate('contact-us.html');

		expect(html).toContain('Свържете се с Eliqauto');
		expect(html).toContain(eliqautoContact.addressLabel);
		expect(html).toContain('eliqauto-contact-form');
		expect(html).toContain(eliqautoContact.primaryPhoneLabel);
		expect(html).not.toContain('6205 Peachtree Dunwoody Rd');
		expect(html).not.toContain('1-555-678-8888');
		expect(html).not.toContain('1-866-288-6868');
		expect(html).not.toContain('value="Tony"');
	});

	it('renders role-aware admin dashboard data in the preserved dashboard template', () => {
		const html = renderAuxeroTemplate('dashboard.html', { routePath: 'admin' });

		expect(html).toContain('content="admin"');
		expect(html).toContain('Admin Dashboard');
		expect(html).toContain('Eliqauto Inventory');
		expect(html).toContain('Open Leads');
		expect(html).toContain('/assets/images/dashboard/Dashboard.svg');
		expect(html).not.toContain('/assets/images/dashboard/Admin Dashboard.svg');
		expect(html).toContain(vehicles[0].title);
		expect(html).toContain(vehicles[0].priceLabel);
		expect(html).not.toContain('Randynox');
		expect(html).not.toContain('Audi A6 Avant E-Tron');
		expect(html).not.toContain('Benzin + Plin');
	});

	it('renders admin user management from the preserved dashboard surface', () => {
		const html = renderAuxeroTemplate('dashboard.html', { routePath: 'admin/users' });

		expect(html).toContain('content="admin"');
		expect(html).toContain('User Management');
		expect(html).toContain('eliqauto-users-table');
		expect(html).toContain('data-eliqauto-user-role="admin"');
		expect(html).toContain('customer@eliqauto.local');
		expect(html).toContain('Import & leasing lead');
		expect(html).toContain('Role Access Notes');
		expect(html).not.toContain('Randynox');
	});

	it('renders admin agent management with Eliqauto consultant routing actions', () => {
		const html = renderAuxeroTemplate('sale-agents.html', { routePath: 'admin/agents' });

		expect(html).toContain('Управление на консултанти');
		expect(html).toContain('data-eliqauto-agent-management="true"');
		expect(html).toContain('/admin/inquiries?role=admin');
		expect(html).toContain('/admin/messages?role=admin');
		expect(html).not.toContain('Robert Fox');
	});

	it('renders customer dashboard and account compare from saved garage state', () => {
		const session = resolveEliqautoSession('account');
		updateEliqautoGarageState(session, {
			compare: vehicles.slice(4, 7).map((vehicle) => vehicle.slug),
			favorites: vehicles.slice(2, 4).map((vehicle) => vehicle.slug)
		});

		const dashboard = renderAuxeroTemplate('dashboard.html', { routePath: 'account' });
		const compare = renderAuxeroTemplate('compare.html', { routePath: 'account/compare' });

		expect(compare).toBeDefined();
		const compareHtml = compare ?? '';
		const tableStart = compareHtml.indexOf('eliqauto-compare-table');
		const compareTable = compareHtml.slice(tableStart, compareHtml.indexOf('</table>', tableStart));

		expect(dashboard).toContain(
			'data-eliqauto-dashboard-stat="favorites" data-eliqauto-stat-value="2"'
		);
		expect(dashboard).toContain(
			'data-eliqauto-dashboard-stat="compare" data-eliqauto-stat-value="3"'
		);
		expect(compareTable).toContain(`data-eliqauto-compare-column="${vehicles[4].slug}"`);
		expect(compareTable).toContain(`data-eliqauto-compare-column="${vehicles[5].slug}"`);
		expect(compareTable).toContain(`data-eliqauto-compare-column="${vehicles[6].slug}"`);
		expect(compareTable).not.toContain(`data-eliqauto-compare-column="${vehicles[0].slug}"`);

		updateEliqautoGarageState(session, {
			compare: vehicles.slice(0, 2).map((vehicle) => vehicle.slug),
			favorites: vehicles.slice(0, 3).map((vehicle) => vehicle.slug)
		});
	});

	it('renders customer favorites with real Eliqauto vehicles and local-state hook', () => {
		updateEliqautoGarageState(resolveEliqautoSession('account'), {
			compare: vehicles.slice(0, 2).map((vehicle) => vehicle.slug),
			favorites: vehicles.slice(0, 3).map((vehicle) => vehicle.slug)
		});
		const html = renderAuxeroTemplate('my-favorites.html', { routePath: 'account/favorites' });

		expect(html).toContain('data-eliqauto-favorites-grid');
		expect(html).toContain('data-eliqauto-favorites-count="3"');
		expect(html).toContain(vehicles[0].title);
		expect(html).toContain(vehicles[0].priceLabel);
		expect(html).toContain('/account/messages');
		expect(html).not.toContain('2024 Hyundai Elantra');
		expect(html).not.toContain('$44.900,00');
	});

	it('keeps customer account vehicle submission out of admin-only routes', () => {
		const html = renderAuxeroTemplate('dashboard.html', { routePath: 'account' });
		const listings = renderAuxeroTemplate('my-listings.html', { routePath: 'account/listings' });

		expect(html).toContain('Подай автомобил');
		expect(html).toContain('/sell-your-car');
		expect(html).toContain('data-eliqauto-submissions-table');
		expect(listings).toContain('data-eliqauto-submissions-table');
		expect(listings).toContain('Моите автомобили');
		expect(listings).toContain('Client BMW evaluation');
		expect(listings).toContain('Trade-in review request');
		expect(listings).not.toContain('Моите автомобилиs');
		expect(html).not.toContain('/admin/inventory/new?role=customer');
		expect(listings).not.toContain('/admin/inventory/new?role=customer');
	});

	it('uses a contextual dashboard header instead of the public mega-menu on account templates', () => {
		const html = renderAuxeroTemplate('dashboard.html', { routePath: 'admin/users' });

		expect(html).toContain('data-eliqauto-dashboard-context-header');
		expect(html).toContain('data-eliqauto-dashboard-context-nav');
		expect(html).toContain('Admin dashboard');
		expect(html).toContain('User Management');
		expect(html).toContain('href="/inventory"');
		expect(html).toContain('Eliqauto Inventory');
		expect(html).toContain('href="/admin"');
		expect(html).not.toContain('sub-menu--main');
		expect(html).not.toContain('>Pages<');
		expect(html).not.toContain('>Listing<');
		expect(html).not.toContain('>News<');
	});

	it('renders Eliqauto account messages instead of template contacts', () => {
		const html = renderAuxeroTemplate('message.html', { routePath: 'admin/inquiries' });
		const customerHtml = renderAuxeroTemplate('message.html', { routePath: 'account/messages' });

		expect(html).toContain('Inquiries & Messages');
		expect(html).toContain('Import & leasing lead');
		expect(html).toContain('Customer asked for source history');
		expect(html).toContain('data-eliqauto-message-container');
		expect(html).toContain(eliqautoContact.emailLabel);
		expect(customerHtml).toContain('data-eliqauto-message-container');
		expect(customerHtml).toContain('Eliqauto Sales');
		expect(customerHtml).toContain('Please send appointment options');
		expect(html).not.toContain('Marvin McKinney');
		expect(html).not.toContain('John Smith');
		expect(html).not.toContain('grew-sra@gmail.com');
		expect(html).not.toContain('data-contact="john"');
		expect(customerHtml).not.toContain('data-contact="john"');
	});

	it('keeps agent admin navigation scoped to allowed lead and message surfaces', () => {
		const html = renderAuxeroTemplate('message.html', {
			routePath: 'admin/inquiries',
			searchParams: new URLSearchParams('role=agent')
		});
		const agentInquiryCount = listInquiriesForRole('agent').length;
		const agentMessageCount = listMessagesForRole('agent').length;

		expect(html).toContain('content="agent"');
		expect(html).toContain('/admin/inquiries?role=agent');
		expect(html).toContain('/admin/messages?role=agent');
		expect(html).toContain('/account/profile?role=agent');
		expect(html).toContain('/account/password?role=agent');
		expect(html).toContain(`data-eliqauto-menu-badge="inquiries">${agentInquiryCount}</span>`);
		expect(html).toContain(`data-eliqauto-menu-badge="messages">${agentMessageCount}</span>`);
		expect(html).not.toContain('href="/admin/inventory"');
		expect(html).not.toContain('href="/admin/inventory/new"');
		expect(html).not.toContain('href="/admin/agents"');
		expect(html).not.toContain('href="/admin/users"');
	});

	it('wires preserved account logout controls to the Eliqauto session API', () => {
		const html = renderAuxeroTemplate('dashboard.html', { routePath: 'account' });

		expect(html).toContain('data-eliqauto-menu-item="logout"');
		expect(html).toContain('data-eliqauto-user-menu-item="logout"');
		expect(html).toContain('/api/auth/logout');
		expect(html).toContain('localStorage.removeItem(sessionKey)');
	});

	it('wires preserved auth modal fields to Eliqauto account APIs', () => {
		const html = renderAuxeroTemplate('home-09.html');

		expect(html).toContain('#LoginModal form, #SignUpModal form, #ForgotPasswordModal form');
		expect(html).toContain("payload['email-login']");
		expect(html).toContain("payload['Password-login']");
		expect(html).toContain("payload['SignUp-login']");
		expect(html).toContain("payload['Password-SignUp']");
		expect(html).toContain('name="ConfirmPassword-SignUp"');
		expect(html).toContain("payload['email-forgot-password']");
		expect(html).toContain("'/api/auth/register'");
		expect(html).toContain("'/api/auth/recovery'");
		expect(html).toContain('Customer account created locally for Eliqauto');
		expect(html).toContain('Password recovery request queued locally for Eliqauto');
		expect(html).not.toContain('value="eliqauto@gmail.com" type="email" id="email-login"');
		expect(html).not.toContain('value="eliqauto@gmail.com" type="email" id="SignUp-login"');
	});

	it('derives dashboard prototype garage role without enabling public pages', () => {
		const html = renderAuxeroTemplate('listing-grid3-columns.html');

		expect(html).toContain(
			"const roleFromUrl = new URLSearchParams(window.location.search).get('role')"
		);
		expect(html).toContain("window.location.pathname.startsWith('/account')");
		expect(html).toContain("window.location.pathname.startsWith('/admin')");
		expect(html).toContain('? runtimeData.account.session.role');
		expect(html).toContain("headers['x-eliqauto-prototype-role'] = prototypeRole");
		expect(html).toContain('...(prototypeRole ? { role: prototypeRole } : {})');
		expect(html).toContain("prototypeRole ? '?role=' + encodeURIComponent(prototypeRole) : ''");
	});

	it('scopes generated runtime listeners so route replays replace previous handlers', () => {
		const html = renderAuxeroTemplate('listing-grid3-columns.html');

		expect(html).toContain('window.__ELIQAUTO_RUNTIME_ABORT_CONTROLLER__');
		expect(html).toContain('previousRuntimeController.abort()');
		expect(html).toContain('runtimeCaptureListenerOptions');
		expect(html).toContain('runtimeListenerOptions');
		expect(html).toContain("!table.hasAttribute('data-eliqauto-svelte-compare-table')");
		expect(html).toContain("document.addEventListener('click', (event) => {");
		expect(html).toContain('}, runtimeCaptureListenerOptions);');
		expect(html).toContain('}, runtimeListenerOptions);');
	});

	it('wires preserved global search forms to Eliqauto inventory search', () => {
		const home = renderAuxeroTemplate('home-09.html');
		const listing = renderAuxeroTemplate('listing-grid3-columns.html');

		for (const html of [home, listing]) {
			expect(html).toContain(
				'<form class="search-form__form" action="/inventory" method="get" data-eliqauto-search-form="inventory">'
			);
			expect(html).toContain(
				'<form class="search-modal__form" action="/inventory" method="get" data-eliqauto-search-form="inventory">'
			);
			expect(html).toContain('class="search-form__input" name="q"');
			expect(html).toContain('class="search-modal__input" name="q"');
			expect(html).toContain('form.matches(\'[data-eliqauto-search-form="inventory"]\')');
			expect(html).toContain('const inventorySearchUrl = (form) =>');
			expect(html).toContain('const ensureInventoryUrlState = async () =>');
			expect(html).toContain("cache: 'no-store'");
			expect(html).toContain("'.eliqauto-inventory-content'");
			expect(html).toContain("if (searchMode !== 'inventory' && action !== '/inventory') return;");
			expect(html).toContain('go(inventorySearchUrl(form))');
		}
	});

	it('wires profile, password, and add-listing forms to Eliqauto local account behavior', () => {
		const profile = renderAuxeroTemplate('my-profile.html', { routePath: 'account/profile' });
		const password = renderAuxeroTemplate('change-password.html', {
			routePath: 'account/password'
		});
		const addListing = renderAuxeroTemplate('add-listings-2.html', {
			routePath: 'admin/inventory/new'
		});

		expect(profile).toContain('eliqauto-profile-form');
		expect(profile).toContain('data-eliqauto-profile-form');
		expect(profile).toContain('customer@eliqauto.local');
		expect(profile).toContain('Save Locally');
		expect(profile).toContain('+359 893 588 680');
		expect(profile).toContain('value="Eliqauto"');
		expect(password).toContain('eliqauto-password-form');
		expect(password).toContain('data-eliqauto-password-form');
		expect(password).not.toContain('eliqauto@2026');
		expect(addListing).toContain('eliqauto-add-listing-form');
		expect(addListing).toContain('data-eliqauto-add-listing-form');
		expect(addListing).toContain('data-eliqauto-form-target=".eliqauto-add-listing-form"');
		expect(addListing).toContain('data-eliqauto-submit-form="true"');
		expect(addListing).toContain('data-eliqauto-listing-status="draft"');
		expect(addListing).toContain('data-eliqauto-listing-status="published"');
		expect(addListing).toContain('name="actorRole" value="admin"');
		expect(addListing).toContain("'/api/inventory/listings'");
		expect(addListing).toContain('Add Listing');
		expect(addListing).toContain(vehicles[0].title);
		expect(addListing).toContain('Vehicle description and inspection notes');
		expect(addListing).not.toContain('6205 Peachtree Dunwoody Rd');
		expect(addListing).not.toContain('Lorem ipsum');
	});

	it('renders admin inventory edit forms from the same preserved Auxero add-listing layout', () => {
		const listing = createInventoryListing({
			mileage: '12 300 km',
			priceLabel: '44 000 EUR',
			status: 'draft',
			title: 'Eliqauto Managed Edit Draft',
			vin: 'EDIT-DRAFT-001'
		});
		const html = renderAuxeroTemplate('add-listings-2.html', {
			routePath: `admin/inventory/edit/${listing.id}`
		});

		expect(html).toContain('Edit Listing');
		expect(html).toContain('data-eliqauto-admin-listing-mode="edit"');
		expect(html).toContain('data-eliqauto-add-listing-form');
		expect(html).toContain(`name="listingId" value="${listing.id}"`);
		expect(html).toContain('value="Eliqauto Managed Edit Draft"');
		expect(html).toContain('value="44 000 EUR"');
		expect(html).toContain('value="EDIT-DRAFT-001"');
		expect(html).toContain("listingId ? 'PATCH' : 'POST'");
	});

	it('renders sell-your-car and services pages with Eliqauto support forms', () => {
		const sell = renderAuxeroTemplate('sell-your-car.html');
		const services = renderAuxeroTemplate('services-center.html');

		expect(sell).toContain('Продай автомобила си с Eliqauto');
		expect(sell).toContain('eliqauto-sell-form');
		expect(sell).toContain(eliqautoContact.primaryPhoneLabel);
		expect(sell).toContain('Заявката е подготвена. Eliqauto ще се свърже с вас.');
		expect(sell).not.toContain('Certified Dealers');
		expect(sell).not.toContain('Zip Code');
		expect(sell).not.toContain('1-555-678-8888');
		expect(services).toContain('Услуги от Eliqauto');
		expect(services).toContain('Внос и лизинг');
		expect(services).toContain('eliqauto-service-form');
		expect(services).toContain('Service request queued locally for Eliqauto');
		expect(services).not.toContain('image-effect-scale');
		expect(services).not.toContain('Comprehensive Vehicle Care');
		expect(services).not.toContain('Tony Nguyen');
	});

	it('renders Eliqauto about and reviews content without demo executives', () => {
		const about = renderAuxeroTemplate('about-us.html');
		const reviews = renderAuxeroTemplate('clients-reviews.html');

		expect(about).toContain('Услуги около внос, оглед и продажба');
		expect(about).toContain('Екипът зад процеса');
		expect(about).toContain(agents[0].name);
		expect(reviews).toContain('Aleksandar Vytev');
		expect(reviews).toContain('Krasimir Georgiev');
		expect(reviews).not.toContain('Emily Johnson');
		expect(reviews).not.toContain('CEO Avitex');
		expect(about).not.toContain('Robert Fox');
		expect(about).not.toContain('President and Chief Executive Officer');
	});

	it('renders Eliqauto FAQ, terms, and calculator support surfaces', () => {
		const faqs = renderAuxeroTemplate('faqs.html');
		const terms = renderAuxeroTemplate('terms.html');
		const calculator = renderAuxeroTemplate('calculator.html');

		expect(faqs).toContain('Защо да внеса автомобил с проверена история?');
		expect(faqs).toContain('Може ли Eliqauto да помогне при продажба на моя автомобил?');
		expect(faqs).not.toContain('Required documents for financing or leasing?');
		expect(terms).toContain('Условия за използване на Eliqauto');
		expect(terms).toContain('Информация за автомобилите');
		expect(terms).not.toContain('Lorem ipsum');
		expect(calculator).toContain('Калкулатор за внос');
		expect(calculator).toContain('data-eliqauto-calculator');
		expect(calculator).toContain('38 640 EUR');
		expect(calculator).not.toContain('$46.300');
		expect(calculator).not.toContain('What is an Auto Loan?');
	});

	it('renders Eliqauto blog list and detail pages from real posts', () => {
		const list = renderAuxeroTemplate('blog-grid-style-1.html');
		const detail = renderAuxeroTemplate('blog-details-1.html', {
			routePath: `blog/${posts[0].slug}`
		});

		for (const post of posts) {
			expect(list).toContain(post.title);
			expect(list).toContain(`/blog/${post.slug}`);
		}

		expect(detail).toContain(posts[0].title);
		expect(detail).toContain(posts[0].content[0]);
		expect(detail).toContain('eliqauto-blog-comment-form');
		expect(detail).toContain('eliqauto-newsletter-form');
		expect(detail).toContain('Comment saved locally for Eliqauto review');
		expect(list).not.toContain('Hybrid vs. Electric Cars');
		expect(detail).not.toContain('Compact SUV vs. Full-Size SUV');
		expect(detail).not.toContain('Mike Hanley');
		expect(detail).not.toContain('Tony Nguyen');
	});

	it('wires preserved Auxero newsletter forms into Eliqauto message capture', () => {
		const publicHtml = renderAuxeroTemplate('home-09.html');
		const accountHtml = renderAuxeroTemplate('dashboard.html', { routePath: 'account' });

		expect(publicHtml).toContain('class="form-footer relative"');
		expect(publicHtml).toContain('.eliqauto-newsletter-form, .form-footer, .newsletter-form');
		expect(publicHtml).toContain("'/api/messages'");
		expect(publicHtml).toContain('Newsletter signup saved locally for Eliqauto');
		expect(accountHtml).toContain('class="newsletter-form mb-16"');
		expect(accountHtml).toContain('.eliqauto-newsletter-form, .form-footer, .newsletter-form');
	});

	it('protects admin routes with the pragmatic role helper', () => {
		const customer = resolveEliqautoSession('admin', new URLSearchParams('role=customer'));
		const agent = resolveEliqautoSession('admin/inquiries', new URLSearchParams('role=agent'));
		const blocked = auxeroResponse('dashboard.html', { routePath: 'admin' });
		const guarded = auxeroRouteResponseWithCustomerRole();

		expect(canAccessEliqautoRoute(customer, 'admin')).toBe(false);
		expect(canAccessEliqautoRoute(agent, 'admin/inquiries')).toBe(true);
		expect(blocked.status).toBe(200);
		expect(guarded.status).toBe(403);
	});

	it('honors authenticated page session cookies for protected admin and account routes', async () => {
		const customer = requestForSession('admin/users', 'customer');
		const admin = requestForSession('admin/users', 'admin');
		const agent = requestForSession('admin/users', 'agent');
		const agentInquiries = requestForSession('admin/inquiries', 'agent');

		const anonymousAdmin = auxeroRouteResponse('admin/users', {
			request: new Request('http://localhost/admin/users')
		});
		const anonymousAccount = auxeroRouteResponse('account/messages', {
			request: new Request('http://localhost/account/messages')
		});
		const prototypeAdmin = auxeroRouteResponse('admin/users', {
			request: new Request('http://localhost/admin/users?role=admin'),
			searchParams: new URLSearchParams('role=admin')
		});
		const customerDenied = auxeroRouteResponse('admin/users', { request: customer.request });
		const adminAllowed = auxeroRouteResponse('admin/users', { request: admin.request });
		const agentDenied = auxeroRouteResponse('admin/users', { request: agent.request });
		const agentAllowed = auxeroRouteResponse('admin/inquiries', {
			request: agentInquiries.request
		});
		const anonymousAdminHtml = await anonymousAdmin.text();
		const anonymousAccountHtml = await anonymousAccount.text();
		const adminHtml = await adminAllowed.text();
		const agentHtml = await agentAllowed.text();

		expect(anonymousAdmin.status).toBe(200);
		expect(anonymousAdminHtml).toContain('User Management');
		expect(anonymousAdminHtml).toContain('content="admin"');
		expect(anonymousAccount.status).toBe(200);
		expect(anonymousAccountHtml).toContain('Messages');
		expect(anonymousAccountHtml).toContain('content="customer"');
		expect(prototypeAdmin.status).toBe(200);
		expect(customerDenied.status).toBe(403);
		expect(adminAllowed.status).toBe(200);
		expect(adminHtml).toContain('User Management');
		expect(adminHtml).toContain('content="admin"');
		expect(agentDenied.status).toBe(403);
		expect(agentAllowed.status).toBe(200);
		expect(agentHtml).toContain('content="agent"');
		expect(agentHtml).toContain('/admin/inquiries?role=agent');
		expect(agentHtml).not.toContain('href="/admin/users"');
	});

	it('uses authenticated account cookies for saved compare state on account pages', async () => {
		const customer = requestForSession('account/compare', 'customer');
		const savedVehicle = vehicles[1];

		updateEliqautoGarageState(customer.session!, {
			compare: [savedVehicle.slug],
			favorites: []
		});

		const response = auxeroRouteResponse('account/compare', { request: customer.request });
		const html = await response.text();

		expect(response.status).toBe(200);
		expect(html).toContain(`data-eliqauto-compare-column="${savedVehicle.slug}"`);
		expect(html).toContain(savedVehicle.title);
	});
});

const auxeroRouteResponseWithCustomerRole = () =>
	auxeroRouteResponse('admin', { searchParams: new URLSearchParams('role=customer') });
