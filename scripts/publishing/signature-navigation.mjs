const marker = '<!-- CARS SIGNATURE NAVIGATION HANDOFF v1 -->';

// This runs before Signature's server-rendered body can paint. The shared
// selector owns the ready signal and retry; the timeout only recovers when
// that script cannot start. Direct visits never hide server-rendered content.
export const signatureNavigationHead = `${marker}
<style>html[data-cars-preview-pending]{overflow:hidden}html[data-cars-preview-pending] body>:not(dealer-design-switcher):not(excellent-design-switcher){visibility:hidden!important}</style>
<script>(()=>{try{const pending=JSON.parse(sessionStorage.getItem('cars-preview-navigation:v1')||'null');const age=Date.now()-pending?.startedAt;if(pending?.target===location.href&&age>=0&&age<30000){document.documentElement.setAttribute('data-cars-preview-pending','signature');globalThis.__carsPreviewPendingTimer=setTimeout(()=>document.documentElement.removeAttribute('data-cars-preview-pending'),15000);}}catch{}})();</script>`;

export function addSignatureNavigationHead(html) {
  if (html.includes(marker)) return html;
  if (html.split('<head>').length !== 2) throw new Error('Signature app head boundary changed');
  return html.replace('<head>', `<head>\n${signatureNavigationHead}\n`);
}
