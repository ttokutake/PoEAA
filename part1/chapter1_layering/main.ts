import { serve } from './deps.ts';

import { DataSource } from './lib/data_source.ts';
import { Domain } from './lib/domain.ts';
import { Presentation } from './lib/presentation.ts';

const port = 8080;

const domain = new Domain(DataSource);
const presentation = new Presentation(domain);

const handler = async (_request: Request): Promise<Response> => {
  const html = await presentation.render();

  return new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
};

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(handler, { port });
