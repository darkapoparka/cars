# Range input placeholders

Removed duplicate visible From/To labels and the Any placeholder from the shared
range input. Empty inputs use localized From/To placeholders directly.

Focused preview verification on 10 October 2026:
- At 1440px all six desktop price/year/mileage inputs display От or До directly.
- Typed 10000 and 60000 into the price inputs successfully, then cleared both.
- At 320px both price inputs retain От/До and fit their fields.
- Focused ESLint and scoped git diff whitespace check passed.

Matched placeholder comparison: before-labels-desktop.jpg and after-labels-desktop.jpg.
The earlier before-desktop.jpg / after-desktop.jpg pair records the preceding gap
correction. Four captures are retained for these two related owner requests.
