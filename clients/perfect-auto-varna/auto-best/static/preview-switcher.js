(() => {
  if (document.querySelector('dealer-design-switcher')) return;
  const active = location.pathname.startsWith('/variant-2') ? 2 : location.pathname.startsWith('/variant-3') ? 3 : 1;
  const host = document.createElement('dealer-design-switcher');
  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `<style>
    :host{position:fixed;right:16px;bottom:calc(156px + env(safe-area-inset-bottom,0px));z-index:9999;font:14px/1.4 Arial,sans-serif;color:#172019}
    button,a{box-sizing:border-box;font:inherit}button{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;width:64px;height:64px;padding:6px;border:2px solid #fff;border-radius:50%;background:#a50f15;color:#fff;box-shadow:0 4px 16px #0003;cursor:pointer;font-weight:700}button:hover{background:#7e0b10}button svg{width:28px;height:28px}button .label{font-size:11px;line-height:14px}button .count{position:absolute;right:-5px;top:-4px;padding:2px 5px;border-radius:8px;background:#172019;color:white;font-size:11px;line-height:16px}
    nav{position:absolute;bottom:76px;right:0;width:218px;padding:8px;background:white;border:1px solid #dce2dc;border-radius:16px;box-shadow:0 8px 30px #0003}nav[hidden]{display:none}
    p{margin:6px 10px 8px;font-size:12px;color:#556358}a{display:flex;align-items:center;justify-content:space-between;min-height:44px;padding:10px;border-radius:10px;text-decoration:none;color:inherit}a:hover,a:focus-visible{background:#f8f1f1}a[aria-current=page]{background:#f9eded;color:#a50f15;font-weight:700}button:focus-visible,a:focus-visible{outline:2px solid #a50f15;outline-offset:3px}
    @media(min-width:992px){:host{right:24px;bottom:100px}}
  </style><nav id="choices" aria-label="Избор на дизайн" hidden><p>Изберете визия за сайта</p>${[[1,'/'],[2,'/variant-2/cars'],[3,'/variant-3/']].map(([n,url])=>`<a href="${url}" ${n===active?'aria-current="page"':''}>Дизайн ${n}<span aria-hidden="true">${n===active?'✓':'→'}</span></a>`).join('')}</nav><button type="button" aria-label="Дизайн ${active} / 3" aria-expanded="false" aria-controls="choices"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M10 9v12"/></svg><span class="label" aria-hidden="true">Дизайн</span><span class="count" aria-hidden="true">${active}/3</span></button>`;
  const button = shadow.querySelector('button'), panel = shadow.querySelector('nav');
  const close = (focus = false) => { panel.hidden = true; button.setAttribute('aria-expanded','false'); if(focus) button.focus(); };
  button.addEventListener('click',()=>{panel.hidden=!panel.hidden;button.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden)panel.querySelector('a').focus()});
  document.addEventListener('pointerdown',event=>{if(!event.composedPath().includes(host))close()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){close(true);event.preventDefault()}});
  shadow.querySelectorAll('a').forEach(link=>link.addEventListener('click',event=>{if(!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey){event.preventDefault();location.assign(link.href)}}));
  document.body.append(host);
})();
