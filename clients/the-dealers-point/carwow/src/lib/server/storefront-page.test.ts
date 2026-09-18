import { describe, expect, it } from 'vitest';
import { cars } from '$lib/data/daynight-vehicles';
import { buildHomePageData } from './home-page-data';
import { buildInventoryPageData, buildInventoryMapPageData } from './daynight-inventory-page';
import { buildVehicleDetailPageData } from './daynight-detail-page';

describe('native storefront data adapters', () => {
	it('keeps an empty published catalog empty in every composition', () => {
		const home = buildHomePageData({ title: 'Empty catalog' }, []);
		expect(home.mobileHome.total).toBe(0);
		expect(home.desktopHome.vehicles).toEqual([]);
		expect(home.mobileHome.featuredCars).toEqual([]);
		expect(buildInventoryPageData([]).vehicles).toEqual([]);
		expect(buildInventoryMapPageData([]).vehicles).toEqual([]);
		expect(buildVehicleDetailPageData(cars[0].slug, [])).toBeNull();
	});
	it('shares one explicit catalog between home, list, map, and detail', () => {
		const inventory = cars.slice(0, 3);
		expect(buildHomePageData({ title: 'Stock' }, inventory).mobileHome.total).toBe(3);
		expect(buildInventoryPageData(inventory).vehicles.map((car) => car.slug)).toEqual(
			inventory.map((car) => car.slug)
		);
		expect(buildInventoryMapPageData(inventory).vehicles).toEqual(
			buildInventoryPageData(inventory).vehicles
		);
		expect(buildVehicleDetailPageData(inventory[0].slug, inventory)?.vehicle).toBe(inventory[0]);
	});
	it('never serializes executable template fields into native pages', () => {
		for (const page of [
			buildInventoryPageData(cars),
			buildInventoryMapPageData(cars),
			buildVehicleDetailPageData(cars[0].slug, cars)
		]) {
			for (const field of [
				'scriptSrcs',
				'headStyles',
				'mainHtml',
				'headerHtml',
				'footerHtml',
				'templateFile'
			]) {
				expect(page).not.toHaveProperty(field);
			}
		}
	});
	it('does not mutate source inventory when ranking featured or similar vehicles', () => {
		const inventory = cars.slice(0, 6);
		const order = inventory.map((car) => car.slug);
		buildHomePageData({ title: 'Stock' }, inventory);
		const detail = buildVehicleDetailPageData(inventory[0].slug, inventory);
		expect(inventory.map((car) => car.slug)).toEqual(order);
		expect(detail?.detailSimilarVehicles.every((car) => car.slug !== inventory[0].slug)).toBe(true);
	});
});
