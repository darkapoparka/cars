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

const getPrivacyFallback = (isBg: boolean): FallbackLegalPage => isBg ? {"title":"Поверителност в демонстрацията","description":"Информация за преглед на неофициалния демонстрационен проект. Това не е приета политика на Slavi Cars.","sections":[{"heading":"Само тестови данни","body":"Не въвеждайте лични или чувствителни данни. Формите са за преглед на интерфейса, а не потвърден канал за връзка с търговеца."},{"heading":"Без потвърдено изпращане","body":"Доставката на съобщения е изключена в този проект. Подготвена чернова или видим екран не означава изпратено запитване."},{"heading":"Настройки в браузъра","body":"Функции като филтри, любими и предпочитания могат да пазят локално състояние. За чист тест използвайте нов браузърен профил или изчистете данните за този адрес."},{"heading":"Външни връзки","body":"Телефонът, картата и оригиналните обяви водят към отделни приложения или сайтове. Техните собствени условия се прилагат след отварянето им."}]} : {"title":"Privacy in this preview","description":"Information for reviewing an unofficial demonstration. This is not an adopted Slavi Cars privacy policy.","sections":[{"heading":"Test information only","body":"Do not enter personal or sensitive information. Forms demonstrate the interface; they are not a confirmed dealer communication channel."},{"heading":"No message delivery","body":"Message delivery is disabled in this project. A prepared draft or an on-screen state does not establish delivery to the dealer."},{"heading":"Browser preferences","body":"Filters, favourites and display preferences may retain local state. Use a fresh browser profile or clear site data for a clean review."},{"heading":"External links","body":"Phone, map and original-listing links open separate applications or websites. Their own terms apply after opening them."}]};

const getTermsFallback = (isBg: boolean): FallbackLegalPage => isBg ? {"title":"Условия за преглед на демото","description":"Неофициална демонстрация на три дизайна за Slavi Cars. Не е договор, оферта или потвърждение от търговеца.","sections":[{"heading":"Предназначение","body":"Проектът представя оформление и работа с подбрани публични обяви. Не е официално одобрен сайт на Slavi Cars."},{"heading":"Датирани обяви","body":"Демо селекция от обяви на Slavi Cars към 09.09.2026 г. Наличността и условията се потвърждават с продавача. Не е жив каталог."},{"heading":"Цена и оборудване","body":"Цените са обявени суми в евро, отделни от първоначални и месечни вноски. Данните са от продавача; не е извършена независима техническа проверка."},{"heading":"Финансиране и други въпроси","body":"Калкулаторите са илюстративни. Лизинг, замяна, документи и евентуален внос се уточняват пряко с продавача; демонстрацията не одобрява кредит и не приема поръчки."},{"heading":"Преди реален контакт","body":"Потвърдете автомобила, актуалната цена, точната локация и часа за оглед на публикувания телефон. Не изпращайте лични данни през демонстрационните форми."}]} : {"title":"Preview terms","description":"Unofficial design demonstration for Slavi Cars. This is not a contract, offer or dealer confirmation.","sections":[{"heading":"Purpose","body":"The project demonstrates layouts and a selected set of public advertisements. It is not an officially approved Slavi Cars website."},{"heading":"Dated advertisements","body":"Listing sample observed on 9 September 2026, not a live stock feed. Availability, mileage and conditions must be confirmed with the seller."},{"heading":"Prices and equipment","body":"Prices are advertised euro amounts, not deposits or monthly instalments. Specifications are seller-published and have not been independently inspected."},{"heading":"Finance and other questions","body":"Calculators are illustrative. Leasing, exchanges, paperwork and any import service require discussion with the seller. This preview does not approve finance or accept orders."},{"heading":"Before making contact","body":"Confirm the vehicle, current price, exact location and viewing time through the published phone number. Do not submit personal data through demonstration forms."}]};

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
            {isBg ? "Към Slavi Cars" : "Back to Slavi Cars"}
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
