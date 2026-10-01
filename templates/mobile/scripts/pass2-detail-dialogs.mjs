import fs from 'node:fs';
const p='src/components/VehicleSections.tsx';let t=fs.readFileSync(p,'utf8');
function patch(a,b){if(!t.includes(a))throw Error('Missing '+a.slice(0,70));t=t.replace(a,b);}
patch("import { Button, ui } from './ui';","import { Button, Modal, ui } from './ui';");
patch("  description: {", "  modalScroll: { maxHeight: 'calc(100dvh - 210px)', overflowY: 'auto' },\n  modalTitle: { fontSize: 16, lineHeight: '24px', fontWeight: 700, marginBottom: 16 },\n  modalClose: { borderTopWidth: 0, textAlign: 'right', paddingRight: 16, height: 48 },\n  tags: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 },\n  description: {");
patch('  const data: [string, string][] = [','  const data: [string, string][] = v.technicalData || [');
patch('(technical ? data : data.slice(0,6))','data.slice(0,6)');
patch("aria-label={technical ? 'Show less technical data' : 'Show more technical data'} onClick={() => setTechnical(!technical)}", "aria-label=\"Show more technical data\" aria-haspopup=\"dialog\" onClick={() => setTechnical(true)}");
patch("{technical ? 'Show less' : 'Show more'}",'Show more');
patch('(features ? v.features : v.features.slice(0,6))','v.features.slice(0,6)');
patch("aria-label={features ? 'Show less features' : 'Show more features'} onClick={() => setFeatures(!features)}","aria-label=\"Show more features\" aria-haspopup=\"dialog\" onClick={() => setFeatures(true)}");
patch("{features ? 'Show less' : 'Show more'}",'Show more');
patch('    </section>\n    <section {...stylex.props(s.card)}>','      {v.specialFeatures && <div {...stylex.props(ui.space)}><strong>Special features according to dealer</strong><div {...stylex.props(s.tags)}>{v.specialFeatures.map(feature => <span key={feature} {...stylex.props(ui.badge)}>{feature}</span>)}</div></div>}\n    </section>\n    <section {...stylex.props(s.card)}>');
const end='  </div>;';if(!t.includes(end))throw Error('End missing');
t=t.replace(end,`    <Modal open={technical} onClose={() => setTechnical(false)}>
      <h2 {...stylex.props(s.modalTitle)}>Technical data</h2>
      <div {...stylex.props(s.modalScroll)}><table {...stylex.props(s.table)}><tbody>
        {data.map(([label,value]) => <tr key={label} {...stylex.props(s.row)}>
          <th scope="row" {...stylex.props(s.cell)}>{label}</th><td {...stylex.props(s.cell)}>{value}</td>
        </tr>)}
      </tbody></table></div>
      <button type="button" onClick={() => setTechnical(false)} {...stylex.props(s.more,s.modalClose)}>Close</button>
    </Modal>
    <Modal open={features} onClose={() => setFeatures(false)}>
      <h2 {...stylex.props(s.modalTitle)}>Features</h2>
      <div {...stylex.props(s.modalScroll)}><table {...stylex.props(s.table)}><tbody>
        {v.features.map(feature => <tr key={feature} {...stylex.props(s.row)}>
          <th scope="row" {...stylex.props(s.cell,s.featuresLabel)}>{feature}</th>
          <td {...stylex.props(s.cell,s.check)}><Icon name="check" size={18}/></td>
        </tr>)}
      </tbody></table></div>
      <button type="button" onClick={() => setFeatures(false)} {...stylex.props(s.more,s.modalClose)}>Close</button>
    </Modal>
  </div>;`);
fs.writeFileSync(p,t);
