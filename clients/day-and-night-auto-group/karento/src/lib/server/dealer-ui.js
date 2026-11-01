// Vendor sliders still support deliberate navigation and swiping.
(() => {
  // Vendor dark.js is loaded after DOMContentLoaded by the captured-page loader.
  // Bind the existing control here so both dealer logo variants are reachable.
  document.querySelectorAll('.change-mode').forEach(control => {
    control.addEventListener('click', event => {
      event.preventDefault();
      const theme = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-bs-theme', theme);
      control.setAttribute('data-bs-theme-value', theme === 'dark' ? 'light' : 'dark');
      try { localStorage.setItem('theme', theme); } catch {}
    });
  });
  // A preview role only; this does not authenticate or grant backend access.
  const previewRoleKey = 'karento-best-demo-area';
  let previewRole = null;
  try { previewRole = sessionStorage.getItem(previewRoleKey); } catch {}
  if (previewRole === 'owner' || previewRole === 'member') {
    document.querySelectorAll('[data-demo-account-link]').forEach(link => {
      link.textContent = previewRole === 'owner' ? 'Dashboard' : 'My account';
      link.href = previewRole === 'owner' ? '/dashboard' : '/account';
    });
    document.querySelectorAll('.karento-demo-signout').forEach(button => { button.hidden = false; });
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
