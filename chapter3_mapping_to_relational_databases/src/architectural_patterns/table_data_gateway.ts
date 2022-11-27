import { client } from "../postgres_client.ts";

interface CrewsRow {
  id: number;
  name: string;
  bounty: bigint;
}

type RecordSet = CrewsRow[];

export class CrewGateway {
  async insert(id: number, name: string, bounty: bigint): Promise<void> {
    await client.queryArray`
      INSERT INTO crews (id, name, bounty)
      VALUES (${id}, ${name}, ${bounty})
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
    const { rows } = await client.queryObject<CrewsRow>`
      SELECT id, name, bounty
      FROM crews
      WHERE id = ${id}
    `;
    return rows;
  }
}
