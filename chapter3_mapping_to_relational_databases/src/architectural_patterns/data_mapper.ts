import { client } from "../postgres_client.ts";

import { Crew } from "./domain.ts";

interface CrewsRow {
  id: number;
  name: string;
  bounty: bigint;
}

export class CrewMapper {
  async insert(crew: Crew) {
    await client.queryArray`
      INSERT INTO crews (name, bounty)
      VALUES (${crew.name}, ${crew.bounty})
    `;
  }

  async update(crew: Crew): Promise<void> {
    await client.queryArray`
      UPDATE crews
      SET name=${crew.name}, bounty=${crew.bounty}
      WHERE id=${crew.getId()}
    `;
  }

  async delete(crew: Crew): Promise<void> {
    await client.queryArray`
      DELETE FROM crews
      WHERE id=${crew.getId()}
    `;
  }

  async find(id: number): Promise<Crew> {
    const { rows: [row] } = await client.queryObject<CrewsRow>`
      SELECT id, name, bounty
      FROM crews
      WHERE id = ${id}
      LIMIT 1
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    const crew = new Crew(row.id, row.name, row.bounty);
    return crew;
  }
}
