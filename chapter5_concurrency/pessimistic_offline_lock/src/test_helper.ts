import { client } from "../src/postgres_client.ts";

export async function createTables() {
  await client.queryArray`
    CREATE TABLE IF NOT EXISTS crews (
      id SERIAL PRIMARY KEY,
      name VARCHAR(256) NOT NULL,
      bounty BIGINT NOT NULL
    )
  `;
  await client.queryArray`
    CREATE TABLE IF NOT EXISTS write_locks (
      resource_id INTEGER NOT NULL,
      resource_name VARCHAR(256) NOT NULL,
      owner VARCHAR(256) NOT NULL,
      PRIMARY KEY (resource_id, resource_name)
    )
  `;
}

export async function truncateTables() {
  await client.queryArray`
    TRUNCATE TABLE crews RESTART IDENTITY CASCADE
  `;
  await client.queryArray`
    TRUNCATE TABLE write_locks RESTART IDENTITY CASCADE
  `;
}

export async function dropTables() {
  await client.queryArray`
    DROP TABLE IF EXISTS write_locks
  `;
  await client.queryArray`
    DROP TABLE IF EXISTS crews
  `;
}
