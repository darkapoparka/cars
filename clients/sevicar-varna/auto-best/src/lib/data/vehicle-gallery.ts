import type { Vehicle, VehicleImage } from './inventory';

const rs6DemoPhotos: readonly VehicleImage[] = [
  { image: '/assets/images/template/pdp-demo-rs6-rear.webp', category: 'exterior', caption: { en: 'Rear view', bg: 'Изглед отзад' } },
  { image: '/assets/images/template/pdp-demo-rs6-interior.webp', category: 'interior', caption: { en: 'Interior', bg: 'Интериор' } }
];

/** Supplied vehicle photos take precedence; generated samples are preview-only. */
export function vehicleGallery(vehicle: Vehicle, allowDemo: boolean) {
  if (vehicle.photos?.length) return { photos: vehicle.photos, demo: vehicle.verification === 'sample' };
  const photos: VehicleImage[] = [{ image: vehicle.image, category: 'exterior' }];
  const demoFixture = allowDemo && vehicle.verification === 'sample' && vehicle.id === 1
    && vehicle.make === 'Audi' && vehicle.title === 'Audi RS 6 Avant';
  if (demoFixture) {
    photos[0].caption = { en: 'Front view', bg: 'Изглед отпред' };
    photos.push(...rs6DemoPhotos);
  }
  return { photos, demo: vehicle.verification === 'sample' };
}
