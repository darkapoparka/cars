# Joined Contact panel

For the latest grey surface, white detail cards and blue viewing note, see [Contact detail cards](CONTACT-CARDS.md). The evidence below records the preceding pale blue panel.

Contact's form and contact details share one rounded outer container. The form is white; the adjoining details area is pale blue, with a white viewing note inside it. The two columns meet without a gap or an inner divider. Their upper edges align and the blue surface fills the full panel height.

Below 1000 px the form and details stack inside the same continuous container. Padding reduces on tablets and phones; existing field labels, native inputs and contact configuration remain intact.

Checked on the local preview at `http://127.0.0.1:6455/contact/` in the Codex Chromium browser at 1440, 1024, 768, 390 and 320 px. The joined surfaces, control bounds and static text fit without horizontal overflow. Viewing and selling subjects, selling fields, required-field validation, the truthful local enquiry preview and clearing feedback after editing were checked. No console errors were observed.

Svelte check passed with zero errors and zero warnings. The final Vite production build passed using Node 22.23.2.

- [Browser receipt](contact-panel-results.json)
- [Desktop panel](contact-panel-desktop.jpg)
- [320 px page](contact-panel-320.jpg)

This is local template polish. Template release pins and dealer deployments are unchanged.
