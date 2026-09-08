<script lang="ts">
  import { resolve } from '$app/paths';
  import OriginalActionIcon from '$components/ui/icons/OriginalActionIcon.svelte';
  import Icon from '$components/ui/Icon.svelte';
  import { brand } from '$config/brand';

  let { showActions = true, showMobileFooter = false }: { showActions?: boolean; showMobileFooter?: boolean } = $props();
  const phoneLinkAttributes = { href: brand.phoneHref } as const;

  const actions = [
    {
      title: 'Featured vehicles',
      description: 'Browse the current selection',
      href: '/listing-grid',
      icon: 'car'
    },
    {
      title: `Viewing at ${brand.city}`,
      description: 'By appointment',
      href: '/contact?topic=inspection',
      icon: 'contact'
    },
    {
      title: 'Buyer-arranged funding',
      description: 'Ask about current terms',
      href: '/contact?topic=leasing',
      icon: 'finance'
    },
    {
      title: 'Import questions',
      description: 'Discuss your preferences with the team',
      href: '/contact?topic=import',
      icon: 'value'
    }
  ] as const;
</script>

{#if showActions}
  <section class="dn-footer-actions" aria-label="Next steps">
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
      <p>Browse featured vehicles and contact the team with questions. Import services are unconfirmed in this preview. No dealer financing or payment plans; buyers arrange their own funding.</p>
    </div>
    <nav aria-label="Vehicles">
      <strong>Vehicles</strong>
      <a href={resolve('/listing-grid')}>All vehicles</a>
      <a href={resolve('/listing-grid?condition=used')}>Used</a>
      <a href={resolve('/listing-grid?sort=newest')}>Latest listings</a>
    </nav>
    <nav aria-label="Company">
      <strong>Company</strong>
      <a href={resolve('/about-us')}>About us</a>
      <a href={resolve('/blog')}>Resources</a>
      <a href={resolve('/contact')}>Contact</a>
    </nav>
    <div class="dn-footer__contact" aria-label="Contact the team">
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
  <div class="container dn-footer__bottom"><span>© {new Date().getFullYear()} {brand.name}</span><span>Vehicles · Import questions · Buyer-arranged funding</span></div>
</footer>
