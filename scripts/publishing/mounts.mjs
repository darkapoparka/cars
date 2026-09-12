import fs from 'node:fs/promises';

const read = (files, name) => {
  if (!files.has(name)) throw new Error(`Required packaging source is missing: ${name}`);
  return files.get(name).toString('utf8').replace(/\r\n/g, '\n');
};
const write = (files, name, text) => files.set(name, Buffer.from(text));
const edit = (files, name, transform) => write(files, name, transform(read(files, name)));
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function changeOnce(text, before, after, label) {
  if (text.includes(after)) return text;
  const matches = text.split(before).length - 1;
  if (matches !== 1) throw new Error(`Expected one ${label} anchor; found ${matches}`);
  return text.replace(before, after);
}

function addImport(text, name, anchor, label) {
  const statement = `import { ${name} } from '$lib/utils/preview-paths';`;
  if (text.includes(statement)) return text;
  return changeOnce(text, anchor, `${anchor}\n\t${statement}`, label);
}

function insertSwitcher(text, label, jsx = false) {
  const source = '/preview-switcher.js';
  if (text.includes('preview-switcher.js')) {
    if (!text.includes(`src="${source}"`) || (text.match(/preview-switcher\.js/g) ?? []).length !== 1) {
      throw new Error(`Unknown or repeated existing switcher in ${label}`);
    }
    return text;
  }
  return jsx
    ? changeOnce(text, '<head>', '<head>\n        <script defer src="/preview-switcher.js" />', label)
    : changeOnce(text, '</head>', '  <script defer src="/preview-switcher.js"></script>\n</head>', label);
}

const codeExtensions = /\.(?:[cm]?[jt]sx?|svelte|css|html|json)$/i;
const sourceCode = (name, key) => name.startsWith(`${key}/src/`) && codeExtensions.test(name) && !/\.(?:test|spec)\./.test(name);

