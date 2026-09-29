<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

  import { resolve } from '$app/paths';
  import FeatureArtwork from '$components/ui/FeatureArtwork.svelte';
  import { mobileActionArtwork } from '$data/feature-artwork';

  const actions = [
    {
      title: 'Автомобили',
      text: 'Разгледай всички',
      cta: 'Разгледай',
      href: '/listing-grid',
      tone: 'blue',
      artwork: mobileActionArtwork.collection
    },
    {
      title: 'Продай / Бартер',
      text: 'Бърза оценка',
      cta: 'Заяви оценка',
      href: '/contact?topic=trade-in',
      tone: 'red',
      artwork: mobileActionArtwork.sell
    },
    {
      title: 'Внос по заявка',
      text: 'Европа, САЩ, Канада',
      cta: 'Заяви внос',
      href: '/contact?topic=import',
      tone: 'ice',
      artwork: mobileActionArtwork.import
    },
    {
      title: 'На лизинг',
      text: 'Гъвкави условия',
      cta: 'Виж условия',
      href: '/contact?topic=leasing',
      tone: 'dark',
      artwork: mobileActionArtwork.finance
    }
  ] as const;
</script>

<section class="dn-mobile-core-actions" aria-label={i18n.t("m_23b41588e19b")}>
  <div class="dn-mobile-core-actions__grid">
    {#each actions as action (action.href)}
      <a class={`dn-mobile-core-card dn-mobile-core-card--${action.tone}`} href={i18n.href(resolve(action.href))}>
        <span class="dn-mobile-core-card__copy">
          <strong>{i18n.text(action.title)}</strong>
          <small>{i18n.text(action.text)}</small>
        </span>
        <span class="dn-mobile-core-card__art" aria-hidden="true">
          <FeatureArtwork artwork={action.artwork} />
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
      padding: 8px 12px 4px;
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
      min-height: 158px;
      overflow: hidden;
      border-radius: 14px;
      color: #fff;
      isolation: isolate;
    }

    .dn-mobile-core-card--blue { background: linear-gradient(145deg, var(--dn-theme-action-blue-start) 0%, var(--dn-theme-action-blue-end) 100%); }
    .dn-mobile-core-card--red { background: linear-gradient(145deg, var(--dn-theme-action-red-start) 0%, var(--dn-theme-action-red-end) 100%); }
    .dn-mobile-core-card--ice { background: linear-gradient(145deg, var(--dn-theme-action-ice-start) 0%, var(--dn-theme-action-ice-end) 100%); color: var(--dn-theme-action-ice-ink); }
    .dn-mobile-core-card--dark { background: var(--dn-theme-hero-surface); }

    .dn-mobile-core-card__copy {
      position: relative;
      z-index: 3;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: var(--dn-space-3) var(--dn-space-3) 0;
    }

    .dn-mobile-core-card strong {
      max-width: 100%;
      font-size: var(--dn-text-lead);
      font-weight: var(--dn-weight-semibold);
      line-height: var(--dn-leading-control);
      letter-spacing: var(--dn-tracking-heading);
      white-space: nowrap;
    }

    .dn-mobile-core-card small {
      display: block;
      max-width: 100%;
      margin-top: 3px;
      overflow: hidden;
      font-size: var(--dn-text-meta);
      font-weight: var(--dn-weight-regular);
      line-height: var(--dn-leading-meta);
      letter-spacing: var(--dn-tracking-normal);
      opacity: .92;
      white-space: nowrap;
    }

    .dn-mobile-core-card__art {
      position: absolute;
      z-index: 1;
      inset-inline: var(--dn-space-2);
      bottom: var(--dn-space-3);
      height: 80px;
      display: flex;
      align-items: flex-end;
      pointer-events: none;
    }

    .dn-mobile-core-card--dark .dn-mobile-core-card__art { mix-blend-mode: lighten; }
    .dn-mobile-core-card:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 3px; }
  }

  @media (max-width: 340px) {
    .dn-mobile-core-card__copy { padding-inline: 8px; }

    .dn-mobile-core-card strong {
      font-size: var(--dn-text-body);
      letter-spacing: var(--dn-tracking-heading);
    }

    .dn-mobile-core-card small {
      font-size: var(--dn-text-caption);
      letter-spacing: var(--dn-tracking-normal);
    }
  }
</style>
