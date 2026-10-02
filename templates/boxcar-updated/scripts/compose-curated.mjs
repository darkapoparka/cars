// Assemble the dealer homepage from the preserved Boxcar DOM. The ten source
// homes remain untouched; this only writes the separately curated components.
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import { load } from "cheerio";
import { compile } from "svelte/compiler";

const sources = new Map();
async function home(n) {
  const source = await fs.readFile(`src/reference/Home${n}.svelte`, "utf8");
  sources.set(n, createHash("sha256").update(source).digest("hex"));
  return load(source.slice(source.indexOf('<div class="boxcar-wrapper')));
}
const ten = await home(10),
  five = await home(5),
  eight = await home(8),
  two = await home(2);
const arrow = eight(".car-block-ten .details svg").first().clone();
arrow.attr({
  width: "20",
  height: "20",
  viewBox: "-1 -1 16 16",
  "aria-hidden": "true",
});
arrow.find("defs").remove();
arrow.find("g").removeAttr("clip-path");
arrow.find("path").attr({
  fill: "currentColor",
  stroke: "currentColor",
  "stroke-width": ".45",
  "stroke-linejoin": "round",
});
const arrowHTML = arrow.prop("outerHTML");
const searchIcon = ten(".layout-search .search-box svg").first().clone();
searchIcon
  .attr({ width: "22", height: "22", "aria-hidden": "true" })
  .removeAttr("class");
searchIcon.find("path").attr("fill", "currentColor");
const dynamic = (html) =>
  html
    .replaceAll("__LOGO__", "{brand.logoDark}")
    .replaceAll("__NAME__", "{brand.name}")
    .replaceAll("__TAGLINE__", "{brand.tagline}")
    .replaceAll("__HOURS__", "{brand.hours}")
    .replaceAll("__LOCATION__", "{brand.location}")
    .replaceAll("__EMAIL__", "{brand.contactEmail}");
const outer = ($, el) => $(el).prop("outerHTML");

// App.svelte renders the shared dealer header outside the page composition.
// The ten original homes retain their own captured headers and interactions.

const hero = ten(".boxcar-banner-section-seven").clone();
hero.addClass("curated-banner");
hero.find(".banner-slider-v7").attr("data-static-hero", "");
hero.find(".banner-slider-v7 > .inner-box").slice(1).remove();
hero
  .find("[data-animation-in],[data-delay-in]")
  .removeAttr("data-animation-in")
  .removeAttr("data-delay-in");
hero.find(".sub-title").text("Explore new and used cars, all in one place.");
hero.find("h1").text("Find Your Perfect Car");
hero
  .find(".banner-slide > img")
  .attr("fetchpriority", "high")
  .attr("width", "1800")
  .attr("height", "700");
const search = five(".form-tab-pane").first().clone();
search.removeAttr("id");
search.find("form").attr("aria-label", "Find your next car");
search.find("input[type=hidden]").remove();
search.find(".select > span").eq(1).text("All Makes");
search.find(".select > span").eq(2).text("All Models");
const condition = search.find(".drop-menu").first();
condition.find(".select > span").text("All Cars");
condition
  .find(".dropdown")
  .html(
    ["All Cars", "New Cars", "Used Cars"]
      .map(
        (value) =>
          `<li role="option" tabindex="0" aria-selected="${value === "All Cars"}">${value}</li>`,
      )
      .join(""),
  );
search
  .find(".select")
  .each((i, el) =>
    five(el).attr(
      "aria-label",
      ["Car condition", "Make", "Model", "Maximum price"][i],
    ),
  );
search
  .find(".form-submit button")
  .removeAttr("aria-label")
  .html(`${searchIcon.prop("outerHTML")}<span>Search cars</span>`);
search
  .find(".select > i")
  .replaceWith(
    '<svg class="curated-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
  );
