import { client } from "../postgres_client.ts";

interface Row {
  id: number;
  name: string;
  bounty: bigint;
}

type RecordSet = Row[];

export class CrewGateway {
  async insert(name: string, bounty: bigint): Promise<void> {
    await client.queryArray`
      INSERT INTO crews (name, bounty)
      VALUES (${name}, ${bounty})
    `;
  }

  async update(id: number, name: string, bounty: bigint): Promise<void> {
    await client.queryArray`
      UPDATE crews
      SET name=${name}, bounty=${bounty}
      WHERE id=${id}
    `;
  }

  async delete(id: number): Promise<void> {
    await client.queryArray`
      DELETE FROM crews
      WHERE id=${id}
    `;
  }

  async find(id: number): Promise<RecordSet> {
    const { rows } = await client.queryObject<Row>`
      SELECT id, name, bounty
      FROM crews
      WHERE id = ${id}
      LIMIT 1
    `;
    return rows;
  }
}
