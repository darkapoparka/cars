<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import DiscoveryBanner from "#lib/components/page-header/DiscoveryBanner.svelte";
  import { discoveryBanners } from "#lib/data/page-headers.ts";
</script>

<DiscoveryBanner header={discoveryBanners.vehicleFinder} desktopPrimary />
