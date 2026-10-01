# Right-column card correction - 1 October 2026

The owner rejected moving the facts below the image and requested larger car photography. This supersedes the full-width fact-row composition in ../card-row-final-2026-10-01/.

Reference inspected read-only: L:/cars-app/reference/runtime/cars24-results-current-small.jpg and L:/cars-app/components/VehicleCard.tsx. The original Cars24 capture uses a landscape photo, regular title and a fact strip below the main photo/details row. The retained implementation has a 134x76px mobile image and a 15px/400 title. The requested right-side facts are an adaptation, not a claim of exact Cars24 parity.

The revised card gives the image 44% of the mobile content width, with the photo spanning the text-column height. Facts stay on the right in two deliberate rows: mileage/transmission, then equipment. Automatic transmission uses the compact Auto / Автоматик label; its full localized label remains in the title attribute. Titles stay at 15px/400; prices retain 20px/700 and the euro symbol. The compact 44px search is unchanged.

Canonical source is templates/app, mirrored into the existing local Navara App copy. No dealer fleet release or hosted deployment is included.

Verification: npm run check passed for master and Navara using Node 22.20.0 / .next-card-right-check. All nine Navara cards at 320 and 390px have two fact rows, no clipped text, 145px overall height and a 123px-tall photo (about 114px wide at 320). All 48 master cards have no badge overflow at 320px; desktop 1440px has no page or badge overflow. Screenshots and verification-320.json are retained here.
