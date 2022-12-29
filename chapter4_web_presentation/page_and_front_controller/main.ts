import { serve } from "./deps.ts";
import { FrontController } from "./src/front_controller.ts";

const port = 8080;

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(FrontController.handler, { port });
