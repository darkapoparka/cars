<script lang="ts">
  const services = [
    {
      key: "browse",
      title: "Browse Cars",
      text: "Explore the cars that fit your lifestyle and budget.",
      href: "/inventory/",
      action: "Explore cars",
    },
    {
      key: "sell",
      title: "Sell Your Car",
      text: "Ask the showroom about selling or part exchange.",
      href: "/contact/?intent=sell",
      action: "Get in touch",
    },
    {
      key: "compare",
      title: "Compare Cars",
      text: "See your shortlisted cars side by side.",
      href: "/compare/",
      action: "Compare cars",
    },
    {
      key: "budget",
      title: "Plan Your Budget",
      text: "Estimate a monthly payment before your next step.",
      href: "/calculator/",
      action: "Calculate payments",
    },
  ] as const;
</script>

<section
  class="blog-section-two pt-0 curated-services"
  aria-labelledby="curated-services-title"
>
  <div class="boxcar-container">
    <div class="boxcar-title text-center">
      <h2 id="curated-services-title">A Better Way To Find Your Next Car</h2>
      <p>Buy, sell and plan your next move, all in one place.</p>
    </div>
    <div class="row">
      {#each services as service (service.key)}
        <div
          class="blog-blockt-two curated-service-card"
          data-service={service.key}
        >
          <div class="inner-box">
            <div class="hover-img">
              <img
                src={`/media/services/boxcar-${service.key}-v1.webp`}
                alt=""
                width="720"
                height="405"
                loading="lazy"
                decoding="async"
              />
            </div>
            <h3 class="title">{service.title}</h3>
            <p class="text">{service.text}</p>
            <a href={service.href} class="read-more">
              <span>{service.action}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="-1 -1 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M13.6109 0H5.05533C4.84037 0 4.66643 0.173943 4.66643 0.388901C4.66643 0.603859 4.84037 0.777802 5.05533 0.777802H12.6721L0.113697 13.3362C-0.0382246 13.4881 -0.0382246 13.7342 0.113697 13.8861C0.18964 13.962 0.289171 14 0.388666 14C0.488161 14 0.587656 13.962 0.663635 13.8861L13.222 1.3277V8.94447C13.222 9.15943 13.3959 9.33337 13.6109 9.33337C13.8259 9.33337 13.9998 9.15943 13.9998 8.94447V0.388901C13.9998 0.173943 13.8258 0 13.6109 0Z"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width=".45"
                  stroke-linejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
