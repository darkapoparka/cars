# МАВЕРИК — Sofia / session 07

Status: **blocked**, observed **2026-09-09**. **Auto Best, Modern and Carwow have not been implemented.** This is a research checkpoint, not a runnable project; owner review remains pending.

## Identity and existing work

Assigned destination: `clients/maverik-sofia/`. The inspected main and old-astra client trees at `faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca` and `bcff94eabfba2b3c604bb61d6ea916584e61e4d5`, plus the main client index, contained no matching application directory. Indexed code search was inconclusive; unpublished work in other sessions was not inspected. No occupied application, shared index, other branch or CRM record was changed.

Primary profile: <https://maverik.mobile.bg/>. The readable [Mazda detail](https://maverik.mobile.bg/obiava-21788427124545772-mazda-cx-3-2-0-optimum-skyactiv-g-150hk-aut-4x4) and [Auto.bg profile](https://www.auto.bg/dealer/maverik) match **0878754914**, **0889363331**, and **гр. София, Дружба 1, бул. Искърско шосе 13**. The Mazda detail additionally exposes **0898414841** as a listing-specific contact; do not replace the primary business numbers without confirming its role. Its linked Bazar account is <https://maverik.bazar.bg/>.

Primary `/contacts` failed with a Unicode-decoding error; its indexed result reports no entered opening hours. `/about` also failed. Waze supplies hours, but these were not established from a readable dealer-owned contact page and are not adopted as verified hours. Membership since 2004 is not a company founding date. No email address or coordinates were invented.

An [unconfirmed Oink profile](https://www.oink.bg/biz/avtokashta_maverik1) matches the address and links Mobile.bg. Its Instagram link points to `https://www.instagram.com/rqsautotem.mobile.bg`, not a clearly established Maverik identity; the page returned HTTP 429. That link was not adopted, and no public social-post date or activity claim is made. Bounded searches did not establish an independent dealer domain or corroborated Facebook/Instagram page. This is not proof that none exists.

## Dated listing references and location/status exclusions

The primary catalogue shows 71 category advertisements and a conflicting header count of one. Neither is a verified available-stock total. Older syndicated counts are alternative snapshots, not additional cars. The following is a **partial source sample**, not the complete 8–12-car fact/gallery pack. All listed specifications and prices are seller-published, not independently certified.

| Primary reference | Advertised EUR / VAT | Production / km | Specifications and retrieval |
| --- | --- | --- | --- |
| [Hyundai Kona, 21788613377677241](https://maverik.mobile.bg/obiava-21788613377677241-hyundai-kona-1-6d-136k-c-euro-6b) | 12,250 / not charged | 2019-04 / 132,000 | Diesel, automatic, 136 hp, 1598 cm³, Euro 6, SUV, green; Sofia card read, detail cache miss |
| [Chevrolet Trax, 21788587485690349](https://maverik.mobile.bg/obiava-21788587485690349-chevrolet-trax-1-7-d-131k-c-euro-5b-unikat) | 7,990 / not charged | 2014-02 / 47,000 | Diesel, automatic, 131 hp, 1700 cm³, Euro 5, SUV, black; Sofia card read, detail cache miss |
| [Honda Jazz, 11788520787404438](https://maverik.mobile.bg/obiava-11788520787404438-honda-jazz-1-3i-83k-c) | 2,300 / not charged | 2005-07 / 190,000 | Petrol, automatic, 83 hp, 1339 cm³, Euro 4, hatchback, light blue; Sofia card read, detail cache miss |
| [Mazda CX-3, 21788427124545772](https://maverik.mobile.bg/obiava-21788427124545772-mazda-cx-3-2-0-optimum-skyactiv-g-150hk-aut-4x4) | 11,900 / included | 2016-04 / 154,000 | Petrol, automatic, 150 hp, 2000 cm³, Euro 6, SUV, white; Sofia detail read, published 2026-09-03 |

[Subaru XV, 11784971293554202](https://maverik.mobile.bg/obiava-11784971293554202-subaru-xv-1-6i-114k-c-4h4-unikat-italia-euro-6b) is explicitly flagged **Капариран\Продаден** in the primary catalogue. Exclude it from an available-only sample; the flag does not resolve reserved versus sold.

[VW Golf, 11780825494620371](https://maverik.mobile.bg/obiava-11780825494620371-vw-golf-2-0tdi-150ks-4-motion) is located in **Teteven**, despite the dealer's Sofia address. A syndicated [Toyota Auris](https://www.auto.bg/obiava/91635081/toyota-auris-1-2-benzin-116ps-dk) is in **Denmark**, with transport excluded from its advertised price. These are not Sofia-showroom cars or inclusive delivered-price offers. Do not promote seller finance percentages, approval times, battery-health claims or vehicle history into generic guarantees.

## Visual evidence and missing media

Both primary Mobile.bg and the matching Auto.bg profile point to the same [cover image](https://cdn2.focus.bg/mobile/images/housespicts/h10901590633705122.pic). It failed to render with a cache miss. A reference exists, but its artwork/colors were not visually verified. Do not infer that no logo exists.

The [Mazda's first photograph](https://mobistatic4.focus.bg/mobile/photosorg/772/2/big1/21788427124545772_uq.webp) was visually inspected: a white whole CX-3 on a gravel lot. It does not establish a readable standalone dealer logo. The detail supplies 17 gallery references; only the first photo was visually inspected, not the complete gallery. A direct isolated-cloud download of that exact photo failed, so no asset bytes were saved or committed. The detail's status-image URL is `https://cdn2.focus.bg/mobile/images/picturess/icons/hpages/TOP-wrap.svg`; it did not render in the browser, and no inventory status is inferred from its generic image label.

`publishedBranding`: cover reference found; visual verification unresolved. `sourceLogoUrl`: the cover URL above, not an approved working asset. `workingLogoPath`: null. `creationMethod`: none. `approvalStatus`: unresolved. **No image generation occurred.**

The inspected source/repository records contain no applicable authorization for this session to reproduce these dealer photos. Public accessibility is not a reuse grant. There is no complete accessible permitted stock-image set or usable visually verified brand asset. These are unresolved evidence/access prerequisites, not a general legal judgment about dealer demos. The explicit blocked-dealer rule applies rather than creating empty or misleading template copies.

## Review and resume

Resume with applicable asset provenance and accessible originals, finish visual-brand verification and the current whole-car sample, then copy and personalize all three complete masters in an independent runner. No application source, per-variant `.client/project.json`, dependency install, framework check/build, server, route matrix or viewport screenshot exists. There are no valid application review links yet, and no check is marked passed. No Windows checkout, deployment, dealer contact or background process was used.
