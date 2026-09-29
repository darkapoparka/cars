import { describe, expect, it } from 'vitest';
import { readSessionDraft, saveSessionDraft, clearSessionDraft } from './session-draft';
const memory = () => {
	const values = new Map<string, string>();
	return {
		getItem: (key: string) => values.get(key) ?? null,
		setItem: (key: string, value: string) => {
			values.set(key, value);
		},
		removeItem: (key: string) => {
			values.delete(key);
		}
	} as Storage;
};
describe('bounded private-session drafts', () => {
	it('retains vehicle preferences without contact details or free text', () => {
		const store = memory();
		saveSessionDraft(
			'dealer-a:import',
			{
				make: 'BMW',
				step: 1,
				name: 'Test',
				phone: '123456',
				email: 'test@example.invalid',
				notes: 'private'
			},
			store,
			1000
		);
		expect(readSessionDraft('dealer-a:import', store, 2000)).toEqual({ make: 'BMW', step: 1 });
		expect(readSessionDraft('dealer-b:import', store, 2000)).toBeUndefined();
	});
	it('expires and rejects corrupt or incompatible saved data', () => {
		const store = memory();
		saveSessionDraft('test', { make: 'BMW' }, store, 1000);
		expect(readSessionDraft('test', store, 90000000)).toBeUndefined();
		for (const value of ['{', '[]', 'null', '{"version":1}']) {
			store.setItem('test', value);
			expect(readSessionDraft('test', store, 1000)).toBeUndefined();
		}
	});
	it('does not break forms when storage is denied or full', () => {
		const fail = () => {
			throw new Error('Storage denied');
		};
		const store = { getItem: fail, setItem: fail, removeItem: fail } as unknown as Storage;
		expect(readSessionDraft('test', store)).toBeUndefined();
		expect(() => saveSessionDraft('test', { make: 'BMW' }, store)).not.toThrow();
		expect(() => clearSessionDraft('test', store)).not.toThrow();
	});
});
