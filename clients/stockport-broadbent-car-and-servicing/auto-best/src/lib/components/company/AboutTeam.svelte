<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  import { resolve } from '$app/paths';
  import { demoTeamMembers } from '$data/demo-content';
  import Icon from '$components/ui/Icon.svelte';

  const i18n = getI18n();
</script>

<section class="dn-about-team" aria-labelledby="about-team-title" data-demo-content="true">
  <div class="container dn-about-team__panel">
    <header class="dn-about-team__heading">
      <div class="dn-about-team__heading-copy">
        <h2 id="about-team-title">{i18n.t('company.team.title')}</h2>
        <p>{i18n.t('company.team.demo')}</p>
      </div>
      <a
        class="dn-about-team__contact dn-about-team__section-contact"
        href={i18n.href(resolve('/contact'))}
        aria-describedby="about-team-title"
      >
        {i18n.t('company.team.contactUs')}<Icon name="arrow-right" size={16} />
      </a>
    </header>
    <div class="dn-about-team__grid">
      {#each demoTeamMembers as member (member.id)}
        <article class="dn-about-team-card">
          <picture class="dn-about-team-card__media">
            <source media="(min-width: 992px)" srcset={member.image} />
            <img
              src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
              alt={i18n.t('m_6b903e11850f', { p0: member.name })}
              width="450"
              height="450"
              loading="lazy"
              decoding="async"
            />
          </picture>
          <div class="dn-about-team-card__details">
            <div class="dn-about-team-card__heading">
              <h3 id={`about-team-${member.id}`}>{member.name}</h3>
              <a
                class="dn-about-team__contact"
                href={i18n.href(resolve('/contact'))}
                aria-describedby={`about-team-${member.id}`}
              >
                {i18n.t('company.team.contact')}
              </a>
            </div>
            <p>{i18n.t(member.role)}</p>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .dn-about-team { display: none; }

  @media (min-width: 992px) {
    .dn-about-team { display: block; padding: 0 0 var(--dn-space-8); background: var(--dn-surface-canvas); }
    .dn-about-team__panel { width: min(1296px, calc(100% - 48px)); padding: var(--dn-space-8); border-radius: var(--dn-radius-lg); background: var(--dn-surface-raised); }
    .dn-about-team__heading { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--dn-space-4) var(--dn-space-6); }
    .dn-about-team__heading-copy { flex: 1 1 16rem; min-width: 0; }
    .dn-about-team__heading h2 { margin: 0; color: var(--dn-ink); font-size: var(--dn-text-section-compact); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-section); letter-spacing: var(--dn-tracking-heading); }
    .dn-about-team__heading p { margin: var(--dn-space-2) 0 0; color: var(--dn-muted); font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); }
    .dn-about-team__contact {
      display: inline-flex;
      flex: none;
      max-width: 100%;
      min-height: calc(var(--dn-text-card) * var(--dn-leading-card));
      align-items: center;
      justify-content: center;
      padding: var(--dn-space-1) var(--dn-space-2);
      border-radius: var(--dn-radius-button);
      background: var(--dn-ink);
      color: var(--dn-white);
      font: var(--dn-control-font);
      font-size: var(--dn-text-meta);
      transition: background-color 160ms ease;
    }
    .dn-about-team__contact:hover,
    .dn-about-team-card:focus-within .dn-about-team__contact,
    .dn-about-team__contact:focus-visible { background: var(--dn-red); }
    .dn-about-team__contact:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: 3px; }
    .dn-about-team__section-contact { min-height: var(--dn-control-height-compact); gap: var(--dn-space-2); padding: var(--dn-space-2) var(--dn-space-4); font-size: var(--dn-text-body); }
    .dn-about-team__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--dn-space-6); margin-top: var(--dn-space-6); }
    .dn-about-team-card { display: flex; flex-direction: column; min-width: 0; overflow: hidden; border: 1px solid var(--dn-line); border-radius: var(--dn-radius-lg); background: var(--dn-surface-raised); box-shadow: var(--dn-card-shadow-subtle); }
    .dn-about-team-card__media { display: block; flex: none; width: 100%; max-height: 240px; overflow: hidden; aspect-ratio: 4 / 3; background: var(--dn-surface-subtle); }
    .dn-about-team-card__media img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center top; }
    .dn-about-team-card__details { flex: 1; padding: var(--dn-space-4); }
    .dn-about-team-card__heading { display: flex; flex-wrap: wrap; align-items: center; gap: var(--dn-space-3); }
    .dn-about-team-card h3 { flex: 1 1 8rem; min-width: 0; margin: 0; color: var(--dn-ink); font-size: var(--dn-text-card); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-card); overflow-wrap: anywhere; }
    .dn-about-team-card p { margin: var(--dn-space-1) 0 0; color: var(--dn-muted); font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); }
  }

  @media (min-width: 992px) and (max-width: 1359px) {
    .dn-about-team__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  @media (min-width: 992px) and (hover: hover) {
    .dn-about-team-card:hover .dn-about-team__contact { background: var(--dn-red); }
  }

  @media (prefers-reduced-motion: reduce) {
    .dn-about-team__contact { transition: none; }
  }
</style>
