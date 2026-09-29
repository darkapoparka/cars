import { sourceKeys } from '$lib/locale/catalog';
import { intlLocale, type Locale } from '$lib/locale/core';
import type { getI18n } from '$lib/locale/context';
import { message, templateText, type MessageKey, type MessageParameters } from '$lib/locale/messages';

/** Immutable template patterns only. Values are interpolated after translation. */
export function templateMessage(i18n: ReturnType<typeof getI18n>, source: string, parameters: MessageParameters): string {
  return formatTemplate(i18n.locale, source, parameters);
}

export function formatTemplate(locale: Locale, source: string, parameters: MessageParameters): string {
  const key = (sourceKeys as Record<string, MessageKey>)[source];
  if (key) return message(locale, key, parameters);
  throw new Error('Missing or ambiguous template pattern; use a context-specific message key: ' + source);
}

// Only this immutable vehicle vocabulary is translated. Unknown listing values remain data.
const specificationCopy: Record<string, MessageKey> = {
  "Комби": "m_3e4e9a166ed6",
  "Бензин": "m_7fc05f87ca8e",
  "Дизел": "m_0a3408c47c37",
  "Автоматик": "inventory.spec.automatic",
  "Ръчна": "m_b0b9fe24ffa9",
  "Електрически": "m_a76dab2d1c01",
  "Хибрид": "m_6c67dc13f839",
  "Седан": "m_18c9b86509cc",
  "Хечбек": "m_9f1f74cec522",
  "Купе": "m_832e1c7d4ebe",
  "Спортбек": "inventory.spec.sportback",
  "SUV купе": "m_6cbd2c24a672",
  "Petrol": "m_7fc05f87ca8e",
  "Diesel": "m_0a3408c47c37",
  "Electric": "m_a76dab2d1c01",
  "Hybrid": "m_6c67dc13f839",
  "Automatic": "inventory.spec.automatic",
  "Manual": "m_b0b9fe24ffa9",
  "SUV": "m_917ca2fafa47",
  "Coupe": "m_832e1c7d4ebe",
  "Wagon": "m_3e4e9a166ed6",
  "Sportback": "inventory.spec.sportback",
  "Sedan": "m_18c9b86509cc",
  "Crossover": "m_2295ff6f8a73",
  "Кросоувър": "m_2295ff6f8a73",
  "Hatchback": "m_9f1f74cec522",
  "Pickup Truck": "inventory.spec.pickup",
  "Pickup": "inventory.spec.pickup",
  "Minivan": "m_6d28e4a0e711",
  "Миниван": "m_6d28e4a0e711",
  "Convertible": "m_7ef86d78ff2e",
  "new": "inventory.condition.new",
  "used": "inventory.condition.used",
  "4x4": "m_4ac106d869ee",
  "360° камера": "m_3ef89627aca8",
  "Панорамен покрив": "m_e83730e71b1f",
  "Подгряване на седалки": "m_ddccaa432a46",
  "Навигация": "m_e638fc3afbee",
  "Парктроник": "m_0b94480dd826",
  "Безключов достъп": "m_fb95761972ed",
  "Адаптивен круиз контрол": "m_41d67db432c1",
  "Пикап": "inventory.spec.pickup",
  "Кабриолет": "m_7ef86d78ff2e"
};

export const specificationLabel = (value: string, locale: Locale): string =>
  Object.hasOwn(specificationCopy, value) ? message(locale, specificationCopy[value]) : value;

export const formatMileage = (value: number, locale: Locale): string =>
  new Intl.NumberFormat(intlLocale(locale), { style: 'unit', unit: 'kilometer', unitDisplay: 'short' }).format(value);
