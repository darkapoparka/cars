import type { RequestHandler } from './$types';
import { readCmsUploadAsset } from '$lib/server/cms-persistence';

export const GET: RequestHandler = ({ params }) => {
	const asset = readCmsUploadAsset(params.path);
	if (!asset) return new Response('Not found', { status: 404 });
	return new Response(new Uint8Array(asset.bytes), {
		headers: {
			'content-type': asset.mimeType,
			'cache-control': 'private, no-store',
			'x-content-type-options': 'nosniff'
		}
	});
};
