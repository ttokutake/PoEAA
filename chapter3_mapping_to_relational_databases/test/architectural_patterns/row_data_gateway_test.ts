import {
  assertEquals,
  assertRejects,
} from "https://deno.land/std@0.160.0/testing/asserts.ts";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "../../dev_deps.ts";

import { CrewGateway } from "../../src/architectural_patterns/row_data_gateway.ts";
import { createTable, dropTable, truncateTable } from "../test_helper.ts";

async function insertData() {
  const data = new CrewGateway("Nami", BigInt(60_000_000));
  await data.insert();
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

  it("update", async () => {
    const data = await CrewGateway.find(1);
    data.name = "Usopp";
    await data.update();

    const updatedData = await CrewGateway.find(1);
    assertEquals(updatedData.name, "Usopp");
    assertEquals(updatedData.bounty, BigInt(60_000_000));
  });

  it("delete", async () => {
    const data = await CrewGateway.find(1);
    await data.delete();

    assertRejects(() => CrewGateway.find(1), Error, "Record Not Found");
  });

  it("find", async () => {
    const data = await CrewGateway.find(1);

    assertEquals(data.name, "Nami");
    assertEquals(data.bounty, BigInt(60_000_000));
  });
});
