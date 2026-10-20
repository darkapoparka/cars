/** Reuse the maintained absent-contact consumers for an explicit dealer pack.
 * Facts remain unchanged. Auto's existing provider preparation applies its own
 * optional controls from this same normalized fact policy later in the pipeline.
 */
import {applyModernOptionalContactFallback} from '../publishing/dealer-contact-fallback.mjs';
import {repairImportUkOptionalPhone, UK_IMPORT_PHONE_INPUT_PATHS} from './client-refresh-uk-native.mjs';
import {adaptPackOptionalAddress} from './dealer-pack-optional-address.mjs';

export function applyDealerPackOptionalContact(files, manifest, {profile, typescript} = {}) {
  if (manifest.sourceFormat !== 'dealer-pack' || profile?.factPolicy !== 'dealer-pack-optional-v1') return {applied: false, reason: 'Existing dealer policy preserved'};
  const factPolicy = profile.factPolicy, draft = new Map(files), b = profile.business;
  if (!b || !['GB', 'AE', 'US'].includes(b.countryCode)) throw Error('Unsupported dealer-pack contact market');
  const modern = applyModernOptionalContactFallback(draft, manifest, {profile, typescript, factPolicy});
  const addressPaths = adaptPackOptionalAddress(draft, profile);
  let imported = [];
  // The maintained Import refresh adapter already prepares the GB boundary.
  // Other pack markets reuse it once, before catalog execution or qualification.
  if (b.countryCode !== 'GB' && !b.phoneDisplay && !b.phoneHref && !b.phoneE164) {
    const relative = new Map(UK_IMPORT_PHONE_INPUT_PATHS.map(name => [name, draft.get('import/' + name)]));
    imported = repairImportUkOptionalPhone(relative, profile, {factPolicy});
    for (const name of imported) draft.set('import/' + name, relative.get(name));
  }
  for (const [name, bytes] of draft) if (bytes !== files.get(name)) files.set(name, bytes);
  return {schemaVersion: 1, kind: 'cars-dealer-pack-optional-contact', dealer: manifest.slug,
    factPolicy, applied: modern.applied || imported.length > 0 || addressPaths.length > 0, modern, addressPaths, importPaths: imported.map(name => 'import/' + name),
    factsChanged: false, phoneInvented: false};
}
