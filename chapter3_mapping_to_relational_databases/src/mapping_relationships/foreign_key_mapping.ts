import { client } from "../postgres_client.ts";

interface CrewsRow {
  id: number;
  name: string;
  bounty: bigint;
}

export class Crew {
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
}

interface SpecialMovesRow {
  id: number;
  name: string;
  crew_id: number;
}

export class SpecialMove {
  constructor(
    private _id: number,
    public name: string,
    public crewId: number,
  ) {}

  get id(): number {
    return this._id;
  }

  async insert() {
    await client.queryArray`
      INSERT INTO special_moves (id, name, crew_id)
      VALUES (${this.id}, ${this.name}, ${this.crewId})
    `;
  }

  static async findForCrew(crewId: number): Promise<SpecialMove[]> {
    const { rows } = await client.queryObject<SpecialMovesRow>`
      SELECT id, name, crew_id
      FROM special_moves
      WHERE crew_id = ${crewId}
    `;
    const specialMoves = rows.map((row: SpecialMovesRow) =>
      new SpecialMove(row.id, row.name, row.crew_id)
    );
    return specialMoves;
  }
}
