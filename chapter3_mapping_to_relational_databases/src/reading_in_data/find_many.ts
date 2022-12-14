import { client } from "../postgres_client.ts";

interface CrewsRow {
  id: number;
  name: string;
  bounty: bigint;
}

export class CrewGateway {
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

  static async findManyInGoodWay(ids: number[]): Promise<CrewGateway[]> {
    const { rows } = await client.queryObject<CrewsRow>(`
      SELECT id, name, bounty
      FROM crews
      WHERE id IN (${ids.join(",")})
    `);
    const crewGateways = rows.map((row: CrewsRow) =>
      new CrewGateway(row.id, row.name, row.bounty)
    );
    return crewGateways;
  }

  static findManyInBadWay(ids: number[]): Promise<CrewGateway[]> {
    return Promise.all(ids.map((id: number) => this.find(id)));
  }

  static async find(id: number): Promise<CrewGateway> {
    const { rows: [row] } = await client.queryObject<CrewsRow>`
      SELECT id, name, bounty
      FROM crews
      WHERE id = ${id}
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    return new CrewGateway(row.id, row.name, row.bounty);
  }
}
