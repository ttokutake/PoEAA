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

interface CrewsRow {
  id: number;
  name: string;
  bounty: bigint;
}

type RecordSet = CrewsRow[];

export class CrewGateway {
  async insert(id: number, name: string, bounty: bigint): Promise<void> {
    await Registry.client.connect();
    await Registry.client.queryArray`
      INSERT INTO crews (id, name, bounty)
      VALUES (${id}, ${name}, ${bounty})
    `;
    await Registry.client.end();
  }

  async find(id: number): Promise<RecordSet> {
    await Registry.client.connect();
    const { rows } = await Registry.client.queryObject<CrewsRow>`
      SELECT id, name
      FROM crews
      WHERE id = ${id}
    `;
    await Registry.client.end();
    return rows;
  }
}
