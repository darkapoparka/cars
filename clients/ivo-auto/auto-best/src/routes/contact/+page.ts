import { resolveContactTopic, resolveImportUrl } from '$data/company';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => ({
  topic: resolveContactTopic(url.searchParams.get('topic')),
  importUrl: url.searchParams.get('topic') === 'import' ? resolveImportUrl(url.searchParams.get('vehicle_url')) : null
});
