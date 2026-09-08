import { Button } from "@repo/design-system/components/ui/button";
import { getLocalizedPath, normalizeSeoLocale } from "@repo/seo/metadata";
import { ArrowLeft, FileText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createPublicLocalizedMetadata } from "@/lib/public-metadata";
import { getPublicWebBaseUrl } from "@/lib/public-url";
import { PublicMarketplaceFrame } from "../../components/public-marketplace-frame";

interface LegalPageProperties {
  readonly params: Promise<{
    locale: string;
    slug: string;
  }>;
}

interface FallbackLegalPage {
  description: string;
  sections: readonly {
    body: string;
    heading: string;
  }[];
  title: string;
}

const fallbackLegalSlugs = ["privacy", "terms"] as const;

const getPrivacyFallback = (isBg: boolean): FallbackLegalPage => isBg ? {
  "title": "Поверителност в демонстрацията",
  "description": "Какво правят контролите в този независим преглед.",
  "sections": [
    {
      "heading": "Контакт",
      "body": "Формите в тази демонстрация не доставят съобщения до автокъщата. За реален разговор използвайте публикувания телефон."
    },
    {
      "heading": "Вашият браузър",
      "body": "Избрани филтри, любими автомобили и предпочитания могат да останат в браузъра. Това не създава клиентска регистрация при Навара кар."
    },
    {
      "heading": "Външни връзки",
      "body": "Връзките към обяви, карти и телефон отварят съответната външна услуга. Нейните условия се проверяват отделно."
    }
  ]
} : {
  "title": "Privacy in this preview",
  "description": "How controls behave in this independent preview.",
  "sections": [
    {
      "heading": "Contact",
      "body": "Forms in this preview do not deliver messages to the dealership. Use the published phone number for a real conversation."
    },
    {
      "heading": "Your browser",
      "body": "Selected filters, saved vehicles and preferences may remain in your browser. This does not register you as a Navara Car customer."
    },
    {
      "heading": "External links",
      "body": "Listing, map and phone links open the relevant external service. Check its terms separately."
    }
  ]
};

const getTermsFallback = (isBg: boolean): FallbackLegalPage => isBg ? {
  "title": "За демонстрацията",
  "description": "Независим дизайн с датирани примери от обяви.",
  "sections": [
    {
      "heading": "Обяви",
      "body": "Данните и снимките са примери от публикувани обяви към 08.09.2026 г. Наличност, цена, състояние и оборудване се потвърждават директно с продавача."
    },
    {
      "heading": "Услуги",
      "body": "Съдействието за регистрация и възможността за лизинг са описани в отделни обяви. Конкретните условия се уточняват с продавача. Внос по заявка, изкупуване и бартер не са потвърдени услуги в този преглед."
    },
    {
      "heading": "Без сделка или доставка на съобщение",
      "body": "Демонстрационните контроли не сключват договор, не резервират автомобил, не одобряват финансиране и не изпращат запитване до автокъщата. Това не са официални търговски условия на Навара кар."
    }
  ]
} : {
  "title": "About this preview",
  "description": "An independent design using dated listing examples.",
  "sections": [
    {
      "heading": "Listings",
      "body": "Details and photos are samples from published listings dated 8 September 2026. Confirm availability, price, condition and equipment directly with the seller."
    },
    {
      "heading": "Services",
      "body": "Registration assistance and leasing are mentioned in individual listings. Confirm specific terms with the seller. Import-on-request, vehicle purchasing and trade-in are not confirmed services in this preview."
    },
    {
      "heading": "No transaction or message delivery",
      "body": "Preview controls do not create contracts, reserve vehicles, approve finance or deliver enquiries to the dealership. These are not official Navara Car commercial terms."
    }
  ]
};

const getFallbackLegalPage = (
  slug: string,
  isBg: boolean
): FallbackLegalPage | null => {
  if (slug === "privacy") {
    return getPrivacyFallback(isBg);
  }

  return slug === "terms" ? getTermsFallback(isBg) : null;
};

export const generateMetadata = async ({
  params,
}: LegalPageProperties): Promise<Metadata> => {
  const { locale, slug } = await params;
  const normalizedLocale = normalizeSeoLocale(locale);
  const isBg = normalizedLocale === "bg";
  const fallbackPage = getFallbackLegalPage(slug, isBg);
  if (!fallbackPage) {
    return {};
  }

  return createPublicLocalizedMetadata({
    baseUrl: getPublicWebBaseUrl(),
    description: fallbackPage.description,
    locale: normalizedLocale,
    path: `/legal/${slug}`,
    title: fallbackPage.title,
  });
};

export const generateStaticParams = (): { slug: string }[] =>
  fallbackLegalSlugs.map((slug) => ({ slug }));

const LegalPage = async ({ params }: LegalPageProperties) => {
  const { locale, slug } = await params;
  const normalizedLocale = normalizeSeoLocale(locale);
  const isBg = normalizedLocale === "bg";
  const fallbackPage = getFallbackLegalPage(slug, isBg);

  if (!fallbackPage) {
    notFound();
  }

  const { description, sections, title } = fallbackPage;

  return (
    <PublicMarketplaceFrame locale={normalizedLocale}>
      <main className="mx-auto min-h-[60dvh] max-w-5xl px-4 py-8 lg:px-6 lg:py-10">
        <Button
          asChild
          className="min-h-11 rounded-lg lg:min-h-0"
          size="sm"
          variant="secondary"
        >
          <Link href={getLocalizedPath(normalizedLocale, "/")}>
            <ArrowLeft aria-hidden="true" className="size-4" />
            {isBg ? "Към Navara Car" : "Back to Navara Car"}
          </Link>
        </Button>

        <article className="mt-3 rounded-xl border border-border bg-card p-5 sm:p-8">
          <header className="max-w-3xl border-border border-b pb-6">
            <span className="grid size-10 place-items-center rounded-full bg-secondary text-muted-foreground">
              <FileText aria-hidden="true" className="size-5" />
            </span>
            <h1 className="mt-4 text-balance font-semibold text-page-title tracking-tight sm:text-page-title-lg">
              {title}
            </h1>
            <p className="mt-3 text-muted-foreground leading-7">
              {description}
            </p>
          </header>

          <div className="mt-7 max-w-3xl space-y-7">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-semibold text-dialog-title">
                  {section.heading}
                </h2>
                <p className="mt-2 text-foreground/80 leading-7">
                  {section.body}
                </p>
              </section>
            ))}
            <p className="rounded-lg bg-secondary p-4 text-muted-foreground text-sm leading-6">
              {isBg
                ? "За въпрос относно поверителност, условията или конкретна заявка използвайте страницата за контакт."
                : "For a question about privacy, these terms, or a specific request, use the contact page."}{" "}
              <Link
                className="font-semibold text-foreground underline underline-offset-4"
                href={getLocalizedPath(normalizedLocale, "/contact")}
              >
                {isBg ? "Контакти" : "Contact"}
              </Link>
            </p>
          </div>
        </article>
      </main>
    </PublicMarketplaceFrame>
  );
};

export default LegalPage;
