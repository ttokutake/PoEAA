import { client } from "../src/postgres_client.ts";

export async function createCrewsTable() {
  await client.queryArray`
    CREATE TABLE IF NOT EXISTS crews (
      id SERIAL PRIMARY KEY,
      name VARCHAR(256) NOT NULL,
      bounty BIGINT NOT NULL
    )
  `;
}

export async function createSpecialMovesTable() {
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

export async function createHakiListTable() {
  await client.queryArray`
    CREATE TABLE IF NOT EXISTS haki_list (
      id SERIAL PRIMARY KEY,
      name VARCHAR(256) NOT NULL,
      UNIQUE(name)
    )
  `;
  await client.queryArray`
    CREATE TABLE IF NOT EXISTS crews_haki_list (
      crew_id INTEGER NOT NULL,
      haki_id INTEGER NOT NULL,
      CONSTRAINT fk_crew
        FOREIGN KEY(crew_id)
          REFERENCES crews(id),
      CONSTRAINT fk_haki
        FOREIGN KEY(haki_id)
          REFERENCES haki_list(id)
    )
  `;
}

export async function truncateCrewsTable() {
  await client.queryArray`
    TRUNCATE TABLE crews RESTART IDENTITY CASCADE
  `;
}

export async function truncateHakiListTable() {
  await client.queryArray`
    TRUNCATE TABLE haki_list RESTART IDENTITY CASCADE
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
