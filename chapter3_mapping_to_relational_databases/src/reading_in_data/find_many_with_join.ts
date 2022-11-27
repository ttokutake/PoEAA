import { client } from "../postgres_client.ts";

interface Row {
  id: number;
  name: string;
  bounty: bigint;
  special_move: string;
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

  static async findMany(ids: number[]): Promise<Crew[]> {
    const { rows } = await client.queryObject<Row>(`
      SELECT
        crews.id AS id,
        crews.name AS name,
        bounty,
        special_moves.name AS special_move
      FROM crews
      JOIN special_moves ON special_moves.crew_id = crews.id
      WHERE crews.id IN (${ids.join(",")})
    `);
    const crewsMap = rows.reduce((map: { [id: number]: Crew }, row: Row) => {
      if (map[row.id]) {
        const crew = map[row.id];
        crew._specialMoves = [...crew.specialMoves, row.special_move];
        return map;
      }

      const crew = new Crew(row.id, row.name, row.bounty);
      crew._specialMoves = [row.special_move];
      map[row.id] = crew;
      return map;
    }, {});
    return Object.values(crewsMap);
  }
}
