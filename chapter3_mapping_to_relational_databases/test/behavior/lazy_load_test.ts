import {
  afterAll,
  afterEach,
  assertEquals,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "../../dev_deps.ts";

import { Crew } from "../../src/behavior/lazy_load.ts";
import { createTable, dropTable, truncateTable } from "../test_helper.ts";

async function insertData() {
  const crew = new Crew("Luffy", BigInt(1_500_000_000));
  await crew.insert();
  const insertedCrew = await Crew.find(1);
  await insertedCrew.addSpecialMove("Gum-Gum Pistol");
  await insertedCrew.addSpecialMove("Gum-Gum Bazooka");
}

describe("CrewGateway", () => {
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

    const specialMoves = await crew.specialMoves();
    assertEquals(specialMoves, ["Gum-Gum Pistol", "Gum-Gum Bazooka"]);
  });
});
