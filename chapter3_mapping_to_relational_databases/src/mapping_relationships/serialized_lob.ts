import { client } from "../postgres_client.ts";

interface Row {
  id: number;
  name: string;
  bounty: bigint;
  wikipedia: Record<string, unknown>;
}

export class CrewGateway {
  private id = 0;

  constructor(
    public name: string,
    public bounty: bigint,
    public wikipedia: Record<string, unknown>,
  ) {}

  getId(): number {
    return this.id;
  }

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO crews (name, bounty, wikipedia)
      VALUES (${this.name}, ${this.bounty}, ${this.wikipedia})
    `;
  }

  static async find(id: number): Promise<CrewGateway> {
    const { rows: [row] } = await client.queryObject<Row>`
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
    crewGateway.id = row.id;
    return crewGateway;
  }
}
