<script lang="ts">
  let { variant = 'cars', theme = 'light' }: { variant?: 'cars' | 'keys' | 'guide' | 'about' | 'contact' | 'sell'; theme?: 'light' | 'red' | 'charcoal' | 'yellow' } = $props();
  const images = {
    cars: '/media/stock/11768394188936705-card.webp',
    keys: '/media/stock/11709149044159957-card.webp',
    guide: '/media/stock/11780736224961272-card.webp',
    silver: '/media/stock/11768394188936705-card.webp',
    graphite: '/media/stock/11768394188936705-card.webp',
    portrait: '/media/stock/21724767264834325-card.webp',
    phone: '/media/stock/21724767264834325-card.webp',
    showroom: '/media/stock/21724767264834325-card.webp',
    email: '/media/stock/21724767264834325-card.webp'
  };
  const pairs = {
    cars: ['silver', 'graphite'],
    keys: ['cars', 'keys'],
    guide: ['guide', 'keys'],
    about: ['showroom', 'portrait'],
    contact: ['phone', 'email'],
    sell: ['portrait', 'keys']
  } as const;
  const coloredImages: Partial<Record<keyof typeof images, string>> = {
    silver: '/media/stock/11768394188936705-card.webp',
    graphite: '/media/stock/11768394188936705-card.webp',
    showroom: '/media/stock/21724767264834325-card.webp',
    portrait: '/media/stock/21724767264834325-card.webp',
    guide: '/media/stock/11780736224961272-card.webp',
    keys: '/media/stock/11709149044159957-card.webp',
    phone: '/media/stock/21724767264834325-card.webp',
    email: '/media/stock/21724767264834325-card.webp'
  };
</script>

{#each pairs[variant] as asset, index (asset)}
  <img
    class="dn-route-hero__artwork"
    class:dn-route-hero__artwork--left={index === 0}
    class:dn-route-hero__artwork--right={index === 1}
    class:dn-route-hero__artwork--portrait={asset === 'portrait' || asset === 'phone'}
    class:dn-route-hero__artwork--phone={asset === 'phone'}
    class:dn-route-hero__artwork--colored={theme !== 'light'}
    src={theme === 'light' ? images[asset] : coloredImages[asset] ?? images[asset]}
    alt=""
    width="900"
    height={asset === 'portrait' || asset === 'phone' ? 1350 : 600}
    decoding="async"
  />
{/each}

<style>
  .dn-route-hero__artwork { display: none; }
  @media (min-width: 992px) {
    .dn-route-hero__artwork {
      position: absolute;
      display: block;
      top: var(--dn-studio-art-top, 184px);
      width: var(--dn-studio-art-width, clamp(200px, 23vw, 380px));
      height: var(--dn-studio-art-height, 272px);
      object-fit: contain;
      object-position: center;
      filter: contrast(1.12) brightness(1.03);
      mix-blend-mode: multiply;
      pointer-events: none;
    }
    .dn-route-hero__artwork--left { left: var(--dn-studio-art-gutter, max(12px, calc((100% - 1840px) / 2))); }
    .dn-route-hero__artwork--right { right: var(--dn-studio-art-gutter, max(12px, calc((100% - 1840px) / 2))); }
    .dn-route-hero__artwork.dn-route-hero__artwork--portrait {
      width: var(--dn-studio-portrait-width, clamp(200px, 23vw, 380px));
      height: var(--dn-studio-portrait-height, 312px);
      object-fit: cover;
      object-position: center top;
      filter: contrast(1.04) brightness(1.02);
      mask-image: linear-gradient(to bottom, #000 82%, transparent);
    }
    .dn-route-hero__artwork--portrait.dn-route-hero__artwork--left { left: calc(var(--dn-studio-art-gutter, max(12px, calc((100% - 1840px) / 2))) + var(--dn-studio-portrait-inset, 0px)); }
    .dn-route-hero__artwork--portrait.dn-route-hero__artwork--right { right: calc(var(--dn-studio-art-gutter, max(12px, calc((100% - 1840px) / 2))) + var(--dn-studio-portrait-inset, 0px)); }
    .dn-route-hero__artwork--phone { transform: scaleX(-1); }
    .dn-route-hero__artwork.dn-route-hero__artwork--colored {
      filter: none;
      mix-blend-mode: normal;
      mask-image: linear-gradient(to right, transparent, #000 5%, #000 95%, transparent), linear-gradient(to bottom, transparent, #000 8%, #000 88%, transparent);
      mask-composite: intersect;
    }
  }
</style>
