<script lang="ts">
  import { resolve } from '$app/paths';
  import type { Attachment } from 'svelte/attachments';
  import { trapDialogTab } from '$lib/ui/overlay';
  import { brand } from '$config/brand';
  import Icon from '$components/ui/Icon.svelte';
  import SocialBrandIcon from '$components/company/SocialBrandIcon.svelte';
  import MobileNavIcon from './MobileNavIcon.svelte';
  import type { HeaderPresentation } from '$data/shell';
  let { closeMobile, attachMobileMenu, attachMobileCloseButton, active }: {
    closeMobile: (restoreFocus?: boolean) => Promise<void>;
    attachMobileMenu: Attachment<HTMLDialogElement>;
    attachMobileCloseButton: Attachment<HTMLButtonElement>;
    active: HeaderPresentation['mobileMenu'];
  } = $props();
  const phoneLinkAttributes = { href: brand.phoneHref } as const;
</script>
      <dialog
        class="dn-mobile-menu"
        id="dn-mobile-menu"
        aria-labelledby="dn-mobile-menu-title"
        tabindex="-1"
        {@attach attachMobileMenu}
        onkeydown={trapDialogTab}
        oncancel={(event) => { event.preventDefault(); void closeMobile(); }}
        onclick={(event) => { if (event.target === event.currentTarget) void closeMobile(); }}
      >
        <h2 class="dn-sr-only" id="dn-mobile-menu-title">Основна навигация</h2>
        <div class="dn-mobile-menu__header">
          <a class="dn-mobile-menu__brand" href={resolve('/')} aria-label={`${brand.name} — начало`} onclick={() => void closeMobile(false)}>
            <img src={brand.logo} alt={brand.name} width="160" height="44" />
          </a>
        <button
          class="dn-mobile-menu__close"
          type="button"
          {@attach attachMobileCloseButton}
          aria-label="Затворете менюто"
          onclick={() => closeMobile()}
        ><MobileNavIcon name="close" size={20} /></button>
        </div>
        <div class="dn-mobile-menu__contact">
          <a class="dn-mobile-menu__call" {...phoneLinkAttributes} aria-label={`Обади се на ${brand.phone}`} title={brand.phone}><MobileNavIcon name="phone" size={20} /><span>Обади се</span></a>
          <a href={resolve('/contact#contact-location-title')} onclick={() => void closeMobile(false)} aria-label={`Локация: ${brand.address}`}><MobileNavIcon name="location" size={20} /><span>Локация</span></a>
        </div>
        <nav aria-label="Мобилна навигация">
          <a href={resolve('/listing-grid')} aria-current={active.listing ? 'page' : undefined} onclick={() => void closeMobile(false)}><MobileNavIcon name="cars" size={20} /><span>Всички автомобили</span><Icon name="arrow-right" size={16} /></a>
          <a href={resolve('/blog')} aria-current={active.blog ? 'page' : undefined} onclick={() => void closeMobile(false)}><Icon name="file-invoice" size={20} /><span>Съвети за покупка</span><Icon name="arrow-right" size={16} /></a>
          <a href={resolve('/about-us')} aria-current={active.about ? 'page' : undefined} onclick={() => void closeMobile(false)}><MobileNavIcon name="home" size={20} /><span>За нас</span><Icon name="arrow-right" size={16} /></a>
          <a href={resolve('/contact')} onclick={() => void closeMobile(false)}><MobileNavIcon name="location" size={20} /><span>Контакти и посещение</span><Icon name="arrow-right" size={16} /></a>
        </nav>
        <div class="dn-mobile-menu__social" aria-label="Социални мрежи">
          <a {...{ href: brand.instagramUrl }} target="_blank" rel="noopener noreferrer"><SocialBrandIcon name="instagram" /><span>Instagram</span></a>
          <a {...{ href: brand.youtubeUrl }} target="_blank" rel="noopener noreferrer"><SocialBrandIcon name="youtube" /><span>YouTube</span></a>
          <a {...{ href: brand.facebookUrl }} target="_blank" rel="noopener noreferrer"><SocialBrandIcon name="facebook" /><span>Facebook</span></a>
        </div>
        <p class="dn-mobile-menu__address">{brand.addressLine}</p>
      </dialog>
