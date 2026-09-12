<script lang="ts">
  import { resolve } from '$app/paths';

  const actions = [
    {
      title: 'Автомобили',
      text: 'Разгледай наличните автомобили',
      cta: 'Разгледай',
      href: '/listing-grid',
      tone: 'blue',
      image: '/assets/images/lead/day-night-collection-banner-v2.webp',
      width: 1200,
      height: 668
    },
    {
      title: 'Продай / Бартер',
      text: 'Бърза оценка на твоя автомобил',
      cta: 'Заяви оценка',
      href: '/contact?topic=trade-in',
      tone: 'red',
      image: '/assets/images/lead/day-night-mobile-sell-v1.webp',
      width: 1200,
      height: 438
    },
    {
      title: 'Внос по заявка',
      text: 'Автомобил от Европа по твоите критерии',
      cta: 'Заяви внос',
      href: '/contact?topic=import',
      tone: 'ice',
      image: '/assets/images/lead/day-night-mobile-import-v1.webp',
      width: 1200,
      height: 450
    },
    {
      title: 'На лизинг',
      text: 'Гъвкави условия според бюджета',
      cta: 'Виж условия',
      href: '/contact?topic=leasing',
      tone: 'dark',
      image: '/assets/images/template/menu-leasing-v2.webp',
      width: 1610,
      height: 977
    }
  ] as const;
</script>

<section class="dn-mobile-core-actions" aria-label="Основни услуги">
  <div class="dn-mobile-core-actions__grid">
    {#each actions as action (action.href)}
      <a class={`dn-mobile-core-card dn-mobile-core-card--${action.tone}`} href={resolve(action.href)}>
        <span class="dn-mobile-core-card__copy">
          <strong>{action.title}</strong>
          <small>{action.text}</small>
        </span>
        <span class="dn-mobile-core-card__art" aria-hidden="true">
          <img src={action.image} alt="" width={action.width} height={action.height} loading="lazy" decoding="async" />
        </span>
      </a>
    {/each}
  </div>
</section>

<style>
  .dn-mobile-core-actions { display: none; }

  @media (max-width: 767px) {
    .dn-mobile-core-actions {
      display: block;
      padding: 12px 12px 8px;
      background: var(--dn-mobile-canvas);
    }
    .dn-mobile-core-actions__grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .dn-mobile-core-card {
      position: relative;
      display: block;
      min-height: 164px;
      overflow: hidden;
      border-radius: 14px;
      color: #fff;
      isolation: isolate;
    }

    .dn-mobile-core-card--blue { background: linear-gradient(145deg, #135da8 0%, #0d3d72 100%); }
    .dn-mobile-core-card--red { background: linear-gradient(145deg, #d00832 0%, #9b001f 100%); }
    .dn-mobile-core-card--ice { background: linear-gradient(145deg, #e8f4ff 0%, #c8e3f8 100%); color: #15202c; }
    .dn-mobile-core-card--dark { background: linear-gradient(145deg, #23262b 0%, #111317 100%); }

    .dn-mobile-core-card__copy {
      position: relative;
      z-index: 3;
      display: flex;
      min-height: 164px;
      flex-direction: column;
      align-items: flex-start;
      padding: 13px;
    }

    .dn-mobile-core-card strong {
      max-width: none;
      font-size: 18px;
      font-weight: 760;
      line-height: 1.08;
      letter-spacing: -.025em;
      white-space: nowrap;
    }

    .dn-mobile-core-card small {
      max-width: 16ch;
      margin-top: 6px;
      font-size: 11.5px;
      font-weight: 500;
      line-height: 1.28;
      opacity: .9;
    }

    .dn-mobile-core-card__art {
      position: absolute;
      z-index: 1;
      right: 0;
      bottom: 0;
      left: 0;
      height: 60%;
      pointer-events: none;
    }

    .dn-mobile-core-card__art img {
      position: absolute;
      bottom: -2px;
      left: 50%;
      display: block;
      width: 100%;
      max-width: none;
      height: 100%;
      object-fit: contain;
      object-position: center bottom;
      filter: drop-shadow(0 10px 14px rgb(0 0 0 / .22));
      transform: translateX(-50%);
    }

    .dn-mobile-core-card--blue .dn-mobile-core-card__art img { width: 106%; }
    .dn-mobile-core-card--red .dn-mobile-core-card__art img { width: 138%; }
    .dn-mobile-core-card--ice .dn-mobile-core-card__art img { width: 136%; }
    .dn-mobile-core-card--dark .dn-mobile-core-card__art img { width: 108%; }
    .dn-mobile-core-card:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 3px; }
  }
</style>
