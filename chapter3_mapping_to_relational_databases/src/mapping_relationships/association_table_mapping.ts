import { client } from "../postgres_client.ts";

interface HakiRow {
  id: number;
  name: string;
}

export class Haki {
  constructor(
    private id: number,
    public name: string,
  ) {}

  getId(): number {
    return this.id;
  }

  static async insert(name: string): Promise<void> {
    await client.queryArray`
      INSERT INTO haki_list (name)
      VALUES (${name})
    `;
  }

  static async findByName(name: string): Promise<Haki> {
    const { rows: [row] } = await client.queryObject<HakiRow>`
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

interface CrewRow {
  id: number;
  name: string;
  bounty: bigint;
}

export class Crew {
  private id = 0;
  public hakiList: Haki[] = [];

  constructor(
    public name: string,
    public bounty: bigint,
  ) {}

  getId(): number {
    return this.id;
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
      VALUES (${this.id}, ${haki.getId()})
    `;
  }

  static async find(id: number): Promise<Crew> {
    const { rows: [row] } = await client.queryObject<CrewRow>`
      SELECT id, name, bounty
      FROM crews
      WHERE id = ${id}
      LIMIT 1
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    const crew = new Crew(row.name, row.bounty);
    crew.id = row.id;
    crew.hakiList = await this.findHaki(crew.id);
    return crew;
  }

  private static async findHaki(crew_id: number): Promise<Haki[]> {
    const { rows } = await client.queryObject<HakiRow>`
      SELECT haki_id AS id, name
      FROM crews_haki_list
      JOIN haki_list ON haki_list.id = crews_haki_list.haki_id
      WHERE crew_id = ${crew_id}
    `;
    const hakiList = rows.map(({ id, name }: HakiRow) => new Haki(id, name));
    return hakiList;
  }
}
