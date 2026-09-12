# Three-design dealer offer

Campaign brief, 8 September 2026: research suitable dealers, prepare three personalized website concepts using the existing **Auto Best, Modern and Carwow** templates, then offer the dealer a choice. These are speculative proposals, not commissioned client work. A dealer becomes a customer only after an actual agreement, not because a folder exists or a demo looks finished.

This extends the [existing build workflow](WORKFLOW.md); it does not replace the architecture, templates, copy helper, QA rules or generated projects. Start at the [lead index](../leads/README.md) and [qualification rules](../leads/COVERAGE.md).

## 1. Qualify one account, then prepare three choices

Use one stable business/account identity and one opportunity for the three-design offer. Check current business facts, relevant available stock, actual website opportunity, existing project copies and private outreach/suppression history. Research-only records are not a mass-build instruction. Select a bounded batch of qualified accounts; do not create 120 projects merely because the research index has forty names.

For a new standard dealer the three designs are `auto-best`, `modern`, `carwow`; an intentional Import trio uses `auto-best`, `import`, `carwow`. Preserve existing dealer manifests. The record's recommended entry is just the first design to show. Use one fact sheet, one verified stock sample and one approved asset set across all three, so the dealer is choosing design rather than contradictory inventory.

Reuse existing variants. The ten Varna accounts already have client folders; read each variant's latest `.client/project.json`, build notes and QA evidence. Do not recreate completed work from an older handoff, overwrite an existing folder or silently replace an earlier template version.

For a genuinely new, approved account, resolve a unique slug and use the existing helper from the actual repository root. First inspect the plan:

```powershell
node scripts/new-client.mjs --client <verified-unique-slug> --repository <owner/repo> --preset standard --dry-run
```

The angle-bracket text is a placeholder, not a literal slug. Remove `--dry-run` only for an authorized build after checking existing destinations. This command exists already; it copies source and lineage, not CRM status, personalization, hosting or outreach. Follow the current template instructions for runtime, lockfiles and setup.

## 2. Personalize and review without redesigning

Preserve the chosen template's layout, components and interaction patterns. Change verified branding, assets, stock, business copy, contact destinations and applicable existing localization boundaries. Do not introduce another framework, a dashboard, speculative backend services or repeated UI refactors as part of a sales sample.

Define a small coherent preview scope across all three: home/entry, catalogue, one or more real vehicle details, business/location and enquiry entry. Check all routes actually reachable or offered; keep inherited sample-only routes clearly limited. Hidden unverified routes do not become real staff, finance services or partnerships. Do not imply a static stock sample is a live feed.

Follow existing checks and browser QA at 390 and 1440 px, including inventory/filter, detail, gallery, menu dismissal, contact destination and vehicle context. Do not submit external enquiries during QA. Record relevant checks and remaining gaps; a passing build does not establish delivery, authentication or a production feed.

Localize deliberately: business language, currency, km/miles, price/tax presentation, phone formats, map location and verified service claims. UAE Arabic/RTL, US finance applications or European statutory disclosures are not already implemented merely because a lead is in that market. Scope required shared-template work separately instead of silently promising it.

## 3. Package the offer

Use one short concept overview with **Design A / Design B / Design C**, the recommended starting choice, factual differences, and the single tested public origin with its design switcher. Do not expose internal template inspiration names as an affiliation with another automotive brand. A comparison page is optional future implementation; this document does not claim one exists.

Before any approved deployment, verify rights to commercially reuse the template and proposed media. Public vehicle photos are not automatically licensed for an unsolicited commercial demo. Use authorized assets or clearly illustrative permitted placeholders; never invent stock as if it belongs to the dealer.

Use protected proposal previews where appropriate and identify them as unofficial concepts, not the dealer's live website. `noindex` is useful but is not access control. Do not connect forms to the real business, create search listings, buy a dealer-like domain, impersonate the business or publish indexed speculative pages without the appropriate authorization. Keep sample/stock dates visible.

Production scope must be separate from the sales sample: inventory update method/feed rights, enquiry delivery, hosting/domain ownership, maintenance, migration, accessibility, legal content and any finance/account integrations. Do not promise working functionality merely because a template shows a button or success state.

## 4. Prepare a respectful, authorized message

A useful pitch shows the concrete work and makes the next action easy. It does not insult the current website, claim guaranteed sales gains or imply the dealer commissioned the work.

Illustrative copy structure — not a sent message or a jurisdiction-complete email:

