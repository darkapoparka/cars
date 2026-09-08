import { describe, expect, it } from 'vitest';
import { auxeroServiceCards, serviceFormData } from './services';

describe('auxeroServiceCards', () => {
	it('keeps service card data aligned with the service form options', () => {
		expect(auxeroServiceCards).toHaveLength(6);
		expect(serviceFormData.serviceOptions).toEqual(
			auxeroServiceCards.map((service) => service.title)
		);
		expect(auxeroServiceCards.map((service) => service.href)).toEqual([
			'/contact',
			'/compare',
			'/sell-your-car',
			'/services',
			'/contact',
			'/compare'
		]);
	});
});
