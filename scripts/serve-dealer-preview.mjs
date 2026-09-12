import http from 'node:http';
import net from 'node:net';

const port = Number(process.argv[2]);
if (!Number.isInteger(port) || port < 1024 || port > 65531) throw new Error('Supply an explicitly free base port');
const upstreamPort = (url) => /^\/variant-2(?:\/|$)/.test(url) ? port + 2 : /^\/variant-3(?:\/|$)/.test(url) ? port + 3 : port + 1;
const server = http.createServer((request, response) => {
  const upstream = http.request({ hostname: '127.0.0.1', port: upstreamPort(request.url), path: request.url, method: request.method, headers: request.headers }, result => {
    response.writeHead(result.statusCode, result.headers); result.pipe(response);
  });
  upstream.on('error', () => { response.writeHead(502); response.end('The selected local preview is not running.'); });
  request.pipe(upstream);
});
server.on('upgrade', (request, socket, head) => {
  const upstream = net.connect(upstreamPort(request.url), '127.0.0.1', () => {
    upstream.write(`${request.method} ${request.url} HTTP/${request.httpVersion}\r\n${Object.entries(request.headers).map(([key, value]) => `${key}: ${value}`).join('\r\n')}\r\n\r\n`);
    if (head.length) upstream.write(head);
    socket.pipe(upstream).pipe(socket);
  });
  upstream.on('error', () => socket.destroy()); socket.on('error', () => upstream.destroy());
});
server.listen(port, '127.0.0.1', () => console.log(`Combined dealer preview: http://127.0.0.1:${port}`));
