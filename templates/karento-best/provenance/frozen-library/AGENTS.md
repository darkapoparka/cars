# Karento reference preservation

Use this canonical folder for Karento work. Preserve the captured HTML composition, CSS and artwork until an explicit design change is requested. Inspect `provenance/capture.json` and `README.md` before editing. Do not recapture over local changes without checking their diff.

Use latest pinned package versions from `package-lock.json`. SvelteKit 3 config lives in `vite.config.ts`; `tsconfig.json` extends `$app/tsconfig`. Vendor JavaScript owns plugin behavior and navigation currently reloads documents deliberately.

Run `npm run check`, `npm run build`, HTTP QA and affected browser journeys after changes. Include 320, 390 and 1440 px. Keep references/QA under Cars `docs/karento` or ignored `runtime`. Do not silently promote this family into the approved five-design publisher or modify existing dealers.
