import { client } from "./postgres_client.ts";

export interface Row {
  id: number;
  name: string;
  bounty: bigint;
}

export type RecordSet = Row[];

export class TableDataGateway {
  static async findAll(): Promise<RecordSet> {
    const sql = `
      SELECT id, name, bounty
      FROM crews
    `;
    const result = await client.queryObject<Row>(sql);
    return result.rows;
  }
}
