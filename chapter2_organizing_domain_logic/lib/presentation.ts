import { Crew } from "./domain.ts";
import { StrawHatPiratesService } from "./service.ts";

export class Presentation {
  static async handler(_request: Request): Promise<Response> {
    const pirate = await StrawHatPiratesService.list();

    const content = pirate.crews
      .map((crew: Crew) => {
        return `<li>${crew.name}${crew.isDanger() ? " (Danger)" : ""}</li>`;
      })
      .join("");

    const html = `
      <html>
        <title>Organizing Domain Logic</title>
        <body>
          <div>Total Bounty: ${pirate.totalBounty}</div>
          <ul>
            ${content}
          </ul>
        </body>
      </html>
    `;

    return new Response(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
}
