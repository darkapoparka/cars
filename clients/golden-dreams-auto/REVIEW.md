# GoldenDreams AUTO — review

Status: **implemented-unverified**.

## Project folders

- Auto Best: `J:/cars/clients/golden-dreams-auto/auto-best` — entry `/`
- Modern: `J:/cars/clients/golden-dreams-auto/modern` — start `apps/web`, entry `/cars`
- Carwow: `J:/cars/clients/golden-dreams-auto/carwow` — entry `/`

After scoped integration into the coordinator checkout:

```powershell
./scripts/start-client.ps1 -Client golden-dreams-auto -Prepare
./scripts/start-client.ps1 -Client golden-dreams-auto
```

Suggested local entries after the launcher selects free ports:
- Auto Best: `/`
- Modern: `/cars`
- Carwow: `/`

Review the header/logo at 320 px and the full pages at 390 and 1440 px. Check home, inventory, the CLA detail, contact, navigation/menu, search/filter/reset and phone/Facebook/Instagram destinations. Do not submit a real enquiry.

## Known limitations

The exact showroom address is not verified. The current Bazar.bg CLA listing is the only dealer stock record deliberately wired into the Auto Best and Carwow fast-skin consumers in this pass. Modern keeps the retained marketplace demo fixtures behind the GoldenDreams identity and must not be interpreted as dealer stock until the coordinator replaces/filters those fixtures.

No full `npm/pnpm install`, framework validation/build, browser run or screenshot comparison was executed here.
