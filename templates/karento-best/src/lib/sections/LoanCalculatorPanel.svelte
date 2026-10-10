<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import LoanCard from "#lib/components/finance/LoanCard.svelte";
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

<section class="box-cta-7 background-body">
  <div class="container position-relative z-1">
    <div class="bg-shape"></div>
    {#if desktop.current}
      <div class="karento-loan-artwork" aria-hidden="true">
        <img
          src="/assets/imgs/finance/urus-cutout-1280.webp"
          srcset="/assets/imgs/finance/urus-cutout-768.webp 768w, /assets/imgs/finance/urus-cutout-1280.webp 1280w"
          sizes="(min-width: 1400px) 600px, (min-width: 1200px) 546px, 456px"
          width="1280"
          height="853"
          loading="lazy"
          decoding="async"
          alt=""
        />
      </div>
    {/if}
    <div class="row position-relative z-1">
      <div class="col-lg-6 p-md-5 p-4">
        <LoanCard
          fieldIdPrefix="field-d472647c"
          class="background-card p-md-5 p-4 rounded-3 my-3"
          summaryClass="row pt-3 pb-4"
        />
      </div>
    </div>
  </div>
</section>

<style>
  @media (min-width: 992px) {
    .box-cta-7 .bg-shape {
      background: var(--bs-neutral-100);
    }

    .karento-loan-artwork {
      position: absolute;
      inset: 0 24px 0 auto;
      z-index: 1;
      display: flex;
      align-items: center;
      width: calc(50% - 24px);
      pointer-events: none;
    }

    .karento-loan-artwork img {
      display: block;
      width: 100%;
      height: auto;
    }
  }
</style>
