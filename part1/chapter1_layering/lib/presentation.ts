import { Crew, Domain } from "./domain.ts";

export class Presentation {
  constructor(private domain: Domain) {
    this.handler = this.handler.bind(this);
  }

  async handler(_request: Request): Promise<Response> {
    const crews = await this.domain.doComplexThings();

    const content = crews
      .map((crew: Crew) => {
        return `<li>${crew.name}${crew.isDanger() ? " (Danger)" : ""}</li>`;
      })
      .join("");

    const html = `
      <html>
        <title>Layering</title>
        <body>
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
