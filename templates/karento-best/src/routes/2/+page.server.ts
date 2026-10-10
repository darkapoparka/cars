import type { PageServerLoad } from "./$types";

/** Start real phone requests on the mobile feed; the media query owns resizing. */
export const load: PageServerLoad = ({ request }) => ({
  phoneHint:
    request.headers.get("sec-ch-ua-mobile") === "?1" ||
    /Android.*Mobile|iPhone|iPod|Windows Phone/i.test(
      request.headers.get("user-agent") ?? "",
    ),
});
