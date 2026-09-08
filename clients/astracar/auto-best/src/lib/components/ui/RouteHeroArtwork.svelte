<script lang="ts">
  let { variant = 'cars', theme = 'light' }: { variant?: 'cars' | 'keys' | 'guide' | 'about' | 'contact' | 'sell'; theme?: 'light' | 'red' | 'charcoal' | 'yellow' } = $props();
  const images = {
    cars: '/assets/images/lead/day-night-studio-cars-v1.webp',
    keys: '/assets/images/lead/day-night-studio-keys-v1.webp',
    guide: '/assets/images/lead/day-night-studio-guide-v1.webp',
    silver: '/assets/images/lead/day-night-hero-silver-v1.webp',
    graphite: '/assets/images/lead/day-night-hero-graphite-v1.webp',
    portrait: '/assets/images/lead/day-night-about-kristian-v1-light.webp',
    phone: '/assets/images/lead/day-night-contact-kristian-phone-v1-light.webp',
    showroom: '/assets/images/lead/day-night-about-showroom-v1-light.webp',
    email: '/assets/images/lead/day-night-contact-email-v1-light.webp'
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
    silver: '/assets/images/lead/day-night-silver-color-v1.webp',
    graphite: '/assets/images/lead/day-night-graphite-color-v1.webp',
    showroom: '/assets/images/lead/day-night-showroom-color-v1.webp',
    portrait: '/assets/images/lead/day-night-portrait-color-v1.webp',
    guide: '/assets/astracar/vehicle-01-1.webp',
    keys: '/assets/images/lead/day-night-keys-yellow-v1.webp',
    phone: '/assets/images/lead/day-night-contact-phone-red-v1.webp',
    email: '/assets/images/lead/day-night-contact-email-red-v1.webp'
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
