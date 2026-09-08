# Template: autodeal

## Source Lineage And Reuse Rights

This master is an isolated static mirror of the licensed AutoDeal reference supplied for Agency OS reuse. The source license is held outside this repository; generated lead demos stay within that approved scope and are created by cloning this master.

## Lifecycle Status

ready

```agency-os-template-reuse
schema: agency-os-template-reuse/v1
source-class: written-multi-project-grant
source-clearance: approved
lineage: documented
lineage-reference: AGENCY_TEMPLATE.md#source-lineage-and-reuse-rights
license-id: written-grant
```

Best for:

Approved projects that require the licensed AutoDeal automotive marketplace reference and its complete route surface.

Fast Skin:

Do not personalize this master. Clone it first, then update the clone's visible identity, contact paths, inventory, metadata, and approved assets within the license scope. Generic, lead-neutral infrastructure such as the isolated `i18n/` overlay may be maintained here and synced to existing clones.

Sales Demo:

Use a generated clone and verify all home variants, listing/detail routes, contact paths, and account-facing screens before any deployment or handoff.

Do not touch:

The mirrored reference pages, same-origin runtime assets, route snapshots, or acquisition manifest in this master. Reusable overlays must remain outside `mirror/`.

Common edit zones:

Generated clone for lead identity and content. Lead-neutral overlay code may live outside `mirror/`; keep the source mirror immutable and use a separate project key for each client-specific version.

Stale-brand search terms:

Search the clone for the source identity, source URLs, phones, email addresses, metadata, and image-embedded identity before client use.

QA notes:

Run `npm run build`, `npm run dev`, then browser smoke checks for every route in `mirror/manifest.json` at desktop and mobile sizes.
