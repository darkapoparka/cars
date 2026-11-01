import profile from "./dealer-profile.json";
import { normalizeCar, readFilters, type ShowroomData } from "../showroom";

export function loadShowroom(url: URL): ShowroomData {
  const b = profile.business;
  return {
    business: {
      slug: b.slug,
      name: b.name,
      shortName: b.shortName,
      phoneHref: b.phoneHref,
      phoneDisplay: b.phoneDisplay,
      address: b.address,
      logo: b.logo,
      observedAt: b.observedAt,
      services: b.services,
    },
    cars: profile.listings.map(normalizeCar),
    filters: readFilters(url.searchParams),
    queryKey: url.search,
    today: new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Sofia",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date()),
  };
}
