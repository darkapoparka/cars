import { parseFinanceSelection } from '$data/finance';
import { selectedVehicle } from '$data/journeys';
import { resolveContactTopic, resolveImportUrl } from '$data/company';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
  const topic = resolveContactTopic(url.searchParams.get('topic'));
  const vehicle = ['inspection', 'leasing'].includes(topic.id) ? selectedVehicle(url.searchParams.get('vehicle')) : null;
  return {
    topic, vehicle,
    financeSelection: topic.id === 'leasing' && vehicle ? parseFinanceSelection(url.searchParams, vehicle.priceEur) : null,
    importUrl: topic.id === 'import' ? resolveImportUrl(url.searchParams.get('vehicle_url')) : null
  };
};
