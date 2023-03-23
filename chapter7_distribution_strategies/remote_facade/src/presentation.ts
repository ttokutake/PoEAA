import { CrewFacade } from "./facade.ts";

export class Presentation {
  static handler(_request: Request): Response {
    const crewData = CrewFacade.fetch(1);

    const html = `
      <html>
        <head>
          <title>Distribution Strategies</title>
        </head>
        <body>
          <div>name: ${crewData.name}</div>
          <div>bounty: ${crewData.bounty}</div>
        </body>
      </html>
    `;

    return new Response(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
}
