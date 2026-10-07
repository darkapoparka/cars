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
        class="w-100 h-100 rounded-12 img-banner"
        src="/assets/imgs/page-header/banner4.png"
        alt="Carento"
      />
    </div>
    <div
      class="container position-absolute z-1 top-50 start-50 translate-middle karento-hero-copy"
    >
      <h2 class="text-white karento-hero-title" id="karento-page-title"
        >Contact Us</h2
      >
      <p class="karento-hero-description text-white"
        >Ask about a vehicle, arrange a viewing or talk with our team.</p
      >
      <a class="btn btn-white karento-hero-action" href="#contact-enquiry"
        >Send an enquiry <span aria-hidden="true">↗</span></a
      >
    </div>
  </div>
</div>
