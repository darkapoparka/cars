import type { PageLoad } from './$types';
import { filterListingVehicles, listingVehicles, parseListingFilters } from '$data/listing';

export const load: PageLoad = ({ url }) => {
  const filters = parseListingFilters(url.searchParams);

  return {
    filters,
    vehicles: filterListingVehicles(listingVehicles, filters)
  };
};
