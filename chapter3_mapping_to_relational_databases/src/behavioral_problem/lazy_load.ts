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
  private _specialMoves: string[] | null = null;

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

  async addSpecialMove(name: string) {
    await client.queryArray`
      INSERT INTO special_moves (name, crew_id)
      VALUES (${name}, ${this.id})
    `;
  }

  async specialMoves(): Promise<string[]> {
    if (this._specialMoves) {
      return this._specialMoves;
    }

    const { rows } = await client.queryObject<SpecialMove>`
      SELECT name
      FROM special_moves
      WHERE crew_id = ${this.id}
    `;
    this._specialMoves = rows.map(({ name }) => name);

    return this._specialMoves;
  }

  static async find(id: number): Promise<Crew> {
    const { rows: [row] } = await client.queryObject<CrewsRow>`
      SELECT id, name, bounty
      FROM crews
      WHERE id = ${id}
      LIMIT 1
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    return new Crew(row.id, row.name, row.bounty);
  }
}
