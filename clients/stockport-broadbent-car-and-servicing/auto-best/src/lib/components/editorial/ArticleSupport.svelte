<script lang="ts">
  import { blogPostTitle } from '$data/editorial';
  import { getI18n } from '$lib/locale/context';
  import MobileActionIcon from '$components/layout/MobileActionIcon.svelte';

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
          <a class="dn-blog-widget__primary" {...phoneLinkAttributes} aria-label={i18n.t("m_fef151a35b62", { p0: brand.phone })}>
            <span class="dn-blog-call-desktop">{i18n.t("m_fef151a35b62", { p0: brand.phone })}</span>
            <span class="dn-blog-call-mobile" aria-hidden="true"><MobileActionIcon name="phone" size={22} />{brand.phone}</span>
          </a>
          <a class="dn-blog-widget__secondary" href={i18n.href(resolve('/contact'))}>{i18n.t("m_2b5c3d26721a")}</a>
        </section>

      </aside>

<style>
  .dn-blog-call-mobile { display: none; }
  @media (max-width: 767px) {
    .dn-blog-call-desktop { display: none; }
    .dn-blog-call-mobile { display: inline-flex; align-items: center; justify-content: center; gap: var(--dn-space-2); white-space: nowrap; }
    .dn-blog-widget__primary, .dn-blog-widget__secondary { min-height: var(--dn-control-height-entry-mobile); font: var(--dn-control-font); white-space: nowrap; }
  }
</style>
