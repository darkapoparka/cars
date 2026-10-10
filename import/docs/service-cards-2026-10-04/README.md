# Service card spacing and actions — 4 October 2026

All six desktop service cards now use concise single-line BG/EN summaries. Removing the previous two-line minimum closes the empty gap above their actions. The existing native card link contains a compact black pill with white 16px text, a 36px height and the shared pill radius. Mobile copy and styling remain independent.

[Before](before.jpg) · [After](after.jpg) · [Verification](verification.json)

Verified the source-rendered Services page in BG/EN at 768/1024/1440/1920px: all 48 summaries fit completely, all actions use the compact black treatment, and no page errors or horizontal overflow occur. Matched full-page Services captures at 320/390px in both languages have identical pixels and complete visible presentation. Three existing service-search/filter/native-destination tests passed, as did scoped Prettier, architecture checks and a production build in the existing isolated QA directory.

The shared Git lock was preserved until it cleared independently; source integration uses a scoped Import commit on main. This task does not promote a release or deploy a dealer. The expanded task path manifest and recovery patch remain in `runtime/desktop-continuation/`. Verification JSON records the earlier capture-time Git state.
