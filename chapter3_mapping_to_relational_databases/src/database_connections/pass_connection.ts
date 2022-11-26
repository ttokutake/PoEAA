import { Client } from "../../deps.ts";

const connectionParams = {
  user: "postgres",
  password: "password",
  database: "postgres",
  hostname: "db",
  port: 5432,
};

export class Presentation {
  static async handler(_request: Request): Promise<Response> {
    const client = new Client(connectionParams);
    await client.connect();

    const domainModel = await Domain.domainModel(client);

    await client.end();

    const html = `
      <html>
        <title>Database Connections</title>
        <body>
          <div>ID: ${domainModel.id}</div>
          <div>Name: ${domainModel.name}</div>
        </body>
      </html>
    `;

    return new Response(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
}

interface DomainModel {
  id: number;
  name: string;
}

class Domain {
  static domainModel(client: Client): Promise<DomainModel> {
    const dataSource = new DataSource(client);
    return dataSource.find(1);
  }
}

class DataSource {
  constructor(
    private client: Client,
  ) {}

  async find(id: number): Promise<DomainModel> {
    const { rows: [row] } = await this.client.queryObject<DomainModel>`
      SELECT id, name
      FROM crews
      WHERE id = ${id}
    `;
    return row;
  }
}
