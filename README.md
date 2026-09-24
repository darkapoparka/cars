# Cars

Work in **J:/cars**, on **main**. The four editable template masters live here:

```text
templates/auto-best/
templates/modern/
templates/carwow/
templates/import/
clients/<dealer>/          # one dealer, three personalized applications
scripts/                  # creation, explicit updates and publication
runtime/                  # generated packages, logs and QA evidence; ignored by Git
```

Open [Cars.code-workspace](Cars.code-workspace). It includes Cars and the separate shared Cars Admin demo. The old `J:/template-repos/cars-template-*` folders are retained recovery/history sources. Frontend work now belongs in `templates/<key>`.

## Everyday workflow

1. Improve a template in `templates/<key>`, preview it there, test, commit and push to Cars main. Select its tested version for reuse through [template releases](docs/TEMPLATE-PROMOTION.md).
2. Build a lead from three selected templates. Standard: Auto Best, Modern, Carwow. Import replaces Modern when appropriate. Add one sourced business/inventory pack and real or generated raster branding through the existing content boundaries.
3. Publish all three designs to that lead's existing private GitHub repository and one Vercel project. Give the lead one public URL with three design choices and the shared Admin demo link.
4. When requested, update an existing dealer deliberately. Compare its old template, current dealer source and new template; preserve its branding, listings, assets and custom work; preview the result before installing and publishing it.

Template edits never automatically roll out to dealers. Each dealer can stay on its working version until its update is reviewed. When a lead chooses a design, finalize that design in the same dealer project and retain its identity and deployment history.

## Commands

```powershell
node scripts/workspace-doctor.mjs --fetch
node scripts/template-release.mjs status
./scripts/start-preview.ps1 -Template carwow -Port 6463
node scripts/new-client.mjs --client example-dealer --repository darkapoparka/cars-exampledealer --preset standard --dry-run
```

Preview ports must be free; the launcher reports the actual source path and process. Use the new-client command without `--dry-run` for an authorized build with the real dealer identity. It copies the selected immutable release, not an unfinished working folder. Current release holds are reported explicitly.

Cars owns canonical source for existing `clients/<slug>` dealers; their dedicated repositories are publishing mirrors. Explicitly registered independent dealers retain their own source repository, as recorded in the registry. Do not create a second editable copy of either kind.

Read [AGENTS](AGENTS.md) for preservation rules, [WORKFLOW](docs/WORKFLOW.md) for dealer work, [publishing](docs/LEAD-PUBLISHING.md) for delivery, and [projects](docs/DEPLOYMENTS.md) for recorded URLs. [WORKSPACE](docs/WORKSPACE.md) explains ownership; [documentation](docs/README.md) routes deeper references. Agency OS integration can follow later; private CRM and outreach data stay outside this public repository.
