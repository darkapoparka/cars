<script lang="ts">
  import { onMount } from "svelte";
  import { brand } from "./data/brand";
  import { homeForPath, isCuratedHomePath } from "./data/homes";
  import { vehicles } from "./lib/catalog";
  import { route, setupRouter } from "./lib/router.svelte";
  import { selections, syncSelections, clearCompare } from "./lib/state.svelte";
  import Header from "./components/Header.svelte";
  import Footer from "./components/Footer.svelte";
  import Icon from "./components/Icon.svelte";
  import ReferenceHome from "./reference/ReferenceHome.svelte";
  import nativeStyles from "./styles.css?url";
  import Inventory from "./pages/Inventory.svelte";
  import VehicleDetail from "./pages/VehicleDetail.svelte";
  import Compare from "./pages/Compare.svelte";
  import Content from "./pages/Content.svelte";
  let design = $derived(homeForPath(route.path));
  let curated = $derived(isCuratedHomePath(route.path));
  let vehicle = $derived(
    vehicles.find(
      (v) =>
        route.path === `/vehicle/${v.slug}/` ||
        route.path === `/vehicle/${v.slug}` ||
        (v.legacySlug && route.path === `/vehicle/${v.legacySlug}/`) ||
        route.path === v.originalPath,
    ),
  );
  let path = $derived(route.path.replace(/\/$/, ""));
  const pageAliases: Record<string, string> = {
    "/contact": "contact",
    "/contact-us": "contact",
    "/contact.html": "contact",
    "/about": "about",
    "/about-us": "about",
    "/about.html": "about",
    "/calculator": "calculator",
    "/loan-calculator.html": "calculator",
    "/faq": "faq",
    "/faq.html": "faq",
    "/terms": "terms",
    "/terms-and-conditions": "terms",
    "/blog": "blog",
    "/blog-list-01.html": "blog",
  };
  let content = $derived(
    pageAliases[path] || (path.startsWith("/blog/") ? "article" : ""),
  );
  let inventory = $derived(
    [
      "/inventory",
      "/listings",
      "/inventory-list-01.html",
      "/inventory-list-02.html",
    ].includes(path),
  );
  let saved = $derived(path === "/favorites");
  let comparison = $derived(["/compare", "/compare.html"].includes(path));
  let title = $derived(
    curated
      ? `${brand.name} — Find your perfect car`
      : design
        ? `${brand.name} — Home ${design.id} · ${design.name}`
        : vehicle
          ? `${vehicle.title} — ${brand.name}`
          : inventory
            ? `Cars for sale — ${brand.name}`
            : saved
              ? `Saved cars — ${brand.name}`
              : comparison
                ? `Compare cars — ${brand.name}`
                : `${content ? content.charAt(0).toUpperCase() + content.slice(1) : "Page not found"} — ${brand.name}`,
  );
  onMount(setupRouter);
</script>

<svelte:head>
  {#if !design && !curated}<link rel="stylesheet" href={nativeStyles} />{/if}
  <title>{title}</title>
  <meta
    name="description"
    content={`Find your next car with ${brand.name}. Explore new and used vehicles, save your favourites and compare the details.`}
  />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</svelte:head>
<svelte:window onstorage={syncSelections} />
<div class="app" style:--accent={brand.accent}>
  <a class="skip-link" href="#main">Skip to content</a>
  {#if !design && !curated}<Header home={0} />{/if}
  <main id="main" tabindex="-1">
    {#key route.path}{#if curated}<ReferenceHome
          home={0}
        />{:else if design}<ReferenceHome
          home={design.id}
        />{:else if vehicle}<VehicleDetail
          {vehicle}
        />{:else if inventory || saved}<Inventory
          savedOnly={saved}
        />{:else if comparison}<Compare />{:else if content}<Content
          page={content}
        />{:else}<div class="container not-found">
          <span>404</span>
          <h1>We couldn’t find that page</h1>
          <p>Browse our cars or get in touch with the showroom.</p>
          <a class="button" href="/">
            Back to Home <Icon name="arrow" size={16} />
          </a>
        </div>{/if}{/key}
  </main>
  {#if !design && !curated}<Footer home={0} />{/if}
  {#if selections.compare.length && !comparison}<aside
      class="compare-tray"
      aria-label="Selected cars"
    >
      <span>
        {selections.compare.length}
        {selections.compare.length === 1 ? "car" : "cars"} selected
      </span>
      <a href="/compare/">Compare <Icon name="arrow" size={14} /></a>
      <button aria-label="Clear selected cars" onclick={clearCompare}>
        <Icon name="close" size={16} />
      </button>
    </aside>{/if}
  {#if selections.notice}<div class="toast" role="status">
      {selections.notice}
      <button
        aria-label="Dismiss notification"
        onclick={() => (selections.notice = "")}
      >
        <Icon name="close" size={16} />
      </button>
    </div>{/if}
</div>
