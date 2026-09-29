import { describe, expect, it } from 'vitest';
import { calculateFinance, financeDefaults, formatFinanceEur } from '../utils/finance-estimate';
import { shortFuel } from '../utils/format';
import { templateText } from './messages';
import { stockValue } from './stock';
import { localizedSeo } from './seo';

describe('finance and native display sources', () => {
	it.each(['en', 'bg'] as const)(
		'renders every finance failure in %s without changing calculation inputs',
		(locale) => {
			for (const changed of [
				{ price: 'bad' },
				{ price: '0' },
				{ months: '0' },
				{ months: '121' },
				{ deposit: '999999' },
				{ tradeIn: '999999' },
				{ annualRate: '101' },
				{ feePercent: '101' }
			]) {
				const result = calculateFinance({ ...financeDefaults, ...changed });
				expect(result.valid).toBe(false);
				if (result.valid) continue;
				expect(/[А-Яа-я]/.test(templateText(locale, result.error))).toBe(locale === 'bg');
			}
			expect(formatFinanceEur(1234.56, locale)).toBe(
				new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'bg-BG', {
					style: 'currency',
					currency: 'EUR',
					maximumFractionDigits: 2
				}).format(1234.56)
			);
		}
	);
	it('uses explicit compact fuel labels and preserves unknown stock identifiers', () => {
		expect(shortFuel('Електрически', 'en')).toBe('Electric');
		expect(shortFuel('Електрически', 'bg')).toBe('Електрич.');
		expect(shortFuel('Бензин/Газ', 'en')).toBe('Petrol/LPG');
		expect(shortFuel('stock-fuel-123', 'en')).toBe('stock-fuel-123');
		expect(stockValue('en', '90 000 лв.')).toBe('90,000 BGN');
	});
	it.each(['/en/home1', '/variant-3/en/home1-box'])(
		'localizes retained home alias metadata %s',
		(path) => {
			const metadata = localizedSeo('en', path, { title: 'Български', description: 'Български' });
			expect(metadata.title).toContain('Checked cars');
			expect(/[А-Яа-я]/.test(metadata.description)).toBe(false);
		}
	);
});
