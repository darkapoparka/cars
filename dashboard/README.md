# Cars Lead Control Dashboard

Local control surface for the Cars workspace.

The dashboard treats Git refs as the source of truth for whether a three-design dealer project exists. It scans `origin/main`, `origin/astra`, and `origin/codex/astra-bg-*`, then keeps GitHub build state separate from local checkout presence and QA evidence.

States are intentionally distinct:

- **GitHub build:** no build, partial, `3/3 on main`, or `3/3 branch-only`.
- **QA:** passed, pending, or evidence missing. A complete codebase is not automatically QA-ready.
- **Local:** whether the project is actually present in `J:/cars` and can be launched with existing scripts.
- **Pipeline:** private local stage/notes stored under ignored `runtime/lead-dashboard/state.json`.

Run from the Cars root:

```powershell
./scripts/start-lead-dashboard.ps1 -Open
```

The **Refresh GitHub** control runs `git fetch origin --prune` without switching branches or altering the working tree. Project start/stop controls remain local-only and preserve the existing launcher ownership checks.
