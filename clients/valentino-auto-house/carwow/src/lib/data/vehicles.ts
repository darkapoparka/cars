import dealerPack from './dealer-pack.json';
import { daynightVehicles } from './daynight-vehicles';

export type VehicleCondition = 'New' | 'Used' | 'Certified';
export type SortKey = 'template' | 'lowest' | 'highest' | 'newest' | 'mileage';
export interface Vehicle {
  slug: string; title: string; brand: string; model: string; bodyType: string;
  condition: VehicleCondition; price: number; monthly: number; year: number;
  mileage: number; fuel: string; displayFuel?: string; transmission: string;
  engine: string; exterior: string; interior: string; location: string;
  vin: string; stockNumber: string; tag?: string; tagTone?: 'lime' | 'violet' | 'dark';
  image: string; images: string[]; gallery: string[]; dealerSlug: string;
  agentSlug: string; rating: number; description: string; features: string[];
}
export interface InventoryFilters {
  query?: string; brand?: string; bodyType?: string; condition?: VehicleCondition | 'All';
  maxPrice?: number; minYear?: number; fuel?: string;
}
// The retained alternate-template boundary uses the same real records as the main entry.
export const vehicles: Vehicle[] = daynightVehicles.map((car) => ({
  slug: car.slug, title: car.title, brand: car.brand, model: car.model, bodyType: car.body,
  condition: 'Used', price: car.price, monthly: Number.NaN, year: car.year,
  mileage: car.mileageValue, fuel: car.fuel, displayFuel: car.fuel,
  transmission: car.transmission, engine: car.engine, exterior: car.color, interior: '—',
  location: dealerPack.dealer.address, vin: 'Не е публикуван', stockNumber: car.lot,
  tag: 'Наличност по телефона', tagTone: 'dark', image: car.image,
  images: [...car.gallery], gallery: [...car.gallery], dealerSlug: dealerPack.dealer.slug,
  agentSlug: 'public-contact', rating: 0, description: car.description, features: [...car.features]
}));
export const bodyTypes = Array.from(new Set(vehicles.map((vehicle) => vehicle.bodyType)));
export const brands = Array.from(new Set(vehicles.map((vehicle) => vehicle.brand))).sort();
export const fuels = Array.from(new Set(vehicles.map((vehicle) => vehicle.fuel))).sort();
export function getVehicleBySlug(slug: string) { return vehicles.find((vehicle) => vehicle.slug === slug); }
export function getRelatedVehicles(vehicle: Vehicle, limit = 4) {
  const closeMatches = vehicles.filter((candidate) => candidate.slug !== vehicle.slug && (candidate.brand === vehicle.brand || candidate.bodyType === vehicle.bodyType));
  const fallback = vehicles.filter((candidate) => candidate.slug !== vehicle.slug && !closeMatches.some((match) => match.slug === candidate.slug));
  return [...closeMatches, ...fallback].slice(0, limit);
}
export function filterVehicles(source: Vehicle[], filters: InventoryFilters) {
  const query = filters.query?.trim().toLowerCase() ?? '';
  return source.filter((vehicle) => {
    const matchesQuery = !query || [vehicle.title, vehicle.brand, vehicle.model, vehicle.bodyType, vehicle.location].join(' ').toLowerCase().includes(query);
    const matchesBrand = !filters.brand || filters.brand === 'All' || vehicle.brand === filters.brand;
    const matchesType = !filters.bodyType || filters.bodyType === 'All' || vehicle.bodyType === filters.bodyType;
    const matchesCondition = !filters.condition || filters.condition === 'All' || vehicle.condition === filters.condition;
    const matchesPrice = !filters.maxPrice || vehicle.price <= filters.maxPrice;
    const matchesYear = !filters.minYear || vehicle.year >= filters.minYear;
    const matchesFuel = !filters.fuel || filters.fuel === 'All' || vehicle.fuel === filters.fuel;
    return matchesQuery && matchesBrand && matchesType && matchesCondition && matchesPrice && matchesYear && matchesFuel;
  });
}
export function sortVehicles(source: Vehicle[], sort: SortKey) {
  const sorted = [...source];
  if (sort === 'template') return sorted;
  if (sort === 'highest') return sorted.sort((a, b) => b.price - a.price);
  if (sort === 'newest') return sorted.sort((a, b) => b.year - a.year);
  if (sort === 'mileage') return sorted.sort((a, b) => a.mileage - b.mileage);
  return sorted.sort((a, b) => a.price - b.price);
}