hero.find(".cus-container10").empty().append(search);
// Keep the search in normal flow with the headline. The original Home 10
// sibling form was pinned across the car at the bottom of the photograph.
const heroSearch = hero.find(".form-tab-content").clone();
hero.find(".form-tab-content").remove();
hero.find(".content-box").append(heroSearch);
hero
  .find(".content-box .sub-title, .content-box h1")
  .wrapAll('<div class="curated-hero-heading"></div>');

const types = ten(".vehicles-section-two").clone();
types.addClass("curated-types");
types.find(".boxcar-title h2").text("A Car For Every Lifestyle");
types.find(".Vehicle-block").each((_, el) => {
  const card = ten(el);
  const originalName = card.find("h6").text().trim();
  const name = originalName === "HRV" ? "Hatchback" : originalName;
  if (!["SUV", "Sedan", "Hatchback", "Coupe"].includes(name)) {
    card.remove();
    return;
  }
  card.removeClass("col-lg-2 col-md-6").addClass("col-lg-3 col-md-3");
  card.find("h6").text(name);
  card.find("img").attr("width", "200").attr("height", "150");
  const inner = card.find(".inner-box");
  const imageLink = inner.find(".image a");
  imageLink.replaceWith(imageLink.html());
  inner.replaceWith(
    `<a class="inner-box" href="/inventory/?body=${name}" aria-label="Browse ${name} cars">${inner.html()}</a>`,
  );
});

const brands = eight(".boxcar-brand-section-five").clone();
brands.addClass("curated-brands");
brands.find(".boxcar-title h2").text("Explore Our Brands");
brands.find(".btn-title").remove();
brands.find(".cars-block-five").each((_, el) => {
  const card = eight(el),
    name = card.find("h6").text().trim();
  const make = name === "Mercedes Benz" ? "Mercedes-Benz" : name;
  if (!["Audi", "BMW", "Mercedes-Benz", "Bentley", "Nissan"].includes(make)) {
    card.remove();
    return;
  }
  card.find("h6").text(make);
  const inner = card.find(".inner-box");
  inner.find(".image a").replaceWith(inner.find(".image a").html());
  inner.replaceWith(
    `<a class="inner-box" href="/inventory/?make=${encodeURIComponent(make)}" aria-label="Browse ${make} cars">${inner.html()}</a>`,
  );
  card.find("img").attr("alt", make).attr("loading", "lazy");
});

// Use the source buy/sell CTA cards, rather than turning the icon benefits
// or testimonial components into service cards. All four actions are real routes.
const services = five(".blog-section-two").clone().addClass("curated-services");
services.attr("aria-labelledby", "curated-services-title");
services
  .find(".boxcar-container")
  .prepend(
    '<div class="boxcar-title text-center"><h2 id="curated-services-title">A Better Way To Find Your Next Car</h2><p>Buy, sell and plan your next move, all in one place.</p></div>',
  );
const sourceServiceCard = services.find(".blog-blockt-two").first().clone();
const serviceIcons = [
  five(".blog-section-two .hover-img svg").eq(0),
  five(".blog-section-two .hover-img svg").eq(1),
  five(".why-choose-us-section-three .icon-box svg").eq(2),
  five(".why-choose-us-section-three .icon-box svg").eq(0),
];
const serviceCopy = [
  [
    "Browse Cars",
    "Find the right car for your lifestyle, from city hatchbacks to family SUVs.",
    "/inventory/",
    "Explore cars",
  ],
  [
    "Sell Your Car",
    "Thinking of a change? Talk to the showroom about selling or part exchange.",
    "/contact/?intent=sell",
    "Get in touch",
  ],
  [
    "Compare Cars",
    "Put your shortlisted cars side by side and take a closer look at the details.",
    "/compare/",
    "Compare cars",
  ],
  [
    "Plan Your Budget",
    "Explore an illustrative monthly payment before you take the next step.",
    "/calculator/",
    "Calculate payments",
  ],
];
const serviceCards = serviceCopy.map(([title, copy, href, label], i) => {
  const card = sourceServiceCard.clone();
  card.attr("class", "blog-blockt-two curated-service-card");
  card.find(".inner-box").toggleClass("two", i % 2 === 1);
  card.find(".title").text(title);
  card.find(".text").text(copy);
  card
    .find(".read-more")
    .attr("href", href)
    .html(`<span>${label}</span>${arrowHTML}`);
  card
    .find(".hover-img")
    .html(serviceIcons[i].prop("outerHTML"))
    .prependTo(card.find(".inner-box"));
  card
    .find(".hover-img svg")
    .attr({ width: "72", height: "72", "aria-hidden": "true" });
  return outer(five, card);
});
services.find(".row").html(serviceCards.join("\n"));

