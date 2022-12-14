import { dirname, fromFileUrl, handlebarsEngine } from "../deps.ts";

const __dirname = dirname(fromFileUrl(import.meta.url));
const htmlTemplate = await Deno.readTextFile(`${__dirname}/view.html.mustache`);

export class Controller {
  static async index(request: Request): Promise<Response> {
    // TODO: Model
    const params = {
      method: request.method,
      url: request.url,
    };
    const html = await handlebarsEngine(htmlTemplate, params);
    return new Response(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
}
