import { message, type CatalogText } from "#lib/i18n/text.ts";
/** Neutral buying guidance; no booking or purchase is completed by these links. */
export interface PurchaseStep {
  readonly id: string;
  readonly title: CatalogText;
  readonly description: CatalogText;
  readonly mobileDescriptionLines?: readonly [CatalogText, CatalogText];
  readonly image: string;
  readonly href: string;
}

export interface PurchaseProcess {
  readonly title: CatalogText;
  readonly description: CatalogText;
  readonly steps: readonly PurchaseStep[];
}

export const purchaseProcess = {
  title: message("purchaseProcess.title"),
  description: message("purchaseProcess.description"),
  steps: [
    {
      id: "find",
      title: message("purchaseProcess.find.title"),
      description: message("purchaseProcess.find.description"),
      mobileDescriptionLines: [
        message("purchaseProcess.find.mobileFirst"),
        message("purchaseProcess.find.mobileSecond"),
      ],
      image: "/assets/karento-best/how-it-works/choose-20261006.webp",
      href: "/vehicles",
    },
    {
      id: "talk",
      title: message("purchaseProcess.talk.title"),
      description: message("purchaseProcess.talk.description"),
      mobileDescriptionLines: [
        message("purchaseProcess.talk.mobileFirst"),
        message("purchaseProcess.talk.mobileSecond"),
      ],
      image: "/assets/karento-best/how-it-works/talk-20261006.webp",
      href: "/contact",
    },
    {
      id: "view",
      title: message("purchaseProcess.view.title"),
      description: message("purchaseProcess.view.description"),
      mobileDescriptionLines: [
        message("purchaseProcess.view.mobileFirst"),
        message("purchaseProcess.view.mobileSecond"),
      ],
      image: "/assets/karento-best/how-it-works/view-20261006-v2.webp",
      href: "/contact",
    },
    {
      id: "collect",
      title: message("purchaseProcess.collect.title"),
      description: message("purchaseProcess.collect.description"),
      mobileDescriptionLines: [
        message("purchaseProcess.collect.mobileFirst"),
        message("purchaseProcess.collect.mobileSecond"),
      ],
      image: "/assets/karento-best/how-it-works/collect-20261006.webp",
      href: "/contact",
    },
  ],
} as const satisfies PurchaseProcess;
