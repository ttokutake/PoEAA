import { client } from "./postgres_client.ts";

interface CrewsRow {
  id: number;
  name: string;
  bounty: bigint;
  version: number;
}

export class Crew {
  private _specialMoves: SpecialMove[] = [];

  constructor(
    private _id: number,
    public name: string,
    public bounty: bigint,
    private _version: number,
  ) {}

  get id(): number {
    return this._id;
  }

  get version(): number {
    return this._version;
  }

  get specialMoves(): SpecialMove[] {
    return this._specialMoves;
  }

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO crews (id, name, bounty, version)
      VALUES (${this.id}, ${this.name}, ${this.bounty}, ${this.version})
    `;
  }

  async update(): Promise<void> {
    const result = await client.queryArray`
      UPDATE crews
      SET name=${this.name}, bounty=${this.bounty}, version=${this.version + 1}
      WHERE id=${this.id} AND version=${this.version}
    `;
    if (!result.rowCount) {
      throw new Error("Conflict Occurred");
    }
  }

  static async find(id: number): Promise<Crew> {
    const { rows: [row] } = await client.queryObject<CrewsRow>`
      SELECT id, name, bounty, version
      FROM crews
      WHERE id = ${id}
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    const crew = new Crew(row.id, row.name, row.bounty, row.version);
    crew._specialMoves = await SpecialMove.findForCrew(crew.id);
    return crew;
  }
}

interface SpecialMovesRow {
  id: number;
  name: string;
  crew_id: number;
  version: number;
}

export class SpecialMove {
  constructor(
    private _id: number,
    public name: string,
    public crewId: number,
    private version: number,
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

  async update(): Promise<void> {
    const transaction = await client.createTransaction("SpecialMove.update()");
    await transaction.begin();
    try {
      await transaction.queryArray`
        UPDATE special_moves
        SET name=${this.name}
        WHERE id=${this.id}
      `;
      const result = await transaction.queryArray`
        UPDATE crews
        SET version=${this.version + 1}
        WHERE id=${this.crewId} AND version=${this.version}
      `;
      if (!result.rowCount) {
        throw new Error("Conflict Occurred");
      }
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }

  static async findForCrew(crewId: number): Promise<SpecialMove[]> {
    const { rows } = await client.queryObject<SpecialMovesRow>`
      SELECT special_moves.id as id, special_moves.name, crew_id, version
      FROM special_moves
      JOIN crews ON crews.id = crew_id
      WHERE crew_id = ${crewId}
      ORDER BY special_moves.id
    `;
    const specialMoves = rows.map((row: SpecialMovesRow) =>
      new SpecialMove(row.id, row.name, row.crew_id, row.version)
    );
    return specialMoves;
  }
}
