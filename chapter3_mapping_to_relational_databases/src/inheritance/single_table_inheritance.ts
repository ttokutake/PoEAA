import { client } from "../postgres_client.ts";

interface PeopleRow {
  id: number;
  name: string;
  role: string | null;
  rank: string | null;
}

abstract class Person {
  protected static type = "";

  constructor(
    protected _id: number,
    public name: string,
  ) {}

  get id(): number {
    return this._id;
  }
}

export class Pirate extends Person {
  protected static type = "pirate";

  constructor(
    protected _id: number,
    public name: string,
    public role: string,
  ) {
    super(_id, name);
  }

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO people (id, name, type, role)
      VALUES (${this.id}, ${this.name}, ${Pirate.type}, ${this.role})
    `;
  }

  static async find(id: number): Promise<Pirate> {
    const { rows: [row] } = await client.queryObject<PeopleRow>`
      SELECT id, name, role
      FROM people
      WHERE id = ${id} AND type = ${Pirate.type}
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    if (!row.role) {
      throw new Error('Pirate must have "role"');
    }
    return new Pirate(row.id, row.name, row.role);
  }
}

export class Marine extends Person {
  protected static type = "marine";

  constructor(
    protected _id: number,
    public name: string,
    public rank: string,
  ) {
    super(_id, name);
  }

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO people (id, name, type, rank)
      VALUES (${this.id}, ${this.name}, ${Marine.type}, ${this.rank})
    `;
  }

  static async find(id: number): Promise<Marine> {
    const { rows: [row] } = await client.queryObject<PeopleRow>`
      SELECT id, name, rank
      FROM people
      WHERE id = ${id} AND type = ${Marine.type}
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    if (!row.rank) {
      throw new Error('Marine must have "rank"');
    }
    return new Marine(row.id, row.name, row.rank);
  }
}
