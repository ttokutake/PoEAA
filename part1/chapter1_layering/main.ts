import { serve } from "./deps.ts";

import { DataSource } from "./lib/data_source.ts";
import { Domain } from "./lib/domain.ts";
import { Presentation } from "./lib/presentation.ts";

const port = 8080;

const domain = new Domain(DataSource);
const presentation = new Presentation(domain);

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(presentation.handler, { port });
