<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import { usePreview } from "#lib/preview.svelte.ts";
  import BottomNavigationIcon from "#lib/components/mobile/BottomNavigationIcon.svelte";

  const locale = useLocale();
  const preview = usePreview();
  const links = $derived([
    {
      href: "/",
      label: locale.t("navigation.home"),
      icon: "home" as const,
    },
    {
      href: "/vehicles",
      label: locale.t("navigation.mobileVehicles"),
      icon: "vehicles" as const,
    },
    {
      href: "/services",
      label: locale.t("navigation.services"),
      icon: "services" as const,
    },
    {
      href: "/shop",
      label: locale.t("navigation.shop"),
      icon: "shop" as const,
    },
  ]);
</script>

<nav
  class="karento-mobile-navigation discovery-navigation"
  style:--karento-mobile-navigation-columns={links.length + 1}
  aria-label={locale.t("ui.mobile-navigation.mobile-navigation")}
  inert={preview.drawer || preview.mobile}
>
  {#each links as link (link.href)}
    <a
      href={locale.href(link.href)}
      aria-current={link.href === "/" ? "page" : undefined}
    >
      <BottomNavigationIcon
        name={link.icon}
        appearance="graphite"
        active={link.href === "/"}
      /><span>{link.label}</span>
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
    <BottomNavigationIcon name="menu" appearance="graphite" /><span
      >{locale.t("ui.mobile-navigation.menu")}</span
    >
  </button>
</nav>

<style>
  @media (max-width: 767.98px) {
    :global(
      body:has(.discovery-navigation)
        .karento-mobile-navigation:not(.discovery-navigation)
    ) {
      display: none;
    }
  }
</style>
