import { client } from "../postgres_client.ts";

interface CrewRow {
  id: number;
  name: string;
  bounty: bigint;
}

interface SpecialMove {
  name: string;
}

export class Crew {
  private id = 0;
  private specialMoves: string[] = [];

  constructor(
    public name: string,
    public bounty: bigint,
  ) {}

  getId(): number {
    return this.id;
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
    const { rows: [row] } = await client.queryObject<CrewRow>`
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
    crew.specialMoves = await this.findSpecialMoves(crew.id);
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
