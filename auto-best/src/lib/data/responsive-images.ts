import { leadSite } from '$config/lead-site';

const images: Readonly<Partial<Record<string, readonly { src: string; width: number }[]>>> = leadSite.artwork.responsiveImages;

/** Unregistered/custom artwork keeps the original src as its only source. */
export function imageSrcset(src: string): string | undefined {
  return images[src]?.map(image => `${image.src} ${image.width}w`).join(', ');
}

export const mobileHeroSizes = '(max-width: 375px) calc(100vw - 16px), 370px';
