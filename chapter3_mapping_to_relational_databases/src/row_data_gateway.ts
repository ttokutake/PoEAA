import { client } from "./postgres_client.ts";

interface Row {
  id: number;
  name: string;
  bounty: bigint;
}

export class CrewGateway {
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

  static async find(id: number): Promise<CrewGateway> {
    const { rows: [row] } = await client.queryObject<Row>`
      SELECT id, name, bounty
      FROM crews
      WHERE id = ${id}
      LIMIT 1
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    const crewGateway = new CrewGateway(row.name, row.bounty);
    crewGateway.id = row.id;
    return crewGateway;
  }
}
