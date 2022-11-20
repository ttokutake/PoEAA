import { client } from "../postgres_client.ts";

interface HakiListRow {
  id: number;
  name: string;
}

export class Haki {
  constructor(
    private _id: number,
    public name: string,
  ) {}

  get id(): number {
    return this._id;
  }

  static async insert(name: string): Promise<void> {
    await client.queryArray`
      INSERT INTO haki_list (name)
      VALUES (${name})
    `;
  }

  static async findByName(name: string): Promise<Haki> {
    const { rows: [row] } = await client.queryObject<HakiListRow>`
      SELECT id, name
      FROM haki_list
      WHERE name = ${name}
      LIMIT 1
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    return new Haki(row.id, row.name);
  }
}

interface CrewsRow {
  id: number;
  name: string;
  bounty: bigint;
}

export class Crew {
  private _id = 0;
  public hakiList: Haki[] = [];

  constructor(
    public name: string,
    public bounty: bigint,
  ) {}

  get id(): number {
    return this._id;
  }

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO crews (name, bounty)
      VALUES (${this.name}, ${this.bounty})
    `;
  }

  async addHaki(haki: Haki) {
    await client.queryArray`
      INSERT INTO crews_haki_list (crew_id, haki_id)
      VALUES (${this.id}, ${haki.id})
    `;
  }

  static async find(id: number): Promise<Crew> {
    const { rows: [row] } = await client.queryObject<CrewsRow>`
      SELECT id, name, bounty
      FROM crews
      WHERE id = ${id}
      LIMIT 1
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    const crew = new Crew(row.name, row.bounty);
    crew._id = row.id;
    crew.hakiList = await this.findHaki(crew.id);
    return crew;
  }

  private static async findHaki(crew_id: number): Promise<Haki[]> {
    const { rows } = await client.queryObject<HakiListRow>`
      SELECT haki_id AS id, name
      FROM crews_haki_list
      JOIN haki_list ON haki_list.id = crews_haki_list.haki_id
      WHERE crew_id = ${crew_id}
    `;
    const hakiList = rows.map(({ id, name }: HakiListRow) =>
      new Haki(id, name)
    );
    return hakiList;
  }
}
