import { describe, expect, it } from 'vitest';
import {
	compareLimit,
	compactCompareSlotsFromSelection,
	compareSlugsWith,
	favoriteSlugsWith,
	garageCompareKey,
	garageCompareSlotsKey,
	garageFavoriteKey,
	normalizeCompareSlots,
	normalizeGarageSlugs,
	readGarageCompare,
	readGarageCompareSlots,
	readGarageFavorites,
	sameGarageSlugList,
	writeGarageCompare,
	writeGarageCompareSlots,
	writeGarageFavorites
} from './garage-storage';

class MemoryStorage implements Storage {
	private readonly values = new Map<string, string>();

	get length() {
		return this.values.size;
	}

	clear() {
		this.values.clear();
	}

	getItem(key: string) {
		return this.values.get(key) ?? null;
	}

	key(index: number) {
		return Array.from(this.values.keys())[index] ?? null;
	}

	removeItem(key: string) {
		this.values.delete(key);
	}

	setItem(key: string, value: string) {
		this.values.set(key, value);
	}
}

describe('garage-storage', () => {
	it('reads and writes favorite and compare lists defensively', () => {
		const storage = new MemoryStorage();

		storage.setItem(garageFavoriteKey, 'not-json');
		storage.setItem(garageCompareKey, JSON.stringify(['audi', 42, 'bmw', 'audi']));

		expect(readGarageFavorites(storage)).toEqual([]);
		expect(readGarageCompare(storage)).toEqual(['audi', 'bmw', 'audi']);

		writeGarageFavorites(storage, ['bmw', 'audi']);
		writeGarageCompare(storage, ['audi']);

		expect(readGarageFavorites(storage)).toEqual(['bmw', 'audi']);
		expect(readGarageCompare(storage)).toEqual(['audi']);
	});

	it('normalizes compare slugs and enforces the compare limit', () => {
		expect(
			normalizeGarageSlugs(['audi', '', undefined, 'bmw', 'audi', 'porsche', 'lexus', 'mini'])
		).toEqual(['audi', 'bmw', 'porsche', 'lexus']);
		expect(compareLimit).toBe(4);
	});

	it('keeps favorite and compare list transforms deterministic', () => {
		expect(favoriteSlugsWith(['audi', 'bmw'], 'audi')).toEqual(['bmw']);
		expect(favoriteSlugsWith(['audi'], 'bmw')).toEqual(['audi', 'bmw']);
		expect(compareSlugsWith(['audi', 'bmw', 'porsche'], 'bmw')).toEqual(['bmw', 'audi', 'porsche']);
		expect(compareSlugsWith(['audi', 'bmw', 'porsche', 'lexus'], 'mini')).toEqual([
			'mini',
			'audi',
			'bmw',
			'porsche'
		]);
	});

	it('stores mobile compare slots only when they match the active compare list', () => {
		const storage = new MemoryStorage();
		const compare = ['audi', 'bmw', 'porsche'];
		const slots = normalizeCompareSlots(['bmw', 'missing'], compare);

		expect(slots).toEqual(['bmw', null]);
		expect(compactCompareSlotsFromSelection(compare)).toEqual(['audi', 'bmw']);
		expect(sameGarageSlugList(compare, ['audi', 'bmw', 'porsche'])).toBe(true);
		expect(sameGarageSlugList(compare, ['bmw', 'audi', 'porsche'])).toBe(false);

		writeGarageCompareSlots(storage, compare, slots);
		expect(readGarageCompareSlots(storage, compare)).toEqual(['bmw', null]);

		const raw = JSON.parse(storage.getItem(garageCompareSlotsKey) ?? '{}');
		expect(raw).toEqual({ compare, slots });
		expect(readGarageCompareSlots(storage, ['audi', 'bmw'])).toBeUndefined();
	});
});
