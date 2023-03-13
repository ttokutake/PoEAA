import { serve } from "../deps.ts";

const port = 8080;

function handler(request: Request): Promise<Response> {
  // const url = new URL(request.url);

  const html = `
    <html>
      <head>
        <title>Layering</title>
      </head>
      <body>
        <p>hello, world!</p>
      </body>
    </html>
  `;

  return new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(handler, { port });
