import { Row, TableDataGateway } from "./data_source.ts";
import { TableModule } from "./domain.ts";

export class Presentation {
  static async handler(_request: Request): Promise<Response> {
    const recordSet = await TableDataGateway.findAll();
    const tableModule = new TableModule(recordSet);

    const content = tableModule.crews
      .map((crew: Row) => {
        return `<li>${crew.name}${
          tableModule.isDanger(crew.id) ? " (Danger)" : ""
        }</li>`;
      })
      .join("");

    const html = `
      <html>
        <title>Organizing Domain Logic</title>
        <body>
          <div>Total Bounty: ${tableModule.totalBounty()}</div>
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
