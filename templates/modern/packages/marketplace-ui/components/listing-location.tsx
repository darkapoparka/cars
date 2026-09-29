import { leadSite } from "@repo/marketplace";
import { getLeadCopy } from "@repo/marketplace/lead-copy";
import { ArrowUpRight, MapPin } from "lucide-react";

interface ListingLocationProps {
  readonly locale?: string;
}

export const ListingLocation = ({ locale }: ListingLocationProps) => {
  const isBg = locale?.toLowerCase().startsWith("bg") ?? false;
  const mapEmbedUrl = leadSite.mapsEmbedUrl;
  const copy = getLeadCopy(locale);

  return (
    <section
      aria-labelledby="listing-location-heading"
      className="overflow-hidden rounded-xl border border-border bg-secondary"
      data-slot="listing-location"
      id="listing-location"
    >
      <div className="space-y-3 bg-card p-4">
        <h2
          className="flex items-center gap-2 font-semibold text-card-title"
          id="listing-location-heading"
        >
          <MapPin aria-hidden="true" className="size-5 shrink-0" />
          {isBg ? "Посетете шоурума" : "Visit the showroom"}
        </h2>
        <p className="text-meta text-muted-foreground">
          {copy.address}, {copy.city}
        </p>
        <a
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-secondary px-3 font-medium text-meta focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
          href={leadSite.mapsUrl}
          rel="noreferrer"
          target="_blank"
        >
          {isBg ? "Упътвания" : "Get directions"}
          <ArrowUpRight aria-hidden="true" className="size-4" />
          <span className="sr-only">
            {isBg ? " — отваря се в нов раздел" : " — opens in a new tab"}
          </span>
        </a>
      </div>
      <details className="group border-border border-t">
        <summary className="cursor-pointer px-4 py-3 font-medium text-meta focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-[-2px]">
          {isBg ? "Карта на шоурума" : "Showroom map"}
        </summary>
        <iframe
          allowFullScreen
          className="block h-80 w-full border-0"
          height={320}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          src={mapEmbedUrl}
          title={isBg ? "Карта на шоурума" : "Showroom map"}
          width="100%"
        />
      </details>
    </section>
  );
};
