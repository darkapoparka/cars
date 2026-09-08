# Bohemcars mobile sell-flow plan

Status: mobile CTA entry and three-step guided flow implemented.

Earlier exploration: [VIN-first Superdesign draft](https://superdesign.dev/teams/fa7b1854-efe4-46b8-8fad-2e825b8c6cd0/projects/a9a54827-4bb7-4cfd-88c6-f16e352484d4?node=draft-variant-a78a3384-abe3-494c-942c-4505e182cf9e)

## Decision

The mobile page now presents one clear `Започни заявка` CTA card that opens the progressive appraisal flow. The existing desktop page and shared mobile shell remain intact. VIN is the fastest path, while users without it can continue after selecting year and fuel.

## Proposed flow

### Step 1 — Автомобил

- Primary field: `VIN номер`.
- Explain where to find the 17-character VIN.
- Primary action: `Продължи`.
- Neutral alternative: `Нямам VIN номер`.
- The alternative reveals the minimum manual fields: make/model, year, fuel, transmission.
- Preserve a VIN passed in the route query and prefill it.

### Step 2 — Състояние

- Required: mileage.
- Compact choice groups: technical condition, exterior condition, service history.
- Optional expected price.
- No fake photo upload is shown until the project has real attachment storage and delivery.

### Step 3 — Контакт и преглед

- Required: contact name and either phone or email, matching the current inquiry endpoint.
- Preferred contact time remains optional.
- Show a compact read-only summary with edit links for the previous steps.
- One final red action: `Изпрати за оценка`.
- Success state confirms receipt and the real response expectation; it must not claim an instant valuation.

## Interaction model

- Keep the progress cue visible: `Автомобил / Състояние / Контакт`.
- Use one primary action on each step; Back and Skip are neutral gray actions.
- Keep entered values when moving backward or opening/closing the page.
- Validate locally at the step boundary and focus the first invalid field.
- Support loading, API error, retry, and success states explicitly.
- Do not open the main flow in a drawer. A full-height page is more stable with the keyboard and photo picker.

## Implementation approach

1. Reuse the existing field/state model from `SellCarWizard.svelte`.
2. Open the progressive state machine from the single mobile CTA in `SellYourCarMobilePage.svelte`.
3. Preserve the current desktop `SellCarForm` and desktop wizard behavior.
4. Submit the wizard fields to the existing `/api/inquiries` endpoint instead of storing a completed request only in local storage.
5. Keep the shared `MobileAppbar` and `MobileBottomNav`; do not duplicate their markup inside the sell page.
6. Preserve black/white/gray/red tokens, Geist Variable, 12-16px radii, 44px touch targets, and the exact Eliq wordmark.

## Acceptance checks

- 390x844 and 320x800 complete without horizontal overflow or obscured controls.
- The on-screen keyboard does not hide the active input or primary action.
- VIN and no-VIN paths both reach a valid submission.
- Back navigation preserves values.
- Double submission is prevented while the request is pending.
- API validation messages are translated into clear Bulgarian field errors.
- Bottom navigation remains `Начало / Коли / Продай / Внос / Меню` and `Любими` remains inside Menu.
- No beige/pink/blue surfaces, synthetic logo, gradients, or decorative separators.
