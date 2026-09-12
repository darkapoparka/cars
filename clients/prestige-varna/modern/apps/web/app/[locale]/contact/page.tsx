import { cn } from "@repo/design-system/lib/utils";
import { leadSite, dealerServiceCopy } from "@repo/marketplace";
import { marketplaceDiscoveryFrameClassName } from "@repo/marketplace-ui";
import { getLocalizedPath, normalizeSeoLocale } from "@repo/seo/metadata";
import {
  ArrowUpRight,
  CarFront,
  ChevronRight,
  Landmark,
  MapPin,
  Phone,
  Ship,
  Tag,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  createPublicLocalizedMetadata,
  getPublicSearchRobots,
} from "@/lib/public-metadata";
import { getPublicWebBaseUrl } from "@/lib/public-url";
import { MobileAboutContact } from "../components/mobile-about-contact";
import { PublicMarketplaceFrame } from "../components/public-marketplace-frame";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const pageCopy = {
  bg: {
    heroImageAlt: "Информация за контакт с автокъщата",
    title: `${leadSite.name} · ${leadSite.city}`,
    description:
      `Разгледайте обявите и уточнете конкретния автомобил с ${leadSite.shortName}.`,
    inventoryAction: "Разгледайте автомобилите",
    phoneAction: "Обадете се",
    contactTitle: "Свържете се с продавача",
    contactDescription:
      `Телефон ${leadSite.phoneDisplay}. Потвърдете автомобила, часа и мястото преди посещение.`,
    locationLabel: leadSite.address,
    mapAction: "Отворете картата",
    servicesTitle: "Изберете правилната посока.",
    servicesDescription:
      "Изберете тема за разговор. Услугите и условията се уточняват за конкретната сделка.",
    sellHandoffAction: "Обадете се за разговор",
    sellHandoffDescription:
      `Данните са подготвени само в демото и не са изпратени. Обадете се на ${leadSite.phoneDisplay}, за да попитате дали предложението може да бъде разгледано.`,
    sellHandoffEditAction: "Редактирайте данните",
    sellHandoffTitle: "Подгответе предложение за автомобил",
    sellCategoryLabel: "Категория",
    sellDetailsLabel: "Екстри и бележки",
    sellMileageLabel: "Пробег",
    sellVehicleLabel: "Автомобил",
    sellYearLabel: "Година",
    sellLocationLabel: leadSite.address,
    services: [
      {
        title: "Автомобилни обяви",
        description: "Разгледайте предложенията и планирайте оглед.",
        href: "/cars",
        icon: CarFront,
      },
      {
        title: "Въпрос за внос",
        description: "Кажете какво търсите и започнете разговор.",
        href: "/imports",
        icon: Ship,
      },
      {
        title: "Запитване за финансиране",
        description: dealerServiceCopy.finance,
        href: "/lease",
        icon: Landmark,
      },
      {
        title: "Предложение за автомобил",
        description: "Подгответе данни и попитайте дали продавачът разглежда предложението.",
        href: "/sell",
        icon: Tag,
      },
    ],
  },
  en: {
    heroImageAlt: "Dealership contact information",
    title: `${leadSite.name} · ${leadSite.city}`,
    description:
      `Browse the advertisements and discuss a specific vehicle with ${leadSite.shortName}.`,
    inventoryAction: "Browse vehicles",
    phoneAction: "Call us",
    contactTitle: "Contact the seller",
    contactDescription:
      `Call ${leadSite.phoneDisplay}. Confirm the vehicle, viewing time and location before visiting.`,
    locationLabel: leadSite.address,
    mapAction: "Open the map",
    servicesTitle: "Choose the right direction.",
    servicesDescription:
      "Choose a topic for your conversation. Services and terms must be agreed for the specific transaction.",
    sellHandoffAction: "Call to discuss",
    sellHandoffDescription:
      `The details have only been prepared in this demo; nothing has been sent. Call ${leadSite.phoneDisplay} to ask whether the seller will consider the proposal.`,
    sellHandoffEditAction: "Edit vehicle details",
    sellHandoffTitle: "Prepare a vehicle proposal",
    sellCategoryLabel: "Category",
    sellDetailsLabel: "Extras and notes",
    sellMileageLabel: "Mileage",
    sellVehicleLabel: "Vehicle",
    sellYearLabel: "Year",
    sellLocationLabel: leadSite.address,
    services: [
      {
        title: "Vehicle advertisements",
        description: "Browse the offers and plan an inspection.",
        href: "/cars",
        icon: CarFront,
      },
      {
        title: "Import questions",
        description:
          "Tell us what you are looking for and start a conversation.",
        href: "/imports",
        icon: Ship,
      },
      {
        title: "Finance questions",
        description: "Discuss an option for the vehicle and your budget.",
        href: "/lease",
        icon: Landmark,
      },
      {
        title: "Vehicle proposal",
        description: "Prepare your vehicle details and ask whether the seller will consider them.",
        href: "/sell",
        icon: Tag,
      },
    ],
  },
} as const;

