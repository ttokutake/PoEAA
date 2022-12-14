import { client } from "../postgres_client.ts";

interface CrewsRow {
  id: number;
  name: string;
  bounty: bigint;
  wikipedia: Record<string, unknown>;
}

export class CrewGateway {
  constructor(
    private _id: number,
    public name: string,
    public bounty: bigint,
    public wikipedia: Record<string, unknown>,
  ) {}

  get id(): number {
    return this._id;
  }

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO crews (id, name, bounty, wikipedia)
      VALUES (${this.id}, ${this.name}, ${this.bounty}, ${this.wikipedia})
    `;
  }

  static async find(id: number): Promise<CrewGateway> {
    const { rows: [row] } = await client.queryObject<CrewsRow>`
      SELECT
        id,
        name,
        bounty,
        wikipedia
      FROM crews
      WHERE id = ${id}
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    return new CrewGateway(row.id, row.name, row.bounty, row.wikipedia);
  }
}
