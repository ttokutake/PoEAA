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
import {
  createCrewsTable,
  createSpecialMovesTable,
  dropTable,
  truncateCrewsTable,
} from "../test_helper.ts";

async function insertData() {
  const crew = new Crew(1, "Luffy", BigInt(1_500_000_000));
  await crew.insert();
  await crew.addSpecialMove("Gum-Gum Pistol");
  await crew.addSpecialMove("Gum-Gum Bazooka");
}

describe("Crew", () => {
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

  it("specialMoves", async () => {
    const crew = await Crew.find(1);

    assertEquals(crew.specialMoves, ["Gum-Gum Pistol", "Gum-Gum Bazooka"]);
  });
});
