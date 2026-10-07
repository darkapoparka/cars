# Karento Best photographic process

Owner requested on 6 October 2026: replace the original How It Works icons with image-generated artwork matching the Services photography at http://127.0.0.1:6474/services.

Four separate images were generated with image_gen, using the Mobile template's sell-20261006.webp and sourcing-20261006.webp as visual references. They form a consistent graphite-car/glass-showroom series. The source images and reference project were not edited.

| Step | Scene | Destination |
| --- | --- | --- |
| Find your car | Showroom vehicle selection with a tablet in the foreground | /vehicles |
| Talk with us | Consultation desk, phone, notebook and anonymous hands | /contact |
| View & test drive | Customer wearing a seatbelt, hands on the wheel, viewed through the driver's window | /contact |
| Make it yours | Key handover beside the vehicle | /contact |

Text and step numbers are HTML, not baked into the photographs. Captions describe the proposed dealer journey without asserting a completed purchase or booked appointment. Assets are decorative in the numbered list; link labels provide the step names.

The website uses four centered cards on desktop and two columns on mobile. Generated original PNGs remain in the Codex generated-images directory. WebP encoding preserves the original dimensions and composition; no cropping or resizing was applied. File hashes, paths and byte sizes are in [how-it-works-assets.json](how-it-works-assets.json).

The owner found the first set too repetitive and asked for a person driving or beside the car. The test-drive scene was regenerated around a clearly visible customer behind the wheel. This revision uses a new immutable asset URL, view-20261006-v2.webp; the original open-door photograph and its receipt remain preserved. The other three photos are unchanged. This is a proposed photographic direction, not an owner-approved final artwork set.

Assets live under templates/karento-best/src/lib/server/assets/how-it-works/ and are bundled by the derivative's image endpoint. They do not add files to the original Karento capture. Unknown image names return 404.

The original icon-based section remains in the preserved Karento reference. Karento Best's Home 3 composition replaces it with the new dealer process, preserving the rest of the selected homepage.

## Generation scenes

### choose

A premium graphite grey modern sedan, unbranded, front three-quarter view centered inside a bright contemporary glass dealership, two other vehicles subtly blurred in background. A tablet displaying a small car photo rests unobtrusively in the foreground, conveying browsing and choosing a vehicle. The car is the hero.

### talk

Close-up editorial still life on a clean dealership consultation desk: a modern smartphone beside a small notebook and pen, with a premium graphite grey sedan softly visible behind floor-to-ceiling showroom glass. Two adult people represented only by natural hands gesturing across the desk, no faces, no signatures, no contract or transaction. The setting conveys an approachable conversation about a car.

### view

A relaxed adult customer in a neutral shirt, seated in a graphite-grey sedan, seatbelt across torso, hands on the steering wheel and looking forward. Medium close side view through the open driver's window, with a softly blurred dealership and trees behind. The customer's profile, hands and wheel are the central subjects so the scene reads at small card sizes. The first open-door photograph supplied the palette and daylight reference; the composition was replaced using image_gen.

### collect

A premium automotive key fob held by one adult hand being offered toward another adult hand in the foreground, fingers anatomically natural. A premium graphite grey modern sedan softly behind them on a clean dealership forecourt. Key handover conveys collecting the car, warm understated sunlight and a modern glass showroom. No visible faces, no badges or logos.
