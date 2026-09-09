# DANGER AUTO review — source checkpoint, not a finished dealer

Repository: darkapoparka/cars. Branch: codex/astra-bg-08. Base: faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca.

## Designs

| Design | Source | Entry | Current state |
| --- | --- | --- | --- |
| Auto Best | clients/danger-auto/auto-best | / | Actual source copy; stock adapter and filters integrated; identity/media/content and runtime QA incomplete |
| Modern | Not created | /cars is only the planned template entry | Pending; no runnable application to claim |
| Carwow | Not created | / is only the planned template entry | Pending; no runnable application to claim |

## Executed check

From a checkout containing these files:

```sh
node clients/danger-auto/checks/stock-contract.mjs
```

This command was executed in the independent `/mnt/data/session08-work` working set with Node v22.16.0, exit 0, 22 passed and 0 failed. The tested inventory/listing files' Git blob hashes were checked against the published files. It strips TypeScript syntax and executes data modules; it does not typecheck the app or render pages.

## Full application commands — not executed here

Auto Best's retained package requires Node ^22.12.0 and npm 10.9.8. From `clients/danger-auto/auto-best`:

```sh
npm ci
npm run validate
npm run dev -- --host 127.0.0.1 --port 6681 --strictPort
```

Port 6681 is a proposal, not a checked-free or running listener. Do not stop another process or silently select another port. Expected local entry after a successful launch is `http://127.0.0.1:6681/`; it has not been opened or verified here. On the coordinator's workspace, the existing scoped `scripts/start-preview.ps1 -Client danger-auto -Template auto-best -Port 6681` is also applicable once preparation and known fixes are complete. The trio launcher is not yet applicable because two variants are absent.

Known validation work: the inherited asset checker assumes exactly 98 master assets, and the existing domain checker does not copy/load the new JSON snapshot. The calculator's zero-principal amount also needs formatting independent of unknown vehicle prices. These are not waived by the data-module pass.

## Coordinator

Fetch only the assigned branch and inspect its diff; preserve the shared main checkout and dirty owner work. Do not deploy or send this checkpoint. There is no finished dealer yet. Resume with the blocked identity/contact patch and the concrete validator/finance fixes, then complete real branding/media and all reachable content before moving on to the other two designs. The preview remains noindex and no external delivery is configured or claimed.
