import { client } from "../postgres_client.ts";

interface CrewsRow {
  id: number;
  name: string;
  bounty: bigint;
}

type RecordSet = CrewsRow[];

export class CrewGateway {
  private identityMap: { [id: number]: CrewsRow } = {};

  async insert(id: number, name: string, bounty: bigint): Promise<void> {
    await client.queryArray`
      INSERT INTO crews (id, name, bounty)
      VALUES (${id}, ${name}, ${bounty})
    `;
  }

  async delete(id: number): Promise<void> {
    await client.queryArray`
      DELETE FROM crews
      WHERE id=${id}
    `;
  }

  async find(id: number): Promise<RecordSet> {
    if (this.identityMap[id]) {
      return [this.identityMap[id]];
    }

    const { rows } = await client.queryObject<CrewsRow>`
      SELECT id, name, bounty
      FROM crews
      WHERE id = ${id}
    `;

    if (rows.length) {
      const [row] = rows;
      this.identityMap[row.id] = row;
    }

    return rows;
  }

  clearIdentityMap() {
    this.identityMap = {};
  }
}
