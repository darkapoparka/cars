# Scope

This is the standalone Karento Day & Night candidate requested on 7 October 2026. Work only inside this folder unless the owner explicitly asks for another scope. Existing sibling dealer apps and parent `dealer.json` belong to concurrent work and must not be refreshed by this candidate task.

Owner correction, 1 November 2026: use the maintained Signature master at 6466 as the visual baseline with Day & Night branding. The existing checkout now contains that native Svelte source, personalized through `src/lib/content.ts` and native data modules by the existing Cars Signature adapter. `src/lib/server/dealer-profile.json` remains the retained factual input. Preserve the selected master's composition, typography, neutral palette and interactions. The old captured personalizer and `reference/karento` are historical source evidence, not active page rendering; their provenance remains in `SOURCE.json`. Read the current README and `.runtime/evidence/signature-correction/source-manifest.json`. Shared template improvements still belong in the canonical master after a separate request.

Use Node 26.10.0. Check/build, HTTP QA and browser evidence are separate. Test 320px, 390px and desktop primary routes. Keep dated listing disclosure and truthful draft/demo behavior. Never imply a demo enquiry, booking, payment or account change succeeded.

The local `node_modules` junction reuses master dependencies; it is not publishable source and must not be removed recursively or used for `npm ci`. Do not stop or rebuild the master previews on 6462/6466.

Read README.md and ../../../docs/karento/DAYNIGHT-PERSONALIZATION.md before continuing. This candidate is not an approved fleet template or a provider migration.
