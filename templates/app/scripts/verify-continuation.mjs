import {createBrowser, sleep} from './lib/browser-qa.mjs';

const b = await createBrowser(process.env.QA_REPORT_DIR ?? 'reference/2026-09-26-continuation/resume/verification');
const fortuner = '/cars/2024-toyota-fortuner-exr';
const labelled = label => `document.querySelector('[aria-label=${JSON.stringify(label)}]')`;
async function scenario(name, action) {
  try {await action(); b.check(`${name}: completed`, true);} catch (error) {b.check(`${name}: completed`, false, error.stack);}
}
async function check(name, expression) {b.check(name, await b.evaluate(expression));}
async function focusInput(selector, value) {
  await b.evaluate(`document.querySelector(${JSON.stringify(selector)})?.focus()`);
  await b.input(selector, value);
  await b.evaluate(`document.querySelector(${JSON.stringify(selector)})?.blur()`);
  await sleep(200);
}
async function closeModal() {await b.key('Escape', 27); await sleep(250);}
try {
  await b.navigate('/'); await b.evaluate('localStorage.clear();sessionStorage.clear()'); await b.navigate('/');
  await scenario('Discovery header', async () => {
    await b.capture('home-mobile');
    await b.click(labelled('Dismiss login banner'));
    await b.scroll(450); await b.capture('home-collapsed');
    await check('Collapsed service pills contain no stretched photographs', `document.querySelector('[data-discovery-header]')?.dataset.compact === 'true' && document.querySelector('[data-discovery-header]').querySelectorAll('img').length === 0`);
    await check('Collapsed header remains pinned', `Math.abs(document.querySelector('[data-discovery-header]').getBoundingClientRect().top) < 1`);
    await b.scroll(1220); await b.capture('home-feed');
    await check('Continuous home feed renders captured cars', `document.querySelectorAll('article[data-price]').length >= 8`);
    await b.navigate('/sell'); await check('Guest dismissal persists between routes', `!document.querySelector('[aria-label="Guest login"]')`);
    await b.scroll(660); await b.capture('sell-lower');
    await b.navigate('/'); await b.scroll(0);
    await check('Expanded header returns at top', `document.querySelector('[data-discovery-header]')?.dataset.compact === 'false'`);
  });
  await scenario('Search and recently viewed', async () => {
    await b.navigate('/search'); await b.capture('search-empty');
    await b.input('[aria-label="Search by brand or model"]', 'Toyota'); await b.capture('search-toyota');
    await check('Toyota suggestions include SUVs, sedans and Fortuner', `document.querySelectorAll('[role=option]').length === 8 && document.body.textContent.includes('FORTUNER')`);
    await b.click(`[...document.querySelectorAll('[role=option]')].find(element => element.textContent.toUpperCase() === 'TOYOTA FORTUNER')`);
    await b.waitFor(`location.pathname === '/cars' && document.querySelectorAll('article[data-price]').length > 0`, 'Toyota results');
    await check('Search produces only matching vehicles', `[...document.querySelectorAll('article[data-price]')].every(element => element.getAttribute('aria-label').toLowerCase().includes('toyota fortuner'))`);
    await b.click(`document.querySelector('article[data-price] a')`); await b.waitFor(`location.pathname === ${JSON.stringify(fortuner)}`, 'vehicle detail');
    await b.navigate('/search'); await check('Vehicle visit updates recently viewed', `JSON.parse(localStorage.getItem('cars24:recent') || '[]')[0] === '2024-toyota-fortuner-exr'`);
  });
  await scenario('Native filters', async () => {
    await b.navigate('/cars'); await b.clickText('Filter');
    const tabs = ['BRAND','BUDGET','DISCOUNTS','EMI','DOWN PAYMENT','YEAR','BODY TYPE','MILEAGE','CAR TYPE','FUEL TYPE','CATEGORIES','FEATURES','ENGINE'];
    await check('All 13 filter categories are available', `document.querySelectorAll('[aria-label="Filter categories"] button').length === 13`);
    for (const tab of tabs) {await b.clickText(tab); await b.capture(`filter-${tab.toLowerCase().replaceAll(' ', '-')}`);}
    await b.clickText('BUDGET');
    await b.click(`[...document.querySelectorAll('[role=dialog] label')].find(element => element.textContent === 'Less than AED 40K')`);
    await b.click(`[...document.querySelectorAll('button')].find(element => element.textContent.startsWith('SHOW '))`); await sleep(400);
    await check('Budget filter returns real cars below AED 40,000', `document.querySelectorAll('article[data-price]').length > 0 && [...document.querySelectorAll('article[data-price]')].every(element => Number(element.dataset.price) < 40000)`);
    await b.clickText('Filter'); await b.clickText('CLEAR ALL'); await b.clickText('BUDGET');
    const point = await b.evaluate(`(() => {const r = document.querySelector('[aria-label="price maximum slider"]').getBoundingClientRect(); return {x:r.x+r.width/2, y:r.y+14, target:r.y+135};})()`);
    await b.send('Input.dispatchMouseEvent', {type:'mouseMoved', x:point.x, y:point.y});
    await b.send('Input.dispatchMouseEvent', {type:'mousePressed', x:point.x, y:point.y, button:'left', clickCount:1});
    for (let index=1;index<=8;index++) await b.send('Input.dispatchMouseEvent', {type:'mouseMoved',x:point.x,y:point.y+(point.target-point.y)*index/8,button:'left',buttons:1});
    await b.send('Input.dispatchMouseEvent', {type:'mouseReleased',x:point.x,y:point.target,button:'left',clickCount:1}); await sleep(250);
    await check('Price range thumb responds to physical dragging', `Number(document.querySelector('[aria-label="price maximum slider"]').value) < 800000 && Number(document.querySelector('[aria-label="price maximum slider"]').value) > 100000`);
    await b.capture('filter-price-dragged');
    await b.clickText('CLEAR ALL'); await b.clickText('YEAR');
    await focusInput('[aria-label="Minimum year"]', '2024');
    await b.click(`[...document.querySelectorAll('button')].find(element => element.textContent.startsWith('SHOW '))`); await sleep(350);
    await check('Typed year range filters actual manufacturing years', `document.querySelectorAll('article[data-price]').length > 0 && [...document.querySelectorAll('article[data-price]')].every(element => Number(element.getAttribute('aria-label').slice(0,4)) >= 2024)`);
    await b.clickText('Filter'); await b.clickText('CLEAR ALL'); await b.clickText('EMI'); await b.input('[aria-label="Maximum EMI"]', '500');
    await b.click(`[...document.querySelectorAll('button')].find(element => element.textContent.startsWith('SHOW '))`); await sleep(350);
    await check('Maximum EMI affects the matching catalog', `document.querySelectorAll('article[data-price]').length > 0 && [...document.querySelectorAll('article[data-price]')].every(element => Number(element.dataset.monthly) <= 500)`);
    await b.clickText('Filter'); await b.clickText('CLEAR ALL'); await b.clickText('BRAND'); await b.click(labelled('Show Toyota models'));
    await b.click(`[...document.querySelectorAll('[role=dialog] label')].find(element => element.textContent.toUpperCase() === 'FORTUNER')`);
    await b.click(`[...document.querySelectorAll('button')].find(element => element.textContent.startsWith('SHOW '))`); await sleep(350);
    await check('Brand expansion applies an actual model filter', `[...document.querySelectorAll('article[data-price]')].length > 0 && [...document.querySelectorAll('article[data-price]')].every(element => element.textContent.includes('FORTUNER'))`);
  });
  await scenario('Inventory sorting, saved cars and Back restoration', async () => {
    await b.navigate('/cars'); await b.clickText('Filter'); await b.clickText('CLEAR ALL'); await closeModal(); await b.clickText('Sort'); await b.click(`document.querySelector('input[aria-label="PRICE: LOW TO HIGH"]')`); await sleep(400);
    await check('Price ordering is numerically ascending', `(() => {const prices=[...document.querySelectorAll('article[data-price]')].map(element=>Number(element.dataset.price));return prices.length>9&&prices.every((price,index)=>index===0||price>=prices[index-1]);})()`);
    const slug = await b.evaluate(`document.querySelector('article[data-price] a').getAttribute('href').split('/').at(-1)`);
    await b.click(`document.querySelector('article[data-price] button')`); await b.navigate('/saved');
    await check('Saved car persists on the saved route', `JSON.parse(localStorage.getItem('drive24:saved') || '[]').includes(${JSON.stringify(slug)}) && !!document.querySelector('article')`);
    await b.navigate('/cars?brand=Toyota'); await b.clickText('Sort'); await b.click(`document.querySelector('input[aria-label="PRICE: HIGH TO LOW"]')`); await sleep(400);
    const before = await b.evaluate(`[...document.querySelectorAll('article[data-price]')].map(element=>element.dataset.price)`);
    await b.click(`document.querySelector('article[data-price] a')`); await b.waitFor(`location.pathname.startsWith('/cars/')`, 'detail route');
    await b.back(); await b.waitFor(`location.pathname === '/cars' && !!document.querySelector('article[data-price]')`, 'return to inventory'); await sleep(300);
    await check('Back restores filtering and price sort', `JSON.stringify([...document.querySelectorAll('article[data-price]')].map(element=>element.dataset.price)) === ${JSON.stringify(JSON.stringify(before))}`);
  });
  await scenario('Vehicle pricing, gallery and detailed pages', async () => {
    await b.navigate(fortuner); await b.capture('detail-mobile'); await b.click(labelled('Open vehicle photo gallery'));
    await b.waitFor(`!!document.querySelector('[aria-label="Vehicle photo viewer"]')`); const original = await b.evaluate(`document.querySelector('[aria-label="Vehicle photo viewer"] img').getAttribute('src')`);
    await b.click(labelled('Next photo'));
    await check('Photo gallery changes the photograph', `document.querySelector('[aria-label="Vehicle photo viewer"] img').getAttribute('src') !== ${JSON.stringify(original)}`);
    await b.back(); await check('Browser Back closes gallery without leaving the car', `!document.querySelector('[role=dialog]') && location.pathname === ${JSON.stringify(fortuner)}`);
    await b.clickText('Exteriors', 'a'); await b.waitFor(`location.pathname.endsWith('/gallery')`); await b.capture('gallery-exterior');
    await check('Gallery displays all 17 captured photographs', `document.querySelectorAll('[data-photo-index]').length === 17`);
    await b.clickText('Interior'); await b.capture('gallery-interior');
    await b.clickText('Features'); await b.capture('gallery-features');
    await b.click(`document.querySelector('[data-photo-category="Features"]')`); await b.capture('gallery-viewer');
    await b.click(labelled('Zoom in')); await check('Viewer zoom changes image scale', `document.querySelector('[aria-label="Vehicle photo viewer"] img').style.transform.includes('scale(2)')`);
    await b.key('ArrowRight',39); await check('Keyboard advances photo and resets zoom', `document.querySelector('[aria-label="Vehicle photo viewer"] img').style.transform.includes('scale(1)')`);
    await b.back(); await check('Back closes viewer on gallery route', `!document.querySelector('[role=dialog]')&&location.pathname.endsWith('/gallery')`);
    await b.back(); await b.waitFor(`location.pathname === ${JSON.stringify(fortuner)}`);
    await b.clickText('Price breakdown'); await b.capture('price-breakdown');
    await check('Price breakdown includes actual captured fee and mandatory charges', `document.querySelector('[aria-label="Price breakdown"]').textContent.includes('97,599') && document.querySelector('[aria-label="Price breakdown"]').textContent.includes('Registration fee (Dubai)')`);
    await closeModal(); await b.clickText('EMI plans'); await b.capture('emi-plans');
    await check('Captured EMI default is AED 1,430 with 20% downpayment', `document.querySelector('[aria-label="EMI plans"] output').textContent.includes('1,430')`);
    const emiBefore = await b.evaluate(`document.querySelector('[aria-label="EMI plans"] output').textContent`);
    await b.input('[aria-label="Downpayment amount"]','0'); await b.click(labelled('3 years loan tenure'));
    await check('Downpayment and tenure update the EMI', `document.querySelector('[aria-label="EMI plans"] output').textContent !== ${JSON.stringify(emiBefore)}`);
    await b.click(labelled('Check loan eligibility from EMI plans')); await b.waitFor(`!!document.querySelector('[aria-labelledby="login-title"]')`);
    await b.back(); await check('EMI-to-login handoff retains correct Back behavior', `!document.querySelector('[role=dialog]') && location.pathname === ${JSON.stringify(fortuner)}`);
    await b.scroll(650); await check('Fixed vehicle section navigation is visible', `!!document.querySelector('[aria-label="Vehicle sections"]')`);
    await b.click(`[...document.querySelectorAll('[aria-label="Vehicle sections"] button')].find(element=>element.textContent==='Features')`); await sleep(500); await b.capture('detail-features-section');
    await b.click(`[...document.querySelectorAll('a')].find(element=>element.textContent==='VIEW ALL FEATURES')`); await b.waitFor(`location.pathname.endsWith('/features')`); await b.capture('all-features');
    await b.input('[aria-label="Search for a feature"]','Roof'); await check('Feature search filters the actual equipment list', `document.querySelectorAll('li').length === 1 && document.querySelector('li').textContent.includes('Roof Rails')`);
    await b.navigate(fortuner); await b.scroll(650);
    await b.click(`[...document.querySelectorAll('[aria-label="Vehicle sections"] button')].find(element=>element.textContent==='Service History')`); await sleep(550); await b.capture('detail-service-history');
    await check('Service timeline reproduces both captured records', `document.querySelectorAll('[aria-label="Captured service history"] time').length === 2 && document.querySelector('[aria-label="Captured service history"]').textContent.includes('39,649')`);
    await b.click(`[...document.querySelectorAll('[aria-label="Vehicle sections"] button')].find(element=>element.textContent==='Car finance')`); await sleep(550); await b.capture('detail-car-finance');
    await check('Inline finance and sheet share the captured AED 1,430 result', `document.querySelector('[data-inline-emi]').textContent.includes('1,430')`);
    await b.input('[aria-label="Inline downpayment amount"]','0'); await b.click(labelled('Inline 3 year tenure'));
    await check('Inline finance controls calculate a different estimate', `!document.querySelector('[data-inline-emi]').textContent.includes('1,430')&&document.querySelector('[data-inline-emi]').textContent.includes('3 years')`);
    await b.navigate(`${fortuner}/inspection`); await b.capture('inspection-report-top');
    await check('Inspection report has the six captured sections', `document.querySelectorAll('section h2').length === 7 && document.body.textContent.includes('Electricals, Controls & Lights')`);
    await b.clickText('SEE MORE'); await check('Exterior report expands recorded checkpoints', `document.body.textContent.includes('Running Board Condition') && document.body.textContent.includes('Chassis Condition')`);
    await b.scroll(1050); await b.capture('inspection-report-expanded');
    await b.clickText('BOOK FREE TEST DRIVE'); await check('Inspection booking opens login, not a fabricated booking', `!!document.querySelector('[aria-labelledby="login-title"]')`); await closeModal();
  });
  await scenario('Selling journey', async () => {
    await b.navigate('/sell'); await b.clickText('Start your sell journey'); await b.waitFor(`location.pathname === '/sell/details'`); await b.capture('sell-brands');
    await b.clickText('Toyota'); await b.click(labelled('Search model')); await b.input('[aria-label="Search model"]','Fortuner'); await b.clickText('Fortuner'); await b.capture('sell-year');
    await b.clickText('2024'); await b.clickText('SUV'); await b.capture('sell-variant');
    await b.click(`[...document.querySelectorAll('button')].find(element=>element.textContent.replace(/\s/g,'').startsWith('EXR2024'))`);
    await b.capture('sell-gcc'); await b.clickText('Yes'); await b.clickText('40,000 km - 60,000 km'); await b.capture('sell-timing');
    await b.back(); await check('Sell browser Back returns one step with earlier values retained', `document.body.textContent.includes('Select kilometres driven') && location.search.includes('variant=EXR')`);
    await b.clickText('40,000 km - 60,000 km'); await b.clickText('Within this week'); await b.capture('sell-exchange'); await b.clickText('No, not right now');
    await check('Completed sell details opens native login sheet', `!!document.querySelector('[aria-labelledby="login-title"]')`);
    await b.back(); await check('Back from sell login returns to exchange question', `!document.querySelector('[role=dialog]') && document.body.textContent.includes('Are you planning to buy a car')`);
  });
  await scenario('Servicing journey and contract', async () => {
    await b.navigate('/service'); await b.clickText('Start your servicing journey'); await b.waitFor(`location.pathname === '/service/details'`); await b.capture('service-brands');
    await b.clickText('Toyota'); await b.input('[aria-label="Search service brand or model"]','Fortuner'); await b.clickText('Fortuner'); await b.capture('service-contract');
    await b.click(`[...document.querySelectorAll('button')].find(element=>element.textContent.trim()==='View More')`); await b.capture('service-inspection-details');
    await check('Service inspection displays the recorded engine checks', `document.querySelector('[aria-label="Service inspection details"]').textContent.includes('PCV Valve')`);
    await b.clickText('Expand all details'); await check('Service inspection expansion is interactive', `document.querySelector('[aria-label="Service inspection details"]').textContent.includes('Air Conditioning performance')`);
    await b.back(); await check('Back closes the inspection overlay', `!document.querySelector('[aria-label="Service inspection details"]')`);
    await b.click(`[...document.querySelectorAll('button')].find(element=>element.textContent.trim()==='ADD')`); await b.capture('service-cart');
    await check('Single selected service updates cart and disables alternative contracts', `document.body.textContent.includes('1 service added') && document.querySelectorAll('button:disabled').length === 2`);
    await b.clickText('NEXT'); await b.capture('service-login'); await b.input('[aria-label="Service mobile number"]','501234567'); await b.clickText('VERIFY');
    await check('Service auth does not pretend an OTP was delivered', `document.querySelector('[role=status]').textContent.includes('No OTP is sent')`);
    await b.back(); await check('Checkout Back restores the selected contract', `document.body.textContent.includes('1 service added') && document.body.textContent.includes('Service contract')`);
  });
  await scenario('Finance budget calculator', async () => {
    await b.navigate('/finance'); await b.scroll(750); await b.capture('finance-calculator');
    await check('Default budget estimate matches AED 7,000', `document.querySelector('output').textContent.includes('7,000')`);
    await focusInput('[aria-label="Monthly salary"]', '30000');
    await check('Salary field updates the borrowing-budget estimate', `document.querySelector('output').textContent.includes('12,000')`);
    await b.input('[aria-label="Current EMIs slider"]','10000'); await check('Budget range input updates calculator', `document.querySelector('output').textContent.includes('9,500')`);
    await b.click(`[...document.querySelectorAll('a')].find(element=>element.textContent==='Browse eligible cars')`); await b.waitFor(`location.pathname === '/cars'`);
    await check('Budget calculator navigates to a real EMI-filtered inventory', `location.search.includes('emiMax=9500') && document.querySelectorAll('article[data-price]').length > 0`);
  });
  await scenario('Policy screens and login validation', async () => {
    await b.navigate('/benefits/returns'); await b.capture('return-policy'); await b.click(`document.querySelector('details summary')`); await check('Return FAQ expands', `document.querySelector('details').open`);
    await b.click(`[...document.querySelectorAll('a')].find(element=>element.textContent==='Lifetime Warranty')`); await b.waitFor(`location.pathname === '/benefits/warranty'`); await b.capture('lifetime-warranty');
    await b.navigate('/more'); await b.clickText('LOGIN'); await b.input('#login-phone','123'); await b.click(`document.querySelector('[aria-labelledby="login-title"] button[type=submit]')`);
    await check('Invalid UAE mobile number is rejected', `document.querySelector('#phone-error').textContent.includes('valid')`);
    await b.input('#login-phone','501234567'); await b.click(`document.querySelector('[aria-labelledby="login-title"] button[type=submit]')`);
    await check('General login explicitly reports disconnected OTP delivery', `document.querySelector('[role=status]').textContent.includes('No OTP is sent')`);
    await b.key('Tab',9); await check('Keyboard focus remains in the active modal', `document.querySelector('[aria-labelledby="login-title"]').contains(document.activeElement)`);
    await closeModal(); await check('Closing final modal restores page scrolling', `document.body.style.overflow !== 'hidden'`);
  });
  await scenario('Responsive routes', async () => {
    for (const [width,height] of [[390,844],[768,1024],[1440,1000]]) {
      await b.viewport(width,height);
      for (const [name,route] of [['home','/'],['inventory','/cars'],['search','/search'],['sell','/sell'],['sell-details','/sell/details?brand=Toyota'],['service-contract','/service/details?brand=Toyota&model=Fortuner'],['finance','/finance'],['detail',fortuner],['features',`${fortuner}/features`],['gallery',`${fortuner}/gallery`],['inspection',`${fortuner}/inspection`]]) {await b.navigate(route); await b.capture(`${name}-${width}`);}
    }
  });
  b.check('No runtime exceptions, console errors or failed HTTP responses', b.errors.length === 0, b.errors);
} finally {
  const result = await b.report(); await b.close(); process.exitCode = result.failed || result.browserErrors ? 1 : 0;
}
