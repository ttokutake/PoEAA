import { client } from "../postgres_client.ts";

interface CrewsRow {
  id: number;
  name: string;
  bounty: bigint;
  wikipedia: Record<string, unknown>;
}

export class CrewGateway {
  private _id = 0;

  constructor(
    public name: string,
    public bounty: bigint,
    public wikipedia: Record<string, unknown>,
  ) {}

  get id(): number {
    return this._id;
  }

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO crews (name, bounty, wikipedia)
      VALUES (${this.name}, ${this.bounty}, ${this.wikipedia})
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
      LIMIT 1
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    const crewGateway = new CrewGateway(row.name, row.bounty, row.wikipedia);
    crewGateway._id = row.id;
    return crewGateway;
  }
}
