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
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    return new Haki(row.id, row.name);
  }

  static async findForCrew(crew_id: number): Promise<Haki[]> {
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

interface CrewsRow {
  id: number;
  name: string;
  bounty: bigint;
}

export class Crew {
  public hakiList: Haki[] = [];

  constructor(
    private _id: number,
    public name: string,
    public bounty: bigint,
  ) {}

  get id(): number {
    return this._id;
  }

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO crews (id, name, bounty)
      VALUES (${this.id}, ${this.name}, ${this.bounty})
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
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    const crew = new Crew(row.id, row.name, row.bounty);
    crew.hakiList = await Haki.findForCrew(crew.id);
    return crew;
  }
}
