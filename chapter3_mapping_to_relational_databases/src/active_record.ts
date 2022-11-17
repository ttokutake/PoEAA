import { client } from "./postgres_client.ts";

interface Row {
  id: number;
  name: string;
  bounty: bigint;
}

export class Crew {
  private id = 0;

  constructor(
    public name: string,
    public bounty: bigint,
  ) {}

  getId(): number {
    return this.id;
  }

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO crews (name, bounty)
      VALUES (${this.name}, ${this.bounty})
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
    const { rows: [row] } = await client.queryObject<Row>`
      SELECT id, name, bounty
      FROM crews
      WHERE id = ${id}
      LIMIT 1
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    const crew = new Crew(row.name, row.bounty);
    crew.id = row.id;
    return crew;
  }

  isDanger(): boolean {
    return this.bounty >= 1_000_000_000;
  }
}
