import fs from 'node:fs';
import sharp from 'sharp';
function patch(file,oldText,newText){const text=fs.readFileSync(file,'utf8');if(!text.includes(oldText))throw Error('Missing '+file+' '+oldText.slice(0,50));fs.writeFileSync(file,text.replace(oldText,newText));}
const ui='src/components/ui.tsx';
patch(ui,"import { colors } from '@/styles/tokens.stylex';","import { colors } from '@/styles/tokens.stylex';\nimport { lockDocumentScroll } from '@/lib/scroll-lock';");
patch(ui,"  modalTitle:","  nativeSheet: { paddingInline: 16, paddingTop: 22, paddingBottom: 0, '::backdrop': { backgroundColor: 'rgba(0,0,0,.33)' } },\n  tableDialog: { height: 'calc(100dvh - 40px)', maxHeight: 'calc(100dvh - 40px)', padding: 16, display: 'flex', flexDirection: 'column' },\n  modalTitle:");
patch(ui,'  sheet = false,','  sheet = false,\n  nativeSheet = false,\n  table = false,');
patch(ui,'  sheet?: boolean;','  sheet?: boolean;\n  nativeSheet?: boolean;\n  table?: boolean;');
patch(ui,"    dialog?.showModal();\n    const previous = document.body.style.overflow;\n    document.body.style.overflow = 'hidden';", "    if (dialog && !dialog.open) dialog.showModal();\n    const release = lockDocumentScroll();");
patch(ui,'      document.body.style.overflow = previous;','      release();');
patch(ui,'stylex.props(s.dialog, sheet && s.sheet)','stylex.props(s.dialog, sheet && s.sheet, nativeSheet && s.nativeSheet, table && s.tableDialog)');
const g='src/components/GalleryScreen.tsx';patch(g,"import { colors } from '@/styles/tokens.stylex';", "import { colors } from '@/styles/tokens.stylex';\nimport { lockDocumentScroll } from '@/lib/scroll-lock';");
patch(g,"    const previous = document.body.style.overflow; document.body.style.overflow = 'hidden';\n    return () => { document.body.style.overflow = previous; };", "    return lockDocumentScroll();");
const v='src/components/VehicleSections.tsx';let text=fs.readFileSync(v,'utf8');text=text.replace("modalScroll: { height: 'calc(100dvh - 180px)', maxHeight: 740, overflowY: 'auto' }", "modalScroll: { flex: '1', minHeight: 0, overflowY: 'auto' }");text=text.replace('<Modal open={technical}', '<Modal table open={technical}').replace('<Modal open={features}', '<Modal table open={features}');fs.writeFileSync(v,text);
const auth='src/components/AuthPrompt.tsx';text=fs.readFileSync(auth,'utf8');text=text.replace("import * as stylex", "import Image from 'next/image';\nimport * as stylex");text=text.replace('onClose={onClose} sheet','onClose={onClose} sheet nativeSheet');
text=text.replace('marginTop:-8,marginBottom:28','marginTop:0,marginBottom:32').replace('width:90,height:90','width:80,height:80').replace('marginBottom:4','marginBottom:12').replace("lineHeight:'28px'","lineHeight:'24px'");
text=text.replace(/<svg[\s\S]*?<\/svg>/,'<Image src="/images/save-search-art.webp" width={80} height={80} alt="" {...stylex.props(s.art)}/>');fs.writeFileSync(auth,text);
await sharp('reference/android/62-save-search.png').extract({left:518,top:1998,width:248,height:248}).webp({quality:100}).toFile('public/images/save-search-art.webp');
console.log('Native sheet/table geometry and shared nested scroll locking applied.');
