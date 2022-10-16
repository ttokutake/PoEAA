import { client } from './postgres_client.ts';

export class DataSource {
  async list() {
    return await client.queryObject("SELECT id, name FROM crews");
  }
}
