import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import type { desktopFullFilterGroups } from "../lib/desktop-full-filter-policy";
import {
  DesktopFullFilterContent,
  type DesktopFullFilterDraftProps,
  DesktopFullFilterSectionFields,
} from "./desktop-full-filter-content";
import styles from "./desktop-full-filter-dialog.module.css";

export function DesktopFullFilterGroupContent({
  group,
  resetVersion,
  vehicleInitialStep,
  ...fields
}: DesktopFullFilterDraftProps & {
  group: (typeof desktopFullFilterGroups)[number];
  resetVersion: number;
  vehicleInitialStep: "auto" | "make" | "model";
}) {
  if (group.id === "vehicle") {
    return (
      <>
        <div className={styles.vehicleContent}>
          <DesktopFullFilterContent
            {...fields}
            resetVersion={resetVersion}
            section="vehicle"
            taxonomy={fields.taxonomy}
            vehicleInitialStep={vehicleInitialStep}
          />
        </div>
        <div className={styles.vehicleKeyword}>
          <DesktopFullFilterSectionFields
            {...fields}
            section="search"
            showHeading={false}
          />
        </div>
      </>
    );
  }
  return (
    <ScrollArea className="min-h-0 flex-1" key={`${group.id}:${resetVersion}`}>
      <div className={styles.groupGrid}>
        {group.sections.map((id) => (
          <DesktopFullFilterSectionFields {...fields} key={id} section={id} />
        ))}
      </div>
    </ScrollArea>
  );
}
