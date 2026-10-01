<script lang="ts">
  import VehicleCutout from './VehicleCutout.svelte';
  import { heroVehiclePairs, vehicleArtwork, type HeroVehiclePair } from '$data/vehicle-artwork';

  let { pair, framing = 'hero', priority = false }: {
    pair: HeroVehiclePair;
    framing?: 'hero' | 'search' | 'section';
    priority?: boolean;
  } = $props();
  const sides = ['left', 'right'] as const;
</script>

<div class="dn-campaign-vehicles" class:dn-campaign-vehicles--section={framing === 'section'} class:dn-campaign-vehicles--search={framing === 'search'} data-pair={pair} aria-hidden="true">
  <span class="dn-campaign-vehicles__dots dn-campaign-vehicles__dots--left"></span>
  <span class="dn-campaign-vehicles__dots dn-campaign-vehicles__dots--right"></span>
  <span class="dn-campaign-vehicles__arc dn-campaign-vehicles__arc--left"></span>
  <span class="dn-campaign-vehicles__arc dn-campaign-vehicles__arc--right"></span>
  {#each sides as side, index (side)}
    {@const vehicle = heroVehiclePairs[pair][index]}
    {@const artwork = vehicleArtwork[vehicle]}
    {@const bodyHeight = artwork.bounds[3] - artwork.bounds[1]}
    <div class="dn-campaign-vehicles__car dn-campaign-vehicles__car--{side}" data-vehicle={vehicle}
      style:--art-width-ratio={artwork.width / bodyHeight}
      style:--art-height-ratio={artwork.height / bodyHeight}
      style:--art-bottom-ratio={artwork.bounds[3] / bodyHeight}
      style:--art-front-ratio={(artwork.width - artwork.bounds[0]) / bodyHeight}>
      <VehicleCutout media="(min-width: 992px)" {vehicle} eager={priority} />
    </div>
  {/each}
</div>

<style>
  .dn-campaign-vehicles { display: none; }

  @media (min-width: 992px) {
    .dn-campaign-vehicles {
      --car-height: clamp(140px, 11.111vw, 190px);
      --car-baseline: calc(100% - 50px);
      --side-room: max(160px, calc((100% - var(--dn-hero-center-width)) / 2 - 24px));
      display: block;
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      background: linear-gradient(180deg, transparent 45%, var(--dn-ink-deep));
    }
    .dn-campaign-vehicles__dots {
      position: absolute;
      top: 28%;
      bottom: 0;
      width: 28%;
      opacity: .55;
      background-image: radial-gradient(circle, rgb(255 255 255 / 22%) 1px, transparent 1.5px);
      background-size: 9px 9px;
      mask-image: linear-gradient(90deg, black, transparent);
    }
    .dn-campaign-vehicles__dots--left { left: 0; }
    .dn-campaign-vehicles__dots--right { right: 0; transform: scaleX(-1); }
    .dn-campaign-vehicles__arc {
      position: absolute;
      top: 24%;
      width: 520px;
      height: 520px;
      border: 1px solid rgb(var(--dn-theme-accent-rgb) / 32%);
      border-radius: 50%;
    }
    .dn-campaign-vehicles__arc--left { right: calc(100% - 180px); }
    .dn-campaign-vehicles__arc--right { left: calc(100% - 180px); }
    .dn-campaign-vehicles__car {
      position: absolute;
      top: calc(var(--car-baseline) - var(--car-height) * var(--art-bottom-ratio));
      width: calc(var(--car-height) * var(--art-width-ratio));
      height: calc(var(--car-height) * var(--art-height-ratio));
    }
    .dn-campaign-vehicles__car--left { left: calc(var(--side-room) - var(--car-height) * var(--art-front-ratio)); transform: scaleX(-1); }
    .dn-campaign-vehicles__car--right { right: calc(var(--side-room) - var(--car-height) * var(--art-front-ratio)); }

    .dn-campaign-vehicles--section {
      --car-height: clamp(64px, 6.667vw, 96px);
      --car-baseline: calc(100% - 26px);
      --side-room: max(100px, calc((100% - 640px) / 2 - 24px));
    }
    .dn-campaign-vehicles--section .dn-campaign-vehicles__dots { top: 0; }
    .dn-campaign-vehicles--section .dn-campaign-vehicles__arc { top: -200px; }
  }

  @media (min-width: 992px) and (max-width: 1199px) {
    .dn-campaign-vehicles:not(.dn-campaign-vehicles--section) { --car-height: 92px; --car-baseline: calc(100% - 30px); }
    .dn-campaign-vehicles.dn-campaign-vehicles--search {
      --car-height: 70px;
      --car-baseline: calc(100% - var(--dn-route-hero-height) + var(--dn-route-hero-control-top) - var(--dn-space-4));
    }
  }
</style>
