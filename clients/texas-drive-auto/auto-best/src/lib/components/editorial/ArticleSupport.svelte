<script lang="ts">
  import { resolve } from '$app/paths';
  import { brand } from '$config/brand';
  import type { BlogPost } from '$data/editorial';
  let { related }: { related: BlogPost[] } = $props();
  const phoneLinkAttributes = { href: brand.phoneHref } as const;
</script>
      <aside class="dn-blog-detail__sidebar" aria-label="More helpful information">


        <section class="dn-blog-widget dn-blog-widget--related">
          <h2>More resources</h2>
          <div class="dn-blog-widget__related-list">
            {#each related as post (post.id)}
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
          <h2>Have a specific question?</h2>
          <p>{brand.address}</p>
          <p>{brand.appointment}.</p>
          <a class="dn-blog-widget__primary" {...phoneLinkAttributes}>Call · {brand.phone}</a>
          <a class="dn-blog-widget__secondary" href={resolve('/contact')}>Contact</a>
        </section>

      </aside>
