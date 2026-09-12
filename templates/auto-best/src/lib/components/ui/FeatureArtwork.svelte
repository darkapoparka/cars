<script lang="ts">
  import type { FeatureArtwork } from '$data/feature-artwork';
  let { artwork }: { artwork: FeatureArtwork } = $props();
</script>

<span class="feature-artwork" style:--artwork-ratio={artwork.crop[2] / artwork.crop[3]} style:aspect-ratio={`${artwork.crop[2]} / ${artwork.crop[3]}`}>
  <img src={artwork.src} alt="" width={artwork.width} height={artwork.height} decoding="async"
    style:width={`${artwork.width / artwork.crop[2] * 100}%`}
    style:left={`${-artwork.crop[0] / artwork.crop[2] * 100}%`}
    style:top={`${-artwork.crop[1] / artwork.crop[3] * 100}%`} />
</span>

<style>
  .feature-artwork { display: block; position: relative; width: 100%; overflow: hidden; }
  img { position: absolute; max-width: none; height: auto; pointer-events: none; }
</style>
