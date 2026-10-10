<script lang="ts">
  import { blogPostTitle, blogPostSummary } from '$data/editorial';
  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

  import { resolve } from '$app/paths';
  import './detail.css';
  import Icon from '$components/ui/Icon.svelte';
  import RouteHeroArtwork from '$components/ui/RouteHeroArtwork.svelte';
  import ArticleSupport from '$components/editorial/ArticleSupport.svelte';
  import { brand } from '$config/brand';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{blogPostTitle(data.post, i18n.locale)} — {brand.name}</title>
  <meta name="description" content={blogPostSummary(data.post, i18n.locale)} />
</svelte:head>

<article class="dn-blog-detail">
    <header class="dn-blog-detail__hero">
      <div class="dn-blog-detail__hero-inner">
        <RouteHeroArtwork variant={data.post.category === 'Лизинг' || data.post.category === 'Бартер' ? 'keys' : data.post.category === 'Внос' ? 'cars' : 'guide'} />
        <a class="dn-blog-detail__back" href={i18n.href(data.returnTo)}>
          <Icon name="arrow-left" size={18} strokeWidth={1.9} />
          <span>{i18n.t("m_f3bf26bd805c")}</span>
        </a>

        <h1>{blogPostTitle(data.post, i18n.locale)}</h1>

        <ul class="dn-blog-detail__meta" aria-label={i18n.t("m_9e3b03dd5b8a")}>
          <li><Icon name="file-invoice" size={16} strokeWidth={1.9} />{i18n.text(data.post.category)}</li>
          {#if data.post.tag !== data.post.category}
            <li><Icon name="tag" size={16} strokeWidth={1.9} />{i18n.text(data.post.tag)}</li>
          {/if}
        </ul>

        <p class="dn-blog-detail__summary">{blogPostSummary(data.post, i18n.locale)}</p>

      </div>
    </header>

    <div class="dn-blog-detail__layout">
      <div class="dn-blog-detail__sheet">

        <section class="dn-blog-detail__copy" aria-label={i18n.t("m_1463022b8b21")}>
          <div class="dn-blog-detail__article-sections">
            {#each data.post.sections as section (section.title)}
              <section>
                <h2>{i18n.text(section.title)}</h2>
                {#each section.paragraphs as paragraph (paragraph)}
                  <p>{i18n.text(paragraph)}</p>
                {/each}
              </section>
            {/each}
          </div>
        </section>

        <div class="dn-blog-detail__tags">
          <span>{i18n.t("m_a5d7096a55b4")}</span>
          <a href={i18n.href(resolve(`/blog?category=${encodeURIComponent(data.post.category)}`))}>{i18n.text(data.post.category)}</a>
          {#if data.post.tag !== data.post.category}
            <a href={i18n.href(resolve(`/blog?q=${encodeURIComponent(data.post.tag)}`))}>{i18n.text(data.post.tag)}</a>
          {/if}
        </div>
      </div>

      <ArticleSupport related={data.related} />
    </div>
</article>
