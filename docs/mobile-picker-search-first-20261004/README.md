# Mobile picker: search first

The phone Make & model editor now starts with search, followed by All and the
existing brand or model options. The repeated Makes heading and the
Back / BMW / Models navigation row are removed. The selected brand remains
visible in the existing BMW / All models row.

Unchecking that row removes BMW and returns to brands. Keyboard focus moves to
the corresponding brand button; opening a brand focuses its All models checkbox
without opening the phone keyboard. Search, family expansion, partial model
selection, draft application and clearing retain their existing semantics.

The duplicate selector state, heading ref and unused navigation styles are gone.
No dependency or replacement selection logic was added. Desktop continues to use
its separate two-column editor.

Matched Bulgarian captures use 390 x 844, an empty draft or BMW with All models
selected, collapsed model families and the same scroll position.

| State | Before | After |
| --- | --- | --- |
| Brands | [Before](before-makes-390.jpg) | [After](after-makes-390.jpg) |
| BMW models | [Before](before-models-390.jpg) | [After](after-models-390.jpg) |

Validation is recorded in [browser-verification.json](browser-verification.json).
This is Mobile candidate source and local preview polish; release selection and
dealer deployment are separate.
