<script lang="ts">
  import { desktopMakeArtwork, desktopMakeCount } from '$data/desktop-makes';
  import { getI18n } from '$lib/locale/context';
  import { vehicleCount } from '$lib/locale/messages';
  import Icon from '$components/ui/Icon.svelte';
  import DesktopFilterChoice from './DesktopFilterChoice.svelte';

  let { value, label, checked, name, portrait = true, onchange }: {
    value: string; label: string; checked: boolean; name?: string;
    portrait?: boolean;
    onchange: (value: string) => void;
  } = $props();
  const i18n = getI18n();
  const artwork = $derived(desktopMakeArtwork(value));
  const stock = $derived(vehicleCount(i18n.locale, desktopMakeCount(value)));
  const logoWidth = $derived(artwork ? Math.min(portrait ? 72 : 48, (portrait ? 40 : 28) * (artwork.bounds[2] - artwork.bounds[0]) / (artwork.bounds[3] - artwork.bounds[1])) : 40);
</script>

{#snippet logo()}
  {#if artwork}
    <span class="dn-make-logo" class:dn-make-logo--catalogue={artwork.image.startsWith('/assets/images/makes/')} style:width={`${logoWidth}px`} style:aspect-ratio={`${artwork.bounds[2] - artwork.bounds[0]} / ${artwork.bounds[3] - artwork.bounds[1]}`}>
      <img src={artwork.image} alt="" width={artwork.width} height={artwork.height} decoding="async"
        style:width={`${artwork.width / (artwork.bounds[2] - artwork.bounds[0]) * 100}%`}
        style:left={`${-artwork.bounds[0] / (artwork.bounds[2] - artwork.bounds[0]) * 100}%`}
        style:top={`${-artwork.bounds[1] / (artwork.bounds[3] - artwork.bounds[1]) * 100}%`} />
    </span>
  {:else}
    <Icon name={value ? 'car' : 'adjustments'} size={portrait ? 40 : 28} />
  {/if}
{/snippet}

<DesktopFilterChoice {value} {label} {checked} {name} {onchange} multiple tile={portrait} {portrait} media={logo} description={stock} accessibleLabel={label} />

<style>
  .dn-make-logo { display: block; position: relative; overflow: hidden; }
  .dn-make-logo--catalogue { mix-blend-mode: multiply; }
  img { position: absolute; max-width: none; height: auto; }
</style>
