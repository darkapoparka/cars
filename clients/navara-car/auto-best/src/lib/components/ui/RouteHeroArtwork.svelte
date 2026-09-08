<script lang="ts">
  import source from '$data/navara-data.json';
  let { variant = 'cars', theme = 'light' }: { variant?: 'cars' | 'keys' | 'guide' | 'about' | 'contact' | 'sell'; theme?: 'light' | 'red' | 'charcoal' | 'yellow' } = $props();
  // Existing composition slots now contain only photographs from the selected dealer's sample.
  // No staff member, owner portrait or source dealership promotional artwork is retained here.
  const images = {
    cars: source.vehicles[3].images[0], keys: source.vehicles[1].images[0],
    guide: source.vehicles[0].images[1], silver: source.vehicles[2].images[0],
    graphite: source.vehicles[8].images[0], portrait: source.vehicles[4].images[1],
    phone: source.vehicles[6].images[0], showroom: source.vehicles[3].images[1],
    email: source.vehicles[7].images[0]
  };
  const pairs = {
    cars: ['silver', 'graphite'], keys: ['cars', 'keys'], guide: ['guide', 'keys'],
    about: ['showroom', 'portrait'], contact: ['phone', 'email'], sell: ['portrait', 'keys']
  } as const;
</script>

{#each pairs[variant] as asset, index (asset)}
  <img class="dn-route-hero__artwork"
    class:dn-route-hero__artwork--left={index === 0}
    class:dn-route-hero__artwork--right={index === 1}
    class:dn-route-hero__artwork--portrait={asset === 'portrait' || asset === 'phone'}
    class:dn-route-hero__artwork--colored={theme !== 'light'}
    src={images[asset]} alt="" width="1000" height={asset === 'silver' || asset === 'graphite' || asset === 'phone' || asset === 'cars' || asset === 'showroom' ? 750 : 667} decoding="async" />
{/each}

<style>
  .dn-route-hero__artwork { display: none; }
  @media (min-width: 992px) {
    .dn-route-hero__artwork {
      position: absolute; display: block; top: var(--dn-studio-art-top, 184px);
      width: var(--dn-studio-art-width, clamp(200px, 23vw, 380px)); height: var(--dn-studio-art-height, 272px);
      object-fit: contain; object-position: center; filter: contrast(1.12) brightness(1.03);
      mix-blend-mode: multiply; pointer-events: none;
    }
    .dn-route-hero__artwork--left { left: var(--dn-studio-art-gutter, max(12px, calc((100% - 1840px) / 2))); }
    .dn-route-hero__artwork--right { right: var(--dn-studio-art-gutter, max(12px, calc((100% - 1840px) / 2))); }
    .dn-route-hero__artwork.dn-route-hero__artwork--portrait {
      width: var(--dn-studio-portrait-width, clamp(200px, 23vw, 380px)); height: var(--dn-studio-portrait-height, 312px);
      object-fit: cover; object-position: center top; filter: contrast(1.04) brightness(1.02);
      mask-image: linear-gradient(to bottom, #000 82%, transparent);
    }
    .dn-route-hero__artwork--portrait.dn-route-hero__artwork--left { left: calc(var(--dn-studio-art-gutter, max(12px, calc((100% - 1840px) / 2))) + var(--dn-studio-portrait-inset, 0px)); }
    .dn-route-hero__artwork--portrait.dn-route-hero__artwork--right { right: calc(var(--dn-studio-art-gutter, max(12px, calc((100% - 1840px) / 2))) + var(--dn-studio-portrait-inset, 0px)); }
    .dn-route-hero__artwork.dn-route-hero__artwork--colored {
      filter: none; mix-blend-mode: normal;
      mask-image: linear-gradient(to right, transparent, #000 5%, #000 95%, transparent), linear-gradient(to bottom, transparent, #000 8%, #000 88%, transparent);
      mask-composite: intersect;
    }
  }
</style>
