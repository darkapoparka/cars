import { error } from "@sveltejs/kit";
import { getVehicle, vehicles } from "#lib/data/vehicles.ts";
import { site } from "#lib/config/site.ts";

export const entries = () =>
  site.locales.flatMap((locale) =>
    vehicles.map((v) => ({
      id: v.id,
      lang: locale === site.defaultLocale ? undefined : locale,
    })),
  );

export const load = ({ params }) => {
  const vehicle = getVehicle(params.id);
  if (!vehicle) error(404);
  return { vehicle };
};
