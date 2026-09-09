import stock from './dealer-stock.json';
import { daynightSite } from './daynight-site';
export interface Dealer {
  slug: string; name: string; location: string; address: string; phone: string;
  logo: string; cover: string; inventory: number; rating: number | null; specialties: string[];
}
export const dealers: Dealer[] = [{
  slug: stock.facts.slug, name: stock.facts.name, location: stock.facts.city,
  address: stock.facts.address, phone: stock.facts.phone, logo: daynightSite.logoDark,
  cover: stock.vehicles[0].image, inventory: stock.vehicles.length, rating: null,
  specialties: ['Публикувани обяви', 'Наличност по запитване', 'Уговорка за оглед']
}];
// Retain the master's public route aliases without inventing multiple branches.
const legacyAliases = new Set(['daynight-auto-plovdiv', 'daynight-auto-sourcing', 'day-night-auto-group', 'day-night-auto-group-documents', 'day-night-auto-group-sourcing']);
export function getDealerBySlug(slug: string) {
  return legacyAliases.has(slug) ? dealers[0] : dealers.find((dealer) => dealer.slug === slug);
}
