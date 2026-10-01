import { withBasePath } from "@repo/internationalization/paths";
import { getLeadCopy } from "@repo/marketplace/lead-copy";
import {
  isPublicSitePathEnabled,
  publicSite,
} from "@repo/marketplace/site-config";
import {
  ArrowRight,
  ArrowUpRight,
  HandCoins,
  MapPin,
  Phone,
  Ship,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { getLocalizedPublicPath } from "../lib/public-path";
import styles from "./dealer-desktop-showroom-sections.module.css";

/** Routes and contact details come from the same capability and identity contract as navigation. */
export function DealerDesktopShowroomSections({ locale }: { locale?: string }) {
  const isBg = locale?.toLowerCase().startsWith("bg") ?? false;
  const text = (bg: string, en: string) => (isBg ? bg : en);
  const copy = getLeadCopy(locale);
  const services = [
    {
      path: "/imports",
      icon: Ship,
      title: text("Вашият избор. Нашият екип.", "Your choice. Our team."),
      label: text("Внос по заявка", "Vehicle import"),
      description: text(
        "Намерили сте автомобил в чужбина? Разгледайте маршрутите или споделете обявата с нас.",
        "Found a vehicle abroad? Explore the import routes or share the listing with us."
      ),
      action: text("Разгледайте възможностите", "Explore import options"),
    },
    {
      path: "/lease",
      icon: HandCoins,
      title: text("Следващата стъпка е ваша.", "Make the next move."),
      label: text("Финансиране", "Vehicle financing"),
      description: text(
        "Изберете автомобил и предпочитания за срок и първоначална вноска. Обсъдете условията с екипа.",
        "Choose a vehicle, a preferred term and an initial payment. Discuss the terms with our team."
      ),
      action: text("Вижте финансирането", "Explore financing"),
    },
    {
      path: "/sell",
      icon: Tag,
      title: text("Време е за промяна.", "Ready for a change."),
      label: text("Продай или замени", "Sell or trade in"),
      description: text(
        "Разкажете ни за вашия автомобил и обсъдете възможностите за продажба или замяна.",
        "Tell us about your vehicle and discuss your options for selling or trading in."
      ),
      action: text("Започнете оттук", "Start here"),
    },
  ].filter((service) => isPublicSitePathEnabled(service.path, publicSite));

  return (
    <div className={styles.sections}>
      {services.length > 0 ? (
        <section
          aria-labelledby="desktop-services-title"
          className={styles.services}
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>
                {text("Повече от автомобили", "Beyond the inventory")}
              </p>
              <h2 id="desktop-services-title">
                {text("За всяка следваща стъпка.", "For every next step.")}
              </h2>
            </div>
            <p>
              {text(
                "Открийте подходящия път към следващия си автомобил.",
                "Find the right way to your next vehicle."
              )}
            </p>
          </div>
          <div className={styles.serviceGrid}>
            {services.map(
              ({ path, icon: Icon, title, label, description, action }) => (
                <Link
                  className={styles.serviceCard}
                  href={getLocalizedPublicPath(locale, path)}
                  key={path}
                >
                  <div className={styles.serviceTop}>
                    <span>{label}</span>
                    <Icon aria-hidden="true" size={25} strokeWidth={1.4} />
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <span className={styles.serviceAction}>
                    {action}
                    <ArrowRight aria-hidden="true" size={18} />
                  </span>
                </Link>
              )
            )}
          </div>
        </section>
      ) : null}
      {isPublicSitePathEnabled("/contact", publicSite) ? (
        <section
          aria-labelledby="desktop-showroom-title"
          className={styles.showroom}
        >
          <div>
            <p className={styles.eyebrow}>
              {publicSite.identity.name} · {copy.city}
            </p>
            <h2 id="desktop-showroom-title">
              {text(
                "Да поговорим за вашия автомобил.",
                "Let's talk about your next drive."
              )}
            </h2>
            <p className={styles.address}>
              <MapPin aria-hidden="true" size={17} />
              {copy.address}, {copy.city}
            </p>
          </div>
          <div className={styles.showroomActions}>
            <a href={withBasePath(publicSite.contact.phoneHref)}>
              <Phone aria-hidden="true" size={18} />
              {publicSite.contact.phoneDisplay}
            </a>
            <Link href={getLocalizedPublicPath(locale, "/contact")}>
              {text("Връзка с нас", "Get in touch")}
              <ArrowUpRight aria-hidden="true" size={18} />
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
