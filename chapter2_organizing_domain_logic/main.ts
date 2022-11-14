import { serve } from "./deps.ts";

import { Presentation } from "./lib/presentation.ts";

const port = 8080;

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(Presentation.handler, { port });
