> CLOSED HISTORICAL CAMPAIGN. These assignments and branch-specific instructions are not active. Use Cars AGENTS.md and docs/WORKFLOW.md for current work. Preserved below as original evidence.

# Bulgaria: ten GPT Pro session prompts

Prepared 9 September 2026. **50 assigned dealer accounts, five per session, three requested designs per dealer.** These files are copy-paste instructions, not evidence that any session was launched or any of the 150 requested applications was built.

Open a session file and paste its entire contents into one separate GPT Pro conversation with repository access. Each prompt is self-contained; there is no shared preamble to remember. [Open the copy panel](copy-prompts.html) for a dropdown and one-click copy.

Start with **01** for Varna and **06** for Golden Dreams/G Auto. Review the first finished dealer before scaling up the rest. Five dealers per session is a sequential queue: complete one dealer's three apps and checkpoint before the next. Do not start these alongside old workers assigned to the same accounts.

## Assignment map

| Prompt | Five assigned accounts | Dedicated branch |
| --- | --- | --- |
| [01](session-01.md) | Теси Кар; ЦЕНТРАЛ – АВТОСАЛОН; Аутофест; ЕКСПРЕС АУТО; Перфект Ауто | `codex/astra-bg-01` |
| [02](session-02.md) | КАПИТОЛ; Черно море; АВТОБОРСА МАНИЯ; ПРЕСТИЖ; ЕКСТРА КАР-СМ | `codex/astra-bg-02` |
| [03](session-03.md) | СЪНИ; R.Q.S. Auto – Team; ЕВРОКАР ВАРНА 09; Спринт ауто; Европа | `codex/astra-bg-03` |
| [04](session-04.md) | Exclusive Auto; NEXT CAR; MARTIN AUTO; FIVE AUTO; Swiss Auto43 | `codex/astra-bg-04` |
| [05](session-05.md) | Автосалон Тодоров; MG7 Group; Success Automobile; VOIVODOV AUTO & ANTONIO; icars | `codex/astra-bg-05` |
| [06](session-06.md) | GoldenDreams AUTO; G Auto; Крис Кар; Slavi Cars; FRESH MOTORS | `codex/astra-bg-06` |
| [07](session-07.md) | VALENTINO AUTO HOUSE; TROYA AUTO; ФАДИ КАРС; В.В.Ц – АУТО; МАВЕРИК | `codex/astra-bg-07` |
| [08](session-08.md) | DANGER AUTO; AUTOHOF; Любо кар; Optimum Automotive; NEW MOTORS | `codex/astra-bg-08` |
| [09](session-09.md) | CAR MAX; NOVA CARS; СТЕНЛИ КАР; ЛУКС АВТО; NEXT AUTO | `codex/astra-bg-09` |
| [10](session-10.md) | Plus Auto; Фреш Ауто; F1 - AUTO; КЪНЧЕВ; ХАСКОВО КАРС БГ | `codex/astra-bg-10` |

## Branch policy

Each session publishes only to its own `codex/astra-bg-XX` branch, based on the current published main. Do not use a shared `astra` branch for ten writers. These prompts explicitly supersede old worktree/shared-branch batch instructions for these assigned accounts.

The local coordinator remains in `J:/cars` on `main`. Remote sessions need either GitHub branch writes or an independent cloud runner. Ten branches in the same physical Windows checkout are not isolated. No new local clones, worktrees or cars-session folders are authorized. Branches have not been created or sessions dispatched by preparing this packet.

The coordinator will fetch and review one returned branch at a time, check its diff against the five-folder allowlist, preserve dirty owner work, install/build the real applications, inspect each dealer's three variants together, then merge verified changes into main. Public-origin mounting, design FAB, dedicated dealer repositories and deployments follow that finalization; these prompts explicitly request branch-only handoff. No outreach.

Observed published main: `faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca`. Current local Auto Best polish includes uncommitted work that web sessions cannot obtain from that commit. Each prompt requires reporting the source version/tree actually copied; this packet does not publish or claim those local changes are on GitHub.

## Evidence and qualification limits

The source bank in `docs/lead-research/bulgaria/` already contains a much larger discovery pass; its dated shortlist is the starting point. This packet selects 49 marketplace-linked accounts plus the owner-nominated GoldenDreams AUTO. Source identity was rechecked on 9 September through retrieved marketplace pages; the Car Max marketplace fetch failed, while its matching official website was available. The historical screening counts in the manifest remain dated 8 September, not silently refreshed. Counts are ads, not verified available whole cars.

These are assigned research-and-build candidates, **not 50 fully qualified sales leads or 50 businesses proven to lack websites**. Domain, identity, current vehicle/media and template-fit checks are part of each session. Existing-site candidates receive comparison concepts, without invented criticism. If a dealer cannot be established, the session records a precise blocked outcome and continues its remaining named accounts; no padding with invented businesses or automatic substitutions. No CRM or contact-history state was updated.

Selected current references: [Tesi Car](https://tesicar.mobile.bg/), [G Auto](https://g-auto.mobile.bg/), [FIVE AUTO](https://fiveauto.mobile.bg/), [Perfekt Auto contact page](https://perfektauto.com/kontakti/), [Car Max](https://carmax.bg/). A matching independent Perfekt Auto domain was confirmed by public phone on 9 September; this corrects the earlier shortlist's unresolved domain match.

## Golden Dreams and older projects

The existing project is `M:/codex/agency/projects/leads/automotive/golden-dreams-auto/autodeal`, recorded as Golden Dreams AutoGroup. Its mirror manifest names [Facebook profile 61592803643776](https://www.facebook.com/profile.php?id=61592803643776); the logged-out browser now resolves it to [GoldenDreams AUTO](https://www.facebook.com/people/GoldenDreams-AUTO/61592803643776/). The page title/identity resolved, but current posts, stock, city and contacts were not verified through the cookie/login surface. Do not infer posting frequency.

Existing generated-looking logo assets are retained under that old project's `mirror/public/assets/images/lead/`: `golden-dreams-logo-on-dark-v2.png` and `golden-dreams-logo-on-light-v2.png`. Inspect their provenance and rendering before reuse. The old contact page still contains `tel:8085550111`; this is source sample content and is explicitly forbidden as the new dealer contact. The older application is not an authoritative fact sheet.

G Auto's older `g-auto/autodeal` manifest matches [g-auto.mobile.bg](https://g-auto.mobile.bg/), establishing the Blagoevgrad account rather than similarly named businesses. Other assigned accounts have possible or exact older Agency OS variants too; prompts flag these and preserve their account identity. This packet does not move or overwrite any old project.

Golden Dreams is the one explicitly Facebook-sourced account recovered in this pass. Other sessions must find and corroborate their dealers' public social pages and inspect dated activity where accessible. Public profile presence is not proof of frequent posting, buying intent or media reuse rights.

## Acceptance essentials

- Three actual master-derived app trees per built dealer; full Modern workspace; committed local assets.
- Existing identity first; Image Gen for needed logo concepts/refinements and non-factual illustration. Never generate fake inventory, premises, staff or reviews.
- Consistent real sourced vehicle sample and business facts wired into all rendered consumers.
- Framework checks and mobile/desktop route/flow evidence, with unrun checks and blockers stated honestly.
- One dealer completed/checkpointed before the next; unique session report; exact remote commit and app-folder links.

See [assignments.json](assignments.json) for machine-readable ownership and source notes. Older global assignment files remain historical and are not rewritten by this packet.