const sellCategoryLabels = {
  bg: {
    car: "Автомобил",
    motorbike: "Мотоциклет",
    truck: "Камион",
    van: "Бус",
  },
  en: {
    car: "Car",
    motorbike: "Motorbike",
    truck: "Truck",
    van: "Van",
  },
} as const;

const sellCategoryAssets = {
  car: "/dealer/media-pending.svg",
  motorbike: "/dealer/media-pending.svg",
  truck: "/dealer/media-pending.svg",
  van: "/dealer/media-pending.svg",
} as const;

const getQueryValue = (
  query: Record<string, string | string[] | undefined>,
  key: string
) => {
  const value = query[key];
  const firstValue = Array.isArray(value) ? value[0] : value;
  return typeof firstValue === "string" ? firstValue.trim() : "";
};

const getSellCategoryLabel = (locale: "bg" | "en", category: string) =>
  sellCategoryLabels[locale][
    category as keyof (typeof sellCategoryLabels)["bg"]
  ] ?? category;

export const generateMetadata = async ({
  params,
  searchParams,
}: ContactPageProps): Promise<Metadata> => {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const isBg = normalizeSeoLocale(locale) === "bg";

  return createPublicLocalizedMetadata({
    baseUrl: getPublicWebBaseUrl(),
    description: isBg
      ? `Контакти за ${leadSite.name}, ${leadSite.city}. Потвърдете автомобила, часа и мястото на оглед.`
      : `Contact ${leadSite.name}, ${leadSite.city}. Confirm the vehicle, viewing time and location.`,
    locale,
    path: "/contact",
    robots: getPublicSearchRobots(query),
    title: isBg
      ? "За нас и контакти | ПРЕСТИЖ"
      : "About and contact | ПРЕСТИЖ",
  });
};

