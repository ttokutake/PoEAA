import { client } from "./postgres_client.ts";

interface CrewsRow {
  id: number;
  name: string;
  bounty: bigint;
  owner: string | null;
}

export class Crew {
  private static resourceName = "crew";

  constructor(
    private _id: number,
    public name: string,
    public bounty: bigint,
    private owner: string,
  ) {}

  get id(): number {
    return this._id;
  }

  private get resourceName() {
    return (<typeof Crew> this.constructor).resourceName;
  }

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO crews (id, name, bounty)
      VALUES (${this.id}, ${this.name}, ${this.bounty})
    `;
  }

  async aquireWriteLock() {
    await client.queryArray`
      INSERT INTO write_locks (resource_id, resource_name, owner)
      VALUES (${this.id}, ${this.resourceName}, ${this.owner})
    `;
  }

  async releaseWriteLock() {
    await client.queryArray`
      DELETE FROM write_locks
      WHERE resource_id = ${this.id}
        AND resource_name = ${this.resourceName}
        AND owner = ${this.owner}
    `;
  }

  async update(): Promise<void> {
    const result = await client.queryArray`
      UPDATE crews
      SET name=${this.name}, bounty=${this.bounty}
      WHERE id=${this.id} AND NOT EXISTS(
        SELECT *
        FROM write_locks
        WHERE resource_id = ${this.id}
          AND resource_name = ${this.resourceName}
          AND owner != ${this.owner}
      )
    `;
    if (!result.rowCount) {
      throw new Error("Record Locked");
    }
  }

  static async find(id: number, owner: string): Promise<Crew> {
    const { rows: [row] } = await client.queryObject<CrewsRow>`
      SELECT id, name, bounty, owner
      FROM crews
      LEFT OUTER JOIN write_locks ON resource_id = crews.id AND resource_name = ${this.resourceName}
      WHERE id = ${id}
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    if (row.owner && row.owner != owner) {
      throw new Error("Record Locked");
    }
    return new Crew(row.id, row.name, row.bounty, owner);
  }
}
