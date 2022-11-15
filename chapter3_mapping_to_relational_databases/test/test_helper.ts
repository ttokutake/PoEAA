import { client } from "../src/postgres_client.ts";

export async function createTable() {
  await client.queryArray`
    CREATE TABLE IF NOT EXISTS crews (
      id SERIAL PRIMARY KEY,
      name VARCHAR(256),
      bounty BIGINT
    )
  `;
}

export async function truncateTable() {
  await client.queryArray`
    TRUNCATE TABLE crews RESTART IDENTITY;
  `;
}

export async function dropTable() {
  await client.queryArray`
    DROP TABLE crews
  `;
}