export default async function ContactPage({
  params,
  searchParams,
}: ContactPageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const normalizedLocale = normalizeSeoLocale(locale);
  const copy = pageCopy[normalizedLocale];
  const localize = (path: string) => getLocalizedPath(normalizedLocale, path);
  const sellContext =
    getQueryValue(query, "intent") === "sell"
      ? {
          category: getQueryValue(query, "category"),
          make: getQueryValue(query, "make"),
          mileage: getQueryValue(query, "mileage"),
          model: getQueryValue(query, "model"),
          notes: getQueryValue(query, "notes").slice(0, 500),
          year: getQueryValue(query, "year"),
        }
      : null;
  const sellVehicleName = [sellContext?.make, sellContext?.model]
    .filter(Boolean)
    .join(" ");
  const selectedVehicleAsset =
    sellCategoryAssets[
      sellContext?.category as keyof typeof sellCategoryAssets
    ] ?? sellCategoryAssets.car;
  const sellEditParams = new URLSearchParams();
  if (sellContext) {
    for (const [key, value] of Object.entries(sellContext)) {
      if (value) {
        sellEditParams.set(key, value);
      }
    }
  }
  const sellEditHref = `${localize("/sell")}?${sellEditParams.toString()}`;

  if (sellContext) {
    return (
      <PublicMarketplaceFrame activeMode="sell" locale={normalizedLocale}>
        <main className="lg:min-h-[38rem]">
          <div
            className={cn(
              marketplaceDiscoveryFrameClassName,
              "py-5 sm:py-7 lg:py-9"
            )}
          >
            <section
              className="relative isolate min-h-[28rem] overflow-hidden rounded-xl border border-border shadow-panel sm:min-h-[26rem]"
              data-slot="sell-contact-handoff"
            >
              <Image
                alt=""
                className="object-cover object-center"
                fill
                priority
                sizes="(min-width: 1792px) calc(100vw - 96px), (min-width: 1440px) 1360px, calc(100vw - 48px)"
                src="/dealer/media-pending.svg"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-black/10"
              />

              <div className="relative z-10 flex min-h-[28rem] items-center justify-center p-3 sm:min-h-[26rem] sm:p-6">
                <div className="w-full max-w-2xl rounded-xl border border-border/80 bg-card p-5 shadow-2xl shadow-black/20 sm:p-6 lg:p-7">
                  <h1 className="text-balance text-center font-semibold text-page-title tracking-tight sm:text-page-title-lg">
                    {copy.sellHandoffTitle}
                  </h1>
                  <p className="mx-auto mt-2 max-w-lg text-center text-body text-muted-foreground">
                    {copy.sellHandoffDescription}
                  </p>

                  <div className="mt-6 grid gap-1.5">
                    <span className="text-meta text-muted-foreground">
                      {copy.sellVehicleLabel}
                    </span>
                    <Link
                      aria-label={copy.sellHandoffEditAction}
                      className="group grid min-h-20 w-full grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-3 overflow-hidden rounded-lg border border-border/60 bg-card p-2 text-left outline-none transition-colors hover:bg-control-hover focus-visible:ring-[3px] focus-visible:ring-ring/40 sm:grid-cols-[5.25rem_minmax(0,1fr)_auto] sm:gap-3"
                      data-slot="sell-selected-vehicle"
                      href={sellEditHref}
                    >
                      <span className="relative h-14 overflow-hidden rounded-md sm:h-16">
                        <Image
                          alt=""
                          aria-hidden="true"
                          className="object-contain"
                          fill
                          sizes="80px"
                          src={selectedVehicleAsset}
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-body">
                          {sellVehicleName || "—"}
                        </span>
                        <span className="mt-1 block text-meta text-muted-foreground">
                          {getSellCategoryLabel(
                            normalizedLocale,
                            sellContext.category
                          )}{" "}
                          · {sellContext.year || "—"} ·{" "}
                          {sellContext.mileage
                            ? `${sellContext.mileage} км`
                            : "—"}
                        </span>
                      </span>
                      <span className="flex items-center gap-1 pr-1 font-semibold text-meta">
                        <span className="hidden sm:inline">
                          {copy.sellHandoffEditAction}
                        </span>
                        <ChevronRight
                          aria-hidden="true"
                          className="size-4 transition-transform group-hover:translate-x-0.5"
                        />
                      </span>
                    </Link>
                  </div>

                  {sellContext.notes ? (
                    <div className="mt-5 border-border border-t pt-4">
                      <p className="text-muted-foreground text-xs">
                        {copy.sellDetailsLabel}
                      </p>
                      <p className="mt-1 max-h-24 overflow-auto whitespace-pre-wrap break-words text-sm leading-6">
                        {sellContext.notes}
                      </p>
                    </div>
                  ) : null}

                  <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <a
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--lead-site-accent)] px-5 font-semibold text-sm text-white transition-colors hover:bg-[var(--lead-site-accent-hover)] focus-visible:outline-2 focus-visible:outline-[var(--lead-site-accent)] focus-visible:outline-offset-3"
                      href={leadSite.phoneHref}
                    >
                      <Phone aria-hidden="true" className="size-4" />
                      {copy.sellHandoffAction}
                    </a>
                  </div>

                  <a
                    className="mx-auto mt-5 block w-fit text-center text-muted-foreground text-sm underline-offset-4 hover:text-foreground hover:underline"
                    href={leadSite.mapsUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {copy.sellLocationLabel} · {leadSite.address}
                  </a>
                </div>
              </div>
            </section>
          </div>
        </main>
      </PublicMarketplaceFrame>
    );
  }

  return (
    <PublicMarketplaceFrame
      locale={normalizedLocale}
      showMobileDealerHeader={false}
    >
      <main className="bg-background text-zinc-950 lg:bg-[#0b0c0e] lg:text-white">
        <MobileAboutContact
          locale={normalizedLocale}
          services={copy.services}
        />
        <section className="relative isolate hidden overflow-hidden border-white/10 border-b lg:block">
          <div className="absolute inset-0 -z-20 bg-[#08090a]">
            <Image
              alt={copy.heroImageAlt}
              className="object-cover object-center opacity-95"
              fill
              priority
              sizes="100vw"
              src="/dealer/media-pending.svg"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-black/55"
          />

          <div className="mx-auto grid min-h-[31rem] max-w-[90rem] items-center gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.65fr)] lg:gap-12 lg:px-8 lg:py-22">
            <div className="max-w-2xl">
              <h1 className="max-w-2xl text-balance font-semibold text-display tracking-[-0.03em] lg:text-display-lg">
                {copy.title}
              </h1>
              <p className="mt-5 max-w-xl text-prose text-white/80 sm:text-lg sm:leading-7">
                {copy.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 lg:mt-8">
                <Link
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 font-semibold text-sm text-white transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-3"
                  href={localize("/cars")}
                  style={{ backgroundColor: leadSite.accent }}
                >
                  {copy.inventoryAction}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </Link>
                <a
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white/10 px-5 font-semibold text-sm text-white ring-1 ring-white/25 transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-3"
                  href={leadSite.phoneHref}
                >
                  <Phone aria-hidden="true" className="size-4" />
                  {copy.phoneAction}
                </a>
              </div>
            </div>

            <aside className="border-white/25 border-t pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-7">
              <h2 className="font-semibold text-dialog-title tracking-tight">
                {copy.contactTitle}
              </h2>
              <p className="mt-2 max-w-xs text-body text-white/75">
                {copy.contactDescription}
              </p>
              <div className="mt-6 max-w-xs">
                <a
                  className="group flex min-h-14 w-full items-center justify-between border-white/20 border-b py-3 transition-colors hover:border-white/50 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-3"
                  href={leadSite.phoneHref}
                >
                  <span>
                    <span className="block text-meta text-white/65">
                      Телефон
                    </span>
                    <span className="mt-1 block font-semibold text-base">
                      {leadSite.phoneDisplay}
                    </span>
                  </span>
                  <Phone
                    aria-hidden="true"
                    className="size-4 text-white/65 transition-colors group-hover:text-white"
                  />
                </a>
                <a
                  aria-label={`${copy.mapAction}: ${leadSite.address}, ${leadSite.city}`}
                  className="group flex min-h-14 w-full items-center justify-between border-white/20 border-b py-3 transition-colors hover:border-white/50 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-3"
                  href={leadSite.mapsUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span>
                    <span className="block text-meta text-white/65">
                      {copy.locationLabel}
                    </span>
                    <span className="mt-1 block font-semibold text-body">
                      {leadSite.address}, {leadSite.city}
                    </span>
                  </span>
                  <MapPin
                    aria-hidden="true"
                    className="size-4 text-white/65 transition-colors group-hover:text-white"
                  />
                </a>
              </div>
            </aside>
          </div>
        </section>

        <section className="hidden border-white/10 border-b lg:block">
          <div className="mx-auto max-w-[90rem] px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
            <div className="max-w-2xl">
              <h2 className="text-balance font-semibold text-section-title tracking-[-0.02em] sm:text-section-title-lg">
                {copy.servicesTitle}
              </h2>
              <p className="mt-3 max-w-xl text-body text-white/75">
                {copy.servicesDescription}
              </p>
            </div>

            <div className="mt-9 grid border-white/15 border-y md:grid-cols-4">
              {copy.services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Link
                    className={`group flex min-h-40 items-start gap-4 py-5 transition-colors hover:bg-white/[0.03] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[-3px] md:px-5 md:py-6 ${
                      index > 0
                        ? "border-white/15 border-t md:border-t-0 md:border-l"
                        : ""
                    }`}
                    href={localize(service.href)}
                    key={service.title}
                  >
                    <Icon
                      aria-hidden="true"
                      className="mt-0.5 size-5 shrink-0 text-white/60 transition-colors group-hover:text-white"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-3">
                        <span className="font-semibold text-base">
                          {service.title}
                        </span>
                        <ArrowUpRight
                          aria-hidden="true"
                          className="mt-0.5 size-4 shrink-0 text-white/45 transition-colors group-hover:text-white"
                        />
                      </span>
                      <span className="mt-2 block max-w-xs text-meta text-white/70">
                        {service.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </PublicMarketplaceFrame>
  );
}
