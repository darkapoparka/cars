<script lang="ts">
  import { resolve } from '$app/paths';
  import { brand } from '$config/brand';
  import Icon from '$components/ui/Icon.svelte';
</script>

<section class="dn-about-hero dn-route-hero dn-route-hero--studio dn-route-hero--charcoal" aria-labelledby="about-title">
  <picture>
  <source media="(min-width: 992px)" srcset="/assets/images/lead/day-night-about-detail-v1.webp" />
  <img
    class="dn-about-hero__media"
    src="/assets/images/section/bg-12.jpg"
    alt=""
    width="1920"
    height="880"
    fetchpriority="high"
    decoding="async"
  />
  </picture>
  <div class="dn-about-hero__overlay" aria-hidden="true"></div>
  <div class="container dn-about-hero__content dn-route-hero__layout">
    <div class="dn-about-hero__copy dn-route-hero__copy">
      <h1 id="about-title">За нас</h1>
      <p class="dn-about-hero__lead">Автомобили в {brand.city} · Внос · Собствен лизинг</p>
    </div>
    <a class="dn-about-button dn-about-button--primary dn-route-hero__control" href={resolve('/listing-grid')}>
      <span>Вижте автомобилите</span>
      <Icon name="arrow-right" size={18} strokeWidth={1.8} />
    </a>
  </div>
</section>
