<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import { rentalCars } from "#lib/data/rental-catalog.ts";
  import VehicleTile from "./VehicleTile.svelte";
  let {
    car,
    days = 0,
    href,
    onclick,
  }: {
    car: (typeof rentalCars)[number];
    days?: number;
    href?: string;
    onclick?: () => void;
  } = $props();
  const locale = useLocale();
  const category = $derived(
    car.category === "suv"
      ? "SUV"
      : locale.locale === "bg"
        ? car.category === "compact"
          ? "Компактен"
          : "Седан"
        : car.category === "compact"
          ? "Compact"
          : "Saloon",
  );
</script>

<VehicleTile
  title={car.title}
  image={car.image}
  price={locale.money(car.dailyRate, "EUR")}
  unit={locale.locale === "bg" ? "/ден" : "/day"}
  meta={(locale.locale === "bg" ? "Автоматик" : "Automatic") + " · " + category}
  total={days
    ? locale.money(car.dailyRate * days, "EUR") +
      " · " +
      days +
      (locale.locale === "bg"
        ? days === 1
          ? " ден"
          : " дни"
        : days === 1
          ? " day"
          : " days")
    : ""}
  {href}
  {onclick}
  label={(locale.locale === "bg" ? "Наеми " : "Rent ") + car.title}
  class="rental-car"
/>
