<script>
  import { brand, assets, services } from './data.js';
  import DealerSearch from './DealerSearch.svelte';
  import VehicleGrid from './VehicleGrid.svelte';
  import './Home.css';

  let { variant = 2 } = $props();
  const home = $derived([1, 2, 3, 4, 5].includes(Number(variant)) ? Number(variant) : 2);
</script>

{#snippet heroActions(light = false)}
  <div class="hero-btn">
    <a href="/car.html" class="theme-btn">Автомобили <i class="far fa-arrow-right" aria-hidden="true"></i></a>
    <a href="/contact.html" class={['dn-hero-contact', { 'dn-link-light': light }]}>Свържете се с нас <i class="far fa-arrow-up-right" aria-hidden="true"></i></a>
  </div>
{/snippet}

<div class={['dn-home', { 'dn-home-dark': home === 1 || home === 4 }]} data-home={home}>
  {#if home === 1}
    <section class="hero-section hs-1 hs-1-1 dn-hero-one" aria-labelledby="home-title">
      <div class="hero-single" style:background-image={`url(${assets.hero})`}>
        <div class="container">
          <div class="row align-items-center g-4">
            <div class="col-lg-6">
              <div class="hero-content">
                <p class="hero-sub-title">{brand.shortName} · {brand.city}</p>
                <h1 id="home-title" class="hero-title">Вашият следващ <span>автомобил.</span></h1>
                <p>Продажба, внос и лизинг. Изберете посоката, а за автомобила поговорете с нашия екип.</p>
                {@render heroActions(true)}
              </div>
            </div>
            <div class="col-lg-6">
              <div class="hero-img dn-hero-cutout">
                <span class="dn-hero-slash" aria-hidden="true"></span>
                <img src={assets.cutoutGclass} alt="Mercedes-Benz G-Class" fetchpriority="high" width="1000" height="650" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  {:else if home === 3}
    <section class="hero-section hs-3 dn-hero-three" aria-labelledby="home-title">
      <div class="hero-single">
        <div class="container dn-hero-center-layout">
          <div class="hero-content text-center dn-centered-intro">
            <p class="hero-sub-title">{brand.shortName} · {brand.city}</p>
            <h1 id="home-title" class="hero-title">Към следващия <span>автомобил.</span></h1>
            <p>Разгледайте моделите или ни кажете какво търсите.</p>
          </div>
          <div class="booking-form dn-hero-search">
            <DealerSearch compact />
          </div>
          <div class="hero-img dn-centered-car">
            <img src={assets.cutoutSilver} alt="Автомобил в сребрист цвят" fetchpriority="high" width="1100" height="600" />
          </div>
        </div>
      </div>
    </section>
  {:else if home === 4}
    <section class="hero-section hs-1 dn-hero-four" aria-labelledby="home-title">
      <div class="hero-single" style:background-image={`url(${assets.hero})`}>
        <div class="container">
          <div class="row align-items-center g-4 g-xl-5">
            <div class="col-lg-7">
              <div class="hero-content">
                <p class="hero-sub-title">{brand.shortName}</p>
                <h1 id="home-title" class="hero-title">Вашият избор. <br /> <span>Нашият екип.</span></h1>
                <p>Автомобили, внос и лизинг в {brand.city}. Разкажете ни какъв модел търсите.</p>
                {@render heroActions(true)}
              </div>
            </div>
            <div class="col-lg-5">
              <div class="booking-form dn-hero-search dn-hero-side-search">
                <DealerSearch compact />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  {:else if home === 5}
    <section class="hero-section hs-4 dn-hero-five" aria-labelledby="home-title">
      <div class="hero-single">
        <div class="container">
          <div class="hero-content text-center">
            <h1 id="home-title" class="hero-title">Автомобилът е <span>вашият избор.</span></h1>
            <div class="text-shape" aria-hidden="true"><span>Day &amp; Night</span></div>
            <div class="hero-img dn-wordmark-car">
              <img src={assets.cutoutUrus} alt="Lamborghini Urus" fetchpriority="high" width="1200" height="650" />
            </div>
            <p class="dn-hero-five-caption">Продажба · Внос · Лизинг · {brand.city}</p>
          </div>
        </div>
      </div>
    </section>
  {:else}
    <section class="hero-section hs-2 dn-hero-two" aria-labelledby="home-title">
      <div class="hero-single">
        <div class="container">
          <div class="row align-items-center g-4 g-xl-5">
            <div class="col-lg-6">
              <div class="hero-content">
                <p class="hero-sub-title">{brand.shortName}</p>
                <h1 id="home-title" class="hero-title">Автомобилът. <br /> <span>Вашият избор.</span></h1>
                <p>Продажба, внос и лизинг на автомобили. Разгледайте моделите и се свържете с екипа ни в {brand.city}.</p>
                {@render heroActions()}
              </div>
            </div>
            <div class="col-lg-6">
              <div class="hero-info-wrap dn-hero-image-stage">
                <div class="hero-avatar-group dn-location-callout">
                  <i class="far fa-location-dot" aria-hidden="true"></i>
                  <span>Автокъща в <strong>{brand.city}</strong></span>
                </div>
                <div class="hero-img">
                  <img src={assets.cutoutGraphite} alt="Автомобил в графитен цвят" fetchpriority="high" width="1000" height="650" />
                </div>
                <div class="hero-info dn-service-callout">
                  <i class="far fa-car-side" aria-hidden="true"></i>
                  <span>Внос и лизинг <br /> <strong>С {brand.shortName}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  {/if}

  {#if home === 1 || home === 2 || home === 5}
    <div class="booking-form ng-mt dn-home-search">
      <div class="container"><DealerSearch /></div>
    </div>
  {/if}

  <section class="car-area dn-home-stock" aria-labelledby="home-stock-title">
    <div class="container">
      <div class="dn-section-heading">
        <div class="site-heading mb-0">
          <span class="site-title-tagline">Автомобили</span>
          <h2 id="home-stock-title" class="site-title">Намерете <span>своя модел.</span></h2>
          <p>Представени модели. Попитайте екипа за актуални наличности и цени.</p>
        </div>
        <a href="/car.html" class="dn-text-link">Всички автомобили <i class="far fa-arrow-right" aria-hidden="true"></i></a>
      </div>
      <VehicleGrid limit={6} />
    </div>
  </section>

  <section class="about-area dn-home-about" aria-labelledby="home-about-title">
    <div class="container">
      <div class="row align-items-center g-4 g-lg-5">
        <div class="col-lg-6">
          <div class="about-left dn-about-images">
            <div class="about-img"><img src={assets.showroom} alt={brand.name} loading="lazy" width="800" height="700" /></div>
            <img class="dn-about-detail" src={assets.aboutDetail} alt="" loading="lazy" width="400" height="320" />
            <div class="dn-about-location"><i class="far fa-location-dot" aria-hidden="true"></i><span>{brand.city}</span></div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="about-right">
            <div class="site-heading mb-0">
              <span class="site-title-tagline">За {brand.shortName}</span>
              <h2 id="home-about-title" class="site-title">Срещаме се около <span>автомобилите.</span></h2>
            </div>
            <p class="dn-about-copy">Търсите конкретен модел, планирате внос или искате да обсъдите лизинг? Свържете се с {brand.shortName} и разкажете какъв автомобил търсите.</p>
            <ul class="dn-about-services">
              <li><i class="far fa-check" aria-hidden="true"></i>Продажба на автомобили</li>
              <li><i class="far fa-check" aria-hidden="true"></i>Запитвания за внос</li>
              <li><i class="far fa-check" aria-hidden="true"></i>Възможности за лизинг</li>
            </ul>
            <a href="/about.html" class="theme-btn">За автокъщата <i class="far fa-arrow-right" aria-hidden="true"></i></a>
          </div>
        </div>
      </div>
    </div>
  </section>

  {#if services.length}
    <section class="service-area dn-home-services" aria-labelledby="home-services-title">
      <div class="container">
        <div class="site-heading dn-services-heading">
          <span class="site-title-tagline">Как можем да помогнем</span>
          <h2 id="home-services-title" class="site-title">От избора <span>до разговора.</span></h2>
        </div>
        <div class="dn-service-grid">
          {#each services as service (service.id)}
            <a href={service.href} class="service-item dn-service-item">
              <div class="service-icon"><i class={`fal fa-${service.icon}`} aria-hidden="true"></i></div>
              <h3 class="service-title">{service.title}</h3>
              <p>{service.description}</p>
              <span class="dn-service-link">Научете повече <i class="far fa-arrow-right" aria-hidden="true"></i></span>
            </a>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  <section class="cta-area dn-home-cta" aria-labelledby="home-enquiry-title">
    <div class="container">
      <div class="cta-wrap">
        <div class="cta-text">
          <h2 id="home-enquiry-title">Да обсъдим вашия автомобил.</h2>
          <p>Имате модел предвид? Свържете се с {brand.shortName}.</p>
        </div>
        <div class="dn-cta-actions">
          <a href={brand.phoneHref} class="theme-btn"><i class="far fa-phone" aria-hidden="true"></i>{brand.phone}</a>
          <a href="/contact.html" class="dn-cta-contact">Контакти и адрес <i class="far fa-arrow-right" aria-hidden="true"></i></a>
        </div>
      </div>
    </div>
  </section>
</div>
