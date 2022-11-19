import {
  afterAll,
  afterEach,
  assertEquals,
  assertRejects,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "../../dev_deps.ts";

import { Crew } from "../../src/architectural_patterns/active_record.ts";
import {
  createCrewsTable,
  dropTable,
  truncateCrewsTable,
} from "../test_helper.ts";

async function insertData() {
  const crew = new Crew("Nami", BigInt(60_000_000));
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

  it("update", async () => {
    const crew = await Crew.find(1);
    crew.name = "Usopp";
    await crew.update();

    const updatedCrew = await Crew.find(1);
    assertEquals(updatedCrew.name, "Usopp");
    assertEquals(updatedCrew.bounty, BigInt(60_000_000));
  });

  it("delete", async () => {
    const crew = await Crew.find(1);
    await crew.delete();

    assertRejects(() => Crew.find(1), Error, "Record Not Found");
  });

  it("find", async () => {
    const crew = await Crew.find(1);

    assertEquals(crew.name, "Nami");
    assertEquals(crew.bounty, BigInt(60_000_000));
  });

  it("isDanger", async () => {
    const crew = await Crew.find(1);
    crew.bounty = BigInt(999_999_999);
    assertEquals(crew.isDanger(), false);

    crew.bounty = BigInt(1_000_000_000);
    assertEquals(crew.isDanger(), true);
  });
});
