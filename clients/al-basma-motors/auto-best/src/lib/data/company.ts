import { brand } from '$config/brand';

export type CompanyServiceIcon = 'inspection' | 'import' | 'leasing' | 'trade-in';
type CompanyService = { index: string; icon: CompanyServiceIcon; title: string; description: string; href: string; cta: string };
type ContactTopicId = 'general' | 'inspection' | 'import' | 'leasing' | 'trade-in';
export type ContactTopic = { id: ContactTopicId; label: string; title: string; description: string; mobileDescription?: string };

export const contactPreparation: Partial<Record<ContactTopicId, { title: string; items: string[] }>> = {
  inspection: { title: 'Prepare for the visit', items: ['Vehicle or listing link', 'Preferred day and time', 'Showroom confirmation'] },
  import: { title: 'Export enquiry', items: ['Vehicle you are interested in', 'Destination market', 'Questions about current export process'] },
  'trade-in': { title: 'Vehicle enquiry', items: ['Make, model and year', 'Mileage and condition', 'Photos or a listing link'] }
};

export function resolveImportUrl(value: string | null): string | null {
  const candidate = value?.trim();
  if (!candidate || candidate.length > 2048) return null;
  try { const url = new URL(candidate); return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : null; } catch { return null; }
}

export const companyServices: CompanyService[] = [
  { index: '01', icon: 'inspection', title: `Showroom viewing in ${brand.city}`, description: 'Confirm the vehicle and visit time directly with the showroom.', href: '/contact?topic=inspection', cta: 'Arrange a viewing' },
  { index: '02', icon: 'import', title: 'Export enquiries', description: 'The official site includes an export journey; ask for current vehicle-specific terms.', href: '/contact?topic=import', cta: 'Ask about export' },
  { index: '03', icon: 'trade-in', title: 'Vehicle sales', description: 'Browse the dated sample catalogue and confirm live availability with the showroom.', href: '/listing-grid', cta: 'Browse cars' }
];

export const contactTopics: ContactTopic[] = [
  { id: 'general', label: 'General enquiry', title: 'Talk to the showroom', description: `Ask about current stock, pricing or next steps with ${brand.name}.` },
  { id: 'inspection', label: 'Viewing', title: `Arrange a viewing in ${brand.city}`, description: 'Confirm the exact vehicle and appointment before travelling.' },
  { id: 'import', label: 'Export', title: 'Export enquiry', description: 'Ask the showroom about current export options for a specific vehicle.' },
  { id: 'leasing', label: 'Payment', title: 'Payment options', description: 'Ask about current payment options. This demo does not quote or promise finance terms.' },
  { id: 'trade-in', label: 'Vehicle enquiry', title: 'Discuss your vehicle', description: 'Share your vehicle details for a direct conversation with the showroom.' }
];
export const resolveContactTopic = (value: string | null) => contactTopics.find((topic) => topic.id === value) ?? contactTopics[0];
export const showroomCoordinates = { latitude: 25.341, longitude: 55.421 } as const;
