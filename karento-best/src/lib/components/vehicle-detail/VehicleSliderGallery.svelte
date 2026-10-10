<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import Gallery from "#lib/components/Gallery.svelte";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import VehicleGalleryActions from "./VehicleGalleryActions.svelte";
  import {
    referenceSliderGallery,
    type DetailSliderGallery,
  } from "#lib/data/vehicle-detail.ts";
  let {
    gallery = referenceSliderGallery,
    showVideo = true,
    fillColumn = false,
  }: {
    gallery?: DetailSliderGallery;
    showVideo?: boolean;
    fillColumn?: boolean;
  } = $props();
  const locale = useLocale();
  const slides = $derived(
    gallery === referenceSliderGallery
      ? gallery.slides.map((photo, index) => ({
          ...photo,
          alt: locale.t("gallery.photoPosition", {
            number: locale.number(index + 1),
            count: locale.number(gallery.slides.length),
          }),
        }))
      : gallery.slides,
  );
  const thumbnails = $derived(
    gallery === referenceSliderGallery
      ? gallery.thumbnails.map((photo) => ({
          ...photo,
          alt: locale.t("gallery.photo"),
        }))
      : gallery.thumbnails,
  );
</script>

<div
  class={[
    "container-banner-activities",
    { "vehicle-selected-gallery": fillColumn },
  ]}
  ><Gallery {slides} {thumbnails} mobileThumbnailCount={4}
    ><VehicleGalleryActions
      {showVideo}
      showPhotos={!fillColumn || gallery.slides.length > 1}
    /></Gallery
  ></div
>

<style>
  @media (min-width: 992px) {
    .vehicle-selected-gallery :global(.banner-slide-activity a) {
      display: block;
    }
    .vehicle-selected-gallery :global(.banner-slide-activity img) {
      display: block;
      width: 100%;
      height: auto;
      aspect-ratio: 16 / 9;
      object-fit: cover;
      border-radius: var(--karento-desktop-card-radius);
    }
  }
</style>
