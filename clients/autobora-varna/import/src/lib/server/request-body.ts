import { error } from '@sveltejs/kit';

/** Bound the stream itself, not just fields after an unbounded request.json(). */
export async function readRequestBytes(
	request: Request,
	limit = 64 * 1024
): Promise<Uint8Array<ArrayBuffer>> {
	const declared = Number(request.headers.get('content-length'));
	if (Number.isFinite(declared) && declared > limit) error(413, 'Request is too large');
	if (!request.body) return new Uint8Array(0);
	const reader = request.body.getReader();
	const chunks: Uint8Array[] = [];
	let size = 0;
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			size += value.byteLength;
			if (size > limit) {
				await reader.cancel();
				error(413, 'Request is too large');
			}
			chunks.push(value);
		}
	} finally {
		reader.releaseLock();
	}
	const bytes = new Uint8Array(size);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return bytes;
}

/** The staff form boundary preserves repeated fields while bounding multipart parsing. */
export async function readRequestForm(request: Request, limit = 64 * 1024): Promise<FormData> {
	const contentType = request.headers.get('content-type') ?? '';
	const type = contentType.split(';')[0].trim().toLowerCase();
	if (!['application/x-www-form-urlencoded', 'multipart/form-data'].includes(type))
		error(415, 'Unsupported form format');
	const bytes = await readRequestBytes(request, limit);
	try {
		return await new Request(request.url, {
			method: 'POST',
			headers: { 'content-type': contentType },
			body: bytes
		}).formData();
	} catch {
		error(400, 'Malformed form data');
	}
}
