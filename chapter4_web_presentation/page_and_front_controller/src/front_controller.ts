import { IndexController } from "./index_controller.ts";
import { CrewController } from "./crew_controller.ts";

export class FrontController {
  static handler(request: Request) {
    const url = new URL(request.url);
    switch (true) {
      case url.pathname === "/crew":
        return CrewController.page(request);
      default:
        return IndexController.page(request);
    }
  }
}
