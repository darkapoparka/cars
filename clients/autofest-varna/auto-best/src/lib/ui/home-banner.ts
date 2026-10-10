import { dev } from '$app/environment';
import { leadSite, type HomeBannerVariant } from '$config/lead-site';
import { template } from '$config/template';

export const homeBannerVariants = [
  { id: 'motorsport', label: 'home.bannerPreview.stripes' },
  { id: 'kerb', label: 'home.bannerPreview.kerb' },
  { id: 'circuit', label: 'home.bannerPreview.circuit' },
  { id: 'headlights', label: 'home.bannerPreview.headlights' },
  { id: 'taillights', label: 'home.bannerPreview.taillights' }
] as const;

export const canPreviewHomeBanners = dev || template.mode === 'preview';

export function selectedHomeBanner(params: URLSearchParams): HomeBannerVariant {
  return (canPreviewHomeBanners && homeBannerVariants.find(variant => variant.id === params.get('banner'))?.id)
    || leadSite.artwork.homeSectionBanner.variant;
}
