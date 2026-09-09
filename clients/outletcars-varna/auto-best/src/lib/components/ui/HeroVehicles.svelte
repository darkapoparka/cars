<script lang="ts">
  import VehicleCutout from './VehicleCutout.svelte';
  import ArtworkRegion from './ArtworkRegion.svelte';
  import { heroVehiclePairs, vehicleArtwork, mobileHeroArtwork, type HeroVehiclePair, type Vehicle, type MobileHeroScene } from '$data/vehicle-artwork';
  import { mobileHeroRegions } from '$data/vehicle-artwork';

  let { pair = 'home', mobile = false, mobileScene = 'car', mobileLeft = 'silver', mobileRight = 'urus' }: {
    pair?: HeroVehiclePair; mobile?: boolean; mobileScene?: MobileHeroScene; mobileLeft?: Vehicle; mobileRight?: Vehicle;
  } = $props();
  const sides = ['left', 'right'] as const;
  let vehicles = $derived(heroVehiclePairs[pair]);
  const mobileArtwork = mobileHeroArtwork.car;
</script>

<div class="dn-hero-vehicles" class:dn-hero-vehicles--mobile={mobile} data-pair={pair} aria-hidden="true">
  {#if mobile}
    {#if pair === 'home'}
      <div class="dn-hero-vehicles__pair"><ArtworkRegion artwork={mobileHeroRegions.home} /></div>
    {:else}
      <picture><source media="(max-width: 767px)" srcset={mobileArtwork.src} /><img class="dn-hero-vehicles__front" data-scene="car" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" width={mobileArtwork.width} height={mobileArtwork.height} decoding="async" /></picture>
      {#if mobileScene === 'sell' || mobileScene === 'import'}
        {#each sides as side (side)}
          <div class="dn-hero-vehicles__support dn-hero-vehicles__support--{side}" class:dn-hero-vehicles__support--ship={mobileScene === 'import'} data-support={mobileScene}>
            <ArtworkRegion artwork={mobileHeroRegions[mobileScene]} />
          </div>
        {/each}
      {/if}
    {/if}
  {/if}
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
  .dn-hero-vehicles__support, .dn-hero-vehicles__pair { display: none; }
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
    .dn-hero-vehicles__support { display: block; position: absolute; bottom: 4px; width: clamp(56px, 18vw, 70px); }
    .dn-hero-vehicles__support--left { right: calc(50% + 82px); }
    .dn-hero-vehicles__support--right { left: calc(50% + 82px); }
    .dn-hero-vehicles__support--ship.dn-hero-vehicles__support--right { transform: scaleX(-1); }
    .dn-hero-vehicles__pair { display: block; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: min(calc(100% - 24px), 330px); }
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
