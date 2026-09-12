<script lang="ts">
  import VehicleCutout from './VehicleCutout.svelte';
  import { heroVehiclePairs, vehicleArtwork, type HeroVehiclePair, type Vehicle } from '$data/vehicle-artwork';

  let { pair = 'home', mobile = false, mobileLeft = 'silver', mobileRight = 'urus' }: {
    pair?: HeroVehiclePair; mobile?: boolean; mobileLeft?: Vehicle; mobileRight?: Vehicle;
  } = $props();
  const sides = ['left', 'right'] as const;
  let vehicles = $derived(heroVehiclePairs[pair]);
</script>

<div class="dn-hero-vehicles" class:dn-hero-vehicles--mobile={mobile} data-pair={pair} aria-hidden="true">
  {#if mobile}<picture><source media="(max-width: 767px)" srcset="/stock/127361925-1.webp" /><img class="dn-hero-vehicles__front" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" width="600" height="600" decoding="async" /></picture>{/if}
  {#each sides as side (side)}
    {@const vehicle = vehicles[side === 'left' ? 0 : 1]}
    {@const artwork = vehicleArtwork[vehicle]}
    {@const bodyHeight = artwork.bounds[3] - artwork.bounds[1]}
    {@const mobileVehicle = side === 'left' ? mobileLeft : mobileRight}
    <div class="dn-hero-vehicles__car dn-hero-vehicles__car--{side}"
      class:dn-hero-vehicles__car--reverse={side === 'left' && mobileLeft === 'gclass'}
      data-vehicle={vehicle} data-mobile-vehicle={mobileVehicle}
      style:--art-width-ratio={artwork.width / bodyHeight}
      style:--art-height-ratio={artwork.height / bodyHeight}
      style:--art-bottom-ratio={artwork.bounds[3] / bodyHeight}
      style:--art-front-ratio={(artwork.width - artwork.bounds[0]) / bodyHeight}>
      <VehicleCutout media="(min-width: 1440px)" {vehicle} mobileVehicle={mobile ? mobileVehicle : undefined} eager />
    </div>
  {/each}
</div>

<style>
  .dn-hero-vehicles { display: none; }
  .dn-hero-vehicles__front { display: none; }
  @media (max-width: 767px) {
    .dn-hero-vehicles--mobile {
      display: block;
      position: absolute;
      top: 68px;
      left: 0;
      right: 0;
      height: 128px;
      overflow: hidden;
      pointer-events: none;
    }
    .dn-hero-vehicles__car { display: none; }
    .dn-hero-vehicles__front { display: block; position: absolute; top: -16px; left: 50%; transform: translateX(-50%); width: 160px; height: 160px; object-fit: contain; }
  }
  @media (min-width: 1440px) {
    .dn-hero-vehicles {
      --car-height: clamp(100px, calc(10vw - 44px), 148px);
      --car-baseline: 480px;
      --side-room: calc((100vw - var(--dn-hero-center-width)) / 2);
      display: block;
      position: absolute;
      inset: 0;
      height: 540px;
      overflow: hidden;
      pointer-events: none;
    }
    .dn-hero-vehicles__car {
      --car-edge: calc(var(--side-room) - 24px - var(--car-height) * var(--art-front-ratio));
      position: absolute;
      top: calc(var(--car-baseline) - var(--car-height) * var(--art-bottom-ratio));
      width: calc(var(--car-height) * var(--art-width-ratio));
      height: calc(var(--car-height) * var(--art-height-ratio));
    }
    .dn-hero-vehicles__car--left { left: var(--car-edge); transform: scaleX(-1); }
    .dn-hero-vehicles__car--right { right: var(--car-edge); }
  }
</style>
