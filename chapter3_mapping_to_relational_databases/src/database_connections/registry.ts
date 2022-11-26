import { Client } from "../../deps.ts";

const connectionParams = {
  user: "postgres",
  password: "password",
  database: "postgres",
  hostname: "db",
  port: 5432,
};

class Registry {
  static _client = new Client(connectionParams);

  static get client() {
    return this._client;
  }
}

export class Presentation {
  static async handler(_request: Request): Promise<Response> {
    const domainModel = await Domain.domainModel();

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
  static domainModel(): Promise<DomainModel> {
    const dataSource = new DataSource();
    return dataSource.find(1);
  }
}

class DataSource {
  async find(id: number): Promise<DomainModel> {
    await Registry.client.connect();
    const { rows: [row] } = await Registry.client.queryObject<DomainModel>`
      SELECT id, name
      FROM crews
      WHERE id = ${id}
    `;
    await Registry.client.end();
    return row;
  }
}
