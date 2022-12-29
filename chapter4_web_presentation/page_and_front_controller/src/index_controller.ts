import { dirname, fromFileUrl, HandlebarsJS } from "../deps.ts";

import { Crew } from "./model.ts";

const __dirname = dirname(fromFileUrl(import.meta.url));

const indexTemplate = await Deno.readTextFile(
  `${__dirname}/index.html.mustache`,
);
const indexView = HandlebarsJS.compile(indexTemplate);

export class IndexController {
  static page(_request: Request): Response {
    const crews = Crew.findAll();
    const html = indexView({ crews });
    return new Response(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
}
