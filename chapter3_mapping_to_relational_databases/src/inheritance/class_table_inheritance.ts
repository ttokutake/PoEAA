import { client } from "../postgres_client.ts";

abstract class Person {
  constructor(
    protected _id: number,
    public name: string,
  ) {}

  get id(): number {
    return this._id;
  }

  protected async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO people (id, name)
      VALUES (${this.id}, ${this.name})
    `;
  }
}

interface PiratesRow {
  id: number;
  name: string;
  role: string;
}

export class Pirate extends Person {
  constructor(
    protected _id: number,
    public name: string,
    public role: string,
  ) {
    super(_id, name);
  }

  async insert(): Promise<void> {
    await super.insert();
    await client.queryArray`
      INSERT INTO pirates (person_id, role)
      VALUES (${this.id}, ${this.role})
    `;
  }

  static async find(id: number): Promise<Pirate> {
    const { rows: [row] } = await client.queryObject<PiratesRow>`
      SELECT id, name, role
      FROM people
      INNER JOIN pirates
        ON person_id = id
      WHERE id = ${id}
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    return new Pirate(row.id, row.name, row.role);
  }
}

interface MarinesRow {
  id: number;
  name: string;
  rank: string;
}

export class Marine extends Person {
  constructor(
    protected _id: number,
    public name: string,
    public rank: string,
  ) {
    super(_id, name);
  }

  async insert(): Promise<void> {
    await super.insert();
    await client.queryArray`
      INSERT INTO marines (person_id, rank)
      VALUES (${this.id}, ${this.rank})
    `;
  }

  static async find(id: number): Promise<Marine> {
    const { rows: [row] } = await client.queryObject<MarinesRow>`
      SELECT id, name, rank
      FROM people
      INNER JOIN marines
        ON person_id = id
      WHERE id = ${id}
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    return new Marine(row.id, row.name, row.rank);
  }
}
