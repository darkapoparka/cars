import { describe, expect, it } from 'vitest';
import { importEntryComplete, importEntryFromParams } from './import-entry';

describe('desktop Import entry', () => {
	it.each(['https://example.com/car/123', 'WBAKS410700C71234'])(
		'continues with a usable vehicle reference: %s',
		(vehicle) => {
			expect(
				importEntryFromParams(new URLSearchParams({ vehicle, origin: 'DE', step: 'details' }))
			).toMatchObject({ intent: 'listing', step: 1 });
		}
	);
	it('keeps invalid links and incomplete sourcing on the first step', () => {
		expect(
			importEntryFromParams(new URLSearchParams({ vehicle: 'not a VIN', step: 'details' })).step
		).toBe(0);
		expect(
			importEntryFromParams(new URLSearchParams({ intent: 'source', step: 'details' })).step
		).toBe(0);
	});
	it('preserves sourcing intent and distinguishes first-step prefills from a completed entry', () => {
		expect(
			importEntryFromParams(
				new URLSearchParams({ intent: 'source', make: 'BMW', origin: 'DE', step: 'details' })
			)
		).toMatchObject({ intent: 'source', step: 1 });
		expect(
			importEntryFromParams(new URLSearchParams({ intent: 'source', make: 'BMW' }))
		).toMatchObject({ intent: 'source', step: 0 });
	});
	it('scopes the intake session to the actual vehicle reference', () => {
		expect(
			importEntryFromParams(new URLSearchParams({ vehicle: 'https://example.com/car/a' })).key
		).not.toBe(
			importEntryFromParams(new URLSearchParams({ vehicle: 'https://example.com/car/b' })).key
		);
	});
	it('accepts a market-only sourcing brief and rejects an empty brief', () => {
		expect(importEntryComplete('source', '', { origin: 'DE', make: '', model: '' })).toBe(true);
		expect(importEntryComplete('source', '', { origin: '', make: '', model: '' })).toBe(false);
	});
});
