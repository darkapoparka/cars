import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/design-system/components/ui/accordion";
import { cn } from "@repo/design-system/lib/utils";
import {
  formatFuelType,
  formatMileage,
  formatMoney,
  formatTransmission,
  getListingPath,
  leadSite,
  parseMarketplaceSearchParams,
} from "@repo/marketplace";
import { marketplaceDiscoveryFrameClassName } from "@repo/marketplace-ui";
import { getVehicleCardSpecFacts } from "@repo/marketplace-ui/lib/vehicle-card-policy";
import { getLocalizedPath, normalizeSeoLocale } from "@repo/seo/metadata";
import { BadgeCheck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getPublicMarketplaceListings } from "@/lib/public-marketplace-data";
import { createPublicLocalizedMetadata } from "@/lib/public-metadata";
import { getPublicWebBaseUrl } from "@/lib/public-url";
import { PublicMarketplaceFrame } from "../components/public-marketplace-frame";
import { LeaseVehicleSelector } from "./lease-vehicle-selector";

interface LeasePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ vehicle?: string | string[] }>;
}

const leadingYearPattern = /^\d{4}\s+/;

const pageCopy = {
  bg: {
    badge: "Лизинг / финансиране — запитване",
    description: `Публикуваните обяви на ${leadSite.name} посочват възможности за лизинг или финансиране за определени автомобили. Изберете автомобил и се свържете директно за актуалните условия. Демото не е кредитна оферта и не подава заявление.`,
    faqTitle: "Преди запитване за финансиране",
    faqs: [
      {
        answer:
          "Изберете конкретна обява, проверете актуалния ѝ статус и се свържете с продавача. Посочете автомобила и попитайте кой предоставя финансирането и какви са текущите условия.",
        question: "Как да започна?",
      },
      {
        answer:
          "Първоначалната вноска и срокът зависят от конкретната обява, доставчика на финансиране и профила на клиента. Не приемайте примерна сметка в демото за индивидуална оферта.",
        question: "Каква първоначална вноска е необходима?",
      },
      {
        answer:
          "Поискайте актуален списък от продавача или финансовия доставчик за конкретната сделка. Не изпращайте лични документи, ЕГН или банкови данни през демонстрацията.",
        question: "Какви документи ще са ми нужни?",
      },
      {
        answer:
          "Не. Наличието на секция за финансиране не означава, че всеки показан автомобил е допустим. Потвърдете възможността и условията за конкретната обява.",
        question: "Всеки автомобил ли може да бъде финансиран?",
      },
    ],
    title: "Лизинг и финансиране за конкретен автомобил",
  },
  en: {
    badge: "Leasing / finance — enquiry",
    description: `Published ${leadSite.name} advertisements mention leasing or finance options for selected vehicles. Choose a vehicle and contact the seller directly for current terms. This demo is not a credit offer and does not submit an application.`,
    faqTitle: "Before a finance enquiry",
    faqs: [
      {
        answer:
          "Choose a specific listing, check its current status, and contact the seller. Identify the vehicle and ask who provides the finance and what current terms apply.",
        question: "How do I get started?",
      },
      {
        answer:
          "The initial payment and term depend on the specific listing, finance provider, and customer profile. Do not treat a demo calculation as an individual offer.",
        question: "What initial payment is required?",
      },
      {
        answer:
          "Ask the seller or finance provider for the current document list for the specific transaction. Do not send identity documents or banking data through the demo.",
        question: "Which documents will I need?",
      },
      {
        answer:
          "No. A finance section does not mean every displayed vehicle is eligible. Confirm availability and terms for the specific listing.",
        question: "Can every vehicle be financed?",
      },
    ],
    title: "Leasing and finance for a specific vehicle",
  },
} as const;

export const generateMetadata = async ({
  params,
}: LeasePageProps): Promise<Metadata> => {
  const { locale } = await params;
  const isBg = normalizeSeoLocale(locale) === "bg";

  return createPublicLocalizedMetadata({
    baseUrl: getPublicWebBaseUrl(),
    description: isBg
      ? `Обявите на ${leadSite.name} могат да посочват лизинг или финансиране. Потвърдете условията директно за конкретния автомобил.`
      : `${leadSite.name} listings may mention leasing or finance. Confirm current terms directly for the specific vehicle.`,
    locale,
    path: "/lease",
    title: isBg ? "Лизинг и финансиране — запитване" : "Leasing and finance enquiry",
  });
};

