import { serve } from './deps.ts';

import { DataSource } from './lib/data_source.ts';
import { Presentation } from './lib/presentation.ts';

const port = 8080;

const handler = async (_request: Request): Promise<Response> => {
  const presentation = new Presentation();
  const html = presentation.render();

  const dataSourse = new DataSource();
  console.log(await dataSourse.list());

  return new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
};

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(handler, { port });
