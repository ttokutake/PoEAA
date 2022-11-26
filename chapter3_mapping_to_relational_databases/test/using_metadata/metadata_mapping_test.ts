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
} from "../../src/using_metadata/metadata_mapping.ts";
import {
  createCrewsTable,
  createSpecialMovesTable,
  dropTable,
  truncateCrewsTable,
} from "../test_helper.ts";

async function insertData() {
  const crew = new Crew("Luffy", BigInt(1_500_000_000));
  await crew.insert();

  const specialMove = new SpecialMove("Gum-Gum Pistol", 1);
  await specialMove.insert();
}

describe("BaseModel", () => {
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

  it("find", async () => {
    const crew = await Crew.find(1);

    assertEquals(crew.name, "Luffy");
    assertEquals(crew.bounty, BigInt(1_500_000_000));

    const specialMove = await SpecialMove.find(1);

    assertEquals(specialMove.name, "Gum-Gum Pistol");
  });
});
