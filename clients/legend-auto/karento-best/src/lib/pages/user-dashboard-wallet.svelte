<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import WalletHeading from "#lib/sections/WalletHeading.svelte";
  import MemberWalletDashboard from "#lib/sections/MemberWalletDashboard.svelte";
  import Footer from "#lib/components/Footer.svelte";
</script>

<PageMetadata title={locale.t("ui.user-dashboard-wallet.my-wallet")} />
<main class="main"
  ><WalletHeading />
  <MemberWalletDashboard />
  <Footer /></main
>
