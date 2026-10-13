import { describe, expect, it } from 'vitest';
import { readRequestBytes, readRequestForm } from './request-body';
import { readApiPayload } from './api';

const request = (body: string, type = 'application/json') =>
	new Request('https://example.invalid/api', {
		method: 'POST',
		headers: { 'content-type': type },
		body
	});
describe('bounded API payloads', () => {
	it('preserves valid JSON and form fields', async () => {
		expect(await readApiPayload(request('{"name":"Test"}'))).toEqual({ name: 'Test' });
		expect(await readApiPayload(request('name=Test', 'application/x-www-form-urlencoded'))).toEqual(
			{ name: 'Test' }
		);
	});
	it('rejects malformed JSON/arrays and broken multipart without a 500', async () => {
		for (const value of ['{', '[]', 'null'])
			expect(await readApiPayload(request(value))).toEqual({});
		expect(await readApiPayload(request('broken', 'multipart/form-data; boundary=test'))).toEqual(
			{}
		);
	});
	it('rejects unsupported media types and oversized streams', async () => {
		await expect(readApiPayload(request('text', 'text/plain'))).rejects.toMatchObject({
			status: 415
		});
		await expect(readRequestBytes(request('12345'), 4)).rejects.toMatchObject({ status: 413 });
	});
});

describe('bounded staff forms', () => {
	it('preserves repeated fields', async () => {
		const form = await readRequestForm(
			request('name=Test&brand=BMW&brand=Audi', 'application/x-www-form-urlencoded')
		);
		expect(form.getAll('brand')).toEqual(['BMW', 'Audi']);
	});
	it('rejects oversized, unsupported and malformed forms', async () => {
		await expect(
			readRequestForm(request('x'.repeat(1025), 'application/x-www-form-urlencoded'), 1024)
		).rejects.toMatchObject({ status: 413 });
		await expect(readRequestForm(request('{}'))).rejects.toMatchObject({ status: 415 });
		await expect(
			readRequestForm(request('broken', 'multipart/form-data; boundary=test'))
		).rejects.toMatchObject({ status: 400 });
	});
});
