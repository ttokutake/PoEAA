import {
  afterAll,
  afterEach,
  assertEquals,
  assertObjectMatch,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "../../dev_deps.ts";

import { Crew } from "../../src/reading_in_data/find_many_with_join.ts";
import {
  createCrewsTable,
  createSpecialMovesTable,
  dropTable,
  truncateCrewsTable,
} from "../test_helper.ts";

async function insertData() {
  const data = [
    {
      id: 1,
      name: "Luffy",
      bounty: BigInt(1_500_000_000),
      specialMoves: ["Gum-Gum Pistol", "Gum-Gum Bazooka"],
    },
    {
      id: 2,
      name: "Zoro",
      bounty: BigInt(320_000_000),
      specialMoves: ["Oni Giri", "Tora Gari"],
    },
  ];
  for (const { id, name, bounty, specialMoves } of data) {
    const crew = new Crew(name, bounty);
    await crew.insert();
    const insertedCrew = await Crew.find(id);
    for (const specialMove of specialMoves) {
      await insertedCrew.addSpecialMove(specialMove);
    }
  }
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

  it("findMany", async () => {
    const crews = await Crew.findMany([1, 2]);

    assertObjectMatch(crews[0], {
      name: "Luffy",
      bounty: BigInt(1_500_000_000),
    });
    assertEquals(crews[0].specialMoves, [
      "Gum-Gum Pistol",
      "Gum-Gum Bazooka",
    ]);
    assertObjectMatch(crews[1], {
      name: "Zoro",
      bounty: BigInt(320_000_000),
    });
    assertEquals(crews[1].specialMoves, ["Oni Giri", "Tora Gari"]);
  });
});
