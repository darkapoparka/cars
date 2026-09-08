<script lang="ts">
  import { vehicleArtwork, type Vehicle } from '$data/vehicle-artwork';
  let { vehicle = 'silver', mobileVehicle, eager = false, framing = 'hero' }: {
    vehicle?: Vehicle;
    mobileVehicle?: Vehicle;
    eager?: boolean;
    framing?: 'hero' | 'banner';
  } = $props();

</script>

<picture>
  {#if mobileVehicle}<source media="(max-width: 767px)" srcset={vehicleArtwork[mobileVehicle].src} />{/if}
  <img class="dn-vehicle-cutout" class:dn-vehicle-cutout--banner-gclass={framing === 'banner' && vehicle === 'gclass'} data-view="side-profile" src={vehicleArtwork[vehicle].src} alt="" width="1000" height="667" loading={eager ? 'eager' : 'lazy'} decoding="async" />
</picture>

<style>
  picture { display: contents; }
  .dn-vehicle-cutout {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
    user-select: none;
  }
  /* Match the G-Class opaque body height and wheel baseline to the Urus. */
  .dn-vehicle-cutout--banner-gclass { transform: translateY(-0.42%) scale(0.793); transform-origin: right center; }
</style>
