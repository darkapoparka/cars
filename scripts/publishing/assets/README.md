# Shared feature artwork

`feature-assistant.webp` is the compact AI-row mascot generated with Image Gen using the existing Modern Agency `public/brand/studio-assistant.webp` as its visual reference. The original generated PNG remains in the tool's generated-images directory; this optimized delivery asset is 64x64, 2,944 bytes, with transparency.

`feature-vehicle.webp` is an Image Gen car asset for the Vehicles row: 64x64, 3,034 bytes, with transparency. Its compact front view uses a pearl-white body and blue/navy details to fit the other 3D artwork and fill the small display area more clearly.

`feature-enquiries.webp`, `feature-viewings.webp`, `feature-editing.webp` and `feature-analytics.webp` were generated with Image Gen using a shared pearl-white, cobalt-blue and navy treatment. Each delivery asset is 64x64 with transparency.

The proposal appender embeds all six WebPs in the selector as data URLs. They are displayed at 28x28, and the complete set contains 15,174 bytes of WebP image data. No separate image requests are required. The wider artwork column uses a smaller gap so the titles and descriptions retain their existing left edge and available width.
