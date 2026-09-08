<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import type { Attachment } from 'svelte/attachments';
  import { trapDialogTab } from '$lib/ui/overlay';
  import { brand, dealerSource } from '$config/brand';
  import Icon from '$components/ui/Icon.svelte';
  import SocialBrandIcon from '$components/company/SocialBrandIcon.svelte';
  import MobileNavIcon from './MobileNavIcon.svelte';
  let { closeMobile, attachMobileMenu, attachMobileCloseButton, listingHeader }: {
    closeMobile: (restoreFocus?: boolean) => Promise<void>;
    attachMobileMenu: Attachment<HTMLDialogElement>;
    attachMobileCloseButton: Attachment<HTMLButtonElement>;
    listingHeader: boolean;
  } = $props();
  const phoneLinkAttributes = { href: brand.phoneHref } as const;
</script>

<dialog class="dn-mobile-menu" id="dn-mobile-menu" aria-labelledby="dn-mobile-menu-title" tabindex="-1"
  {@attach attachMobileMenu} onkeydown={trapDialogTab}
  oncancel={event => { event.preventDefault(); void closeMobile(); }}
  onclick={event => { if (event.target === event.currentTarget) void closeMobile(); }}>
  <h2 class="dn-sr-only" id="dn-mobile-menu-title">Основна навигация</h2>
  <div class="dn-mobile-menu__header">
    <a class="dn-mobile-menu__brand" href={resolve('/')} aria-label={`${brand.name} — начало`} onclick={() => void closeMobile(false)}>
      <img src={brand.logo} alt={brand.name} width="160" height="44" />
    </a>
    <button class="dn-mobile-menu__close" type="button" {@attach attachMobileCloseButton} aria-label="Затворете менюто" onclick={() => closeMobile()}><MobileNavIcon name="close" size={20} /></button>
  </div>
  <div class="dn-mobile-menu__contact">
    <a class="dn-mobile-menu__call" {...phoneLinkAttributes}><MobileNavIcon name="phone" size={20} /><strong>Обадете се</strong><span>{brand.phone}</span></a>
    <a href={resolve('/contact#contact-location-title')} onclick={() => void closeMobile(false)}><MobileNavIcon name="location" size={20} /><strong>Локация</strong><span>{brand.city}</span></a>
  </div>
  <nav aria-label="Мобилна навигация">
    <a href={resolve('/listing-grid')} aria-current={listingHeader ? 'page' : undefined} onclick={() => void closeMobile(false)}><MobileNavIcon name="cars" size={20} /><span>Всички автомобили</span><Icon name="arrow-right" size={16} /></a>
    <a href={resolve('/blog')} aria-current={page.url.pathname.startsWith('/blog') ? 'page' : undefined} onclick={() => void closeMobile(false)}><Icon name="file-invoice" size={20} /><span>Полезно преди оглед</span><Icon name="arrow-right" size={16} /></a>
    <a href={resolve('/about-us')} aria-current={page.url.pathname === '/about-us' ? 'page' : undefined} onclick={() => void closeMobile(false)}><MobileNavIcon name="home" size={20} /><span>За нас</span><Icon name="arrow-right" size={16} /></a>
    <a href={resolve('/contact')} onclick={() => void closeMobile(false)}><MobileNavIcon name="location" size={20} /><span>Контакти и посещение</span><Icon name="arrow-right" size={16} /></a>
  </nav>
  {#if brand.instagramUrl || brand.youtubeUrl || brand.facebookUrl}
    <div class="dn-mobile-menu__social" aria-label="Социални мрежи">
      {#if brand.instagramUrl}<a href={brand.instagramUrl} target="_blank" rel="noopener noreferrer"><SocialBrandIcon name="instagram" /><span>Instagram</span></a>{/if}
      {#if brand.youtubeUrl}<a href={brand.youtubeUrl} target="_blank" rel="noopener noreferrer"><SocialBrandIcon name="youtube" /><span>YouTube</span></a>{/if}
      {#if brand.facebookUrl}<a href={brand.facebookUrl} target="_blank" rel="noopener noreferrer"><SocialBrandIcon name="facebook" /><span>Facebook</span></a>{/if}
    </div>
  {/if}
  <p class="dn-mobile-menu__address">{brand.addressLine}<br />{dealerSource.previewNotice}</p>
</dialog>

<style>
  .dn-mobile-menu { top: auto; width: 100%; max-width: none; margin: 0; border: 0; }
  .dn-mobile-menu::backdrop { background: rgb(10 13 18 / .54); }
  @media (max-width: 991px) {
    .dn-mobile-menu::before { content: ''; width: 36px; height: 4px; flex-shrink: 0; margin: -6px auto 16px; border-radius: 4px; background: #dfe2e6; }
    .dn-mobile-menu__header { position: relative; justify-content: center; min-height: 44px; }
    .dn-mobile-menu__close { position: absolute; right: 0; }
    .dn-mobile-menu__contact { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 20px; }
    .dn-mobile-menu__contact a { display: grid; grid-template-columns: 20px 1fr; align-items: center; gap: 6px 8px; padding: 16px 12px; border-radius: 14px; background: #f3f4f6; color: #202329; font-size: 14px; }
    .dn-mobile-menu__contact span { grid-column: 1 / -1; font-size: 14px; }
    .dn-mobile-menu__contact .dn-mobile-menu__call { background: var(--dn-red); color: #fff; }
    .dn-mobile-menu nav { margin-top: 16px; }
    .dn-mobile-menu nav a { min-height: 52px; gap: 12px; font-size: 15px; font-weight: 600; }
    .dn-mobile-menu nav a span { flex: 1; }
    .dn-mobile-menu__social { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; padding-top: 16px; margin-top: 16px; border-top: 1px solid #e7e8eb; }
    .dn-mobile-menu__social a { display: grid; justify-items: center; gap: 6px; padding: 10px 4px; border-radius: 12px; background: #f3f4f6; color: #202329; font-size: 12px; }
    .dn-mobile-menu__address { margin: 16px 0 0; color: #626873; font-size: 12px; line-height: 1.5; }
  }
</style>
