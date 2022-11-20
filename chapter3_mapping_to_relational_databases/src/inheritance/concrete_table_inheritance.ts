import { client } from "../postgres_client.ts";

abstract class Person {
  protected _id = 0;

  constructor(
    public name: string,
  ) {}

  get id(): number {
    return this._id;
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

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO pirates (name, role)
      VALUES (${this.name}, ${this.role})
    `;
  }

  static async find(id: number): Promise<Pirate> {
    const { rows: [row] } = await client.queryObject<PiratesRow>`
      SELECT id, name, role
      FROM pirates
      WHERE id = ${id}
      LIMIT 1
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

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO marines (name, rank)
      VALUES (${this.name}, ${this.rank})
    `;
  }

  static async find(id: number): Promise<Marine> {
    const { rows: [row] } = await client.queryObject<MarinesRow>`
      SELECT id, name, rank
      FROM marines
      WHERE id = ${id}
      LIMIT 1
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    const marine = new Marine(row.name, row.rank);
    marine._id = row.id;
    return marine;
  }
}
