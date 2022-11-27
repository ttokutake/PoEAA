import { client } from "../postgres_client.ts";

abstract class Person {
  constructor(
    protected _id: number,
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
    protected _id: number,
    public name: string,
    public role: string,
  ) {
    super(_id, name);
  }

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO pirates (id, name, role)
      VALUES (${this.id}, ${this.name}, ${this.role})
    `;
  }

  static async find(id: number): Promise<Pirate> {
    const { rows: [row] } = await client.queryObject<PiratesRow>`
      SELECT id, name, role
      FROM pirates
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
    await client.queryArray`
      INSERT INTO marines (id, name, rank)
      VALUES (${this.id}, ${this.name}, ${this.rank})
    `;
  }

  static async find(id: number): Promise<Marine> {
    const { rows: [row] } = await client.queryObject<MarinesRow>`
      SELECT id, name, rank
      FROM marines
      WHERE id = ${id}
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    return new Marine(row.id, row.name, row.rank);
  }
}
