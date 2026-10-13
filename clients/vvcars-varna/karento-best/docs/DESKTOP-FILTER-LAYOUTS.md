# Desktop vehicle filter layouts

Vehicles supports the existing right drawer and a centered modal inspired by the App template. The modal is native Svelte and uses Karento's existing make logos, body-type artwork and controls. Both layouts use the same catalogue matching, URL parameters and applied-filter toolbar. Changes remain a draft until **Show cars**; closing cancels the draft.

Set the optional `vehicleFilters` property on the typed dealer content in `src/lib/content.ts`:

```ts
vehicleFilters: {
  layout: "modal", // "drawer" is the default
  showLayoutOptions: false,
},
```

Reference demos show a second **Filter modals** button by default so both layouts can be compared. Owner-reviewed dealer content shows one **Filters** button by default, using the chosen layout. `showLayoutOptions: true` explicitly enables both buttons; when the primary layout is the modal, the second button reads **Filter drawer**.

The option applies at 992px and above. Existing phone and tablet filtering is unchanged. Available facets come from the supplied inventory; unprovided specifications do not gain invented choices. Make and model selection remains singular, consistent with the hero and drawer.

The implementation does not update a template release, generate dealers, change the publishing mirror or deploy existing leads.
