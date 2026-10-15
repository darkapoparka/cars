# App dock artwork trial

Local visual candidate requested on 14 October 2026. Four Image Gen assets were first tested in the dock of the maintained App preview. The Menu subsequently reuses the car and service artwork alongside its matching assets, documented in [Menu artwork](MENU-ARTWORK.md). Other ShowroomIcon consumers retain their existing Lucide icons. The previous Phosphor dock family remains available through dockArtwork={false}.

The shared generation prompt calls for isolated, front-dominant soft 3D navigation symbols readable at 28 CSS pixels: broad rounded shapes, pearl white and satin silver surfaces, charcoal graphite edges, low gloss, high contrast on white and true transparency. No background tile, exterior shadow, lettering or logos. Subjects: a compact house, a front-view unbranded silver car, one diagonal spanner and three equal rounded menu bars. The first car output contained a baked checkerboard; an Image Gen edit removed it while preserving the car. Original generations remain in the tool-managed directory.

Web delivery uses alpha-bounds framing with a 4px transparent inset, 64x64 WebP, quality 92 and full alpha quality. The four assets total 7834 bytes. They display at 28x28 inside the existing 44x44 links. Inactive artwork opacity is 0.85, active artwork is full opacity within the existing selected pill.

- home.webp: 2100 bytes; SHA-256 86499b73cb340f82d3e15233b65b17e84c4c701a8433414dff173d9adc0aefad; original C:/Users/radev/.codex/generated_images/01a139c5-c2c0-7880-8f7f-8aecaccb064a/exec-8e4ff640-3485-4352-97af-4e61b17f5226.png
- cars.webp: 2092 bytes; SHA-256 2f998d5eabe6321e6a1dc837b4afc80fbd86d174ba8b00bc1a205d7fbcee60e3; original C:/Users/radev/.codex/generated_images/01a139c5-c2c0-7880-8f7f-8aecaccb064a/exec-b64313bd-5b6f-404d-be20-532d54d5676b.png
- service.webp: 2102 bytes; SHA-256 53b93965e2c25f21b4f7d2a58bafdad5a2b2ec42bf3d8d4278c3cde1ecd4e924; original C:/Users/radev/.codex/generated_images/01a139c5-c2c0-7880-8f7f-8aecaccb064a/exec-094d278b-b358-4fc6-8ae9-b955ec2f97c6.png
- more.webp: 1540 bytes; SHA-256 4970e5b97c5e78f2178a380c3aac5dcbd9e9f91172cca426c513aa739042041d; original C:/Users/radev/.codex/generated_images/01a139c5-c2c0-7880-8f7f-8aecaccb064a/exec-1fdd7a18-4d53-4d40-98bb-f78b1b648a89.png

The bounded runtime record is runtime/mobile-spacing-20261014/dock-artwork-assets.json. Matched Home 390px and Menu 320px comparisons, route/locale checks and source receipt are retained there. The owner selected this artwork family for the final App template on 14 October. Exact-source publication and integration evidence are recorded separately in the Cars release handoff.

