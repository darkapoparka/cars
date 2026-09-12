<script lang="ts">
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
  <title>Guides — {brand.name}</title>
  <meta name="description" content={`Practical advice from ${brand.name} on choosing a vehicle, vehicle viewings, imports, buying options, trade-ins and the next steps in buying a vehicle.`} />
</svelte:head>

<BlogHero filters={data.filters} />

<section class="dn-blog-index" aria-labelledby="blog-results-title">
  <div class="container">
    <h2 class="dn-sr-only" id="blog-results-title">{data.posts.length} {data.posts.length === 1 ? 'article' : 'articles'}</h2>

    {#if data.posts.length}
      <div class="dn-blog-grid">
        {#each data.posts as post, index (post.id)}
          <BlogCard {post} returnTo={`${page.url.pathname}${page.url.search}#article-${post.id}`} priority={index < 3} />
        {/each}
      </div>
    {:else}
      <div class="dn-blog-empty">
        <p class="dn-kicker">No matches</p>
        <h2>Try another topic or search.</h2>
        <a href={resolve('/blog')}>Show all articles</a>
      </div>
    {/if}
  </div>
</section>
