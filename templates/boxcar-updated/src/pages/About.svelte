<script lang="ts">
  import { brand } from "../data/brand";
  import Icon from "../components/Icon.svelte";
  const benefits = [
    [
      "choice",
      "Find your fit",
      "Explore makes and budgets to find your ideal car.",
    ],
    [
      "pricing",
      "See the details",
      "Compare prices, mileage and details before you shortlist.",
    ],
    [
      "finance",
      "Plan your budget",
      "Plan monthly payments with our finance calculator.",
    ],
    [
      "care",
      "Take the next step",
      "Ask about a car and arrange a showroom viewing.",
    ],
  ];
  const questions = [
    [
      "Can I save cars and come back later?",
      "Yes. Use the bookmark on a car to add it to Saved. Your shortlist stays in this browser when browser storage is available.",
    ],
    [
      "How do I compare my shortlist?",
      "Select Compare on a car card. Add up to four cars, then open the comparison to see their specifications together.",
    ],
    [
      "How do I arrange a viewing?",
      "Open Contact and prepare an enquiry about the car you have in mind. This demonstration previews the message; it does not send it or book a viewing.",
    ],
  ];
</script>

<!-- Boxcar gallery and illustrations with one centered dealer introduction. -->
<section class="bc-inner about-inner-one">
  <div class="bc-container">
    <nav class="bc-breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span>/</span>
      <span aria-current="page">About us</span>
    </nav>
    <div class="bc-about-intro">
      <h1 class="bc-page-title">About {brand.name}</h1>
      <p>
        Browse our cars and compare your favourites before your next viewing.
      </p>
    </div>
    <div class="galler-section" aria-label="Showroom photo gallery">
      <div class="exp-block">
        <div class="exp-box">
          <span>{brand.name}</span>
          <h2>
            Your next
            <br />
            chapter.
          </h2>
          <a href="/inventory/" aria-label="Find your next car">
            <Icon name="arrow" size={28} />
          </a>
        </div>
        <figure class="image">
          <img
            src="/media/resource/about-inner1-1.jpg"
            alt="A car key being handed to a customer"
            width="210"
            height="210"
          />
        </figure>
      </div>
      <figure class="image style-center">
        <img
          src="/media/resource/about-inner1-2.jpg"
          alt="A representative holding a tablet in a car showroom"
          width="567"
          height="540"
        />
      </figure>
      <div class="image-block">
        <figure class="image two">
          <img
            src="/media/resource/about-inner1-3.jpg"
            alt="Vehicles on display inside a bright showroom"
            width="567"
            height="300"
          />
        </figure>
        <div class="box-double-img">
          <figure class="image">
            <img
              src="/media/resource/about-inner1-4.jpg"
              alt="Cars displayed inside a showroom"
              width="210"
              height="210"
              loading="lazy"
            />
          </figure>
          <figure class="image">
            <img
              src="/media/resource/about-inner1-5.jpg"
              alt="A handshake beside a car"
              width="327"
              height="210"
              loading="lazy"
            />
          </figure>
        </div>
      </div>
    </div>
    <p class="bc-gallery-note">Photographs from the Boxcar template preview.</p>
    <section class="why-choose-us-section" aria-labelledby="about-benefits">
      <div class="boxcar-title">
        <h2 id="about-benefits">A simpler way to find your next car</h2>
      </div>
      <div class="bc-benefit-grid">
        {#each benefits as [icon, title, text]}
          <div class="choose-us-block">
            <div class="inner-box">
              <div class="icon-box">
                <img
                  src={`/media/resource/boxcar-${icon}.svg`}
                  alt=""
                  width="60"
                  height="60"
                  loading="lazy"
                />
              </div>
              <div class="content-box">
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </section>
    <section class="bc-about-cta" aria-labelledby="about-next">
      <h2 id="about-next">Let’s find your next car.</h2>
      <p>Start with the cars. We’ll help you take the next step.</p>
      <div class="bc-actions">
        <a class="bc-button" href="/inventory/">Explore cars</a>
        <a class="bc-button bc-button-outline" href="/contact/">Get in touch</a>
      </div>
    </section>
    <section class="bc-about-faq" aria-labelledby="about-faq">
      <h2 id="about-faq">A few things you might want to know</h2>
      {#each questions as [question, answer]}<details>
          <summary>{question}<Icon name="plus" size={20} /></summary>
          <p>{answer}</p>
        </details>{/each}
    </section>
  </div>
</section>
