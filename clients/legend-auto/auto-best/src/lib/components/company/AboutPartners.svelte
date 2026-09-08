<script lang="ts">
  import { demoContentLabel, demoPartnerIntro, demoPartners } from '$data/demo-content';
</script>

<section class="dn-about-partners" aria-labelledby="about-partners-title" data-demo-content="true">
  <div class="container">
    <header class="dn-about-partners__heading">
      <h2 id="about-partners-title">Автомобилни марки</h2>
      <p><span class="dn-about-demo-note">{demoContentLabel}</span> · {demoPartnerIntro}</p>
    </header>

    <ul class="dn-about-partners__grid" aria-label="Демо партньорски лога">
      {#each demoPartners as partner (partner.id)}
        <li>
          <img
            src={partner.image}
            alt={`Демо лого: ${partner.name}`}
            width="180"
            height="80"
            loading="lazy"
            decoding="async"
          />
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  .dn-about-partners {
    padding: 0 0 96px;
    background: #fff;
  }

  .dn-about-partners > .container {
    width: min(1296px, calc(100% - 48px));
  }

  .dn-about-partners__heading {
    display: grid;
    justify-items: center;
    max-width: 700px;
    margin: 0 auto;
    text-align: center;
  }

  .dn-about-demo-note { font-weight: 600; }

  .dn-about-partners__heading h2 {
    margin: 0;
    color: #111;
    font-size: clamp(30px, 3vw, 42px);
    font-weight: 650;
    line-height: 1.1;
    letter-spacing: -0.035em;
  }

  .dn-about-partners__heading p {
    max-width: 640px;
    margin: 14px 0 0;
    color: #6e6e6e;
    font-size: var(--dn-text-body);
    line-height: var(--dn-leading-body);
  }

  .dn-about-partners__grid {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 28px;
    margin: 38px 0 0;
    padding: 0;
    list-style: none;
  }

  .dn-about-partners__grid li {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 90px;
  }

  .dn-about-partners__grid img {
    display: block;
    width: min(100%, 180px);
    height: 70px;
    object-fit: contain;
    opacity: 0.74;
    filter: grayscale(1);
  }

  @media (max-width: 1000px) {
    .dn-about-partners__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 767px) {
    .dn-about-partners {
      padding: 0 0 32px;
      background: var(--dn-mobile-canvas);
    }
    .dn-about-partners__heading { justify-items: start; text-align: left; }
    .dn-about-partners__heading h2 { margin-top: 12px; font-size: 22px; }
    .dn-about-partners__heading p { margin-top: 8px; font-size: 14px; line-height: 1.5; }

    .dn-about-partners > .container {
      width: min(100% - 24px, 1296px);
    }

    .dn-about-partners__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px 12px;
      margin-top: 16px;
    }

    .dn-about-partners__grid li {
      min-height: 72px;
      padding: 8px 12px;
      border-radius: 12px;
      background: #fff;
    }

    .dn-about-partners__grid img {
      height: 58px;
    }
  }
</style>
