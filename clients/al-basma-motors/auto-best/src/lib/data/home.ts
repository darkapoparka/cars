import { featuredVehicles } from './inventory';
import { bodyLabel } from './listing';

export const bodyTypes = [...new Set(featuredVehicles.map((vehicle) => vehicle.body))].map((query) => {
  const sample = featuredVehicles.find((vehicle) => vehicle.body === query) ?? featuredVehicles[0];
  return { label: bodyLabel(query), query, image: sample.image, width: 180, height: 108, count: featuredVehicles.filter((vehicle) => vehicle.body === query).length };
});

export const brands = [...new Set(featuredVehicles.map((vehicle) => vehicle.make))].map((label) => {
  const sample = featuredVehicles.find((vehicle) => vehicle.make === label) ?? featuredVehicles[0];
  return { label, image: sample.image, count: featuredVehicles.filter((vehicle) => vehicle.make === label).length };
});

export const editorial = [
  { title: 'Confirm the car before you travel', text: 'Public stock changes. Share the listing and confirm availability before visiting the showroom.', image: featuredVehicles[0].image, href: '/contact', meta: 'Showroom guide', category: 'Viewing' },
  { title: 'Compare the published details', text: 'Use price, year and mileage as dated source information and ask about anything not published.', image: featuredVehicles[1].image, href: '/blog-detail/1', meta: 'Buying guide', category: 'Buying' },
  { title: 'Ask about export for a specific car', text: 'The official Al Basma site includes an export journey. Request current vehicle-specific terms from the showroom.', image: featuredVehicles[2].image, href: '/contact?topic=import', meta: 'Export', category: 'Showroom' }
] as const;