// Home 2 already has a photographic CTA designed for this purpose. Keep its
// source image, overlay, title and button DOM in a centered dealer composition.
const nextCar = two(".brand-boxcar-banner-section")
  .clone()
  .addClass("curated-next-car");
nextCar.attr("aria-labelledby", "curated-next-car-title");
nextCar
  .find("h2")
  .attr("id", "curated-next-car-title")
  .text("Your Next Car, Made Simple");
nextCar
  .find("h2")
  .after(
    '<p class="text">Found something you like? Come and see it for yourself. Ask your questions, take a closer look and find your fit.</p>',
  );
nextCar
  .find(".btn")
  .attr("href", "/contact/?intent=viewing")
  .html(`<span>Arrange a viewing</span>${arrowHTML}`);

const blog = eight(".blog-section").clone();
blog.addClass("curated-journal");
blog.find("h2").text("Advice For The Road Ahead");
const blogCard = blog.find(".blog-block").first().clone();
blogCard
  .find(".image a")
  .attr("href", "__ARTICLE_HREF__")
  .attr("aria-label", "__ARTICLE_TITLE__");
blogCard
  .find(".image img")
  .attr("src", "__ARTICLE_IMAGE__")
  .attr("alt", "")
  .attr("loading", "lazy");
blogCard.find(".date").text("__ARTICLE_CATEGORY__");
blogCard.find(".post-info").html("<li>Buying guide</li>");
blogCard
  .find(".title a")
  .attr("href", "__ARTICLE_HREF__")
  .text("__ARTICLE_TITLE__");
const blogMarkup = outer(eight, blogCard)
  .replaceAll("__ARTICLE_HREF__", "/blog/{article.slug}/")
  .replaceAll("__ARTICLE_TITLE__", "{article.title}")
  .replaceAll("__ARTICLE_IMAGE__", "{article.image}")
  .replaceAll("__ARTICLE_CATEGORY__", "{article.category}");
blog.find(".row").html("__BLOG_CARDS__");

const footer = eight("footer").clone();
footer.find(".widgets-section .row").first().html(`
  <div class="footer-column col-lg-3 col-md-6 col-sm-12"><div class="footer-widget links-widget"><a class="curated-footer-logo" href="/" aria-label="__NAME__ home"><img src="__LOGO__" alt="__NAME__" width="108" height="28"></a><div class="widget-content"><p class="text">__TAGLINE__</p><p class="text">__LOCATION__</p></div></div></div>
  <div class="footer-column col-lg-3 col-md-6 col-sm-12"><div class="footer-widget links-widget"><h4 class="widget-title">Find a car</h4><ul class="user-links style-two"><li><a href="/inventory/">Browse all cars</a></li><li><a href="/inventory/?condition=New">New cars</a></li><li><a href="/inventory/?condition=Used">Used cars</a></li><li><a href="/favorites/">Saved cars</a></li><li><a href="/compare/">Compare cars</a></li></ul></div></div>
  <div class="footer-column col-lg-3 col-md-6 col-sm-12"><div class="footer-widget links-widget"><h4 class="widget-title">Explore</h4><ul class="user-links style-two"><li><a href="/about/">About us</a></li><li><a href="/blog/">Buying advice</a></li><li><a href="/calculator/">Repayment calculator</a></li><li><a href="/faq/">Frequently asked questions</a></li></ul></div></div>
  <div class="footer-column col-lg-3 col-md-6 col-sm-12"><div class="footer-widget links-widget"><h4 class="widget-title">Visit the showroom</h4><div class="widget-content"><p class="text">__HOURS__</p><ul class="user-links style-two"><li><a href="/contact/">Get in touch</a></li><li><a href="/contact/?intent=viewing">Arrange a viewing</a></li></ul></div></div></div>`);
