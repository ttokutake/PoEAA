import { client } from "./postgres_client.ts";

import { Crew, IDataSource } from "./domain.ts";

interface Row {
  id: number;
  name: string;
  reward: number;
}

export const DataSource: IDataSource = class {
  static async list(): Promise<Crew[]> {
    const sql = "SELECT id, name, reward FROM crews";
    const result = await client.queryObject(sql) as { rows: Row[] };
    return result.rows.map(({ id, name, reward }: Row) =>
      new Crew(id, name, reward)
    );
  }
};
