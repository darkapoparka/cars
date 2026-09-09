import { createElement } from "react";
import { hugeiconsNavigation } from "../lib/icons/hugeicons-navigation";

export function DealerBottomNavIcon({
  name,
  active = false,
}: {
  readonly name: keyof typeof hugeiconsNavigation;
  readonly active?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      className="size-6"
      data-icon-family="hugeicons-stroke-rounded"
      data-nav-icon={name}
      fill="none"
      focusable="false"
      height={24}
      viewBox="0 0 24 24"
      width={24}
    >
      {hugeiconsNavigation[name].map(([tag, attributes]) =>
        createElement(tag, { ...attributes, strokeWidth: active ? 1.9 : 1.5 })
      )}
    </svg>
  );
}
