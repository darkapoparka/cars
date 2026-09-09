import { selectedVehicle } from '$data/journeys';
import { resolveContactTopic, resolveImportUrl } from '$data/company';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => ({
  vehicle: ['inspection', 'leasing'].includes(url.searchParams.get('topic') ?? '') ? selectedVehicle(url.searchParams.get('vehicle')) : null,
  topic: resolveContactTopic(url.searchParams.get('topic')),
  importUrl: url.searchParams.get('topic') === 'import' ? resolveImportUrl(url.searchParams.get('vehicle_url')) : null
});
