// Local integrations are implemented here during the HTML fidelity phase.
// This file never submits messages or account actions to the reference server.
// The legacy filter constructor expects absolute action/pagination attributes.
for (const form of document.forms) form.setAttribute('action', form.action);
for (const link of document.querySelectorAll('a.page-numbers')) link.setAttribute('href', link.href);
document.addEventListener('DOMContentLoaded', () => {
 document.getElementById('stm_wrapper')?.classList.add('has-freemius-checkout');
 const trigger = document.querySelector('.mobile-menu-trigger');
 if (trigger && !document.querySelector('.mobile-menu-holder')) {
  const dialog = document.createElement('dialog');
  dialog.className = 'motoria-mobile-menu';
  dialog.id = 'motoria-mobile-navigation';
  dialog.setAttribute('aria-label', 'Navigation');
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'motoria-menu-close';
  close.textContent = 'Close menu';
  close.addEventListener('click', () => dialog.close());
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Main navigation');
  const routes = [
   ['Home','/'], ['Inventory','/inventory/'], ['BMW M5','/listings/bmw-m5/'],
   ['Pricing','/pricing/'], ['About us','/about-us/'], ['Contact us','/contact-us/'],
   ['Blog','/blog/'], ['Loan calculators','/loan-calculators/'],
   ['Leasing calculators','/leasing-calculators/'], ['Import car calculator','/import-car-calculator/'],
   ['Insurance calculator','/insurance-calculator/']
  ];
  for (const [label, href] of routes) {
   const link = document.createElement('a');
   link.textContent = label;
   link.href = href;
   if (location.pathname === href) link.setAttribute('aria-current', 'page');
   nav.append(link);
  }
  dialog.append(close, nav);
  document.body.append(dialog);
  trigger.setAttribute('role', 'button');
  trigger.setAttribute('tabindex', '0');
  trigger.setAttribute('aria-label', 'Open navigation');
  trigger.setAttribute('aria-controls', dialog.id);
  trigger.setAttribute('aria-expanded', 'false');
  trigger.addEventListener('click', (event) => {
   event.stopImmediatePropagation();
   trigger.setAttribute('aria-expanded', 'true');
   dialog.showModal();
  }, true);
  trigger.addEventListener('keydown', (event) => {
   if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); trigger.click(); }
  });
  dialog.addEventListener('close', () => {
   trigger.setAttribute('aria-expanded', 'false');
   trigger.focus();
  });
 }
});
document.addEventListener('submit', (event) => {
 const form = event.target;
 if (!(form instanceof HTMLFormElement)) return;
 if (form.matches('.stm-filter-form, .search-form, .search-filter-form') || form.elements.namedItem('make')) return;
 event.preventDefault();
 event.stopImmediatePropagation();
 let message = form.querySelector('[data-local-feedback]');
 if (!message) {
  message = document.createElement('p');
  message.dataset.localFeedback = '';
  message.setAttribute('role', 'status');
  form.append(message);
 }
 message.textContent = 'This template is running locally. Connect a backend to send this form.';
}, true);
