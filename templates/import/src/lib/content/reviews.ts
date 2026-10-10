import type { Locale } from '$lib/locale/core';

export type ReviewRoleKind = 'customer' | 'purchase' | 'sale' | 'import' | 'delivery' | 'viewing';

export const reviewRatingScale = 5;

export const reviewPresentationCopy = {
	bg: { sample: 'Демо', rating: 'Оценка', outOf: 'от' },
	en: { sample: 'Demo', rating: 'Rating', outOf: 'out of' }
} as const satisfies Record<Locale, Record<string, string>>;

/** Missing or invalid scores stay absent; each score comes from the review data. */
export const reviewRatingPresentation = (locale: Locale, rating?: number) => {
	if (rating === undefined || !Number.isFinite(rating) || rating < 1 || rating > reviewRatingScale)
		return undefined;
	const copy = reviewPresentationCopy[locale];
	const score = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(rating);
	return {
		label: `${score} / ${reviewRatingScale}`,
		accessibleLabel: `${copy.rating}: ${score} ${copy.outOf} ${reviewRatingScale}`
	};
};

export const reviewRoleCopy = {
	bg: {
		customer: 'Клиент',
		purchase: 'Покупка',
		sale: 'Продажба',
		import: 'Внос',
		delivery: 'Доставка',
		viewing: 'Оглед'
	},
	en: {
		customer: 'Customer',
		purchase: 'Purchase',
		sale: 'Sale',
		import: 'Import',
		delivery: 'Delivery',
		viewing: 'Viewing'
	}
} as const satisfies Record<Locale, Record<ReviewRoleKind, string>>;
