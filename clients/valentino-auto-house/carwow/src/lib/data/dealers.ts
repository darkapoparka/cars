import dealerPack from './dealer-pack.json';
import { daynightSite } from './daynight-site';
export interface Dealer { slug: string; name: string; location: string; address: string; phone: string; logo: string; cover: string; inventory: number; rating: number; specialties: string[]; }
export const dealers: Dealer[] = [{
  slug: dealerPack.dealer.slug, name: daynightSite.name, location: dealerPack.dealer.city,
  address: daynightSite.location, phone: daynightSite.phoneLabel,
  logo: daynightSite.logoDark, cover: dealerPack.inventory[0].photos[0],
  inventory: dealerPack.inventory.length, rating: 0,
  specialties: ['Датирана селекция от обяви', 'Наличност по телефона', 'Няма включена проверена оценка']
}];
export function getDealerBySlug(slug: string) { return dealers.find((dealer) => dealer.slug === slug); }
