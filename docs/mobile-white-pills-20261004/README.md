# Mobile white quick-filter pills — 4 October 2026

The owner requested white components with fewer visible borders. Inactive Cars
and Services pills now use `colors.background`, a transparent border and a
small `0 1px 4px rgba(27, 27, 33, 0.12)` shadow. Applied filters retain the
near-black text token, white text and no shadow. The shared component keeps its
40px faces, 48px targets, spacing, scrolling and accessible button semantics.
Vehicle cards retain the existing single-column photo layout on phones.

## Matched visual evidence

Captures use the same route, Bulgarian locale, viewport and scroll position.
Mobile comparisons are 390×844; desktop is 1440×900.

| View | Before | After |
| --- | --- | --- |
| Cars | [Before](cars-before.jpg) | [After](cars-after.jpg) |
| Cars with BMW selected | [Before](active-before.jpg) | [After](active-after.jpg) |
| Services | [Before](services-before.jpg) | [After](services-after.jpg) |
| Desktop Cars | [Before](desktop-before.jpg) | [After](desktop-after.jpg) |

[320px Cars](cars-320-after.jpg) confirms the narrow layout.
[Computed surfaces](pill-surfaces.json) record the white inactive fill,
transparent outline, unchanged dimensions and black selected state.
The page has no horizontal overflow at 320 or 1440 pixels.

## Validation

Node 22.20.0: ESLint, TypeScript, all 91 domain/localization tests, formatting of
the changed component and browser suite, and a production build passed. The
build used `.next-white-pills-20261004`, separate from the serving output.

[Browser checks](browser-checks.json) record Chromium and WebKit results across
Bulgarian/English and 320/390/1440px, including sticky controls, filter dismissal
and focus return, card facts, navigation, PDP actions and local draft behavior.

An initial Chromium run saw a second storage write in the Contact retry test;
the immediate rerun passed. The test previously clicked Cars and Contact without
waiting for the Cars screen to appear. It now waits for the inventory and Contact
URL before instrumenting storage. The single-write assertion remains intact.
Both engines were run again after this change.

Before captures used the production filter-modal preview. The new build started
from Mobile source at Cars commit `c6af98ae254d0c7211739992a52a27efcd1f2d5d`
with the pill edits. Subsequent unrelated commits and filter-editor drafts were
preserved. Only this task's component, QA navigation waits, template notes and
evidence belong to the scoped commit. Newer generated preview configuration was
preserved; this build's temporary TypeScript include paths were removed.

This records local source polish, not template release selection or dealer deployment.
