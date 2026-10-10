<script lang="ts">
  import { desktopMakeArtwork } from '$data/desktop-makes';
  import Icon from '$components/ui/Icon.svelte';

  let { value, portrait = true, compact = false }: { value: string; portrait?: boolean; compact?: boolean } = $props();
  const artwork = $derived(desktopMakeArtwork(value));
  const logoWidth = $derived(artwork ? Math.min(compact ? 28 : portrait ? 72 : 48, (portrait ? 40 : 28) * (artwork.bounds[2] - artwork.bounds[0]) / (artwork.bounds[3] - artwork.bounds[1])) : 40);
</script>

{#if artwork}
  <span class="dn-make-logo" class:dn-make-logo--catalogue={artwork.image.startsWith('/assets/images/makes/')} style:width={`${logoWidth}px`} style:aspect-ratio={`${artwork.bounds[2] - artwork.bounds[0]} / ${artwork.bounds[3] - artwork.bounds[1]}`}>
    <img src={artwork.image} alt="" width={artwork.width} height={artwork.height} decoding="async"
      style:width={`${artwork.width / (artwork.bounds[2] - artwork.bounds[0]) * 100}%`}
      style:left={`${-artwork.bounds[0] / (artwork.bounds[2] - artwork.bounds[0]) * 100}%`}
      style:top={`${-artwork.bounds[1] / (artwork.bounds[3] - artwork.bounds[1]) * 100}%`} />
  </span>
{:else}
  <Icon name={value ? 'car' : 'adjustments'} size={compact ? 20 : portrait ? 40 : 28} />
{/if}

<style>
  .dn-make-logo { display: block; position: relative; overflow: hidden; }
  .dn-make-logo--catalogue { mix-blend-mode: multiply; }
  img { position: absolute; max-width: none; height: auto; }
</style>
