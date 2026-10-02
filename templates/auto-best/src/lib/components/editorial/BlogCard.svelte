<script lang="ts">
  import { imageSrcset } from '$data/responsive-images';
  import { blogPostTitle, blogPostSummary } from '$data/editorial';
  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

  import { withListReturn } from '$data/journeys';
  import { resolve } from '$app/paths';
  import Icon from '$components/ui/Icon.svelte';
  import MobileActionIcon from '$components/layout/MobileActionIcon.svelte';
  import type { BlogPost } from '$data/editorial';

  let { post, returnTo, priority = false, imageSizes = '33vw', idPrefix = 'article', onselect }: { post: BlogPost; returnTo?: string; priority?: boolean; imageSizes?: string; idPrefix?: string; onselect?: (event: MouseEvent) => void } = $props();
</script>

<article id={`${idPrefix}-${post.id}`} class="dn-blog-card">
  <a class="dn-blog-card__link" href={i18n.href(withListReturn(resolve('/blog-detail/[id]', { id: String(post.id) }), returnTo))} aria-label={blogPostTitle(post, i18n.locale)} onclick={onselect}>
    <picture class="dn-blog-card__media">
      <source media="(min-width: 992px)" srcset={imageSrcset(post.image) ?? post.image} sizes={imageSizes} />
      <img
        src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
        alt=""
        width="820"
        height="540"
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
    </picture>
    <span class="dn-blog-card__body">
      <span class="dn-blog-card__meta">
        <span class="dn-blog-card__category">{i18n.text(post.category)}</span>
        <span class="dn-blog-card__mobile-arrow"><MobileActionIcon name="arrow" size={18} /></span>
      </span>
      <h2>{blogPostTitle(post, i18n.locale)}</h2>
      <span class="dn-blog-card__text">{blogPostSummary(post, i18n.locale)}</span>
      <span class="dn-blog-card__action">
        {i18n.t('action.readArticle')}
        <Icon name="arrow-right" size={16} />
      </span>
    </span>
  </a>
</article>

<style>
  .dn-blog-card {
    container-type: inline-size;
    min-width: 0;
    height: 100%;
    overflow: hidden;
    border: 1px solid #e1e4e9;
    border-radius: 16px;
    background: #fff;
    transition: box-shadow 160ms ease, border-color 160ms ease;
  }

  .dn-blog-card:focus-within {
    border-color: transparent;
    box-shadow: var(--dn-card-hover-shadow);
  }

  .dn-blog-card__link {
    position: relative;
    border-radius: inherit;
    display: flex;
    height: 100%;
    flex-direction: column;
    color: inherit;
  }

  .dn-blog-card__link:focus-visible {
    outline: 3px solid var(--dn-focus);
    outline-offset: -3px;
  }

  .dn-blog-card__link:focus-visible::after {
    position: absolute;
    inset: 0;
    z-index: 1;
    border: 3px solid var(--dn-focus);
    border-radius: 15px;
    pointer-events: none;
    content: '';
  }

  .dn-blog-card__media {
    position: relative;
    display: block;
    height: 184px;
    flex: 0 0 184px;
    overflow: hidden;
    background: #e7e9ec;
  }

  .dn-blog-card__media img {
    width: 100%;
    height: 184px;
    object-fit: cover;
  }

  .dn-blog-card__body {
    min-height: 135px;
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 14px 14px 16px;
    box-sizing: border-box;
  }

  .dn-blog-card__meta {
    min-height: 20px;
    display: flex;
    align-items: center;
    color: #4f5662;
    font-size: var(--dn-text-meta);
    font-weight: var(--dn-weight-regular);
    line-height: var(--dn-leading-meta);
  }

  .dn-blog-card__category {
    display: inline-flex;
    align-items: center;
  }

  h2 {
    margin: 9px 0 8px;
    color: #202329;
    font-size: var(--dn-text-lead);
    font-weight: var(--dn-weight-medium);
    line-height: var(--dn-leading-meta);
    letter-spacing: var(--dn-tracking-normal);
    transition: color 180ms ease-out;
  }

  .dn-blog-card:focus-within h2 {
    color: var(--dn-red);
  }

  @media (hover: hover) and (pointer: fine) {
    .dn-blog-card:hover { border-color: transparent; box-shadow: var(--dn-card-hover-shadow); }
    .dn-blog-card:hover h2 { color: var(--dn-red); }
  }

  .dn-blog-card__text {
    display: -webkit-box;
    overflow: hidden;
    margin-top: auto;
    color: #696665;
    font-size: var(--dn-text-body);
    line-height: var(--dn-leading-body);
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  .dn-blog-card__action { display: none; }
  .dn-blog-card__mobile-arrow { display: none; }

  @media (min-width: 992px) {
    .dn-blog-card__media { height: 160px; flex-basis: 160px; }
    .dn-blog-card__media img { height: 100%; }
    .dn-blog-card__body { padding: var(--dn-space-4); }
    h2 { min-height: 2lh; margin: var(--dn-space-1) 0 6px; font-size: var(--dn-text-card); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-card); }
    .dn-blog-card__text { margin-top: 0; margin-bottom: var(--dn-space-2); font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); }
    .dn-blog-card__action { display: inline-flex; min-height: 28px; align-items: center; gap: var(--dn-space-2); margin-top: auto; color: var(--dn-red); font-size: var(--dn-text-meta); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-control); }
  }

  @media (max-width: 991px) {
    .dn-blog-card { border: 0; border-radius: var(--dn-radius-control); }
    .dn-blog-card__link { display: block; }
    .dn-blog-card__media { display: none; }
    .dn-blog-card__body { min-width: 0; min-height: 0; padding: var(--dn-space-4); }
    .dn-blog-card__meta { min-height: var(--dn-space-5); justify-content: space-between; gap: var(--dn-space-3); font: var(--dn-mobile-card-meta-font); }
    .dn-blog-card__mobile-arrow { display: inline-flex; flex-shrink: 0; color: var(--dn-ink); }
    h2 { margin: var(--dn-space-1) 0 var(--dn-space-2); font: var(--dn-mobile-card-title-font); font-weight: var(--dn-weight-semibold); }
    .dn-blog-card__text { margin-top: 0; font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); }
  }

  @container (max-width: 15rem) {
    .dn-blog-card__link { grid-template-columns: minmax(0, 1fr); }
    .dn-blog-card__media { height: auto; min-height: 0; aspect-ratio: 16 / 9; }
    .dn-blog-card__body { min-width: 0; overflow-wrap: anywhere; }
  }

  @media (prefers-reduced-motion: reduce) {
    .dn-blog-card,
    h2 {
      transition: none;
    }
  }
</style>
