<script lang="ts">
  import type { Snippet } from "svelte";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import VehicleLandingHero from "./VehicleLandingHero.svelte";
  let { children }: { children: Snippet } = $props();
  const locale = useLocale();
</script>

<VehicleLandingHero
  title={locale.t("ui.home-vehicle-carousel.find-your-next-car")}
  >{@render children()}</VehicleLandingHero
>
