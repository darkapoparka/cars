import type { DayNightVehicle } from '$lib/data/daynight-vehicles';
import { getPublicStaticRoute } from './public-routes';
export type PageSeo = { title: string; description: string };
export const DEFAULT_DESCRIPTION = 'ELIQ AUTO · Пазарджик. Независима демонстрация с архивна селекция автомобили. Потвърдете цена и наличност с автокъщата.';
export function routeSeo(routePath: string): PageSeo {
  const route = getPublicStaticRoute(routePath ?? '');
  const title = (route?.title ?? 'ELIQ AUTO').replace(/Day\s*&?\s*Night(?:\s+Auto)?(?:\s+Group)?/giu, 'ELIQ AUTO').replaceAll('София', 'Пазарджик');
  return { title, description: DEFAULT_DESCRIPTION };
}
export function vehicleSeo(vehicle: DayNightVehicle): PageSeo {
  const facts = [vehicle.priceEur, vehicle.mileage, vehicle.fuel, vehicle.transmission].filter(Boolean).join(', ');
  return { title: `${vehicle.shortTitle} | ELIQ AUTO`, description: `${vehicle.shortTitle}: ${facts}. Архивна обява в независима демонстрация; потвърдете актуалните условия.` };
}
