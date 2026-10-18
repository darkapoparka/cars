import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

// Execute the maintained component bodies with bounded hook/UI/storage adapters.
// These probes exercise entry and transition text; they are not browser/layout acceptance.
function screen(name, { saved = true, email = 'demo@example.invalid', messageDrafts = {} } = {}) {
  const hooks = [],
    writes = [],
    answers = [];
  let cursor = 0;
  const state = { email, messageDrafts, draft: { make: 'Toyota', model: 'Corolla' } };
  const jsx = (type, props) => ({ type, props: props ?? {} });
  const modules = {
    react: {
      useState(initial) {
        const at = cursor++;
        if (!(at in hooks)) hooks[at] = typeof initial === 'function' ? initial() : initial;
        return [
          hooks[at],
          (value) => {
            hooks[at] = typeof value === 'function' ? value(hooks[at]) : value;
          },
        ];
      },
      useEffect() {},
      useRef: () => ({ current: null }),
    },
    'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'fragment' },
    'next/image': 'img',
    'next/link': 'a',
    '@stylexjs/stylex': { create: (value) => value, props: () => ({}) },
    '@/styles/tokens.stylex': { colors: {} },
    '@/lib/store': {
      useAppState: () => state,
      patchState(patch) {
        writes.push(patch);
        Object.assign(state, patch);
        return saved;
      },
      notify() {},
    },
    '@/lib/catalog': {
      makes: ['Toyota'],
      models: { Toyota: ['Corolla'] },
      getVehicle: () => undefined,
    },
    '@/lib/assistant': {
      answerLocally(value) {
        answers.push(value);
        return { text: 'Local fixture response', ids: [] };
      },
    },
    './Header': { Header: 'header' },
    './ui': { Button: 'button', IconButton: 'button', ui: {} },
    './Icon': { Icon: 'icon' },
    './MessageDrafts': { MessageDrafts: 'draft-list' },
    './LoginScreen': { LoginScreen: 'login-screen' },
    './SellCategorySheet': { SellCategorySheet: 'category-sheet' },
  };
  const source = readFileSync(new URL(`../src/components/${name}.tsx`, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  });
  const exports = {};
  runInNewContext(outputText, {
    exports,
    require(id) {
      if (!(id in modules)) throw new Error('Unexpected component dependency: ' + id);
      return modules[id];
    },
    window: { scrollTo() {} },
    URL,
    fetch() {
      throw new Error('A local demo must not call a remote service');
    },
  });
  return {
    state,
    writes,
    answers,
    render(props = {}, exportName = name) {
      cursor = 0;
      let tree = exports[exportName](props);
      // SellFlow intentionally delegates to its retained inner wizard.
      if (typeof tree?.type === 'function') tree = tree.type(tree.props);
      return tree;
    },
  };
}
const children = (node) =>
  Array.isArray(node) ? node : node && typeof node === 'object' ? node.props?.children : undefined;
function text(node) {
  if (Array.isArray(node)) return node.map(text).join(' ');
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  return children(node) === undefined ? '' : text(children(node));
}
function find(node, predicate) {
  if (Array.isArray(node)) return node.flatMap((child) => find(child, predicate));
  if (!node || typeof node !== 'object') return [];
  return [...(predicate(node) ? [node] : []), ...find(children(node), predicate)];
}
const button = (tree, label) => {
  const found = find(tree, (node) => node.type === 'button' && text(node) === label);
  assert.equal(found.length, 1, 'Expected one action: ' + label);
  return found[0];
};
const submit = (tree) => {
  const forms = find(tree, (node) => node.type === 'form');
  assert.equal(forms.length, 1);
  forms[0].props.onSubmit({ preventDefault() {} });
};

