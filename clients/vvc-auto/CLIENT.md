# В.В.Ц – АУТО — Sofia

Status: **implemented-unverified** on `codex/astra-bg-07`.

Source: <https://vvc-auto.mobile.bg/>. Primary phone used in the demos: `0888 629 959`. Published Mobile.bg location used in the demos: Sofia, Orlandovtsi, ul. Zhelezopatna 24B. Older alternative-directory address data was not used as the primary showroom identity. Public hours were not confirmed, so visitors are told to call first.

## Applications
- `auto-best/` — published Auto Best tree `97833980ab127f6de8f675ac1a188e4b7f717976`; entry `/`.
- `modern/` — full published Modern workspace tree `66bfb8196bbce18832ada6b34b02dda97baba25b`; entry `/cars`.
- `carwow/` — published Carwow tree `d4a08817e87cf84d08c4db1c08a515937245f2dd`; entry `/`.

The master layouts are preserved. Dealer identity, phone/address/maps, blue/graphite visual accent, local demo wordmark and representative source-backed stock are wired into the existing data/config consumers. Carwow inherited Day & Night testimonials, staff, videos, FAQ claims and blog identity were removed/replaced.

Request-price listings are not represented as zero-price cars. Reserved/sold/parts records and ambiguous records were not promoted into the displayed representative sample. Stock counts shown by the demos are sample counts, not the marketplace category total.

Brand asset: `BRAND.svg` and per-app `/brand/logo.svg` copies; this is a restrained local demo refresh and not a dealer-approval claim.

Runtime/build/browser verification was not executed in this GitHub-only handoff. See `REVIEW.md` and the per-variant `.client/project.json` files.
