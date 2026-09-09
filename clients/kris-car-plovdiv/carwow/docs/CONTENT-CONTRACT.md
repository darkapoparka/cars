# Public content contracts

Applies to the independent `J:/cars/templates/carwow` master. The retained Day Night Auto identity is source/demo content, not proof that this is a genericized or publicly approved client site.

## Business details

`src/lib/data/daynight-site.ts` owns the address, address shorthand, contact number, map links and appointment wording. The existing source address is retained: София, Студентски град, ул. Атанас Манчев 18. Do not substitute an industrial-zone label or change historical social handles to match a city name.

The previous schedules disagreed. Until the owner confirms actual days/hours, every current schedule surface uses `hoursLabel`: “Огледи с предварителна уговорка”. This is appointment guidance, not a verified opening-hours schedule. Do not publish numerical opening hours in structured data without confirmation.

`mapEmbedSrc` searches the same full address as the direct map fallback. This removes the separate business-name/region query; it does not establish a verified Google Place ID or a surveyed dealership pin. The owner must confirm the actual meeting location and pin before public delivery.

## Reviews and team

`daynight-reviews.ts` contains nine retained demonstration reviews, with their existing sample text, generic identities and avatar assets. They have no verified review source, author/date or approval record. The `rating` field preserves the five sample stars previously rendered by these records; it is not a new claim about a customer rating.

Home and detail show the first three records from this same collection; the review listing shows all nine. Counts, average and distribution derive from this collection and are labelled as examples. Render `daynightReviewDisclosure` adjacent to each testimonial collection. Never add these sample ratings as a business aggregate in SEO/structured data. Replace records only with owner-approved content and source/consent evidence.

`daynight-team.ts` owns the four generic role profiles and retained demonstration portraits. About cards use the same profile name/role as their destination. Render `daynightTeamDisclosure` next to each team collection and profile. These are example roles and images, not confirmed staff identities. Real names, biographies, portraits and permission to publish need owner confirmation.

## Contact handoffs

`src/lib/utils/contact-intent.ts` owns the permitted contact subjects and vehicle photo/video handoff. `buildVehicleContactHref` carries the existing catalog slug; `readContactIntent` resolves it against the catalog, so unknown values cannot create an apparent vehicle identity. Desktop and mobile show the subject and known vehicle, while `buildContactMessage` retains title, year, lot and relative detail route in the enquiry payload even if the visitor edits their message.

The public catalog has no database UUID. Do not put its slug or `DN-` lot number into the API's UUID `vehicleId` field. Readable message context is the deliberate fallback until a verified catalog-to-database mapping exists. The contact route keys its form compositions by query string so a different intent reinitializes fields instead of retaining a previous request.

These changes preserve the existing lead/import submission clients. Visible success requires their successful response; local UI tests and prefilled requests do not prove actual staff delivery. No real enquiry was sent while implementing this contract.

## Blog publication

The desktop primary navigation and mobile menu expose `/blog` as “Блог”. The index has no breadcrumb strip; article pages retain their hierarchy. Empty collections display a contact action without search, categories or invented posts.

`loadPublishedBlogArticles` supplies the index, article pages and sitemap. The standalone template, without a database, uses the six authored file-based articles in `src/lib/data/editorial-guides.ts`. These are practical buyer/seller guides created on 8 September 2026, without fabricated dealer news, bylines or backdated publication claims. A configured CMS uses the existing dealer-scoped published-post repository; an empty published collection remains empty, and CMS failures yield HTTP 503 rather than inserting local articles. Unknown article slugs yield HTTP 404. The older `daynight-blog.ts` sample records remain source assets only. Both public blog routes render dynamically, and the sitemap uses the same active article collection.

Publishing through the existing admin CMS still requires a configured database, authorized admin access and an end-to-end publication check. The authored guides are served locally from files; no CMS record was created or published during this repair.

## Before public use

Confirm the schedule, meeting location/place pin, approved testimonials and any real team identities. Also verify provider delivery and the final hosted origin using the separate release workflow. Keep all demo disclosures until that evidence exists. Preserve the intentionally different desktop/mobile layouts while changing these shared facts and behavior contracts.
