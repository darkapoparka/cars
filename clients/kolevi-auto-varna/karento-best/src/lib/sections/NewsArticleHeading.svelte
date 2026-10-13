<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import PageHero from "#lib/components/page-header/PageHero.svelte";
  import { pageHeroes, type PageHeroContent } from "#lib/data/page-headers.ts";
  import type { NewsArticleContent } from "#lib/data/news.ts";
  import { message } from "#lib/i18n/text.ts";

  let {
    article,
    missing = false,
  }: { article?: NewsArticleContent; missing?: boolean } = $props();
  const title = $derived(
    article?.title ??
      (missing
        ? message("editorial.article.notFoundTitle")
        : pageHeroes.article.title),
  );
  const header = $derived<PageHeroContent>(
    article || missing
      ? {
          ...pageHeroes.article,
          title,
          image: article
            ? {
                ...pageHeroes.article.image,
                src: article.image,
                alt: article.imageAlt ?? message("image.illustrative"),
              }
            : pageHeroes.article.image,
          category: article?.categoryLabel,
          article: undefined,
          breadcrumbs: {
            ...pageHeroes.article.breadcrumbs,
            items: pageHeroes.article.breadcrumbs.items.map((item) =>
              item.id === "current"
                ? { ...item, label: title, accessibleLabel: title }
                : item,
            ),
          },
        }
      : pageHeroes.article,
  );
</script>

<PageHero {header} titleOverride={title} />
