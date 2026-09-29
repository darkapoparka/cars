import { expect, it } from 'vitest';
import { load as loadHome2 } from '../../routes/presentation/home2/+page.server';
import { load as loadHome3 } from '../../routes/presentation/home3/+page.server';
import { templateText } from './messages';

it.each(['en', 'bg'] as const)(
	'covers retained presentation loader display fields in %s',
	(locale) => {
		const a = loadHome2(),
			b = loadHome3();
		const copy = [
			...a.shortcutPills,
			...a.budgetTiles.map((x) => x.label),
			...a.featuredCars.flatMap((x) => [x.summary, x.badge, x.saving]),
			...a.bodyTypes.map((x) => x.body),
			...b.navItems.filter((x) => x !== 'Electric'),
			...b.searchTabs.map((x) => x.placeholder),
			...b.shortcutPills.map((x) => x.label),
			...b.sellPoints,
			...b.budgetTiles.map((x) => x.label),
			...b.newsCards.map((x) => x.title),
			...b.bodyTypes.map((x) => x.body),
			...b.premiumCars.map((x) => x.badge)
		];
		const missing: string[] = [];
		for (const text of copy) {
			try {
				templateText(locale, text);
			} catch {
				missing.push(text);
			}
		}
		expect(missing).toEqual([]);
	}
);
