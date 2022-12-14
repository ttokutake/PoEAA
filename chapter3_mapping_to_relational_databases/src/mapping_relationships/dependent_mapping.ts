import { client } from "../postgres_client.ts";

interface CrewsRow {
  id: number;
  name: string;
  bounty: bigint;
}

interface SpecialMove {
  name: string;
}

export class Crew {
  private _specialMoves: string[] = [];

  constructor(
    private _id: number,
    public name: string,
    public bounty: bigint,
  ) {}

  get id(): number {
    return this._id;
  }

  get specialMoves(): string[] {
    return this._specialMoves;
  }

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO crews (id, name, bounty)
      VALUES (${this.id}, ${this.name}, ${this.bounty})
    `;
  }

  async addSpecialMove(name: string) {
    await client.queryArray`
      INSERT INTO special_moves (name, crew_id)
      VALUES (${name}, ${this.id})
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
    const crew = new Crew(row.id, row.name, row.bounty);
    crew._specialMoves = await this.findSpecialMoves(crew.id);
    return crew;
  }

  private static async findSpecialMoves(crewId: number): Promise<string[]> {
    const { rows } = await client.queryObject<SpecialMove>`
      SELECT name
      FROM special_moves
      WHERE crew_id = ${crewId}
    `;
    return rows.map(({ name }) => name);
  }
}
