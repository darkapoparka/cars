# Mobile quick-pill shadow polish

The inactive quick pills keep their white fill and use a downward shadow with
negative spread to reduce the grey halo around their top and side edges.
This changes one StyleX declaration in `ShowroomQuickPills.tsx`:

```css
/* Before */
box-shadow: 0 1px 4px rgba(27, 27, 33, 0.12);
/* After */
box-shadow: 0 2px 4px -2px rgba(27, 27, 33, 0.18);
```

The vehicle-type rail retains its original `0 4px 8px` shadow at 12% opacity.
Its 52px height, underline and 16px gap to the pill faces are unchanged.
Selected mobile pills remain black. Desktop pill shadows remain disabled.

| Before, 390 x 844 | After, 390 x 844 |
| --- | --- |
| ![Before](before-390.jpg) | ![After](after-390.jpg) |

Validation: ESLint, TypeScript, Prettier, all 95 domain/localization tests and
the full production build passed. Browser checks covered 320px, 390px and
1440px, selected BMW and shared Services pills, 48px touch targets, overflow
and console errors. Phone rail geometry and computed shadow match exactly
before and after; pill geometry and colours also match.

Screenshot samples confirm the pill top changed from RGB 250 to 255 and its
left edge from 249 to 253. The sampled rail fade stayed RGB 245.
The screenshots are unedited browser captures. Local preview: port 6474.

This is source polish for the Mobile candidate. It does not promote the
template release lock or deploy dealer sites. Other writers' draft source and
generated configuration were preserved and excluded from the scoped commit.
