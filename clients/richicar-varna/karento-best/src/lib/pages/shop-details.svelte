<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import ProductBreadcrumb from "#lib/sections/ProductBreadcrumb.svelte";
  import ProductPurchaseBanner from "#lib/sections/ProductPurchaseBanner.svelte";
  import ProductDetail from "#lib/sections/ProductDetail.svelte";
  import MobileIconButton from "#lib/components/mobile/MobileIconButton.svelte";
  import MobileShopPurchaseActions from "#lib/components/shop/MobileShopPurchaseActions.svelte";
  import type { Attachment } from "svelte/attachments";
  import Footer from "#lib/components/Footer.svelte";
  import { page } from "$app/state";
  import { MediaQuery } from "svelte/reactivity";
  import { listingProducts } from "#lib/data/vehicle-listing.ts";
  import { isUnavailableDesktopProduct } from "#lib/data/desktop-shop.ts";

  const desktop = new MediaQuery("(min-width: 992px)");
  const phone = new MediaQuery("(max-width: 767.98px)");
  let dockHeight = $state(0);
  const measureDock: Attachment<HTMLElement> = (node) => {
    let active = true;
    const measure = () => {
      if (active && node.isConnected)
        dockHeight = Math.ceil(node.getBoundingClientRect().height);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(node, { box: "border-box" });
    measure();
    return () => {
      active = false;
      observer.disconnect();
    };
  };
  const backHref = $derived.by(() => {
    const parameters = new URLSearchParams(page.url.searchParams.toString());
    parameters.delete("product");
    const query = parameters.toString();
    return locale.href(`/shop${query ? "?" + query : ""}`);
  });
  const missing = $derived(
    desktop.current &&
      isUnavailableDesktopProduct(page.url.searchParams, listingProducts),
  );
</script>

<PageMetadata
  title={locale.t(
    missing
      ? "reference.shop.product.missingTitle"
      : "ui.shop-details.product-details",
  )}
/>
<main
  class={["main", { "karento-mobile-shop-product": phone.current }]}
  style:--karento-shop-purchase-height={dockHeight
    ? `${dockHeight}px`
    : undefined}
  >{#if phone.current}
    <nav
      class="mobile-shop-product-topbar"
      aria-label={locale.t("ui.product-breadcrumb.breadcrumb")}
    >
      <MobileIconButton
        href={backHref}
        label={locale.t("ui.product-purchase-banner.back-to-shop")}
        icon="arrow-left"
        surface="circle"
      />
      <span>{locale.t("ui.product-breadcrumb.shop")}</span>
      <span aria-hidden="true"></span>
    </nav>
    <div class="mobile-shop-product-hero">
      <ProductPurchaseBanner mobilePart="image" />
    </div>
    <div class="mobile-shop-product-sheet">
      <div class="mobile-shop-product-grip" aria-hidden="true"></div>
      <ProductPurchaseBanner mobilePart="summary" />
      <ProductDetail />
    </div>
    <aside
      class="mobile-shop-product-dock"
      aria-label={locale.t("ui.product-purchase-banner.add-to-cart")}
      {@attach measureDock}
    >
      <MobileShopPurchaseActions />
    </aside>
  {:else if missing}
    <section class="box-section background-body shop-product-unavailable">
      <div class="container">
        <h1 class="neutral-1000 desktop-type-page"
          >{locale.t("reference.shop.product.missingTitle")}</h1
        >
        <p class="neutral-500 mt-20 desktop-type-body"
          >{locale.t("reference.shop.product.missingBody")}</p
        >
        <a
          class="btn btn-gray mt-20 desktop-type-pill desktop-card-action"
          href={locale.href("/shop")}
          >{locale.t("ui.product-purchase-banner.back-to-shop")}</a
        >
      </div>
    </section>
  {:else}
    <ProductBreadcrumb />
    <ProductPurchaseBanner />
    <ProductDetail />
  {/if}
  {#if !phone.current}<Footer />{/if}</main
>

<style>
  @media (max-width: 767.98px) {
    :global(body:has(.karento-mobile-shop-product)) {
      --karento-mobile-navigation-height: 0px;
      padding-bottom: 0;
    }

    :global(body:has(.karento-mobile-shop-product) .header),
    :global(body:has(.karento-mobile-shop-product) .karento-mobile-navigation) {
      display: none;
    }

    .karento-mobile-shop-product {
      min-width: 0;
      padding-bottom: var(
        --karento-shop-purchase-height,
        calc(
          var(--karento-touch-target) + var(--karento-space-3) * 2 + 1px +
            var(--karento-safe-area-bottom)
        )
      );
      background: var(--bs-background-body);
    }

    .mobile-shop-product-topbar {
      position: sticky;
      top: 0;
      z-index: 4;
      display: grid;
      grid-template-columns:
        var(--karento-touch-target) minmax(0, 1fr)
        var(--karento-touch-target);
      align-items: center;
      padding: var(--karento-space-2) var(--karento-space-3);
      padding-top: calc(var(--karento-space-2) + env(safe-area-inset-top, 0px));
      background: var(--bs-background-body);
      color: var(--bs-neutral-1000);
    }

    .mobile-shop-product-topbar > span {
      text-align: center;
      font-size: var(--karento-type-control-size);
      font-weight: var(--karento-type-control-weight);
      line-height: var(--karento-type-control-leading);
    }

    .mobile-shop-product-hero {
      min-width: 0;
      background: var(--bs-background-body);
    }

    .mobile-shop-product-sheet {
      position: relative;
      z-index: 1;
      min-width: 0;
      margin-top: calc(var(--karento-space-6) * -1);
      padding-top: var(--karento-space-2);
      border-radius: var(--karento-radius-sheet) var(--karento-radius-sheet) 0 0;
      background: var(--bs-background-body);
      box-shadow: 0 -4px 16px rgb(0 0 0 / 4%);
    }

    .mobile-shop-product-grip {
      width: var(--karento-space-8);
      height: var(--karento-space-1);
      margin: 0 auto var(--karento-space-4);
      border-radius: var(--karento-radius-pill);
      background: var(--bs-neutral-300);
    }

    .mobile-shop-product-dock {
      position: fixed;
      inset: auto 0 0;
      z-index: 4;
      padding: var(--karento-space-3) var(--karento-space-4);
      padding-bottom: calc(
        var(--karento-space-3) + var(--karento-safe-area-bottom)
      );
      border-top: 1px solid var(--karento-border-tool);
      background: var(--bs-background-body);
      box-shadow: 0 -4px 16px rgb(0 0 0 / 4%);
    }
  }

  @media (min-width: 992px) {
    .shop-product-unavailable {
      padding-block: var(--karento-desktop-section-padding);
    }
  }
</style>
