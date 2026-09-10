<script lang="ts">
  let { artwork }: { artwork: { src: string; width: number; height: number; crop: readonly [number, number, number, number] } } = $props();
</script>

<span class="dn-artwork-region" style:aspect-ratio={`${artwork.crop[2]} / ${artwork.crop[3]}`}>
  <picture><source media="(max-width: 767px)" srcset={artwork.src} /><img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" width={artwork.width} height={artwork.height} decoding="async"
    style:width={`${artwork.width / artwork.crop[2] * 100}%`}
    style:left={`${-artwork.crop[0] / artwork.crop[2] * 100}%`}
    style:top={`${-artwork.crop[1] / artwork.crop[3] * 100}%`} /></picture>
</span>

<style>
  .dn-artwork-region { display: block; position: relative; width: 100%; overflow: hidden; }
  picture { display: contents; }
  img { position: absolute; max-width: none; height: auto; }
</style>
