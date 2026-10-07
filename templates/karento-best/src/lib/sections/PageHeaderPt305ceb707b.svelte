<svelte:options preserveWhitespace={true} />

<script lang="ts">
</script>

<div
  class="page-header pt-30 background-body karento-page-hero"
  aria-labelledby="karento-page-title"
>
  <div class="custom-container position-relative mx-auto">
    <div class="bg-overlay rounded-12 overflow-hidden">
      <img
        class="w-100 h-100 img-banner"
        src="/assets/imgs/page-header/banner7.png"
        alt="Carento"
      />
    </div>
    <div
      class="container position-absolute z-1 top-50 start-50 translate-middle karento-hero-copy"
    >
      <h2 class="text-white karento-hero-title" id="karento-page-title"
        >Import Sources</h2
      >
      <span class="text-white text-xl-medium karento-hero-description"
        >Explore brands, source markets and vehicle options</span
      >
    </div>
    <div
      class="background-body position-absolute z-1 top-100 start-50 translate-middle px-3 py-2 rounded-12 border d-flex gap-3 d-none"
    >
      <a href="/" class="neutral-700 text-md-medium" aria-label="Home">Home</a>
      <span>
        <img src="/assets/imgs/template/icons/arrow-right.svg" alt="Carento" />
      </span>
      <a href="#!" class="neutral-1000 text-md-bold" aria-label="View details"
      ></a>
    </div>
  </div>
</div>
