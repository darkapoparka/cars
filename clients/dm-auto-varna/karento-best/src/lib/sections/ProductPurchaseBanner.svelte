<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionButton from "#lib/components/DemoActionButton.svelte";
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";

  import Gallery from "#lib/components/Gallery.svelte";
  import { quantity } from "#lib/attachments.svelte.ts";
  import { MediaQuery } from "svelte/reactivity";
  import { page } from "$app/state";
  import {
    selectedReferenceProduct,
    hasReferenceDiscount,
  } from "#lib/data/shop-mobile.ts";
  const phone = new MediaQuery("(max-width: 767.98px)");
  const desktop = new MediaQuery("(min-width: 992px)");
  const selected = $derived(selectedReferenceProduct(page.url.searchParams));
  const discounted = $derived(hasReferenceDiscount(selected));

  function normalizeQuantity(
    event: Event & { currentTarget: HTMLInputElement },
  ) {
    if (!phone.current) return;
    const amount = Math.floor(Number(event.currentTarget.value));
    event.currentTarget.value = String(
      Number.isSafeInteger(amount) && amount > 0 ? amount : 1,
    );
  }
</script>

{#if desktop.current}
  <section
    class="shop-desktop-purchase container"
    aria-labelledby="shop-product-title"
  >
    <div class="shop-product-photo">
      <Gallery
        slides={[{ src: selected.image, alt: selected.title }]}
        boxClass="shop-product-gallery"
        label={locale.t("ui.product-purchase-banner.product-photo")}
      />
    </div>
    <div class="shop-product-summary">
      <span class="shop-product-reference desktop-type-badge"
        >{locale.t("ui.product-purchase-banner.reference-product")}</span
      >
      <h1 class="desktop-type-detail" id="shop-product-title"
        >{selected.title}</h1
      >
      <div class="shop-product-price"
        ><strong class="desktop-type-buy-price">{selected.price}</strong
        >{#if discounted}<s class="desktop-type-body"
            >{selected.originalPrice}</s
          >{/if}</div
      >
      <p
        >{locale.t(
          "ui.product-purchase-banner.sample-collection-ask-us-about-availability-and-suitability-for",
        )}</p
      >
      <div class="shop-product-actions"
        ><a
          class="shop-product-enquiry desktop-type-control"
          href={locale.href("/contact#contact-enquiry")}
          >{locale.t("ui.product-purchase-banner.contact-us")}</a
        ><a
          class="shop-product-back desktop-type-control"
          href={locale.href("/shop")}
          >{locale.t("ui.product-purchase-banner.back-to-shop")}</a
        ></div
      >
    </div>
  </section>
{:else}
  <section
    class="section-box box-banner-home2 background-body karento-product-purchase"
  >
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <div class="container-banner-activities">
            {#if phone.current}
              <Gallery
                slides={[{ src: selected.image, alt: selected.title }]}
                boxClass="box-banner-activities border rounded-3 overflow-hidden"
                label={locale.t("ui.product-purchase-banner.product-photo")}
              />
            {:else}
              <Gallery
                slides={[
                  "/assets/imgs/shop/shop-details/img-1.png",
                  "/assets/imgs/shop/shop-details/img-1.png",
                  "/assets/imgs/shop/shop-details/img-1.png",
                  "/assets/imgs/shop/shop-details/img-1.png",
                  "/assets/imgs/shop/shop-details/img-1.png",
                ].map((src) => ({ src, alt: "Carento" }))}
                thumbnails={[
                  "/assets/imgs/shop/shop-details/thumb-1.png",
                  "/assets/imgs/shop/shop-details/thumb-2.png",
                  "/assets/imgs/shop/shop-details/thumb-3.png",
                  "/assets/imgs/shop/shop-details/thumb-4.png",
                  "/assets/imgs/shop/shop-details/thumb-1.png",
                  "/assets/imgs/shop/shop-details/thumb-2.png",
                  "/assets/imgs/shop/shop-details/thumb-3.png",
                  "/assets/imgs/shop/shop-details/thumb-4.png",
                ].map((src) => ({ src, alt: "Carento" }))}
                boxClass="box-banner-activities border rounded-3 overflow-hidden"
                thumbnailClass="banner-slide border p-0 mx-2 rounded-3"
                label={locale.t("ui.product-purchase-banner.product-photos")}
                mobileThumbnailCount={4}
              >
                <div class="box-button-abs">
                  <a
                    class="btn btn-white-md popup-youtube desktop-type-control"
                    href="https://www.youtube.com/watch?v=AOg61RB75Ho"
                    aria-label={locale.t(
                      "ui.product-purchase-banner.video-clips",
                    )}
                  >
                    <img
                      src="/assets/imgs/page/activities/video.svg"
                      alt={locale.t("image.illustrative")}
                    />{locale.t("ui.product-purchase-banner.video-clips")}</a
                  >
                </div>
              </Gallery>
            {/if}
          </div>
        </div>
        <div class="col-lg-6 ps-lg-4">
          <div class="tour-header karento-product-buybox">
            {#if phone.current}<p class="product-demo-note"
                >{locale.t(
                  "ui.product-purchase-banner.reference-product-demo-purchase-controls",
                )}</p
              >{/if}
            <div class="d-flex flex-wrap align-items-center gap-4 mb-3">
              <div class="tour-rate mb-0">
                <div class="rate-element">
                  <span class="rating"
                    >{phone.current ? selected.rating : "4.96"}
                    <span class="text-sm-medium neutral-500"
                      >{phone.current
                        ? selected.reviews
                        : "(672 reviews)"}</span
                    ></span
                  >
                </div>
              </div>
              {#if !phone.current}<DemoActionLink
                  href="#!"
                  class="text-md-medium neutral-500"
                  aria-label={locale.t("ui.product-purchase-banner.sku")}
                  >{locale.t("ui.product-purchase-banner.sku")}
                  <span
                    class="text-md-bold neutral-1000 ms-1 text-decoration-underline"
                    >LVA-4125</span
                  >
                </DemoActionLink>
                <DemoActionLink
                  href="#!"
                  aria-label={locale.t(
                    "ui.product-purchase-banner.view-details",
                  )}
                >
                  <img
                    src="/assets/imgs/shop/shop-list/stock.png"
                    alt={locale.t("image.illustrative")}
                  />
                </DemoActionLink>
              {/if}
            </div>
            <div class="tour-title-main">
              <h5 class="neutral-1000">
                {phone.current
                  ? selected.title
                  : "Mobil Delvac 1300 Super Heavy Duty Synthetic Blend"}
              </h5>
            </div>
            <div
              class="product-price-row d-flex align-items-center gap-3 border-bottom pb-4 mb-4"
            >
              {#if !phone.current || discounted}
                <span
                  class="text-24-medium neutral-500 text-decoration-line-through"
                >
                  {phone.current ? selected.originalPrice : "$68.53"}
                </span>
              {/if}
              <h4 class="neutral-1000"
                >{phone.current ? selected.price : "$48.25"}</h4
              >
            </div>
            {#if !phone.current}<ul class="list-style-disc ps-3 pe-4">
                <li class="text-md-medium neutral-1000"
                  >Mobil Delvac 1300 Super Heavy Duty Synthetic Blend</li
                >
                <li class="text-md-medium neutral-1000"
                  >{locale.t("reference.shop.feature.weather")}</li
                >
                <li class="text-md-medium neutral-1000"
                  >{locale.t("reference.shop.feature.alignment")}</li
                >
              </ul>{/if}
            <div class="tour-metas mt-4 border-top pt-4">
              <div class="tour-meta-left mb-0">
                <div class="add-to-cart me-3">
                  <div class="detail-qty" {@attach quantity}>
                    {#snippet quantityDownIcon()}
                      <svg
                        class="invert"
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M15.125 12.375H6.875C6.51033 12.375 6.16059 12.2301 5.90273 11.9723C5.64487 11.7144 5.5 11.3647 5.5 11C5.5 10.6353 5.64487 10.2856 5.90273 10.0277C6.16059 9.76987 6.51033 9.625 6.875 9.625H15.125C15.4897 9.625 15.8394 9.76987 16.0973 10.0277C16.3551 10.2856 16.5 10.6353 16.5 11C16.5 11.3647 16.3551 11.7144 16.0973 11.9723C15.8394 12.2301 15.4897 12.375 15.125 12.375Z"
                          fill="#101010"
                        ></path>
                      </svg>
                    {/snippet}
                    {#if phone.current}
                      <button
                        type="button"
                        class="qty-down ps-2"
                        aria-label={locale.t("quantity.decrease")}
                        >{@render quantityDownIcon()}</button
                      >
                    {:else}
                      <a
                        href="#!"
                        class="qty-down ps-2"
                        aria-label={locale.t(
                          "ui.product-purchase-banner.view-details",
                        )}>{@render quantityDownIcon()}</a
                      >
                    {/if}
                    <input
                      type="text"
                      name="quantity"
                      class="qty-val w-100px pl-45"
                      value="1"
                      min="1"
                      inputmode={phone.current ? "numeric" : undefined}
                      onchange={normalizeQuantity}
                      onblur={normalizeQuantity}
                      aria-label={locale.t(
                        "ui.product-purchase-banner.quantity",
                      )}
                    />
                    {#snippet quantityUpIcon()}
                      <svg
                        class="invert"
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M15.5833 10.0833H11.9167V6.41667C11.9167 6.17355 11.8201 5.94039 11.6482 5.76849C11.4763 5.59658 11.2431 5.5 11 5.5C10.7569 5.5 10.5237 5.59658 10.3518 5.76849C10.1799 5.94039 10.0833 6.17355 10.0833 6.41667V10.0833H6.41667C6.17355 10.0833 5.94039 10.1799 5.76849 10.3518C5.59658 10.5237 5.5 10.7569 5.5 11C5.5 11.2431 5.59658 11.4763 5.76849 11.6482C5.94039 11.8201 6.17355 11.9167 6.41667 11.9167H10.0833V15.5833C10.0833 15.8264 10.1799 16.0596 10.3518 16.2315C10.5237 16.4034 10.7569 16.5 11 16.5C11.2431 16.5 11.4763 16.4034 11.6482 16.2315C11.8201 16.0596 11.9167 15.8264 11.9167 15.5833V11.9167H15.5833C15.8264 11.9167 16.0596 11.8201 16.2315 11.6482C16.4034 11.4763 16.5 11.2431 16.5 11C16.5 10.7569 16.4034 10.5237 16.2315 10.3518C16.0596 10.1799 15.8264 10.0833 15.5833 10.0833Z"
                          fill="#101010"
                        ></path>
                      </svg>
                    {/snippet}
                    {#if phone.current}
                      <button
                        type="button"
                        class="qty-up pe-2"
                        aria-label={locale.t("quantity.increase")}
                        >{@render quantityUpIcon()}</button
                      >
                    {:else}
                      <a
                        href="#!"
                        class="qty-up pe-2"
                        aria-label={locale.t(
                          "ui.product-purchase-banner.view-details",
                        )}>{@render quantityUpIcon()}</a
                      >
                    {/if}
                  </div>
                </div>
                <DemoActionButton
                  type="submit"
                  class="btn btn-primary rounded-3 gap-2 button-add-to-cart desktop-type-control"
                  aria-label={locale.t(
                    "ui.product-purchase-banner.add-to-cart",
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <g clip-path="url(#clip0_20_23536)">
                      <path
                        d="M16 2H2.828L2.8 1.766C2.7427 1.27961 2.50892 0.831155 2.14299 0.505652C1.77706 0.180149 1.30442 0.000227862 0.814667 0L0 0V1.33333H0.814667C0.977956 1.33335 1.13556 1.3933 1.25758 1.50181C1.3796 1.61032 1.45756 1.75983 1.47667 1.922L2.53333 10.9007C2.59063 11.3871 2.82441 11.8355 3.19034 12.161C3.55627 12.4865 4.02891 12.6664 4.51867 12.6667H13.3333V11.3333H4.51867C4.35528 11.3333 4.19759 11.2733 4.07555 11.1646C3.95351 11.056 3.87562 10.9063 3.85667 10.744L3.76933 10H14.5573L16 2ZM13.4427 8.66667H3.61267L2.98533 3.33333H14.4047L13.4427 8.66667Z"
                        fill="#101010"
                      ></path>
                      <path
                        d="M4.66732 15.9997C5.4037 15.9997 6.00065 15.4027 6.00065 14.6663C6.00065 13.93 5.4037 13.333 4.66732 13.333C3.93094 13.333 3.33398 13.93 3.33398 14.6663C3.33398 15.4027 3.93094 15.9997 4.66732 15.9997Z"
                        fill="#101010"
                      ></path>
                      <path
                        d="M11.3333 15.9997C12.0697 15.9997 12.6667 15.4027 12.6667 14.6663C12.6667 13.93 12.0697 13.333 11.3333 13.333C10.597 13.333 10 13.93 10 14.6663C10 15.4027 10.597 15.9997 11.3333 15.9997Z"
                        fill="#101010"
                      ></path>
                    </g>
                  </svg>
                  {locale.t("ui.product-purchase-banner.add-to-cart")}
                </DemoActionButton>
              </div>
              <div class="tour-meta-right mb-0 mt-3 mt-md-0">
                <DemoActionLink
                  class="btn btn-share desktop-type-control"
                  href="#!"
                  aria-label={locale.t("ui.product-purchase-banner.share")}
                >
                  <svg
                    width="16"
                    height="18"
                    viewBox="0 0 16 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M13 11.5332C12.012 11.5332 11.1413 12.0193 10.5944 12.7584L5.86633 10.3374C5.94483 10.0698 6 9.79249 6 9.49989C6 9.10302 5.91863 8.72572 5.77807 8.37869L10.7262 5.40109C11.2769 6.04735 12.0863 6.46655 13 6.46655C14.6543 6.46655 16 5.12085 16 3.46655C16 1.81225 14.6543 0.466553 13 0.466553C11.3457 0.466553 10 1.81225 10 3.46655C10 3.84779 10.0785 4.20942 10.2087 4.54515L5.24583 7.53149C4.69563 6.90442 3.8979 6.49989 3 6.49989C1.3457 6.49989 0 7.84559 0 9.49989C0 11.1542 1.3457 12.4999 3 12.4999C4.00433 12.4999 4.8897 11.9996 5.4345 11.2397L10.147 13.6529C10.0602 13.9331 10 14.2249 10 14.5332C10 16.1875 11.3457 17.5332 13 17.5332C14.6543 17.5332 16 16.1875 16 14.5332C16 12.8789 14.6543 11.5332 13 11.5332Z"
                      fill=""
                    ></path>
                  </svg>
                  {locale.t("ui.product-purchase-banner.share")}
                </DemoActionLink>
                <DemoActionLink
                  class="btn btn-wishlish desktop-type-control"
                  href="#!"
                  aria-label={locale.t("ui.product-purchase-banner.wishlist")}
                >
                  <svg
                    width="20"
                    height="18"
                    viewBox="0 0 20 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M2.2222 2.3638C4.34203 0.243977 7.65342 0.0419426 10.0004 1.7577C12.3473 0.0419426 15.6587 0.243977 17.7786 2.3638C20.1217 4.70695 20.1217 8.50594 17.7786 10.8491L12.1217 16.5059C10.9501 17.6775 9.05063 17.6775 7.87906 16.5059L2.2222 10.8491C-0.120943 8.50594 -0.120943 4.70695 2.2222 2.3638Z"
                      fill=""
                    ></path>
                  </svg>
                  {locale.t("ui.product-purchase-banner.wishlist")}
                </DemoActionLink>
              </div>
            </div>
            {#if !phone.current}<div
                class="d-flex align-items-center gap-2 mt-4"
              >
                <span class="text-md-medium neutral-500"
                  >{locale.t("ui.product-purchase-banner.categories")}</span
                >
                <span class="text-md-medium neutral-1000"
                  >{locale.t("reference.product.categories")}</span
                >
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </section>
{/if}

<style>
  @media (min-width: 992px) {
    .shop-desktop-purchase {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      align-items: center;
      gap: var(--karento-desktop-space-10);
      padding-top: var(--karento-desktop-space-4);
    }
    .shop-product-photo {
      min-width: 0;
      padding: var(--karento-desktop-panel-padding);
      overflow: hidden;
      border: 1px solid var(--bs-neutral-200);
      border-radius: var(--karento-desktop-card-radius);
      background: var(--bs-neutral-100);
    }
    .shop-product-photo :global(.shop-product-gallery) {
      position: relative;
    }
    .shop-product-photo :global(.banner-slide-activity a) {
      display: grid;
      height: 360px;
      place-items: center;
    }
    .shop-product-photo :global(.banner-slide-activity img) {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .shop-product-photo :global(a:focus-visible) {
      outline: 2px solid var(--bs-neutral-1000);
      outline-offset: -3px;
    }
    .shop-product-summary {
      padding: var(--karento-desktop-space-6) 0;
    }
    .shop-product-reference {
      display: inline-block;
      margin-bottom: var(--karento-desktop-space-4);
      padding: var(--karento-desktop-space-1) var(--karento-desktop-space-3);
      border-radius: var(--karento-desktop-pill-radius);
      background: var(--bs-neutral-100);
      color: var(--bs-neutral-600);
      font-size: var(--karento-type-badge-size);
      line-height: var(--karento-type-badge-leading);
    }
    .shop-product-summary h1 {
      margin: 0;
      font-size: var(--karento-type-detail-size);
      line-height: var(--karento-type-detail-leading);
      overflow-wrap: anywhere;
    }
    .shop-product-price {
      display: flex;
      align-items: baseline;
      gap: var(--karento-desktop-space-3);
      margin: var(--karento-desktop-space-5) 0;
    }
    .shop-product-price strong {
      font-size: var(--karento-type-buy-price-size);
      font-weight: var(--karento-type-buy-price-weight);
      line-height: var(--karento-type-buy-price-leading);
    }
    .shop-product-price s {
      color: var(--bs-neutral-500);
      font-size: var(--karento-type-body-size);
    }
    .shop-product-summary p {
      max-width: 420px;
      margin: 0;
      color: var(--bs-neutral-600);
      font-size: var(--karento-type-body-small-size);
      line-height: var(--karento-type-body-small-leading);
    }
    .shop-product-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--karento-desktop-space-5);
      margin-top: var(--karento-desktop-space-6);
    }
    .shop-product-actions a {
      font-size: var(--karento-type-control-size);
      font-weight: var(--karento-type-control-weight);
    }
    .shop-product-enquiry {
      padding: var(--karento-desktop-space-3) var(--karento-desktop-space-5);
      border-radius: var(--karento-desktop-control-radius);
      background: var(--bs-neutral-1000);
      color: var(--bs-neutral-0);
    }
    .shop-product-back {
      color: var(--bs-neutral-600);
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    .shop-product-actions a:focus-visible {
      outline: 2px solid var(--bs-neutral-1000);
      outline-offset: 4px;
    }
  }
  @media (max-width: 767.98px) {
    .container-banner-activities {
      margin-bottom: var(--karento-space-4);
    }
    .karento-product-buybox {
      padding: var(--karento-space-4);
      margin-top: 0;
    }
    .product-demo-note {
      font-size: var(--karento-type-meta-size);
      font-weight: var(--karento-type-meta-weight);
      line-height: var(--karento-type-meta-leading);
      color: var(--bs-neutral-600);
      margin: 0 0 var(--karento-space-3);
    }
    .tour-title-main {
      margin-bottom: var(--karento-space-4);
    }
    .tour-title-main h5 {
      font-size: var(--karento-type-section-size);
      font-weight: var(--karento-type-section-weight);
      line-height: var(--karento-type-section-leading);
      overflow-wrap: anywhere;
    }
    .product-price-row {
      border-bottom: 0 !important;
      padding-bottom: 0 !important;
      margin-bottom: 0 !important;
    }
    .tour-metas {
      margin-top: var(--karento-space-4) !important;
      padding-top: var(--karento-space-4) !important;
    }
    .tour-meta-left {
      width: 100%;
      align-items: center;
    }
    .tour-meta-left :global(.button-add-to-cart) {
      flex: 1 1 128px;
      min-height: var(--karento-touch-target);
      justify-content: center;
      padding-inline: var(--karento-space-3);
    }
    .add-to-cart {
      margin-right: 0 !important;
    }
    .detail-qty :global(button) {
      border: 0;
      background: transparent;
      color: inherit;
    }
    .tour-meta-right {
      display: flex;
      flex-wrap: wrap;
      gap: var(--karento-space-2);
    }
    .tour-meta-right :global(a) {
      min-height: var(--karento-touch-target);
    }
    .tour-meta-left :global(output[data-demo-action]) {
      flex-basis: 100%;
    }
  }
</style>
