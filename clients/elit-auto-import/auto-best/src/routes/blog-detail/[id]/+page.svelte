<script lang="ts">
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
  <title>{data.post.title} — {brand.name}</title>
  <meta name="description" content={data.post.text} />
</svelte:head>

<article class="dn-blog-detail">
    <header class="dn-blog-detail__hero">
      <div class="dn-blog-detail__hero-inner">
        <RouteHeroArtwork variant={data.post.category === 'Лизинг' || data.post.category === 'Бартер' ? 'keys' : data.post.category === 'Внос' ? 'cars' : 'guide'} />
        <a class="dn-blog-detail__back" href={data.returnTo}>
          <Icon name="arrow-left" size={18} strokeWidth={1.9} />
          <span>Назад към статиите</span>
        </a>

        <h1>{data.post.title}</h1>

        <ul class="dn-blog-detail__meta" aria-label="Категория и тема">
          <li><Icon name="file-invoice" size={16} strokeWidth={1.9} />{data.post.category}</li>
          {#if data.post.tag !== data.post.category}
            <li><Icon name="tag" size={16} strokeWidth={1.9} />{data.post.tag}</li>
          {/if}
        </ul>

        <p class="dn-blog-detail__summary">{data.post.text}</p>

      </div>
    </header>

    <div class="dn-blog-detail__layout">
      <div class="dn-blog-detail__sheet">

        <section class="dn-blog-detail__copy" aria-label="Съдържание на статията">
          <div class="dn-blog-detail__article-sections">
            {#each data.post.sections as section (section.title)}
              <section>
                <h2>{section.title}</h2>
                {#each section.paragraphs as paragraph (paragraph)}
                  <p>{paragraph}</p>
                {/each}
              </section>
            {/each}
          </div>
        </section>

        <div class="dn-blog-detail__tags">
          <span>Теми:</span>
          <a href={resolve(`/blog?category=${encodeURIComponent(data.post.category)}`)}>{data.post.category}</a>
          {#if data.post.tag !== data.post.category}
            <a href={resolve(`/blog?q=${encodeURIComponent(data.post.tag)}`)}>{data.post.tag}</a>
          {/if}
        </div>
      </div>

      <ArticleSupport related={data.related} />
    </div>
</article>
