<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import { shareVehiclePage, type ShareResult } from "#lib/i18n/share.ts";
  const locale = useLocale();
  import type { Attachment } from "svelte/attachments";
  import Gallery from "#lib/components/Gallery.svelte";
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import MobileIcon from "#lib/components/mobile/MobileIcon.svelte";
  import VehicleHeading from "./VehicleHeading.svelte";
  import VehicleSpecifications from "./VehicleSpecifications.svelte";
  import VehicleDetailPanels from "./VehicleDetailPanels.svelte";
  import VehicleReservationCard from "./VehicleReservationCard.svelte";
  import VehiclePriceActions from "./VehiclePriceActions.svelte";
  import DetailSellerCard from "./DetailSellerCard.svelte";
  import DetailBrandStrip from "./DetailBrandStrip.svelte";
  import type { LoanCalculatorState } from "#lib/data/loan-estimate.ts";
  import {
    referenceHeading,
    referenceSliderGallery,
    referenceSpecifications,
    referenceDetailContent,
    referenceReservation,
    referenceSeller,
    type DetailHeading,
    type DetailSliderGallery,
    type DetailSpecification,
    type DetailContent,
    type DetailReservation,
    type DetailSeller,
  } from "#lib/data/vehicle-detail.ts";
  let {
    heading = referenceHeading,
    gallery = referenceSliderGallery,
    specifications = referenceSpecifications,
    details = referenceDetailContent,
    reservation = referenceReservation,
    seller = referenceSeller,
    loanState = $bindable(),
  }: {
    heading?: DetailHeading;
    gallery?: DetailSliderGallery;
    specifications?: readonly DetailSpecification[];
    details?: DetailContent;
    reservation?: DetailReservation;
    seller?: DetailSeller;
    loanState?: LoanCalculatorState;
  } = $props();
  let shareFeedback = $state<ShareResult | null>(null);
  let wishlistFeedback: HTMLDivElement | undefined;
  const ownWishlistFeedback: Attachment<HTMLDivElement> = (node) => {
    wishlistFeedback = node;
    return () => {
      wishlistFeedback = undefined;
    };
  };

  async function shareVehicle() {
    shareFeedback = null;
    const result = await shareVehiclePage(
      locale.shareUrl(new URL(location.href)),
      heading.mobileTitle ?? heading.title,
      {
        share: navigator.share?.bind(navigator),
        writeText: navigator.clipboard?.writeText.bind(navigator.clipboard),
      },
    );
    if (result === "copied" || result === "unavailable") shareFeedback = result;
  }
</script>

