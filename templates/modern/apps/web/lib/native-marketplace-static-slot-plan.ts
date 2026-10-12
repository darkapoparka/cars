type Data = Record<string, unknown>;
type Binding = {
  family: "evaluation" | "card" | "chip" | "mobile-quick" | "page" | "request-bootstrap" | "native-metadata";
  path?: readonly string[];
  key?: string;
  default?: string;
  predicate?: "zero" | "positive" | "not";
  choices?: Record<string, string>;
  format?: "json" | "string";
};
interface AtomReceipt { id: string; binding: Binding }
interface RegionReceipt { id: string; binding: "cards" | "chips" | "mobile-quick" | "pages" }
interface SlotReceipt { atoms: readonly AtomReceipt[]; regions: readonly RegionReceipt[] }
const object = (value: unknown): value is Data => Boolean(value && typeof value === "object" && !Array.isArray(value));
const own = (value: Data, key: string) => Object.hasOwn(value, key);
function reject(): never { throw new Error("Unadmitted native data binding"); }
const pathValue = (value: unknown, path: readonly string[] = []) => {
  if (path.length > 8) reject();
  for (const key of path) {
    if (!object(value) || ["__proto__", "constructor", "prototype"].includes(key) || !own(value, key)) return undefined;
    value = value[key];
  }
  return value;
};
const rows = (value: unknown): Data[] => Array.isArray(value) && value.length <= 4096 && value.every(object) ? value : reject();

/** Data-only receipt interpreter. Every selector/choice is producer source-bound;
 * the cheap worker owns no native markup, copied UI, or query snapshot table. */
export const createNativeMarketplaceSlotPlan = (evaluation: Data, receipt: SlotReceipt, policy: Data) => {
  const controls = pathValue(evaluation, ["controls"]);
  const pagination = pathValue(evaluation, ["pagination"]);
  const cards = rows(pathValue(evaluation, ["cards"]));
  const chips = rows(pathValue(controls, ["chips"]));
  const mobile = rows(pathValue(controls, ["mobileQuickFilterItems"]));
  const pages = rows(pathValue(pagination, ["slots"]));
  const keyFor = (family: Binding["family"], row: Data) => family === "card" ? pathValue(row, ["listing", "id"]) : family === "page" ? String(row.page) : row.id;
  const get = (binding: Binding): unknown => {
    let root: unknown;
    switch (binding.family) {
      case "evaluation": root = evaluation; break;
      case "request-bootstrap": root = policy.bootstrap; break;
      case "native-metadata": root = policy.metadataAtoms; break;
      case "card": case "chip": case "mobile-quick": case "page": {
        const source = binding.family === "card" ? cards : binding.family === "chip" ? chips : binding.family === "page" ? pages : mobile;
        const matches = source.filter(row => keyFor(binding.family, row) === binding.key);
        if (matches.length !== 1) reject(); root = matches[0]; break;
      }
      default: reject();
    }
    let value = pathValue(root, binding.path);
    if (value === undefined && own(binding as unknown as Data, "default")) value = binding.default;
    if (binding.predicate) {
      if (binding.predicate === "not") { if (typeof value !== "boolean") reject(); value = !value; }
      else { if (typeof value !== "number" || !Number.isFinite(value)) reject(); value = binding.predicate === "zero" ? value === 0 : value > 0; }
    }
    if (binding.choices) {
      if (!object(binding.choices) || Object.keys(binding.choices).length > 8 || !own(binding.choices, String(value))) reject();
      value = binding.choices[String(value)];
    }
    if (binding.format === "json") value = JSON.stringify(value);
    else if (binding.format === "string") value = String(value);
    if (value === undefined || typeof value === "function" || typeof value === "symbol") reject();
    return value;
  };
  if (receipt.atoms.length + receipt.regions.length > 4096) reject();
  const atoms = Object.create(null) as Record<string, unknown>;
  for (const row of receipt.atoms) { if (own(atoms, row.id)) reject(); atoms[row.id] = get(row.binding); }
  const regions = Object.create(null) as Record<string, string[]>;
  for (const row of receipt.regions) {
    if (own(regions, row.id)) reject();
    switch (row.binding) {
      case "cards": regions[row.id] = cards.map(card => String(pathValue(card, ["listing", "id"]))); break;
      case "chips": regions[row.id] = chips.map(chip => String(chip.id)); break;
      case "mobile-quick": regions[row.id] = mobile.map(item => String(item.id)); break;
      case "pages": regions[row.id] = pages.map(page => String(page.page)); break;
      default: reject();
    }
  }
  return { atoms, regions };
};
