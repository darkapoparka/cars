"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import type {
  MarketplaceSearchParams,
  VehicleTaxonomyMakeOption,
} from "@repo/marketplace";
import { X } from "lucide-react";
import { type ReactNode, useId } from "react";
import {
  clearDesktopFullFilterSection,
  type DesktopFullFilterSection,
  getDesktopFullFilterLabel,
  getDesktopFullFilterSummary,
} from "../lib/desktop-full-filter-policy";
import { getMarketplaceControlCopy } from "../lib/marketplace-control-copy";
import type { MarketplaceModelInventoryCount } from "../lib/model-picker-options";
import styles from "./desktop-full-filter-dialog.module.css";
import { DesktopMakeModelFields } from "./desktop-make-model-fields";
import { MarketplaceCategoryOptions } from "./marketplace-category-options";
import { MarketplaceFilterSubview } from "./marketplace-filter-options";

export interface DesktopFullFilterDraftProps {
  draft: MarketplaceSearchParams;
  locale?: string;
  modelCounts?: MarketplaceModelInventoryCount[];
  onChange: (draft: MarketplaceSearchParams) => void;
  taxonomy: VehicleTaxonomyMakeOption[];
}

export function DesktopFullFilterContent({
  draft,
  locale,
  modelCounts,
  onChange,
  resetVersion,
  section,
  taxonomy,
  vehicleInitialStep,
}: DesktopFullFilterDraftProps & {
  resetVersion: number;
  section: DesktopFullFilterSection;
  vehicleInitialStep: "auto" | "make" | "model";
}) {
  const keywordId = useId();
  const copy = getMarketplaceControlCopy(locale);
  if (section === "vehicle") {
    return (
      <DesktopMakeModelFields
        draft={draft}
        initialStep={vehicleInitialStep}
        key={resetVersion}
        locale={locale}
        modelCounts={modelCounts}
        onChange={onChange}
        taxonomy={taxonomy}
      />
    );
  }
  let options: ReactNode;
  if (section === "search") {
    options = (
      <label className={styles.keyword} htmlFor={keywordId}>
        {copy.search.ariaLabel}
        <Input
          id={keywordId}
          onChange={(event) =>
            onChange({ ...draft, q: event.target.value || undefined })
          }
          placeholder={copy.search.makeModelPlaceholder}
          type="search"
          value={draft.q ?? ""}
        />
      </label>
    );
  } else if (section === "category") {
    options = (
      <MarketplaceCategoryOptions
        locale={locale}
        onSelect={(category) =>
          onChange({ ...draft, body: undefined, category })
        }
        selectedCategory={draft.category}
      />
    );
  } else {
    options = (
      <MarketplaceFilterSubview
        draft={draft}
        locale={locale}
        setDraft={onChange}
        view={section}
      />
    );
  }
  const label = getDesktopFullFilterLabel(section, locale);
  const hasSelection =
    section !== "category" &&
    Boolean(getDesktopFullFilterSummary(section, draft, locale));
  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className={styles.options}>
        <div className={styles.optionsHeading}>
          <h2 className="text-card-title-lg">{label}</h2>
          {hasSelection ? (
            <Button
              aria-label={`${copy.actions.clear} ${label}`}
              onClick={() =>
                onChange(clearDesktopFullFilterSection(section, draft))
              }
              variant="secondary"
            >
              <X aria-hidden="true" size={14} />
              {copy.actions.clear}
            </Button>
          ) : null}
        </div>
        {options}
      </div>
    </ScrollArea>
  );
}
