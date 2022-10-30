import { client } from "./postgres_client.ts";

import { Crew, IDataSource } from "./domain.ts";

interface Row {
  id: number;
  name: string;
  bounty: bigint;
}

export const DataSource: IDataSource = class {
  static async list(isAsc: boolean): Promise<Crew[]> {
    const sql = `
      SELECT id, name, bounty
      FROM crews
      ORDER BY id ${isAsc ? "ASC" : "DESC"}
    `;
    const result = await client.queryObject<Row>(sql);
    return result.rows.map(({ id, name, bounty }: Row) =>
      new Crew(id, name, bounty)
    );
  }
};
