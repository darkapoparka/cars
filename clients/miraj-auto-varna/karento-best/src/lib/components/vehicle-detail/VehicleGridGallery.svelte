<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import VehicleGalleryActions from "./VehicleGalleryActions.svelte";
  import {
    referenceGridGallery,
    type DetailGridGallery,
  } from "#lib/data/vehicle-detail.ts";
  let { gallery = referenceGridGallery }: { gallery?: DetailGridGallery } =
    $props();
  const desktop = new MediaQuery("(min-width: 992px)");
  function showPhotos() {
    window.dispatchEvent(
      new CustomEvent("karento-gallery", {
        detail: {
          images: [
            gallery.hero.src,
            ...gallery.columns.flatMap((column) =>
              column.images.map((image) => image.src),
            ),
          ],
          index: 0,
        },
      }),
    );
  }
</script>

<div class="box-section box-banner-property-detail background-body">
  <div class="position-relative">
    <div class="block-banner-property-detail container-banner-activities">
      <div class="row g-3">
        <div class="col-lg-7">
          <div class="position-relative rounded-12 overflow-hidden">
            <img class="" src={gallery.hero.src} alt={gallery.hero.alt} />
            <VehicleGalleryActions
              onphotos={desktop.current ? showPhotos : undefined}
            />
          </div>
        </div>
        <div class="col-lg-5">
          <div class="d-flex gap-3"
            >{#each gallery.columns as column (column.id)}<div
                class="d-flex gap-3 flex-column w-100"
                >{#each column.images as image (image.src)}<div
                    class="rounded-12 overflow-hidden w-100"
                    ><img class="w-100" src={image.src} alt={image.alt} /></div
                  >{/each}</div
              >{/each}</div
          >
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @media (min-width: 992px) {
    .block-banner-property-detail .row {
      --bs-gutter-x: var(--karento-desktop-card-gap);
    }
    .block-banner-property-detail .rounded-12 {
      border-radius: var(--karento-desktop-card-radius) !important;
    }
    .block-banner-property-detail .gap-3 {
      gap: var(--karento-desktop-card-gap) !important;
    }
  }
</style>
