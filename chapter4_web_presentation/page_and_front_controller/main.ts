import { serve } from "./deps.ts";
import { IndexController } from "./src/index_controller.ts";
import { CrewController, PATH_REGEXP } from "./src/crew_controller.ts";

const port = 8080;

// NOTE: This handler plays a role as Front Controller
const handler = (request: Request) => {
  const url = new URL(request.url);
  switch (true) {
    case PATH_REGEXP.test(url.pathname):
      return CrewController.page(request);
    default:
      return IndexController.page(request);
  }
};

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(handler, { port });
