# DANGER media-consumer checkpoint — 9 September 2026

Resumed existing head 760e296d1efeee55b4152a8abeebf88beb1b3bae, preserving all previous work. Carwow's two actual inventory adapters previously ignored localImages. They now share a local gallery resolver, use the matched first image in cards/current inventory, use the complete record gallery in details, and keep only genuinely missing-image records in the placeholder set. A seller-advertised used car is no longer reclassified as new solely because its odometer is below 100 km. Existing rendered components and layouts are unchanged.

Executed 18 fixture-based adapter assertions and TypeScript script-syntax checks, exit 0, Node v22.16.0 / TypeScript 5.8.3. The fixtures are not dealer cars or evidence of actual media. Exact commands, source hashes and limits are in clients/danger-auto/checks/STOCK-MEDIA-RESULTS.json. No framework build or browser pass is claimed.

The official Chevrolet photo was visually re-opened at https://mobistatic3.focus.bg/mobile/photosorg/556/1/big1/11788853280325556_NU.webp. It shows the dealer plate branding. Its attempted download failed; no photo bytes were acquired or permission inferred. The committed eight-record stock pack still has no cleared local images. Required media and remaining full-app content/QA are unfinished, so DANGER remains in-progress rather than complete. This is not a GitHub write blocker. Proceeding to the other four explicitly assigned dealers while retaining this exact resume point, as the packet permits when essential media cannot be established.

No main/astra update, deployment, dealer contact, workflow trigger, Windows write, or background process was made.
