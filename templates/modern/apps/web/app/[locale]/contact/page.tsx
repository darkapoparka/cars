import { withBasePath } from "@repo/internationalization/paths";
import { leadSite } from "@repo/marketplace";
import { getLeadCopy } from "@repo/marketplace/lead-copy";
import {
  isPublicSitePathEnabled,
  publicSite,
} from "@repo/marketplace/site-config";
import { DealerDesktopHero } from "@repo/marketplace-ui/components/dealer-desktop-hero";
import Image from "@repo/marketplace-ui/components/public-image";
import { getLocalizedPath, normalizeSeoLocale } from "@repo/seo/metadata";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { isPublicContactSubmissionAvailable } from "@/lib/public-contact-readiness";
import {
  createPublicLocalizedMetadata,
  getPublicSearchRobots,
} from "@/lib/public-metadata";
import { requirePublicSitePath } from "@/lib/public-site-access";
import { getPublicWebBaseUrl } from "@/lib/public-url";
import { parseSellVehicleDraft } from "@/lib/sell-vehicle-draft";
import { MobileAboutContact } from "../components/mobile-about-contact";
import {
  buildFinancingContactMessage,
  parseFinancingRequestHref,
} from "../components/mobile-financing-policy";
import desktopStyles from "../components/public-desktop-layout.module.css";
import { PublicEnquiryForm } from "../components/public-enquiry-form";
import { PublicMarketplaceFrame } from "../components/public-marketplace-frame";
import { pageCopy } from "./copy";
import { SellContactHandoff } from "./sell-contact-handoff";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const getQueryValue = (
  query: Record<string, string | string[] | undefined>,
  key: string
) => {
  const value = query[key];
  const firstValue = Array.isArray(value) ? value[0] : value;
  return typeof firstValue === "string" ? firstValue.trim() : "";
};

export const generateMetadata = async ({
  params,
  searchParams,
}: ContactPageProps): Promise<Metadata> => {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const isBg = normalizeSeoLocale(locale) === "bg";

  return createPublicLocalizedMetadata({
    baseUrl: getPublicWebBaseUrl(),
    description: isBg
      ? `${leadSite.name} в ${getLeadCopy(locale).city} — автомобили в наличност, внос по заявка и собствен лизинг.`
      : `${leadSite.name} in ${getLeadCopy(locale).city} — vehicles in stock, import on request, and in-house leasing.`,
    locale,
    path: "/contact",
    robots: getPublicSearchRobots(query),
    title: isBg
      ? `За нас и контакти | ${leadSite.shortName}`
      : `About and contact | ${leadSite.shortName}`,
  });
};

