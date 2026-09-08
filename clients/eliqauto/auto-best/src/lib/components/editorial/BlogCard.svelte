<script lang="ts">
  import { withListReturn } from '$data/journeys';
  import { resolve } from '$app/paths';
  import { brand } from '$config/brand';
  import type { BlogPost } from '$data/editorial';

  let { post, returnTo, priority = false }: { post: BlogPost; returnTo?: string; priority?: boolean } = $props();
</script>

<article id={`article-${post.id}`} class="dn-blog-card">
  <a class="dn-blog-card__link" href={withListReturn(resolve('/blog-detail/[id]', { id: String(post.id) }), returnTo)} aria-label={post.title}>
    <span class="dn-blog-card__media">
      <img
        src={post.image}
        alt=""
        width="820"
        height="540"
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
    </span>
    <span class="dn-blog-card__body">
      <span class="dn-blog-card__meta">
        <span>{brand.name}</span>
        <span class="dn-blog-card__category">{post.category}</span>
      </span>
      <h2>{post.title}</h2>
      <span class="dn-blog-card__text">{post.text}</span>
    </span>
  </a>
</article>

<style>
  .dn-blog-card {
    min-width: 0;
    height: 100%;
    overflow: hidden;
    border: 1px solid #e1e4e9;
    border-radius: 16px;
    background: #fff;
    transition: box-shadow 160ms ease, border-color 160ms ease;
  }

  .dn-blog-card:hover,
  .dn-blog-card:focus-within {
    border-color: transparent;
    box-shadow: var(--dn-card-hover-shadow);
  }

  .dn-blog-card__link {
    display: flex;
    height: 100%;
    flex-direction: column;
    color: inherit;
  }

  .dn-blog-card__link:focus-visible {
    outline: 3px solid rgba(196, 1, 1, .28);
    outline-offset: -3px;
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
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  }

  .dn-blog-card__meta > span:first-child {
    font-weight: 700;
  }

  .dn-blog-card__category {
    display: inline-flex;
    align-items: center;
    padding-left: 8px;
  }

  .dn-blog-card__category::before {
    width: 4px;
    height: 4px;
    margin-right: 8px;
    border-radius: 50%;
    background: #9da3ac;
    content: '';
  }

  h2 {
    margin: 9px 0 8px;
    color: #202329;
    font-size: 18px;
    font-weight: 500;
    line-height: 1.35;
    letter-spacing: 0;
    transition: color 180ms ease-out;
  }

  .dn-blog-card:hover h2,
  .dn-blog-card:focus-within h2 {
    color: var(--dn-red);
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

  @media (max-width: 767px) {
    .dn-blog-card { border: 0; border-radius: 12px; }
    .dn-blog-card__link { display: grid; grid-template-columns: 108px minmax(0, 1fr); }
    .dn-blog-card__media { height: 100%; min-height: 132px; }
    .dn-blog-card__media img { height: 100%; }
    .dn-blog-card__body { min-height: 0; padding: 12px; }
    .dn-blog-card__meta { min-height: 0; font-size: 12px; line-height: 1.3; }
    .dn-blog-card__meta > span:first-child { display: none; }
    .dn-blog-card__category { padding-left: 0; }
    .dn-blog-card__category::before { display: none; }
    h2 { margin: 5px 0 6px; font-size: 16px; font-weight: 600; line-height: 1.3; }
    .dn-blog-card__text { margin-top: 0; font-size: 13px; line-height: 1.45; }
  }

  @media (prefers-reduced-motion: reduce) {
    .dn-blog-card,
    h2 {
      transition: none;
    }
  }
</style>
