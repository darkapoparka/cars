import type { AssetPath } from "$app/types";
import type { Locale } from "#lib/config/site.ts";
import source from "./vehicles.json";

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  edition: string;
  incoming: boolean;
  year: number | null;
  month: number | null;
  priceEur: number | null;
  mileageKm: number | null;
  powerHp: number | null;
  fuel: string;
  transmission: string;
  body: string;
  color: string;
  features: string[];
  /** Path inside static/, checked by SvelteKit against the real files. */
  image: AssetPath;
  sourceUrl: string | null;
  observedAt: string | null;
}

export const vehicles = source as Vehicle[];

export const getVehicle = (id: string) => vehicles.find((v) => v.id === id);

/** Newest listings first, as published by the dealer's export. */
export const latest = (count: number) => vehicles.slice(0, count);

export const makes = [...new Set(vehicles.map((v) => v.make))].sort();

/** Source exports are Bulgarian; English labels for the known attribute values. */
const english: Record<string, string> = {
  Бензинов: "Petrol",
  Дизелов: "Diesel",
  Хибриден: "Hybrid",
  "Plug-in хибрид": "Plug-in hybrid",
  Електрически: "Electric",
  Автоматична: "Automatic",
  Ръчна: "Manual",
  Полуавтоматична: "Semi-automatic",
  Купе: "Coupé",
  "Стреч лимузина": "Saloon",
  Седан: "Saloon",
  Джип: "SUV",
  Комби: "Estate",
  Ван: "Van",
  Кабрио: "Convertible",
  Хечбек: "Hatchback",
  Графит: "Graphite",
  Черен: "Black",
  Перла: "Pearl white",
  Бял: "White",
  Червен: "Red",
  Син: "Blue",
  Кафяв: "Brown",
  Сив: "Grey",
  Сребърен: "Silver",
  Зелен: "Green",
};

export const attr = (value: string, locale: Locale) =>
  locale === "en" ? (english[value] ?? value) : value;

const numberFormat = (locale: Locale) =>
  new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-GB");

export const formatPrice = (eur: number | null, locale: Locale) =>
  eur === null
    ? locale === "bg"
      ? "Цена при запитване"
      : "Price on request"
    : new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-GB", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(eur);

export const formatKm = (km: number | null, locale: Locale) =>
  km === null
    ? "—"
    : `${numberFormat(locale).format(km)} ${locale === "bg" ? "км" : "km"}`;

export const formatHp = (hp: number | null, locale: Locale) =>
  hp === null ? "—" : `${hp} ${locale === "bg" ? "к.с." : "hp"}`;
