<script lang="ts">
  import { asset } from '$app/paths';
  import { dockArtwork, type DockIconName } from './dock-artwork';

  let { name, size = 24, active = false }: { name: DockIconName; size?: number; active?: boolean } = $props();
</script>

<img
  class="dn-icon"
  class:dn-icon--active={active}
  class:dn-icon--sell={name === 'sell'}
  src={asset(dockArtwork[name])}
  width={size}
  height={size}
  alt=""
  aria-hidden="true"
  loading="eager"
  decoding="async"
  data-icon-family="auto-best-graphite"
  data-icon-name={name}
  data-icon-state="artwork"
  data-icon-active={active}
/>

<style>
  .dn-icon { display: block; flex: 0 0 auto; object-fit: contain; opacity: .78; }
  .dn-icon--active { opacity: 1; }
  .dn-icon--sell { box-sizing: border-box; padding: var(--dn-space-half); }
</style>
