# Local development

Run commands from the application directory containing `package.json`. Auto Best is a single SvelteKit package; it does not require a monorepo task runner or another template to start.

## Toolchain

The package declares Node `^22.12.0` and records npm `10.9.8`. Use the Node 22 line and install with `npm ci`. The lockfile, not the newest package versions, determines the dependency set.

The stack includes Svelte 5, SvelteKit 2, Vite 8, TypeScript 5 and the Vercel adapter. `@fontsource-variable/onest` supplies the font. Playwright supplies browser automation. Exact versions and scripts are in [package.json](../package.json) and [package-lock.json](../package-lock.json).

## Development server

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 6461 --strictPort
```

Open `http://127.0.0.1:6461/`. `--strictPort` makes an occupied port a visible error rather than silently selecting another one. Vite updates source changes through its development server. Markdown documentation is not an application dependency and does not require restarting the server.

## Built application preview

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 6462 --strictPort
```

Use a free preview port. The preview serves built output, not unbuilt source changes. Rebuild after an application change before relying on it. Keep build/sync commands sequential for one checkout rather than writing the same generated output from several tasks at once.

## Running browser checks

PowerShell:

```powershell
$env:BASE_URL = "http://127.0.0.1:6461"
npm run smoke
```

POSIX shell:

```sh
BASE_URL=http://127.0.0.1:6461 npm run smoke
```

The default browser helper uses installed Chrome. `PLAYWRIGHT_CHANNEL` can select another supported Chromium channel; `PLAYWRIGHT_EXECUTABLE_PATH` can point to an installed browser binary. A browser installation and a running target server are separate prerequisites from installing the npm package.

The current local helper also accepts `PLAYWRIGHT_ENGINE=webkit` or `firefox`; install the corresponding Playwright browser before using it. The default remains Chromium/Chrome. Map-provider fixtures are used in some suites, so those suites do not prove that the live map provider rendered.

## Files changed during development

`src/` and `static/` contain application source and media. `node_modules/`, `.svelte-kit/`, adapter/build output and `artifacts/` are generated or local output. Package scripts resolve paths relative to the application root. `svelte-kit sync` refreshes generated route types; do not edit `./$types` output.

Alias configuration is in `svelte.config.js`; TypeScript extends the generated SvelteKit config. A new data helper can use `$data`, `$config` or `$lib` as appropriate. A new component normally uses a typed `<script lang="ts">` and a scoped `<style>` block.

## Common problems

| Symptom | First check |
| --- | --- |
| Port already in use | Existing listener and its actual directory; use the intended server or a free port |
| Wrong page/design appears | URL, listener and source directory—not just a similarly named folder |
| Missing generated route types | Run `npm run check` to synchronize and inspect diagnostics |
| Browser executable unavailable | Chrome/channel/executable path expected by `scripts/browser.mjs` |
| `BASE_URL` error | Set it in the same shell that starts the suite |
| Build preview looks unchanged | Rebuild source changes and check the preview process |
| Broken local media | Public path, filename case, extension and actual file bytes |
| External map or video fails | Network/provider behavior separately from the application |
| Strange Bulgarian characters | Save source/docs as UTF-8 and check terminal encoding |

## Existing owner workspace

The reviewed development copy currently lives at `J:/cars/templates/auto-best`; its server uses 6461. The project GitHub destination is `darkapoparka/cars-template-auto-best`. This local setup is not a required installation path for future clones. [Template reference](../TEMPLATE.md) distinguishes that working source from the standalone source revision.

[Testing](TESTING.md) documents the command purposes. [Styling](STYLING.md) and [Architecture](../ARCHITECTURE.md) explain how to make changes in the existing structure.
