<script lang="ts">
  import { asset } from '$app/paths';
  import Icon from '$components/ui/Icon.svelte';
  import { brand } from '$config/brand';

  let { topic }: { topic: 'trade-in' | 'import' } = $props();
</script>

<aside class="dn-workflow-support" aria-labelledby="workflow-support-title">
  <div class="dn-workflow-support__copy">
    <h2 id="workflow-support-title">Имаш въпроси?</h2>
    <p>{topic === 'import' ? 'Помагаме с обявата и избора на автомобил.' : 'Помагаме с оценката и следващите стъпки.'}</p>
    <a class="dn-workflow-support__call" href={brand.phoneHref} aria-label={`Обади се на ${brand.phone}`}>
      Обади се <Icon name="arrow-right" size={18} />
    </a>
  </div>
  <img src={asset('/assets/images/lead/day-night-contact-phone-red-v1.webp')} alt="" width="900" height="1352" />
</aside>

<style>
  .dn-workflow-support { position: relative; isolation: isolate; overflow: hidden; grid-column: 1 / -1; width: 100%; margin-top: var(--dn-space-4); border-radius: var(--dn-radius-lg); background: var(--dn-ink); color: var(--dn-white); }
  .dn-workflow-support__copy { position: relative; z-index: 1; width: 68%; padding: var(--dn-space-5) 0 var(--dn-space-3) var(--dn-space-4); }
  h2 { margin: 0; font-size: var(--dn-text-lead); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-heading); }
  p { margin: var(--dn-space-2) 0 0; color: var(--dn-muted-on-ink); font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); }
  a { display: inline-flex; align-items: center; gap: var(--dn-space-2); min-height: var(--dn-control-hit-height); color: var(--dn-white); font: var(--dn-control-font); }
  a:hover { text-decoration: underline; text-underline-offset: var(--dn-space-1); }
  a:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 2px; border-radius: var(--dn-radius-sm); }
  img { position: absolute; z-index: 0; inset: 0 0 0 auto; width: 36%; height: 100%; object-fit: cover; object-position: center 20%; mask-image: linear-gradient(to right, transparent, black 28%); }
  @media (max-width: 767px) {
    .dn-workflow-support__copy { padding-block: var(--dn-space-3); }
    p { display: none; }
    img { object-position: center 8%; }
  }
  @media (min-width: 768px) {
    .dn-workflow-support__copy { padding: var(--dn-space-6); }
    h2 { font-size: var(--dn-text-subheading); }
    p { font-size: var(--dn-text-body); }
    img { width: 30%; object-position: center 8%; }
  }
</style>
