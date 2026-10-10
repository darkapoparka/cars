<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import HeroBackdrop from "./HeroBackdrop.svelte";
  import HeaderBreadcrumbs from "./HeaderBreadcrumbs.svelte";
  import ArticleHeaderMeta from "./ArticleHeaderMeta.svelte";
  import type { PageHeroContent } from "#lib/data/page-headers.ts";
  import { MediaQuery } from "svelte/reactivity";
  import type { Snippet } from "svelte";
  import type { CatalogText } from "#lib/i18n/text.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import { dealer } from "#lib/content.ts";
  const locale = useLocale();
  let {
    header,
    mobileControls,
    titleOverride,
  }: {
    header: PageHeroContent;
    mobileControls?: Snippet;
    titleOverride?: CatalogText;
  } = $props();
  const phone = new MediaQuery("(max-width: 767.98px)");
  const title = $derived(
    titleOverride ??
      (dealer.businessPreview && header.variant === "source"
        ? dealer.name
        : header.title),
  );
  const article = $derived(dealer.businessPreview ? undefined : header.article);
  const description = $derived(
    phone.current
      ? (header.mobileDescription ?? header.description?.text)
      : header.description?.text,
  );
</script>

<div
  class={[
    "page-header pt-30 background-body karento-page-hero",
    header.variant === "source" && "karento-source-hero",
    header.variant === "article" && "karento-article-hero",
  ]}
  aria-labelledby="karento-page-title"
  ><div class="custom-container position-relative mx-auto"
    ><HeroBackdrop image={header.image} /><div
      class="container position-absolute z-1 top-50 start-50 translate-middle karento-hero-copy"
      >{#if header.category}<span
          class="btn btn-label-tag background-3 desktop-type-badge"
          >{locale.text(header.category)}</span
        >{" "}{/if}<h1
        class="text-white karento-hero-title desktop-hero-title"
        id="karento-page-title">{locale.text(title)}</h1
      >{#if header.description}{#if header.description.kind === "paragraph"}<p
            class="karento-hero-description text-white desktop-type-lead"
            >{locale.text(description ?? "")}</p
          >{:else}<span
            class="text-white text-xl-medium karento-hero-description desktop-type-lead"
            >{locale.text(description ?? "")}</span
          >{/if}{" "}{/if}{#if header.action && !(phone.current && mobileControls)}<a
          class="btn btn-white karento-hero-action desktop-type-control"
          href={locale.href(header.action.href)}
          >{locale.text(header.action.label)}{" "}<span aria-hidden="true"
            >↗</span
          ></a
        >{/if}{#if article}<ArticleHeaderMeta metadata={article} />{/if}</div
    >{#if phone.current && mobileControls}<div
        class="karento-mobile-hero-controls"
      >
        {@render mobileControls()}
      </div>{:else if header.breadcrumbs}<HeaderBreadcrumbs
        breadcrumbs={header.breadcrumbs}
      />{/if}</div
  ></div
>

<style>
  @media (min-width: 992px) {
    .page-header {
      width: 100%;
      max-width: 960px;
      margin-inline: auto;
      padding-inline: var(--karento-desktop-space-3);
    }
    .page-header .custom-container {
      max-width: none;
      padding-inline: 0;
      height: var(--karento-desktop-hero-height);
      min-height: var(--karento-desktop-hero-height);
    }
  }
  @media (min-width: 1200px) {
    .page-header {
      max-width: 1140px;
    }
  }
  @media (min-width: 1400px) {
    .page-header {
      max-width: 1248px;
    }
  }
</style>
