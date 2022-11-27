import { client } from "../postgres_client.ts";

interface CrewsRow {
  id: number;
  name: string;
  bounty: bigint;
}

export class Crew {
  private _specialMoves: SpecialMove[] = [];

  constructor(
    private _id: number,
    public name: string,
    public bounty: bigint,
  ) {}

  get id(): number {
    return this._id;
  }

  get specialMoves(): SpecialMove[] {
    return this._specialMoves;
  }

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO crews (id, name, bounty)
      VALUES (${this.id}, ${this.name}, ${this.bounty})
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
    crew._specialMoves = await SpecialMove.findForCrew(crew.id);
    return crew;
  }
}

interface SpecialMovesRow {
  id: number;
  name: string;
  crew_id: number;
}

export class SpecialMove {
  private _id = 0;

  constructor(
    public name: string,
    public crewId: number,
  ) {}

  get id(): number {
    return this._id;
  }

  async insert() {
    await client.queryArray`
      INSERT INTO special_moves (name, crew_id)
      VALUES (${this.name}, ${this.crewId})
    `;
  }

  static async findForCrew(crewId: number): Promise<SpecialMove[]> {
    const { rows } = await client.queryObject<SpecialMovesRow>`
      SELECT id, name, crew_id
      FROM special_moves
      WHERE crew_id = ${crewId}
    `;
    const specialMoves = rows.map((row: SpecialMovesRow) =>
      new SpecialMove(row.name, row.crew_id)
    );
    return specialMoves;
  }
}
