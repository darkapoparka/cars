# App Menu artwork

Implemented locally on 14 October 2026 at the owner's request. The phone Menu and compact desktop disclosure use one matching silver/graphite asset family. The guest card uses a neutral illustrated person; it does not introduce sign-in or account behavior. Existing copy, destinations, dealer contact conditions and row geometry are retained.

View cars and Vehicle services reuse the dock's cars.webp and service.webp files. Saved cars, Sell, Finance, About us and configured phone/email contacts use the new menu assets. Chevrons, Close, Back and language checks retain simple SVG controls.

ShowroomArtwork reserves its dimensions, keeps decorative artwork out of accessible names and substitutes the supplied SVG on image failure. File URLs pass through assetPath for configured mounts. The implementation uses the existing React and StyleX stack.

Web delivery: six 64x64 transparent WebPs plus one 80x80 guest WebP, 4px transparent inset, WebP quality 92 and alpha quality 100. The seven new files total 12906 bytes. Menu rows render artwork at 28px on the page and 24px in the desktop disclosure; the guest artwork is 36px and 28px respectively. Only configured contact rows render their assets.

Generation direction: isolated soft 3D symbols; broad rounded shapes; pearl white, satin silver and charcoal graphite; restrained depth and gloss; nearly orthographic front view; dark contours that read at 28px on a light surface. True transparency, centered framing, no background tile, floor, cast shadow, text, brand marks or bright colors. Subjects and source files follow. No image model version is asserted.

- saved.webp: One rounded pearl-silver heart with graphite bevel. 1798 bytes; SHA-256 5abb90de8207d68878f376ee83ecbbaa589814941aa11f3a5f0f12cba39f7a95.
  Original: C:/Users/radev/.codex/generated_images/01a139c5-c2c0-7880-8f7f-8aecaccb064a/exec-03230a94-c01d-4309-bf41-8b07b08d58ba.png
- sell.webp: One blank pearl-white price tag with a dark eyelet, angled gently. 1862 bytes; SHA-256 6551df3a6fe31e7ffb839d6c630f29a20c745e3d20e6ffe605f950b1d89eb2ca.
  Original: C:/Users/radev/.codex/generated_images/01a139c5-c2c0-7880-8f7f-8aecaccb064a/exec-36a50c4c-919d-46ca-8618-7bb32843aa90.png
- finance.webp: One graphite wallet with a silver clasp and one plain silver coin. 1644 bytes; SHA-256 948cb3fcdcccc4f69dbfc7d6df3f232c4a87c8098065cb629041910f48354f9d.
  Original: C:/Users/radev/.codex/generated_images/01a139c5-c2c0-7880-8f7f-8aecaccb064a/exec-4e330bd3-2227-48c3-b748-f1eb5d0c03cf.png
- location.webp: One upright pearl-silver location pin with a hollow center and graphite edge. 2162 bytes; SHA-256 7168528f6b2da072ba9192911e08a7b1f70f6bb943a2b79228f6d2dfa0d2ab37.
  Original: C:/Users/radev/.codex/generated_images/01a139c5-c2c0-7880-8f7f-8aecaccb064a/exec-295474bb-ad03-4745-8625-dfc15bf53e7c.png
- phone.webp: One broad pearl-silver telephone handset with a graphite edge. 1912 bytes; SHA-256 df77e3df82de4eb5de74df855769a4a487a8b536f8795d04c6205d5adc149e97.
  Original: C:/Users/radev/.codex/generated_images/01a139c5-c2c0-7880-8f7f-8aecaccb064a/exec-c80ef537-ce4d-4f17-bd0c-9f2bde4daa9b.png
- email.webp: One pearl-white closed envelope with a dark V-shaped seam. 1182 bytes; SHA-256 9472ed420b6ae7c23496a405f20cab8d60fb94d63ac634cd0a052fc2f7e4515c.
  Original: C:/Users/radev/.codex/generated_images/01a139c5-c2c0-7880-8f7f-8aecaccb064a/exec-201fb805-e803-4dcd-bf4e-86c934f9489a.png
- guest.webp: One abstract person bust with a featureless pearl-silver head and graphite shoulders. 2346 bytes; SHA-256 fb392825aa474333260ba2615a76d02b0dce767f892a6db2c4f16189fac98352.
  Original: C:/Users/radev/.codex/generated_images/01a139c5-c2c0-7880-8f7f-8aecaccb064a/exec-04592be2-44df-44be-a5ba-9ac1507e1c04.png

Focused local verification: EN Menu at 320x700 and 390x844, BG at 320x700, the alternative /en/2/more Menu at 320x700, and the desktop disclosure at 1440x900. All visible assets decoded; no horizontal overflow; phone row targets remain 52/53px and desktop disclosure targets 44px. Saved cars opens with Enter, Back returns to Menu, and desktop Escape closes the disclosure and restores its trigger. Scoped lint and nonincremental TypeScript no-emit checks passed. Failure fallback was source-reviewed; no network failure was simulated.

Matched before/after pairs and compact receipts are retained under runtime/mobile-spacing-20261014/menu-artwork-*. The original generations remain in the tool-managed image directory. These are implementation-stage local checks. Exact-source publication and integration evidence are recorded separately in the Cars release handoff; dealer rollout stays with the rollout owner.

