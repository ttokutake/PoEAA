import { Client, Pool } from "../../deps.ts";

const connectionParams = {
  user: "postgres",
  password: "password",
  database: "postgres",
  hostname: "db",
  port: 5432,
};

const _pool = new Pool(connectionParams, 2);
const _client: Client = await _pool.connect();

class Registry {
  static get pool(): Pool {
    return _pool;
  }

  static get client(): Client {
    return _client;
  }
}

interface CrewsRow {
  id: number;
  name: string;
  bounty: bigint;
}

interface SpecialMoveRow {
  name: string;
}

export class Crew {
  constructor(
    public id: number,
    public name: string,
    public bounty: bigint,
    public specialMoves: string[],
  ) {}

  async insert(): Promise<void> {
    const client = await Registry.pool.connect();
    const transaction = await client.createTransaction("Crew.insert()");
    await transaction.begin();
    await transaction.queryArray`
      INSERT INTO crews (id, name, bounty)
      VALUES (${this.id}, ${this.name}, ${this.bounty})
    `;
    if (this.specialMoves.length) {
      const values = this.specialMoves.map((specialMove) =>
        `('${specialMove}', ${this.id})`
      );
      await transaction.queryArray(`
        INSERT INTO special_moves (name, crew_id)
        VALUES ${values.join(",")}
      `);
    }
    await transaction.commit();
    client.release();
  }

  static async find(id: number): Promise<Crew> {
    const { rows: [crewRow] } = await Registry.client.queryObject<CrewsRow>`
      SELECT id, name, bounty
      FROM crews
      WHERE id = ${id}
      LIMIT 1
    `;
    if (!crewRow) {
      throw new Error("Record Not Found");
    }
    const { rows: specialMoveRows } = await Registry.client.queryObject<
      SpecialMoveRow
    >`
      SELECT name
      FROM special_moves
      WHERE crew_id = ${id}
    `;
    const specialMoves = specialMoveRows.map(({ name }) => name);
    return new Crew(id, crewRow.name, crewRow.bounty, specialMoves);
  }
}
