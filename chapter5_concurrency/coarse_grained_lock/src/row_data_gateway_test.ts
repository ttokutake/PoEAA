import {
  afterAll,
  afterEach,
  assertEquals,
  assertRejects,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "../dev_deps.ts";

import { Crew, SpecialMove } from "./row_data_gateway.ts";
import { createTables, dropTables, truncateTables } from "./test_helper.ts";

async function insertData() {
  const crew = new Crew(1, "Luffy", BigInt(1_500_000_000), 0);
  await crew.insert();
  const specialMoves = [
    {
      id: 1,
      name: "Gum-Gum Pistol",
    },
    {
      id: 2,
      name: "Gum-Gum Bazooka",
    },
  ];
  for (const { id, name } of specialMoves) {
    const specialMove = new SpecialMove(id, name, crew.id, crew.version);
    await specialMove.insert();
  }
}

describe("SpecialMove", () => {
  beforeAll(async () => {
    await createTables();
  });
  afterAll(async () => {
    await dropTables();
  });

  beforeEach(async () => {
    await insertData();
  });
  afterEach(async () => {
    await truncateTables();
  });

  describe("update()", () => {
    it("updates name", async () => {
      const specialMoves = await SpecialMove.findForCrew(1);
      specialMoves[0].name = "Gum-Gum Bullet";
      await specialMoves[0].update();

      const updatedSpecialMoves = await SpecialMove.findForCrew(1);
      assertEquals(updatedSpecialMoves[0].name, "Gum-Gum Bullet");
    });

    it("throws Error by conflict", async () => {
      const specialMovesOnProcess1 = await SpecialMove.findForCrew(1);
      specialMovesOnProcess1[0].name = "Gum-Gum Bullet";

      const specialMovesOnProcess2 = await SpecialMove.findForCrew(1);
      specialMovesOnProcess2[0].name = "Gum-Gum Balloon";

      await specialMovesOnProcess1[0].update();

      // NOTE: I don't know why I must attach "await"
      await assertRejects(
        () => specialMovesOnProcess2[0].update(),
        Error,
        "Conflict Occurred",
      );
    });
  });

  it("findForCrew", async () => {
    const specialMoves = await SpecialMove.findForCrew(1);

    assertEquals(specialMoves[0].name, "Gum-Gum Pistol");
    assertEquals(specialMoves[1].name, "Gum-Gum Bazooka");
  });
});
