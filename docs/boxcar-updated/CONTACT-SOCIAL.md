# Contact social card

The blue Planning a viewing note has been replaced by a white Follow us card in the right column. Facebook, Instagram and YouTube use the original local Boxcar brand font, with 48 px neutral icon tiles and visible platform names. The white information cards and grey details background are retained; the enquiry button remains the panel's main blue action.

`brand.socialLinks` remains the dealer configuration boundary. Configured URLs render native external links with their platform labels. The generic template has no verified profiles, so its three platform previews are static spans with no invented destination, click handler or keyboard stop. No extra demo caption is added to the card. The obsolete viewing-note rules are removed.

Seven Chromium states passed: Contact at 1440, 1024, 768, 390 and 320 px, plus viewing and selling entries at 320 px. The white social card, loaded original icon font, contained 48 px icons, three information cards, retained map, correct subjects, absent viewing note and horizontal overflow were checked. No console errors were reported. Configured profile destinations were not tested because none are supplied.

Svelte check passed with zero errors and warnings. The Vite production build passed with 163 modules on Node 22.23.2. The brand configuration and enquiry component were not edited. Template release pins and dealer deployments are unchanged.

- [Browser receipt and source hashes](contact-social-results.json)
- [Desktop panel](contact-social-desktop.jpg)
- [320 px panel](contact-social-320.jpg)
