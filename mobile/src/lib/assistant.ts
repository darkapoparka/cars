import { vehicles } from './catalog';
import { money, number } from './search';
/** Deterministic fixture helper; this does not call an AI or marketplace API. */
export function answerLocally(message: string): { text: string; ids: string[] } {
  const text = message.toLowerCase();
  const requestedModels = vehicles.filter((v) =>
    new RegExp(`\\b${v.model.toLowerCase()}\\b`).test(text),
  );
  const fuels = ['electric', 'diesel', 'petrol', 'hybrid'].filter((fuel) => text.includes(fuel));
  let matches = requestedModels.length ? requestedModels : [...vehicles];
  if (fuels.length)
    matches = matches.filter((v) => fuels.some((fuel) => v.fuel.toLowerCase().includes(fuel)));
  const budget = text.match(/(?:under|below|up to|max|budget|£)\s*([\d,.]+)\s*(k)?/);
  if (budget) {
    const amount = Number(budget[1].replaceAll(',', '')) * (budget[2] ? 1000 : 1);
    matches = Number.isFinite(amount) ? matches.filter((v) => v.price <= amount) : [];
  }
  if (/cheapest|lowest|affordable/.test(text)) matches.sort((a, b) => a.price - b.price);
  matches = matches.slice(0, 3);
  if (!matches.length)
    return {
      text: 'No captured vehicle matches those criteria. Try another budget or fuel type. This local reference does not search live inventory.',
      ids: [],
    };
  return {
    text:
      'From the captured reference inventory:\n\n' +
      matches
        .map(
          (v) =>
            `${v.make} ${v.model} — ${money(v.price)}, ${number(v.mileage)} km, ${v.fuel}, ${v.power} hp.`,
        )
        .join('\n\n') +
      '\n\nThese are local fixture results, not live market offers.',
    ids: matches.map((v) => v.id),
  };
}
