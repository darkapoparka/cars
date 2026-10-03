import { leadSite } from "@repo/marketplace";
import {
  isPublicSitePathEnabled,
  publicSite,
} from "@repo/marketplace/site-config";
import { DealerDesktopHero } from "@repo/marketplace-ui/components/dealer-desktop-hero";
import Image from "@repo/marketplace-ui/components/public-image";
import { getLocalizedPath, normalizeSeoLocale } from "@repo/seo/metadata";
import { ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";
import { createPublicLocalizedMetadata } from "@/lib/public-metadata";
import { requirePublicSitePath } from "@/lib/public-site-access";
import { getPublicWebBaseUrl } from "@/lib/public-url";
import styles from "../components/boxcar-desktop-pages.module.css";
import { MobileAboutContact } from "../components/mobile-about-contact";
import { PublicMarketplaceFrame } from "../components/public-marketplace-frame";
import { pageCopy } from "../contact/copy";

interface AboutProps {
  params: Promise<{ locale: string }>;
}
export async function generateMetadata({ params }: AboutProps) {
  const { locale } = await params;
  return createPublicLocalizedMetadata({
    baseUrl: getPublicWebBaseUrl(),
    locale,
    path: "/about",
    title: `${locale.startsWith("bg") ? "За нас" : "About us"} | ${leadSite.shortName}`,
    description: locale.startsWith("bg")
      ? "Разгледайте автомобилите и планирайте следващия си оглед."
      : "Browse our cars and plan your next viewing.",
  });
}
export default async function AboutPage({ params }: AboutProps) {
  requirePublicSitePath("/contact");
  const { locale } = await params;
  const normalized = normalizeSeoLocale(locale);
  const bg = normalized === "bg";
  const desktopIdentity =
    publicSite.identity.desktopPreview ?? publicSite.identity;
  const text = (bulgarian: string, english: string) =>
    bg ? bulgarian : english;
  const path = (href: string) => getLocalizedPath(normalized, href);
  const benefits = [
    {
      icon: "choice",
      title: text("Открийте своя автомобил", "Find your fit"),
      detail: text(
        "Разгледайте марки и бюджети и открийте подходящия автомобил.",
        "Explore makes and budgets to find your ideal car."
      ),
    },
    {
      icon: "pricing",
      title: text("Вижте детайлите", "See the details"),
      detail: text(
        "Сравнете цена, пробег и характеристики преди избора си.",
        "Compare prices, mileage and details before you shortlist."
      ),
    },
    {
      icon: "finance",
      title: text("Планирайте бюджета си", "Plan your budget"),
      detail: text(
        "Разгледайте възможностите за финансиране и месечните вноски.",
        "Explore financing options and monthly payments."
      ),
    },
    {
      icon: "care",
      title: text("Направете следващата стъпка", "Take the next step"),
      detail: text(
        "Попитайте за автомобил и уговорете оглед на място.",
        "Ask about a car and arrange a showroom viewing."
      ),
    },
  ];
  const questions = [
    [
      text(
        "Мога ли да запазя автомобили за по-късно?",
        "Can I save cars and come back later?"
      ),
      text(
        "Използвайте отметката върху автомобил. Изборът се запазва в този браузър, когато е разрешено локално съхранение.",
        "Use the bookmark on a car to add it to Saved. Your shortlist stays in this browser when browser storage is available."
      ),
    ],
    [
      text(
        "Къде мога да разгледам детайлите?",
        "Where can I review the details?"
      ),
      text(
        "Отворете автомобил от наличностите или от запазения избор, за да разгледате снимките, характеристиките и описанието.",
        "Open a car from the inventory or your shortlist to review its photos, specifications and description."
      ),
    ],
    [
      text("Как да уговоря оглед?", "How do I arrange a viewing?"),
      text(
        "Отворете Контакти и се обадете на екипа. Формулярът в този демо шаблон показва само локален преглед и не изпраща съобщения.",
        "Open Contact and call the team. The form in this template demo prepares a local preview without sending a message."
      ),
    ],
  ];
  return (
    <PublicMarketplaceFrame locale={normalized} showMobileDealerHeader={false}>
      <main className={styles.aboutPage}>
        <MobileAboutContact
          locale={normalized}
          services={pageCopy[normalized].services.filter((service) =>
            isPublicSitePathEnabled(service.href, publicSite)
          )}
        />
        <DealerDesktopHero
          appearance="photo"
          artwork={
            publicSite.artwork.desktopHeroScene ?? publicSite.artwork.heroScene
          }
          description={text(
            "Разгледайте автомобилите и сравнете избора си преди следващия оглед.",
            "Browse our cars and compare your favourites before your next viewing."
          )}
          locale={normalized}
          title={text(
            `За ${desktopIdentity.shortName}`,
            `About ${desktopIdentity.shortName}`
          )}
          variant="page"
        />
        <div className={styles.aboutContent}>
          <section
            aria-label={text(
              "Илюстративна галерия на автосалон",
              "Illustrative showroom gallery"
            )}
            className={styles.gallery}
          >
            <div className={styles.galleryLeft}>
              <div className={styles.chapter}>
                <span>{desktopIdentity.shortName}</span>
                <h2>
                  {text("Следващата ви", "Your next")}
                  <br />
                  {text("глава.", "chapter.")}
                </h2>
                <Link
                  aria-label={text("Открийте автомобил", "Find your next car")}
                  href={path("/cars")}
                >
                  <ArrowUpRight aria-hidden size={28} />
                </Link>
              </div>
              <figure>
                <Image
                  alt={text(
                    "Предаване на ключ за автомобил",
                    "A car key being handed to a customer"
                  )}
                  fill
                  sizes="220px"
                  src="/desktop-boxcars/about-1.jpg"
                />
              </figure>
            </div>
            <figure>
              <Image
                alt={text(
                  "Консултант в автосалон",
                  "A representative in a showroom"
                )}
                fill
                sizes="550px"
                src="/desktop-boxcars/about-2.jpg"
              />
            </figure>
            <div className={styles.galleryRight}>
              <figure>
                <Image
                  alt={text(
                    "Автомобили в светъл автосалон",
                    "Cars in a bright showroom"
                  )}
                  fill
                  sizes="550px"
                  src="/desktop-boxcars/about-3.jpg"
                />
              </figure>
              <div className={styles.galleryPair}>
                {[4, 5].map((number) => (
                  <figure key={number}>
                    <Image
                      alt=""
                      fill
                      sizes="300px"
                      src={`/desktop-boxcars/about-${number}.jpg`}
                    />
                  </figure>
                ))}
              </div>
            </div>
          </section>
          <section className={styles.benefits}>
            <h2>
              {text(
                "По-лесен път към следващия ви автомобил",
                "A simpler way to find your next car"
              )}
            </h2>
            <div className={styles.benefitGrid}>
              {benefits.map((benefit) => (
                <div key={benefit.icon}>
                  <Image
                    alt=""
                    height={60}
                    src={`/desktop-boxcars/about-${benefit.icon}.svg`}
                    width={60}
                  />
                  <h3>{benefit.title}</h3>
                  <p>{benefit.detail}</p>
                </div>
              ))}
            </div>
          </section>
          <section className={styles.aboutAction}>
            <h2>
              {text(
                "Нека открием следващия ви автомобил.",
                "Let’s find your next car."
              )}
            </h2>
            <p>
              {text(
                "Започнете с автомобилите. Ние ще помогнем за следващата стъпка.",
                "Start with the cars. We’ll help you take the next step."
              )}
            </p>
            <div className={styles.aboutActions}>
              <Link className={styles.contactAction} href={path("/cars")}>
                {text("Разгледайте автомобилите", "Explore cars")}
              </Link>
              <Link className={styles.secondaryAction} href={path("/contact")}>
                {text("Свържете се с нас", "Get in touch")}
              </Link>
            </div>
          </section>
          <section className={styles.aboutFaq}>
            <h2>
              {text(
                "Няколко полезни отговора",
                "A few things you might want to know"
              )}
            </h2>
            {questions.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <Plus aria-hidden size={20} />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </section>
        </div>
      </main>
    </PublicMarketplaceFrame>
  );
}
