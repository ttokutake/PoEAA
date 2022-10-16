import { client } from './postgres_client.ts';

import { Crew } from './domain.ts';

interface Row {
  id: number;
  name: string;
}

export class DataSource {
  static async list(): Promise<Crew[]> {
    const result = await client.queryObject("SELECT id, name FROM crews") as {rows: Row[]};
    return result.rows.map((row: Row) => new Crew(row));
  }
}
