<script lang="ts">
  import { resolve } from '$app/paths';
  import OriginalActionIcon from '$components/ui/icons/OriginalActionIcon.svelte';
  import Icon from '$components/ui/Icon.svelte';
  import { brand } from '$config/brand';

  let { showActions = true, showMobileFooter = false }: { showActions?: boolean; showMobileFooter?: boolean } = $props();
  const phoneLinkAttributes = { href: brand.phoneHref } as const;

  const actions = [
    {
      title: 'Подбрани автомобили',
      description: 'Разгледайте актуалната селекция',
      href: '/listing-grid',
      icon: 'car'
    },
    {
      title: `Оглед в ${brand.city}`,
      description: 'С предварителна уговорка',
      href: '/contact?topic=inspection',
      icon: 'contact'
    },
    {
      title: 'Собствен лизинг',
      description: 'Попитайте за актуалните условия',
      href: '/contact?topic=leasing',
      icon: 'finance'
    },
    {
      title: 'Внос по заявка',
      description: 'Уточнете критериите с екипа',
      href: '/contact?topic=import',
      icon: 'value'
    }
  ] as const;
</script>

{#if showActions}
  <section class="dn-footer-actions" aria-label="Следващи стъпки">
    <div class="container dn-footer-actions__grid">
      {#each actions as action (action.href)}
        <a href={resolve(action.href)}>
          <span class="dn-footer-actions__icon" aria-hidden="true">
            <OriginalActionIcon name={action.icon} />
          </span>
          <span>
            <strong>{action.title}</strong>
            <small>{action.description}</small>
          </span>
        </a>
      {/each}
    </div>
  </section>
{/if}

<footer class={['dn-footer', { 'dn-footer--mobile-hidden': !showMobileFooter }]}>
  <div class="container dn-footer__grid">
    <div class="dn-footer__intro">
      <a class="dn-footer__logo" href={resolve('/')}><img src={brand.logo} alt={brand.name} width="220" height="58" /></a>
      <p>Подбрани премиум автомобили, внос и собствен лизинг с директен контакт с екипа.</p>
    </div>
    <nav aria-label="Автомобили">
      <strong>Автомобили</strong>
      <a href={resolve('/listing-grid')}>Всички автомобили</a>
      <a href={resolve('/listing-grid?condition=used')}>Употребявани</a>
      <a href={resolve('/listing-grid?sort=newest')}>Най-нови предложения</a>
    </nav>
    <nav aria-label="Компания">
      <strong>Компания</strong>
      <a href={resolve('/about-us')}>За нас</a>
      <a href={resolve('/blog')}>Полезно</a>
      <a href={resolve('/contact')}>Контакти</a>
    </nav>
    <div class="dn-footer__contact" aria-label="Контакт с екипа">
      <a {...phoneLinkAttributes} class="dn-footer__contact-link">
        <Icon name="phone" size={18} />
        <span class="dn-footer__phone">{brand.phone}</span>
        <Icon name="arrow-right" size={16} />
      </a>
      <a href={resolve('/contact')} class="dn-footer__contact-link">
        <Icon name="map-pin" size={18} />
        <span>{brand.address}</span>
        <Icon name="arrow-right" size={16} />
      </a>
      <p class="dn-footer__appointment">{brand.appointment}</p>
    </div>
  </div>
  <div class="container dn-footer__bottom"><span>© {new Date().getFullYear()} {brand.name}</span><span>Автомобили · Внос · Лизинг</span></div>
</footer>
