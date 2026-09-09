<script lang="ts">
  import { resolve } from '$app/paths';
  import type { NavigationFeature } from '$data/navigation';
  import { vehicleArtwork } from '$data/vehicle-artwork';
  import FeatureArtwork from '$components/ui/FeatureArtwork.svelte';
  import Icon from '$components/ui/Icon.svelte';
  let { feature }: { feature: NavigationFeature } = $props();
  // Frame the visible object, not the transparent padding in the source canvas.
  const artwork = $derived.by(() => {
    if (!feature.vehicle) return feature.artwork;
    const source = vehicleArtwork[feature.vehicle];
    const [left, top, right, bottom] = source.bounds;
    return { ...source, crop: [left, top, right - left, bottom - top] as const };
  });
</script>

<a class="dn-mega__feature" class:dn-mega__feature--red={feature.tone === 'red'} class:dn-mega__feature--ink={feature.tone === 'ink'} href={resolve(feature.href)}>
  <span class="copy"><strong>{feature.title}</strong></span>
  <span class="artwork" class:artwork--photo={feature.media === 'photo'}>
    <FeatureArtwork {artwork} />
  </span>
  <span class="arrow" aria-hidden="true"><Icon name="arrow-right" size={20} /></span>
</a>

<style>
  .dn-mega__feature { position: relative; display: flex; flex-direction: column; min-height: var(--dn-menu-card-height); padding: 16px 20px 12px; overflow: hidden; border-radius: var(--dn-radius); background: var(--dn-surface); color: var(--dn-ink); }
  .dn-mega__feature:hover { background: var(--dn-home-panel); }
  .dn-mega__feature--red { background: var(--dn-red); color: var(--dn-white); }
  .dn-mega__feature--red:hover { background: var(--dn-red); }
  .dn-mega__feature--ink { background: var(--dn-ink); color: var(--dn-white); }
  .dn-mega__feature--ink:hover { background: var(--dn-ink); }
  .copy { position: relative; z-index: 1; min-height: 2.5em; font-size: var(--dn-text-subheading); }
  strong { display: block; color: inherit; font-size: inherit; font-weight: var(--dn-menu-heading-weight); line-height: 1.25; }
  .artwork { display: flex; flex: none; align-items: flex-end; justify-content: center; height: var(--dn-menu-art-height); margin: auto -12px 24px; }
  .artwork :global(.feature-artwork) { width: min(96%, calc(var(--dn-menu-art-height) * var(--artwork-ratio))); height: auto; }
  .artwork :global(img) { mix-blend-mode: multiply; }
  .artwork--photo :global(.feature-artwork) {
    mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent), linear-gradient(transparent, #000 7%, #000 93%, transparent);
    mask-composite: intersect;
  }
  .artwork--photo :global(img) { mix-blend-mode: normal; }
  .dn-mega__feature--red .artwork :global(img), .dn-mega__feature--ink .artwork :global(img) { mix-blend-mode: normal; }
  .arrow { position: absolute; right: 16px; bottom: 12px; display: grid; place-items: center; width: 28px; height: 28px; }
  .dn-mega__feature:hover .arrow { background: rgb(255 255 255 / .16); border-radius: var(--dn-pill); }
  @media (min-width: 1200px) and (max-width: 1439px) {
    .copy { font-size: var(--dn-text-card); }
  }
  @media (min-width: 992px) and (max-width: 1199px) {
    .dn-mega__feature { padding: 16px 16px 12px; }
    .copy { font-size: var(--dn-text-lead); }
    .artwork { margin-inline: -8px; }
  }
</style>
