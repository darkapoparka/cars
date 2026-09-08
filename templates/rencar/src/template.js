function loadScript(src) {
  return new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=src;
    script.onload=resolve;
    script.onerror=()=>reject(new Error('Unable to load '+src));
    document.body.append(script);
  });
}

export async function initializeTemplate(scripts) {
  for(const url of scripts) {
    // The remote PHP mail endpoint is not part of a local template preview.
    if(url.endsWith('/contact-form.js')) continue;
    await loadScript(url.replace('https://live.themewild.com/rencar/','/'));
  }
  document.querySelectorAll('form').forEach(form=>{
    form.addEventListener('submit',event=>{
      event.preventDefault();
      if(!form.reportValidity()) return;
      const action=event.submitter?.textContent.trim()||'';
      const search=form.querySelector('input[type="search"]');
      if(search) { location.href='/car.html?q='+encodeURIComponent(search.value); return; }
      if(/Continue Booking/i.test(action)) { location.href='/car-checkout.html'; return; }
      if(/Book Car|Book A Ride|Book Now/i.test(action)) { location.href='/car-booking.html'; return; }
      const message=document.createElement('p');
      message.setAttribute('role','status');
      message.style.cssText='margin-top:12px;color:inherit';
      message.textContent=/Confirm Booking/i.test(action)
        ? 'This is a local template preview. No reservation or payment has been submitted.'
        : 'This form is a local preview. No information has been sent.';
      form.querySelector('[role="status"]')?.remove();
      form.append(message);
    });
  });
  let searchTrigger;
  const searchPanel=document.querySelector('.search-popup');
  const closeSearch=()=>{document.body.classList.remove('search-active');searchTrigger?.focus();};
  document.querySelectorAll('.search-box-outer').forEach(button=>{
    button.setAttribute('aria-label','Open search');
    button.addEventListener('click',()=>{searchTrigger=button;searchPanel?.querySelector('input')?.focus();});
  });
  document.querySelector('.close-search')?.addEventListener('click',closeSearch);
  document.addEventListener('keydown',event=>{
    if(event.key==='Tab'&&document.body.classList.contains('search-active')) {
      const focusable=[...searchPanel.querySelectorAll('button,input')];
      const first=focusable[0],last=focusable.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }
    if(event.key!=='Escape') return;
    if(document.body.classList.contains('search-active')) closeSearch();
    document.querySelectorAll('.sidebar-popup.open,.sidebar-wrapper.open').forEach(el=>el.classList.remove('open'));
  });
  document.querySelector('.sidebar-btn')?.setAttribute('aria-label','Open information panel');
  document.querySelector('.close-search')?.setAttribute('aria-label','Close search');
  document.querySelector('.close-sidebar-popup')?.setAttribute('aria-label','Close information panel');
  setTimeout(()=>{document.documentElement.dataset.rencarReady='true';},100);
}
