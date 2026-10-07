// Vendor sliders still support deliberate navigation and swiping.
(() => {
  // A preview role only; this does not authenticate or grant backend access.
  const previewRoleKey = 'karento-best-demo-area';
  let previewRole = null;
  try { previewRole = sessionStorage.getItem(previewRoleKey); } catch {}
  if (previewRole === 'owner' || previewRole === 'member') {
    document.querySelectorAll('[data-demo-account-link]').forEach(link => {
      link.href = previewRole === 'owner' ? '/dashboard' : '/account';
      if (!link.hasAttribute('data-demo-fixed-label')) {
        link.textContent = link.hasAttribute('data-demo-drawer-account') ? 'View account' : previewRole === 'owner' ? 'Dashboard' : 'My account';
      }
    });
    document.querySelectorAll('.karento-demo-signout').forEach(button => { button.hidden = false; });
    document.querySelectorAll('[data-demo-register-link]').forEach(link => { link.hidden = true; });
    document.querySelectorAll('[data-demo-account-heading]').forEach(heading => {
      heading.textContent = previewRole === 'owner' ? 'Dealership owner' : 'Member account';
    });
    document.querySelectorAll('[data-demo-settings-link]').forEach(link => {
      link.hidden = false;
      link.href = previewRole === 'owner' ? '/dashboard/settings' : '/account/settings';
    });
  }
  const accountDrawer = document.querySelector('.karento-account-drawer');
  const menuToggle = document.querySelector('.karento-menu-toggle');
  if (accountDrawer && menuToggle) {
    let wasOpen = false;
    const syncDrawer = () => {
      const open = accountDrawer.classList.contains('sidebar-canvas-visible');
      menuToggle.setAttribute('aria-expanded', String(open));
      accountDrawer.setAttribute('aria-hidden', String(!open));
      accountDrawer.inert = !open;
      if (open && !wasOpen) requestAnimationFrame(() => {
        if (accountDrawer.classList.contains('sidebar-canvas-visible')) accountDrawer.querySelector('.close-canvas').focus();
      });
      if (!open && wasOpen) menuToggle.focus();
      wasOpen = open;
    };
    new MutationObserver(syncDrawer).observe(accountDrawer, { attributes: true, attributeFilter: ['class'] });
    accountDrawer.addEventListener('transitionend', () => {
      if (accountDrawer.classList.contains('sidebar-canvas-visible') && !accountDrawer.contains(document.activeElement)) {
        accountDrawer.querySelector('.close-canvas').focus();
      }
    });
    syncDrawer();
    document.addEventListener('keydown', event => {
      if (!accountDrawer.classList.contains('sidebar-canvas-visible')) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        accountDrawer.classList.remove('sidebar-canvas-visible');
        document.body.classList.remove('canvas-menu-active');
        menuToggle.classList.remove('burger-2-close');
      }
      if (event.key === 'Tab') {
        const controls = [...accountDrawer.querySelectorAll('a[href], button, summary')].filter(element =>
          !element.hidden && element.getClientRects().length &&
          (!element.closest('details:not([open])') || element.matches('summary'))
        );
        const first = controls[0];
        const last = controls.at(-1);
        if (!accountDrawer.contains(document.activeElement)) { event.preventDefault(); first.focus(); }
        else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
  }
  document.querySelector('[data-demo-signin]')?.addEventListener('submit', event => {
    event.preventDefault();
    const role = new FormData(event.currentTarget).get('area') === 'member' ? 'member' : 'owner';
    try { sessionStorage.setItem(previewRoleKey, role); } catch {}
    window.location.assign(role === 'owner' ? '/dashboard' : '/account');
  });
  document.querySelectorAll('.karento-demo-signout').forEach(button => {
    button.addEventListener('click', () => {
      try { sessionStorage.removeItem(previewRoleKey); } catch {}
      window.location.assign('/login');
    });
  });
  const billingControl = document.querySelector('[data-billing-control]');
  if (billingControl) {
    const section = billingControl.closest('.section-pricing-1');
    const priceFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
    const updatePlanPrices = () => {
      const annual = billingControl.querySelector('input:checked').value === 'annual';
      section.querySelectorAll('[data-plan-price]').forEach(price => {
        price.textContent = priceFormat.format(Number(annual ? price.dataset.annualPrice : price.dataset.monthlyPrice));
      });
      section.querySelectorAll('[data-plan-price-unit]').forEach(unit => { unit.textContent = annual ? '/ year' : '/ month'; });
    };
    billingControl.addEventListener('change', updatePlanPrices);
    updatePlanPrices();
  }
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function applyMotionPreference() {
    document.querySelectorAll('.swiper-container, .swiper').forEach(element => {
      const slider = element.swiper;
      if (!slider) return;
      slider.autoplay?.stop();
      if (slider.params.autoplay) slider.params.autoplay.enabled = false;
      slider.params.speed = reducedMotion.matches ? 0 : 220;
    });
  }
  applyMotionPreference();
  reducedMotion.addEventListener('change', applyMotionPreference);
})();
