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
} from "../../src/inheritance/class_table_inheritance.ts";
import { client } from "../../src/postgres_client.ts";

async function insertData() {
  const pirate = new Pirate(1, "Jimbei", "Helmsman");
  await pirate.insert();
  const marine = new Marine(2, "Smoker", "Vice Admiral");
  await marine.insert();
}

describe("Person", () => {
  beforeAll(async () => {
    await client.queryArray`
      CREATE TABLE IF NOT EXISTS people (
        id SERIAL PRIMARY KEY,
        name VARCHAR(256) NOT NULL,
        UNIQUE(name)
      )
    `;
    await client.queryArray`
      CREATE TABLE IF NOT EXISTS pirates (
        person_id INTEGER PRIMARY KEY,
        role VARCHAR(256) NOT NULL,
        CONSTRAINT fk_people
          FOREIGN KEY(person_id)
            REFERENCES people(id)
      )
    `;
    await client.queryArray`
      CREATE TABLE IF NOT EXISTS marines (
        person_id INTEGER PRIMARY KEY,
        rank VARCHAR(256) NOT NULL,
        CONSTRAINT fk_people
          FOREIGN KEY(person_id)
            REFERENCES people(id)
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
    await client.queryArray`
      DROP TABLE IF EXISTS people
    `;
  });

  beforeEach(async () => {
    await insertData();
  });
  afterEach(async () => {
    await client.queryArray`
      TRUNCATE TABLE people RESTART IDENTITY CASCADE
    `;
  });

  it("find", async () => {
    const pirate = await Pirate.find(1);

    assertEquals(pirate.name, "Jimbei");
    assertEquals(pirate.role, "Helmsman");

    const marine = await Marine.find(2);

    assertEquals(marine.name, "Smoker");
    assertEquals(marine.rank, "Vice Admiral");
  });
});
