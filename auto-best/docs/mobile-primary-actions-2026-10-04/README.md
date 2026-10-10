# Mobile service and menu actions

Import, Sell, and the mobile menu now share black primary actions with white
labels. Two semantic surface tokens keep the entry buttons, editors, enquiry
steps, and service-guide actions in the same color family. Existing action
dimensions, rounded corners, labels, targets, focus indicators, and validation
colors are preserved.

The service landing and menu select the neutral surfaces below 768px. Desktop
continues to resolve the existing dealer primary color through the token
defaults. No component-local hex colors or broad brand-color replacement were
introduced.

The import, sell, and menu screenshot pairs use the same native 360 × 884
viewport. `verification.json` records their geometry and colors, nested mobile
actions, BG/EN width checks, and the preserved 1440px desktop actions.

Validation: Node 22.20.0, CSS policy, token graph, pinned typography/icons, Svelte
check, production build, and targeted browser checks. This is source polish;
it does not promote the template release or deploy dealer sites.
