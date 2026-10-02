# Care and finance refinement — 2 October 2026

Local App master preview at http://127.0.0.1:6483. This follows the owner's feedback about the oversized Car care campaign, service instructions that looked clickable, and the inline finance calculator.

## Changes

- Car care uses a short heading, one sentence and a white action. Its height follows the content: 160px at 320px and 390px, and 184px at 1440px. The retained scene stays proportional at the right; the redundant brand eyebrow and square frame are removed.
- Service instructions are a semantic ordered list with visible 01–06 numbers, 18px titles and 15px descriptions. Phone, tablet and desktop show one, two and three columns respectively. The list contains no interactive controls, card borders or decorative photos.
- Finance has a compact charcoal calculator button with a white Calculate pill. It opens a bottom sheet on phones and a centered 560px dialog on wider screens. The monthly estimate is prominent; labels use 14px and editable fields use 16px.
- Closing and reopening preserves inputs. The shared modal boundary handles focus, keyboard trapping, Escape, Back and background isolation. Backdrop dismissal uses the click event so focus returns after native mouse focus has settled. The focus trap now includes disclosure summaries.
- The secondary finance campaign follows its content height and uses the short Ask us action. The vehicle-price sheet retains the same embedded calculator and domain calculation.

## Verification

Rendered Bulgarian Service and Finance at 320px, 390px, 820px and 1440px. English Service and Finance were checked at 320px. The calculator also passed the 320×480 short-screen check: its body scrolls while the close action remains visible. No horizontal page overflow or broken visible images were observed. See verification.json and the retained final screenshots.

The calculator updated from €396/month for €25,000, 20% deposit, 7% annual interest and five years to €732/month for €30,000, 21% deposit and three years. Setting interest to zero produced €658/month and a €30,000 total including the deposit. Back, Escape, close and backdrop dismissal restored the finance page; entered values persisted on reopening. Tab and Shift+Tab wrapped between close and About this estimate. Background controls were inert while open and restored on dismissal. Backdrop dismissal retained the page scroll position and returned focus to the opener.

The Car care action reached /bg/service/details and its existing enquiry-draft form.

npm run check passed using Node 22.20.0 with NEXT_DIST_DIR=.next-build-check, keeping the active development output separate. This runs ESLint, TypeScript and the optimized webpack build. workspace-doctor.mjs --fetch confirmed Cars main had no fetched upstream drift; unrelated dealer/template and Admin work was preserved.

This evidence covers the local template and affected interactions. Deployment, client refresh and owner visual acceptance remain separate records.
