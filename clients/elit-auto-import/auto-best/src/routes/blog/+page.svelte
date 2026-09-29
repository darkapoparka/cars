<script lang="ts">
  import { getI18n } from '$lib/locale/context';

  const i18n = getI18n();

  import './blog.css';
  import { page } from '$app/state';
  import BlogCard from '$components/editorial/BlogCard.svelte';
  import BlogHero from '$components/editorial/BlogHero.svelte';
  import { resolve } from '$app/paths';
  import { brand } from '$config/brand';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{i18n.t("m_64f627bafdc8", { p0: brand.name })}</title>
  <meta name="description" content={i18n.t("m_ef4c8eadc6e9", { p0: brand.name })} />
</svelte:head>

<BlogHero filters={data.filters} />

<section class="dn-blog-index" aria-labelledby="blog-results-title">
  <div class="container">
    <h2 class="dn-sr-only" id="blog-results-title">{data.posts.length} {data.posts.length === 1 ? i18n.t("m_8445b821d762") : i18n.t("m_c8449ee1e564")}</h2>

    {#if data.posts.length}
      <div class="dn-blog-grid">
        {#each data.posts as post, index (post.id)}
          <BlogCard {post} returnTo={`${page.url.pathname}${page.url.search}#article-${post.id}`} priority={index < 3} />
        {/each}
      </div>
    {:else}
      <div class="dn-blog-empty">
        <p class="dn-kicker">{i18n.t("m_255ca3bfe9fc")}</p>
        <h2>{i18n.t("m_2a8ea875a859")}</h2>
        <a href={i18n.href(resolve('/blog'))}>{i18n.t("m_8d34b0287d81")}</a>
      </div>
    {/if}
  </div>
</section>
