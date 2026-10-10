type BrandArtwork = {
  src: string;
  presentation?: 'framed';
  sourceSize?: readonly [number, number];
  symbolViewBox?: string;
  wide?: boolean;
  compact?: boolean;
};

/** Preserve the original detailed badges; supplementary artwork covers real stock. */
const logos: Record<string, BrandArtwork> = {
  audi: {src: '/reference-assets/brand-audi.png', presentation: 'framed'},
  bmw: {src: '/reference-assets/brand-bmw.png', presentation: 'framed'},
  chevrolet: {src: '/reference-assets/brand-chevrolet.png', presentation: 'framed'},
  ford: {src: '/reference-assets/sell-brand-7.png', presentation: 'framed'},
  haval: {src: '/brands/emblems/haval.png', sourceSize: [1366, 768], symbolViewBox: '107 278 1152 208', wide: true},
  honda: {src: '/reference-assets/sell-brand-2.png', presentation: 'framed'},
  hyundai: {src: '/reference-assets/brand-hyundai.png', presentation: 'framed'},
  jac: {src: '/brands/emblems/jac.png', sourceSize: [1920, 1080], symbolViewBox: '358 308 1204 464', wide: true},
  jeep: {src: '/brands/emblems/jeep.svg', sourceSize: [24, 24], symbolViewBox: '0 7 24 10', wide: true},
  kia: {src: '/reference-assets/sell-brand-8.png', presentation: 'framed'},
  'land rover': {src: '/brands/emblems/land-rover.svg', sourceSize: [227, 119], symbolViewBox: '0 0 227 119', wide: true},
  lexus: {src: '/brands/emblems/lexus.png', sourceSize: [1920, 1080], symbolViewBox: '675 207 568 406'},
  mazda: {src: '/brands/emblems/mazda.svg', sourceSize: [24, 24], symbolViewBox: '0 2 24 20'},
  'mercedes-benz': {src: '/reference-assets/brand-mercedes.png', presentation: 'framed'},
  mg: {src: '/brands/emblems/mg.svg', sourceSize: [24, 24], symbolViewBox: '0 0 24 24'},
  mitsubishi: {src: '/brands/emblems/mitsubishi.svg', sourceSize: [24, 24], symbolViewBox: '0 2 24 21', compact: true},
  nissan: {src: '/reference-assets/brand-nissan.png', presentation: 'framed'},
  opel: {src: '/brands/emblems/opel-badge-small.png', sourceSize: [455, 256], symbolViewBox: '105 32 245 191'},
  peugeot: {src: '/brands/emblems/peugeot-badge-small.png', sourceSize: [455, 256], symbolViewBox: '143 20 150 155'},
  smart: {src: '/brands/emblems/smart-badge-small.png', sourceSize: [455, 256], symbolViewBox: '117 29 212 200'},
  suzuki: {src: '/brands/emblems/suzuki.svg', sourceSize: [24, 24], symbolViewBox: '0 0 24 24', compact: true},
  tesla: {src: '/brands/emblems/tesla-badge-small.png', sourceSize: [385, 256], symbolViewBox: '112 16 160 158'},
  toyota: {src: '/reference-assets/sell-brand-1.png', presentation: 'framed'},
  volkswagen: {src: '/brands/emblems/volkswagen-badge-small.png', sourceSize: [256, 256], symbolViewBox: '24 24 208 208'},
  volvo: {src: '/brands/emblems/volvo.svg', sourceSize: [24, 24], symbolViewBox: '0 0 24 24'},
};

export function brandLogo(make: string): BrandArtwork | undefined {
  return logos[make.trim().toLowerCase()];
}
