type BrandArtwork = {
  src: string;
  presentation?: 'framed' | 'badge' | 'tesla' | 'peugeot';
};

/** Preserve the original detailed badges; supplementary artwork covers real stock. */
const logos: Record<string, BrandArtwork> = {
  audi: {src: '/reference-assets/brand-audi.png', presentation: 'framed'},
  bmw: {src: '/reference-assets/brand-bmw.png', presentation: 'framed'},
  chevrolet: {src: '/reference-assets/brand-chevrolet.png', presentation: 'framed'},
  ford: {src: '/reference-assets/sell-brand-7.png', presentation: 'framed'},
  haval: {src: '/brands/emblems/haval.png'},
  honda: {src: '/reference-assets/sell-brand-2.png', presentation: 'framed'},
  hyundai: {src: '/reference-assets/brand-hyundai.png', presentation: 'framed'},
  jac: {src: '/brands/emblems/jac.png'},
  jeep: {src: '/brands/emblems/jeep.svg'},
  kia: {src: '/reference-assets/sell-brand-8.png', presentation: 'framed'},
  'land rover': {src: '/brands/emblems/land-rover.svg'},
  lexus: {src: '/brands/emblems/lexus.png'},
  mazda: {src: '/brands/emblems/mazda.svg'},
  'mercedes-benz': {src: '/reference-assets/brand-mercedes.png', presentation: 'framed'},
  mg: {src: '/brands/emblems/mg.svg'},
  mitsubishi: {src: '/brands/emblems/mitsubishi.svg'},
  nissan: {src: '/reference-assets/brand-nissan.png', presentation: 'framed'},
  opel: {src: '/brands/emblems/opel-badge-small.png', presentation: 'badge'},
  peugeot: {src: '/brands/emblems/peugeot-badge-small.png', presentation: 'peugeot'},
  smart: {src: '/brands/emblems/smart-badge-small.png', presentation: 'badge'},
  suzuki: {src: '/brands/emblems/suzuki.svg'},
  tesla: {src: '/brands/emblems/tesla-badge-small.png', presentation: 'tesla'},
  toyota: {src: '/reference-assets/sell-brand-1.png', presentation: 'framed'},
  volkswagen: {src: '/brands/emblems/volkswagen-badge-small.png'},
  volvo: {src: '/brands/emblems/volvo.svg'},
};

export function brandLogo(make: string): BrandArtwork | undefined {
  return logos[make.trim().toLowerCase()];
}
