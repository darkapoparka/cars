import { goto } from "$app/navigation";
import type { PreviewState } from "#lib/preview.svelte.ts";
import type { LocaleContext } from "#lib/i18n/context.svelte.ts";
export function demoSignIn(
  event: SubmitEvent,
  preview: PreviewState,
  href: LocaleContext["href"],
) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!(form instanceof HTMLFormElement)) return;
  const role = new FormData(form).get("area") === "member" ? "member" : "owner";
  preview.setRole(role);
  void goto(href(preview.accountHref));
}
