import { describe, expect, it } from 'vitest';
import { eliqautoContact } from '$lib/data/eliqauto';
import { vehicles } from '$lib/data/vehicles';
import { accountContext } from './account-dashboard-state';
import { accountProfileMapEmbedUrl } from './account-profile-state';
import {
	accountListingFormData,
	getAccountListingFormData,
	listingFormFieldValue
} from './account-listing-form-state';

const hiddenFieldsByName = (form: ReturnType<typeof getAccountListingFormData>) =>
	Object.fromEntries(form.hiddenFields.map((field) => [field.name, field.value]));

describe('account-listing-form-state', () => {
	it('builds create-mode admin listing form data without template demo values', () => {
		const form = getAccountListingFormData('add-listings-2.html', {
			routePath: 'admin/inventory/new',
			searchParams: new URLSearchParams('role=admin')
		});
		const hidden = hiddenFieldsByName(form);
		const seedVehicle = vehicles[0];

		expect(form).toMatchObject({
			address: eliqautoContact.addressLabel,
			mapEmbedUrl: accountProfileMapEmbedUrl,
			mode: 'create',
			priceLabel: seedVehicle?.priceLabel,
			sourceUrl: seedVehicle?.sourceUrl
		});
		expect(hidden).toMatchObject({
			actorRole: 'admin',
			role: 'admin',
			routePath: 'admin/inventory/new',
			status: 'draft'
		});
		expect(hidden).not.toHaveProperty('listingId');
		expect(hidden).not.toHaveProperty('sourceId');
		expect(listingFormFieldValue(form, 'title')).toBe(seedVehicle?.title);
		expect(listingFormFieldValue(form, 'EnterVIN')).toBe(seedVehicle?.stockNumber);
		expect(listingFormFieldValue(form, 'mileage')).toMatch(/km$/);
		expect(form.detailFields).toHaveLength(18);
		expect(form.featureGroups).toHaveLength(5);
		expect(form.galleryImages).toHaveLength(7);
		expect(form.attachments).toHaveLength(2);
		expect(JSON.stringify(form)).not.toContain('6205 Peachtree');
		expect(JSON.stringify(form)).not.toContain('Lorem ipsum');
		expect(JSON.stringify(form)).not.toContain('Audi A6 Avant E-Tron');
	});

	it('hydrates edit-mode static inventory data from the requested route slug', () => {
		const vehicle = vehicles[0];
		const form = getAccountListingFormData('add-listings-2.html', {
			routePath: `admin/inventory/edit/${vehicle?.slug}`,
			searchParams: new URLSearchParams('role=admin')
		});
		const hidden = hiddenFieldsByName(form);

		expect(form.mode).toBe('clone-static');
		expect(form.address).toBe(vehicle?.location);
		expect(form.priceLabel).toBe(vehicle?.priceLabel);
		expect(form.sourceUrl).toBe(vehicle?.sourceUrl);
		expect(hidden).toMatchObject({
			actorRole: 'admin',
			role: 'admin',
			routePath: `admin/inventory/edit/${vehicle?.slug}`,
			sourceId: vehicle?.slug,
			status: 'published'
		});
		expect(hidden).not.toHaveProperty('listingId');
		expect(listingFormFieldValue(form, 'title')).toBe(vehicle?.title);
		expect(listingFormFieldValue(form, 'EnterVIN')).toBe(vehicle?.vin);
		expect(listingFormFieldValue(form, 'Enternumber')).toBe(vehicle?.priceLabel);
		expect(listingFormFieldValue(form, 'Enterengine')).toBe(vehicle?.engine);
		expect(listingFormFieldValue(form, 'Color')).toBe(vehicle?.exterior);
	});

	it('keeps direct state helpers aligned with route-friendly accessors', () => {
		const options = {
			routePath: `admin/inventory/edit/${vehicles[1]?.slug}`,
			searchParams: new URLSearchParams('role=admin')
		};

		expect(accountListingFormData(accountContext('add-listings-2.html', options), options)).toEqual(
			getAccountListingFormData('add-listings-2.html', options)
		);
	});
});
