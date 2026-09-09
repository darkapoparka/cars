<script lang="ts">
  import { resolve } from '$app/paths';
  import StorefrontShell from '$lib/components/layout/StorefrontShell.svelte';
  import SiteChrome from '$lib/components/layout/SiteChrome.svelte';
  import DayNightFooter from '$lib/components/layout/DayNightFooter.svelte';
  import { daynightSite } from '$lib/data/daynight-site';

  let { eyebrow, title, description }: { eyebrow: string; title: string; description: string } = $props();
</script>

<svelte:head>
  <title>{title} · {daynightSite.shortName}</title>
  <meta name="description" content={description} />
</svelte:head>

<StorefrontShell>
  <SiteChrome />
  <main class="safe-service">
    <section>
      <p class="safe-service__eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <div class="safe-service__notice">
        Публичните източници за тази демонстрация не потвърждават тази услуга. Не показваме измислени условия, одобрения, доставки или оферти. Уточнете възможностите директно с автокъщата.
      </div>
      <div class="safe-service__actions">
        <a class="primary" href={`tel:${daynightSite.phone}`}>{daynightSite.phoneLabel}</a>
        <a href={resolve('/inventory')}>Виж автомобили</a>
      </div>
    </section>
  </main>
  <DayNightFooter />
</StorefrontShell>

<style>
  .safe-service { min-height: 60dvh; display: grid; place-items: center; padding: 48px 20px; background: #f5f6f7; }
  .safe-service section { width: min(920px, 100%); background: #fff; border: 1px solid #e3e6ea; border-radius: 18px; padding: 32px; }
  .safe-service__eyebrow { margin: 0; color: #b80024; font-weight: 700; }
  .safe-service h1 { margin: 8px 0 14px; font-size: clamp(30px, 5vw, 52px); line-height: 1.08; }
  .safe-service section > p:not(.safe-service__eyebrow) { max-width: 720px; line-height: 1.7; color: #626a75; }
  .safe-service__notice { margin-top: 20px; padding: 16px; border-radius: 12px; background: #f1f3f5; line-height: 1.6; }
  .safe-service__actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
  .safe-service__actions a { display: inline-flex; min-height: 44px; align-items: center; padding: 0 18px; border-radius: 10px; border: 1px solid #202329; color: #202329; font-weight: 650; }
  .safe-service__actions .primary { background: #202329; color: #fff; }
</style>
