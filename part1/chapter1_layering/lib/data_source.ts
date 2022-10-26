import { client } from "./postgres_client.ts";

export interface Row {
  id: number;
  name: string;
  bounty: bigint;
}

export class DataSource {
  static async list(isAsc: boolean): Promise<Row[]> {
    const sql = `
      SELECT id, name, bounty
      FROM crews
      ORDER BY id ${isAsc ? "ASC" : "DESC"}
    `;
    const result = await client.queryObject<Row>(sql);
    return result.rows;
  }
}
