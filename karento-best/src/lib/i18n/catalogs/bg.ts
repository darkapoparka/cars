import { referenceFeaturedBg } from "./reference-featured.ts";
import { referenceListingBg } from "./reference-listing.ts";
import { referenceOffersBg } from "./reference-offers.ts";
import { referenceControlsBg } from "./reference-controls.ts";
import { coreBg } from "./core.ts";
import { referenceEditorialBg } from "./reference-editorial.ts";
import { referenceServicesShopBg } from "./reference-services-shop.ts";
import { referenceAncillaryBg } from "./reference-ancillary.ts";
import { referenceDynamicBg } from "./reference-dynamic.ts";
import { referenceHomeBg } from "./reference-home.ts";
import { referenceVehicleBg } from "./reference-vehicle.ts";
import { referenceFinanceProcessBg } from "./reference-finance-process.ts";
import { referenceAboutFaqBg } from "./reference-about-faq.ts";
import { termsBg } from "./terms.ts";
import type { MessageCatalog } from "../schema.ts";
import { headerBg } from "./page-headers.ts";
import { uiBg } from "./ui.ts";
import { finalPolishBg } from "./final-polish.ts";
import { contactFooterBg } from "./contact-footer.ts";

export const bg = {
  ...referenceFeaturedBg,
  ...referenceListingBg,
  ...referenceOffersBg,
  ...referenceControlsBg,
  ...referenceEditorialBg,
  ...referenceServicesShopBg,
  ...referenceAncillaryBg,
  ...referenceDynamicBg,
  ...referenceHomeBg,
  ...referenceVehicleBg,
  ...referenceFinanceProcessBg,
  ...referenceAboutFaqBg,
  ...termsBg,
  ...headerBg,
  ...uiBg,
  ...coreBg,
  ...finalPolishBg,
  ...contactFooterBg,
} satisfies MessageCatalog;
