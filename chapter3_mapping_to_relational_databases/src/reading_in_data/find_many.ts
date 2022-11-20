import { client } from "../postgres_client.ts";

interface CrewsRow {
  id: number;
  name: string;
  bounty: bigint;
}

export class CrewGateway {
  private _id = 0;

  constructor(
    public name: string,
    public bounty: bigint,
  ) {}

  get id(): number {
    return this._id;
  }

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO crews (name, bounty)
      VALUES (${this.name}, ${this.bounty})
    `;
  }

  static async findManyInGoodWay(ids: number[]): Promise<CrewGateway[]> {
    const { rows } = await client.queryObject<CrewsRow>(`
      SELECT id, name, bounty
      FROM crews
      WHERE id IN (${ids.join(",")})
    `);
    const crewGateways = rows.map((row: CrewsRow) => {
      const crewGateway = new CrewGateway(row.name, row.bounty);
      crewGateway._id = row.id;
      return crewGateway;
    });
    return crewGateways;
  }

  static findManyInBadWay(ids: number[]): Promise<CrewGateway[]> {
    const crewGateways = ids.map(async (id: number) => {
      const { rows: [row] } = await client.queryObject<CrewsRow>`
        SELECT id, name, bounty
        FROM crews
        WHERE id = ${id}
        LIMIT 1
      `;
      if (!row) {
        throw new Error("Record Not Found");
      }
      const crewGateway = new CrewGateway(row.name, row.bounty);
      crewGateway._id = row.id;
      return crewGateway;
    });
    return Promise.all(crewGateways);
  }
}
