import { Crew, Domain } from "./domain.ts";

export class Presentation {
  constructor(private domain: Domain) {
    this.handler = this.handler.bind(this);
  }

  async handler(_request: Request): Promise<Response> {
    const pirate = await this.domain.strawHatPirates();

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
        </body>
      </html>
    `;

    return new Response(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
}
