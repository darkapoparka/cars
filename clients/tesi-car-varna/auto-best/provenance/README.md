# Legacy reference provenance

The retired mirror payload is preserved by Git history rather than shipped with the SvelteKit application. `mirror-manifest.json` is the final metadata record retained from that payload.

The manifest records 150 routes and 479 resource records, `https://daynight.mobile.bg/` as its observed source, and an acquisition timestamp of `2026-08-13T05:09:17.976Z`. Its SHA-256 digest after relocation is `4534B039345912E60CA0F634ADA4882BA9E9E166F5F5B8B50BD5A0FB089F4D62`. The separately preserved historical acquisition script is configured for `https://autodealnextjs.vercel.app`. Those records do not establish that the script produced this manifest, and they must not be described as matching provenance.

The historical scripts under `scripts/provenance/` are not application build commands. The acquisition script is intentionally environment-gated because it recreates and replaces a `mirror/` directory. License evidence remains external to the repository as described in `SOURCE_LICENSE.md`.
