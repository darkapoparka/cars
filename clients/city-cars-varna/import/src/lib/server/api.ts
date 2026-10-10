import { error, json } from '@sveltejs/kit';
import { readRequestBytes } from './request-body';

export type ApiPayload = Record<string, unknown>;

export const readApiPayload = async (request: Request): Promise<ApiPayload> => {
	const contentType = request.headers.get('content-type') ?? '';
	const type = contentType.split(';')[0].trim().toLowerCase();
	if (
		!['application/json', 'application/x-www-form-urlencoded', 'multipart/form-data'].includes(type)
	)
		error(415, 'Unsupported request format');
	const bytes = await readRequestBytes(request);
	try {
		if (type === 'application/json') {
			const body: unknown = JSON.parse(new TextDecoder().decode(bytes));
			return body && typeof body === 'object' && !Array.isArray(body) ? (body as ApiPayload) : {};
		}
		const bounded = new Request(request.url, {
			method: 'POST',
			headers: { 'content-type': contentType },
			body: bytes
		});
		return Object.fromEntries((await bounded.formData()).entries());
	} catch {
		return {};
	}
};

export const payloadString = (payload: ApiPayload, ...keys: string[]) => {
	for (const key of keys) {
		const value = payload[key];

		if (typeof value === 'string' && value.trim()) return value.trim();
	}

	return undefined;
};

export const okJson = <Data>(data: Data, init?: ResponseInit) => json({ ok: true, data }, init);

export const errorJson = (message: string, status = 400) =>
	json({ ok: false, message }, { status });
