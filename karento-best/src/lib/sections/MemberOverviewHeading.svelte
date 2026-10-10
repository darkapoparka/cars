<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import AccountHeading from "#lib/components/page-header/AccountHeading.svelte";
  import { accountHeadingTitles } from "#lib/data/page-headers.ts";
</script>

<AccountHeading title={accountHeadingTitles.userDashboard} />
