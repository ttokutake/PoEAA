import { dirname, fromFileUrl, HandlebarsJS } from "../deps.ts";

import { Crew } from "./model.ts";

const __dirname = dirname(fromFileUrl(import.meta.url));

const crewTemplate = await Deno.readTextFile(
  `${__dirname}/crew.html.mustache`,
);
const crewView = HandlebarsJS.compile(crewTemplate);

export class CrewController {
  static page(request: Request): Response {
    const url = new URL(request.url);
    const idString = url.searchParams.get("id") || '';
    const crew = Crew.find(parseInt(idString));
    const html = crewView({ crew });
    return new Response(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
}