test('native messages disclose local drafts before login and retain existing drafts', () => {
  const empty = screen('NativeInboxes').render({}, 'NativeMessages');
  assert.match(text(empty), /Local message drafts/);
  assert.match(text(empty), /Messages are not sent or received here/);
  assert.doesNotMatch(
    text(empty),
    /Direct contact with buyers|securely and quickly write and receive/,
  );
  assert.equal(button(empty, 'Log In').props.href, '/login?next=/messages');
  const existing = screen('NativeInboxes', { messageDrafts: { vehicle: 'Existing draft' } }).render(
    {},
    'NativeMessages',
  );
  assert.equal(existing.type, 'draft-list');
});

test('sell entry discloses demo boundaries while retaining routes and category action', () => {
  const app = screen('SellScreen'),
    initial = app.render();
  assert.match(text(initial), /Car valuation demo/);
  assert.match(text(initial), /No market valuation is generated/);
  assert.match(text(initial), /No listing is published/);
  assert.match(text(initial), /no dealer is contacted/);
  assert.doesNotMatch(
    text(initial),
    /free price estimation online|current market data|verified dealers|14 mio|biggest vehicle marketplace/,
  );
  assert.equal(button(initial, 'Try valuation demo').props.href, '/sell/valuation');
  assert.equal(button(initial, 'Direct sale demo').props.href, '/sell/direct');
  button(initial, 'Create local draft').props.onClick();
  assert.equal(find(app.render(), (node) => node.type === 'category-sheet')[0].props.open, true);
});

test('assistant starts and resets with an honest local-demo notice', () => {
  const app = screen('AssistantScreen'),
    initial = app.render();
  assert.match(text(initial), /Local demo assistant/);
  assert.match(text(initial), /No live AI service is connected/);
  assert.doesNotMatch(text(initial), /Unable to connect|check your internet connection|Try again/);
  button(initial, 'Start demo').props.onClick();
  assert.match(text(app.render()), /Local demonstration using captured vehicles/);
  const input = find(app.render(), (node) => node.type === 'input')[0];
  input.props.onChange({ target: { value: 'Show me a car' } });
  submit(app.render());
  assert.deepEqual(app.answers, ['Show me a car']);
  assert.match(text(app.render()), /Local fixture response/);
  assert.equal(find(app.render(), (node) => node.type === 'input')[0].props.value, '');
  find(
    app.render(),
    (node) => node.type === 'button' && node.props.label === 'Reset conversation',
  )[0].props.onClick();
  assert.match(text(app.render()), /No live AI service is connected/);
  assert.doesNotMatch(text(app.render()), /Local fixture response/);
});

for (const saved of [true, false])
  test(`sell draft keeps its edits and qualifies early device saving when storage ${saved ? 'succeeds' : 'fails'}`, () => {
    const app = screen('SellFlow', { saved });
    const make = find(
      app.render({ mode: 'create' }),
      (node) => node.type === 'select' && node.props['aria-label'] === 'Make',
    )[0];
    make.props.onChange({ target: { value: 'Toyota' } });
    assert.equal(app.state.draft.make, 'Toyota');
    submit(app.render({ mode: 'create' }));
    submit(app.render({ mode: 'create' }));
    const review = app.render({ mode: 'create' });
    assert.match(text(review), /Photos stay in this session and are never uploaded/);
    assert.match(text(review), /Saving text to this device\s+may fail/);
    assert.doesNotMatch(text(review), /Text fields\s+are saved on this device/);
    submit(review);
    assert.equal(app.state.draft.status, 'saved');
    assert.equal(app.state.draft.mode, 'create');
    assert.equal(app.state.draft.make, 'Toyota');
    const complete = app.render({ mode: 'create' });
    if (saved) {
      assert.match(text(complete), /Draft saved/);
      assert.match(text(complete), /Your draft is stored in this browser/);
    } else {
      assert.match(text(complete), /Draft kept for this session/);
      assert.match(text(complete), /Saving is unavailable/);
      assert.doesNotMatch(text(complete), /Draft saved|Your draft is stored in this browser/);
    }
    assert.equal(button(complete, 'Back to Sell').props.href, '/sell');
  });
