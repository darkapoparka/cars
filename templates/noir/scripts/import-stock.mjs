// Normalizes a dealer stock export (data/stock.source.json) into the typed
// inventory module the site reads (src/lib/data/vehicles.json).
// Usage: node scripts/import-stock.mjs [source.json]
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("..", import.meta.url);
const sourcePath =
  process.argv[2] ?? fileURLToPath(new URL("data/stock.source.json", root));
const targetPath = fileURLToPath(new URL("src/lib/data/vehicles.json", root));

const MAKES = [
  "Mercedes-Benz",
  "Land Rover",
  "Alfa Romeo",
  "Aston Martin",
  "Rolls-Royce",
  "BMW",
  "Audi",
  "Porsche",
  "Bentley",
  "Lamborghini",
  "Ferrari",
  "Maserati",
  "McLaren",
  "Volkswagen",
  "Volvo",
  "Lexus",
  "Toyota",
  "Tesla",
  "Jaguar",
  "Mini",
];

const MONTHS = [
  "януари",
  "февруари",
  "март",
  "април",
  "май",
  "юни",
  "юли",
  "август",
  "септември",
  "октомври",
  "ноември",
  "декември",
];

const CYRILLIC = /[Ѐ-ӿ]/;
const INCOMING = /очакван/i;

/** @param {string} value */
const toNumber = (value) => {
  const digits = value
    .replace(/[^\d.,]/g, "")
    .replace(/\s/g, "")
    .replace(",", ".");
  const number = Number.parseFloat(digits);
  return Number.isFinite(number) ? Math.round(number) : null;
};

/** Words that start the free-text listing headline rather than the model name. */
/** @param {string} word @param {string} make @param {string[]} model */
const endsModel = (word, make, model) =>
  CYRILLIC.test(word) ||
  word.includes("*") ||
  word.length > 8 ||
  word.toLowerCase().startsWith(make.split(/[\s-]/)[0].toLowerCase()) ||
  (model.length > 0 && word.toLowerCase() === model[0].toLowerCase());

/** @param {string} title */
function splitTitle(title) {
  const make = MAKES.find((m) =>
    title.toLowerCase().startsWith(m.toLowerCase()),
  );
  if (!make) {
    const [first, ...rest] = title.split(/\s+/);
    return {
      make: first,
      model: rest.slice(0, 2).join(" "),
      edition: rest.slice(2).join(" "),
    };
  }
  const words = title.slice(make.length).trim().split(/\s+/);
  /** @type {string[]} */
  const model = [];
  let index = 0;
  for (; index < words.length && model.length < 3; index++) {
    if (endsModel(words[index], make, model)) break;
    model.push(words[index]);
  }
  const edition = words
    .slice(index)
    .join(" ")
    .replace(/очакван(\s*вно?с?)?/gi, "")
    .replace(/\s*\*\s*/g, " · ")
    .replace(/\s*\|\s*/g, " · ")
    .replace(/^[\s·]+|[\s·]+$/g, "")
    .replace(/\s{2,}/g, " ");
  return { make, model: model.join(" ").replace(/^Rs(\d)/, "RS$1"), edition };
}

/** @param {string} value */
function parseDate(value) {
  const [monthName, year] = value.toLowerCase().split(/\s+/);
  const month = MONTHS.indexOf(monthName) + 1;
  return { year: Number(year) || null, month: month || null };
}

const source = JSON.parse(await readFile(sourcePath, "utf8"));

const vehicles = source.map((/** @type {Record<string, any>} */ item) => {
  const { make, model, edition } = splitTitle(item.title);
  const { year, month } = parseDate(item.date ?? "");
  return {
    id: String(item.id),
    make,
    model,
    edition,
    incoming: INCOMING.test(item.title),
    year,
    month,
    priceEur: toNumber(item.priceEur ?? ""),
    mileageKm: toNumber(item.mileage ?? ""),
    powerHp: toNumber(item.power ?? ""),
    fuel: item.fuel ?? "",
    transmission: item.transmission ?? "",
    body: item.body ?? "",
    color: item.color ?? "",
    features: (item.features ?? []).map((/** @type {string} */ f) =>
      f.replaceAll("\\", "/"),
    ),
    image: `stock/${item.id}.webp`,
    sourceUrl: item.sourceUrl ?? null,
    observedAt: item.observedAt ?? null,
  };
});

await writeFile(targetPath, `${JSON.stringify(vehicles, null, 2)}\n`);
console.log(`Wrote ${vehicles.length} vehicles to ${targetPath}`);
