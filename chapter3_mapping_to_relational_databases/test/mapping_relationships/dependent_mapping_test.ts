import {
  afterAll,
  afterEach,
  assertEquals,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "../../dev_deps.ts";

import { Crew } from "../../src/mapping_relationships/dependent_mapping.ts";
import { createTable, dropTable, truncateTable } from "../test_helper.ts";

async function insertData() {
  const crew = new Crew("Luffy", BigInt(1_500_000_000));
  await crew.insert();
  const insertedCrew = await Crew.find(1);
  await insertedCrew.addSpecialMove("Gum-Gum Pistol");
  await insertedCrew.addSpecialMove("Gum-Gum Bazooka");
}

describe("Crew", () => {
  beforeAll(async () => {
    await createTable();
  });
  afterAll(async () => {
    await dropTable();
  });

  beforeEach(async () => {
    await insertData();
  });
  afterEach(async () => {
    await truncateTable();
  });

  it("specialMoves", async () => {
    const crew = await Crew.find(1);

    assertEquals(crew.getSpecialMoves(), ["Gum-Gum Pistol", "Gum-Gum Bazooka"]);
  });
});