import type { Locale } from '$lib/locale/core';

export type ReviewRoleKind = 'customer' | 'purchase' | 'sale' | 'import' | 'delivery' | 'viewing';

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
