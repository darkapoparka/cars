# Swiss Auto 43 — review handoff

Status: **in-progress / implemented-unverified** after personalization is applied.

## Local entries

- Auto Best: `/`
- Modern: `/cars`
- Carwow: `/`

## Install/start

### Auto Best
`npm ci`
`npm run dev`

### Modern
`corepack enable`
`pnpm install --frozen-lockfile`
`pnpm --filter web dev`

### Carwow
`npm ci`
`npm run dev`

## Review targets

1. Verify Swiss Auto 43 identity, Burgas lot address and all public phone paths; keep it distinct from Swiss Car Center Burgas.
2. Verify the same sourced representative stock drives all three applications and retain source-specific VAT/import qualifications rather than generic finance or availability claims.
3. Run the documented template checks and 390/1440/320 viewport review before changing status to verified-local.
