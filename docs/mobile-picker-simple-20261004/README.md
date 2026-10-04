# Mobile picker: plain All rows and clear navigation

All brands now uses the plain white row treatment of All models: matching 16px
type, a 52px tap target and a 20px selection circle in the same right-hand column.
Its empty circle remains visible when a brand is selected; the full row still
clears brand/model criteria. All models keeps its BMW label and existing checkbox
behavior. Both preset rows now use the white canvas rather than a filled card.
Search retains its grey input surface, and its placeholder no longer repeats BMW.
The existing embedded list reserves the scrollbar gutter to prevent the selection
column shifting between brands and models. No new state or dependency was added.

The latest committed source already replaced the two Make/Model selector pills
with a heading and an explicit Back to Makes action. The old 6474 preview had not
included that change; this preview incorporates it and verifies its navigation.
The standalone picker and desktop two-column layout retain their composition.

Matched Bulgarian captures use the same empty filter draft, BMW selection and
scroll position. Mobile frames are 390 x 844; desktop frames are 1440 x 900.

| State | Before | After |
| --- | --- | --- |
| Brands | [Before](before-makes-390.jpg) | [After](after-makes-390.jpg) |
| BMW models | [Before](before-models-390.jpg) | [After](after-models-390.jpg) |
| Desktop | [Before](before-desktop-1440.jpg) | [After](after-desktop-1440.jpg) |

Validation and the verified build are recorded in
[browser-verification.json](browser-verification.json). This is Mobile candidate
source and local preview polish; the approved release lock and dealer deployments
are unchanged.
