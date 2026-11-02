<script lang="ts">
  import { page } from "$app/state";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import { presentVehicle } from "#lib/i18n/vehicle.ts";
  import type { VehicleCardContent } from "#lib/content.ts";
  import VehicleTile from "#lib/components/VehicleTile.svelte";
  let {
    car,
    catalog = false,
    href,
  }: {
    car: VehicleCardContent & { year?: number };
    catalog?: boolean;
    href?: string;
  } = $props();
  const locale = useLocale();
  const display = $derived(presentVehicle(car, locale));
  const destination = $derived(
    href ??
      car.href +
        (car.href.includes("?") ? "&" : "?") +
        "returnTo=" +
        encodeURIComponent(page.url.pathname + page.url.search + page.url.hash),
  );
</script>

<VehicleTile
  title={car.title}
  image={car.image}
  price={display.price}
  meta={[car.year, display.mileage].filter(Boolean).join(" · ")}
  href={locale.href(destination)}
  label={locale.t("action.viewVehicle", { vehicle: car.title })}
  class={catalog ? "discovery-card catalog-card" : "discovery-card"}
/>
