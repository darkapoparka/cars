import { describe, expect, it } from 'vitest';
import { reviewRatingPresentation } from './reviews';

describe('review rating presentation', () => {
	it('keeps missing and invalid ratings absent', () => {
		for (const rating of [undefined, NaN, Infinity, -1, 0, 6]) {
			expect(reviewRatingPresentation('bg', rating)).toBeUndefined();
		}
	});

	it('formats a supplied score and its accessible description in the chosen locale', () => {
		expect(reviewRatingPresentation('bg', 4.5)).toEqual({
			label: '4,5 / 5',
			accessibleLabel: 'Оценка: 4,5 от 5'
		});
		expect(reviewRatingPresentation('en', 4.5)).toEqual({
			label: '4.5 / 5',
			accessibleLabel: 'Rating: 4.5 out of 5'
		});
	});
});
