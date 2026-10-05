# Mobile PDP live preview

Verified 5 October 2026 for the owner's phone testing.

- [BMW X6](https://cars-template-mobile.vercel.app/vehicle/bmw-x6?lang=bg)
- [BMW 120](https://cars-template-mobile.vercel.app/vehicle/bmw-120?lang=bg)

Cars source `d77f8c893f588818049ee1bb6ae8467224068fca` contains only six PDP source/QA files. The full-width, single-line title stays above the price; net price sits beside the main price, with subtle variant/gearbox pills below. The rating fits beside short names and moves above long names. Phone image controls, elevated Details/Features/Photos tabs, financing below the description, compact specifications and 32px specification icons are retained.

The existing publishing mirror is `719db42aa381ae0ce73c68860ab59340d97740af`. Its Git push triggered exactly one production deployment, `dpl_9mq7kn7zK9GZEdA6d18Yre9uqhhu`, now READY on the existing standalone Mobile preview. Its provider Git metadata matches the publishing commit; the publishing receipt binds the Cars source tree and digest in delivery.json.

Node 22.20.0: ESLint, standalone TypeScript, scoped formatting, 95 domain/localization tests, the production build (51 static pages) and 72 Chromium/WebKit PDP checks passed on the isolated committed source. Fourteen hosted checks passed for BG/EN at 320/390px and desktop at 1440px, with no captured console/page errors. The local suite also covers 430px, long names, long variant pills, 200% text, dialogs, focus, gallery history and the contact dock.

Matched live desktop screenshots found zero changed pixels for BMW 120. BMW X6 differed only at four antialiasing pixels on the rounded sheet corner, with a maximum channel delta of 4/255; no visible layout change was found. Screenshots remain in this project's evidence directory. Owner real-phone visual acceptance remains open.

The shared Cars index and its pre-existing lock were preserved byte for byte. The local checkout still has HEAD `08c89d63f9e11939acd5b135ece4278252b80f43`; the scoped commit used a separate index based on current fetched remote main and was pushed without force, following docs/WORKSPACE.md. Concurrent filter, desktop, generated configuration and other template/client work was excluded. The temporary exact-source QA server at 6475 was stopped; the working Mobile preview at 6474 remains running.

This updates the existing standalone test preview. No template release lock, dealer copy or other hosting project was changed.
