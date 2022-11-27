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
  SpecialMove,
} from "../../src/mapping_relationships/foreign_key_mapping.ts";
import {
  createCrewsTable,
  createSpecialMovesTable,
  dropTable,
  truncateCrewsTable,
} from "../test_helper.ts";

async function insertData() {
  const crew = new Crew(1, "Luffy", BigInt(1_500_000_000));
  await crew.insert();
  const specialMove1 = new SpecialMove("Gum-Gum Pistol", 1);
  await specialMove1.insert();
  const specialMove2 = new SpecialMove("Gum-Gum Bazooka", 1);
  await specialMove2.insert();
}

describe("SpecialMove", () => {
  beforeAll(async () => {
    await createCrewsTable();
    await createSpecialMovesTable();
  });
  afterAll(async () => {
    await dropTable();
  });

  beforeEach(async () => {
    await insertData();
  });
  afterEach(async () => {
    await truncateCrewsTable();
  });

  it("findForCrew", async () => {
    const specialMoves = await SpecialMove.findForCrew(1);

    assertEquals(specialMoves[0].name, "Gum-Gum Pistol");
    assertEquals(specialMoves[1].name, "Gum-Gum Bazooka");
  });
});
