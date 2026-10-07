<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { dealer } from "#lib/content.ts";
</script>

<div class="karento-home-brands background-100" data-brand-source="index">
  <div class="container">
    <div class="box-search-category"
      ><div class="karento-brands-heading">
        <h3 class="heading-3 neutral-1000">Popular Brands</h3>
        <p class="text-lg-medium neutral-500"
          >{dealer.copy["home.brandsIntro"] ??
            "Explore a range of leading car manufacturers."}</p
        >
        <a
          href="/vehicles"
          class="text-sm-bold neutral-1000"
          aria-label="View all vehicles"
          >View all vehicles <span aria-hidden="true">↗</span></a
        >
      </div>
      <ul class="karento-brands-grid" aria-label="Sample car brands">
        <li class="karento-brand-logo"
          ><img
            src="/assets/imgs/page/homepage2/lexus.png"
            alt="Lexus"
            loading="lazy"
            decoding="async"
          /></li
        ><li class="karento-brand-logo"
          ><img
            src="/assets/imgs/page/homepage2/mer.png"
            alt="Mercedes-Benz"
            loading="lazy"
            decoding="async"
          /></li
        ><li class="karento-brand-logo"
          ><img
            src="/assets/imgs/page/homepage2/bugatti.png"
            alt="Bugatti"
            loading="lazy"
            decoding="async"
          /></li
        ><li class="karento-brand-logo"
          ><img
            src="/assets/imgs/page/homepage2/jaguar.png"
            alt="Jaguar"
            loading="lazy"
            decoding="async"
          /></li
        ><li class="karento-brand-logo"
          ><img
            src="/assets/imgs/page/homepage2/honda.png"
            alt="Honda"
            loading="lazy"
            decoding="async"
          /></li
        ><li class="karento-brand-logo"
          ><img
            src="/assets/imgs/page/homepage2/chevrolet.png"
            alt="Chevrolet"
            loading="lazy"
            decoding="async"
          /></li
        ><li class="karento-brand-logo"
          ><img
            src="/assets/imgs/page/homepage2/acura.png"
            alt="Acura"
            loading="lazy"
            decoding="async"
          /></li
        ><li class="karento-brand-logo"
          ><img
            src="/assets/imgs/page/homepage2/bmw.png"
            alt="BMW"
            loading="lazy"
            decoding="async"
          /></li
        ><li class="karento-brand-logo"
          ><img
            src="/assets/imgs/page/homepage2/toyota.png"
            alt="Toyota"
            loading="lazy"
            decoding="async"
          /></li
        >
      </ul></div
    >
  </div>
</div>
