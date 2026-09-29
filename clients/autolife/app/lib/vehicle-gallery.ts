import type {Vehicle} from './data';

export type GalleryCategory = 'Exteriors' | 'Interiors' | 'Features';
export type GalleryPhoto = {category: GalleryCategory; label: string; src: string};
// Exact order and labels from the captured reference; source manifest is under reference/.
const fortunerPhotos: GalleryPhoto[] = [
  {
    "category": "Exteriors",
    "label": "Right Front Diagonal (45- Degree) View",
    "src": "/reference-assets/continuation/fortuner-gallery-0.jpg"
  },
  {
    "category": "Exteriors",
    "label": "Right Side View",
    "src": "/reference-assets/continuation/fortuner-gallery-2.jpg"
  },
  {
    "category": "Exteriors",
    "label": "Back/Rear View",
    "src": "/reference-assets/continuation/fortuner-gallery-3.jpg"
  },
  {
    "category": "Exteriors",
    "label": "Left Side View",
    "src": "/reference-assets/continuation/fortuner-gallery-4.jpg"
  },
  {
    "category": "Exteriors",
    "label": "Front View",
    "src": "/reference-assets/continuation/fortuner-gallery-5.jpg"
  },
  {
    "category": "Interiors",
    "label": "Center Console",
    "src": "/reference-assets/continuation/fortuner-gallery-6.jpg"
  },
  {
    "category": "Interiors",
    "label": "Infotainment System",
    "src": "/reference-assets/continuation/fortuner-gallery-7.jpg"
  },
  {
    "category": "Interiors",
    "label": "Steering Wheel Close-up",
    "src": "/reference-assets/continuation/fortuner-gallery-8.jpg"
  },
  {
    "category": "Interiors",
    "label": "Right Side Front Door Cabin View",
    "src": "/reference-assets/continuation/fortuner-gallery-9.jpg"
  },
  {
    "category": "Interiors",
    "label": "Right Side Door Cabin View",
    "src": "/reference-assets/continuation/fortuner-gallery-10.jpg"
  },
  {
    "category": "Interiors",
    "label": "Boot Inside View",
    "src": "/reference-assets/continuation/fortuner-gallery-11.jpg"
  },
  {
    "category": "Interiors",
    "label": "Third Seat Row",
    "src": "/reference-assets/continuation/fortuner-gallery-12.jpg"
  },
  {
    "category": "Features",
    "label": "2.7 L, 4 Cyl Engine",
    "src": "/reference-assets/continuation/fortuner-gallery-13.jpg"
  },
  {
    "category": "Features",
    "label": "50005 km in 3 years",
    "src": "/reference-assets/continuation/fortuner-extra-3.jpg"
  },
  {
    "category": "Features",
    "label": "Alloy Wheels",
    "src": "/reference-assets/continuation/fortuner-gallery-14.jpg"
  },
  {
    "category": "Features",
    "label": "Fabric trim",
    "src": "/reference-assets/continuation/fortuner-gallery-15.jpg"
  },
  {
    "category": "Features",
    "label": "1 keys",
    "src": "/reference-assets/continuation/fortuner-extra-6.jpg"
  }
];
export function vehicleGallery(vehicle: Vehicle): GalleryPhoto[] {
  if (vehicle.imagePlaceholder) return [{category:'Exteriors', label:'Photo unavailable', src:vehicle.image}];
  if (vehicle.images?.length) return vehicle.images.map((src, index) => ({category: 'Exteriors', label: 'Photo ' + (index + 1), src}));
  return vehicle.slug === '2024-toyota-fortuner-exr' ? fortunerPhotos : [{category:'Exteriors',label:'Exterior',src:vehicle.image}];
}
