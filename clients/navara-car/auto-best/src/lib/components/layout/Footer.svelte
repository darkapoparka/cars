<script lang="ts">
  import { resolve } from '$app/paths';
  import OriginalActionIcon from '$components/ui/icons/OriginalActionIcon.svelte';
  import Icon from '$components/ui/Icon.svelte';
  import { brand, dealerSource } from '$config/brand';

  let { showActions = true, showMobileFooter = false }: { showActions?: boolean; showMobileFooter?: boolean } = $props();
  const phoneLinkAttributes = { href: brand.phoneHref } as const;
  const actions = [
    { title: 'Автомобили от обявите', description: 'Селекция към 08.09.2026 г.', href: '/listing-grid', icon: 'car' },
    { title: `Оглед във ${brand.city}`, description: 'Първо потвърдете наличността', href: '/contact?topic=inspection', icon: 'contact' },
    { title: 'Лизинг по запитване', description: 'Без предварително обещани условия', href: '/contact?topic=leasing', icon: 'finance' },
    { title: 'Регистрация и документи', description: 'Попитайте за публикуваното съдействие', href: '/contact?topic=import', icon: 'value' }
  ] as const;
</script>

{#if showActions}
  <section class="dn-footer-actions" aria-label="Следващи стъпки">
    <div class="container dn-footer-actions__grid">
      {#each actions as action (action.href)}
        <a href={resolve(action.href)}>
          <span class="dn-footer-actions__icon" aria-hidden="true"><OriginalActionIcon name={action.icon} /></span>
          <span><strong>{action.title}</strong><small>{action.description}</small></span>
        </a>
      {/each}
    </div>
  </section>
{/if}

<footer class={['dn-footer', { 'dn-footer--mobile-hidden': !showMobileFooter }]}>
  <div class="container dn-footer__grid">
    <div class="dn-footer__intro">
      <a class="dn-footer__logo" href={resolve('/')}><img src={brand.logo} alt={brand.name} width="220" height="58" /></a>
      <p>Градски автомобили, SUV, комби и електромобили от публикуваните обяви на {brand.name} във Варна.</p>
    </div>
    <nav aria-label="Автомобили">
      <strong>Автомобили</strong>
      <a href={resolve('/listing-grid')}>Всички автомобили</a>
      <a href={resolve('/listing-grid?condition=used')}>Употребявани</a>
      <a href={resolve('/listing-grid?sort=newest')}>По година</a>
    </nav>
    <nav aria-label="Компания">
      <strong>Компания</strong>
      <a href={resolve('/about-us')}>За нас</a>
      <a href={resolve('/blog')}>Полезно</a>
      <a href={resolve('/contact')}>Контакти</a>
    </nav>
    <div class="dn-footer__contact" aria-label="Контакт с продавача">
      <a {...phoneLinkAttributes} class="dn-footer__contact-link">
        <Icon name="phone" size={18} /><span class="dn-footer__phone">{brand.phone}</span><Icon name="arrow-right" size={16} />
      </a>
      <a href={resolve('/contact')} class="dn-footer__contact-link">
        <Icon name="map-pin" size={18} /><span>{brand.address}</span><Icon name="arrow-right" size={16} />
      </a>
      <p class="dn-footer__appointment">{brand.appointment}</p>
    </div>
  </div>
  <div class="container dn-footer__bottom"><span>{brand.name} · Преглед 08.09.2026</span><span>{dealerSource.previewNotice}</span></div>
</footer>
