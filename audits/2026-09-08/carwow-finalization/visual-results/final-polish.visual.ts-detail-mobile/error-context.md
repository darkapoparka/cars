# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: final-polish.visual.ts >> detail-mobile
- Location: tests\visual\final-polish.visual.ts:23:2

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  Expected an image 390px by 900px, received 390px by 1048px. 156213 pixels (ratio 0.39 of all image pixels) are different.

  Snapshot: detail-mobile.png

Call log:
  - Expect "toHaveScreenshot(detail-mobile.png)" with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - Expected an image 390px by 900px, received 390px by 1048px. 18590 pixels (ratio 0.05 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 140592 pixels (ratio 0.35 of all image pixels) are different.
  - waiting 250ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - Expected an image 390px by 900px, received 390px by 1048px. 156213 pixels (ratio 0.39 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - link "Към основното съдържание" [ref=e3] [cursor=pointer]:
    - /url: "#main-content"
  - main "Детайли за автомобил" [ref=e4]:
    - region "Основна снимка" [ref=e5]:
      - img "Mercedes-Benz GLA 45 AMG" [ref=e6]
      - generic:
        - link "Назад към автомобили" [ref=e7] [cursor=pointer]:
          - /url: /inventory
          - img [ref=e8]
        - generic:
          - button "Запази" [ref=e9] [cursor=pointer]:
            - img [ref=e10]
          - button "Добави за сравнение" [ref=e11] [cursor=pointer]:
            - img [ref=e12]
          - button "Сподели" [ref=e13] [cursor=pointer]:
            - img [ref=e14]
    - dialog "Информация за автомобила" [ref=e15]:
      - generic [ref=e19]:
        - generic [ref=e20]: Mercedes-Benz
        - generic [ref=e21]: Финансиране по запитване
        - heading "Mercedes-Benz GLA 45 AMG" [level=1] [ref=e22]
        - generic [ref=e23]:
          - strong [ref=e24]: 26 699 €
          - generic [ref=e25]: 52 218.71 лв.
      - generic [ref=e26]:
        - link "Обади се" [ref=e27] [cursor=pointer]:
          - /url: tel:+359877733110
          - img [ref=e28]
          - text: Обади се
        - link "Viber" [ref=e29] [cursor=pointer]:
          - /url: viber://chat?number=%2B359877733110
          - img [ref=e30]
          - text: Viber
      - tablist "Детайли" [ref=e37]:
        - tab "Инфо" [selected] [ref=e38] [cursor=pointer]:
          - generic [ref=e39]: Инфо
        - tab "Данни" [ref=e40] [cursor=pointer]:
          - generic [ref=e41]: Данни
        - tab "Екстри" [ref=e42] [cursor=pointer]:
          - generic [ref=e43]: Екстри
      - tabpanel "Инфо" [ref=e44]:
        - generic [ref=e45]:
          - heading "Описание" [level=2] [ref=e46]
          - paragraph [ref=e47]: Очакван внос — свържете се за актуален срок и условия.
          - paragraph [ref=e48]: Mercedes-Benz GLA 45 AMG, 2016 г., бензин, 170 000 км, 370 к.с., автоматик. Очакван внос — свържете се за актуален срок и условия.
        - generic [ref=e49]:
          - strong [ref=e50]: Day Night Auto предлага
          - list [ref=e51]:
            - listitem [ref=e52]: Финансиране и лизинг
            - listitem [ref=e53]: Бартер и замяна
            - listitem [ref=e54]: Съдействие с документите
            - listitem [ref=e55]: Оглед в София
        - link "Day Night Auto Day Night Auto Group, София, България" [ref=e56] [cursor=pointer]:
          - /url: /contact
          - img [ref=e57]
          - generic [ref=e58]:
            - strong [ref=e59]: Day Night Auto
            - generic [ref=e60]: Day Night Auto Group, София, България
  - button "Отвори чат с екипа" [ref=e61] [cursor=pointer]:
    - img [ref=e62]
    - generic [ref=e64]: Чат с екипа
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