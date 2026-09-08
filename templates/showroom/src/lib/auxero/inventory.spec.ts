import { describe, expect, it } from 'vitest';
import { inventoryCardDisplayTitle } from './inventory';

describe('inventoryCardDisplayTitle', () => {
	it('turns raw feed titles into readable card headings', () => {
		expect(
			inventoryCardDisplayTitle('Audi A5 3.0TDI S LINE FACELIFT LED NAVI B&O ЛИЗИНГ 100%')
		).toBe('Audi A5 3.0TDI S Line Facelift');
		expect(inventoryCardDisplayTitle('BMW 750 I LONG XDRIVE LED NAVI 360 B&W ЛИЗИНГ 100%')).toBe(
			'BMW 750 i Long xDrive'
		);
		expect(
			inventoryCardDisplayTitle('Mercedes-Benz S 500 LONG FACELIFT LED ПАНО H&K 3XTV ЛИЗИНГ 100%')
		).toBe('Mercedes-Benz S 500 Long Facelift');
	});
});
