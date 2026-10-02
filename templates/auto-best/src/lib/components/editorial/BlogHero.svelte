<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

  import { resolve } from '$app/paths';
  import DesktopHeroScene from '$components/ui/DesktopHeroScene.svelte';
  import Icon from '$components/ui/Icon.svelte';
  import MobileActionIcon from '$components/layout/MobileActionIcon.svelte';
  import EntryCard from '$components/ui/entry/EntryCard.svelte';
  import { leadSite } from '$config/lead-site';
  import { imageSrcset } from '$data/responsive-images';
  import { blogCategories, blogFilterHref, type BlogFilters } from '$data/editorial';

  let { filters }: { filters: BlogFilters } = $props();
</script>

<section class="dn-blog-hero dn-route-hero dn-route-hero--studio dn-route-hero--campaign" aria-label={i18n.t('m_572cd72feb9a')}>
  <DesktopHeroScene scene="blog" />
  <picture class="dn-blog-hero__artwork" aria-hidden="true">
    <source media="(max-width: 991px)" srcset={imageSrcset(leadSite.artwork.blogHero) ?? leadSite.artwork.blogHero} sizes="(max-width: 383px) calc(100vw - 24px), 360px" />
    <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" width="960" height="257" fetchpriority="high" decoding="async" />
  </picture>
  <div class="container dn-blog-hero__inner dn-route-hero__layout">
    <div class="dn-blog-hero__copy dn-route-hero__copy">
      <h1 id="blog-title">{i18n.t("m_572cd72feb9a")}</h1>
      <p class="dn-blog-hero__lead">{i18n.t("m_1ac208d5fa85")}</p>
    </div>

  </div>
</section>

<div class="dn-blog-controls">
    <div class="dn-blog-toolbar" aria-label={i18n.t("m_52a2403e77ab")}>
      <EntryCard class="dn-blog-search-card" title={i18n.t('m_572cd72feb9a')} titleTag="h1" titleId="blog-entry-title">
        <form class="dn-blog-search" role="search" aria-label={i18n.t("m_2de9b4285a63")} method="GET" action={i18n.href(resolve('/blog'))}>
          <label class="dn-sr-only" for="dn-blog-search">{i18n.t("m_2de9b4285a63")}</label>
          <span class="dn-blog-search__icon dn-blog-search__icon--desktop"><Icon name="search" size={20} strokeWidth={1.7} /></span>
          <span class="dn-blog-search__icon dn-blog-search__icon--mobile"><MobileActionIcon name="search" size={18} /></span>
          <input {@attach i18n.validation} id="dn-blog-search" type="search" name="q" value={filters.q} placeholder={i18n.t("m_2de9b4285a63")} />
          {#if filters.category}<input type="hidden" name="category" value={filters.category} />{/if}
          <button class="dn-blog-search__submit dn-icon-button" type="submit" aria-label={i18n.t("m_2de9b4285a63")}>
            <span class="dn-blog-search__submit-icon--desktop"><Icon name="search" size={20} /></span>
            <span class="dn-blog-search__submit-icon--mobile"><MobileActionIcon name="arrow" size={16} /></span>
          </button>
        </form>
      </EntryCard>

      <nav class="dn-blog-categories" aria-label={i18n.t("m_05f6c615a351")}>
        <a href={i18n.href(resolve(blogFilterHref(filters, '') as '/blog'))} class:active={!filters.category} aria-current={!filters.category ? 'page' : undefined}>{i18n.t("m_a52ace420f21")}</a>
        {#each blogCategories as category (category)}
          <a
            href={i18n.href(resolve(blogFilterHref(filters, category) as '/blog'))}
            class:active={filters.category === category}
            aria-current={filters.category === category ? 'page' : undefined}
          >{i18n.text(category)}</a>
        {/each}
      </nav>
    </div>
</div>
