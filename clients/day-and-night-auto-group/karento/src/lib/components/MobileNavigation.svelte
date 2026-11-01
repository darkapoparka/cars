<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { page } from "$app/state";
  import { resolveRoute } from "#lib/routes.ts";
  import { usePreview } from "#lib/preview.svelte.ts";
  import MobileIcon from "#lib/components/mobile/MobileIcon.svelte";
  import BottomNavigationIcon from "#lib/components/mobile/BottomNavigationIcon.svelte";

  const preview = usePreview();
  const route = $derived(resolveRoute(page.params.path ?? ""));
  const links = $derived([
    {
      href: "/",
      label: locale.t("navigation.home"),
      icon: "home" as const,
      routes: ["marketplace-home", "index-3", "index-2", "index"],
    },
    {
      href: "/vehicles",
      label: locale.t("navigation.mobileVehicles"),
      icon: "vehicles" as const,
      routes: [
        "cars-list-1",
        "cars-list-2",
        "cars-list-3",
        "cars-list-4",
        "cars-details-1",
        "cars-details-2",
        "cars-details-3",
        "cars-details-4",
      ],
    },
    {
      href: "/services",
      label: locale.t("navigation.services"),
      icon: "services" as const,
      routes: ["services"],
    },
    {
      href: "/shop",
      label: locale.t("navigation.shop"),
      icon: "shop" as const,
      routes: ["shop-list", "shop-details"],
    },
  ]);
  const vehicleDetail = $derived(route?.startsWith("cars-details-") ?? false);
</script>

{#if vehicleDetail}
  <aside
    class="karento-mobile-vehicle-action"
    aria-label={locale.t("ui.mobile-navigation.vehicle-enquiry")}
    inert={preview.drawer || preview.mobile}
  >
    <a
      class="mobile-back-to-vehicles"
      href={locale.href("/vehicles")}
      aria-label={locale.t("ui.mobile-navigation.back-to-vehicles")}
    >
      <MobileIcon name="chevron-left" size="action" />
    </a>
    <a
      class="mobile-enquiry-link"
      href={locale.href("/contact#contact-enquiry")}
      >{locale.t("ui.mobile-navigation.ask-about-this-car")}
      <MobileIcon name="arrow-right" /></a
    >
  </aside>
{/if}

<nav
  class="karento-mobile-navigation"
  style:--karento-mobile-navigation-columns={links.length + 1}
  aria-label={locale.t("ui.mobile-navigation.mobile-navigation")}
  inert={preview.drawer || preview.mobile}
>
  {#each links as link (link.href)}
    {@const active = link.routes.some((key) => key === route)}
    <a href={locale.href(link.href)} aria-current={active ? "page" : undefined}>
      <BottomNavigationIcon name={link.icon} appearance="graphite" {active} />
      <span>{link.label}</span>
    </a>
  {/each}
  <button
    type="button"
    aria-label={locale.t("ui.mobile-navigation.open-menu")}
    aria-controls="karento-account-drawer"
    aria-expanded={preview.drawer}
    onclick={() => {
      preview.mobile = false;
      preview.drawer = true;
    }}
  >
    <BottomNavigationIcon name="menu" appearance="graphite" />
    <span>{locale.t("ui.mobile-navigation.menu")}</span>
  </button>
</nav>
