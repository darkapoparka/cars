import { FIVE_DESIGN_KEYS, assertFiveDesignSelection, planFiveDesignSelection } from './five-design-release.mjs';

// Planning only. The existing publisher must implement this reserved version
// before these proposed manifests can be built or installed into any dealer.
export const SIX_DESIGN_KEYS = Object.freeze([...FIVE_DESIGN_KEYS, 'karento-best']);
export const SIX_DESIGN_PACKAGING_CANDIDATE = '5';
export const KARENTO_VARIANT = Object.freeze({ key: 'karento-best', base: '/variant-6', entry: '/variant-6/' });

export function assertSixDesignSelection(variants) {
  if (!Array.isArray(variants) || variants.length !== 6) throw Error('Expected six explicit design families');
  assertFiveDesignSelection(variants.slice(0, 5));
  if (Object.keys(KARENTO_VARIANT).some(key => variants[5]?.[key] !== KARENTO_VARIANT[key])) throw Error('Karento Best requires its reviewed sixth mount/entry');
  return variants;
}

export function planSixDesignSelection(current) {
  if (Array.isArray(current) && current.length === 6) {
    assertSixDesignSelection(current);
    return { variants: structuredClone(current), addFamilies: [], removeFromPublication: [], replaceMount: null };
  }
  const five = planFiveDesignSelection(current);
  const result = { ...five, variants: [...five.variants, { ...KARENTO_VARIANT }], addFamilies: [...five.addFamilies, 'karento-best'] };
  assertSixDesignSelection(result.variants);
  return result;
}
