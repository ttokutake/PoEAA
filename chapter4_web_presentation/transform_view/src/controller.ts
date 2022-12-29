import { dirname, fromFileUrl } from "../deps.ts";

const __dirname = dirname(fromFileUrl(import.meta.url));
const script = await Deno.readTextFile(
  `${__dirname}/index.js`,
);

export class Controller {
  static index(_request: Request): Response {
    const html = `
      <html>
        <head>
          <title>Transform View</title>
          <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        </head>
        <body>
          <div id="root"></div>
          <script>${script}</script>
        </body>
      </html>
    `;
    return new Response(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
}
