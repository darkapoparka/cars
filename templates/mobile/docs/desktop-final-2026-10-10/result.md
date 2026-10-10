# Desktop showroom final pass — 10 October 2026

Home now uses three equal-width fields: Вид / Марка / Модел. The 48px search circle has a 10px inset on its top, bottom and right inside the 68px capsule. Quick filters are centered underneath. Selected values appear above the inventory with individual removal and a clear-all action. Specification pills use the same blue-gray surface token as the quick pills.

Services uses Всички / Внос / Продажба pills beneath the search box. Topic/country/sale filters sit lower, above the content. The desktop overview shows four cards across. Existing phone tabs and filter rails remain in their original positions.

Contact has one outer bordered container around the map/contact information and enquiry form, with a single vertical divider and aligned height.

Validation: focused formatting and lint passed; the scoped committed-source candidate passed full lint, type checking, all 156 domain tests and a production build on Node 22.20.0. The stable 6474 preview was checked at 1440px and 1024px for the changed desktop layouts and at 320px/390px for phone controls and overflow. Make selection enables Model; removing the Make chip restores all 16 sample vehicles. A 10,000–60,000 EUR price range gives 10 results and a removable selected-value chip. Services category changes and country/sale filter selection/removal work. No duplicate IDs or horizontal page overflow were found in the checked layouts. Contact's desktop write action focuses the existing enquiry field.

The six captures retain three useful matched pairs: Home field/pill alignment, Services category treatment/card density, and Contact container composition. The Services baseline uses the live preview, which contains a concurrent service-detail routing draft; the final Services capture uses the exact scoped production build. That separate routing work is excluded from this layout commit. The existing owner snapshot and build output were reused for the integration check. Home and Services also passed a smoke check on that production build at port 6475; that temporary preview was stopped after verification.

| Page | Before, 1440 × 1000 | After, 1440 × 1000 |
| --- | --- | --- |
| Home | [Before](before-home.jpg) | [After](after-home.jpg) |
| Services | [Before](before-services.jpg) | [After](after-services.jpg) |
| Contact | [Before](before-contact.jpg) | [After](after-contact.jpg) |

This records local source/build/browser checks. It does not record a new hosted deployment or promote the Mobile template into the dealer release lock.