function DesktopContact({
  initialMessage,
  intent,
  locale,
  submissionAvailable,
}: {
  initialMessage: string;
  intent: "finance" | "general";
  locale: "bg" | "en";
  submissionAvailable: boolean;
}) {
  const copy = pageCopy[locale];
  const services = copy.services.filter((service) =>
    isPublicSitePathEnabled(service.href, publicSite)
  );
  const localize = (path: string) => getLocalizedPath(locale, path);
  return (
    <DealerDesktopHero
      description={
        locale === "bg"
          ? "Свържете се с екипа за автомобил, оглед, внос или финансиране."
          : "Talk to our team about a car, a viewing, importing or financing."
      }
      locale={locale}
      title={locale === "bg" ? "За нас и контакти" : "About and Contact"}
      variant="service"
    >
      <div className="hidden lg:block">
        <div className={desktopStyles.heroContent}>
          <section className={desktopStyles.showroomBanner}>
            <Image
              alt=""
              fill
              sizes="(min-width: 1440px) 1320px, 95vw"
              src={publicSite.artwork.contactHero}
            />
            <div>
              <h2>{leadSite.name}</h2>
              <p>
                {locale === "bg"
                  ? "Вашият следващ автомобил. Нашият екип е тук, за да помогне."
                  : "Your next car. Our team is here to help."}
              </p>
            </div>
          </section>
          <div className={desktopStyles.contactLayout}>
            <section aria-label={copy.contactTitle}>
              <h2 className={desktopStyles.sectionTitle}>
                {locale === "bg" ? "Нека поговорим" : "Get in Touch"}
              </h2>
              <p className={desktopStyles.contactIntro}>
                {locale === "bg"
                  ? "Свържете се с екипа, за да обсъдим автомобил, оглед, внос или финансиране."
                  : "Speak to our team about a car, a viewing, importing or financing."}
              </p>
              {submissionAvailable ? (
                <PublicEnquiryForm
                  initialMessage={initialMessage}
                  intent={intent}
                  locale={locale}
                />
              ) : (
                <a
                  className={desktopStyles.contactAction}
                  href={withBasePath(leadSite.phoneHref)}
                >
                  <Phone aria-hidden size={18} />
                  {locale === "bg" ? "Обадете се на екипа" : "Call Our Team"}
                  <ArrowUpRight aria-hidden size={18} />
                </a>
              )}
              <h3 className={desktopStyles.servicesTitle}>
                {copy.servicesTitle}
              </h3>
              <div className={desktopStyles.serviceGrid}>
                {services.map((service) => (
                  <Link
                    className={desktopStyles.serviceCard}
                    href={localize(service.href)}
                    key={service.href}
                  >
                    <strong>
                      {service.title}
                      <ArrowUpRight aria-hidden size={17} />
                    </strong>
                    <p>{service.description}</p>
                  </Link>
                ))}
              </div>
            </section>
            <aside className={desktopStyles.contactDetails}>
              <h2>
                {locale === "bg" ? "Посетете автосалона" : "Visit the Showroom"}
              </h2>
              <a
                className={desktopStyles.contactCard}
                href={withBasePath(leadSite.phoneHref)}
              >
                <Phone aria-hidden size={24} strokeWidth={1.5} />
                <span>
                  <small>{locale === "bg" ? "Телефон" : "Phone"}</small>
                  <strong>{leadSite.phoneDisplay}</strong>
                </span>
              </a>
              <a
                aria-label={copy.mapAction}
                className={desktopStyles.contactCard}
                href={withBasePath(leadSite.mapsUrl)}
                rel="noreferrer"
                target="_blank"
              >
                <MapPin aria-hidden size={24} strokeWidth={1.5} />
                <span>
                  <small>{copy.locationLabel}</small>
                  <strong>
                    {getLeadCopy(locale).address}, {getLeadCopy(locale).city}
                  </strong>
                </span>
                <ArrowUpRight aria-hidden size={18} />
              </a>
            </aside>
          </div>
        </div>
      </div>
    </DealerDesktopHero>
  );
}

export default async function ContactPage({
  params,
  searchParams,
}: ContactPageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const normalizedLocale = normalizeSeoLocale(locale);
  const copy = pageCopy[normalizedLocale];
  const services = copy.services.filter((service) =>
    isPublicSitePathEnabled(service.href, publicSite)
  );
  const submissionAvailable = isPublicContactSubmissionAvailable();
  const financeQuery = new URLSearchParams();
  for (const key of ["intent", "vehicle", "term", "deposit"]) {
    const value = getQueryValue(query, key);
    if (value) {
      financeQuery.set(key, value);
    }
  }
  const financeContext = parseFinancingRequestHref(`/contact?${financeQuery}`);
  if (financeContext) {
    requirePublicSitePath("/lease");
  }
  const initialMessage = financeContext
    ? buildFinancingContactMessage({
        deposit: financeContext.deposit ?? "flexible",
        locale: normalizedLocale,
        note: "",
        request: financeContext,
      })
    : "";
  const sellContext =
    getQueryValue(query, "intent") === "sell" ||
    getQueryValue(query, "topic") === "trade-in"
      ? parseSellVehicleDraft(query)
      : null;

  if (sellContext) {
    requirePublicSitePath("/sell");
    return (
      <SellContactHandoff
        draft={sellContext}
        locale={normalizedLocale}
        submissionAvailable={submissionAvailable}
      />
    );
  }

  return (
    <PublicMarketplaceFrame
      locale={normalizedLocale}
      showMobileDealerHeader={false}
    >
      <main className="bg-background text-zinc-950">
        <MobileAboutContact locale={normalizedLocale} services={services} />
        <DesktopContact
          initialMessage={initialMessage}
          intent={financeContext ? "finance" : "general"}
          locale={normalizedLocale}
          submissionAvailable={submissionAvailable}
        />
        {submissionAvailable && (
          <div
            className="mx-auto max-w-2xl px-4 py-8 lg:hidden"
            id="contact-form"
          >
            <PublicEnquiryForm
              initialMessage={initialMessage}
              intent={financeContext ? "finance" : "general"}
              locale={normalizedLocale}
            />
          </div>
        )}
      </main>
    </PublicMarketplaceFrame>
  );
}
