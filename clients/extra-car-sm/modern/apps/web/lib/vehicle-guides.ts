import { dealerGuides } from '@repo/marketplace';
export interface VehicleGuide {
  description: { bg: string; en: string };
  sections: readonly {
    body: { bg: string; en: string };
    heading: { bg: string; en: string };
  }[];
  slug: string;
  title: { bg: string; en: string };
}

const retainedGuides = [
  { slug: 'buying-used-car-bulgaria', id: 1 },
  { slug: 'ev-hybrid-ownership-checklist', id: 10 },
  { slug: 'dealer-listing-transparency', id: 8 }
] as const;
export const vehicleGuides: readonly VehicleGuide[] = retainedGuides.map(({slug, id}) => {
  const guide = dealerGuides.find(item => item.id === id)!;
  return { slug, title: guide.title, description: guide.description, sections: guide.sections };
});

export const getVehicleGuide = (slug: string) =>
  vehicleGuides.find((guide) => guide.slug === slug);
