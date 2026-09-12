<script lang="ts">
  import BrowseAllCard from './BrowseAllCard.svelte';
  import { resolve } from '$app/paths';
  import { editorial } from '$data/home';
</script>

<section class="dn-editorial" aria-labelledby="editorial-title">
  <div class="dn-editorial__banner">
    <div class="container">
      <div class="dn-editorial__heading dn-home-section-heading dn-home-section-heading--branded dn-home-section-heading--red dn-home-banner-frame dn-home-banner-copy">
        <h2 id="editorial-title" class="dn-home-section-title">
          <span class="dn-heading-desktop">Полезно при избор на автомобил</span>
          <span class="dn-heading-mobile">Полезно</span>
        </h2>
        
        <a class="dn-editorial__cta dn-home-section-action" href={resolve('/blog')}>Вижте всички статии</a>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="dn-editorial__cards">
      <div class="dn-editorial__layout">
        {#each editorial as item (item.title)}
          <article class="dn-editorial-item">
            <a class="dn-editorial-item__link" href={resolve(item.href as '/blog')} aria-label={item.title}>
              <span class="dn-editorial-item__media">
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width="720"
                  height="440"
                />
                <span class="dn-editorial-item__badge">{item.meta}</span>
              </span>

              <span class="dn-editorial-item__content">
                <span class="dn-editorial-item__meta" aria-label="Категория">
                  <span>{item.category}</span>
                </span>
                <h3>{item.title}</h3>
                <span class="dn-editorial-item__summary">{item.text}</span>
              </span>
            </a>
          </article>
        {/each}
        <BrowseAllCard href="/blog" label="Още полезно" detail="Съвети за избор, оглед и внос" action="Прочети всички" />
      </div>
    </div>
  </div>
</section>

<style>
  .dn-editorial {
    padding: 80px 0 96px;
    background: #fff;
  }

  .dn-heading-mobile {
    display: none;
  }

  .dn-editorial__banner {
    position: relative;
    min-height: 420px;
    overflow: hidden;
    margin: 0 12px;
    padding: 82px 0 0;
    border-radius: 24px;
    background-image: url('/assets/images/lead/day-night-editorial-banner-v2.webp');
    background-position: center 64%;
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: fixed;
  }

  .dn-editorial__banner::before {
    position: absolute;
    inset: 0;
    background: rgba(13, 16, 21, 0.48);
    content: '';
    pointer-events: none;
  }

  .dn-editorial__heading {
    position: relative;
    z-index: 2;
    display: flex;
    min-height: 46px;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    max-width: 760px;
    margin: 0 auto;
  }

  .dn-editorial__heading h2 {
    margin: 0 0 14px;
    color: #fff;
    font-size: 42px;
    font-weight: 650;
    line-height: 1.15;
    letter-spacing: -0.03em;
    text-align: center;
  }

  

  .dn-editorial__cta {
    display: inline-flex;
    min-height: 50px;
    align-items: center;
    justify-content: center;
    padding: 0 28px;
    border-radius: var(--dn-radius-button);
    background: #c40101;
    color: #fff;
    font-size: var(--dn-text-lead);
    font-weight: 600;
    line-height: 1.3;
    transition: background-color 0.3s ease;
  }

  .dn-editorial__cta:hover,
  .dn-editorial__cta:focus-visible {
    background: #24272c;
    color: #fff;
  }

  .dn-editorial__cards {
    position: relative;
    z-index: 3;
    margin: -150px -30px 0;
  }

  .dn-editorial__layout {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 30px;
  }

  .dn-editorial-item {
    min-width: 0;
    overflow: hidden;
    border: 0;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(18, 25, 38, 0.08);
    transform: none;
    transition: box-shadow 180ms ease-out;
  }

  .dn-editorial-item:hover,
  .dn-editorial-item:focus-within {
    box-shadow: var(--dn-card-hover-shadow);
  }

  .dn-editorial-item__link {
    display: block;
    height: 100%;
    color: inherit;
  }

  .dn-editorial-item__link:focus-visible {
    outline: 3px solid rgba(196, 1, 1, 0.28);
    outline-offset: -3px;
  }

  .dn-editorial-item__media {
    position: relative;
    display: block;
    width: 100%;
    height: 220px;
    overflow: hidden;
    border-radius: 15px 15px 0 0;
    background: #eceff2;
  }

  .dn-editorial-item__media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: none;
  }

  .dn-editorial-item__badge {
    position: absolute;
    bottom: 10px;
    left: 12px;
    display: inline-flex;
    min-height: 30px;
    align-items: center;
    padding: 6px 12px;
    border-radius: var(--dn-pill);
    background: #c40101;
    color: #fff;
    font-size: var(--dn-text-meta);
    font-weight: 650;
    line-height: 18px;
  }

  .dn-editorial-item__content {
    display: block;
    padding: 18px 18px 22px;
  }

  .dn-editorial-item__meta {
    display: flex;
    align-items: center;
    gap: 0;
    margin-bottom: 8px;
  }

  .dn-editorial-item__meta span {
    position: relative;
    color: #626a75;
    font-size: var(--dn-text-meta);
    font-weight: 500;
    line-height: 18px;
  }

  .dn-editorial-item h3 {
    margin: 0 0 9px;
    color: #24272c;
    font-size: 20px;
    font-weight: 650;
    line-height: 1.27;
    letter-spacing: -0.02em;
    transition: color 180ms ease-out;
  }

  .dn-editorial-item:hover h3,
  .dn-editorial-item:focus-within h3 {
    color: #c40101;
  }

  .dn-editorial-item__summary {
    display: -webkit-box;
    margin: 0;
    overflow: hidden;
    color: #66707d;
    font-size: var(--dn-text-body);
    font-weight: 400;
    line-height: 1.5;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  @media (prefers-reduced-motion: reduce) {
    .dn-editorial-item {
      transition: none;
    }
  }

  @media (min-width: 992px) {
    .dn-editorial {
      padding-top: 72px;
      padding-bottom: 72px;
    }
  }

  @media (max-width: 1360px) {
    .dn-editorial__cards {
      margin-inline: 0;
    }
  }

  @media (max-width: 991px) {
    .dn-editorial {
      padding: 64px 0 72px;
    }

    .dn-editorial__banner {
      min-height: 0;
      margin: 0 8px;
      padding: 72px 20px 160px;
      border-radius: 20px;
      background-attachment: scroll;
    }

    .dn-editorial__cards {
      margin-top: -112px;
    }

    .dn-editorial__layout {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 28px 20px;
    }

    .dn-editorial-item:last-of-type {
      grid-column: 1 / -1;
      max-width: calc(50% - 10px);
    }
  }

  @media (max-width: 767px) {
    .dn-editorial {
      padding: 24px 0 12px;
      background: var(--dn-mobile-canvas);
    }

    .dn-editorial__banner {
      min-height: 0;
      margin: 0;
      padding: 0;
      overflow: visible;
      border-radius: 0;
      background: none;
    }

    .dn-editorial__banner::before {
      display: none;
    }

    .dn-editorial__heading {
      display: grid;
      min-height: 44px;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 12px;
      text-align: left;
    }

    .dn-editorial__heading h2 {
      margin: 0;
      color: #171a20;
      font-size: 22px;
      font-weight: 700;
      line-height: 1.15;
      text-align: left;
    }

    .dn-heading-desktop {
      display: none;
    }

    .dn-heading-mobile {
      display: inline;
    }

    

    .dn-editorial__cta {
      min-height: 44px;
      padding: 0;
      background: transparent;
      color: #4f5661;
      font-size: 14px;
      font-weight: 650;
    }

    .dn-editorial__layout {
      display: grid;
      grid-auto-columns: min(278px, calc(100vw - 78px));
      grid-auto-flow: column;
      grid-template-columns: none;
      gap: 10px;
      overflow-x: auto;
      padding: 0 0 4px;
      scroll-padding-left: 0;
      scroll-snap-type: x proximity;
      scrollbar-width: none;
    }

    .dn-editorial__cards {
      margin: 8px 0 0;
    }

    .dn-editorial__layout::-webkit-scrollbar {
      display: none;
    }

    .dn-editorial-item:last-of-type {
      grid-column: auto;
      max-width: none;
    }

    .dn-editorial-item {
      scroll-snap-align: start;
      border-radius: 14px;
      background: var(--dn-mobile-surface);
      box-shadow: none;
    }

    .dn-editorial-item__media {
      height: auto;
      aspect-ratio: 16 / 9;
      border-radius: 14px 14px 0 0;
    }

    .dn-editorial-item__content {
      padding: 14px 14px 16px;
    }

    .dn-editorial-item h3 {
      margin-bottom: 7px;
      font-size: 17px;
    }

    .dn-editorial-item__summary {
      font-size: 14px;
      line-height: 1.4;
    }
  }
  @media (min-width: 992px) {
    .dn-editorial {
      padding-block: 32px;
    }

    .dn-editorial__banner {
      width: min(var(--dn-content), calc(100% - 48px));
      min-height: 0;
      margin-inline: auto;
      padding: 0;
      border-radius: 20px 20px 0 0;
      background: var(--dn-home-panel);
      background-attachment: scroll;
    }

    .dn-editorial__banner::before { display: none; }

    .dn-editorial__banner > .container {
      width: 100%;
    }

    .dn-editorial__heading {
      display: grid;
      max-width: none;
      grid-template-columns: minmax(0, 1fr) auto;
      column-gap: 32px;
      row-gap: 12px;
    }

    .dn-editorial__heading h2,
    

    .dn-editorial__heading h2 {
      font-size: 32px;
      color: #171a20;
      text-align: left;
      margin: 0;
    }

    

    .dn-editorial__cta {
      min-height: 44px;
      grid-column: 2;
      grid-row: 1 / span 2;
      padding-inline: 20px;
      background: #fff;
      color: #24272c;
      font-size: 16px;
    }

    .dn-editorial__cta:hover,
    .dn-editorial__cta:focus-visible {
      background: #24272c;
      color: #fff;
    }

    .dn-editorial__cards {
      margin: calc(-1 * var(--dn-home-banner-overlap)) 0 0;
      padding: 24px;
      border-radius: var(--dn-radius);
      background: var(--dn-home-panel);
    }

    .dn-editorial__layout {
      gap: 24px;
    }
  }


  @media (max-width: 767px) {
    .dn-editorial__cta, .dn-editorial-item__badge { display: none; }
  }
</style>
