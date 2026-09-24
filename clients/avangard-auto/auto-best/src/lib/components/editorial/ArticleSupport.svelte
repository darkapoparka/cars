<script lang="ts">
  import { blogPostTitle } from '$data/editorial';
  import { getI18n } from '$lib/locale/context';

  const i18n = getI18n();

  import { resolve } from '$app/paths';
  import { brand } from '$config/brand';
  import type { BlogPost } from '$data/editorial';
  let { related }: { related: BlogPost[] } = $props();
  const phoneLinkAttributes = { href: brand.phoneHref } as const;
</script>
      <aside class="dn-blog-detail__sidebar" aria-label={i18n.t("m_21c7c5503a59")}>


        <section class="dn-blog-widget dn-blog-widget--related">
          <h2>{i18n.t("m_59c130d97440")}</h2>
          <div class="dn-blog-widget__related-list">
            {#each related as post (post.id)}
              <a href={i18n.href(resolve('/blog-detail/[id]', { id: String(post.id) }))}>
                <img src={post.image} alt="" width="176" height="132" loading="lazy" decoding="async" />
                <span>
                  <small>{i18n.text(post.category)}</small>
                  <strong>{blogPostTitle(post, i18n.locale)}</strong>
                </span>
              </a>
            {/each}
          </div>
        </section>

        <section class="dn-blog-widget dn-blog-widget--contact">
          <p class="dn-blog-widget__brand">{brand.name}</p>
          <h2>{i18n.t("m_54ae9e3a1eb0")}</h2>
          <p>{i18n.dealer('address')}</p>
          <p>{i18n.dealer('appointment')}.</p>
          <a class="dn-blog-widget__primary" {...phoneLinkAttributes}>{i18n.t("m_fef151a35b62", { p0: brand.phone })}</a>
          <a class="dn-blog-widget__secondary" href={i18n.href(resolve('/contact'))}>{i18n.t("m_2b5c3d26721a")}</a>
        </section>

      </aside>
