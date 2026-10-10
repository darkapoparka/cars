import { describe, expect, it } from 'vitest';
import { homePageData } from './home';

describe('Home inventory snapshot', () => {
	it('can build the public browse cards from the same request inventory as the hero', () => {
		const data = homePageData(new URL('https://example.test/en'), 'en');
		expect(data.brands.find((card) => card.allTile)?.stockCount).toBe(
			data.types.find((card) => card.allTile)?.stockCount
		);
		expect(data.brands.every((card) => Number.isInteger(card.stockCount))).toBe(true);
	});
});
