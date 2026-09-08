<script lang="ts">
  import { resolve } from '$app/paths';
  import './detail.css';
  import Icon from '$components/ui/Icon.svelte';
  import RouteHeroArtwork from '$components/ui/RouteHeroArtwork.svelte';
  import { brand } from '$config/brand';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const phoneLinkAttributes = { href: brand.phoneHref } as const;
</script>

<svelte:head>
  <title>{data.post.title} — {brand.name}</title>
  <meta name="description" content={data.post.text} />
</svelte:head>

<article class="dn-blog-detail">
    <header class="dn-blog-detail__hero">
      <div class="dn-blog-detail__hero-inner">
        <RouteHeroArtwork variant={data.post.category === 'Лизинг' || data.post.category === 'Бартер' ? 'keys' : data.post.category === 'Внос' ? 'cars' : 'guide'} />
        <a class="dn-blog-detail__back" href={resolve('/blog')}>
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

      <aside class="dn-blog-detail__sidebar" aria-label="Още полезна информация">
        <section class="dn-blog-widget dn-blog-widget--search">
          <h2>Търсене в Полезно</h2>
          <form action={resolve('/blog')} method="get">
            <label class="dn-sr-only" for="detail-blog-search">Търсете статия</label>
            <Icon name="search" size={19} strokeWidth={1.8} />
            <input id="detail-blog-search" name="q" type="search" placeholder="Търсете статия" />
          </form>
        </section>

        <section class="dn-blog-widget dn-blog-widget--categories">
          <h2>Категории</h2>
          <ul>
            {#each data.categories as item (item.category)}
              <li>
                <a href={resolve(`/blog?category=${encodeURIComponent(item.category)}`)}>
                  <span>{item.category}</span>
                  <span>({item.count})</span>
                </a>
              </li>
            {/each}
          </ul>
        </section>

        <section class="dn-blog-widget dn-blog-widget--related">
          <h2>Още полезно</h2>
          <div class="dn-blog-widget__related-list">
            {#each data.related as post (post.id)}
              <a href={resolve('/blog-detail/[id]', { id: String(post.id) })}>
                <img src={post.image} alt="" width="176" height="132" loading="lazy" decoding="async" />
                <span>
                  <small>{post.category}</small>
                  <strong>{post.title}</strong>
                </span>
              </a>
            {/each}
          </div>
        </section>

        <section class="dn-blog-widget dn-blog-widget--contact">
          <p class="dn-blog-widget__brand">{brand.name}</p>
          <h2>Имате конкретен въпрос?</h2>
          <p>{brand.address}</p>
          <p>{brand.appointment}.</p>
          <a class="dn-blog-widget__primary" {...phoneLinkAttributes}>Обадете се · {brand.phone}</a>
          <a class="dn-blog-widget__secondary" href={resolve('/contact')}>Контакти</a>
        </section>

        <section class="dn-blog-widget dn-blog-widget--tags">
          <h2>Популярни теми</h2>
          <div>
            {#each data.tags as tag (tag)}
              <a href={resolve(`/blog?q=${encodeURIComponent(tag)}`)}>{tag}</a>
            {/each}
          </div>
        </section>
      </aside>
    </div>
</article>
