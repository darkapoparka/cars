# Mobile desktop selector review

This records the selector-layout iteration. The later [desktop styling polish](../mobile-desktop-polish-20261005/README.md) contains the current verified source hashes and styling comparisons.

The desktop hero now contains vehicle type, make/model, price and the existing stock action. Vehicle illustrations appear in the type menu. One sticky quick-filter row remains below the 280px banner, with Year, Fuel, Gearbox and More; applied make/price criteria stay visible as chips. Sort sits beside the result count. Inventory keeps four columns.

The phone category rail, filter controls and editor remain as before this task.

The matched before and after captures use 1440 x 960 viewports, with Bulgarian and English examples. Open-menu captures show the original category artwork in context.

Validation passed: lint, TypeScript, 95 retained tests, production build, 58 desktop browser checks and 48 phone layout/control/style comparisons in Chromium and WebKit. The phone screenshots retain some photo/shadow rasterization differences; this is not a pixel-identical claim. Source photo bytes match. Details are in verification.json. This is a local preview and scoped source change; release selection and dealer publication are separate.
