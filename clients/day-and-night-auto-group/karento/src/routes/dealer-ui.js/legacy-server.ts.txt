import script from '../../lib/server/dealer-ui.js?raw';

export function GET() {
  return new Response(script, { headers: {
    'content-type': 'text/javascript; charset=utf-8',
    'cache-control': 'no-cache'
  } });
}
