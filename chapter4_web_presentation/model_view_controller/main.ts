import { serve } from "./deps.ts";
import { Controller } from "./src/controller.ts";

const port = 8080;

const handler = (request: Request) => {
  return Controller.index(request);
};

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(handler, { port });
