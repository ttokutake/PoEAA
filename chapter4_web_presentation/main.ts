import { handlebarsEngine, serve } from "./deps.ts";

const template = `
  <html>
    <head>
      <title>Web Presentation</title>
    </head>
    <body>
      <div>{{method}} {{url}}</div>
    </body>
  </html>
`;

const port = 8080;

const handler = async (request: Request) => {
  const params = {
    method: request.method,
    url: request.url,
  };
  const html = await handlebarsEngine(template, params);
  return new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
};

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(handler, { port });
