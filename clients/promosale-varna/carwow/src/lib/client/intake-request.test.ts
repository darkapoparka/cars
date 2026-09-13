import { afterEach, describe, expect, it, vi } from 'vitest';
import { hasResponseId, postIntake } from './intake-request';

afterEach(() => {
	vi.unstubAllGlobals();
	vi.useRealTimers();
});

describe('intake transport', () => {
	it.each([400, 422, 429, 503])('localizes %s without leaking service messages', async (status) => {
		const fetcher = vi
			.fn()
			.mockResolvedValue(
				new Response(JSON.stringify({ message: 'Internal service failure' }), { status })
			);
		vi.stubGlobal('fetch', fetcher);
		const result = await postIntake('/api/leads', {});
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.status).toBe(status);
			expect(result.error).not.toContain('Internal');
		}
		expect(fetcher).toHaveBeenCalledTimes(1);
	});
	it('does not accept malformed success JSON as a receipt', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('not-json', { status: 201 })));
		const result = await postIntake('/api/leads', {});
		expect(result.ok).toBe(false);
		expect(hasResponseId({ leadId: '' }, 'leadId')).toBe(false);
		expect(hasResponseId({ leadId: 'receipt' }, 'leadId')).toBe(true);
	});
	it('does not retry network failures', async () => {
		const fetcher = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
		vi.stubGlobal('fetch', fetcher);
		expect((await postIntake('/api/leads', {})).ok).toBe(false);
		expect(fetcher).toHaveBeenCalledTimes(1);
	});
	it('times out honestly rather than claiming the request was not received', async () => {
		vi.useFakeTimers();
		vi.stubGlobal(
			'fetch',
			vi.fn(
				(_url, init: RequestInit) =>
					new Promise((_resolve, reject) => {
						init.signal?.addEventListener('abort', () =>
							reject(new DOMException('Aborted', 'AbortError'))
						);
					})
			)
		);
		const pending = postIntake('/api/leads', {}, { timeoutMs: 100 });
		await vi.advanceTimersByTimeAsync(100);
		const result = await pending;
		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.error).toContain('може да е получена');
	});
});
