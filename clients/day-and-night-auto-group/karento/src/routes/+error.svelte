<svelte:options runes={true} />

<script lang="ts">
  import ErrorPage from "#lib/pages/404.svelte";
  import { page } from "$app/state";
</script>

<ErrorPage status={page.status} />
