import { IndexController } from "./index_controller.ts";
import { CrewController, PATH_REGEXP } from "./crew_controller.ts";

export class FrontController {
  static handler(request: Request) {
    const url = new URL(request.url);
    switch (true) {
      case PATH_REGEXP.test(url.pathname):
        return CrewController.page(request);
      default:
        return IndexController.page(request);
    }
  }
}
