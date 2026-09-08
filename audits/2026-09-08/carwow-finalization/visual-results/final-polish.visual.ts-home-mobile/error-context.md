# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: final-polish.visual.ts >> home-mobile
- Location: tests\visual\final-polish.visual.ts:23:2

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  Expected an image 390px by 2657px, received 390px by 2830px. 218875 pixels (ratio 0.20 of all image pixels) are different.

  Snapshot: home-mobile.png

Call log:
  - Expect "toHaveScreenshot(home-mobile.png)" with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - Expected an image 390px by 2657px, received 390px by 2830px. 218875 pixels (ratio 0.20 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - Expected an image 390px by 2657px, received 390px by 2830px. 218875 pixels (ratio 0.20 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - link "Към основното съдържание" [ref=e3] [cursor=pointer]:
    - /url: "#main-content"
  - generic "Day Night Auto — начало" [ref=e4]:
    - banner [ref=e5]:
      - generic [ref=e6]:
        - link "Day Night Auto home" [ref=e7] [cursor=pointer]:
          - /url: /
          - img "Day Night Auto" [ref=e8]
        - generic [ref=e9]:
          - 'button "Локация: Студентски град, София" [ref=e10] [cursor=pointer]':
            - img [ref=e11]
          - link "Обади се на Day Night Auto" [ref=e12] [cursor=pointer]:
            - /url: tel:+359877733110
            - img [ref=e13]
      - heading "Day Night Auto" [level=1] [ref=e14]
      - generic [ref=e15]:
        - generic "Избери действие" [ref=e16]:
          - button "Купи" [pressed] [ref=e17] [cursor=pointer]
          - button "Внос" [ref=e18] [cursor=pointer]
        - button "Търси марка, модел, цена…" [ref=e19] [cursor=pointer]:
          - generic [ref=e20]: Търси марка, модел, цена…
          - img [ref=e22]
        - link "Всички 40 коли" [ref=e23] [cursor=pointer]:
          - /url: /inventory
          - generic [ref=e24]: Всички 40 коли
          - img [ref=e25]
    - main [ref=e26]:
      - navigation "Бързи филтри" [ref=e27]:
        - link "Дизел" [ref=e28] [cursor=pointer]:
          - /url: /inventory?fuel=%D0%94%D0%B8%D0%B7%D0%B5%D0%BB
          - img [ref=e29]
          - generic [ref=e33]: Дизел
        - link "Бензин" [ref=e34] [cursor=pointer]:
          - /url: /inventory?fuel=%D0%91%D0%B5%D0%BD%D0%B7%D0%B8%D0%BD
          - img [ref=e35]
          - generic [ref=e39]: Бензин
        - link "Автоматик" [ref=e40] [cursor=pointer]:
          - /url: /inventory?transmission=%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D0%BA
          - img [ref=e41]
          - generic [ref=e42]: Автоматик
        - link "Електрически" [ref=e43] [cursor=pointer]:
          - /url: /inventory?fuel=%D0%95%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8
          - img [ref=e44]
          - generic [ref=e48]: Електрически
      - region "По цена" [ref=e49]:
        - generic [ref=e50]:
          - heading "По цена" [level=2] [ref=e51]
          - link "Всички" [ref=e52] [cursor=pointer]:
            - /url: /inventory
            - text: Всички
            - img [ref=e53]
        - generic [ref=e54]:
          - link "До 30 000 EUR 9 коли" [ref=e55] [cursor=pointer]:
            - /url: /inventory?price=under-30000
            - generic [ref=e57]:
              - strong [ref=e58]: До 30 000 EUR
              - generic [ref=e59]: 9 коли
          - link "До 50 000 EUR 18 коли" [ref=e60] [cursor=pointer]:
            - /url: /inventory?price=under-50000
            - generic [ref=e62]:
              - strong [ref=e63]: До 50 000 EUR
              - generic [ref=e64]: 18 коли
          - link "Над 50 000 EUR 22 коли" [ref=e65] [cursor=pointer]:
            - /url: /inventory?price=over-50000
            - generic [ref=e67]:
              - strong [ref=e68]: Над 50 000 EUR
              - generic [ref=e69]: 22 коли
          - link "Без бюджет Всички 40 коли" [ref=e70] [cursor=pointer]:
            - /url: /inventory
            - generic [ref=e72]:
              - strong [ref=e73]: Без бюджет
              - generic [ref=e74]: Всички 40 коли
          - link "До 10 000 EUR 0 коли" [ref=e75] [cursor=pointer]:
            - /url: /inventory?price=under-10000
            - generic [ref=e77]:
              - strong [ref=e78]: До 10 000 EUR
              - generic [ref=e79]: 0 коли
          - link "До 20 000 EUR 0 коли" [ref=e80] [cursor=pointer]:
            - /url: /inventory?price=under-20000
            - generic [ref=e82]:
              - strong [ref=e83]: До 20 000 EUR
              - generic [ref=e84]: 0 коли
      - region "Избрани" [ref=e85]:
        - generic [ref=e86]:
          - heading "Избрани" [level=2] [ref=e87]
          - link "Всички" [ref=e88] [cursor=pointer]:
            - /url: /inventory
            - text: Всички
            - img [ref=e89]
        - generic [ref=e90]:
          - article [ref=e91]:
            - link "Lamborghini Urus Наличен Lamborghini Urus 2021 · Бензин · 86 000 км 172 669 €" [ref=e92] [cursor=pointer]:
              - /url: /inventory/lamborghini-urus-775312
              - generic [ref=e93]:
                - img "Lamborghini Urus" [ref=e94]
                - generic [ref=e95]: Наличен
              - generic [ref=e96]:
                - generic [ref=e97]: Lamborghini
                - strong [ref=e98]: Urus
                - generic [ref=e99]: 2021 · Бензин · 86 000 км
              - generic [ref=e100]:
                - generic [ref=e101]: 172 669 €
                - img [ref=e103]
            - generic "Действия за автомобила" [ref=e104]:
              - button "Добави Lamborghini Urus за сравнение" [ref=e105] [cursor=pointer]:
                - img [ref=e106]
              - button "Добави Lamborghini Urus в любими" [ref=e107] [cursor=pointer]:
                - img [ref=e108]
          - article [ref=e109]:
            - link "Mercedes-Benz S 63 AMG Наличен Mercedes-Benz S 63 AMG 2024 · Бензин · 30 000 км 143 699 €" [ref=e110] [cursor=pointer]:
              - /url: /inventory/mercedes-benz-s-63-amg-841845
              - generic [ref=e111]:
                - img "Mercedes-Benz S 63 AMG" [ref=e112]
                - generic [ref=e113]: Наличен
              - generic [ref=e114]:
                - generic [ref=e115]: Mercedes-Benz
                - strong [ref=e116]: S 63 AMG
                - generic [ref=e117]: 2024 · Бензин · 30 000 км
              - generic [ref=e118]:
                - generic [ref=e119]: 143 699 €
                - img [ref=e121]
            - generic "Действия за автомобила" [ref=e122]:
              - button "Добави Mercedes-Benz S 63 AMG за сравнение" [ref=e123] [cursor=pointer]:
                - img [ref=e124]
              - button "Добави Mercedes-Benz S 63 AMG в любими" [ref=e125] [cursor=pointer]:
                - img [ref=e126]
          - article [ref=e127]:
            - link "Mercedes-Benz AMG GT S Наличен Mercedes-Benz AMG GT S 2017 · Бензин · 70 000 км 88 699 €" [ref=e128] [cursor=pointer]:
              - /url: /inventory/mercedes-benz-amg-gt-s-698048
              - generic [ref=e129]:
                - img "Mercedes-Benz AMG GT S" [ref=e130]
                - generic [ref=e131]: Наличен
              - generic [ref=e132]:
                - generic [ref=e133]: Mercedes-Benz
                - strong [ref=e134]: AMG GT S
                - generic [ref=e135]: 2017 · Бензин · 70 000 км
              - generic [ref=e136]:
                - generic [ref=e137]: 88 699 €
                - img [ref=e139]
            - generic "Действия за автомобила" [ref=e140]:
              - button "Добави Mercedes-Benz AMG GT S за сравнение" [ref=e141] [cursor=pointer]:
                - img [ref=e142]
              - button "Добави Mercedes-Benz AMG GT S в любими" [ref=e143] [cursor=pointer]:
                - img [ref=e144]
          - article [ref=e145]:
            - link "Mercedes-Benz S 580 Очакван внос Mercedes-Benz S 580 2022 · Бензин · 72 000 км 86 699 €" [ref=e146] [cursor=pointer]:
              - /url: /inventory/mercedes-benz-s-580-689775
              - generic [ref=e147]:
                - img "Mercedes-Benz S 580" [ref=e148]
                - generic [ref=e149]: Очакван внос
              - generic [ref=e150]:
                - generic [ref=e151]: Mercedes-Benz
                - strong [ref=e152]: S 580
                - generic [ref=e153]: 2022 · Бензин · 72 000 км
              - generic [ref=e154]:
                - generic [ref=e155]: 86 699 €
                - img [ref=e157]
            - generic "Действия за автомобила" [ref=e158]:
              - button "Добави Mercedes-Benz S 580 за сравнение" [ref=e159] [cursor=pointer]:
                - img [ref=e160]
              - button "Добави Mercedes-Benz S 580 в любими" [ref=e161] [cursor=pointer]:
                - img [ref=e162]
      - region "Марки" [ref=e163]:
        - generic [ref=e164]:
          - heading "Марки" [level=2] [ref=e165]
          - link "Всички" [ref=e166] [cursor=pointer]:
            - /url: /inventory
            - text: Всички
            - img [ref=e167]
        - generic [ref=e168]:
          - link "BMW 8 автомобила" [ref=e169] [cursor=pointer]:
            - /url: /inventory?brand=BMW
            - generic [ref=e171]:
              - generic [ref=e172]: BMW
              - generic [ref=e173]: 8 автомобила
          - link "Mercedes 23 автомобила" [ref=e174] [cursor=pointer]:
            - /url: /inventory?brand=Mercedes-Benz
            - generic [ref=e176]:
              - generic [ref=e177]: Mercedes
              - generic [ref=e178]: 23 автомобила
          - link "Audi 7 автомобила" [ref=e179] [cursor=pointer]:
            - /url: /inventory?brand=Audi
            - generic [ref=e181]:
              - generic [ref=e182]: Audi
              - generic [ref=e183]: 7 автомобила
          - link "Porsche Внос по заявка" [ref=e184] [cursor=pointer]:
            - /url: /inventory?brand=Porsche
            - generic [ref=e186]:
              - generic [ref=e187]: Porsche
              - generic [ref=e188]: Внос по заявка
          - link "Mazda Внос по заявка" [ref=e189] [cursor=pointer]:
            - /url: /inventory?brand=Mazda
            - generic [ref=e191]:
              - generic [ref=e192]: Mazda
              - generic [ref=e193]: Внос по заявка
          - link "Honda Внос по заявка" [ref=e194] [cursor=pointer]:
            - /url: /inventory?brand=Honda
            - generic [ref=e196]:
              - generic [ref=e197]: Honda
              - generic [ref=e198]: Внос по заявка
          - link "Toyota Внос по заявка" [ref=e199] [cursor=pointer]:
            - /url: /inventory?brand=Toyota
            - generic [ref=e201]:
              - generic [ref=e202]: Toyota
              - generic [ref=e203]: Внос по заявка
          - link "Volvo Внос по заявка" [ref=e204] [cursor=pointer]:
            - /url: /inventory?brand=Volvo
            - generic [ref=e206]:
              - generic [ref=e207]: Volvo
              - generic [ref=e208]: Внос по заявка
          - link "Ford Внос по заявка" [ref=e209] [cursor=pointer]:
            - /url: /inventory?brand=Ford
            - generic [ref=e211]:
              - generic [ref=e212]: Ford
              - generic [ref=e213]: Внос по заявка
          - link "Hyundai Внос по заявка" [ref=e214] [cursor=pointer]:
            - /url: /inventory?brand=Hyundai
            - generic [ref=e216]:
              - generic [ref=e217]: Hyundai
              - generic [ref=e218]: Внос по заявка
          - link "Tesla Внос по заявка" [ref=e219] [cursor=pointer]:
            - /url: /inventory?brand=Tesla
            - generic [ref=e221]:
              - generic [ref=e222]: Tesla
              - generic [ref=e223]: Внос по заявка
          - link "Всички марки" [ref=e224] [cursor=pointer]:
            - /url: /inventory
            - img [ref=e226]
            - generic [ref=e227]: Всички марки
      - region "По тип" [ref=e228]:
        - generic [ref=e229]:
          - heading "По тип" [level=2] [ref=e230]
          - link "Всички" [ref=e231] [cursor=pointer]:
            - /url: /inventory
            - text: Всички
            - img [ref=e232]
        - generic [ref=e233]:
          - link "Джип 18 коли" [ref=e234] [cursor=pointer]:
            - /url: /inventory?body=%D0%94%D0%B6%D0%B8%D0%BF
            - generic [ref=e236]:
              - generic [ref=e237]: Джип
              - generic [ref=e238]: 18 коли
          - link "Седан 17 коли" [ref=e239] [cursor=pointer]:
            - /url: /inventory?body=%D0%A1%D0%B5%D0%B4%D0%B0%D0%BD
            - generic [ref=e241]:
              - generic [ref=e242]: Седан
              - generic [ref=e243]: 17 коли
      - region "Призив за действие" [ref=e244]:
        - generic [ref=e245]:
          - generic [ref=e246]:
            - strong [ref=e247]: 40 обяви · Оглед в София
            - generic [ref=e248]: Финансиране · бартер · съдействие с документите
          - generic [ref=e249]:
            - link "Всички автомобили" [ref=e250] [cursor=pointer]:
              - /url: /inventory
            - link "Обади се" [ref=e251] [cursor=pointer]:
              - /url: tel:+359877733110
        - generic [ref=e252]:
          - generic [ref=e253]: Проверени коли
          - generic [ref=e254]: В София
          - generic [ref=e255]: Оглед по уговорка
    - contentinfo [ref=e256]:
      - generic [ref=e257]:
        - img "DAY NIGHT AUTO GROUP" [ref=e258]
        - paragraph [ref=e259]: Автокъща в София с подбрани употребявани автомобили. Съдействие за документи, регистрация, финансиране и доставка.
      - navigation "Социални канали и обяви" [ref=e260]:
        - link "Facebook" [ref=e261] [cursor=pointer]:
          - /url: https://www.facebook.com/61566304063141/
          - img [ref=e262]
        - link "Instagram" [ref=e264] [cursor=pointer]:
          - /url: https://www.instagram.com/daynight.auto.plovdiv/
          - img [ref=e265]
        - link "Виж наличните автомобили в mobile.bg" [ref=e269] [cursor=pointer]:
          - /url: https://daynight.mobile.bg/
          - img [ref=e270]
      - generic [ref=e274]:
        - link "0877 733 110 Обаждане / Viber" [ref=e275] [cursor=pointer]:
          - /url: tel:+359877733110
          - strong [ref=e276]: 0877 733 110
          - generic [ref=e277]: Обаждане / Viber
        - link "гр. София, Студентски град, ул. Атанас Манчев 18" [ref=e278] [cursor=pointer]:
          - /url: https://www.google.com/maps/search/?api=1&query=%D0%B3%D1%80.%20%D0%A1%D0%BE%D1%84%D0%B8%D1%8F%2C%20%D0%A1%D1%82%D1%83%D0%B4%D0%B5%D0%BD%D1%82%D1%81%D0%BA%D0%B8%20%D0%B3%D1%80%D0%B0%D0%B4%2C%20%D1%83%D0%BB.%20%D0%90%D1%82%D0%B0%D0%BD%D0%B0%D1%81%20%D0%9C%D0%B0%D0%BD%D1%87%D0%B5%D0%B2%2018
      - generic [ref=e279]: © 2026 Day Night Auto София. Всички права запазени.
    - navigation "Основни действия" [ref=e280]:
      - link "Начало" [ref=e281] [cursor=pointer]:
        - /url: /
        - img [ref=e283]
        - generic [ref=e284]: Начало
      - link "Коли" [ref=e285] [cursor=pointer]:
        - /url: /inventory
        - img [ref=e287]
        - generic [ref=e288]: Коли
      - link "Продай" [ref=e289] [cursor=pointer]:
        - /url: /sell-your-car
        - img [ref=e291]
        - generic [ref=e292]: Продай
      - link "Внос" [ref=e293] [cursor=pointer]:
        - /url: /contact?intent=import
        - img [ref=e295]
        - generic [ref=e296]: Внос
      - button "Меню" [ref=e297] [cursor=pointer]:
        - img [ref=e299]
        - generic [ref=e300]: Меню
  - button "Отвори чат с екипа" [ref=e301] [cursor=pointer]:
    - img [ref=e302]
    - generic [ref=e304]: Чат с екипа
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test';
  2  | 
  3  | const visualCases = [
  4  | 	{ name: 'home-mobile', path: '/', width: 390, height: 900 },
  5  | 	{ name: 'inventory-mobile', path: '/inventory', width: 390, height: 900 },
  6  | 	{
  7  | 		name: 'detail-mobile',
  8  | 		path: '/inventory/mercedes-benz-gla-45-amg-405323',
  9  | 		width: 390,
  10 | 		height: 900
  11 | 	},
  12 | 	{ name: 'home-desktop', path: '/', width: 1440, height: 900 },
  13 | 	{ name: 'inventory-desktop', path: '/inventory', width: 1440, height: 900 },
  14 | 	{
  15 | 		name: 'detail-desktop',
  16 | 		path: '/inventory/mercedes-benz-gla-45-amg-405323',
  17 | 		width: 1440,
  18 | 		height: 900
  19 | 	}
  20 | ] as const;
  21 | 
  22 | for (const visualCase of visualCases) {
  23 | 	test(visualCase.name, async ({ page }) => {
  24 | 		await page.setViewportSize({ width: visualCase.width, height: visualCase.height });
  25 | 		await page.goto(visualCase.path, { waitUntil: 'networkidle' });
> 26 | 		await expect(page).toHaveScreenshot(`${visualCase.name}.png`, { fullPage: true });
     |                      ^ Error: expect(page).toHaveScreenshot(expected) failed
  27 | 	});
  28 | }
  29 | 
```