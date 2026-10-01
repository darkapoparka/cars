import fs from 'node:fs';
import path from 'node:path';
const palette = new Map([
 ['#e6e9ef','#e6eaf0'],['#1b1b23','#1b1b21'],['#5e636f','#5d616b'],
 ['#d6dbe3','#d5dae0'],['#e72b00','#db3000'],['#4f176f','#4f166e'],
 ['#300047','#350051'],['#722996','#68298a'],['#d5dae2','#d5dae0'],
 ['#198742','#256141'],['#ff8b64','#ff8f66'],['#f5f6f8','#f5f7fa'],
]);
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
for(const file of walk('src').filter(p=>/\.(tsx?|css)$/.test(p))){let text=fs.readFileSync(file,'utf8');for(const [from,to] of palette)text=text.replaceAll(from,to);fs.writeFileSync(file,text);}
const tokens='src/styles/tokens.stylex.ts';let text=fs.readFileSync(tokens,'utf8');
text=text.replace("  panel: '#fcfbfd',","  panel: '#fcfbfd',\n  stripe: '#f5f7fa',");text=text.replace("  panel: '#24212a',","  panel: '#24212a',\n  stripe: '#2b2831',");fs.writeFileSync(tokens,text);
const sections='src/components/VehicleSections.tsx';text=fs.readFileSync(sections,'utf8');text=text.replace("':nth-child(even)': '#f5f7fa'","':nth-child(even)': colors.stripe");
text=text.replace("maxHeight: 'calc(100dvh - 210px)'", "height: 'calc(100dvh - 180px)', maxHeight: 740");text=text.replace("modalTitle: { fontSize: 16, lineHeight: '24px', fontWeight: 700, marginBottom: 16 }", "modalTitle: { fontSize: 16, lineHeight: '24px', fontWeight: 700, marginBottom: 8, paddingBottom: 12, borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: colors.line }");
fs.writeFileSync(sections,text);
const auth='src/components/LoginScreen.tsx';text=fs.readFileSync(auth,'utf8').replaceAll(/aria-description="[^"]*"/g,'aria-describedby="auth-local-notice"').replace('<p role="note"','<p id="auth-local-notice" role="note"');fs.writeFileSync(auth,text);
fs.writeFileSync('reference/web/pass2/palette-provenance.json',JSON.stringify({source:'17-home, 26-sell, 85-x6-technical-expanded native PNG histograms',replacements:[...palette]},null,2));
