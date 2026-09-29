import {createBrowser} from './lib/browser-qa.mjs';
const browser = await createBrowser('reference/2026-09-26-continuation/first-web');
try {
  await browser.navigate('/');
  await browser.evaluate('localStorage.clear();sessionStorage.clear();');
  await browser.navigate('/'); await browser.capture('home');
  await browser.click(`document.querySelector('[aria-label="Dismiss login banner"]')`);
  await browser.scroll(450); await browser.capture('home-scroll');
  await browser.scroll(1130); await browser.capture('home-cars');
  for (const [name, route] of [['sell','/sell'],['finance','/finance'],['service','/service'],['search','/search'],['sell-details','/sell/details'],['sell-variant','/sell/details?brand=Toyota&model=Fortuner&year=2024&body=SUV&step=variant'],['service-details','/service/details'],['service-contract','/service/details?brand=Toyota&model=Fortuner'],['returns','/benefits/returns'],['warranty','/benefits/warranty']]) {
    await browser.navigate(route); await browser.capture(name);
  }
  await browser.navigate('/finance'); await browser.scroll(900); await browser.capture('finance-calculator');
  await browser.navigate('/sell'); await browser.scroll(680); await browser.capture('sell-lower');
  await browser.navigate('/service'); await browser.scroll(750); await browser.capture('service-lower');
  browser.check('No browser errors', browser.errors.length === 0, browser.errors);
} catch (error) {browser.check('Inspection completed',false,error.stack);}
finally {await browser.report(); await browser.close();}
