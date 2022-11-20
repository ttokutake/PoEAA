import { client } from "../postgres_client.ts";

interface CrewsRow {
  id: number;
  name: string;
  bounty: bigint;
}

export class Crew {
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
}

interface SpecialMovesRow {
  id: number;
  name: string;
  crew_id: number;
}

export class SpecialMove {
  private id = 0;

  constructor(
    public name: string,
    public crewId: number,
  ) {}

  getId() {
    return this.id;
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
    const specialMoves = rows.map((row: SpecialMovesRow) => {
      const specialMove = new SpecialMove(row.name, row.crew_id);
      specialMove.id = row.id;
      return specialMove;
    });
    return specialMoves;
  }
}
