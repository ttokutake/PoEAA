import {
  afterAll,
  afterEach,
  assertEquals,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "../../dev_deps.ts";

import { client } from "../../src/postgres_client.ts";
import {
  Crew,
  Haki,
} from "../../src/mapping_relationships/association_table_mapping.ts";
import {
  createCrewsTable,
  dropTable,
  truncateCrewsTable,
} from "../test_helper.ts";

async function insertData() {
  await Haki.insert("Sovereign");
  await Haki.insert("Armament");
  await Haki.insert("Observation");
  const data = [
    {
      id: 1,
      name: "Luffy",
      bounty: BigInt(1_500_000_000),
      hakiList: ["Sovereign", "Armament", "Observation"],
    },
    {
      id: 2,
      name: "Sanji",
      bounty: BigInt(330_000_000),
      hakiList: ["Armament", "Observation"],
    },
  ];
  for (const { id, name, bounty, hakiList } of data) {
    const crew = new Crew(id, name, bounty);
    await crew.insert();
    for (const hakiName of hakiList) {
      const haki = await Haki.findByName(hakiName);
      await crew.addHaki(haki);
    }
  }
}

describe("Crew", () => {
  beforeAll(async () => {
    await createCrewsTable();
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
  });
  afterAll(async () => {
    await client.queryArray`
      DROP TABLE IF EXISTS crews_haki_list
    `;
    await client.queryArray`
      DROP TABLE IF EXISTS haki_list
    `;
    await dropTable();
  });

  beforeEach(async () => {
    await insertData();
  });
  afterEach(async () => {
    await client.queryArray`
      TRUNCATE TABLE haki_list RESTART IDENTITY CASCADE
    `;
    await truncateCrewsTable();
  });

  it("find", async () => {
    const luffy = await Crew.find(1);
    assertEquals(luffy.hakiList[0].name, "Sovereign");
    assertEquals(luffy.hakiList[1].name, "Armament");
    assertEquals(luffy.hakiList[2].name, "Observation");

    const sanji = await Crew.find(2);
    assertEquals(sanji.hakiList[0].name, "Armament");
    assertEquals(sanji.hakiList[1].name, "Observation");
  });
});
