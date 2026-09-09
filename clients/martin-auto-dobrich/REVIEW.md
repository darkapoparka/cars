# MARTIN AUTO — review handoff

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

1. Verify MARTIN AUTO identity, Dobrich lot address and phone across header, footer, contact, metadata and mobile navigation.
2. Verify the same sourced representative stock is used by all three applications; negotiated-price wording must remain listing-specific and advertised totals must not be presented as verified availability.
3. Run the documented template checks and 390/1440/320 viewport review before changing status to verified-local.
