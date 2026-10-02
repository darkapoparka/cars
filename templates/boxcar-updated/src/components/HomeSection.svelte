<script lang="ts">
  import { type HomeSection as Section, type HomeDesign } from "../data/homes";
  import { vehicles, makes } from "../lib/catalog";
  import { filterQuery } from "../lib/domain";
  import { articles } from "../data/journal";
  import { brand } from "../data/brand";
  import Icon from "./Icon.svelte";
  import VehicleShelf from "./VehicleShelf.svelte";
  import LoanCalculator from "./LoanCalculator.svelte";
  import EnquiryForm from "./EnquiryForm.svelte";
  let { section, design }: { section: Section; design: HomeDesign } = $props();
  let review = $state(0),
    inspiration = $state("Body type"),
    subscribed = $state(false);
  const brands = [
    "Audi",
    "BMW",
    "Ford",
    "Mercedes-Benz",
    "Peugeot",
    "Volkswagen",
  ];
  const types = ["SUV", "Sedan", "Hatchback", "Coupe", "Hybrid"];
  const benefits = [
    {
      icon: "wallet",
      title: "Special Financing Options",
      text: "Explore a repayment estimate and see how the deposit and term affect your budget.",
    },
    {
      icon: "shield",
      title: "A Helpful Car Dealership",
      text: "Compare your shortlist and prepare the questions that matter before you visit.",
    },
    {
      icon: "car",
      title: "Transparent Pricing",
      text: "View the price, mileage and key specifications together, with no guesswork.",
    },
    {
      icon: "wrench",
      title: "Expert Car Advice",
      text: "From choosing a body style to planning a test drive, start with clear information.",
    },
  ];
  const reviews = [
    {
      title: "A clear way to compare",
      text: "I could save my favourites and compare the important details in one place. It made building a shortlist much simpler.",
      name: "Sample customer",
      image: "test-1.jpg",
    },
    {
      title: "Easy to find the right fit",
      text: "The filters helped me focus on the cars in my budget, and I could return to my search after opening a vehicle.",
      name: "Sample customer",
      image: "thumb1.jpg",
    },
    {
      title: "Everything in one place",
      text: "The vehicle details and repayment estimate gave me a useful starting point for the questions I wanted to ask.",
      name: "Sample customer",
      image: "thumb2.jpg",
    },
  ];
  let inspirationItems = $derived(
    inspiration === "Make"
      ? makes
      : inspiration === "Budget"
        ? ["Under $15,000", "Under $30,000", "Under $50,000", "Under $75,000"]
        : [...types, "Truck", "Van"],
  );
  function typeHref(type: string) {
    return (
      "/inventory/" +
      filterQuery(type === "Hybrid" ? { fuel: type } : { body: type })
    );
  }
  function inspirationHref(item: string) {
    return (
      "/inventory/" +
      filterQuery(
        inspiration === "Make"
          ? { make: item }
          : inspiration === "Budget"
            ? { max: item.replace(/\D/g, "") }
            : item === "Hybrid"
              ? { fuel: item }
              : { body: item },
      )
    );
  }
  function typeImage(index: number) {
    if (section.style === "gallery")
      return `/media/resource/gallery1-${index + 1}.jpg`;
    if (section.style === "photos")
      return `/media/resource/team3-${index + 1}.jpg`;
    return `/media/resource/vehicles${design.id === 10 ? "2" : "1"}-${index + 1}.png`;
  }
</script>

