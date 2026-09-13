# Typography contract

The customer template uses the self-hosted Sofia Sans family for body text,
form fields, controls, and data. Sofia Sans SemiCondensed carries headings.
Keep these faces when extending the template; the admin UI owns its separate
Geist setup. Public-page tabs must not reference an unloaded admin font.

Source of truth: `src/lib/styles/daynight.css`. Tailwind heading utilities in
`daynight.tailwind.css` alias the same size, leading, and weight roles.

| Role                   | Size / leading     | Weight    | Use                                                                  |
| ---------------------- | ------------------ | --------- | -------------------------------------------------------------------- |
| Quick filter           | 18px / 24px        | 400       | Homepage and inventory horizontal filter pills                       |
| Compact search trigger | 20px / 27px        | 400       | Inventory header search label in a 44px control                      |
| Search                 | 18px / 24px        | 400       | Search triggers, inputs, VIN/link entry and manual-entry label       |
| Mode tab               | 18px / 24px        | 400 / 600 | Inactive / active Buy, Import, and Sell entry tabs                   |
| Help action            | 16px / 22px        | 400       | How-it-works controls                                                |
| Control                | 16px / 22px        | 400       | Filter options, tabs, editable form values                           |
| Primary action         | 18px / 24px        | 600       | Submit, continue and main CTA labels                                 |
| Body                   | 16px / 24px mobile | 400       | Instructions, descriptions and supporting copy                       |
| Article prose          | 18px / 1.65        | 400       | Long-form reading, maximum measure 68ch                              |
| Card title             | 18px / 24px        | 600       | Compact cards and subsection titles                                  |
| Section title          | 22px / 28px mobile | 600       | Drawers and mobile sections                                          |
| Page title             | 28px / 32px mobile | 600–700   | Page-level hierarchy; display headings retain their responsive scale |
| Field label            | 14px / 20px        | 600       | Form labels and group names                                          |
| Metadata               | 13px / 18px        | 400       | Dates, counts, legal copy and navigation captions                    |
| Compact vehicle data   | 12px / 16px        | 400       | Specs, brand and monthly estimate in the 50/50 inventory card        |

The shipped font files provide 400, 600 and 700 weights. Use the weight tokens
rather than requesting intermediate or extra-bold faces that are not supplied.
The normal control weight and accent state distinguish an option from a heading;
do not make every pill bold to imply that it is clickable.

Preserve the existing 44–48px control heights. Horizontal option rails can scroll;
do not shrink their text to fit more choices. Inventory cards keep their 50/50
image/content split, one-line title, and price/monthly estimate on the same row.
The internal spec grid gives mileage slightly more width. Ellipsis is suitable
for long model names and exceptional spec values, not ordinary price pairs.

Placeholders inherit the input's typography explicitly: the legacy stylesheet
otherwise assigns them a separate size. Never disable browser zoom to compensate
for small fields. CSS pixel sizes here describe the web template, not native iOS
point-size requirements. Mobile body text is not a smaller version of desktop
body text; density comes from spacing and content hierarchy.

Check changed roles at 360–390px and 1440px, including actual input placeholders,
selected pills, long text, overlays and focus. A matching input-element font does
not prove that its visible placeholder matches. Read the pseudo-element styles
and inspect the rendered result.
