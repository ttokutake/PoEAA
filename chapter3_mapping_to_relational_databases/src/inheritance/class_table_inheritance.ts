import { client } from "../postgres_client.ts";

abstract class Person {
  protected _id = 0;

  constructor(
    public name: string,
  ) {}

  get id(): number {
    return this._id;
  }

  protected async insert(): Promise<number> {
    await client.queryArray`
      INSERT INTO people (name)
      VALUES (${this.name})
    `;
    const id = await this.findIdByName();
    return id;
  }

  protected async findIdByName(): Promise<number> {
    const { rows: [row] } = await client.queryObject<{ id: number }>`
      SELECT id
      FROM people
      WHERE name = ${this.name}
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    return row.id;
  }
}

interface PiratesRow {
  id: number;
  name: string;
  role: string;
}

export class Pirate extends Person {
  constructor(
    public name: string,
    public role: string,
  ) {
    super(name);
  }

  async insert(): Promise<number> {
    const id = await super.insert();
    await client.queryArray`
      INSERT INTO pirates (person_id, role)
      VALUES (${id}, ${this.role})
    `;
    return id;
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
    const pirate = new Pirate(row.name, row.role);
    pirate._id = row.id;
    return pirate;
  }
}

interface MarinesRow {
  id: number;
  name: string;
  rank: string;
}

export class Marine extends Person {
  constructor(
    public name: string,
    public rank: string,
  ) {
    super(name);
  }

  async insert(): Promise<number> {
    const id = await super.insert();
    await client.queryArray`
      INSERT INTO marines (person_id, rank)
      VALUES (${id}, ${this.rank})
    `;
    return id;
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
    const marine = new Marine(row.name, row.rank);
    marine._id = row.id;
    return marine;
  }
}
