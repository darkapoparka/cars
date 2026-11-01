<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import PageHero from "#lib/components/page-header/PageHero.svelte";
  import { pageHeroes } from "#lib/data/page-headers.ts";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  let { open = $bindable(false) }: { open?: boolean } = $props();
</script>

<PageHero header={pageHeroes.contact}>
  {#snippet mobileControls()}
    <div class="mobile-contact-hero-tools">
      <MobilePill
        label={locale.t("header.contact.enquiry")}
        trailingIcon="arrow-up-right"
        popup="dialog"
        expanded={open}
        onclick={() => (open = true)}
      />
    </div>
  {/snippet}
</PageHero>