{#if section.kind === "vehicles"}<VehicleShelf {section} />
{:else if section.kind === "brands"}
  <section
    class="section brands-section brands-{section.style || 'tiles'}"
    class:rounded-first={design.id === 1}
  >
    <div class="container">
      <div class="section-heading">
        <h2>Explore Our Premium Brands</h2>
        <a href="/inventory/">
          Show All Brands <Icon name="arrow" size={16} />
        </a>
      </div>
      <div class="brand-grid">
        {#each brands as make, i}<a
            href={"/inventory/" + filterQuery({ make })}
          >
            <img
              src={`/media/resource/brand-${i + 1}.png`}
              alt=""
              width="100"
              height="100"
              loading="lazy"
            />
            <strong>{make}</strong>
          </a>{/each}
      </div>
    </div>
  </section>
{:else if section.kind === "types"}
  <section class="section types-section types-{section.style || 'icons'}">
    <div class="container">
      <div class="section-heading">
        <h2>{section.title || "Browse by Type"}</h2>
        <a href="/inventory/">View All <Icon name="arrow" size={16} /></a>
      </div>
      <div class="type-grid">
        {#each types as type, i}<a href={typeHref(type)}>
            {#if ["gallery", "photos", "cutouts"].includes(section.style || "")}<img
                src={typeImage(i)}
                alt=""
                loading="lazy"
                width="320"
                height="180"
              />{:else}<Icon name="car" size={50} />{/if}
            <strong>{type === "SUV" ? "SUVs" : type}</strong>
            <small>
              {vehicles.filter((v) => v.body === type || v.fuel === type)
                .length} cars
            </small>
          </a>{/each}
      </div>
    </div>
  </section>
{:else if section.kind === "pricing"}
  <section
    class="section pricing-section pricing-{section.style || 'standard'}"
  >
    <div class="container pricing-grid">
      <div class="pricing-art">
        <img
          src={"/media/resource/" + (section.image || "pricing1-1.jpg")}
          alt="Car and showroom preview"
          width="650"
          height="550"
          loading="lazy"
        />
        {#if section.style === "collage"}<img
            class="pricing-inset"
            src={`/media/resource/${design.id === 9 ? "pricing9-2.jpg" : "pricing7-2.jpg"}`}
            alt="Showroom preview"
            loading="lazy"
            width="320"
            height="260"
          />{/if}
      </div>
      <div class="pricing-copy">
        <h2>
          {section.title || "Get A Fair Price For Your Car. Sell To Us Today"}
        </h2>
        <p>
          Find your next car with clear information and a shortlist built around
          you. Browse online, compare the details and plan your next step.
        </p>
        <ul>
          <li><Icon name="check" />Explore the cars that match your budget</li>
          <li><Icon name="check" />Save and compare your favourite options</li>
          <li><Icon name="check" />Bring your questions to a viewing</li>
        </ul>
        <a
          class="button"
          href={section.title?.includes("finance")
            ? "/calculator/"
            : "/contact/?intent=sell"}
        >
          Get Started <Icon name="arrow" size={16} />
        </a>
      </div>
    </div>
  </section>
{:else if section.kind === "stats"}
  <section class="stats-section stats-{section.style || 'standard'}">
    <div class="container stats-grid">
      {#each [[String(vehicles.length), "SAMPLE CARS"], ["10", "HOME DESIGNS"], ["4", "CARS TO COMPARE"], ["1", "SHARED INVENTORY"]] as [value, label]}<div
        >
          <strong>{value}</strong>
          <span>{label}</span>
        </div>{/each}
    </div>
  </section>
{:else if section.kind === "benefits"}
  <section
    class="section benefits-section benefits-{section.style || 'standard'}"
  >
    <div class="container">
      <h2>{section.title || "Why Choose Us?"}</h2>
      <div class="benefit-grid">
        {#each benefits as benefit}<div>
            <Icon name={benefit.icon} size={52} />
            <h3>{benefit.title}</h3>
            <p>{benefit.text}</p>
          </div>{/each}
      </div>
    </div>
  </section>
{:else if section.kind === "testimonials"}
  <section
    class="section testimonials-section testimonials-{section.style || 'cards'}"
  >
    <div class="container">
      <div class="section-heading">
        <h2>{section.title || "What our customers say"}</h2>
        <span class="sample-note">Example reviews</span>
      </div>
      {#if section.style === "portrait"}<div class="testimonial-feature">
          <img
            src={"/media/resource/" + reviews[review].image}
            alt="Example customer portrait"
            width="460"
            height="440"
            loading="lazy"
          />
          <div>
            <div class="review-stars" aria-label="Example five-star review">
              ★★★★★
            </div>
            <h3>{reviews[review].title}</h3>
            <blockquote>{reviews[review].text}</blockquote>
            <strong>{reviews[review].name}</strong>
            <div class="carousel-buttons">
              <button
                class="icon-button"
                aria-label="Previous review"
                onclick={() => (review = (review + 2) % 3)}
              >
                <Icon name="left" />
              </button>
              <button
                class="icon-button"
                aria-label="Next review"
                onclick={() => (review = (review + 1) % 3)}
              >
                <Icon name="right" />
              </button>
            </div>
          </div>
        </div>{:else}<div class="review-grid">
          {#each reviews as item}<article class="review-card">
              <div class="review-stars" aria-label="Example five-star review">
                ★★★★★
              </div>
              <h3>{item.title}</h3>
              <blockquote>{item.text}</blockquote>
              <div class="review-author">
                <img
                  src={"/media/resource/" + item.image}
                  alt=""
                  width="48"
                  height="48"
                  loading="lazy"
                />
                <strong>{item.name}</strong>
              </div>
            </article>{/each}
        </div>{/if}
    </div>
  </section>
{:else if section.kind === "blog"}
  <section class="section journal-section">
    <div class="container">
      <div class="section-heading">
        <h2>Latest Blog Posts</h2>
        <a href="/blog/">View All <Icon name="arrow" size={16} /></a>
      </div>
      <div class="journal-grid">
        {#each articles as article}<article>
            <a href={`/blog/${article.slug}/`} class="journal-image">
              <img
                src={article.image}
                alt=""
                width="600"
                height="380"
                loading="lazy"
              />
              <span>{article.category}</span>
            </a>
            <p class="journal-meta">{article.date} · Buying guide</p>
            <h3><a href={`/blog/${article.slug}/`}>{article.title}</a></h3>
          </article>{/each}
      </div>
    </div>
  </section>
{:else if section.kind === "cta"}
  <section class="section cta-section cta-{section.style || 'standard'}">
    <div class="container cta-grid">
      <article>
        <div>
          <h2>Are You Looking For a Car?</h2>
          <p>Browse our sample inventory and build your own shortlist.</p>
          <a class="button" href="/inventory/">
            Get Started <Icon name="arrow" size={16} />
          </a>
        </div>
        {#if section.style === "photos"}<img
            src="/media/resource/blog3-1.jpg"
            alt=""
            loading="lazy"
          />{:else}<Icon name="car" size={90} />{/if}
      </article>
      <article>
        <div>
          <h2>Do You Want to Sell a Car?</h2>
          <p>Prepare your vehicle details and preview an enquiry.</p>
          <a class="button dark" href="/contact/?intent=sell">
            Get Started <Icon name="arrow" size={16} />
          </a>
        </div>
        {#if section.style === "photos"}<img
            src="/media/resource/blog3-2.jpg"
            alt=""
            loading="lazy"
          />{:else}<Icon name="wallet" size={90} />{/if}
      </article>
    </div>
  </section>
{:else if section.kind === "finance"}
  <section
    class="section finance-section finance-{section.style || 'standard'}"
  >
    <div class="container finance-grid">
      <div>
        <h2>Auto Loan Calculator</h2>
        <p>
          Build an estimate for your budget. Adjust the price, deposit, interest
          and term to see the effect on repayments.
        </p>
        <LoanCalculator compact />
      </div>
      <img
        src="/media/resource/loan-img.jpg"
        alt="Vehicle interior"
        width="660"
        height="640"
        loading="lazy"
      />
    </div>
  </section>
{:else if section.kind === "inspiration"}
  <section class="section inspiration-section">
    <div class="container">
      <h2>{section.title || "Need Some Inspiration?"}</h2>
      <div class="shelf-tabs" aria-label="Browse options">
        {#each ["Body type", "Make", "Budget"] as option}<button
            class:active={inspiration === option}
            aria-pressed={inspiration === option}
            onclick={() => (inspiration = option)}
          >
            {option}
          </button>{/each}
      </div>
      <div class="inspiration-links">
        {#each inspirationItems as item}<a href={inspirationHref(item)}>
            {item}
            <Icon name="arrow" size={14} />
          </a>{/each}
      </div>
    </div>
  </section>
{:else if section.kind === "team"}
  <section class="section team-section">
    <div class="container">
      <div class="section-heading">
        <h2>Our Team</h2>
        <span class="sample-note">Example team profiles</span>
      </div>
      <div class="team-grid">
        {#each ["Vehicle advisor", "Sales specialist", "Finance specialist", "Customer care"] as role, i}<div
          >
            <img
              src={`/media/resource/${[4, 6, 7].includes(design.id) ? "team6" : "team1"}-${i + 1}.jpg`}
              alt="Example team portrait"
              loading="lazy"
              width="300"
              height="360"
            />
            <h3>{role}</h3>
            <p>Here to help you explore</p>
          </div>{/each}
      </div>
    </div>
  </section>
{:else if section.kind === "app"}
  <section class="section app-section app-{section.style || 'standard'}">
    <div class="container app-panel">
      <div>
        <h2>Shop used cars, whether you're on the lot or on the go</h2>
        <p>
          Your shortlist travels with you. Explore the inventory, save
          favourites and compare cars on any screen.
        </p>
        <a class="button white" href="/inventory/">
          Explore Inventory <Icon name="arrow" size={16} />
        </a>
      </div>
      <img
        src="/media/resource/iphone.png"
        alt="Mobile car browsing preview"
        width="380"
        height="420"
        loading="lazy"
      />
    </div>
  </section>
{:else if section.kind === "newsletter"}
  <section class="section newsletter-section">
    <div class="container newsletter-panel">
      <div>
        <h2>Stay Up To Date With Our Latest News</h2>
        <p>Preview the mailing list form.</p>
        <form
          onsubmit={(e) => {
            e.preventDefault();
            subscribed = true;
          }}
        >
          <label class="sr-only" for="home-news-email">Email address</label>
          <input
            id="home-news-email"
            type="email"
            required
            placeholder="Your email address"
          />
          <button class="button" type="submit">
            Preview subscription <Icon name="arrow" size={16} />
          </button>
        </form>
        <p class="fine-print" role="status">
          {subscribed
            ? "Preview complete. No subscription was created."
            : "Demo form · no subscription is created."}
        </p>
      </div>
      <img
        src="/media/resource/news1-1.png"
        alt=""
        width="420"
        height="360"
        loading="lazy"
      />
    </div>
  </section>
{:else if section.kind === "dealership"}
  <section class="section dealership-section">
    <div class="container">
      <div class="section-heading">
        <h2>{brand.name} Dealership</h2>
        <a href="/about/">Discover More <Icon name="arrow" size={16} /></a>
      </div>
      <div class="dealership-grid">
        {#each [1, 2, 3] as i}<img
            src={`/media/resource/dealer1-${i}.jpg`}
            alt="Showroom reference preview"
            width="650"
            height="460"
            loading="lazy"
          />{/each}
      </div>
      <p class="sample-note">Demo showroom imagery</p>
    </div>
  </section>
{:else if section.kind === "contact"}
  <section
    class="section home-contact home-contact-{section.style || 'standard'}"
  >
    <div class="container">
      <div>
        <h2>{section.title || "Get in Touch"}</h2>
        <p>Tell us what you are looking for and prepare the next step.</p>
        {#if section.style}<a class="button" href="/contact/">
            Contact Us <Icon name="arrow" size={16} />
          </a>{:else}<p><Icon name="clock" /> {brand.hours}</p>{/if}
      </div>
      {#if !section.style}<EnquiryForm />{/if}
    </div>
  </section>
{/if}
