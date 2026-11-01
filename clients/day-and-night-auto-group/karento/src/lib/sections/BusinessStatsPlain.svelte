<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import ReferenceStats from "#lib/components/ReferenceStats.svelte";
</script>

<section class="section-static-1 background-body">
  <div class="container">
    <div class="row">
      <div class="rounded-12 background-3 pt-30 pb-30">
        <div class="">
          <ReferenceStats />
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  @media (max-width: 767.98px) {
    .section-static-1 {
      display: none;
    }
  }
</style>
