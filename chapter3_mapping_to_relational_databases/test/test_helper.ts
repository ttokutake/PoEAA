import { client } from "../src/postgres_client.ts";

export async function createTable() {
  await client.queryArray`
    CREATE TABLE IF NOT EXISTS crews (
      id SERIAL PRIMARY KEY,
      name VARCHAR(256),
      bounty BIGINT
    )
  `;
  await client.queryArray`
    CREATE TABLE IF NOT EXISTS special_moves (
      id SERIAL PRIMARY KEY,
      name VARCHAR(256),
      crew_id INTEGER,
      CONSTRAINT fk_crew
        FOREIGN KEY(crew_id)
          REFERENCES crews(id)
    )
  `;
  await client.queryArray`
    CREATE TABLE IF NOT EXISTS haki_list (
      id SERIAL PRIMARY KEY,
      name VARCHAR(256),
      UNIQUE(name)
    )
  `;
  await client.queryArray`
    CREATE TABLE IF NOT EXISTS crews_haki_list (
      crew_id INTEGER,
      haki_id INTEGER,
      CONSTRAINT fk_crew
        FOREIGN KEY(crew_id)
          REFERENCES crews(id),
      CONSTRAINT fk_haki
        FOREIGN KEY(haki_id)
          REFERENCES haki_list(id)
    )
  `;
}

export async function truncateTable() {
  await client.queryArray`
    TRUNCATE TABLE haki_list RESTART IDENTITY CASCADE
  `;
  await client.queryArray`
    TRUNCATE TABLE crews RESTART IDENTITY CASCADE
  `;
}

export async function dropTable() {
  await client.queryArray`
    DROP TABLE IF EXISTS crews_haki_list
  `;
  await client.queryArray`
    DROP TABLE IF EXISTS haki_list
  `;
  await client.queryArray`
    DROP TABLE IF EXISTS special_moves
  `;
  await client.queryArray`
    DROP TABLE IF EXISTS crews
  `;
}
