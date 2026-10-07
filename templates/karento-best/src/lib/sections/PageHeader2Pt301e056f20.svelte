<svelte:options preserveWhitespace={true} />

<script lang="ts">
</script>

<div class="page-header-2 pt-30 background-body">
  <div class="custom-container position-relative mx-auto">
    <div class="bg-overlay rounded-12 overflow-hidden">
      <img
        class="w-100 h-100 img-fluid img-banner"
        src="/assets/imgs/page-header/banner6.png"
        alt="Carento"
      />
    </div>
    <div
      class="container position-absolute z-1 top-50 start-50 pb-70 translate-middle text-center"
    >
      <span class="text-sm-bold bg-2 px-4 py-3 rounded-12"
        >Find cars for sale and for rent near you</span
      >
      <h2 class="text-white mt-4">Uncover Your Dream Ride</h2>
      <span class="text-white text-lg-medium"
        >Search and find your best car rental with easy way</span
      >
    </div>
    <div
      class="background-body position-absolute z-1 top-100 start-50 translate-middle px-3 py-2 rounded-12 border d-flex gap-3 d-none d-none d-md-flex"
    >
      <a href="/" class="neutral-700 text-md-medium" aria-label="Home">Home</a>
      <span class="@@ds-prev-page">
        <img src="/assets/imgs/template/icons/arrow-right.svg" alt="Carento" />
      </span>
      <a href="/" class="neutral-1000 text-md-bold" aria-label="Explore"
        >Explore</a
      >
      <span>
        <img src="/assets/imgs/template/icons/arrow-right.svg" alt="Carento" />
      </span>
      <a
        href="/"
        class="neutral-1000 text-md-bold text-nowrap"
        aria-label="Explore">Explore</a
      >
    </div>
  </div>
</div>
