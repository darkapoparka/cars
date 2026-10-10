import { referenceFeaturedEn } from "./reference-featured.ts";
import { referenceListingEn } from "./reference-listing.ts";
import { referenceOffersEn } from "./reference-offers.ts";
import { referenceControlsEn } from "./reference-controls.ts";
import { coreEn } from "./core.ts";
import { referenceEditorialEn } from "./reference-editorial.ts";
import { referenceServicesShopEn } from "./reference-services-shop.ts";
import { referenceAncillaryEn } from "./reference-ancillary.ts";
import { referenceDynamicEn } from "./reference-dynamic.ts";
import { referenceHomeEn } from "./reference-home.ts";
import { referenceVehicleEn } from "./reference-vehicle.ts";
import { referenceFinanceProcessEn } from "./reference-finance-process.ts";
import { referenceAboutFaqEn } from "./reference-about-faq.ts";
import { termsEn } from "./terms.ts";
import { headerEn } from "./page-headers.ts";
import { uiEn } from "./ui.ts";
import { finalPolishEn } from "./final-polish.ts";
import { contactFooterEn } from "./contact-footer.ts";
/** Stable message identifiers. Business facts and listing titles do not belong here. */
export const en = {
  ...referenceFeaturedEn,
  ...referenceListingEn,
  ...referenceOffersEn,
  ...referenceControlsEn,
  ...referenceEditorialEn,
  ...referenceServicesShopEn,
  ...referenceAncillaryEn,
  ...referenceDynamicEn,
  ...referenceHomeEn,
  ...referenceVehicleEn,
  ...referenceFinanceProcessEn,
  ...referenceAboutFaqEn,
  ...termsEn,
  ...headerEn,
  ...uiEn,
  ...coreEn,
  ...finalPolishEn,
  ...contactFooterEn,
} as const;
