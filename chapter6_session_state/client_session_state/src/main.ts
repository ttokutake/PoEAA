import { serve, dirname, fromFileUrl } from "../deps.ts";

const port = 8080;

const __dirname = dirname(fromFileUrl(import.meta.url));
const indexHtml = await Deno.readTextFile(
  `${__dirname}/index.html`,
);

function handler(request: Request): Response {
  const _url = new URL(request.url);

  return new Response(indexHtml, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(handler, { port });
