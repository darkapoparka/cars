import { auxeroRouteResponse } from '$lib/server/auxero-template';

export function GET({
	params,
	request,
	url
}: {
	params: { templatePath?: string };
	request: Request;
	url: URL;
}) {
	return auxeroRouteResponse(params.templatePath ?? '', {
		request,
		searchParams: url.searchParams
	});
}
