// Read-only release planning. This is not a second dealer generator or a
// replacement for package-dealer.mjs, source approval, or hosted acceptance.
export const FIVE_DESIGN_KEYS = Object.freeze(['auto-best', 'modern', 'import', 'app', 'mobile']);
export const FIVE_DESIGN_PACKAGING_CANDIDATE = '4';
export const FIVE_DESIGN_COHORT = Object.freeze([
  'cars-promosalevarna', 'cars-outletcarsvarna', 'cars-priselci', 'cars-perfectauto',
  'cars-navaracar', 'cars-legendauto', 'cars-kgteamauto', 'cars-ivoauto',
  'excellent-cars', 'cars-elitautoimport', 'cars-championautopro', 'cars-avangardauto',
  'cars-automarketvarna', 'cars-autolife', 'cars-astracar', 'cars-isautovarna',
  'cars-eliqauto', 'cars-f1rstmotors', 'day-and-night-a', 'cars-alhamooralthahabi',
  'cars-albasmamotors', 'cars-alreefusedcars', 'cars-thedealerspoint',
  'cars-texasdriveauto', 'cars-asko96',
]);
const baseFor = index => index === 0 ? '' : `/variant-${index + 1}`;
const entryFor = (key, base) => key === 'modern' ? base + '/cars' : base + '/';

function checkMounts(variants) {
  if (!Array.isArray(variants) || ![3, 4, 5].includes(variants.length)) throw Error('Expected an explicit three, four or five-design manifest');
  if (new Set(variants.map(v => v?.key)).size !== variants.length) throw Error('Duplicate or missing design');
  for (const [index, variant] of variants.entries()) {
    if (!variant || ![...FIVE_DESIGN_KEYS, 'carwow'].includes(variant.key)) throw Error('Unknown design family');
    const base = baseFor(index);
    if (variant.base !== base || variant.entry !== entryFor(variant.key, base)) throw Error('Unknown mount/entry requires explicit review');
  }
  if (variants[0].key !== 'auto-best' || !['modern', 'import'].includes(variants[1].key)) throw Error('Unrecognized base dealer configuration');
}

export function assertFiveDesignSelection(variants) {
  checkMounts(variants);
  if (variants.length !== 5 || variants[3].key !== 'app' || variants[4].key !== 'mobile'
      || !['modern', 'import'].includes(variants[2].key)
      || FIVE_DESIGN_KEYS.some(key => !variants.some(v => v.key === key))) {
    throw Error('Release requires Auto Best, Modern, Import, App and Mobile exactly once; no Carwow');
  }
  return variants;
}

/** Proposes route changes without modifying manifests or client/template bytes. */
export function planFiveDesignSelection(current) {
  checkMounts(current);
  if (current.length === 5) {
    assertFiveDesignSelection(current);
    return { variants: structuredClone(current), addFamilies: [], removeFromPublication: [], replaceMount: null };
  }
  if (current[2].key !== 'carwow' || (current.length === 4 && current[3].key !== 'app')) throw Error('Unrecognized legacy dealer release');
  // Keep the existing Import URL for Outletcars/PromoSale. Replacing Carwow with
  // Import again would duplicate Import and still leave those dealers no Modern.
  const replacement = current[1].key === 'modern' ? 'import' : 'modern';
  const keys = ['auto-best', current[1].key, replacement, 'app', 'mobile'];
  const variants = keys.map((key, index) => ({ key, base: baseFor(index), entry: entryFor(key, baseFor(index)) }));
  assertFiveDesignSelection(variants);
  return {
    variants,
    addFamilies: keys.filter(key => !current.some(v => v.key === key)),
    removeFromPublication: ['carwow'],
    preserveSource: ['carwow'],
    replaceMount: { base: '/variant-3', from: 'carwow', to: replacement, oldVehicleUrls: 'requires-inventory-id-mapping-not-suffix-redirects' },
  };
}

/** Select only the named 25, never every research record in the registry. */
export function resolveFiveDesignCohort(registry) {
  if (!Array.isArray(registry?.dealers)) throw Error('Missing dealer registry');
  return FIVE_DESIGN_COHORT.map(project => {
    const matches = registry.dealers.filter(dealer => dealer.delivery?.projectName === project);
    if (matches.length !== 1) throw Error(`Expected one registry record for ${project}, found ${matches.length}`);
    const dealer = matches[0];
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(dealer.slug || '') || !/^prj_[A-Za-z0-9]+$/.test(dealer.delivery.projectId || '')) throw Error('Unverified project identity: ' + project);
    if (!/^[\w.-]+\/[\w.-]+$/.test(dealer.repository || '') || (dealer.delivery.gitRepository != null && dealer.delivery.gitRepository !== dealer.repository)) throw Error('Repository binding mismatch: ' + project);
    // A recorded CLI deployment can have no Git binding. Keep it in the audit
    // cohort and report the unresolved binding; never invent one or auto-deploy.
    return dealer;
  });
}
