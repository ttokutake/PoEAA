import { CrewFacade } from "./facade.ts";

export class Presentation {
  static async handler(_request: Request): Promise<Response> {
    const crewData = await CrewFacade.fetch(1);
    const specialMoveContent = crewData.specialMoves
      .map((s) => `<li>${s.name}</li>`)
      .join("");

    const html = `
      <html>
        <head>
          <title>Distribution Strategies</title>
        </head>
        <body>
          <div>name: ${crewData.name}</div>
          <div>bounty: ${crewData.bounty}</div>
          <div>
            special move:
            <ul>${specialMoveContent}</ul>
          </div>
        </body>
      </html>
    `;

    return new Response(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
}
