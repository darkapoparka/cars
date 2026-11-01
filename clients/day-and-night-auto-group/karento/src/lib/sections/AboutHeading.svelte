<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import PageHero from "#lib/components/page-header/PageHero.svelte";
  import { pageHeroes, type PageHeroContent } from "#lib/data/page-headers.ts";
  import { dealer } from "#lib/content.ts";
  import { message } from "#lib/i18n/text.ts";
  const header: PageHeroContent = dealer.businessPreview
    ? {
        ...pageHeroes.about,
        title: message("header.about.dealerTitle"),
        description: {
          text: message("header.about.dealerDescription"),
          kind: "span",
        },
      }
    : pageHeroes.about;
</script>

<PageHero {header} />
