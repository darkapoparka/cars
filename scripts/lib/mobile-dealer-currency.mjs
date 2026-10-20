/** Existing Mobile accepts one explicit inventory currency; these bindings never convert amounts. */
export const MOBILE_CURRENCY_PATHS = [
  'src/lib/locale.ts', 'src/lib/search.ts', 'src/lib/filter-fields.ts',
  'src/lib/native-filter-options.ts', 'src/lib/native-filter-fields.ts', 'src/lib/service-requests.ts', 'src/lib/messages.bg.ts',
  'src/lib/assistant.ts', 'src/components/ShowroomFilterSheet.tsx',
  'src/components/ShowroomDesktopFilterFields.tsx', 'src/components/ShowroomServiceRequest.tsx',
  'src/components/VehicleCard.tsx', 'src/components/NativeFilterFields.tsx',
  'src/components/NativeCarPark.tsx', 'src/components/SellFlow.tsx', 'src/components/AssistantScreen.tsx',
];

export function personalizeMobileDealerCurrency(files, currency, ukOverlay = false) {
  if (!/^[A-Z]{3}$/.test(currency)) throw Error('Mobile needs one explicit stock currency');
  const pending = new Map();
  const get = name => {
    const bytes = pending.get(name) ?? files.get(name);
    if (!bytes) throw Error('Missing Mobile currency boundary: ' + name);
    return Buffer.isBuffer(bytes) ? bytes.toString('utf8') : String(bytes);
  };
  const assertOne = (name, anchor) => {
    const source = get(name);
    if (source.split(anchor).length !== 2) throw Error('Reviewed Mobile currency boundary changed: ' + name + ' / ' + anchor);
    return source;
  };
  const patch = (name, anchor, replacement) => pending.set(name, assertOne(name, anchor).replace(anchor, () => replacement));
  // These two formatters are already bound by patchMobile; verify that they did not silently drift.
  assertOne('src/lib/locale.ts', 'currency: ' + JSON.stringify(currency));
  assertOne('src/lib/search.ts', 'currency: ' + JSON.stringify(currency));
  if (currency === 'EUR') return [];
  for (const name of MOBILE_CURRENCY_PATHS) get(name);
  if (ukOverlay && currency !== 'GBP') throw Error('Mobile UK currency binding requires GBP');
  const unit = currency === 'GBP' ? '£' : currency;
  // The UK overlay has already bound its known price surfaces and its own source-mi semantics.
  const replaceOrVerify = (name, oldValue, newValue) => {
    if (ukOverlay) assertOne(name, newValue);
    else patch(name, oldValue, newValue);
  };
  replaceOrVerify('src/lib/filter-fields.ts', "unit: '€'", "unit: '" + unit + "'");
  replaceOrVerify('src/lib/native-filter-options.ts', "'Price (€)'", "'Price (" + unit + ")'");
  // The native editor reads units from captured JSON; bind its presentation without rewriting captures.
  patch('src/lib/native-filter-fields.ts', "unit: field.id === 'gears' ? undefined : field.unit,", "unit: field.id === 'gears' ? undefined : field.unit === '€' ? '" + unit + "' : field.unit,");
  replaceOrVerify('src/components/ShowroomFilterSheet.tsx', 'unit="€"', 'unit="' + unit + '"');
  replaceOrVerify('src/components/ShowroomDesktopFilterFields.tsx', "0, 100000, 500, '€'", "0, 100000, 500, '" + unit + "'");
  replaceOrVerify('src/components/ShowroomServiceRequest.tsx', "currency: 'EUR'", "currency: '" + currency + "'");
  replaceOrVerify('src/components/ShowroomServiceRequest.tsx', "'Maximum budget (€)'", "'Maximum budget (" + unit + ")'");
  replaceOrVerify('src/components/ShowroomServiceRequest.tsx', "'Expected price (€) (optional)'", "'Expected price (" + unit + ") (optional)'");
  replaceOrVerify('src/lib/service-requests.ts', "'Maximum budget (EUR)'", "'Maximum budget (" + currency + ")'");
  replaceOrVerify('src/lib/service-requests.ts', "'Expected price (EUR)'", "'Expected price (" + currency + ")'");
  replaceOrVerify('src/components/VehicleCard.tsx', "currency: 'EUR'", "currency: '" + currency + "'");
  replaceOrVerify('src/components/VehicleCard.tsx', "' € mth.'", "' " + currency + " mth.'");
  patch('src/components/NativeFilterFields.tsx', 'unit="€"', 'unit="' + unit + '"');
  patch('src/components/NativeCarPark.tsx', "for {v.price.toLocaleString('de-DE')} €", 'for {number(v.price)} ' + unit);
  patch('src/components/SellFlow.tsx', 'Asking price (€)', 'Asking price (' + unit + ')');
  patch('src/components/AssistantScreen.tsx', 'Cars under €60,000', 'Cars under ' + unit + (currency === 'GBP' ? '' : ' ') + '60,000');
  if (ukOverlay) assertOne('src/lib/assistant.ts', '|budget|£)');
  else patch('src/lib/assistant.ts', '|budget|€)', '|budget|' + unit + ')');
  // Preserve Bulgarian translations when generated labels no longer use the EUR dictionary keys.
  for (const [oldLabel, newLabel] of [
    ['Maximum budget (€)', 'Maximum budget (' + unit + ')'],
    ['Maximum budget (EUR)', 'Maximum budget (' + currency + ')'],
    ['Expected price (EUR)', 'Expected price (' + currency + ')'],
    ['Expected price (€) (optional)', 'Expected price (' + unit + ') (optional)'],
  ]) patch('src/lib/messages.bg.ts', oldLabel, newLabel);
  for (const [oldText, newText] of [
    ['Максимален бюджет (€)', 'Максимален бюджет (' + unit + ')'],
    ['Максимален бюджет (EUR)', 'Максимален бюджет (' + currency + ')'],
    ['Очаквана цена (EUR)', 'Очаквана цена (' + currency + ')'],
    ['Очаквана цена (€) (по избор)', 'Очаквана цена (' + unit + ') (по избор)'],
  ]) patch('src/lib/messages.bg.ts', oldText, newText);
  // No partial helper mutation survives a missing/changed source boundary.
  for (const [name, source] of pending) files.set(name, Buffer.from(source));
  return [...pending.keys()];
}
