import fs from 'node:fs';
import sharp from 'sharp';
const root = '.qa/native-resource-reference/res/drawable/';
const output = 'public/icons/native-vector';
fs.mkdirSync(output, { recursive: true });
const icons = {
  date: 'ic_date',
  registration: 'ic_registration',
  checkCircle: 'ic_check_bullet_16dp',
  helmet: 'ic_helmet',
  bicycle: 'ic_bike_category',
  umbrella: 'ic_umbrella',
  category: 'ic_category',
  photo: 'ic_image',
  back: 'ic_nav_back',
  arrow: 'ic_nav_forward',
  bell: 'ic_notifications',
  bike: 'ic_vehicle_bike',
  camera: 'ic_camera',
  car: 'ic_vehicle_car',
  check: 'ic_check',
  down: 'ic_arrow_down_small',
  left: 'ic_arrow_prev_small',
  right: 'ic_arrow_next_small',
  up: 'ic_arrow_up_small',
  help: 'ic_info_question',
  user: 'ic_account',
  checklist: 'ic_checklist',
  fuel: 'ic_fuel',
  gauge: 'ic_power',
  heart: 'ic_heart_empty',
  heartFilled: 'ic_heart_full',
  home: 'ic_home',
  info: 'ic_info',
  grid: 'ic_layout_list_large',
  list: 'ic_layout_list',
  mail: 'ic_email',
  pin: 'ic_location',
  message: 'ic_chat',
  mic: 'ic_microphone',
  phone: 'ic_call',
  plus: 'ic_add',
  reset: 'ic_reset',
  search: 'ic_search',
  settings: 'ic_settings',
  share: 'ic_share',
  shield: 'ic_trust_and_safety',
  filter: 'ic_filter_settings',
  sparkles: 'ic_mobee_sparkle_ai',
  star: 'ic_star_empty',
  tag: 'ic_sell',
  trash: 'ic_delete',
  truck: 'ic_vehicle_truck',
  users: 'ic_user_group',
  wrench: 'ic_maintenance',
  close: 'ic_close',
  electric: 'ic_vehicle_e_bike',
  zoom: 'ic_zoom_in',
  sort: 'ic_sort',
  mileage: 'ic_mileage',
  motorhome: 'ic_vehicle_camper',
  transmission: 'ic_transmission',
  smartSearch: 'ic_search_sparkle',
  searches: 'ic_search_save',
  timer: 'ic_express',
  globe: 'ic_language',
  edit: 'ic_edit',
  map: 'ic_map',
  send: 'ic_send',
};
const attrs = (text) =>
  Object.fromEntries(
    [...text.matchAll(/(?:android:)?([\w-]+)="([^"]*)"/g)].map((a) => [a[1], a[2]]),
  );
const alpha = (color) =>
  color?.startsWith('#') && color.length === 9 ? parseInt(color.slice(1, 3), 16) / 255 : 1;
for (const [name, file] of Object.entries(icons)) {
  const xml = fs.readFileSync(root + file + '.xml', 'utf8');
  const v = attrs(xml.match(/<vector([^>]+)>/)?.[1] || '');
  if (!v.viewportWidth) throw Error('Not a vector ' + file);
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${v.viewportWidth} ${v.viewportHeight}">`;
  for (const m of xml.matchAll(/<(\/?)(group|path)\b([^>]*?)>/g)) {
    const a = attrs(m[3]);
    if (m[2] === 'group') {
      if (m[1]) {
        svg += '</g>';
        continue;
      }
      const x = Number(a.pivotX || 0),
        y = Number(a.pivotY || 0);
      svg += `<g transform="translate(${Number(a.translateX || 0)} ${Number(a.translateY || 0)}) translate(${x} ${y}) rotate(${Number(a.rotation || 0)}) scale(${Number(a.scaleX || 1)} ${Number(a.scaleY || 1)}) translate(${-x} ${-y})">`;
      continue;
    }
    if (!a.pathData) continue;
    const fill = a.fillColor && alpha(a.fillColor) > 0 ? '#fff' : 'none';
    svg += `<path d="${a.pathData}" fill="${fill}" fill-opacity="${Number(a.fillAlpha || 1) * alpha(a.fillColor)}" fill-rule="${a.fillType === 'evenOdd' ? 'evenodd' : 'nonzero'}"`;
    if (a.strokeColor)
      svg += ` stroke="#fff" stroke-width="${a.strokeWidth || 1}" stroke-opacity="${Number(a.strokeAlpha || 1) * alpha(a.strokeColor)}" stroke-linecap="${a.strokeLineCap || 'butt'}" stroke-linejoin="${a.strokeLineJoin || 'miter'}"`;
    svg += '/>';
  }
  svg += '</svg>';
  await sharp(Buffer.from(svg)).resize(72, 72).png().toBuffer();
  fs.writeFileSync(output + '/' + name + '.svg', svg + '\n');
}
const names = Object.keys(icons);
fs.writeFileSync(
  'src/components/NativeIcon.tsx',
  `import * as stylex from '@stylexjs/stylex';
const s = stylex.create({
  base: { display:'inline-block',flexShrink:0,backgroundColor:'currentColor',maskSize:'contain',maskPosition:'center',maskRepeat:'no-repeat',verticalAlign:'middle' },
  size: (size:number) => ({width:size,height:size}),
  ${names.map((name) => name + ": {maskImage:'url(/icons/native-vector/" + name + ".svg)'}").join(',\n  ')}
});
const names = ${JSON.stringify(names)} as const;
export type NativeIconName = (typeof names)[number];
export function isNativeIcon(name:string):name is NativeIconName { return (names as readonly string[]).includes(name); }
export function NativeIcon({name,size=24}:{name:NativeIconName;size?:number}) {return <span aria-hidden="true" {...stylex.props(s.base,s[name],s.size(size))}/>;}
`,
);
console.log('EXACT_NATIVE_VECTORS', names.length);
