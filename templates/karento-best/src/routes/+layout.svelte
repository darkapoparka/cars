<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { createPreview, type PreviewRole } from "#lib/preview.svelte.ts";
  import Header from "#lib/components/Header.svelte";
  import PhotoViewer from "#lib/components/PhotoViewer.svelte";
  import { dealer } from "#lib/content.ts";
  import type { Snippet } from "svelte";
  let { children }: { children: Snippet } = $props();
  const preview = createPreview();
  let route = $derived(page.url.pathname);
  $effect(() => {
    void route;
    preview.drawer = false;
    preview.mobile = false;
    preview.panels = {};
  });
  $effect(() => {
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
    document.documentElement.lang = dealer.locale;
    try {
      const role = sessionStorage.getItem("karento-best-demo-area");
      if (role === "owner" || role === "member")
        preview.role = role as PreviewRole;
    } catch {
      /* Optional browser storage. */
    }
    const roleChanged = (event: Event) => {
      if (
        event instanceof CustomEvent &&
        (event.detail === "owner" || event.detail === "member")
      )
        preview.role = event.detail;
    };
    window.addEventListener("karento-role", roleChanged);
    document.body.dataset.karentoReady = "true";
    return () => {
      window.removeEventListener("karento-role", roleChanged);
      delete document.body.dataset.karentoReady;
      delete document.body.dataset.karentoSite;
    };
  });
</script>

<svelte:head>
  <meta name="description" content="Index page" />
  <link
    rel="shortcut icon"
    type="image/x-icon"
    href="/assets/imgs/template/favicon.svg"
  />
  <link href="/assets/css/main.css?v=1.0.0" rel="stylesheet" />
  <link href="/dealer-site.css" rel="stylesheet" />
  <link rel="stylesheet" href="/native-widgets.css" />
</svelte:head>
<Header />
{@render children()}
<PhotoViewer />
