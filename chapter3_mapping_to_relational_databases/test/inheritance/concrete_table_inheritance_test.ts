import {
  afterAll,
  afterEach,
  assertEquals,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "../../dev_deps.ts";

import {
  Marine,
  Pirate,
} from "../../src/inheritance/concrete_table_inheritance.ts";
import { client } from "../../src/postgres_client.ts";

async function insertData() {
  const pirate = new Pirate(1, "Jimbei", "Helmsman");
  await pirate.insert();
  const marine = new Marine(1, "Smoker", "Vice Admiral");
  await marine.insert();
}

describe("Person", () => {
  beforeAll(async () => {
    await client.queryArray`
      CREATE TABLE IF NOT EXISTS pirates (
        id SERIAL PRIMARY KEY,
        name VARCHAR(256) NOT NULL,
        role VARCHAR(256) NOT NULL
      )
    `;
    await client.queryArray`
      CREATE TABLE IF NOT EXISTS marines (
        id SERIAL PRIMARY KEY,
        name VARCHAR(256) NOT NULL,
        rank VARCHAR(256) NOT NULL
      )
    `;
  });
  afterAll(async () => {
    await client.queryArray`
      DROP TABLE IF EXISTS pirates
    `;
    await client.queryArray`
      DROP TABLE IF EXISTS marines
    `;
  });

  beforeEach(async () => {
    await insertData();
  });
  afterEach(async () => {
    await client.queryArray`
      TRUNCATE TABLE pirates RESTART IDENTITY
    `;
    await client.queryArray`
      TRUNCATE TABLE marines RESTART IDENTITY
    `;
  });

  it("find", async () => {
    const pirate = await Pirate.find(1);

    assertEquals(pirate.name, "Jimbei");
    assertEquals(pirate.role, "Helmsman");

    const marine = await Marine.find(1);

    assertEquals(marine.name, "Smoker");
    assertEquals(marine.rank, "Vice Admiral");
  });
});
