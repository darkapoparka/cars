<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { dealer } from "#lib/content.ts";
  import { page } from "$app/state";
  import { resolveRoute } from "#lib/routes.ts";
  import { usePreview } from "#lib/preview.svelte.ts";

  const preview = usePreview();
  const route = $derived(resolveRoute(page.params.path ?? ""));
  const links = $derived(
    [
      {
        href: "/",
        label: locale.t("navigation.home"),
        path: "M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z",
        routes: ["index-3", "index-2", "index"],
      },
      {
        href: "/vehicles",
        label: locale.t("navigation.vehicles"),
        path: "m5 7 2-4h10l2 4M3 10l2-3h14l2 3v8H3Zm0 8v3m18-3v3M6 13h2m8 0h2",
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
        path: "M14 3a6 6 0 0 0-7 8L3 15a3 3 0 0 0 4 4l4-4a6 6 0 0 0 8-7l-4 4-3-3 4-4Z",
        routes: ["services"],
      },
      {
        href: "/shop",
        label: locale.t("navigation.shop"),
        path: "M4 8h16l1 13H3ZM8 8V6a4 4 0 0 1 8 0v2",
        routes: ["shop-list", "shop-details"],
      },
    ].filter(
      (link) =>
        !dealer.businessPreview || ["/", "/vehicles"].includes(link.href),
    ),
  );
  const vehicleDetail = $derived(route?.startsWith("cars-details-") ?? false);
</script>

{#snippet icon(path: string)}
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d={path}
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
{/snippet}

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
      {@render icon("m14 6-6 6 6 6")}
    </a>
    <a
      class="mobile-enquiry-link"
      href={locale.href("/contact#contact-enquiry")}
      >{locale.t("ui.mobile-navigation.ask-about-this-car")}
      {@render icon("M5 12h14m-6-6 6 6-6 6")}</a
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
    <a
      href={locale.href(link.href)}
      aria-current={link.routes.some((key) => key === route)
        ? "page"
        : undefined}
    >
      {@render icon(link.path)}
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
    {@render icon("M4 6h16M4 12h16M4 18h16")}
    <span>{locale.t("ui.mobile-navigation.menu")}</span>
  </button>
</nav>
