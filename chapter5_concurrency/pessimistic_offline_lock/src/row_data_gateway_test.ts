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
import { createTables, dropTables, truncateTables } from "./test_helper.ts";

async function insertData() {
  const crew = new Crew(1, "Nami", BigInt(60_000_000), "process1");
  await crew.insert();
}

describe("Crew", () => {
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
      const crew = await Crew.find(1, "process1");
      crew.name = "Usopp";
      await crew.update();

      const updatedCrew = await Crew.find(1, "process1");
      assertEquals(updatedCrew.name, "Usopp");
      assertEquals(updatedCrew.bounty, BigInt(60_000_000));
    });

    it("throws Error by write lock", async () => {
      const crewOnProcess1 = await Crew.find(1, "process1");
      crewOnProcess1.name = "Usopp";

      const crewOnProcess2 = await Crew.find(1, "process2");
      crewOnProcess2.name = "Sanji";

      await crewOnProcess1.aquireWriteLock();

      assertRejects(() => crewOnProcess2.update(), Error, "Record Locked");
    });

    it("updates name without conflict", async () => {
      const crewOnProcess1 = await Crew.find(1, "process1");
      crewOnProcess1.name = "Usopp";

      const crewOnProcess2 = await Crew.find(1, "process2");
      crewOnProcess2.name = "Sanji";

      await crewOnProcess1.aquireWriteLock();
      await crewOnProcess1.update();
      await crewOnProcess1.releaseWriteLock();

      await crewOnProcess2.update();

      // NOTE: If you want to prevent this update, you should use Optimistic Offline Lock in addition
      const updatedCrew = await Crew.find(1, "process2");
      assertEquals(updatedCrew.name, "Sanji");
      assertEquals(updatedCrew.bounty, BigInt(60_000_000));
    });
  });

  describe("find()", () => {
    it("finds the record", async () => {
      const crew = await Crew.find(1, "process1");

      assertEquals(crew.name, "Nami");
      assertEquals(crew.bounty, BigInt(60_000_000));
    });

    it("throws Error by write lock", async () => {
      const crew = await Crew.find(1, "process1");
      await crew.aquireWriteLock();

      assertRejects(() => Crew.find(1, "process2"), Error, "Record Locked");
    });
  });
});
