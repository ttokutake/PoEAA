import { client } from "../postgres_client.ts";

interface Row {
  id: number;
  name: string;
  bounty: bigint;
  special_move: string;
}

export class Crew {
  private _id = 0;
  private specialMoves: string[] = [];

  constructor(
    public name: string,
    public bounty: bigint,
  ) {}

  get id(): number {
    return this._id;
  }

  getSpecialMoves(): string[] {
    return this.specialMoves;
  }

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO crews (name, bounty)
      VALUES (${this.name}, ${this.bounty})
    `;
  }

  async addSpecialMove(name: string) {
    await client.queryArray`
      INSERT INTO special_moves (name, crew_id)
      VALUES (${name}, ${this.id})
    `;
  }

  static async find(id: number): Promise<Crew> {
    const { rows: [row] } = await client.queryObject<Row>`
      SELECT id, name, bounty
      FROM crews
      WHERE id = ${id}
      LIMIT 1
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    const crew = new Crew(row.name, row.bounty);
    crew._id = id;
    return crew;
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
    const crewsMap = rows.reduce((dict: { [id: number]: Crew }, row: Row) => {
      if (dict[row.id]) {
        const crew = dict[row.id];
        crew.specialMoves = [...crew.specialMoves, row.special_move];
        return dict;
      }

      const crew = new Crew(row.name, row.bounty);
      crew._id = row.id;
      crew.specialMoves = [row.special_move];
      dict[row.id] = crew;
      return dict;
    }, {});
    return Object.values(crewsMap);
  }
}
