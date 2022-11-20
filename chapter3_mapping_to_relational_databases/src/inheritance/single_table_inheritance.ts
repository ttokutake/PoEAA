import { client } from "../postgres_client.ts";

interface PeopleRow {
  id: number;
  name: string;
  role: string | null;
  rank: string | null;
}

abstract class Person {
  protected static type = "";
  protected _id = 0;

  constructor(
    public name: string,
  ) {}

  get id(): number {
    return this._id;
  }
}

export class Pirate extends Person {
  protected static type = "pirate";

  constructor(
    public name: string,
    public role: string,
  ) {
    super(name);
  }

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO people (name, type, role)
      VALUES (${this.name}, ${Pirate.type}, ${this.role})
    `;
  }

  static async find(id: number): Promise<Pirate> {
    const { rows: [row] } = await client.queryObject<PeopleRow>`
      SELECT id, name, role
      FROM people
      WHERE id = ${id} AND type = ${Pirate.type}
      LIMIT 1
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    if (!row.role) {
      throw new Error('Pirate must have "role"');
    }
    const pirate = new Pirate(row.name, row.role);
    pirate._id = row.id;
    return pirate;
  }
}

export class Marine extends Person {
  protected static type = "marine";

  constructor(
    public name: string,
    public rank: string,
  ) {
    super(name);
  }

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO people (name, type, rank)
      VALUES (${this.name}, ${Marine.type}, ${this.rank})
    `;
  }

  static async find(id: number): Promise<Marine> {
    const { rows: [row] } = await client.queryObject<PeopleRow>`
      SELECT id, name, rank
      FROM people
      WHERE id = ${id} AND type = ${Marine.type}
      LIMIT 1
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    if (!row.rank) {
      throw new Error('Pirate must have "rank"');
    }
    const marine = new Marine(row.name, row.rank);
    marine._id = row.id;
    return marine;
  }
}