<style>
  .dn-mobile-menu { position: fixed; inset: auto 0 0; width: 100%; max-width: none; max-height: calc(100dvh - 68px); margin: 0; padding: var(--dn-space-4) var(--dn-space-5) calc(var(--dn-space-5) + env(safe-area-inset-bottom)); overflow-y: auto; border: 0; border-radius: var(--dn-radius-lg) var(--dn-radius-lg) 0 0; background: var(--dn-white); color: var(--dn-ink); }
  .dn-mobile-menu[open] { display: flex; flex-direction: column; }
  .dn-mobile-menu::backdrop { background: rgb(10 13 18 / .54); }
  .dn-mobile-menu::before { content: ''; width: 36px; height: var(--dn-space-1); flex-shrink: 0; margin: 0 auto var(--dn-space-3); border-radius: var(--dn-pill); background: var(--dn-line); }
  .dn-mobile-menu__header { position: relative; display: flex; flex-shrink: 0; align-items: center; justify-content: center; min-height: var(--dn-control-hit-height); }
  .dn-mobile-menu__brand { display: inline-flex; align-items: center; min-height: var(--dn-control-hit-height); }
  .dn-mobile-menu__brand img { display: block; width: 160px; height: 44px; object-fit: contain; }
  .dn-mobile-menu__close { position: absolute; right: 0; display: grid; width: var(--dn-control-hit-height); height: var(--dn-control-hit-height); place-items: center; border: 0; border-radius: var(--dn-pill); background: var(--dn-home-panel); color: var(--dn-ink); cursor: pointer; }
  .dn-mobile-menu__contact { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--dn-space-3); margin-top: var(--dn-space-5); }
  .dn-mobile-menu__contact a { display: flex; align-items: center; justify-content: center; gap: var(--dn-space-2); min-height: var(--dn-entry-action-height); padding: var(--dn-space-2); border: 1px solid transparent; border-radius: var(--dn-pill); background: var(--dn-red); color: var(--dn-white); font: var(--dn-control-font); }
  .dn-mobile-menu__contact a:hover { background: var(--dn-red-hover); }
  .dn-mobile-menu__contact .dn-mobile-menu__call { background: var(--dn-ink); }
  .dn-mobile-menu__contact .dn-mobile-menu__call:hover { background: var(--dn-ink-hover); }
  nav { display: grid; gap: var(--dn-space-2); margin-top: var(--dn-space-5); }
  nav a { display: flex; align-items: center; gap: var(--dn-space-3); min-height: var(--dn-entry-height); padding: var(--dn-space-3) var(--dn-space-4); border-radius: var(--dn-radius-control); background: var(--dn-home-panel); color: var(--dn-ink); font: var(--dn-control-font); }
  nav a span { flex: 1; }
  nav a[aria-current='page'] { background: var(--dn-line); }
  a { text-decoration: none; }
  a:hover { background: var(--dn-line); }
  :is(a, button):focus-visible { outline: 2px solid var(--dn-focus); outline-offset: 2px; }
  .dn-mobile-menu__social { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--dn-space-2); margin-top: var(--dn-space-5); }
  .dn-mobile-menu__social a { display: grid; justify-items: center; align-content: center; gap: var(--dn-space-1); min-height: var(--dn-control-hit-height); padding: var(--dn-space-2) var(--dn-space-half); border-radius: var(--dn-radius-sm); color: var(--dn-muted); font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); }
  .dn-mobile-menu__address { margin: var(--dn-space-4) 0 0; color: var(--dn-muted); font-size: var(--dn-text-meta); line-height: var(--dn-leading-body); text-align: center; }
</style>
