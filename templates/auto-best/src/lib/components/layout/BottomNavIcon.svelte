<script lang="ts">
  import { base } from '$app/paths';

  // Refined imagegen artwork; the same alpha mask supplies every dock state.
  let { name, size = 24, active = false }: { name: 'home' | 'cars' | 'sell' | 'import' | 'menu'; size?: number; active?: boolean } = $props();

  const bounds = {
    home: { x: 100, y: 203, width: 287, height: 266 },
    cars: { x: 527, y: 262, width: 315, height: 204 },
    sell: { x: 967, y: 217, width: 258, height: 259 },
    import: { x: 1367, y: 203, width: 280, height: 284 },
    menu: { x: 1801, y: 266, width: 265, height: 170 }
  } as const;

  function maskStyle(role: keyof typeof bounds, frame: number) {
    const box = bounds[role];
    // One scale for all five glyphs: a 20px globe inside the 24px frame.
    const scale = (frame * 20 / 24) / bounds.import.height;
    const x = (frame - box.width * scale) / 2 - box.x * scale;
    const y = (frame - box.height * scale) / 2 - box.y * scale;
    return `width:${frame}px;height:${frame}px;--nav-sprite:url('${base}/assets/images/template/generated-bottom-nav-v3.png');--nav-mask-size:${2172 * scale}px ${724 * scale}px;--nav-mask-position:${x}px ${y}px`;
  }
</script>

<span class="dn-generated-nav-icon" data-icon-family="imagegen-generated-nav" data-icon-name={name} data-icon-active={active} style={maskStyle(name, size)} aria-hidden="true"></span>

<style>
  .dn-generated-nav-icon {
    display: block;
    flex: 0 0 auto;
    background: currentColor;
    -webkit-mask-image: var(--nav-sprite);
    mask-image: var(--nav-sprite);
    mask-mode: alpha;
    -webkit-mask-size: var(--nav-mask-size);
    mask-size: var(--nav-mask-size);
    -webkit-mask-position: var(--nav-mask-position);
    mask-position: var(--nav-mask-position);
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
  }
</style>