footer
  .find(".footer-bottom .inner-container")
  .html(
    '<div class="copyright-text">© 2026 __NAME__. All rights reserved.</div><ul class="footer-nav"><li><a href="/terms/">Terms &amp; privacy</a></li></ul>',
  );

const stock = `<section class="cars-section-ten v8 curated-stock" aria-labelledby="curated-stock-title"><div class="large-container"><div class="right-box"><div class="curated-stock-layout"><div class="boxcar-title text-center"><h2 id="curated-stock-title">Explore Our Latest Cars</h2><p class="curated-stock-note">{vehicles.length} sample vehicles to explore</p></div><CuratedStock /><div class="curated-stock-more"><a class="read-more" href="/inventory/"><span>View all cars</span></a></div></div></div></div></section>`;
let markup = `<div class="boxcar-wrapper cus-layout-home10 reference-home curated-home" data-reference-home="curated" data-curated-home use:referencePage>
${outer(ten, hero)}
${outer(eight, types)}
${outer(eight, brands)}
${stock}
${outer(five, services)}
${outer(two, nextCar)}
${outer(eight, blog).replace("__BLOG_CARDS__", `{#each articles as article}${blogMarkup}{/each}`)}
${outer(eight, footer)}
</div>`;
markup = dynamic(markup);
// Every inline SVG has its own clip-path ID in the composed document.
let id = 0;
markup = markup.replace(/<svg[\s\S]*?<\/svg>/g, (svg) => {
  const suffix = `-curated-${id++}`;
  return svg.replace(/(id="|url\(#)([^"\)]+)("|\))/g, "$1$2" + suffix + "$3");
});
const script = `<svelte:options preserveWhitespace={true} />\n<script lang="ts">\nimport {referencePage} from './interactions';\nimport {brand} from '../data/brand';\nimport {vehicles} from '../lib/catalog';\nimport {articles} from '../data/journal';\nimport CuratedStock from './CuratedStock.svelte';\n</script>\n`;
compile(script + markup, { filename: "CuratedHome.svelte", generate: false });
await fs.writeFile("src/reference/CuratedHome.svelte", script + markup + "\n");
await fs.writeFile(
  ".template/curated.json",
  JSON.stringify(
    {
      version: "2026.10.02-curated",
      defaultRoute: "/",
      preservedReferenceRoutes: Array.from(
        { length: 10 },
        (_, i) => `/home-${i + 1}/`,
      ),
      sources: [...sources].map(([home, sha256]) => ({
        home,
        svelteSHA256: sha256,
      })),
      composition: {
        header:
          "Shared Header.svelte, Home 10 centered dealer navigation and contact action across the curated home and all supporting pages",
        hero: "Home 10, single source photograph; search centered horizontally and vertically with its headline directly above",
        search:
          "Home 5 white pill DOM directly beneath the hero headline, four working filters and visible search label",
        types:
          "Home 10 photographic body types, centered row with catalogue destinations",
        brands:
          "Home 8 brand DOM in centered source-style tiles with catalogue destinations",
        inventory:
          "Home 8 boxed card DOM in a four-column, two-row desktop grid; four cards on phones, condition tabs, native saved state and one solid View all cars CTA; no carousel controls",
        services:
          "Home 5 pastel buy/sell CTA card DOM and original SVGs, four centered cards with inventory, sell enquiry, comparison and calculator destinations",
        nextCar:
          "Home 2 original photographic CTA banner, centered dealer title and viewing action",
        journalAndFooter: "Home 8, shared articles and identity",
      },
      method:
        "Compose preserved source DOM as compiled Svelte; scoped responsive CSS and native controls. No changes to the ten source homepage components.",
    },
    null,
    2,
  ) + "\n",
);
console.log(
  "Composed curated homepage; the ten reference homes were not changed.",
);
