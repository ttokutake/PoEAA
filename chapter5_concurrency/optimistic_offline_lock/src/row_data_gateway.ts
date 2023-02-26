import { client } from "./postgres_client.ts";

interface CrewsRow {
  id: number;
  name: string;
  bounty: bigint;
  version: number;
}

export class Crew {
  constructor(
    private _id: number,
    public name: string,
    public bounty: bigint,
    private version: number,
  ) {}

  get id(): number {
    return this._id;
  }

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO crews (id, name, bounty, version)
      VALUES (${this.id}, ${this.name}, ${this.bounty}, ${this.version})
    `;
  }

  async update(): Promise<void> {
    const result = await client.queryArray`
      UPDATE crews
      SET name=${this.name}, bounty=${this.bounty}, version=${this.version + 1}
      WHERE id=${this.id} AND version=${this.version}
    `;
    if (!result.rowCount) {
      throw new Error("Conflict Occurred");
    }
  }

  static async find(id: number): Promise<Crew> {
    const { rows: [row] } = await client.queryObject<CrewsRow>`
      SELECT id, name, bounty, version
      FROM crews
      WHERE id = ${id}
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    return new Crew(row.id, row.name, row.bounty, row.version);
  }
}
