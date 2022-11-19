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
  Crew,
  Haki,
} from "../../src/mapping_relationships/association_table_mapping.ts";
import {
  createCrewsTable,
  createHakiListTable,
  dropTable,
  truncateCrewsTable,
  truncateHakiListTable,
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
    const crew = new Crew(name, bounty);
    await crew.insert();
    const insertedCrew = await Crew.find(id);
    for (const hakiName of hakiList) {
      const haki = await Haki.findByName(hakiName);
      await insertedCrew.addHaki(haki);
    }
  }
}

describe("Crew", () => {
  beforeAll(async () => {
    await createCrewsTable();
    await createHakiListTable();
  });
  afterAll(async () => {
    await dropTable();
  });

  beforeEach(async () => {
    await insertData();
  });
  afterEach(async () => {
    await truncateHakiListTable();
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
