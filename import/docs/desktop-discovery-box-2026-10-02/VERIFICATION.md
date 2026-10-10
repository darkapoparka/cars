# Desktop Home and Inventory panels

Home and Inventory share one white discovery panel and one search control. Inventory's keyword field, six quick filters and All filters action are connected inside the hero. Home retains its four service tabs, with search above the filters. The Search icon sits inside each field. The existing results count, Sort by disclosure and View disclosure remain aligned with the vehicle grid.

The shared components own the frame, padding, rounded corners, control surfaces and focus treatment. Page owners retain query state and their existing dialog or native GET behavior. Duplicate parameter names no longer produce duplicate keyed elements in the desktop keyword form or sidebar. The redundant Home search component was removed.

## Verification

- Runtime: Node 24.21.0, retained npm lockfile.
- Frozen working-source build: type checks, scoped formatting, scoped lint, architecture check and production build passed.
- Production browser suite: 21 passed, 17 intentional skips for desktop-only cases in the mobile project. Home search, query submission, dependent filters, sidebar, sorting, view changes and keyboard behavior passed.
- Home and Inventory accessibility checks: 4 passed across desktop and mobile projects.
- Rendered desktop geometry: BG and EN, both pages at 768, 900, 1024, 1440 and 1920px. All 20 cases fit without horizontal overflow. Search fields are 56px, inset actions 44px and filter controls 48px. Inventory controls balance across two rows at narrower desktop widths.
- Native icon submission retained both selected makes, the model, price limit, sidebar layout, card view, sorting and repeated passthrough parameters. The result was BMW X3 30e xDrive. Home Enter/Escape and focus return passed.
- Mobile screenshots at 320 and 390px retained their captured page dimensions. Raw raster comparisons were not pixel-identical; no pixel-identity claim is made. This task does not edit mobile composition or mobile styling. Separate mobile work present in the shared checkout was excluded from the commit.

[verification.json](verification.json) records source hashes, the frozen source digest, results, geometry and interaction evidence. The local dev server remains on port 6790. Owner visual acceptance is pending; these changes have not been promoted as a template release or deployed to dealers.

## Before and after

| Page      | Before, 1440px                          | After, 1440px                          |
| --------- | --------------------------------------- | -------------------------------------- |
| Inventory | [Screenshot](before-inventory-1440.jpg) | [Screenshot](after-inventory-1440.jpg) |
| Home      | [Screenshot](before-home-1440.jpg)      | [Screenshot](after-home-1440.jpg)      |

Additional final views: [Inventory, 1920px](after-inventory-1920.jpg), [Home, 1920px](after-home-1920.jpg), [Inventory EN, 768px](after-inventory-en-768.jpg). Mobile pairs and the raw comparison are retained in this evidence directory.
