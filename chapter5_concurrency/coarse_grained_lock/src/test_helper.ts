import { client } from "../src/postgres_client.ts";

export async function createTables() {
  await client.queryArray`
    CREATE TABLE IF NOT EXISTS crews (
      id SERIAL PRIMARY KEY,
      name VARCHAR(256) NOT NULL,
      bounty BIGINT NOT NULL,
      version INTEGER NOT NULL
    )
  `;
  await client.queryArray`
    CREATE TABLE IF NOT EXISTS special_moves (
      id SERIAL PRIMARY KEY,
      name VARCHAR(256) NOT NULL,
      crew_id INTEGER NOT NULL,
      CONSTRAINT fk_crew
        FOREIGN KEY(crew_id)
          REFERENCES crews(id)
    )
  `;
}

export async function truncateTables() {
  await client.queryArray`
    TRUNCATE TABLE crews RESTART IDENTITY CASCADE
  `;
}

export async function dropTables() {
  await client.queryArray`
    DROP TABLE IF EXISTS special_moves
  `;
  await client.queryArray`
    DROP TABLE IF EXISTS crews
  `;
}
