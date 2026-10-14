<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import type { CatalogText } from "#lib/i18n/text.ts";
  const locale = useLocale();
  let { label }: { label: CatalogText } = $props();
</script>

<nav
  aria-label={locale.t("reference.controls.breadcrumb")}
  class="heading-breadcrumb desktop-type-body-small"
>
  <a href={locale.href("/")}>{locale.t("header.breadcrumb.home")}</a>
  <img
    src="/assets/imgs/template/icons/arrow-right.svg"
    alt=""
    aria-hidden="true"
  />
  <span aria-current="page">{locale.text(label)}</span>
</nav>

<style>
  .heading-breadcrumb {
    display: none;
  }

  @media (min-width: 992px) {
    .heading-breadcrumb {
      position: absolute;
      inset-block-end: 0;
      inset-inline-start: 50%;
      transform: translate(-50%, 50%);
      z-index: 2;
      display: inline-flex;
      align-items: center;
      gap: var(--karento-desktop-space-3);
      min-height: var(--karento-desktop-pill-height);
      max-width: calc(100% - var(--karento-desktop-space-8));
      padding: var(--karento-desktop-space-2) var(--karento-desktop-space-4);
      border: 1px solid var(--bs-border-color);
      border-radius: var(--karento-desktop-pill-radius);
      background: var(--bs-neutral-0);
      color: var(--bs-neutral-600);
      font-size: var(--karento-type-body-small-size);
      line-height: var(--karento-type-body-small-leading);
      white-space: nowrap;
    }
    img {
      flex-shrink: 0;
      width: var(--karento-desktop-space-3);
      height: var(--karento-desktop-space-3);
    }
    a {
      color: inherit;
    }
    a:hover {
      color: var(--bs-neutral-1000);
    }
    a:focus-visible {
      outline: 2px solid var(--bs-neutral-1000);
      outline-offset: 4px;
      border-radius: 2px;
    }
    [aria-current="page"] {
      color: var(--bs-neutral-1000);
      font-weight: var(--karento-type-control-weight);
    }
  }
</style>
