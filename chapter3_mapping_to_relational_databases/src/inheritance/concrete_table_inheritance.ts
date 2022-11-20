import { client } from "../postgres_client.ts";

abstract class Person {
  protected id = 0;

  constructor(
    public name: string,
  ) {}

  getId(): number {
    return this.id;
  }
}

interface PirateRow {
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
    const { rows: [row] } = await client.queryObject<PirateRow>`
      SELECT id, name, role
      FROM pirates
      WHERE id = ${id}
      LIMIT 1
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    const pirate = new Pirate(row.name, row.role);
    pirate.id = row.id;
    return pirate;
  }
}

interface MarineRow {
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
    const { rows: [row] } = await client.queryObject<MarineRow>`
      SELECT id, name, rank
      FROM marines
      WHERE id = ${id}
      LIMIT 1
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    const marine = new Marine(row.name, row.rank);
    marine.id = row.id;
    return marine;
  }
}
