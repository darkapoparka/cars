<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import { leadSite } from '$config/lead-site';
  import type { ShellPresentation } from '$data/shell';
  import Header from './Header.svelte';
  import Footer from './Footer.svelte';

  let { children, presentation }: { children: Snippet; presentation: ShellPresentation } = $props();
  let footerIntersecting = $state(false);
  const observeFooter: Attachment<HTMLElement> = node => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      footerIntersecting = Boolean(entry?.isIntersecting && entry.intersectionRatio > 0.02);
    }, { threshold: [0, 0.02, 0.2] });
    observer.observe(node);
    return () => {
      observer.disconnect();
      footerIntersecting = false;
    };
  };
  const mobileFooterVisible = $derived(presentation.showMobileFooter && footerIntersecting);
</script>

<div
  class="dn-app-shell"
  data-route={presentation.route}
  data-contact-topic={presentation.contactTopic ?? undefined}
  data-journey={presentation.workflowJourney ? 'workflow' : undefined}
  data-mobile-bottom={presentation.mobileBottom}
  style:--dn-red={leadSite.theme.accent}
  style:--dn-red-hover={leadSite.theme.accentHover}
  style:--dn-workflow-canvas={leadSite.theme.workflowCanvas}
  style:--dn-theme-accent-rgb={leadSite.theme.accentRgb}
  style:--dn-theme-hero-surface={leadSite.theme.heroSurface}
  style:--dn-theme-hero-surface-deep={leadSite.theme.heroSurfaceDeep}
  style:--dn-theme-hero-surface-mid={leadSite.theme.heroSurfaceMid}
  style:--dn-theme-hero-accent-deep={leadSite.theme.heroAccentDeep}
  style:--dn-theme-contact-surface={leadSite.theme.contactSurface}
  style:--dn-theme-contact-surface-end={leadSite.theme.contactSurfaceEnd}
  style:--dn-theme-campaign-surface={leadSite.theme.campaignSurface}
  style:--dn-theme-campaign-accent={leadSite.theme.campaignAccent}
  style:--dn-theme-blog-hero-surface={leadSite.theme.blogHeroSurface}
  style:--dn-theme-action-blue-start={leadSite.theme.actionTones.blue[0]}
  style:--dn-theme-action-blue-end={leadSite.theme.actionTones.blue[1]}
  style:--dn-theme-action-red-start={leadSite.theme.actionTones.red[0]}
  style:--dn-theme-action-red-end={leadSite.theme.actionTones.red[1]}
  style:--dn-theme-action-ice-start={leadSite.theme.actionTones.ice[0]}
  style:--dn-theme-action-ice-end={leadSite.theme.actionTones.ice[1]}
  style:--dn-theme-action-ice-ink={leadSite.theme.actionTones.iceInk}
  style:--dn-theme-action-dark-start={leadSite.theme.actionTones.dark[0]}
  style:--dn-theme-action-dark-end={leadSite.theme.actionTones.dark[1]}
>
  <a class="dn-skip-link" href="#main-content">Към съдържанието</a>
  <Header presentation={presentation.header} {mobileFooterVisible} />
  <main id="main-content" data-layout={presentation.mainLayout} tabindex="-1">{@render children()}</main>
  <Footer showActions={presentation.showFooterActions} showMobileFooter={presentation.showMobileFooter} {observeFooter} />
</div>
