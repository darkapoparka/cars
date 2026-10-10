<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import WishlistHeading from "#lib/sections/WishlistHeading.svelte";
  import MemberWishlistDashboard from "#lib/sections/MemberWishlistDashboard.svelte";
  import Footer from "#lib/components/Footer.svelte";
</script>

<PageMetadata title={locale.t("ui.user-dashboard-wishlist.my-wishlist")} />
<main class="main"
  ><WishlistHeading />
  <MemberWishlistDashboard />
  <Footer /></main
>
