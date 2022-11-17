import { assertEquals } from "https://deno.land/std@0.160.0/testing/asserts.ts";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "../dev_deps.ts";

import { CrewGateway } from "../src/table_data_gateway.ts";
import { createTable, dropTable, truncateTable } from "./test_helper.ts";

async function insertData() {
  const crewGateway = new CrewGateway();
  await crewGateway.insert("Nami", BigInt(60_000_000));
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
    const crewGateway = new CrewGateway();
    await crewGateway.update(1, "Usopp", BigInt(200_000_000));

    const [row] = await crewGateway.find(1);
    assertEquals(row.name, "Usopp");
    assertEquals(row.bounty, BigInt(200_000_000));
  });

  it("delete", async () => {
    const crewGateway = new CrewGateway();
    await crewGateway.delete(1);

    const recordSet = await crewGateway.find(1);
    assertEquals(recordSet, []);
  });

  it("find", async () => {
    const crewGateway = new CrewGateway();
    const [row] = await crewGateway.find(1);

    assertEquals(row.name, "Nami");
    assertEquals(row.bounty, BigInt(60_000_000));
  });
});
