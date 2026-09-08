import pathlib
p=pathlib.Path('.')
f=p/'src/lib/styles/desktop-discovery.css';s=f.read_text(encoding='utf-8').replace('#d50028','#8b6811').replace('#b70022','#6f5108');f.write_text(s,encoding='utf-8')
f=p/'src/lib/components/contact/MobileContactPage.svelte';s=f.read_text(encoding='utf-8').replace('rgba(20, 100, 218, 0.88)','rgba(34, 30, 18, 0.88)').replace('rgba(213, 0, 50, 0.13)','rgba(215, 174, 53, 0.13)');f.write_text(s,encoding='utf-8')
f=p/'src/lib/styles/tokens.css';s=f.read_text(encoding='utf-8');s+='\n.mobile-contact-hero img[src*="asko96-wordmark"], .mobile-hero-bar img[src*="asko96-wordmark"] { filter: none; }\n';f.write_text(s,encoding='utf-8')
