# Fyr rendered-interface reference — 19 September 2026

The owner requested a close reproduction of Fyr's actual rendered interface, followed by dealership-specific polish, rather than another loosely inspired design. Preserve the existing Cars Admin business interactions; do not modify dealer websites or the private agency CRM during this visual pass.

## Current application state

Canonical local application: `J:/cars-admin`, branch `main`, HEAD `46a898f83d7295819077416b9bb414c6df5e5764`.

The application was clean at the start of this pass. The only application changes made are `package.json` and `package-lock.json`, adding the exact dependency `@fontsource/poppins@5.3.0`. npm reported zero vulnerabilities in that install. Poppins has NOT yet been imported into the application. No component, stylesheet or deployment was changed by this pass. The existing public demo remains https://cars-admin-blue.vercel.app/.

## Reference captured from the public demo

Reference URL: https://fyr.omtanke.studio/crm/dashboard. The default public demo sign-in was used, not any private user account. The actual rendered DOM and computed CSS were captured with the browser, not inferred from a screenshot.

Valid local reference files, in ignored runtime storage:

- `J:/cars-admin/runtime/fyr-reference/crm-live.json`: complete rendered CRM DOM, computed styles, structural measurements, stylesheet rules and navigation links.
- `J:/cars-admin/runtime/fyr-reference/crm-live.html`: extracted rendered CRM DOM.
- `J:/cars-admin/runtime/fyr-now.png`: populated CRM dashboard at 1440 pixels.
- `J:/cars-admin/runtime/fyr-reference/sales-live.json` and `sales-desktop.png`: populated Sales dashboard measurements and screenshot.
- `J:/cars-admin/runtime/fyr-reference/sales-dark.json`, `sales-dark.html` and `sales-dark.png`: dark-mode Sales reference.

The earlier `crm-dom.html`, `crm-measurements.json` and `crm-desktop.png` capture the sign-in screen after an initial navigation race. Do NOT use those as the dashboard reference. `mobile.png` captured an intermediate open-sidebar state; mobile reference inspection is not complete. No screenshot is owner approval.

## Measured baseline

At 1440px, the reference uses Poppins 13px / 19.5px, weight 400. Light body is #f4f4f5 with #27272a text. The sidebar is 260px wide, white, padded 19.5px vertically, with a subtle right border. The main header is 73.25px high, with 19.5px padding and a translucent white background. Its search field is 286 x 33.25px with a 6.5px radius. The CRM content begins at x=273px; content gaps are 13px. Cards have no outline/shadow and a 9.75px radius. CRM summary cards form two columns of 570.5px each; the activity card spans 1154px and is 418.75px high. The active navigation item uses an outline rather than the current Cars Admin blue-filled state.

Dark reference: body #09090b, cards #18181b, primary text #e4e4e7. The reference has real Dark / Light / System controls. The Sales dashboard uses four vertical statistic cards, unlike the CRM dashboard's compact two-column summaries. Choose the relevant actual reference deliberately; do not mix compositions accidentally.

## Exact stop

The Remote Desktop Commander write_file call for `J:/cars-admin/src/components/appearance-controls.tsx` was blocked twice with: "This tool call was blocked by OpenAI because we couldn't determine the safety status of the request."

The same request was retried once without changing technique. No alternative write route was used. A subsequent read-only status check confirmed that `appearance-controls.tsx` does not exist and only the two dependency files are modified. The dedicated `fyr-match` browser session was closed; the pre-existing Cars Admin development server was not stopped.

No visual rewrite, application commit, build/test verification or production redeployment occurred. Resume only when authorized component writes work: implement the measured shell and component geometry, preserve existing dealership workflows, verify actual desktop/mobile pages and interactions, then commit and deploy. Do not describe the current public application as the completed Fyr replica.

The connected GitHub get_repo call for darkapoparka/cars-admin still returned 404. Separate application-repository publication remains pending as described in CLIENT_ADMIN_HANDOFF.md. This reference record is documentation in Cars, not an application-source push.
