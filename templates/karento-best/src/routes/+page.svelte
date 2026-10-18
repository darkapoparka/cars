<script lang="ts">
  import MarketplaceHome from "#lib/pages/marketplace-home.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<MarketplaceHome phoneHint={data.phoneHint} />
