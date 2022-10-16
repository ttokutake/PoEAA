import { serve } from './deps.ts';

import { Presentation } from './lib/presentation.ts';

const port = 8080;

const handler = (_request: Request): Response => {
  const presentation = new Presentation();
  const html = presentation.render();

  return new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
};

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(handler, { port });
