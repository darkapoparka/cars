<script lang="ts">
  import { brand } from "../data/brand";
  import { makes } from "../lib/catalog";
  import { filterQuery } from "../lib/domain";
  import Icon from "./Icon.svelte";
  let { home = 0 }: { home?: number } = $props();
  let submitted = $state(false);
</script>

<footer class="site-footer" class:pale={[3, 5, 9].includes(home)}>
  <div class="container">
    <div class="footer-news">
      <div>
        <h2>Join {brand.name}</h2>
        <p>Receive our latest news and car updates.</p>
      </div>
      <form
        onsubmit={(e) => {
          e.preventDefault();
          submitted = true;
        }}
      >
        <label class="sr-only" for="footer-email">Email address</label>
        <input
          id="footer-email"
          type="email"
          required
          placeholder="Your email address"
        />
        <button type="submit">
          Preview subscription <Icon name="arrow" size={16} />
        </button>
        <small role="status">
          {submitted
            ? "Preview complete. No subscription was created."
            : "Demo form · no subscription is created."}
        </small>
      </form>
    </div>
    <div class="footer-grid">
      <div>
        <h3>Company</h3>
        <a href="/about/">About us</a>
        <a href="/blog/">Our journal</a>
        <a href="/faq/">FAQs</a>
        <a href="/contact/">Contact us</a>
      </div>
      <div>
        <h3>Quick Links</h3>
        <a href="/inventory/">Get in touch with a car</a>
        <a href="/contact/?intent=sell">Sell your car</a>
        <a href="/calculator/">Finance calculator</a>
        <a href="/compare/">Compare cars</a>
        <a href="/favorites/">Saved cars</a>
      </div>
      <div>
        <h3>Our Brands</h3>
        {#each makes.slice(0, 6) as make}<a
            href={"/inventory/" + filterQuery({ make })}
          >
            {make}
          </a>{/each}
      </div>
      <div>
        <h3>Vehicles Type</h3>
        {#each ["SUV", "Sedan", "Truck", "Van", "Convertible"] as body}<a
            href={"/inventory/" + filterQuery({ body })}
          >
            {body}
          </a>{/each}
      </div>
      <div>
        <h3>Our Showroom</h3>
        <p>{brand.location}</p>
        <p>{brand.hours}</p>
        <a href="/contact/">Plan your visit <Icon name="arrow" size={14} /></a>
        <p class="sample-note">Sample inventory · demo enquiries</p>
      </div>
    </div>
    <div class="footer-bottom">
      <span>
        © {new Date().getFullYear()}
        {brand.name}. All rights reserved.
      </span>
      <a href="/terms/">Terms & privacy</a>
    </div>
  </div>
</footer>
