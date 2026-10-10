<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import Gallery from "#lib/components/Gallery.svelte";
  import VehicleGalleryActions from "./VehicleGalleryActions.svelte";
  import {
    referenceSliderGallery,
    type DetailSliderGallery,
  } from "#lib/data/vehicle-detail.ts";
  let { gallery = referenceSliderGallery }: { gallery?: DetailSliderGallery } =
    $props();
</script>

<div class="container-banner-activities"
  ><Gallery
    slides={gallery.slides}
    thumbnails={gallery.thumbnails}
    mobileThumbnailCount={4}><VehicleGalleryActions /></Gallery
  ></div
>
