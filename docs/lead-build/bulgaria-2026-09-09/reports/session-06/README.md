# Bulgaria session 06 — committed application handoff

**12 of 15 requested application sources are now committed. Four dealer trios are implemented-unverified; GoldenDreams remains research-only.** This supersedes the earlier zero-app and G-Auto-only status reports.

Repository: darkapoparka/cars. Branch: codex/astra-bg-06. Source base: faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca. The masters and unrelated client/shared files are unchanged. No main/astra push, deployment or outreach.

## Five outcomes

| Dealer | Actual application sources | State | Source checkpoint |
|---|---:|---|---|
| GoldenDreams AUTO | 0/3 | Current showroom/contact/current usable stock unresolved; no fake source identity substituted | Historical research retained |
| G Auto — Blagoevgrad | 3/3 | implemented-unverified | 5311c5e37a4fe324b57a01c22645cf023a709ffe; corrected 689d2a7380f97120dbb46a58b0edeb2da8c6f1b3 |
| Крис Кар — Plovdiv | 3/3 | implemented-unverified | 3bfcb40707c20e5dcf3cad42aca94a9202e3886a; corrected 663814e20e813ec15cb20540c7f25d302a7fae74 |
| Slavi Cars — Dupnitsa | 3/3 | implemented-unverified; existing branch work inspected and preserved | e28281f22f9d4040be68fc1b03bcccc2a58080a6 |
| FRESH MOTORS — Sheremetya | 3/3 | implemented-unverified; existing branch work inspected and preserved | 0860cb523458e5c6873b893982bb46baf0edf403 |

Each implemented dealer has auto-best/, the complete modern/ workspace and carwow/, plus its HANDOFF.md, REVIEW.md, source records and per-variant metadata. No app is owner-approved or runtime-verified. No generated application wrapper or deferred personalization script substitutes for the actual source.

## Remote file verification

At 663814e20e813ec15cb20540c7f25d302a7fae74, all twelve non-truncated app subtrees and project metadata were read from GitHub. File counts Auto Best/Modern/Carwow: G Auto 274/1264/1367; Крис Кар 274/1267/1369; Slavi Cars 274/1264/1367; FRESH MOTORS 274/1264/1367. Total 11625 tracked application files.

Kris original branding and 32 dealer-vehicle photographs are committed in every app. All 114 expected brand/gallery path-to-blob mappings were checked against the 38 uploaded unique asset hashes. Its committed contact sheet was actually opened: the Cyrillic original, cropped К icon and eight first-vehicle photographs were inspected. That is asset evidence, not a rendered-app screenshot.

Recursive tree comparison against the recorded main base found changes only in the five allowed dealer folders and this session-06 report directory. Equal shared-root and unrelated-client hashes were checked; GitHub compare pagination was not mistaken for an exhaustive file diff. See final-branch-verification.json.

## Checks and limits

G Auto, Slavi Cars and FRESH MOTORS each retain their own check evidence and handoff. Slavi/Fresh appeared as existing concurrent branch implementations; they were not recloned or overwritten while Kris was completed. Their committed checks were read, not silently reclassified as a new browser test.

Kris: in-memory Svelte compilation 53 Auto Best and 321 Carwow files, zero errors; TypeScript syntax 22/869/189 files, zero diagnostics. Eleven unused-CSS warnings are preserved. Targeted strict semantic checking of seven data/config/filter roots returned zero diagnostics. Forty-six executed data assertions and the retained Zod directory schema passed. Details are in clients/kris-car-plovdiv/checks/source-verification.json.

No dealer in this batch has a retained-lockfile install, Prisma generation, full application framework check/build, server startup, browser navigation/form acceptance or 320/390/1440 px master/client visual comparison from this execution. All corresponding flags remain false. Phone/map/source destinations and gallery bytes were checked in source; actual menu/focus/overflow/console behavior must still be reviewed in the complete apps.

Kris keeps the primary master composition and canonical /about/kris-car-plovdiv, with a redirect for its former source profile route. Its unoffered historical presentation prototypes retain English labels and unverified controls; no extra homepage acceptance is claimed. All samples are dated seller advertisements, not independently verified current inventory. Finance, warranty and battery claims are qualified. Original/publicly sourced media provenance is recorded without inventing dealership approval or a new media licence.

## Coordinator: inspect G Auto first

```powershell
git -C J:/cars fetch origin refs/heads/codex/astra-bg-06:refs/remotes/origin/codex/astra-bg-06
git -C J:/cars show origin/codex/astra-bg-06:clients/g-auto/HANDOFF.md
```

Preserve local dirty work and integrate only the owned client/report paths before using the existing launcher. Do not switch or reset the shared checkout automatically. Then, from J:/cars:

```powershell
./scripts/start-client.ps1 -Client g-auto -Prepare
./scripts/start-client.ps1 -Client g-auto
```

Proposed entries, not running listeners: Auto Best http://127.0.0.1:6631/ ; Modern http://127.0.0.1:6632/cars ; Carwow http://127.0.0.1:6633/ . The launcher/coordinator must verify port ownership. Review each dealer sequentially using its HANDOFF.md and REVIEW.md. Full modern/ is required. Shared-origin mounting and the design FAB belong to the coordinator publishing step, not this branch-only delivery.

No Windows client code, checkout, worktree, preview server or detached build job was created by this in-memory worker. Its temporary command session is closed after final remote verification; no unattended continuation is promised.
