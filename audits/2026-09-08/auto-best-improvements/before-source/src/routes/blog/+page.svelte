<script lang="ts">
  import './blog.css';
  import BlogCard from '$components/editorial/BlogCard.svelte';
  import BlogHero from '$components/editorial/BlogHero.svelte';
  import { resolve } from '$app/paths';
  import { brand } from '$config/brand';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Полезно — {brand.name}</title>
  <meta name="description" content={`Практични насоки от ${brand.name} за избор, оглед, внос, лизинг, бартер и следващи стъпки при покупка на автомобил.`} />
</svelte:head>

<BlogHero filters={data.filters} />

<section class="dn-blog-index" aria-labelledby="blog-results-title">
  <div class="container">
    <h2 class="dn-sr-only" id="blog-results-title">{data.posts.length} {data.posts.length === 1 ? 'статия' : 'статии'}</h2>

    {#if data.posts.length}
      <div class="dn-blog-grid">
        {#each data.posts as post, index (post.id)}
          <BlogCard {post} priority={index < 3} />
        {/each}
      </div>
    {:else}
      <div class="dn-blog-empty">
        <p class="dn-kicker">Няма съвпадения</p>
        <h2>Опитайте с друга тема или търсене.</h2>
        <a href={resolve('/blog')}>Покажете всички статии</a>
      </div>
    {/if}
  </div>
</section>