export default async function LeasePage({
  params,
  searchParams,
}: LeasePageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const initialVehicleId =
    typeof query.vehicle === "string" ? query.vehicle : "";
  const normalizedLocale = normalizeSeoLocale(locale);
  const copy = pageCopy[normalizedLocale];
  const localize = (path: string) => getLocalizedPath(normalizedLocale, path);
  const { listings } = await getPublicMarketplaceListings(
    parseMarketplaceSearchParams({ category: "car" })
  );
  const vehicles = listings.map((listing) => ({
    filterData: {
      category: listing.category,
      spec: listing.spec,
      seller: listing.seller,
      location: listing.location,
      supply: listing.supply,
      delivery: listing.delivery,
    },
    detailHref: localize(getListingPath(listing)),
    fuelLabel: formatFuelType(listing.spec.fuelType, normalizedLocale),
    id: listing.id,
    imageAlt: listing.images[0]?.alt || listing.title,
    imageUrl: listing.images[0]?.url || "/dealer/media-pending.svg",
    mileageLabel: formatMileage(listing.spec.mileageValue, normalizedLocale),
    priceLabel: formatMoney(listing.price, normalizedLocale),
    priceAmount: listing.price.amount,
    fuelType: listing.spec.fuelType,
    year: listing.spec.year,
    title: listing.title.replace(leadingYearPattern, ""),
    transmissionLabel:
      getVehicleCardSpecFacts(listing, normalizedLocale).find(
        (fact) => fact.id === "transmission"
      )?.value ??
      formatTransmission(listing.spec.transmission, normalizedLocale),
    yearLabel: String(listing.spec.year),
  }));

  return (
    <PublicMarketplaceFrame
      activeMode="lease"
      locale={normalizedLocale}
      mobileDealerHeaderTone="clean"
      showMobileDealerHeader={vehicles.length === 0}
      showMobileFooter={false}
    >
      <main className="lg:min-h-[38rem]">
        <div
          className={cn(
            marketplaceDiscoveryFrameClassName,
            "py-0 max-lg:px-0 lg:py-9"
          )}
          data-slot="lease-content-frame"
        >
          <section
            className="relative isolate lg:min-h-[32rem] lg:overflow-hidden lg:rounded-xl lg:border lg:border-border lg:shadow-panel"
            data-slot="lease-hero"
          >
            <Image
              alt=""
              className="hidden object-cover object-[62%_center] lg:block lg:object-center"
              fill
              priority
              sizes="(min-width: 1792px) calc(100vw - 96px), (min-width: 1440px) 1360px, calc(100vw - 48px)"
              src="/dealer/media-pending.svg"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 hidden bg-black/25 lg:block"
            />

            <div
              className="relative z-10 flex items-center justify-center lg:min-h-[32rem] lg:p-8"
              data-slot="lease-hero-content"
            >
              <div
                className="w-full max-w-5xl overflow-hidden bg-card p-0 lg:rounded-xl lg:border lg:border-border/80 lg:p-7 lg:shadow-2xl lg:shadow-black/25"
                data-slot="lease-finance-card"
              >
                <div className="mx-auto hidden w-fit items-center gap-2 rounded-full bg-secondary px-3 py-1.5 font-medium text-xs lg:flex">
                  <BadgeCheck aria-hidden="true" className="size-4" />
                  {copy.badge}
                </div>
                <h1 className="sr-only mx-auto mt-4 max-w-3xl text-balance text-center font-semibold text-page-title tracking-tight sm:text-page-title-lg lg:not-sr-only">
                  {copy.title}
                </h1>
                <p className="mx-auto mt-2 hidden max-w-2xl text-center text-body text-muted-foreground lg:block">
                  {copy.description}
                </p>

                <LeaseVehicleSelector
                  contactHref={localize("/contact")}
                  faqs={copy.faqs}
                  initialVehicleId={initialVehicleId}
                  key={initialVehicleId}
                  locale={normalizedLocale}
                  phoneDisplay={leadSite.phoneDisplay}
                  phoneHref={leadSite.phoneHref}
                  vehicles={vehicles}
                />
              </div>
            </div>
          </section>

          <section
            className="mx-auto mt-8 hidden w-full max-w-4xl sm:mt-10 lg:block"
            data-slot="lease-faq"
          >
            <h2 className="text-center font-semibold text-section-title tracking-tight sm:text-section-title-lg">
              {copy.faqTitle}
            </h2>
            <Accordion
              className="mt-4 overflow-hidden rounded-xl border border-border bg-card px-5 shadow-panel sm:px-6"
              collapsible
              type="single"
            >
              {copy.faqs.map((item, index) => (
                <AccordionItem key={item.question} value={`faq-${index + 1}`}>
                  <AccordionTrigger className="py-5 text-left text-body">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="max-w-3xl text-muted-foreground leading-6">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>
      </main>
    </PublicMarketplaceFrame>
  );
}
