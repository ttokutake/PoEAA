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

import { Crew } from "./row_data_gateway.ts";
import {
  createCrewsTable,
  dropTable,
  truncateCrewsTable,
} from "./test_helper.ts";

async function insertData() {
  const crew = new Crew(1, "Nami", BigInt(60_000_000), 0);
  await crew.insert();
}

describe("Crew", () => {
  beforeAll(async () => {
    await createCrewsTable();
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

  describe("update()", () => {
    it("updates name", async () => {
      const crew = await Crew.find(1);
      crew.name = "Usopp";
      await crew.update();

      const updatedCrew = await Crew.find(1);
      assertEquals(updatedCrew.name, "Usopp");
      assertEquals(updatedCrew.bounty, BigInt(60_000_000));
    });

    it("throws Error by conflict", async () => {
      const crewOnProcess1 = await Crew.find(1);
      crewOnProcess1.name = "Usopp";

      const crewOnProcess2 = await Crew.find(1);
      crewOnProcess2.name = "Sanji";

      await crewOnProcess1.update();

      assertRejects(() => crewOnProcess2.update(), Error, "Conflict Occurred");
    });
  });

  it("find", async () => {
    const crew = await Crew.find(1);

    assertEquals(crew.name, "Nami");
    assertEquals(crew.bounty, BigInt(60_000_000));
  });
});
