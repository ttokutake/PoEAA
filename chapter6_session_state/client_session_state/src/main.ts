import { dirname, fromFileUrl, serve } from "../deps.ts";

const port = 8080;

const __dirname = dirname(fromFileUrl(import.meta.url));
const indexHtml = await Deno.readTextFile(
  `${__dirname}/index.html`,
);
const nextHtml = await Deno.readTextFile(
  `${__dirname}/next.html`,
);
const confirmHtml = await Deno.readTextFile(
  `${__dirname}/confirm.html`,
);
const completeHtml = await Deno.readTextFile(
  `${__dirname}/complete.html`,
);

function handler(request: Request): Response {
  const url = new URL(request.url);

  let html;
  switch (url.pathname) {
    case "/next":
      html = nextHtml;
      break;
    case "/confirm":
      html = confirmHtml;
      break;
    case "/complete":
      // NOTE: Save sent data into a database here!
      html = completeHtml;
      break;
    default:
      html = indexHtml;
  }

  return new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(handler, { port });