> Hello [Dealership team], I prepared three website concepts for [Dealer], focused on [specific, verified catalogue or enquiry improvement]. They are independent proposals, not changes to your current website. You can compare the designs here: [approved preview overview]. There is no obligation; if a direction interests you, we can discuss the inventory setup, launch scope and price. [Accurate sender identity, required business details and appropriate opt-out information.]

Use that claim only after all three concepts actually exist and have been checked. Before sending, approve the exact recipient, lawful channel, final message and preview links. A source URL containing a business phone or email is not consent. Do not assume that permission to research or build authorizes outreach, automatic follow-ups, bulk messages or a switch to another employee/channel after an objection.

Rules differ by country, channel and business type. The US FTC's [CAN-SPAM business guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business) includes B2B commercial email and requirements around sender information, truthful subjects, identification, postal address and opt-out. The UK ICO's [B2B marketing guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/business-to-business-marketing/) distinguishes corporate subscribers from sole traders and notes that personal-data rules still matter. Germany's [UWG section 7](https://www.gesetze-im-internet.de/uwg_2004/__7.html) imposes its own electronic-marketing restrictions and exceptions. These sources are starting points, not approval of this campaign; obtain current country/channel review, including Bulgaria, the UAE and the Netherlands, before sending.

No email, message, call or live website form was sent/submitted as part of adding the lead list.

## 5. Keep research, build state and sales state separate

| Record | Purpose | Where it belongs |
| --- | --- | --- |
| Public research account | Company identity, source URLs, dated stock evidence, website finding, priority and next verification task | `leads/*.json`; readable view in `leads/README.md` |
| Technical project | Account linkage, template/version, local path, chosen home, QA evidence, local/hosted URL type and limitations | Existing client metadata and build evidence; private deployment details stay private |
| Opportunity and activities | Which three-design package was offered, actual messages/replies, next action, accepted/declined outcome and suppression | The owner's designated private operations system, not public Git files |

This repository was public at review. Do not place private contact notes, personal email histories, deal values, decline reasons, suppression lists or CRM exports in it or public issues/PRs. This addition neither migrates nor replaces the existing CRM. The public research list can be read without Agency OS; actual sales history must come from the approved private authority. If that authority is unavailable, report `history unresolved` or `sync pending`, not `never contacted`.

A private record should link the stable research ID to the existing account/opportunity IDs and all three variant paths. Useful fields are owner, sales stage, per-variant build state, hosted preview references, last verified activity, next action/date, outcome scope and suppression status. Use the existing system's fields when available; these are conceptual requirements, not an implemented schema migration.

Suggested private sales stages: `history_unknown`, `not_contacted_verified`, `contacted`, `in_discussion`, `proposal_sent`, `won`, `declined`, `closed_no_response`. Maintain per-project states separately, such as `not_started`, `personalizing`, `local_verified`, `preview_ready`, `archived`. Existing client metadata enums have not been rewritten to these names.

A message draft is not `contacted`; sending requires evidence of the actual authorized action. Silence is not a decline. A preferred design is not a signed sale. Rejecting Design A is not necessarily rejecting the entire opportunity. A future re-open is a new event, not deletion of the old outcome. Keep do-not-contact/suppression separate from sales stage and check it across relevant campaigns/channels.

## 6. Required finish checkpoint

After an authorized build/QA task, update the selected project's existing technical metadata and concise build evidence. Link the stable research/account identity, exact template version and actual local/hosted status. Update the corresponding approved private project/opportunity record when that write is in scope; otherwise report a pending handoff.

After research, update source-backed public research fields and the readable index together. After an actual authorized message or confirmed reply, append the private activity and update only the justified stage, next action and suppression scope. Do not put actual sales-state changes into public research JSON just to make a checklist look complete.

One coordinator owns shared tracking writes. Workers own explicitly assigned project paths and return evidence. Record updates are a manual completion requirement until automation is separately implemented and validated; an AGENTS instruction alone is not a reliable background CRM sync.

## 7. Declines and archival

A declined offer stops speculative work on that opportunity unless the owner explicitly reopens it for an appropriate reason. Review whether and when to deactivate its previews. Archive the specific project only with approval, verified ownership and a recoverable source/version record; do not delete a shared template or unrelated demo.

Keep the minimum lawful private outcome/suppression record needed to avoid unwanted repeat contact, under an appropriate retention policy. Deleting an app folder does not erase Git history or automatically revoke a deployment. Do not delete research identity simply to make the same dealer appear new later. No archival, deletion or retention changes are executed by this documentation.
