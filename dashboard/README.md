# Cars Lead Control Dashboard

Local dashboard for the Cars workspace. It is deliberately a control plane over the existing repository rather than another CRM source of truth.

## Data shown

- `leads/bulgaria.json`, `leads/uae.json`, `leads/usa.json`, `leads/europe.json`
- `docs/DEPLOYMENT-INVENTORY.json`: technical authority; also generates `clients/index.json` and the readable project/deployment lists.
- actual `clients/<slug>/auto-best`, `modern` or `import`, and `carwow` folders
- client `FACTS-AND-INVENTORY.json` and `.client/project.json` when present
- `runtime/review-<slug>.json` for local preview state

Private dashboard state (favorites, pipeline stage, notes and next action) is stored in ignored `runtime/lead-dashboard/state.json`. It never rewrites the public research files.

## Start

```powershell
./scripts/start-lead-dashboard.ps1 -Open
```

Default URL: `http://127.0.0.1:6620/`.

The dashboard can open a client folder, prepare dependencies, start the three existing designs through `scripts/start-client.ps1`, and stop only recorded preview PIDs that still own their recorded ports. It has no deploy, merge, delete, CRM-write or outreach controls.

Refresh registry reindexes local source while preserving timestamped deployment evidence. It does not query Vercel or turn source presence into a successful build. Browser QA and owner review are separate. The dashboard retains private notes in ignored runtime storage. See [registry semantics](../docs/REGISTRY.md).
