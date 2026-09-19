import { expect, it } from 'vitest';
import { readDesktopSort, readMobileSort } from './inventory-url';

it.each(['constructor', '__proto__', 'toString', 'unknown', '', null])(
	'rejects unsupported sort input %s',
	(value) => {
		expect(readMobileSort(value)).toBe('price-asc');
		expect(readDesktopSort(value)).toBe('best-match');
	}
);
