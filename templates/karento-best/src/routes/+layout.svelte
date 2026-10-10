<svelte:options runes={true} />

<script lang="ts">
  import "#lib/styles/desktop-heroes.css";
  import "#lib/styles/desktop-pages.css";
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { createPreview } from "#lib/preview.svelte.ts";
  import Header from "#lib/components/Header.svelte";
  import PhotoViewer from "#lib/components/PhotoViewer.svelte";
  import MobileNavigation from "#lib/components/MobileNavigation.svelte";
  import { dealer } from "#lib/content.ts";
  import type { Snippet } from "svelte";
  import { createLocale } from "#lib/i18n/context.svelte.ts";
  import type { Locale } from "#lib/i18n/locales.ts";
  const mobileStyleVersion = "20261008-hero";
  let {
    children,
    data,
  }: { children: Snippet; data: { locale: Locale; mount: string } } = $props();
  const locale = createLocale(
    () => data.locale,
    () => data.mount,
  );
  const preview = createPreview();
  afterNavigate(() => {
    preview.drawer = false;
    preview.mobile = false;
    preview.panels = {};
  });
  $effect(() => {
    document.documentElement.lang = locale.locale;
    document.body.classList.toggle("canvas-menu-active", preview.drawer);
    document.body.classList.toggle("mobile-menu-active", preview.mobile);
    return () => {
      document.body.classList.remove(
        "canvas-menu-active",
        "mobile-menu-active",
      );
    };
  });
  onMount(() => {
    document.body.dataset.karentoSite = "best";
    try {
      const role = sessionStorage.getItem("karento-best-demo-area");
      if (role === "owner" || role === "member") preview.role = role;
    } catch {
      /* Optional browser storage. */
    }
    document.body.dataset.karentoReady = "true";
    return () => {
      delete document.body.dataset.karentoReady;
      delete document.body.dataset.karentoSite;
    };
  });
</script>

<svelte:head>
  <meta
    name="description"
    content={locale.t("metadata.description", { dealer: dealer.name })}
  />
  <link
    rel="shortcut icon"
    href={dealer.logo.favicon ?? "/assets/imgs/template/favicon.svg"}
  />
  <link href="/assets/css/main.css?v=1.0.0" rel="stylesheet" />
  <link href="/dealer-site.css" rel="stylesheet" />
  <link rel="stylesheet" href="/native-widgets.css" />
  <link rel="stylesheet" href="/mobile-tokens.css" />
  <link rel="stylesheet" href={`/mobile.css?v=${mobileStyleVersion}`} />
  <link
    rel="stylesheet"
    href={`/mobile-controls.css?v=${mobileStyleVersion}`}
  />
  <link rel="stylesheet" href="/typography.css" />
</svelte:head>
<Header />
{@render children()}
<PhotoViewer />
<MobileNavigation />
