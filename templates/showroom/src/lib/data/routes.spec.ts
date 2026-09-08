import { describe, expect, it } from 'vitest';
import { getAgentBySlug } from './agents';
import { getPostBySlug } from './blog';
import { getDealerBySlug } from './dealers';

describe('route lookup helpers', () => {
	it('finds dealer detail records', () => {
		expect(getDealerBySlug('eliqauto-plovdiv')?.name).toBe('Eliqauto');
	});

	it('finds sales agent detail records', () => {
		expect(getAgentBySlug('eliqauto-sales')?.title).toBe(
			'Налични автомобили и клиентски запитвания'
		);
	});

	it('finds blog detail records', () => {
		expect(getPostBySlug('vnos-ot-kanada-proverka')?.category).toBe('Внос и лизинг');
	});
});
