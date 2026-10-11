import { describe, expect, it } from 'vitest';
import {
	compactCardFuel,
	compactCardMileage,
	compactCardTransmission
} from './vehicle-card-labels';

describe('compact vehicle card labels', () => {
	it('shortens petrol and LPG combinations without rewriting other fuels', () => {
		for (const value of [
			'Бензин/LPG',
			'Бензин/лпг',
			'Бензин + газ',
			'Petrol/LPG',
			'Gasoline + LPG',
			'lpg'
		]) {
			expect(compactCardFuel(value)).toBe('LPG');
		}
		for (const value of ['Бензин', 'Дизел', 'Hybrid', 'LPG', 'Diesel/LPG', 'On request']) {
			expect(compactCardFuel(value)).toBe(value);
		}
	});

	it('keeps the distance scale and unit while compacting long readings', () => {
		expect(compactCardMileage('125 900 км', 'bg')).toBe('125,9k км');
		expect(compactCardMileage('140\u00a0000 km', 'bg')).toBe('140k км');
		expect(compactCardMileage('125,900 km', 'en')).toBe('125.9k km');
		expect(compactCardMileage('104,129 mi', 'en')).toBe('104.1k mi');
		expect(compactCardMileage('9 500 км', 'bg')).toBe('9 500 км');
		expect(compactCardMileage('On request', 'en')).toBe('On request');
		expect(compactCardMileage('12,345.6 km', 'en')).toBe('12,345.6 km');
	});

	it('shortens the English automatic label', () => {
		expect(compactCardTransmission('Automatic')).toBe('Auto');
		expect(compactCardTransmission('Автомат')).toBe('Автомат');
		expect(compactCardTransmission('Manual')).toBe('Manual');
	});
});
