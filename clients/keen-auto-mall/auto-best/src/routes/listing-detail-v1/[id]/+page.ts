import { listReturn } from '$data/journeys';
import { error } from '@sveltejs/kit';
import { featuredVehicles } from '$data/inventory';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params, url }) => {
  const isCanonicalId = /^[1-9]\d*$/.test(params.id);
  const vehicleId = Number(params.id);

  if (!isCanonicalId || !Number.isSafeInteger(vehicleId)) {
    error(404, 'Vehicle not found.');
  }

  const vehicle = featuredVehicles.find((item) => item.id === vehicleId);

  if (!vehicle) {
    error(404, 'Vehicle not found.');
  }

  const recommendations = featuredVehicles
    .filter((item) => item.id !== vehicle.id)
    .sort((a, b) => {
      const sameMakeA = a.make === vehicle.make ? 1 : 0;
      const sameMakeB = b.make === vehicle.make ? 1 : 0;
      const sameBodyA = a.body === vehicle.body ? 1 : 0;
      const sameBodyB = b.body === vehicle.body ? 1 : 0;
      return sameMakeB + sameBodyB - (sameMakeA + sameBodyA);
    })
    .slice(0, 3);

  return { returnTo: listReturn(url.searchParams.get('return'), '/listing-grid'), vehicle, recommendations };
};
