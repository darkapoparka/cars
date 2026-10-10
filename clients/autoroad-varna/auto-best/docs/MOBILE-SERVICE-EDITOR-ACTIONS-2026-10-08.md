# Mobile service editor actions

8 October 2026. Local reusable Auto Best master on Cars `main`; no template promotion or dealer publication.

Sell, Import by listing and Import by criteria share `ServiceEntryField.svelte`.
The editor attached `dialogViewport`, but its CSS retained `100dvh` instead of
consuming the visible viewport measurements. Its expanding field area also put
Cancel/Save at the screen bottom, far below a short form.

Below 768px the editor now consumes the shared visible viewport and safe-area
variables. The header remains outside the scrollable form. Fields and actions
share that form's scroll container; the actions follow the final field. Desktop
rules, form validation, draft application and focus restoration are unchanged.

Matched 390x844 Import-listing captures show the footer moving from y=775px to
y=181px, 20px after the input:
[before](../artifacts/service-entry-overlays/before-bg-390-listing.png) and
[after](../artifacts/service-entry-overlays/after-bg-390-listing.png).

## Verification

Using Node 22.20.0 and the owned development server at `http://127.0.0.1:6461`:

- Svelte/TypeScript: 0 errors, 0 warnings; production build passed.
- CSS policy: passed; existing scroll/viewport unit checks: 26 passed.
- Keyboard viewport regression: 18 cases passed in Chromium and 18 in WebKit.
  BG/EN at 320, 390 and 430px cover all three entry modes. The fixture shrinks
  the visual viewport to 360px and pans it by 32px while retaining the 844px
  layout viewport. It checks dialog geometry, the gap after the final field,
  scrolling to both actions with an input focused, cancellation and focus return.
- Service dialog journeys: 20 Chromium cases passed for Sell/Import in BG/EN
  at 320, 390, 430, 768 and 1440px.
- Browser inspection covered all three editors at 390px; scoped diff checks passed.

The focused keyboard run uses `SERVICE_ENTRY_CASE=keyboard`; set
`SERVICE_ENTRY_ENGINE=webkit` for the second engine. Both use
`scripts/service-entry-overlay-smoke.mjs` and the existing `BASE_URL` setting.
Reports are retained under ignored `artifacts/service-entry-overlays*-keyboard/`.

The broader service suite passed its 320/390px cases but hit its unrelated
430px page-background assertion in both locales: the service canvas ended at
612.1875px while the document was 844px tall. This task does not change the
closed page's background layout. That broader suite is not a complete pass.

Physical Android/iPhone keyboards and safe-area behavior remain unverified.
Browser viewport simulation, a successful local build and hosted acceptance
are separate checks.
