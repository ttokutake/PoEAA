import { Crew, Domain } from "./domain.ts";

export class Presentation {
  static async handler(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const isAsc = url.searchParams.get("direction") != "desc";

    const pirate = await Domain.listStrawHatPirates(isAsc);

    const content = pirate.crews
      .map((crew: Crew) => {
        return `<li>${crew.name}${crew.isDanger() ? " (Danger)" : ""}</li>`;
      })
      .join("");

    const html = `
      <html>
        <title>Layering</title>
        <body>
          <div>Total Bounty: ${pirate.totalBounty}</div>
          <ul>
            ${content}
          </ul>
          <div>
            <a href="?direction=asc">List by ascending order</a>
            <a href="?direction=desc">List by descending order</a>
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
