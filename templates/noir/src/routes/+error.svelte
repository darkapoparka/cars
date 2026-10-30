<script lang="ts">
  import { page } from "$app/state";
  import { paths, currentLocale, t } from "#lib/i18n/index.ts";

  const m = $derived(t());
</script>

<svelte:head><title>{page.status}</title></svelte:head>

<section class="container error">
  <p class="label">{page.status}</p>
  <h1 class="display">{m.notFound.title}</h1>
  <a class="button" href={paths.home(currentLocale())}>{m.notFound.back}</a>
</section>

<style>
  .error {
    display: grid;
    justify-items: start;
    gap: 1.5rem;
    min-height: 70vh;
    align-content: center;
    padding-top: var(--header);
  }

  h1 {
    font-size: var(--step-4);
  }
</style>
