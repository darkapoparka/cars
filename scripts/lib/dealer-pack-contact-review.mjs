import {createHash} from 'node:crypto';

const sha256 = value => createHash('sha256').update(value).digest('hex');
const key = value => String(value ?? '').normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const roles = /^(?:info|sales|office|contact|hello|business|admin|enquiries|enquiry|support|reception|marketing|booking|bookings|service|services)(?:[._+-]|$)/i;
const businessWords = /(?:cars?|motors?|autos?|automotive|vehicles?|trading|showroom|dealership|garage|limited|ltd|llc)/i;
const freeEmail = /^(?:gmail|googlemail|hotmail|outlook|live|yahoo|icloud|aol|protonmail|proton)\./i;
const publicUrl = value => {try {const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password && url.hostname.includes('.') && !/^(?:localhost|127\.|10\.|192\.168\.)/.test(url.hostname);} catch {return false;}};

/** Heuristics flag ambiguity for source review; a mobile number alone is not proof of a personal contact. */
export function inspectPackContacts(facts, {contactReview} = {}) {
  const business = facts?.business ?? {}, flags = [], nameKey = key(business.name);
  const add = (field, value, reason) => flags.push({field: 'business.' + field, valueSha256: sha256(String(value)), code: 'PERSONAL_CONTACT_REVIEW_REQUIRED', reason});
  const email = String(business.email ?? '').trim();
  if (email) {
    const [local = '', domain = ''] = email.split('@'), localKey = key(local);
    const tokens = String(business.name ?? '').toLowerCase().split(/[^a-z0-9]+/).filter(token => token.length >= 3 && !/^(?:the|and|used|car|cars|auto|motors|sales)$/.test(token));
    const branded = localKey.length >= 4 && (nameKey.length >= 4 && (nameKey.includes(localKey) || localKey.includes(nameKey)) || tokens.some(token => localKey.includes(token)));
    if (!roles.test(local) && !businessWords.test(local) && !branded && (freeEmail.test(domain) || /^[a-z]{2,}[._-][a-z]{2,}\d{0,3}$/i.test(local))) {
      add('email', email, 'Mailbox resembles an individual or an unbranded personal-provider address; confirm its published business role or omit it.');
    }
  }
  for (const field of ['phone', 'phoneDisplay', 'email']) {
    const value = String(business[field] ?? '');
    if (/\b(?:personal|private|owner(?:'s)?|manager(?:'s)?|mr\.?|mrs\.?|ms\.?)\b/i.test(value)) add(field, value, 'Contact value contains an explicit personal-role marker.');
  }
  const unique = flags.filter((row, index) => flags.findIndex(other => other.field === row.field && other.valueSha256 === row.valueSha256) === index);
  const resolved = row => contactReview?.schemaVersion === 1 && contactReview.kind === 'cars-public-business-contact-review' && contactReview.dealer === facts.slug &&
    contactReview.checks?.some(check => check.field === row.field && check.valueSha256 === row.valueSha256 && check.classification === 'public-business' &&
      check.reviewed === true && check.reviewKind === 'source-evidence' && publicUrl(check.sourceUrl) && Number.isFinite(Date.parse(check.observedAt)));
  return {schemaVersion: 1, kind: 'cars-automated-public-contact-screen', dealer: facts?.slug ?? null, method: 'heuristic; no claim that unflagged values cannot be personal',
    flags: unique.map(row => ({...row, resolvedByPublicBusinessEvidence: resolved(row)})), blocking: unique.filter(row => !resolved(row)).map(row => row.field)};
}
