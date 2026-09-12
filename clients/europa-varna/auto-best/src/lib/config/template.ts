import { featuredVehicles } from '$data/inventory';

/** Master defaults. A client copy owns its own values and verification. */
type TemplatePresentation = {
  mode: 'preview' | 'published';
  canonicalOrigin: string | null;
  verifiedIdentity: boolean;
  verifiedInventory: boolean;
  sections: { demoTeam: boolean; demoPartners: boolean };
};

export const template: TemplatePresentation = {
  mode: 'preview',
  canonicalOrigin: null,
  verifiedIdentity: false,
  verifiedInventory: false,
  sections: { demoTeam: false, demoPartners: false }
};

export function canIndex() {
  if (template.mode !== 'published') return false;
  if (!template.verifiedIdentity || !template.verifiedInventory || !template.canonicalOrigin || template.sections.demoTeam || template.sections.demoPartners) {
    throw new Error('Publishing requires verified identity/inventory, a canonical origin and disabled sample sections.');
  }
  if (featuredVehicles.some(vehicle => vehicle.verification !== 'verified' || !vehicle.evidenceUrl)) throw new Error('Each vehicle requires record-level evidence before publishing.');
  const origin = new URL(template.canonicalOrigin);
  if (origin.protocol !== 'https:' || origin.origin !== template.canonicalOrigin || /localhost|127\.0\.0\.1/.test(origin.hostname)) throw new Error('A public HTTPS canonical origin is required.');
  return true;
}
