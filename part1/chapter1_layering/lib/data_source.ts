import { client } from './postgres_client.ts';

import { Crew } from './domain.ts';

interface Row {
  id: number;
  name: string;
  reward: number;
}

export class DataSource {
  static async list(): Promise<Crew[]> {
    const sql = 'SELECT id, name, reward FROM crews';
    const result = await client.queryObject(sql) as {rows: Row[]};
    return result.rows.map((row: Row) => new Crew(...Object.values(row)));
  }
}
