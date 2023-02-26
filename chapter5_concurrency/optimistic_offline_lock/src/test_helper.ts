import { client } from "../src/postgres_client.ts";

export async function createCrewsTable() {
  await client.queryArray`
    CREATE TABLE IF NOT EXISTS crews (
      id SERIAL PRIMARY KEY,
      name VARCHAR(256) NOT NULL,
      bounty BIGINT NOT NULL,
      version INTEGER NOT NULL
    )
  `;
}

export async function truncateCrewsTable() {
  await client.queryArray`
    TRUNCATE TABLE crews RESTART IDENTITY CASCADE
  `;
}

export async function dropTable() {
  await client.queryArray`
    DROP TABLE IF EXISTS crews
  `;
}
