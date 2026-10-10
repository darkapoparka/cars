import type { Filters } from './types';
import { modelLeafKey, type NativeModelGroup } from './native-taxonomy';
import { modelsForMake } from './make-selection';
export type ModelDraft = { selected: string[]; variants: Record<string, string> };
export function modelDraftFor(filters: Filters, make: string, exclude: boolean): ModelDraft {
  const selected = modelsForMake(filters, make, exclude);
  const legacy = (exclude ? filters.excludedMakeVariants : filters.makeVariants)[make] || '';
  const scoped = (exclude ? filters.excludedModelVariants : filters.modelVariants)[make] || {};
  const variants = Object.fromEntries(
    (selected.length ? selected : ['']).map((name) => [name, legacy]),
  );
  return { selected: [...selected], variants: { ...variants, ...scoped } };
}
export function toggleModelDraft(
  draft: ModelDraft,
  name: string,
  checked: boolean,
  groups: NativeModelGroup[],
  parentName?: string,
): ModelDraft {
  if (!name) return { ...draft, selected: [] };
  const parent = parentName
    ? groups.find((group) => group.name === parentName)
    : groups.find((group) => group.children.includes(name) && group.name !== name);
  const family = parentName
    ? undefined
    : groups.find((group) => group.name === name && group.children.length);
  const key = modelLeafKey(name, parent);
  let selected = [...draft.selected];
  const variants = { ...draft.variants };
  if (family) {
    selected = selected.filter(
      (model) =>
        model !== name &&
        !family.children.map((child) => modelLeafKey(child, family)).includes(model),
    );
    if (checked) selected.push(name);
  } else if (parent && selected.includes(parent.name)) {
    selected = selected.filter((model) => model !== parent.name);
    for (const sibling of parent.children) {
      if (modelLeafKey(sibling, parent) === key && !checked) continue;
      const siblingKey = modelLeafKey(sibling, parent);
      selected.push(siblingKey);
      variants[siblingKey] = variants[siblingKey] || variants[parent.name] || '';
    }
  } else selected = checked ? [...selected, key] : selected.filter((model) => model !== key);
  if (checked && parent)
    variants[key] =
      variants[key] ||
      variants[parent.name] ||
      parent.children.map((child) => variants[modelLeafKey(child, parent)]).find(Boolean) ||
      '';
  return { selected: [...new Set(selected)], variants };
}
export function selectedModelVariants(draft: ModelDraft): Record<string, string> {
  return Object.fromEntries(
    (draft.selected.length ? draft.selected : [''])
      .filter((model) => draft.variants[model]?.trim())
      .map((model) => [model, draft.variants[model].trim()]),
  );
}

export function modelVariantFor(
  draft: ModelDraft,
  model: string,
  group?: NativeModelGroup,
): string {
  return (
    draft.variants[model] ||
    group?.children
      .map((child) => modelLeafKey(child, group))
      .map((key) => (draft.selected.includes(key) ? draft.variants[key] : ''))
      .find(Boolean) ||
    ''
  );
}
export function setModelVariant(
  draft: ModelDraft,
  model: string,
  value: string,
  group?: NativeModelGroup,
): ModelDraft {
  const variants = { ...draft.variants, [model]: value };
  for (const child of group?.children || []) {
    const key = modelLeafKey(child, group);
    if (draft.selected.includes(key)) variants[key] = value;
  }
  return { ...draft, variants };
}
