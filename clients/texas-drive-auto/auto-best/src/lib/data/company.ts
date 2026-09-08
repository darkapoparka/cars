import { brand } from '$config/brand';
export type CompanyServiceIcon = 'inspection' | 'import' | 'leasing' | 'trade-in';
type CompanyService = { index: string; icon: CompanyServiceIcon; title: string; description: string; href: string; cta: string };
type ContactTopicId = 'general' | 'inspection' | 'import' | 'leasing' | 'trade-in';
export type ContactTopic = { id: ContactTopicId; label: string; title: string; description: string; mobileDescription?: string };

/** The old route/topic IDs are compatibility identifiers, not advertised import/finance/trade-in services. */
export const companyServices: CompanyService[] = [
  { index: '01', icon: 'inspection', title: 'View a vehicle', description: `Call ${brand.phone} to confirm the vehicle and a suitable visit.`, href: '/contact?topic=inspection', cta: 'Prepare a viewing question' },
  { index: '02', icon: 'import', title: 'Ask about stock', description: 'Compare the dated listing samples, then confirm current availability with the dealer.', href: '/contact?topic=import', cta: 'Ask about a vehicle' },
  { index: '03', icon: 'leasing', title: 'Cash purchase policy', description: 'No dealer financing or payment plans. Buyer-arranged funding is a separate matter to confirm directly.', href: '/contact?topic=leasing', cta: 'Read the payment policy' },
  { index: '04', icon: 'trade-in', title: 'Purchase questions', description: 'Confirm documents, advertised price and transaction-specific charges before making a commitment.', href: '/contact?topic=trade-in', cta: 'Prepare your questions' }
];
export const contactTopics: ContactTopic[] = [
  { id: 'general', label: 'General question', title: 'Contact Texas Drive Auto', description: 'Confirm current availability, hours and the next steps directly. This preview does not send enquiries.' },
  { id: 'inspection', label: 'Viewing', title: 'Arrange a visit in Dallas', description: 'Call before travelling and identify the vehicle you would like to view. No appointment is booked by this preview.' },
  { id: 'import', label: 'Stock question', title: 'Ask about a listed vehicle', description: 'Custom import is not a verified service in this preview. Use this topic for questions about the dealer’s advertised stock.' },
  { id: 'leasing', label: 'Payment policy', title: 'No dealer financing', description: 'The dealer’s published policy rules out dealer finance and payment plans. It permits buyer-arranged finance and mentions cash, cashier’s checks and major cards; confirm applicable terms directly. No credit application is accepted here.' },
  { id: 'trade-in', label: 'Purchase details', title: 'Confirm the transaction details', description: 'This preview does not promise a trade-in, valuation, warranty, delivery or approval. Ask the dealer which arrangements apply to the selected vehicle.' }
];
export const contactPreparation: Partial<Record<ContactTopicId, { title: string; items: string[] }>> = {
  inspection: { title: 'Before a visit', items: ['The selected vehicle and source listing ID', 'Your preferred day and time', 'Confirmation directly from the dealer'] },
  import: { title: 'Your stock question', items: ['Make, model and year', 'The advertised price in USD', 'The source listing URL'] },
  leasing: { title: 'Confirm payment arrangements', items: ['No dealer financing or payment plans', 'Any buyer-arranged funding', 'Final price, tax, title and licensing charges'] },
  'trade-in': { title: 'Prepare the purchase discussion', items: ['Vehicle and listing ID', 'Documents you need to review', 'Questions about any proposed arrangement'] }
};
export function resolveImportUrl(value: string | null): string | null {
  const candidate = value?.trim();
  if (!candidate || candidate.length > 2048) return null;
  try { const url = new URL(candidate); return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : null; } catch { return null; }
}
export const resolveContactTopic = (value: string | null) => contactTopics.find(topic => topic.id === value) ?? contactTopics[0];
/** Public marketplace map for the matched 10511 Olympic Drive dealership; not a guessed Dallas pin. */
export const showroomCoordinates = { latitude: 32.864498138427734, longitude: -96.88739776611328 } as const;
