<script lang="ts">
  import { desktopBrands } from '$data/home';
  import Icon from '$components/ui/Icon.svelte';
  import DesktopFilterChoice from './DesktopFilterChoice.svelte';

  let { value, label, checked, name, onchange }: {
    value: string; label: string; checked: boolean; name?: string;
    onchange: (value: string) => void;
  } = $props();
  const artwork = $derived(desktopBrands.find(brand => brand.label.toLowerCase() === value.toLowerCase()));
  const logoWidth = $derived(artwork ? Math.min(72, 40 * (artwork.bounds[2] - artwork.bounds[0]) / (artwork.bounds[3] - artwork.bounds[1])) : 40);
</script>

{#snippet logo()}
  {#if artwork}
    <span class="dn-make-logo" style:width={`${logoWidth}px`} style:aspect-ratio={`${artwork.bounds[2] - artwork.bounds[0]} / ${artwork.bounds[3] - artwork.bounds[1]}`}>
      <img src={artwork.image} alt="" width={artwork.width} height={artwork.height} decoding="async"
        style:width={`${artwork.width / (artwork.bounds[2] - artwork.bounds[0]) * 100}%`}
        style:left={`${-artwork.bounds[0] / (artwork.bounds[2] - artwork.bounds[0]) * 100}%`}
        style:top={`${-artwork.bounds[1] / (artwork.bounds[3] - artwork.bounds[1]) * 100}%`} />
    </span>
  {:else}
    <Icon name={value ? 'car' : 'adjustments'} size={40} />
  {/if}
{/snippet}

<DesktopFilterChoice {value} {label} {checked} {name} {onchange} multiple tile portrait media={logo} />

<style>
  .dn-make-logo { display: block; position: relative; overflow: hidden; }
  img { position: absolute; max-width: none; height: auto; }
</style>
