<svelte:options runes={true} />

<script module lang="ts">
  export interface MobileBodyType {
    readonly id: string;
    readonly label: string;
    readonly count: number | string;
    readonly href: string;
    readonly image: string;
    readonly width: number;
    readonly height: number;
  }
</script>

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import MobilePill from "./MobilePill.svelte";
  import { focusableScroll } from "#lib/horizontal-scroll.ts";

  let {
    items,
    actionLabel,
    actionHref,
    layout = "rail",
  }: {
    items: readonly MobileBodyType[];
    actionLabel: string;
    actionHref: string;
    layout?: "rail" | "grid";
  } = $props();
</script>

<div
  class={[
    "mobile-body-type-header",
    { "mobile-body-type-grid-header": layout === "grid" },
  ]}
>
  <h3 class="mobile-body-type-heading"
    >{locale.t("ui.mobile-body-type-rail.browse-by-type")}</h3
  >
  <MobilePill
    label={actionLabel}
    href={locale.href(actionHref)}
    variant="secondary"
  />
</div>
<nav
  class={[
    "mobile-body-type-rail",
    { "mobile-body-type-grid": layout === "grid" },
  ]}
  aria-label={locale.t("ui.mobile-body-type-rail.vehicle-body-types")}
  {@attach layout === "rail" ? focusableScroll : undefined}
>
  {#each items as item (item.id)}
    <a
      class="mobile-body-type-card"
      data-body-type={item.id}
      href={locale.href(item.href)}
      aria-label={typeof item.count === "number"
        ? `${item.label}, ${locale.count(item.count)}`
        : `${item.label}, ${item.count}`}
    >
      <div class="mobile-body-type-photo">
        <img
          src={item.image}
          alt=""
          width={item.width}
          height={item.height}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div class="mobile-body-type-copy">
        <span class="mobile-body-type-label">{item.label}</span>
        <span class="mobile-body-type-count"
          >{typeof item.count === "number"
            ? locale.number(item.count)
            : item.count}</span
        >
      </div>
    </a>
  {/each}
</nav>

<style>
  @media (max-width: 767.98px) {
    .mobile-body-type-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: var(--karento-space-2);
      margin-bottom: var(--karento-space-3);
    }

    .mobile-body-type-heading {
      min-width: 0;
      margin: 0;
      overflow: hidden;
      color: var(--bs-neutral-1000);
      font-size: var(--karento-type-section-size);
      font-weight: var(--karento-type-section-weight);
      line-height: var(--karento-type-section-leading);
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .mobile-body-type-rail {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 140px;
      gap: var(--karento-space-2);
      min-width: 0;
      max-width: 100%;
      padding-block: 2px 4px;
      overflow-x: auto;
      overscroll-behavior-x: contain;
      scroll-padding-inline: 2px;
      scroll-snap-type: x proximity;
      scrollbar-width: none;
    }

    .mobile-body-type-rail::-webkit-scrollbar {
      display: none;
    }

    .mobile-body-type-rail:focus-within {
      scroll-snap-type: none;
    }

    .mobile-body-type-grid-header .mobile-body-type-heading {
      overflow: visible;
      white-space: normal;
      text-overflow: clip;
    }

    .mobile-body-type-grid {
      grid-auto-flow: row;
      grid-auto-columns: auto;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      overflow: visible;
      scroll-snap-type: none;
    }

    .mobile-body-type-card {
      display: grid;
      align-content: start;
      gap: 6px;
      min-width: 0;
      min-height: var(--karento-touch-target);
      padding: var(--karento-space-2);
      border: 1px solid var(--bs-border-color);
      border-radius: var(--karento-radius-card);
      color: var(--bs-neutral-1000);
      background: var(--bs-background-card);
      text-decoration: none;
      scroll-snap-align: start;
    }

    .mobile-body-type-photo {
      width: 100%;
      aspect-ratio: 262 / 117;
    }

    .mobile-body-type-photo img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .mobile-body-type-copy {
      display: flex;
      align-items: baseline;
      gap: 6px;
      min-width: 0;
      white-space: nowrap;
    }

    .mobile-body-type-label {
      min-width: 0;
      overflow: hidden;
      font-size: var(--karento-type-pill-size);
      font-weight: var(--karento-type-pill-weight);
      line-height: var(--karento-type-pill-leading);
      text-overflow: ellipsis;
    }

    .mobile-body-type-count {
      flex: 0 0 auto;
      color: var(--bs-neutral-600);
      font-size: var(--karento-type-meta-size);
      font-weight: var(--karento-type-meta-weight);
      line-height: var(--karento-type-meta-leading);
    }

    .mobile-body-type-grid .mobile-body-type-card {
      scroll-snap-align: none;
    }

    .mobile-body-type-grid .mobile-body-type-copy {
      display: grid;
      gap: var(--karento-space-1);
      white-space: normal;
      overflow-wrap: anywhere;
    }

    .mobile-body-type-grid .mobile-body-type-label {
      overflow: visible;
      text-overflow: clip;
    }

    .mobile-body-type-rail:focus-visible,
    .mobile-body-type-card:focus-visible {
      outline: 2px solid var(--karento-accent);
      outline-offset: 2px;
    }
  }
</style>