<section class="mobile-vehicle-detail karento-enquiry-detail">
  <div class="mobile-pdp-gallery">
    <Gallery
      slides={gallery.slides}
      thumbnails={gallery.thumbnails}
      mobileThumbnailCount={4}
      showNavigation={false}
    />
    <nav
      class="mobile-pdp-photo-actions"
      aria-label={locale.t("vehicle.actions")}
    >
      <a
        href={locale.href("/vehicles")}
        aria-label={locale.t("action.backVehicles")}
        ><MobileIcon name="arrow-left" size="action" /></a
      >
      <div class="mobile-pdp-photo-tools">
        <DemoActionLink
          href="#!"
          aria-label={locale.t("action.wishlist")}
          getFeedbackContainer={() => wishlistFeedback}
          ><MobileIcon name="heart" size="action" /></DemoActionLink
        >
        <button
          type="button"
          aria-label={locale.t("share.vehicle")}
          onclick={shareVehicle}
          ><MobileIcon name="share" size="action" /></button
        >
      </div>
    </nav>
    {#if shareFeedback}<p class="mobile-pdp-share-feedback" role="status"
        >{locale.t(
          shareFeedback === "copied" ? "share.copied" : "share.unavailable",
        )}</p
      >{/if}
  </div>
  <div class="mobile-pdp-panel">
    <VehicleHeading {heading} showActions={false} />
    <div
      class="mobile-preview-feedback mobile-pdp-wishlist-feedback"
      {@attach ownWishlistFeedback}
    ></div>
    <VehicleSpecifications {specifications} alignStart compact />
    <div class="mobile-pdp-enquiry">
      <VehiclePriceActions />
      <VehicleReservationCard {reservation} />
      <DetailSellerCard {seller} />
    </div>
    <VehicleDetailPanels {details} bind:loanState />
  </div>
  <DetailBrandStrip />
</section>

<style>
  .mobile-pdp-gallery {
    position: relative;
  }

  .mobile-pdp-gallery :global(.banner-slide-activity img) {
    aspect-ratio: var(--karento-image-landscape);
    border-radius: 0;
  }

  .mobile-pdp-gallery :global(.slick-list) {
    border-radius: 0;
  }

  .mobile-pdp-gallery :global(.slider-thumnail-activities) {
    position: absolute;
    inset: auto var(--karento-space-4) var(--karento-space-8);
    margin: 0;
    padding: 0;
  }

  .mobile-pdp-gallery :global(.karento-gallery-thumb img) {
    height: var(--karento-control-field);
    border-radius: var(--karento-radius-media);
  }

  .mobile-pdp-photo-actions {
    position: absolute;
    inset: calc(var(--karento-space-4) + env(safe-area-inset-top, 0px))
      var(--karento-space-4) auto;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    pointer-events: none;
  }

  .mobile-pdp-photo-tools {
    display: flex;
    gap: var(--karento-space-2);
  }

  .mobile-pdp-photo-actions :global(:is(a, button)) {
    display: grid;
    place-items: center;
    width: var(--karento-touch-target);
    height: var(--karento-touch-target);
    padding: 0;
    border: 1px solid var(--bs-neutral-200);
    border-radius: var(--karento-radius-pill);
    color: var(--bs-neutral-1000);
    background: var(--bs-neutral-0);
    pointer-events: auto;
  }

  .mobile-pdp-share-feedback {
    position: absolute;
    inset: auto var(--karento-space-4) var(--karento-space-8);
    z-index: 2;
    width: fit-content;
    margin: 0;
    padding: var(--karento-space-2) var(--karento-space-3);
    border-radius: var(--karento-radius-card);
    color: var(--bs-neutral-1000);
    background: var(--bs-neutral-0);
    font-size: var(--karento-text-caption);
  }

  .mobile-pdp-panel {
    position: relative;
    z-index: 1;
    display: grid;
    gap: var(--karento-space-3);
    margin-top: calc(var(--karento-space-4) * -1);
    padding: var(--karento-space-4);
    border-radius: var(--karento-radius-sheet) var(--karento-radius-sheet) 0 0;
    background: var(--bs-background-body);
  }

  .mobile-pdp-wishlist-feedback {
    order: 3;
  }

  .mobile-pdp-panel :global(.rate-element) {
    padding-block: var(--karento-browse-inset-block);
    font-size: var(--karento-text-caption);
    line-height: var(--karento-control-line);
  }

  .mobile-pdp-panel :global(.tour-metas) {
    display: grid;
    gap: var(--karento-space-2);
  }

  .mobile-pdp-panel :global(.tour-meta-left) {
    margin: 0;
  }

  .mobile-pdp-enquiry {
    order: 5;
    display: grid;
    gap: var(--karento-space-4);
    min-width: 0;
  }

  .mobile-pdp-enquiry :global(.sidebar-banner),
  .mobile-pdp-enquiry :global(.booking-form) {
    margin: 0;
  }

  @media (max-width: 767.98px) {
    .mobile-pdp-panel,
    .mobile-pdp-enquiry {
      grid-template-columns: minmax(0, 1fr);
    }

    .mobile-pdp-share-feedback,
    .mobile-pdp-wishlist-feedback :global(output[data-demo-action]) {
      font-size: var(--karento-type-body-small-size);
      font-weight: var(--karento-type-body-small-weight);
      line-height: var(--karento-type-body-small-leading);
    }

    .mobile-pdp-panel :global(.tour-title-main h4) {
      font-size: var(--karento-type-detail-size);
      font-weight: var(--karento-type-detail-weight);
      line-height: var(--karento-type-detail-leading);
    }

    .mobile-pdp-panel :global(.rate-element),
    .mobile-pdp-panel :global(.rate-element .rating) {
      font-size: var(--karento-type-badge-size);
      font-weight: var(--karento-type-badge-weight);
      line-height: var(--karento-type-badge-leading);
    }

    .mobile-pdp-panel :global(.rate-element .text-sm-medium),
    .mobile-pdp-panel :global(.tour-meta-left :is(p, a)) {
      font-size: var(--karento-type-meta-size);
      font-weight: var(--karento-type-meta-weight);
      line-height: var(--karento-type-meta-leading);
    }
  }
</style>
