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
  private id = 0;
  private specialMovesSource: string[] | null = null;

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

  async addSpecialMove(name: string) {
    await client.queryArray`
      INSERT INTO special_moves (name, crew_id)
      VALUES (${name}, ${this.id})
    `;
  }

  async specialMoves(): Promise<string[]> {
    if (this.specialMovesSource) {
      return this.specialMovesSource;
    }

    const { rows } = await client.queryObject<SpecialMove>`
      SELECT name
      FROM special_moves
      WHERE crew_id = ${this.id}
    `;
    this.specialMovesSource = rows.map(({ name }) => name);

    return this.specialMovesSource;
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
    const crew = new Crew(row.name, row.bounty);
    crew.id = row.id;
    return crew;
  }
}
