import { dev } from '$app/environment';
import { template } from '$config/template';

/** Explicit review links only; a published dealer always keeps its configured design. */
export const heroPreviewVariants = [
  { id: 'current', label: 'heroPreview.current', mobile: 252, desktop: 492 },
  { id: 'compact', label: 'heroPreview.compact', mobile: 160, desktop: 400 },
  { id: 'balanced', label: 'heroPreview.balanced', mobile: 204, desktop: 448 },
  { id: 'photo', label: 'heroPreview.photo', mobile: 228, desktop: 448 }
] as const;

export type HeroPreviewVariant = typeof heroPreviewVariants[number]['id'];

export function selectedHeroPreview(params: URLSearchParams): HeroPreviewVariant | null {
  if (!dev && template.mode !== 'preview') return null;
  return heroPreviewVariants.find(variant => variant.id === params.get('hero'))?.id ?? null;
}

