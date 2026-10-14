import { formatMoneyParts, formatVehicleMoney, type Money } from "@repo/marketplace";

/** Keep the localized amount and currency in one consistent price treatment. */
export function VehicleCardMoney({
  money,
  locale,
}: {
  money: Money;
  locale?: string;
}) {
  if (!(money.amount > 0)) return <>{formatVehicleMoney(money, locale)}</>;
  const parts = formatMoneyParts(money, locale);
  const currencyIndex = parts.findIndex(({ type }) => type === "currency");
  const join = (values: Intl.NumberFormatPart[]) =>
    values.map(({ value }) => value).join("");

  return (
    <>
      {join(parts.slice(0, currencyIndex))}
      <span>{parts[currencyIndex]?.value}</span>
      {join(parts.slice(currencyIndex + 1))}
    </>
  );
}
