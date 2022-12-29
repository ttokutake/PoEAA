import { dirname, fromFileUrl, HandlebarsJS } from "../deps.ts";

import { Crew } from "./model.ts";

const __dirname = dirname(fromFileUrl(import.meta.url));

const crewTemplate = await Deno.readTextFile(
  `${__dirname}/crew.html.mustache`,
);
const crewView = HandlebarsJS.compile(crewTemplate);

export const PATH_REGEXP = new RegExp("^/crew/(\\d+)");

export class CrewController {
  static page(request: Request): Response {
    const url = new URL(request.url);
    const result = url.pathname.match(PATH_REGEXP);
    if (result == null) {
      throw new Error("Internal Error");
    }
    const crew = Crew.find(parseInt(result[1]));
    const html = crewView({ crew });
    return new Response(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
}
