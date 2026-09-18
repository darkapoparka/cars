import { describe, expect, it } from 'vitest';
import { validateImportVehicle, validateLeadContact, validateSellVehicle } from './lead-validation';
import { contactLinks } from './contact-links';

const vehicle = { plate: '', vin: '', make: '', model: '', year: '', mileage: '' };
const request = { sourceUrl: '', query: '', year: '', budget: '' };

describe('lead validation', () => {
	it('requires make AND model when no identifier is supplied', () => {
		expect(validateSellVehicle({ ...vehicle, make: 'BMW' })?.field).toBe('model');
		expect(validateSellVehicle({ ...vehicle, model: 'X5' })?.field).toBe('make');
		expect(validateSellVehicle({ ...vehicle, make: 'BMW', model: 'X5' })).toBeNull();
	});
	it('accepts optional identifiers but rejects malformed VINs', () => {
		expect(validateSellVehicle({ ...vehicle, plate: 'СВ 1234 АВ' })).toBeNull();
		expect(validateSellVehicle({ ...vehicle, vin: 'WBA12345678901234' })).toBeNull();
		expect(validateSellVehicle({ ...vehicle, vin: 'WBA1234567890123I' })?.field).toBe('vin');
	});
	it('validates whole quantities and bounded years', () => {
		expect(validateSellVehicle({ ...vehicle, plate: 'AB12', year: '1890' }, 2026)?.field).toBe(
			'year'
		);
		expect(validateSellVehicle({ ...vehicle, plate: 'AB12', year: '2030' }, 2026)?.field).toBe(
			'year'
		);
		expect(validateSellVehicle({ ...vehicle, plate: 'AB12', mileage: '-1' })?.field).toBe(
			'mileage'
		);
		expect(validateSellVehicle({ ...vehicle, plate: 'AB12', mileage: '120 000' })).toBeNull();
		expect(validateSellVehicle({ ...vehicle, plate: 'AB12', mileage: '0' })).toBeNull();
	});
	it('validates import URLs, numeric budget and explicit request', () => {
		expect(validateImportVehicle(request)?.field).toBe('query');
		expect(validateImportVehicle({ ...request, sourceUrl: 'javascript:alert(1)' })?.field).toBe(
			'sourceUrl'
		);
		expect(validateImportVehicle({ ...request, sourceUrl: 'https://example.com/car' })).toBeNull();
		expect(validateImportVehicle({ ...request, query: 'X5', budget: 'forty' })?.field).toBe(
			'budget'
		);
		expect(validateImportVehicle({ ...request, query: 'X5', budget: '40 000' })).toBeNull();
	});
	it.each(['+359 888 123 456', '0888123456', '+44 20 7946 0958'])(
		'accepts real phone shape %s',
		(value) => {
			expect(validateLeadContact(value, true)).toBeNull();
		}
	);
	it.each(['', 'foo', 'a@b', '12', '<script>'])('rejects invalid contact %s', (value) => {
		expect(validateLeadContact(value)).not.toBeNull();
	});
	it('permits email only for the combined-contact flow', () => {
		expect(validateLeadContact('audit@example.invalid')).toBeNull();
		expect(validateLeadContact('audit@example.invalid', true)).not.toBeNull();
	});
	it('constructs destinations from international config without Bulgarian slicing', () => {
		expect(contactLinks('+442079460958')).toEqual({
			phoneHref: 'tel:+442079460958',
			viberHref: 'viber://chat?number=%2B442079460958'
		});
		expect(() => contactLinks('0888123456')).toThrow();
	});
});
