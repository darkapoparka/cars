<script lang="ts">
  import { brand } from "../data/brand";
  import { homes } from "../data/homes";
  import { articles } from "../data/journal";
  import { route } from "../lib/router.svelte";
  import HomeSection from "../components/HomeSection.svelte";
  import LoanCalculator from "../components/LoanCalculator.svelte";
  import EnquiryForm from "../components/EnquiryForm.svelte";
  import Icon from "../components/Icon.svelte";
  let { page }: { page: string } = $props();
  let selling = $derived(
    new URLSearchParams(route.search).get("intent") === "sell",
  );
  let article = $derived(articles.find((a) => route.path.includes(a.slug)));
  let startPrice = $derived(
    Math.max(
      1,
      Number(new URLSearchParams(route.search).get("price")) || 50000,
    ),
  );
  let heading = $derived(
    page === "contact"
      ? selling
        ? "Sell Your Car"
        : "Get in Touch"
      : page === "about"
        ? `About ${brand.name}`
        : page === "calculator"
          ? "Auto Loan Calculator"
          : page === "faq"
            ? "Frequently Asked Questions"
            : page === "terms"
              ? "Terms & Privacy"
              : page === "article"
                ? article?.title || "Article not found"
                : "Our Journal",
  );
  const faqs = [
    [
      "Are these cars available to buy?",
      "This template uses sample inventory to demonstrate search, saved cars and comparison. Confirm actual availability and specifications with the seller when the template is personalized.",
    ],
    [
      "How do I save or compare a car?",
      "Select the bookmark on a vehicle card to save it. Select Compare to add it to a comparison of up to four cars. Your selections stay in this browser when browser storage is available.",
    ],
    [
      "Does the calculator approve financing?",
      "The calculator provides an illustration for the price, deposit, interest rate and term you enter. It excludes fees, taxes and insurance and does not approve or offer finance.",
    ],
    [
      "Does the enquiry form send a message?",
      "The form previews an enquiry. No message is sent and no appointment is booked.",
    ],
    [
      "Can I return to my filtered results?",
      "Open a vehicle from the inventory, then use Back to results or your browser’s Back button. The search selections are stored in the URL.",
    ],
  ];
</script>

<div class="page-shell content-page">
  <div class="container">
    <div class="breadcrumbs">
      <a href="/">Home</a>
      <span>/ {page === "article" ? "Journal" : heading}</span>
    </div>
    <div class="page-heading"><h1>{heading}</h1></div>
    {#if page === "contact"}<div class="contact-layout">
        <section>
          <h2>{selling ? "Tell us about your vehicle" : "How can we help?"}</h2>
          <p>
            {selling
              ? "Prepare the details of the car you would like to sell."
              : "Ask about a car, a viewing or the next step in your search."}
          </p>
          <EnquiryForm {selling} />
        </section>
        <aside class="contact-info">
          <h2>Our Showroom</h2>
          <div>
            <Icon name="location" size={24} />
            <p>
              <strong>{brand.location}</strong>
              <span>Showroom details are personalized for each dealer.</span>
            </p>
          </div>
          <div>
            <Icon name="clock" size={24} />
            <p>
              <strong>Opening hours</strong>
              <span>{brand.hours}</span>
            </p>
          </div>
          <div>
            <Icon name="mail" size={24} />
            <p>
              <strong>Contact</strong>
              <span>{brand.contactEmail} · example address</span>
            </p>
          </div>
          <img
            src="/media/resource/dealer1-1.jpg"
            alt="Demo showroom reference"
            loading="lazy"
            width="600"
            height="380"
          />
          <p class="sample-note">Demo business information</p>
        </aside>
      </div>
    {:else if page === "calculator"}<div class="calculator-page-grid">
        <div>
          <h2>Plan your repayments</h2>
          <p>
            Adjust the vehicle price, deposit, interest rate and term to explore
            your budget.
          </p>
          <LoanCalculator {startPrice} />
        </div>
        <img
          src="/media/resource/loan-img.jpg"
          alt="Vehicle interior"
          width="660"
          height="640"
        />
      </div>
    {:else if page === "about"}<div class="about-intro">
        <h2>A simpler way to find your next car</h2>
        <p>
          Explore cars at your own pace. Bring your favourite options together,
          compare the details and prepare for your next conversation with a
          dealer.
        </p>
        <p>
          Explore the cars, save your favourites and compare the details before
          arranging a viewing.
        </p>
        <a class="button" href="/inventory/">
          Explore Inventory <Icon name="arrow" size={16} />
        </a>
      </div>
      <div class="about-photos">
        <img
          src="/media/resource/dealer1-1.jpg"
          alt="Demo showroom"
          width="650"
          height="400"
        />
        <img
          src="/media/resource/dealer1-2.jpg"
          alt="Showroom preview"
          width="650"
          height="400"
        />
      </div>
    {:else if page === "faq"}<div class="faq-list">
        {#each faqs as [question, answer]}<details>
            <summary>{question}<Icon name="plus" size={18} /></summary>
            <p>{answer}</p>
          </details>{/each}
      </div>
    {:else if page === "terms"}<div class="prose">
        <h2>Template demonstration</h2>
        <p>
          This website presents sample inventory, illustrative pricing and
          example business information. It does not offer a vehicle for sale,
          approve finance or create a booking.
        </p>
        <h2>Enquiries and subscriptions</h2>
        <p>
          Forms run as local previews. No enquiry or subscription is sent.
          Contact details entered into a preview are not saved by this template.
        </p>
        <h2>Saved cars</h2>
        <p>
          Saved cars and comparison selections use this browser’s local storage.
          You can remove selections on the Saved Cars and Compare pages or clear
          the site’s browser data.
        </p>
        <h2>Repayment estimates</h2>
        <p>
          Calculator results are illustrations for the values you enter. They
          exclude fees, taxes and insurance. Obtain an actual quote and terms
          from a finance provider before making a decision.
        </p>
      </div>
    {:else if page === "article" && article}<article class="article-page">
        <a href="/blog/" class="text-link">
          Back to journal <Icon name="left" size={15} />
        </a>
        <p class="journal-meta">{article.category} · {article.date}</p>
        <img src={article.image} alt="" width="1000" height="600" />
        <p class="article-intro">{article.intro}</p>
        {#each article.paragraphs as paragraph}<p>{paragraph}</p>{/each}
        <a
          class="button"
          href={article.slug.includes("budget")
            ? "/calculator/"
            : "/inventory/"}
        >
          {article.slug.includes("budget")
            ? "Explore the calculator"
            : "Explore cars"}
          <Icon name="arrow" size={16} />
        </a>
      </article>
    {:else}<div class="journal-grid">
        {#each articles as item}<article>
            <a href={`/blog/${item.slug}/`} class="journal-image">
              <img src={item.image} alt="" width="600" height="380" />
              <span>{item.category}</span>
            </a>
            <p class="journal-meta">{item.date}</p>
            <h2><a href={`/blog/${item.slug}/`}>{item.title}</a></h2>
            <p>{item.intro}</p>
          </article>{/each}
      </div>{/if}
  </div>
  {#if page === "about"}<HomeSection
      section={{ kind: "benefits" }}
      design={homes[0]}
    /><HomeSection section={{ kind: "cta" }} design={homes[0]} />{/if}
</div>
