<script lang="ts">
  import { resolve } from '$app/paths';
  import HeroVehicles from '$components/ui/HeroVehicles.svelte';
  import { blogCategories, blogFilterHref, type BlogFilters } from '$data/editorial';

  let { filters }: { filters: BlogFilters } = $props();
</script>

<section class="dn-blog-hero dn-route-hero dn-route-hero--studio dn-route-hero--yellow" aria-labelledby="blog-title">
  <HeroVehicles pair="blog" />
  <img
    class="dn-blog-hero__media"
    src="/stock/127361904-1.webp"
    alt=""
    width="1920"
    height="1080"
    fetchpriority="high"
    decoding="async"
  />
  <div class="dn-blog-hero__overlay" aria-hidden="true"></div>
  <div class="container dn-blog-hero__inner dn-route-hero__layout">
    <div class="dn-blog-hero__copy dn-route-hero__copy">
      <h1 id="blog-title">Resources</h1>
      <p class="dn-blog-hero__lead">Tips for choosing, inspecting, and buying a vehicle</p>
    </div>

    <div class="dn-blog-toolbar dn-route-hero__control" aria-label="Article filters">
      <form class="dn-blog-search" method="GET" action={resolve('/blog')}>
        <label class="dn-sr-only" for="dn-blog-search">Search articles</label>
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7"></circle>
          <path d="m16 16 4 4"></path>
        </svg>
        <input id="dn-blog-search" type="search" name="q" value={filters.q} placeholder="Search articles" />
        {#if filters.category}<input type="hidden" name="category" value={filters.category} />{/if}
      </form>

      <nav class="dn-blog-categories" aria-label="Categories">
        <a href={resolve(blogFilterHref(filters, '') as '/blog')} class:active={!filters.category} aria-current={!filters.category ? 'page' : undefined}>All</a>
        {#each blogCategories as category (category)}
          <a
            href={resolve(blogFilterHref(filters, category) as '/blog')}
            class:active={filters.category === category}
            aria-current={filters.category === category ? 'page' : undefined}
          >{category}</a>
        {/each}
      </nav>
    </div>
  </div>
</section>
