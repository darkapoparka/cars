<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { slider } from "#lib/vendor.ts";
</script>

<section class="section-box box-news background-body">
  <div class="container">
    <div class="row align-items-end">
      <div class="col-md-9 mb-30">
        <h3 class="title-svg neutral-1000 mb-15">Upcoming Cars &amp; Events</h3>
        <p class="text-lg-medium text-bold neutral-500"
          >Stay ahead with the latest car releases and upcoming events</p
        >
      </div>
      <div class="col-md-3 position-relative mb-30">
        <div
          class="box-button-slider box-button-slider-team justify-content-end"
        >
          <div
            class="swiper-button-prev swiper-button-prev-style-1 swiper-button-prev-2"
            tabindex="0"
            role="button"
            aria-label="Previous slide"
            aria-controls="swiper-wrapper-f147def6ba09c37a"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M7.99992 3.33325L3.33325 7.99992M3.33325 7.99992L7.99992 12.6666M3.33325 7.99992H12.6666"
                stroke=""
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </div>
          <div
            class="swiper-button-next swiper-button-next-style-1 swiper-button-next-2"
            tabindex="0"
            role="button"
            aria-label="Next slide"
            aria-controls="swiper-wrapper-f147def6ba09c37a"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M7.99992 12.6666L12.6666 7.99992L7.99992 3.33325M12.6666 7.99992L3.33325 7.99992"
                stroke=""
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="box-list-news mt-5">
      <div class="box-swiper">
        <div class="swiper-container swiper-group-3" use:slider>
          <div class="swiper-wrapper">
            <div class="swiper-slide pt-2">
              <div class="card-news background-card">
                <div class="card-image">
                  <a href="/news/article" aria-label="View details">
                    <img
                      src="/assets/imgs/blog/blog-1/img-1.png"
                      alt="Carento"
                    />
                  </a>
                </div>
                <div class="card-info">
                  <a
                    class="bg-2 rounded-12 position-absolute top-0 end-0 translate-middle-y px-3 py-2 me-4 text-sm-bold"
                    href="/news"
                    aria-label="News">News</a
                  >
                  <div class="card-meta"
                    ><span class="post-date neutral-1000">18 Sep 2024</span
                    ><span class="post-time neutral-1000">6 mins</span><span
                      class="post-comment neutral-1000">38 comments</span
                    ></div
                  >
                  <div class="card-title"
                    ><a
                      class="text-xl-bold neutral-1000 d-block"
                      href="/news/article"
                      aria-label="2025 Cadillac Escalade costs more money"
                      >2025 Cadillac Escalade costs more money
                    </a></div
                  >
                  <div class="card-program">
                    <div class="endtime">
                      <div class="card-author">
                        <img
                          src="/assets/imgs/blog/blog-1/avatar-1.png"
                          alt="Carento"
                        />
                        <p class="text-sm-bold neutral-1000">Jimmy Dave</p>
                      </div>
                      <div class="card-button"
                        ><a
                          class="btn btn-gray"
                          href="/news/article"
                          aria-label="Keep Reading">Keep Reading</a
                        ></div
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="swiper-slide pt-2">
              <div class="card-news background-card">
                <div class="card-image">
                  <a href="/news/article" aria-label="View details">
                    <img
                      src="/assets/imgs/blog/blog-1/img-2.png"
                      alt="Carento"
                    />
                  </a>
                </div>
                <div class="card-info">
                  <a
                    class="bg-2 rounded-12 position-absolute top-0 end-0 translate-middle-y px-3 py-2 me-4 text-sm-bold"
                    href="/news"
                    aria-label="Trend">Trend</a
                  >
                  <div class="card-meta"
                    ><span class="post-date neutral-1000">18 Sep 2024</span
                    ><span class="post-time neutral-1000">6 mins</span><span
                      class="post-comment neutral-1000">38 comments</span
                    ></div
                  >
                  <div class="card-title"
                    ><a
                      class="text-xl-bold neutral-1000 d-block"
                      href="/news/article"
                      aria-label="2025 BMW 5 Series Review: A balanced luxury sedan"
                      >2025 BMW 5 Series Review: A balanced luxury sedan</a
                    ></div
                  >
                  <div class="card-program">
                    <div class="endtime">
                      <div class="card-author">
                        <img
                          src="/assets/imgs/blog/blog-1/avatar-2.png"
                          alt="Carento"
                        />
                        <p class="text-sm-bold neutral-1000">Steven Job</p>
                      </div>
                      <div class="card-button"
                        ><a
                          class="btn btn-gray"
                          href="/news/article"
                          aria-label="Keep Reading">Keep Reading</a
                        ></div
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="swiper-slide pt-2">
              <div class="card-news background-card">
                <div class="card-image">
                  <a href="/news/article" aria-label="View details">
                    <img
                      src="/assets/imgs/blog/blog-1/img-3.png"
                      alt="Carento"
                    />
                  </a>
                </div>
                <div class="card-info">
                  <a
                    class="bg-2 rounded-12 position-absolute top-0 end-0 translate-middle-y px-3 py-2 me-4 text-sm-bold"
                    href="/news"
                    aria-label="Discovery">Discovery</a
                  >
                  <div class="card-meta"
                    ><span class="post-date neutral-1000">18 Sep 2024</span
                    ><span class="post-time neutral-1000">6 mins</span><span
                      class="post-comment neutral-1000">38 comments</span
                    ></div
                  >
                  <div class="card-title"
                    ><a
                      class="text-xl-bold neutral-1000 d-block"
                      href="/news/article"
                      aria-label="2025 Ruf Rodeo is ready to wrangle some rough roads"
                      >2025 Ruf Rodeo is ready to wrangle some rough roads</a
                    ></div
                  >
                  <div class="card-program">
                    <div class="endtime">
                      <div class="card-author">
                        <img
                          src="/assets/imgs/blog/blog-1/avatar-3.png"
                          alt="Carento"
                        />
                        <p class="text-sm-bold neutral-1000">David Jame</p>
                      </div>
                      <div class="card-button"
                        ><a
                          class="btn btn-gray"
                          href="/news/article"
                          aria-label="Keep Reading">Keep Reading</a
                        ></div
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
