// This module is also copied into a generated Workers package. Keep it free of
// Node dependencies and request-scoped global state.
export function createDealerRouter({ variants, redirects = [] }) {
  if (!Array.isArray(variants) || variants.length !== 6
    || new Set(variants.map(v => v.base)).size !== 6
    || variants.some(v => !/^(?:|\/variant-[2-6])$/.test(v.base)
      || !/^CARS_[A-Z_]+$/.test(v.binding) || !v.entry.startsWith((v.base || '') + '/'))) {
    throw Error('Invalid six-design Cloudflare routing table');
  }
  const ordered = [...variants].sort((a, b) => b.base.length - a.base.length);
  for (const rule of redirects) {
    if (!rule.source?.startsWith('/') || !rule.destination?.startsWith('/')
      || rule.destination.startsWith('//')
      || (rule.has ?? []).some(c => c.type !== 'query' || typeof c.key !== 'string' || typeof c.value !== 'string')) {
      throw Error('Unsupported Cloudflare legacy redirect');
    }
  }
  const protect = response => {
    const headers = new Headers(response.headers);
    headers.set('X-Robots-Tag', 'noindex, nofollow');
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  };
  return {
    async fetch(request, env) {
      const url = new URL(request.url);
      const readonly = ['GET', 'HEAD'].includes(request.method);
      if (readonly && ['/preview-switcher.js', '/robots.txt'].includes(url.pathname)) {
        return protect(await env.ASSETS.fetch(request));
      }
      if (readonly) {
        const legacy = redirects.find(r => r.source === url.pathname
          && (r.has ?? []).every(c => url.searchParams.get(c.key) === c.value));
        const bare = ordered.find(v => v.base && v.base === url.pathname);
        const destination = legacy?.destination ?? bare?.entry;
        if (destination) {
          const target = new URL(destination, url);
          const destinationKeys = new Set(target.searchParams.keys());
          for (const [key, value] of url.searchParams) if (!destinationKeys.has(key)) target.searchParams.append(key, value);
          return protect(new Response(null, { status: legacy?.permanent ? 308 : 307, headers: { Location: target.href } }));
        }
      }
      const variant = ordered.find(v => !v.base || url.pathname === v.base || url.pathname.startsWith(v.base + '/'));
      const service = env[variant.binding];
      if (!service?.fetch) return protect(new Response('Preview service unavailable', { status: 503 }));
      const headers = new Headers(request.headers);
      // The only public ingress overwrites geography hints. Internal family
      // Workers have workers_dev:false and receive this header by binding.
      headers.delete('x-cars-country');
      headers.delete('x-vercel-ip-country');
      const country = request.cf?.country;
      if (typeof country === 'string' && /^[A-Z]{2}$/.test(country) && country !== 'XX') headers.set('x-cars-country', country);
      return protect(await service.fetch(new Request(request, { headers })));
    }
  };
}

export default createDealerRouter({"variants":[{"key":"auto-best","entry":"/","base":"","binding":"CARS_AUTO_BEST","worker":"cars-uk-batley-as-motor-group-auto-best"},{"key":"modern","entry":"/variant-2/cars","base":"/variant-2","binding":"CARS_MODERN","worker":"cars-uk-batley-as-motor-group-modern"},{"key":"import","entry":"/variant-3/","base":"/variant-3","binding":"CARS_IMPORT","worker":"cars-uk-batley-as-motor-group-import"},{"key":"app","entry":"/variant-4/","base":"/variant-4","binding":"CARS_APP","worker":"cars-uk-batley-as-motor-group-app"},{"key":"mobile","entry":"/variant-5/","base":"/variant-5","binding":"CARS_MOBILE","worker":"cars-uk-batley-as-motor-group-mobile"},{"key":"karento-best","entry":"/variant-6/","base":"/variant-6","binding":"CARS_KARENTO_BEST","worker":"cars-uk-batley-as-motor-group-signature"}],"redirects":[]});
