<script lang="ts">
  import { getI18n } from '$lib/locale/context';

  const i18n = getI18n();

  import HeroVehicles from '$components/ui/HeroVehicles.svelte';
  let { count }: { count: number } = $props();
</script>

<section class="dn-listing-hero dn-route-hero dn-route-hero--studio" aria-labelledby="listing-title">
  <HeroVehicles pair="inventory" />
  <div class="dn-listing-hero__media" aria-hidden="true"></div>
  <div class="dn-listing-hero__overlay" aria-hidden="true"></div>
  <div class="container dn-listing-hero__content dn-route-hero__layout">
    <div class="dn-listing-hero__copy dn-route-hero__copy">
      <h1 id="listing-title">{i18n.t("m_bb7c0e3ca487")}</h1>
      <p>{i18n.t("m_af99c6f42480", { p0: count, p1: count === 1 ? i18n.t("m_2b2961a431b2") : i18n.t("m_1f58b1e965af") })}</p>
    </div>
  </div>
</section>
