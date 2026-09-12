# Build, deployment and indexing

Auto Best uses the Vercel adapter configured in [svelte.config.js](../svelte.config.js). [vercel.json](../vercel.json) identifies the SvelteKit framework, `npm ci` install command and `npm run build` build command.

## Build inputs and output

The deployment root is the application directory containing `package.json`, `svelte.config.js`, `src/` and `static/`. For a client project with several variants, use the actual parent deployment integration; pointing Vercel at one variant does not automatically build a multi-design site.

```sh
npm ci
npm run build
```

SvelteKit and the adapter produce the generated application output. Do not select the source `static/` folder as the entire deployed site; it contains media, not the routed application. `.vercelignore` excludes local/source-history material from deployment inputs.

Local inspection of a built version uses:

```sh
npm run preview -- --host 127.0.0.1 --port 6462 --strictPort
```

## Preview versus published mode

`src/lib/config/template.ts` is application configuration, independent of whether the app has a public preview URL. Preview mode emits noindex metadata and a robots policy disallowing crawling. This is an indexing instruction, not authentication or access control.

For indexable mode, the implementation requires:

- `mode` set to `published`, with verified identity and inventory flags;
- a canonical public HTTPS origin with no path or trailing slash;
- verified vehicle records with evidence, and sample team/partner sections disabled.

`canIndex()` throws for invalid published settings. The standalone inventory mapper still needs record-level verification support before its sample fixtures can satisfy those checks; the local refactored mapper supports it. [Data](DATA.md) documents the applicable source version.

The root layout produces page canonical URLs from the configured origin and pathname. `robots.txt` provides the crawler policy. `sitemap.xml` lists the supported routes and current vehicle/article records; preview mode does not turn that endpoint into a private API.

## Environment and external providers

The template needs no database, mail or CRM credentials to render. Maps use a Google embed/directions URL; videos use the configured YouTube IDs and player/link behavior. Content is stored in local modules. Network restrictions and provider availability can still affect embeds.

Business configuration in `src/lib/config` is imported by client-rendered code and must be considered public. A future delivery provider belongs behind a server-side integration, with its credentials supplied through the deployment environment. An inherited `.vercel` binding is not the new client project configuration.

## Response configuration

Legacy redirects and shared response headers are implemented in `src/hooks.server.ts`. The local refactored source configures document CSP in `svelte.config.js`, allowing SvelteKit to supply its generated script nonce/hash; the hook adds the other response headers without replacing that CSP. Development and production connection directives differ. For framework CSP settings, see [SvelteKit configuration](https://svelte.dev/docs/kit/configuration).

## Verify the deployed application

Open the deployed home, inventory, one real detail, Contact, About and an article. Exercise filtering, detail return, mobile navigation and the offered enquiry path. Inspect local assets, redirects, response status, robots/canonical output and actual contact links. An available preview and a working browser-local draft do not establish email/CRM delivery.

Use [Testing](TESTING.md) for the application checks and [Reuse](../REUSE_GUIDE.md) for the content changes that belong to the client copy.
