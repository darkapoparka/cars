import { afterEach, describe, expect, it, vi } from 'vitest';
import { GarageState } from './garage.svelte';

afterEach(() => {
	vi.useRealTimers();
	vi.unstubAllGlobals();
});

describe('garage state ownership', () => {
	it('keeps initial selections local to each instance', () => {
		const first = new GarageState();
		const second = new GarageState();
		first.favorites.push('first-car');
		first.compare.push('first-car');
		expect(second.favorites).toEqual([]);
		expect(second.compare).toEqual([]);
	});
	it('normalizes stored selections and enforces the comparison cap', () => {
		vi.stubGlobal('localStorage', {
			getItem: () => JSON.stringify(['a', 'a', 'b', 'c', 'd', null])
		});
		const garage = new GarageState();
		garage.hydrateFromStorage();
		expect(garage.favorites).toEqual(['a', 'b', 'c', 'd']);
		expect(garage.compare).toEqual(['a', 'b', 'c']);
	});

	it('keeps selections usable when storage methods fail', () => {
		vi.stubGlobal('localStorage', {
			getItem() {
				throw new Error('Storage unavailable');
			},
			setItem() {
				throw new Error('Storage unavailable');
			}
		});
		const garage = new GarageState();
		expect(() => garage.hydrateFromStorage()).not.toThrow();
		garage.toggleFavorite('car');
		garage.toggleCompare('car');
		expect(garage.favorites).toEqual(['car']);
		expect(garage.compare).toEqual(['car']);
	});
	it('restarts one timer when the same message is announced again', () => {
		vi.useFakeTimers();
		vi.stubGlobal('window', {});
		const garage = new GarageState();
		garage.setMessage('limit');
		vi.advanceTimersByTime(3000);
		garage.setMessage('limit');
		expect(vi.getTimerCount()).toBe(1);
		vi.advanceTimersByTime(600);
		expect(garage.formMessage).toBe('limit');
		vi.advanceTimersByTime(3000);
		expect(garage.formMessage).toBe('');
		expect(vi.getTimerCount()).toBe(0);
	});

	it('releases the pending message timer when disposed', () => {
		vi.useFakeTimers();
		vi.stubGlobal('window', {});
		const garage = new GarageState();
		garage.setMessage('limit');
		garage.dispose();
		vi.advanceTimersByTime(4000);
		expect(vi.getTimerCount()).toBe(0);
		expect(garage.formMessage).toBe('limit');
	});
	it('cancels feedback when the comparison is cleared', () => {
		vi.useFakeTimers();
		vi.stubGlobal('window', {});
		const garage = new GarageState();
		garage.setMessage('limit');
		garage.clearCompare();
		expect(garage.formMessage).toBe('');
		expect(vi.getTimerCount()).toBe(0);
	});

	it('does not schedule browser notifications during SSR', () => {
		vi.useFakeTimers();
		vi.stubGlobal('window', undefined);
		const garage = new GarageState();
		garage.setMessage('limit');
		expect(garage.formMessage).toBe('limit');
		expect(vi.getTimerCount()).toBe(0);
	});
});
