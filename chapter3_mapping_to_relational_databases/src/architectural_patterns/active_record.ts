import { client } from "../postgres_client.ts";

interface CrewsRow {
  id: number;
  name: string;
  bounty: bigint;
}

export class Crew {
  constructor(
    private _id: number,
    public name: string,
    public bounty: bigint,
  ) {}

  get id(): number {
    return this._id;
  }

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO crews (id, name, bounty)
      VALUES (${this.id}, ${this.name}, ${this.bounty})
    `;
  }

  async update(): Promise<void> {
    await client.queryArray`
      UPDATE crews
      SET name=${this.name}, bounty=${this.bounty}
      WHERE id=${this.id}
    `;
  }

  async delete(): Promise<void> {
    await client.queryArray`
      DELETE FROM crews
      WHERE id=${this.id}
    `;
  }

  static async find(id: number): Promise<Crew> {
    const { rows: [row] } = await client.queryObject<CrewsRow>`
      SELECT id, name, bounty
      FROM crews
      WHERE id = ${id}
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    return new Crew(row.id, row.name, row.bounty);
  }

  isDanger(): boolean {
    return this.bounty >= 1_000_000_000;
  }
}