function mountSourceUrls(text, base) {
  // Only URL contexts: do not rewrite route IDs, comparison strings or type unions.
  let result = text.replace(/(["'`])\/(assets|brand|dealer|fonts|_previews|api)\//g, `$1${base}/$2/`);
  result = result.replace(/(\$\{(?:origin|siteOrigin)\})\/(assets|brand|dealer|fonts|_previews)\//g, `$1${base}/$2/`);
  result = result.replace(/\b(href|src|action|content)=(['"])\/(?!\/|preview-switcher\.js|variant-[23](?:\/|[?'"#]))/g, `$1=$2${base}/`);
  result = result.replace(/(["'`])\/(favicon\.(?:ico|png|svg)|apple-touch-icon\.png|robots\.txt)(?=["'`?#])/g, `$1${base}/$2`);
  result = result.replace(/url\(\s*(['"]?)\/(assets|brand|dealer|fonts|_previews)\//g, `url($1${base}/$2/`);
  result = result.replace(/(redirect\(\s*\d+\s*,\s*['"`])\/(?!\/|variant-[23](?:\/|[?'"`#]))/g, `$1${base}/`);
  // This component takes a RouteId union and calls the idempotent resolve wrapper.
  result = result.replace(/<HomeSectionCta\b[^>]*>/g, (tag) => tag.replace(new RegExp(`(\\bhref=['"])${escapeRegex(base)}/`, 'g'), '$1/'));
  return result;
}

function classifySvelteMount(files, key, base) {
  const configName = `${key}/svelte.config.js`;
  const config = read(files, configName);
  const helper = files.get(`${key}/src/lib/utils/preview-paths.ts`)?.toString('utf8');
  const paths = config.match(/\bpaths\s*:\s*\{([^}]*)\}/);
  if (paths) {
    const existingBase = paths[1].match(/\bbase\s*:\s*['"]([^'"]+)['"]/)?.[1];
    if (existingBase !== base || !/\brelative\s*:\s*false\b/.test(paths[1])) throw new Error(`Unknown ${key} paths configuration; expected ${base} with relative: false`);
    if (!helper || !helper.includes('function previewPath(') || !helper.includes('function localPath(') || !helper.includes('isMounted')) {
      throw new Error(`Unknown hybrid ${key} mount: paths.base exists without the known idempotent path helper`);
    }
  } else {
    if (helper) throw new Error(`Unknown hybrid ${key} mount: helper exists without paths.base`);
    for (const [name, content] of files) {
      if (sourceCode(name, key) && /['"`]\/variant-[23](?:\/|['"`?#])/.test(content.toString('utf8'))) {
        throw new Error(`Unknown hybrid ${key} mount: prefixed source without paths.base in ${name}`);
      }
    }
    edit(files, configName, (text) => {
      const kit = text.match(/\bkit:\s*\{\n/);
      if (!kit) throw new Error(`Missing ${key} kit configuration anchor`);
      return changeOnce(text, kit[0], `${kit[0]}\t\tpaths: { base: '${base}', relative: false },\n`, `${key} kit configuration`);
    });
  }
  for (const [name, content] of files) {
    if (sourceCode(name, key)) {
      for (const match of content.toString('utf8').matchAll(/['"`]\/(variant-[23])(?=\/|['"`?#])/g)) {
        if (`/${match[1]}` !== base) throw new Error(`Unexpected cross-variant source mount in ${name}: /${match[1]}`);
      }
    }
  }
}

async function mountSvelte(files, key, base) {
  classifySvelteMount(files, key, base);
  const helperName = `${key}/src/lib/utils/preview-paths.ts`;
  write(files, helperName, await fs.readFile(new URL('./preview-paths.ts.txt', import.meta.url), 'utf8'));
  for (const [name] of files) {
    if (name === helperName) continue;
    const isStaticText = name.startsWith(`${key}/static/`) && /\.(?:css|js|html)$/.test(name);
    if (!sourceCode(name, key) && !isStaticText) continue;
    edit(files, name, (text) => mountSourceUrls(text.replace(/from (['"])\$app\/paths\1/g, "from '$lib/utils/preview-paths'"), base));
  }
  edit(files, `${key}/src/app.html`, (text) => insertSwitcher(text, `${key} app head`));
  const layoutName = `${key}/src/routes/+layout.svelte`;
  edit(files, layoutName, (text) => {
    const anchor = key === 'carwow' ? "import '$lib/styles/desktop-controls.css';" : "import { page } from '$app/state';";
    text = addImport(text, 'localPath', anchor, `${key} layout import`);
    if (key === 'carwow') {
      for (const [before, after] of [
        ['getRouteBodyClasses(page.url.pathname)', 'getRouteBodyClasses(localPath(page.url.pathname))'],
        ['routeManagesOwnChrome(page.url.pathname)', 'routeManagesOwnChrome(localPath(page.url.pathname))'],
        ["page.url.pathname.startsWith('/admin')", "localPath(page.url.pathname).startsWith('/admin')"],
        ["page.url.pathname.startsWith('/favorites')", "localPath(page.url.pathname).startsWith('/favorites')"],
        ["page.url.pathname.startsWith('/presentation')", "localPath(page.url.pathname).startsWith('/presentation')"],
        ['pathname={page.url.pathname}', 'pathname={localPath(page.url.pathname)}'],
      ]) text = changeOnce(text, before, after, `Carwow layout ${before}`);
    } else {
      for (const variable of ['isInventoryDetailPage', 'isDashboardArea', 'allowsBottomNavInDashboard']) {
        const pattern = new RegExp(`(\\blet ${variable} = [^\\n]+)`);
        if (!pattern.test(text)) throw new Error(`Missing Import layout ${variable} anchor`);
        text = text.replace(pattern, (line) => line.replace(/(?<!localPath\()page\.url\.pathname/g, 'localPath(page.url.pathname)'));
      }
      for (const component of ['SiteHeader', 'MobileBottomNav']) {
        const pattern = new RegExp(`<${component}\\b[^>]*>`);
        if (!pattern.test(text)) throw new Error(`Missing Import layout ${component} anchor`);
        text = text.replace(pattern, (tag) => tag.replace(/(?<!localPath\()page\.url\.pathname/g, 'localPath(page.url.pathname)'));
      }
    }
    return text;
  });
  if (key === 'carwow') {
    edit(files, `${key}/src/hooks.server.ts`, (text) => {
      const statement = "import { localPath } from '$lib/utils/preview-paths';";
      if (!text.includes(statement)) text = `${statement}\n${text}`;
      return changeOnce(text, 'getRouteBodyClasses(event.url.pathname)', 'getRouteBodyClasses(localPath(event.url.pathname))', 'Carwow hooks route classification');
    });
  }
  const renderer = `${key}/src/lib/server/${key === 'carwow' ? 'daynight-template-renderer' : 'auxero-template'}.ts`;
  edit(files, renderer, (text) => {
    const statement = key === 'carwow' ? "import { previewHtml } from '$lib/utils/preview-paths';" : "import { previewHtml, previewPath } from '$lib/utils/preview-paths';";
    if (!text.includes(statement)) text = `${statement}\n${text}`;
    const before = key === 'carwow'
      ? 'return injectLocalBehavior(withSharedHeader, templateFile);'
      : 'return injectLocalBehavior(withAccessibilityLabels, templateFile, options);';
    const after = before.replace('return ', 'return previewHtml(').replace(/;$/, ');');
    text = changeOnce(text, before, after, `${key} raw HTML return`);
    // Original relative source assets must still match before mounting output.
    text = text.replaceAll(`replaceAll('./${base.slice(1)}/assets/', '${base}/assets/')`, `replaceAll('./assets/', '${base}/assets/')`);
    if (key === 'import') {
      text = changeOnce(text, 'location: canonicalRoute,', 'location: previewPath(canonicalRoute),', 'Import raw response redirect');
    }
    return text;
  });
}

function mountModern(files) {
  const base = '/variant-2';
  const configName = 'modern/apps/web/next.config.ts';
  const current = read(files, configName);
  const configured = current.match(/\bbasePath\s*[:=]\s*['"]([^'"]+)['"]/)?.[1];
  if (configured && configured !== base) throw new Error(`Unknown Modern basePath: ${configured}`);
  const proxy = read(files, 'modern/apps/web/proxy.ts');
  if (configured && !proxy.includes('x-dealer-locale-rewrite')) throw new Error('Unknown hybrid Modern mount: basePath exists without the locale proxy guard');
  if (!configured && proxy.includes('x-dealer-locale-rewrite')) throw new Error('Unknown hybrid Modern mount: locale proxy exists without basePath');
  for (const [name] of files) {
    if (!name.startsWith('modern/') || !codeExtensions.test(name) || /\.(?:test|spec)\./.test(name)) continue;
    edit(files, name, (text) => text
      .replace(/(["'`])\/(assets\/|images\/|lead-)/g, '$1/variant-2/$2')
      .replace(/url\(\s*(['"]?)\/(assets\/|images\/|lead-)/g, 'url($1/variant-2/$2'));
  }
  edit(files, configName, (text) => {
    const anchor = 'nextConfig.images = nextConfig.images ?? {};';
    if (!configured) text = changeOnce(text, anchor, `nextConfig.basePath = "/variant-2";\n\n${anchor}`, 'Modern basePath');
    return changeOnce(text, anchor, `${anchor}\nnextConfig.images.unoptimized = true;`, 'Modern direct image serving');
  });
  edit(files, 'modern/packages/next-config/index.ts', (text) => changeOnce(text,
    'outputFileTracingRoot: monorepoRoot,', 'outputFileTracingRoot: resolve(monorepoRoot, ".."),', 'Modern tracing root'));
  edit(files, 'modern/apps/web/package.json', (text) => {
    const pkg = JSON.parse(text);
    pkg.engines = { ...pkg.engines, node: '22.x' };
    return `${JSON.stringify(pkg, null, 2)}\n`;
  });
  edit(files, 'modern/apps/web/env.ts', (text) => {
    if (!text.includes('const origin = process.env.VERCEL_URL')) {
      const origin = '  const origin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3001";\n  process.env.NEXT_PUBLIC_WEB_URL ??= origin;\n  process.env.NEXT_PUBLIC_APP_URL ??= origin;\n  process.env.NEXT_PUBLIC_API_URL ??= origin;\n';
      text = changeOnce(text, 'if (leadSite.staticDemoMode) {\n', `if (leadSite.staticDemoMode) {\n${origin}`, 'Modern static demo origin');
    }
    return changeOnce(text, 'assertRuntimeEnvironmentContract({', 'if (!leadSite.staticDemoMode) assertRuntimeEnvironmentContract({', 'Modern conditional environment contract');
  });
  edit(files, 'modern/apps/web/app/[locale]/layout.tsx', (text) => insertSwitcher(text, 'Modern layout head', true));
  edit(files, 'modern/packages/marketplace-ui/components/marketplace-locale-switch-link.tsx', (text) => {
    for (const value of ['href', 'targetPath']) text = changeOnce(text, `href={${value}}`, `href={\`/variant-2\${${value}}\`}`, `Modern raw locale ${value}`);
    return text;
  });
  edit(files, 'modern/apps/web/proxy.ts', (text) => {
    if (text.includes('x-dealer-locale-rewrite')) {
      if (!text.includes('NextResponse.rewrite') || !text.includes('/variant-2')) throw new Error('Unknown Modern locale rewrite shape');
      return text;
    }
    const anchor = 'const publicProxy: NextProxy = async (request, event) => {\n  const headersResponse = await securityHeaders();\n';
    const block = `  if (leadSite.staticDemoMode) {
    const path = request.nextUrl.pathname.replace(/^\\/variant-2(?=\\/|$)/, "") || "/";
    if (request.headers.get("x-dealer-locale-rewrite") === "1" || /^\\/bg(?:\\/|$)/.test(path)) return headersResponse;
    const localePath = /^\\/(bg|en)(\\/|$)/.test(path) ? path.replace(/^\\/en(?=\\/|$)/, "/bg") : \`/bg\${path === "/" ? "" : path}\`;
    const url = new URL(\`/variant-2\${localePath}\${request.nextUrl.search}\`, request.url);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-dealer-locale-rewrite", "1");
    const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    for (const [key, value] of headersResponse.headers) { if (key !== "x-middleware-next") response.headers.set(key, value); }
    return response;
  }
`;
    return changeOnce(text, anchor, anchor + block, 'Modern locale proxy');
  });
}

export async function applyMounts(files, manifest) {
  edit(files, 'auto-best/src/app.html', (text) => insertSwitcher(text, 'Auto Best app head'));
  if (manifest.variants[1].key === 'modern') mountModern(files);
  else await mountSvelte(files, 'import', '/variant-2');
  await mountSvelte(files, 'carwow', '/variant-3');
}
