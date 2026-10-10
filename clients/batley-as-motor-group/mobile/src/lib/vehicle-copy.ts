import { formatStockMileage } from "./dealer-mileage";
import type { Vehicle } from './types';
import { localeNumber, translate, type Locale } from './locale';
const variants: Record<string, string> = {
  'bmw-x6': 'xDrive30d · M Sport Pro',
  'bmw-540': 'xDrive Touring · M Sport',
  'bmw-x3': '20d xDrive · M Sport',
  'bmw-120': '120 · Automatic',
};
const equipmentNames: Record<string, string> = {
  'Comfort Paket Plus': 'Comfort package',
  'Travel Paket': 'Travel package',
  'BMW Niere Iconic Glow': 'BMW Iconic Glow',
  Standheizung: 'Auxiliary heating',
  Mehrzonenklima: 'Multi-zone climate control',
  Kessy: 'Keyless entry',
};
const promotionalPhotos = new Set([
  '/images/x6-gallery-01.webp',
  '/images/x6-gallery-03.webp',
  '/images/x6-gallery-04.webp',
  '/images/x6-gallery-05.webp',
  '/images/bmw-540-gallery-04.webp',
  '/images/bmw-540-gallery-08.webp',
  '/images/bmw-x3-gallery-01.webp',
  '/images/bmw-x3-gallery-05.webp',
]);
const letterboxedPhotos = new Set([
  '/images/bmw-120-gallery-01.webp',
  '/images/bmw-120-gallery-02.webp',
]);
export function showroomPhotoHasLetterbox(src: string): boolean {
  return letterboxedPhotos.has(src);
}
export function showroomVehiclePhotos(vehicle: Vehicle): string[] {
  if (!vehicle.sample) return vehicle.images;
  const photos = vehicle.images.filter((src) => !promotionalPhotos.has(src));
  return photos.length ? photos : vehicle.images;
}
export function localizeSpecification(value: string, locale: Locale): string {
  const names: Record<string, string> = {
    'Saphirschwarz Metallic': 'Sapphire Black Metallic',
    ' GRAU (180)': 'Grey (180)',
    'BROOKLYN GRAU': 'Brooklyn Grey',
    'M Sport AHK Pano 19``': 'M Sport · Panoramic roof · 19-inch wheels',
  };
  const text = names[value] || value;
  if (locale === 'en') return text;
  return translate(text, locale)
    .replace(/\d{1,3}(?:,\d{3})+(?=\s*(?:km|kg|ccm)\b)/g, (number) =>
      localeNumber(Number(number.replaceAll(',', '')), locale),
    )
    .replace(/\bkm\b/g, 'км')
    .replace(/\bhp\b/g, 'к.с.')
    .replace(/\bccm\b/g, 'см³')
    .replace(/\bkg\b/g, 'кг')
    .replace(/\bYear\b/g, 'година')
    .replace(/annual average/g, 'средно за годината')
    .replace(/combined/g, 'комбинирано')
    .replace(/suburban/g, 'крайградско')
    .replace(/city/g, 'градско')
    .replace(/country road/g, 'извънградско')
    .replace(/motorway/g, 'магистрала')
    .replace(/assuming an average CO₂ price of/g, 'при средна цена на CO₂ от')
    .replace(/assuming a low average CO₂ price of/g, 'при ниска средна цена на CO₂ от')
    .replace(/assuming a high average CO₂ price of/g, 'при висока средна цена на CO₂ от');
}
// Compact PDP previews only; the captured facts and full technical sheet stay intact.
export function compactVehicleSpecification(
  label: string,
  value: string,
  locale: Locale,
): [string, string] {
  const t = (message: string) => translate(message, locale);
  let shortValue = localizeSpecification(value, locale);
  if (label === 'Power') {
    const horsepower = shortValue.match(/(\d+)\s*(?:hp|к\.с\.)\)?$/);
    if (horsepower) shortValue = horsepower[1] + ' ' + t('hp');
  }
  if (label === 'Fuel')
    shortValue = shortValue.replace(/,\s*(?:E10-enabled|съвместим с E10)$/i, '');
  if (label === 'Category' && /^SUV\//.test(value)) shortValue = t('SUV');
  if (label === 'Origin' && (value === 'German edition' || value === t('German edition')))
    shortValue = t('Germany');
  const shortLabel = label.toLowerCase().startsWith('first regist')
    ? locale === 'bg'
      ? 'Първа рег.'
      : 'First reg.'
    : label === 'Transmission'
      ? locale === 'bg'
        ? 'Скорости'
        : 'Gearbox'
      : t(label);
  return [shortLabel, shortValue];
}
// Keep the reference intact; the showroom shows vehicle photos instead of seller adverts.
export function localizeVehicle(vehicle: Vehicle, locale: Locale): Vehicle {
  const t = (message: string) => translate(message, locale);
  const variant = (
    vehicle.sample ? variants[vehicle.id] || vehicle.variant : vehicle.variant
  ).replace('Automatic', t('Automatic'));
  const facts = [
    vehicle.year,
    formatStockMileage(vehicle, locale),
    t(vehicle.fuel),
    t(vehicle.transmission),
  ].join(' · ');
  const description = vehicle.sample
    ? `${vehicle.make} ${vehicle.model} · ${variant}\n${facts}\n\n${t('Features')}: ${vehicle.features.slice(0, 8).map(t).join(', ')}.`
    : vehicle.attributes?.description;
  return {
    ...vehicle,
    images: showroomVehiclePhotos(vehicle),
    variant,
    priceNote: vehicle.priceNote ? t(vehicle.priceNote) : undefined,
    specialFeatures: vehicle.specialFeatures?.map((feature) =>
      t(equipmentNames[feature] || feature),
    ),
    attributes: { ...vehicle.attributes, ...(description ? { description } : {}) },
    technicalData: vehicle.technicalData?.map(([label, value]) => [
      label,
      localizeSpecification(value, locale),
    ]),
  };
}
