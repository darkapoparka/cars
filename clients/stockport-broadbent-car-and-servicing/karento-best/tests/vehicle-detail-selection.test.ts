import assert from "node:assert/strict";
import test from "node:test";
import {
  vehicleListings,
  rentalRows,
} from "../src/lib/data/vehicle-listing.ts";
import {
  dashboardOwnerInventory,
  dashboardWishlist,
} from "../src/lib/data/dashboard.ts";
import { referenceVehicles } from "../src/lib/data/vehicles.ts";
import {
  desktopReferenceDetailContent,
  referenceDetailContent,
  referenceSliderGallery,
  referenceSpecifications,
} from "../src/lib/data/vehicle-detail.ts";
import {
  referenceVehicleDestination,
  referenceVehicleIdentity,
  selectedReferenceVehicle,
} from "../src/lib/data/vehicle-detail-selection.ts";
import { translate } from "../src/lib/i18n/messages.ts";
import type { LocaleContext } from "../src/lib/i18n/context.svelte.ts";

const locale: Pick<LocaleContext, "t"> = {
  t: (key, ...args) => translate("en", key, ...args),
};

test("direct detail has a useful default and invalid explicit identities never fall back", () => {
  assert.equal(
    selectedReferenceVehicle(new URLSearchParams())?.id,
    vehicleListings.gridFourColumns[0].id,
  );
  for (const id of ["", "unknown", "constructor", "__proto__"])
    assert.equal(
      selectedReferenceVehicle(new URLSearchParams({ vehicle: id })),
      null,
    );
  const duplicate = new URLSearchParams();
  duplicate.append("vehicle", vehicleListings.gridFourColumns[0].id);
  duplicate.append("vehicle", vehicleListings.gridFourColumns[1].id);
  assert.equal(selectedReferenceVehicle(duplicate), null);
});

test("dealer overrides and authoritative external/dealer links are preserved", () => {
  const source = vehicleListings.gridFourColumns[0];
  const override = {
    ...source,
    sample: false,
    title: "Supplied vehicle title",
    image: "/supplied-photo.webp",
    detailImage: undefined,
    href: "/vehicle?id=dealer-record",
  };
  const selected = selectedReferenceVehicle(
    new URLSearchParams({ vehicle: source.id }),
    { [source.title]: override },
  );
  assert.equal(selected?.card.title, override.title);
  assert.equal(selected?.card.image, override.image);
  assert.ok(selected);
  assert.equal(
    referenceVehicleIdentity(selected, locale).gallery.slides[0].src,
    override.image,
  );
  const suppliedDetail = selectedReferenceVehicle(
    new URLSearchParams({ vehicle: source.id }),
    { [source.title]: { ...override, detailImage: "/supplied-detail.webp" } },
  );
  assert.ok(suppliedDetail);
  assert.equal(
    referenceVehicleIdentity(suppliedDetail, locale).gallery.slides[0].src,
    "/supplied-detail.webp",
  );
  assert.equal(referenceVehicleDestination(override), override.href);
  assert.equal(
    referenceVehicleDestination({
      ...source,
      href: "https://dealer.invalid/car",
    }),
    "https://dealer.invalid/car",
  );
});

test("desktop identity selection retains the complete reference gallery and detail defaults", () => {
  const originalGallery = structuredClone(referenceSliderGallery);
  const originalDetails = structuredClone(referenceDetailContent);
  const cards = [
    ...Object.values(vehicleListings).flat(),
    ...rentalRows,
    ...dashboardWishlist,
    ...dashboardOwnerInventory,
    ...Object.values(referenceVehicles).flat(),
  ];
  for (const card of cards) {
    const destination = new URL(
      referenceVehicleDestination(card),
      "https://example.invalid",
    );
    assert.ok(destination.searchParams.has("vehicle"), card.title);
    const selected = selectedReferenceVehicle(destination.searchParams);
    assert.ok(selected, card.title);
    const identity = referenceVehicleIdentity(selected, locale);
    assert.equal(identity.heading.title, card.title);
    assert.equal(selected.card.image, card.image);
    assert.equal(
      identity.gallery.slides[0].src,
      selected.card.detailImage ?? card.image,
    );
    assert.equal(identity.gallery.thumbnails[0].src, card.image);
    assert.deepEqual(
      identity.gallery.slides.slice(1).map((photo) => photo.src),
      referenceSliderGallery.slides.map((photo) => photo.src),
    );
    assert.deepEqual(
      identity.gallery.thumbnails.slice(1).map((photo) => photo.src),
      referenceSliderGallery.thumbnails.map((photo) => photo.src),
    );
    assert.deepEqual(Object.keys(identity).sort(), ["gallery", "heading"]);
  }
  assert.equal(referenceSliderGallery.slides.length, 5);
  assert.equal(referenceSpecifications.length, 8);
  assert.deepEqual(referenceSliderGallery, originalGallery);
  assert.deepEqual(referenceDetailContent, originalDetails);
});

test("identity gallery respects supplied card and detail photos", () => {
  const source = vehicleListings.gridFourColumns[0];
  for (const detailImage of [undefined, "/supplied-detail.webp"]) {
    const selected = selectedReferenceVehicle(
      new URLSearchParams({ vehicle: source.id }),
      {
        [source.title]: {
          ...source,
          sample: false,
          title: "Supplied title",
          image: "/supplied-photo.webp",
          imageAlt: "Supplied photo description",
          detailImage,
        },
      },
    );
    assert.ok(selected);
    const identity = referenceVehicleIdentity(selected, locale);
    assert.equal(identity.heading.title, "Supplied title");
    assert.equal(
      identity.gallery.slides[0].src,
      detailImage ?? "/supplied-photo.webp",
    );
    assert.equal(identity.gallery.slides[0].alt, "Supplied photo description");
    assert.equal(identity.gallery.slides.length, 6);
  }
});

test("desktop automotive sample copy preserves every paragraph, question, review and finance boundary", () => {
  const content = desktopReferenceDetailContent;
  assert.equal(content.overview.length, referenceDetailContent.overview.length);
  assert.equal(
    content.questions.length,
    referenceDetailContent.questions.length,
  );
  assert.equal(content.reviews.length, referenceDetailContent.reviews.length);
  for (const key of [
    "includedFeatures",
    "loanFields",
    "loanSummary",
    "reviewMetrics",
    "reviewSummary",
  ] as const)
    assert.equal(content[key], referenceDetailContent[key]);
  assert.deepEqual(
    content.questions.map(({ question, answer, ...identity }) => identity),
    referenceDetailContent.questions.map(
      ({ question, answer, ...identity }) => identity,
    ),
  );
  assert.deepEqual(
    content.reviews.map(({ text, ...identity }) => identity),
    referenceDetailContent.reviews.map(({ text, ...identity }) => identity),
  );
  const texts = [
    ...content.overview,
    ...content.questions.flatMap(({ question, answer }) => [question, answer]),
    ...content.reviews.map(({ text }) => text),
  ];
  for (const language of ["en", "bg"] as const) {
    for (const text of texts) {
      assert.equal(typeof text, "object");
      if (typeof text === "string") continue;
      const translated = translate(language, text.message);
      assert.notEqual(translated, text.message);
      assert.doesNotMatch(translated, /High Roller|Seltos|K3/i);
    }
    for (const review of content.reviews) {
      assert.equal(typeof review.text, "object");
      if (typeof review.text === "string") continue;
      assert.match(
        translate(language, review.text.message),
        language === "en" ? /^Sample review: / : /^Примерен отзив: /,
      );
    }
  }
});
