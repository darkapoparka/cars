<script lang="ts">
  import { resolve } from '$app/paths';
  import Icon from '$components/ui/Icon.svelte';
  import OriginalActionIcon from '$components/ui/icons/OriginalActionIcon.svelte';

  const actions = [
    {
      title: 'Вижте колекцията',
      description: 'Разгледайте автомобилите с удобни филтри.',
      cta: 'Към автомобилите',
      href: '/listing-grid',
      icon: 'car'
    },
    {
      title: 'Продажба или бартер',
      description: 'Получете оценка за продажба или бартер.',
      cta: 'Поискайте оценка',
      href: '/contact?topic=trade-in',
      icon: 'value'
    },
    {
      title: 'Внос по заявка',
      description: 'Споделете модел и бюджет за внос по заявка.',
      cta: 'Заявете внос',
      href: '/contact?topic=import',
      icon: 'contact'
    },
    {
      title: 'Собствен лизинг',
      description: 'Попитайте за първоначална вноска, срок и условия.',
      cta: 'Поискайте условия',
      href: '/contact?topic=leasing',
      icon: 'finance'
    }
  ] as const;
</script>

<section class="dn-trust-actions" aria-labelledby="trust-title">
  <div class="container">
    <div class="dn-trust-actions__panel">
      <div class="dn-trust-actions__heading dn-home-section-heading">
        <h2 id="trust-title" class="dn-home-section-title">Как можем да помогнем</h2>
        <p>Изберете услуга или се свържете директно с екипа.</p>
        <a class="dn-trust-actions__cta dn-home-section-action" href={resolve('/contact')}>Свържете се с нас</a>
      </div>

      <div class="dn-trust-actions__grid" aria-label="Следващи стъпки">
        {#each actions as action (action.href)}
          <article class="dn-trust-card">
            <div class="dn-trust-card__icon" aria-hidden="true">
              <OriginalActionIcon name={action.icon} />
            </div>

            <div class="dn-trust-card__content">
              <h3><a href={resolve(action.href)}>{action.title}</a></h3>
              <p>{action.description}</p>
              <a class="dn-trust-card__action" href={resolve(action.href)}>
                <span>{action.cta}</span>
                <Icon name="arrow-right" size={16} strokeWidth={1.8} />
              </a>
            </div>
          </article>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .dn-trust-actions {
    padding: 80px 0 96px;
    background: #fff;
  }

  .dn-trust-actions__panel {
    margin-inline: -30px;
    padding: 46px 30px 30px;
    border-radius: 20px;
    background: #f1f3f5;
  }

  .dn-trust-actions__heading {
    width: 100%;
    max-width: 760px;
    margin: 0 auto 34px;
    text-align: center;
  }

  .dn-trust-actions__heading h2 {
    margin: 0 0 12px;
    color: #171a20;
    font-size: 42px;
    font-weight: 650;
    line-height: 1.15;
    letter-spacing: -0.03em;
  }

  .dn-trust-actions__heading p {
    margin: 0 0 26px;
    color: #626a75;
    font-size: var(--dn-text-lead);
    line-height: var(--dn-leading-lead);
  }

  .dn-trust-actions__cta {
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
    transition: background-color 180ms ease-out;
  }

  .dn-trust-actions__cta:hover,
  .dn-trust-actions__cta:focus-visible {
    background: #24272c;
    color: #fff;
  }

  .dn-trust-actions__cta:focus-visible {
    outline: 3px solid rgba(196, 1, 1, 0.24);
    outline-offset: 3px;
  }

  .dn-trust-actions__grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
  }

  .dn-trust-card {
    display: flex;
    height: 100%;
    min-width: 0;
    flex-direction: column;
    padding: 30px;
    border: 0;
    border-radius: 16px;
    background: #fff;
    color: #24272c;
    transition: border-color 160ms ease-out, box-shadow 180ms ease-out;
  }

  .dn-trust-card:hover,
  .dn-trust-card:focus-within {
    border-color: transparent;
    box-shadow: var(--dn-card-hover-shadow);
  }

  .dn-trust-card__icon {
    width: 60px;
    height: 60px;
    margin-bottom: 20px;
    color: #c40101;
  }

  .dn-trust-card__content {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  .dn-trust-card h3 {
    margin: 0 0 16px;
    color: #24272c;
    font-size: var(--dn-text-card);
    font-weight: 600;
    line-height: 1.25;
  }

  .dn-trust-card h3 a {
    color: inherit;
  }

  .dn-trust-card h3 a:hover,
  .dn-trust-card h3 a:focus-visible {
    color: #c40101;
  }

  .dn-trust-card p {
    min-height: 48px;
    margin: 0 0 24px;
    color: #696665;
    font-size: var(--dn-text-body);
    font-weight: 400;
    line-height: var(--dn-leading-body);
  }

  .dn-trust-card__action {
    display: inline-flex;
    min-width: 204px;
    min-height: 50px;
    align-items: center;
    justify-content: center;
    gap: 9px;
    align-self: flex-start;
    margin-top: auto;
    padding: 14px 26px;
    border: 1px solid #c40101;
    border-radius: var(--dn-radius-button);
    background: #fff;
    color: #c40101;
    font-size: var(--dn-text-lead);
    font-weight: 600;
    line-height: 1.3;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .dn-trust-card:hover .dn-trust-card__action,
  .dn-trust-card:focus-within .dn-trust-card__action,
  .dn-trust-card__action:hover,
  .dn-trust-card__action:focus-visible {
    background: #c40101;
    color: #fff;
  }

  @media (max-width: 1199px) {
    .dn-trust-actions__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 20px;
    }

  }

  @media (min-width: 992px) {
    .dn-trust-actions {
      padding-top: 72px;
      padding-bottom: 96px;
    }
  }

  @media (max-width: 1419px) {
    .dn-trust-actions__panel {
      margin-inline: 0;
    }
  }

  @media (max-width: 991px) {
    .dn-trust-actions {
      padding: 64px 0 72px;
    }

    .dn-trust-actions__panel {
      padding: 38px 20px 20px;
    }

    .dn-trust-actions__heading h2 {
      font-size: 2.25rem;
    }
  }

  @media (max-width: 767px) {
    .dn-trust-actions {
      padding: 24px 0 32px;
      background: var(--dn-mobile-canvas);
    }

    .dn-trust-actions__panel {
      margin: 0;
      padding: 0;
      border-radius: 0;
      background: transparent;
    }

    .dn-trust-actions__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .dn-trust-card {
      height: auto;
      min-height: 154px;
      padding: 14px;
      border-radius: 14px;
    }

    .dn-trust-actions__heading {
      margin-bottom: 16px;
    }

    .dn-trust-actions__heading h2 {
      margin-bottom: 6px;
      font-size: 22px;
      font-weight: 700;
    }

    .dn-trust-actions__heading p {
      margin-bottom: 12px;
      font-size: 14px;
    }

    .dn-trust-actions__cta {
      min-height: 44px;
      padding-inline: 20px;
      font-size: 14px;
    }

    .dn-trust-card__icon {
      width: 38px;
      height: 38px;
      margin-bottom: 10px;
    }

    .dn-trust-card__icon :global(svg) {
      width: 38px;
      height: 38px;
    }

    .dn-trust-card h3 {
      margin-bottom: 8px;
      font-size: 15px;
      line-height: 1.25;
    }

    .dn-trust-card p {
      display: none;
    }

    .dn-trust-card__action {
      min-width: 0;
      min-height: 44px;
      justify-content: flex-start;
      align-self: stretch;
      margin-top: auto;
      padding: 0;
      border: 0;
      background: transparent;
      color: #4f5661;
      font-size: 13px;
      line-height: 1.25;
    }

    .dn-trust-card:hover .dn-trust-card__action,
    .dn-trust-card:focus-within .dn-trust-card__action,
    .dn-trust-card__action:hover,
    .dn-trust-card__action:focus-visible {
      background: transparent;
      color: var(--dn-red);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .dn-trust-card,
    .dn-trust-card__action,
    .dn-trust-actions__cta {
      transition: none;
    }
  }
  @media (min-width: 992px) {
    .dn-trust-actions {
      padding: 32px 0 64px;
    }

    .dn-trust-actions__panel {
      margin-inline: 0;
      padding: 32px;
    }

    .dn-trust-actions__heading {
      display: grid;
      max-width: none;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 12px 32px;
      margin-bottom: 24px;
      text-align: left;
    }

    .dn-trust-actions__heading h2 {
      margin: 0;
      font-size: 32px;
    }

    .dn-trust-actions__heading p {
      grid-column: 1;
      margin: 0;
      font-size: 16px;
    }

    .dn-trust-actions__cta {
      grid-column: 2;
      grid-row: 1 / span 2;
      min-height: 44px;
      padding-inline: 20px;
      font-size: 16px;
    }

    .dn-trust-card {
      padding: 24px;
    }

    .dn-trust-card__action {
      min-width: 0;
      min-height: 44px;
      padding: 10px 14px;
      font-size: 15px;
    }
  }

</style>
