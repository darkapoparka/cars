# Restore official Fluent dock icons

The owner rejected the generated bottom-navbar trial. `BottomNavIcon.svelte` now delegates to the existing Microsoft Fluent System Icons Regular renderer with its pinned native 24px SVG sources. All five destinations share that renderer with the mobile header and menu. Inter v4.1 remains the font.

The generated PNG and prompt records remain archived for provenance. Its manifest records rejection; the asset guard retains the file without a runtime reference. Existing labels, selection surfaces, targets and routing are preserved.

## Actual page comparison

| Generated trial before | Official Fluent after |
| --- | --- |
| ![Generated dock, BG at 390px](before-generated-390.jpg) | ![Fluent dock, BG at 390px](after-fluent-390.jpg) |

[320px screenshot](after-fluent-320.jpg) and [browser measurements](browser-checks.json) record the restored page. The screenshots were captured from the existing dev server at `http://127.0.0.1:6461/bg`.

## Verification

`npm run validate` passed using Node 22.20.0, including source policies, font/icon provenance, the current 191-file asset inventory, locale checks, Svelte diagnostics (zero errors/warnings) and the production build.

Focused live browser checks passed for Bulgarian and English Home at 320/390px, Bulgarian Cars/Sell/Import selection at 320px, and the desktop breakpoint at 1440px. The mobile dock has five official SVGs, aligned icon/caption baselines, labels that fit and targets at least 44px. No checked viewport overflows. Escape closes the Bulgarian menu and returns focus to its dock opener. The dock is hidden at 1440px.

These are local checks against the working source, including pre-existing unrelated drafts. They do not establish owner visual acceptance, an immutable template release or dealer deployment. The scoped source change retains those drafts outside its commit.
