<script lang="ts">
  import { resolve } from '$app/paths';
  import { brand } from '$config/brand';
  import { demoContentLabel, demoTeamIntro, demoTeamMembers } from '$data/demo-content';
  import Icon from '$components/ui/Icon.svelte';

  const phoneLinkAttributes = { href: brand.phoneHref } as const;
</script>

<section class="dn-about-team" aria-labelledby="about-team-title" data-demo-content="true">
  <div class="container">
    <header class="dn-about-team__heading">
      <h2 id="about-team-title">Team</h2>
      <p><span class="dn-about-demo-note">{demoContentLabel}</span> · {demoTeamIntro}</p>
    </header>

    <div class="dn-about-team__grid">
      {#each demoTeamMembers as member (member.id)}
        <article class="dn-about-team-card">
          <div class="dn-about-team-card__media">
            <img
              src={member.image}
              alt={`Preview profile: ${member.name}`}
              width="450"
              height="450"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div class="dn-about-team-card__details">
            <div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
            <div class="dn-about-team-card__actions">
              <a {...phoneLinkAttributes} aria-label={`Call ${brand.name}`}>
                <Icon name="phone" size={16} strokeWidth={1.8} />
              </a>
              <a href={resolve('/contact')} aria-label={`Draft an inquiry to ${brand.name}`}>
                <Icon name="mail" size={16} strokeWidth={1.8} />
              </a>
            </div>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .dn-about-team {
    padding: 34px 0 96px;
    background: #fff;
  }

  .dn-about-team > .container {
    width: min(1296px, calc(100% - 48px));
  }

  .dn-about-team__heading {
    display: grid;
    justify-items: center;
    max-width: 700px;
    margin: 0 auto;
    text-align: center;
  }

  .dn-about-demo-note { font-weight: 600; }

  .dn-about-team__heading h2 {
    margin: 0;
    color: #111;
    font-size: clamp(30px, 3vw, 42px);
    font-weight: 650;
    line-height: 1.1;
    letter-spacing: -0.035em;
  }

  .dn-about-team__heading p {
    max-width: 640px;
    margin: 14px 0 0;
    color: #6e6e6e;
    font-size: var(--dn-text-body);
    line-height: var(--dn-leading-body);
  }

  .dn-about-team__grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 24px;
    margin-top: 40px;
  }

  .dn-about-team-card__media {
    position: relative;
    overflow: hidden;
    aspect-ratio: 1;
    border-radius: 10px;
    background: #f2f2f2;
  }

  .dn-about-team-card__media img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }









  .dn-about-team-card__details {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding-top: 18px;
  }

  .dn-about-team-card h3 {
    margin: 0;
    color: #151515;
    font-size: var(--dn-text-card);
    font-weight: 650;
    line-height: 1.25;
  }

  .dn-about-team-card p {
    margin: 5px 0 0;
    color: #707070;
    font-size: var(--dn-text-meta);
    line-height: var(--dn-leading-meta);
  }

  .dn-about-team-card__actions {
    display: flex;
    flex: 0 0 auto;
    gap: 8px;
  }

  .dn-about-team-card__actions a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: 1px solid #dedede;
    border-radius: var(--dn-radius-button);
    color: #202020;
    background: #fff;
    transition: border-color 160ms ease, color 160ms ease, background-color 160ms ease;
  }

  .dn-about-team-card__actions a:hover,
  .dn-about-team-card__actions a:focus-visible {
    border-color: var(--dn-red);
    color: #fff;
    background: var(--dn-red);
    outline: none;
  }

  @media (max-width: 900px) {
    .dn-about-team__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 767px) {
    .dn-about-team {
      padding: 0 0 32px;
      background: var(--dn-mobile-canvas);
    }
    .dn-about-team__heading { justify-items: start; text-align: left; }
    .dn-about-team__heading h2 { margin-top: 12px; font-size: 22px; }
    .dn-about-team__heading p { margin-top: 8px; font-size: 14px; line-height: 1.5; }
    .dn-about-team-card { overflow: hidden; border-radius: 16px; background: #fff; }

    .dn-about-team > .container {
      width: min(100% - 24px, 1296px);
    }

    .dn-about-team__grid {
      gap: 24px 12px;
      margin-top: 16px;
    }

    .dn-about-team-card__details {
      display: grid;
      gap: 10px;
      padding: 12px;
    }

    .dn-about-team-card h3 {
      font-size: 16px;
    }

    .dn-about-team-card p {
      font-size: var(--dn-text-meta);
    }

    .dn-about-team-card__actions a {
      width: 44px;
      height: 44px;
    }
  }

  @media (hover: none) {
  
  }

  @media (prefers-reduced-motion: reduce) {
  
  }
</style>
