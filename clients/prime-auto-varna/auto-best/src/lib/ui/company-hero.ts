import { dev } from '$app/environment';
import { leadSite, type CompanyHeroVariant } from '$config/lead-site';
import { template } from '$config/template';

/** Keep the configured company artwork in production; allow explicit review links locally. */
export function resolveCompanyHero(params: URLSearchParams): CompanyHeroVariant {
  const requested = params.get('companyHero');
  if ((dev || template.mode === 'preview') && (requested === 'studio' || requested === 'circuit')) {
    return requested;
  }
  return leadSite.artwork.companyHero;
}
