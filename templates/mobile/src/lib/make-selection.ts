import type { Filters } from './types';
import { modelLabel } from './native-taxonomy';
/** Clear make/model criteria without changing the budget or other filter sections. */
export function clearMakeSelections(): Partial<Filters> {
  return {
    makes: [],
    excludedMakes: [],
    models: [],
    makeModels: {},
    excludedModels: {},
    makeVariants: {},
    excludedMakeVariants: {},
    modelVariants: {},
    excludedModelVariants: {},
  };
}
/** Legacy unscoped URLs remain readable; new edits are always scoped to their make. */
export function modelsForMake(filters: Filters, make: string, exclude = false): string[] {
  if (exclude) return filters.excludedModels[make] || [];
  return (
    filters.makeModels[make] ||
    (filters.makes.length === 1 && filters.makes[0] === make ? filters.models : [])
  );
}
export function applyMakeSelection(
  filters: Filters,
  make: string,
  models: string[],
  exclude: boolean,
  variant = '',
  modelVariantDraft?: Record<string, string>,
): Partial<Filters> {
  const makeModels = { ...filters.makeModels };
  if (!Object.keys(makeModels).length && filters.makes.length === 1 && filters.models.length)
    makeModels[filters.makes[0]] = [...filters.models];
  const excludedModels = { ...filters.excludedModels };
  const makeVariants = { ...filters.makeVariants };
  const excludedMakeVariants = { ...filters.excludedMakeVariants };
  let makes = [...filters.makes];
  let excludedMakes = [...filters.excludedMakes];
  if (exclude) {
    if (!models.length && !variant.trim()) {
      excludedMakes = [...new Set([...excludedMakes, make])];
      makes = makes.filter((name) => name !== make);
      delete makeModels[make];
      delete makeVariants[make];
      delete excludedModels[make];
      delete excludedMakeVariants[make];
    } else {
      excludedMakes = excludedMakes.filter((name) => name !== make);
      excludedModels[make] = [...models];
      excludedMakeVariants[make] = variant.trim();
    }
  } else {
    makes = [...new Set([...makes, make])];
    excludedMakes = excludedMakes.filter((name) => name !== make);
    makeModels[make] = [...models];
    makeVariants[make] = variant.trim();
  }
  const modelVariants = { ...filters.modelVariants };
  const excludedModelVariants = { ...filters.excludedModelVariants };
  if (modelVariantDraft) {
    const target = exclude ? excludedModelVariants : modelVariants;
    target[make] = Object.fromEntries(
      models
        .filter((model) => modelVariantDraft[model]?.trim())
        .map((model) => [model, modelVariantDraft[model].trim()]),
    );
  }
  if (exclude && !models.length && !variant.trim()) {
    delete modelVariants[make];
    delete excludedModelVariants[make];
  }
  return {
    modelVariants,
    excludedModelVariants,
    makes,
    excludedMakes,
    makeModels,
    excludedModels,
    makeVariants,
    excludedMakeVariants,
    models: [...new Set(makes.flatMap((name) => makeModels[name] || []))],
  };
}
export function removeMakeSelection(
  filters: Filters,
  make: string,
  excluded = false,
): Partial<Filters> {
  const makeModels = { ...filters.makeModels };
  const makeVariants = { ...filters.makeVariants };
  const excludedModels = { ...filters.excludedModels };
  const excludedMakeVariants = { ...filters.excludedMakeVariants };
  if (excluded) {
    delete excludedModels[make];
    delete excludedMakeVariants[make];
    const excludedModelVariants = { ...filters.excludedModelVariants };
    delete excludedModelVariants[make];
    return {
      excludedModelVariants,
      excludedMakes: filters.excludedMakes.filter((name) => name !== make),
      excludedModels,
      excludedMakeVariants,
    };
  }
  delete makeModels[make];
  delete makeVariants[make];
  const makes = filters.makes.filter((name) => name !== make);
  const modelVariants = { ...filters.modelVariants };
  delete modelVariants[make];
  return {
    modelVariants,
    makes,
    makeModels,
    makeVariants,
    models: [...new Set(makes.flatMap((name) => makeModels[name] || []))],
  };
}

export function excludedMakeNames(filters: Filters): string[] {
  return [
    ...new Set([
      ...filters.excludedMakes,
      ...Object.keys(filters.excludedModels).filter((make) => filters.excludedModels[make].length),
      ...Object.keys(filters.excludedMakeVariants).filter(
        (make) => filters.excludedMakeVariants[make],
      ),
    ]),
  ];
}
export function makeSelectionSummary(filters: Filters, make: string, excluded = false): string {
  const models = modelsForMake(filters, make, excluded);
  const generic = (excluded ? filters.excludedMakeVariants : filters.makeVariants)[make] || '';
  const variants = (excluded ? filters.excludedModelVariants : filters.modelVariants)[make] || {};
  if (!models.length) return generic || 'Any';
  return models
    .map((model) => [modelLabel(model), variants[model] || generic].filter(Boolean).join(' '))
    .join(', ');
}
