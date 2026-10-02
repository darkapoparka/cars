# Banner and service-card correction — 2 October 2026

The preceding mobile change detached the Sell heading and checkmarks above the image region. The service package cards also gave decorative black photo panels more space than the package information. The owner rejected both compositions.

## Source correction

- Sell uses one rounded, bordered banner. Its image fills the banner frame behind the heading, checkmarks and action. The photograph keeps `object-fit: contain` and bottom-right alignment without a subject-fading mask. The mobile action follows the checks rather than living in a separate image block. The frame's minimum height also responds to its font size.
- Service packages use compact neutral cards with a dark heading, three checks and one **Виж повече** button. The decorative image panel, repeated description and its unused styles are removed. The original artwork files remain preserved.
- The diagnostic check label becomes **Компютърна проверка**, avoiding repetition of the heading **Диагностика**. Full package descriptions and checks remain available in their existing details sheets.
- Mobile header behavior and the Finance calculator are unchanged by this correction.

## Reference and evidence

The original Cars24 service page and the App service page were inspected in the user's existing in-app browser at a 356px viewport before the correction. Cars24 uses compact package cards with a title, checks and one action. This correction follows that hierarchy without adopting its captured inspection counts, intervals, guarantees or marketplace identity.

The retained [Sell before image](sell-before-320.png) and [Service before image](service-before-320.png) are copies of the previous change's actual 320px after captures. They show the source state at the start of this correction; they are not new after captures.

`npm run check` passed with Node 22.20.0: ESLint, TypeScript and the production build, generating 407 pages. The build used `.next-banner-card-correction-20261002`, separately from the running dev server, and restored the generated TypeScript configuration. See [build result](check-result.json) for source hashes and the unchanged-source check.

## Visual verification limitation

During subsequent browser access, the browser's automatic safety check rejected selecting the existing tab, citing a disallowed URL protocol. No alternate browser, raw browser command or headless browser was used to bypass that rejection. Fresh after captures, 320px/390px/desktop rendering, enlarged-text rendering and affected interactions have not been reverified for this correction. Earlier checks describe the preceding source state only.

The code and build result are ready for review. Visual acceptance remains open on the local App preview: [Sell](http://127.0.0.1:6483/bg/sell) and [Services](http://127.0.0.1:6483/bg/service). Port 6484 serves the retained Cars24 reference.

No dealer refresh, deployment or template release was performed.
